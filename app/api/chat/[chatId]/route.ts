import { Readable } from 'stream';
import { NextResponse } from "next/server";
import { StreamingTextResponse, LangChainStream } from "ai";
import { currentUser } from "@clerk/nextjs";
import { CallbackManager } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";
import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import prismaDb from "@/lib/prismadb";

export const POST = async (req: Request, { params } : {params: {chatId: string}}) => {
	try{
		const {prompt} = await req.json();
		const user = await currentUser();

		if(!user || !user.username || !user.id ) {
			return new NextResponse("Unauthorized", { status: 401 })
		}
		const identifier: string = req.url + "-" + user.id;
		const {success} = await rateLimit(identifier);
		if(!success) {
			return new NextResponse('Rate limit exceeded', { status: 429 })
		}
		const companion = await prismaDb.companion.update({
			where: {
				id: params.chatId,
			},
			data: {
				messages: {
					create: {
						content: prompt,
						role: "user",
						userId: user.id
					}
				}
			}
		});
		if(!companion) {
			return new NextResponse("Companion Not Found", { status: 404 })
		}
		const name = companion.id;
		const companion_file_name = name + ".txt";
		const companionKey = {
			companionName: name,
			userId: user.id,
			modelName: "llama2-13b"
		};
		const memoryManager = await MemoryManager.getInstance();
		const records: string = await memoryManager.readLatestHistory(companionKey);
		if(records.length === 0) {
			await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey)
		}

		await memoryManager.writeHistory("User: " + prompt + "\n", companionKey);
		const recentChatHistory = await memoryManager.readLatestHistory(companionKey );
		const similarDocs = await memoryManager.vectorSearch(
			recentChatHistory,
			companion_file_name
		);
		let relevantHistory = "";
		if(!!similarDocs && similarDocs.length !== 0) {
			relevantHistory = similarDocs.map((doc)=> doc.pageContent).join("\n")
		}
		const { handlers } = LangChainStream();
		const model = new Replicate({
			model: "replicate/llama-2-70b-chat:2796ee9483c3fd7aa2e171d38f4ca12251a30609463dcfd4cd76703f22e96cdf",
			input: {
				max_length: 2048
			},
			apiKey: process.env.REPLICATE_API_KEY,
			callbackManager: CallbackManager.fromHandlers(handlers)
		})
		model.verbose = true;

		const response: string = String(await model.call(`
			ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name} : prefix.
			
			${companion.instructions} 
			
			Below are relevant details about ${companion.name}'s past and the conversation you are in. 
			${relevantHistory}
			
			${recentChatHistory}\n${companion.name}
		`)
			.catch(console.error)
		);

		const cleaned = response.replaceAll(",","");
		console.log("CLEANED", cleaned)
		const chunks = cleaned.split("\n");
		console.log("CHUNKS ",chunks);
		const resp = chunks[0];
		console.log("RESPONSE ", resp)

			await memoryManager.writeHistory("" + resp.trim(), companionKey);


		let s: Readable = new Readable();
		s.push(resp);
		s.push(null)

		if(resp !== 'undefined' && resp.length > 1) {
			await memoryManager.writeHistory("" + resp.trim(), companionKey)
			await prismaDb.companion.update({
				where: {
					id: params.chatId
				},
				data: {
					messages: {
						create: {
							content: resp.trim(),
							role: "system",
							userId: user.id,
						}
					}
				}
			})
		}

		return new StreamingTextResponse(s as any);
	} catch (e) {
		if (e instanceof Error) {
			console.log(e.message, '[CHAT_ID_POST]')
		}
		return new NextResponse("Internal Error", { status: 500 })
	}
}

import { Redis } from '@upstash/redis';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type CompanionKey = {
	companionName: string;
	modelName: string;
	userId: string;
}

export class MemoryManager {
	private static instance: MemoryManager;
	private history: Redis;
	private readonly vectorDbClient: PineconeClient;
	public constructor() {
		this.history = Redis.fromEnv();
		this.vectorDbClient = new PineconeClient();
	}
	public async init() {
		await this.vectorDbClient.init({
			environment: process.env.PINECONE_ENV!,
			apiKey: process.env.PINECONE_API_KEY!
		})
	}

	public async vectorSearch(recentChatHistory: string, companionFileName: string){
		const pineconeClient = <PineconeClient>this.vectorDbClient;
		const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX! || "");

		const vectorStore = await PineconeStore.fromExistingIndex(
			new OpenAIEmbeddings({openAIApiKey: process.env.OPEN_AI_API_KEY}),
			{pineconeIndex}
		)

		const similarDocs = await vectorStore
			.similaritySearch(recentChatHistory, 3, {fileName: companionFileName})
			.catch((error) => {
				console.error(error, " Failed to get vector search result");
			})
		console.log(similarDocs, 'SIMILAR DOCS');
		return similarDocs;
	}

	public static async getInstance(): Promise<MemoryManager> {
		if(!MemoryManager.instance){
			MemoryManager.instance = new MemoryManager();
			await MemoryManager.instance.init();
		}
		return MemoryManager.instance;
	}

	private generateRedisCompanionKey (companionKey: CompanionKey): string {
		return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`
	}

	public async writeHistory (text: string, companionKey: CompanionKey){
		if(!companionKey || typeof companionKey.userId == "undefined") {
			console.log("companion key set incorrectly")
			return "";
		}
		const key: string = this.generateRedisCompanionKey(companionKey);
		const result = await this.history.zadd(key, {
			score: Date.now(),
			member: text
		});
		console.log(result, 'WRITE HISTORY RESULT');
		return result;
	}

	public async readLatestHistory(companionKey: CompanionKey): Promise<string>{
		if(!companionKey || typeof companionKey.userId == 'undefined'){
			console.log("companion key set incorrectly")
			return "";
		}
		const key = this.generateRedisCompanionKey(companionKey);
		let result = await this.history.zrange(key, 0, Date.now(), {
			byScore: true,
		})
		result = result.slice(-30).reverse();
		const recentChats: string = result.reverse().join("\n");
		console.log(recentChats, "READ LATEST HISTORY");
		return recentChats;
	}

	public async seedChatHistory(seedContent: String, delimiter: string = '\n', companionKey: CompanionKey ) {
		const key: string = this.generateRedisCompanionKey(companionKey);
		if(await this.history.exists(key)){
			console.log("user already have chat history")
			return;
		}
		const content = seedContent.split(delimiter);
		let counter: number = 0;

		for(const line of content) {
			await this.history.zadd(key, {score: counter, member: line });
			counter +=1;
		}
	}
}

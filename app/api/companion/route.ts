import {NextResponse} from "next/server";
import {currentUser} from "@clerk/nextjs";
import prismaDb from "@/lib/prismadb";
import {checkSubscription} from "@/lib/subscription";

export const POST = async (req: Request):Promise<any> => {
	try {
		const {src,name,description,instructions,seed,categoryId} = await req.json();
		const user = await currentUser();
		if(!user || !user.id || !user.username) {
			return new NextResponse('Unauthorized', {status: 401});
		}
		if(!src || !name || !description || !instructions || !seed || !categoryId) {
			new NextResponse("Missing Required Fields", { status: 400 });
		}

		const isPro = await checkSubscription();
		if(!isPro) {
			return new NextResponse('Pro Subscription is Required', { status: 403 })
		}

		const companion = await prismaDb.companion.create({
			data: {
				categoryId,
				userId: user.id,
				userName: user.username,
				src,
				seed,
				description,
				instructions,
				name
			}
		});
		return NextResponse.json(companion);
	} catch (e) {
		if(e instanceof Error) console.error(e.message, '[COMPANION_POST]')
		return new NextResponse("Internal Error", {status: 500})
	}
}

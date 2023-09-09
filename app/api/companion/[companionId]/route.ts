import {auth, currentUser} from "@clerk/nextjs";
import {NextResponse} from "next/server";
import prismaDb from "@/lib/prismadb";
import {checkSubscription} from "@/lib/subscription";
interface ParamsProps {
	params: {
		companionId: string
	}
}

export const PATCH = async (req: Request, {params}:ParamsProps) => {
	try{
		const {companionId} = params;
		if(!companionId){
			return new NextResponse('Companion Id is Required', { status: 400 })
		}
		const user = await currentUser();
		if(!user || !user.id || !user.username) {
			return new NextResponse('Unauthorized', {status: 401});
		}
		const {src,name,description,instructions,seed,categoryId} = await req.json();
		if(!src || !name || !description || !instructions || !seed || !categoryId) {
			new NextResponse("Missing Required Fields", { status: 400 });
		}

		const isPro = await checkSubscription();
		if(!isPro) {
			return new NextResponse('Pro Subscription is Required', { status: 403 })
		}

		const companion = await prismaDb.companion.update({
			where: {id: companionId, userId: user.id},
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
		if(e instanceof Error) console.error(e.message, '[COMPANION_PATCH]')
		return new NextResponse("Internal Error", {status: 500})
	}
}

export const DELETE = async (req: Request, {params}: ParamsProps) => {
	try {
		const {userId} = auth();
		if(!userId){
			return new NextResponse('Unauthorized', {status: 401});
		}
		const companion = await prismaDb.companion.delete({
			where: {
				userId,
				id: params.companionId
			}
		});
		return NextResponse.json(companion);
	} catch (e) {
		if(e instanceof Error) console.error(e.message, '[COMPANION_DELETE]')
		return new NextResponse("Internal Error", {status: 500})
	}
}

import Stripe from 'stripe';
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prismaDb from "@/lib/prismadb";
import { stripe } from '@/lib/stripe';

export const POST = async (req: Request) => {
	const body: string = await req.text();
	const signature: string = headers().get('Stripe-signature') as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET_KEY!
		)
	} catch (e: any) {
		if(e instanceof Error) {
			console.log(e.message, '[WEBHOOK_ROUTE]');
			return new NextResponse(e.message!, {status: 400})
		}
	}
	const session = event!.data.object as Stripe.Checkout.Session;
	if(event!.type === 'checkout.session.completed') {
		const subscription = await stripe.subscriptions.retrieve(
			session.subscription as string
		)

		if(!session?.metadata?.userId){
			return new NextResponse('USER_ID IS REQUIRED', {status : 400})
		}
		await prismaDb.userSubscription.create({
			data: {
				userId: session?.metadata?.userId,
				stripeSubscriptionId: subscription.id,
				stripeCustomerId: subscription.customer as string,
				stripePriceId: subscription.items.data[0].id,
				stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
			}
		})
	}
	if(event!.type === "invoice.payment_succeeded") {
		const subscription = await stripe.subscriptions.retrieve(
			session.subscription as string
		)
		await prismaDb.userSubscription.update({
			where: {
				stripeSubscriptionId: subscription.id,
			},
			data: {
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
			}
		})

	}

	return new NextResponse(null, { status: 200 })
}

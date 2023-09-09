import {auth} from "@clerk/nextjs";
import prismaDb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_00;

export const checkSubscription = async (): Promise<boolean> => {
	const { userId } = auth();
	if(!userId) {
		return false;
	}

	const userSubscription = await prismaDb.userSubscription.findUnique({
		where: {
			userId
		},
		select: {
			stripeSubscriptionId: true,
			stripeCustomerId: true,
			stripePriceId: true,
			stripeCurrentPeriodEnd: true
		}
	});
	if(!userSubscription) {
		return false
	}

	const isValid =
		userSubscription.stripePriceId &&
		userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

	return !!isValid;
}

'use client';
import React, {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Sparkles} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";
import axios from "axios";
interface SubscriptionButtonProps {
	isPro: boolean
}
const SubscriptionButton = ({isPro = false}: SubscriptionButtonProps) => {
	const [isLoading,setIsLoading] = useState(false);
	const {toast} = useToast();
	const onClick = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get('/api/stripe');
			window.location.href = response.data.url;
		}catch (e) {
			if(e instanceof Error) toast({ variant: 'destructive', description: e.message, title: 'Something went wrong'});
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<Button size="sm" variant={isPro ? "default": "premium"} disabled={isLoading} onClick={onClick}>
			{isPro ? "Manage Subscription": "Upgrade"}
			{!isPro && (<Sparkles className="h-4 w-4 ml-2 fill-white"/>)}
		</Button>
	);
};

export default SubscriptionButton;

'use client';
import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useProModal} from "@/hooks/use-pro-modal";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import axios from "axios";

const ProModal = () => {
	const proModal = useProModal();
	const {toast} = useToast();
	const [loading, setLoading] = useState<boolean>(false);
	const [isMount, setIsMount] = useState(false);

	useEffect(() => {
		setIsMount(true);
	}, []);
	if(!isMount) {
		return null;
	}
	const onSubscribe = async () => {
		try {
			setLoading(true);
			const response = await axios.get('/api/stripe');
			window.location.href = response.data.url;
		} catch (e) {
			if(e instanceof Error) toast({variant: 'destructive', description: e.message})
		} finally {
			setLoading(false);
		}
	}
	return (
		<Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
			<DialogContent>
				<DialogHeader className="space-y-4">
					<DialogTitle className="text-center">
						Upgrade to Pro
					</DialogTitle>
					<DialogDescription className="text-center space-y-2">
						Create <span className="text-sky-500 font-medium">Custom AI</span> Companions!
					</DialogDescription>
				</DialogHeader>
				<Separator/>
				<div className="flex justify-between">
					<p className="font-medium text-2xl">
						$9
						<span className="text-sm font-normal">
							.99 / mo
						</span>
					</p>
					<Button variant="premium" onClick={onSubscribe} disabled={loading}>
						Subscribe
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ProModal;

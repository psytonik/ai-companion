'use client';
import React from 'react';
import {useToast} from "@/components/ui/use-toast";
import {useTheme} from "next-themes";
import {cn} from "@/lib/utils";
import BotAvatar from "@/components/bot-avatar";
import { BeatLoader } from 'react-spinners';
import UserAvatar from "@/components/user-avatar";
import {Button} from "@/components/ui/button";
import {Copy} from "lucide-react";
export interface ChatMessageProps {
	role: "system" | "user";
	content?: string;
	isLoading?: boolean;
	src?: string;
}

const ChatMessage = ({role, content,src, isLoading}:ChatMessageProps) => {
	const {toast} = useToast();
	const { theme } = useTheme();

	const onCopy = async() =>{
		if(!content) {
			return;
		}
		await navigator.clipboard.writeText(content);
		toast({
			description: "Message copied to clipboard"
		})
	}
	return (
		<div className={cn(`group flex items-start gap-x-3 py-4 w-full`, role === 'user' && 'justify-end')}>
			{role === 'system' && src && (<BotAvatar src={src}/>)}
			<div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
				{isLoading ? (<BeatLoader color={theme === "light" ? "black": "white" } size={5} />): content}
			</div>
			{role === 'user' && (<UserAvatar/>)}
			{role !== 'user' && !isLoading && (
				<Button onClick={onCopy} variant="ghost" className="opacity-0 group-hover:opacity-100 transition" size="icon">
					<Copy className="w-4 h-4"/>
				</Button>)}
		</div>
	);
};

export default ChatMessage;

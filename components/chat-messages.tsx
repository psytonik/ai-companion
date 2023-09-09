'use client';
import React, {ElementRef, useEffect, useRef, useState} from 'react';
import {Companion} from ".prisma/client";
import ChatMessage, {ChatMessageProps} from "@/components/chat-message";
interface ChatMessagesProps {
	companion: Companion;
	messages: ChatMessageProps[],
	isLoading: boolean
}
const ChatMessages = ({companion, messages = [], isLoading}: ChatMessagesProps) => {
	const scrollRef = useRef<ElementRef<"div">>(null)
	const [fakeLoading, setFakeLoading] = useState(messages.length === 0);
	useEffect(() => {
		const timeout: NodeJS.Timeout = setTimeout(()=>{
			setFakeLoading(false)
		}, 1000)

		return (): void => {
			clearTimeout(timeout);
		}
	}, []);
	useEffect(() => {
		scrollRef?.current?.scrollIntoView({behavior:'smooth'})
	}, [messages.length]);
	return (
		<div className="flex-1 overflow-y-auto pr-4">
			<ChatMessage
				role="system"
				isLoading={fakeLoading}
				src={companion.src}
				content={`Hello I am ${companion.name}, ${companion.description }`}
			/>
			{messages.map((message)=>(
				<ChatMessage
					role={message.role}
					src={companion.src}
					content={message.content}
					key={message.content}
				/>
			))}
			{isLoading && (
				<ChatMessage
					role="system"
					src={companion.src}
					isLoading
				/>
			)}
			<div ref={scrollRef} />
		</div>
	);
};

export default ChatMessages;

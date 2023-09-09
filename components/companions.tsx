'use client';
import React, {FC} from 'react';
import {Companion} from ".prisma/client";
import Image from "next/image";
import {
	Card,
	CardFooter,
	CardHeader
} from "@/components/ui/card"
import Link from "next/link";
import {MessageSquare} from "lucide-react";


interface CompanionsProps {
	data: Companion[]
}
const Companions: FC<CompanionsProps> = ({data}) => {
	if(data.length === 0) {
		return <div className="pt-10 flex flex-col items-center justify-center space-y-3">
			<div className="relative w-60 h-60">
				<Image src="/empty.png" alt="Empty" className="grayscale" fill priority sizes={"240"}/>
			</div>
			<p className="text-sm text-muted-foreground">No companions found</p>
		</div>
	}
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
			{data && data.map((item) => (
				<Card key={item.id} className="bg-primary/10 rounded-b-xl cursor-pointer hover:opacity-75 transition border-0">
					<Link href={`/chat/${item.id}`}>
						<CardHeader className="flex items-center justify-center text-center text-muted-foreground">
							<div className="relative w-32 h-32">
								<Image src={item.src} alt={item.name} fill className="rounded-xl object-cover" priority sizes="128x128"/>
							</div>
							<p className="font-bold">{item.name}</p>
							<p className="text-xs">{item.description}</p>
						</CardHeader>
						<CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
							<p className="lowercase">@{item.userName}</p>
							<div className="flex items-center">
								<MessageSquare className="w-3 h-3 mr-1"/>
							</div>
						</CardFooter>
					</Link>
				</Card>
			))}
		</div>
	);
};

export default Companions;

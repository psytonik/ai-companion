'use client';
import React from 'react';
import { Home, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import {useProModal} from "@/hooks/use-pro-modal";
interface SidebarProps {
    isPro: boolean
}
const Sidebar = ({isPro}: SidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const proModal = useProModal();
    const routes = [
        {
            icon: Home,
            href: '/',
            label: 'Home',
            pro: false,
        },
        {
            icon: Plus,
            href: '/companion/new',
            label: 'Create',
            pro: true,
        },
        {
            icon: Settings,
            href: '/settings',
            label: 'Settings',
            pro: false,
        },
    ];
    const onNavigate = (url: string, pro: boolean) => {
        if(pro && !isPro) {
            return proModal.onOpen()
        }
        router.push(url);
    };
    return (
        <div className='flex h-full flex-col space-x-4 bg-secondary text-primary'>
            <div className='flex flex-1 justify-center p-3'>
                <div className='space-y-2'>
                    {routes.map((route) => (
                        <div
                            onClick={() => onNavigate(route.href, route.pro)}
                            key={route.label}
                            className={cn(
                                'group flex w-full justify-start p-3 text-xs font-medium text-muted-foreground ' +
                                    'cursor-pointer rounded-lg transition hover:bg-primary/10 hover:text-primary',
                                pathname === route.href &&
                                    'bg-primary/10 text-primary'
                            )}
                        >
                            <div className='flex flex-1 flex-col items-center gap-y-2'>
                                <route.icon className='h-5 w-5 ' />
                                {route.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

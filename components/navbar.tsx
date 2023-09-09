'use client';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { UserButton } from '@clerk/nextjs';
import { NextFont } from 'next/dist/compiled/@next/font';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import MobileSidebar from '@/components/mobile-sidebar';
import {useProModal} from "@/hooks/use-pro-modal";

const font: NextFont = Poppins({
    weight: '600',
    subsets: ['latin'],
});
interface NavbarProps {
    isPro: boolean
}
const Navbar = ({isPro}:NavbarProps) => {
    const proModal = useProModal();
    return (
        <nav className='fixed z-50 flex h-16 w-full items-center justify-between border-b border-primary/10 bg-secondary px-4 py-2'>
            <div className='flex items-center'>
                <MobileSidebar isPro={isPro} />
                <Link href='/'>
                    <h1
                        className={cn(
                            'hidden text-xl font-bold text-primary md:block md:text-3xl',
                            font.className
                        )}
                    >
                        companion.ai
                    </h1>
                </Link>
            </div>
            <div className='flex items-center gap-x-3'>
                {!isPro && (<Button size='sm' variant='premium' onClick={proModal.onOpen}>
                    Upgrade
                    <Sparkles className='ml-2 h-4 w-4 fill-white text-white' />
                </Button>)}

                <ModeToggle />

                <UserButton afterSignOutUrl='/' />
            </div>
        </nav>
    );
};

export default Navbar;

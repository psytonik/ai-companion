import React from 'react';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '@/components/sidebar';

const MobileSidebar = ({isPro}:{isPro: boolean}) => {
    return (
        <Sheet>
            <SheetTrigger className='pr-4 md:hidden'>
                <MenuIcon />
            </SheetTrigger>
            <SheetContent side='left' className='w-32 bg-secondary p-0 pt-10'>
                <Sidebar  isPro={isPro}/>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar;

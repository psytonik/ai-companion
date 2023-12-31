import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FC, ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import ProModal from "@/components/pro-modal";

const inter = Inter({ subsets: ['latin'], preload: true });

export const metadata: Metadata = {
    title: 'Cool AI Companion',
    description: 'Generated by create next app',
};
interface RootLayoutProps {
    children: ReactNode;
}
const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    return (
        <ClerkProvider>
            <html lang='en' suppressHydrationWarning>
                <body className={cn('bg-secondary', inter.className)}>
                    <ThemeProvider
                        enableSystem
                        defaultTheme='system'
                        attribute='class'
                    >
                        <ProModal/>
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
};
export default RootLayout;

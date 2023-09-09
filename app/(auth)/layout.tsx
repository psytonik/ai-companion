import React, { FC, ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}
const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className='flex h-full items-center justify-center'>
            {children}
        </div>
    );
};

export default AuthLayout;

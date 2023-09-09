'use client';
import { FC, useEffect, useState } from 'react';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';

interface ImageUploadProps {
    value: string;
    onChange: (src: string) => void;
    disabled?: boolean;
}
const ImageUpload: FC<ImageUploadProps> = ({ value, onChange, disabled }) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null;
    }

    return (
        <div className='flex w-full flex-col items-center justify-center space-y-4'>
            <CldUploadButton
                className=''
                options={{ maxFiles: 1 }}
                uploadPreset='companionAi'
                onUpload={(result: any) => onChange(result.info.secure_url)}
            >
                <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border-4 border-dashed border-primary/10 p-4 transition hover:opacity-75'>
                    <div className='relative h-40 w-40'>
                        <Image
                            src={value || '/placeholder.svg'}
                            alt='Upload'
                            fill
                            priority
                            className='rounded-lg object-cover'
                        />
                    </div>
                </div>
            </CldUploadButton>
        </div>
    );
};

export default ImageUpload;

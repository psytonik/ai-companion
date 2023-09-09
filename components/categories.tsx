'use client';
import { FC } from 'react';
import { Category } from '.prisma/client';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

interface CategoriesProps {
    categories: Category[];
}
const Categories: FC<CategoriesProps> = ({ categories }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');
    const onClick = (id: string | undefined) => {
        const query = { categoryId: id };
        const url = qs.stringifyUrl(
            {
                url: window.location.href,
                query,
            },
            { skipNull: true }
        );
        router.push(url);
    };
    return (
        <div className='flex w-full space-x-2 overflow-x-auto p-1'>
            <button
                onClick={() => onClick(undefined)}
                className={cn(
                    `
				flex 
				items-center 
				rounded-md 
				bg-primary/10 
				px-2 
				py-2 
				text-center 
				text-xs 
				transition 
				hover:opacity-75 
				md:px-4 
				md:py-3
				md:text-sm`,
                    !categoryId ? 'bg-primary/25' : 'bg-primary/10'
                )}
            >
                Newest
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onClick(category.id)}
                    className={cn(
                        `
				flex 
				items-center 
				rounded-md 
				bg-primary/10 
				px-2 
				py-2 
				text-center 
				text-xs 
				transition 
				hover:opacity-75 
				md:px-4 
				md:py-3
				md:text-sm`,
                        category.id === categoryId
                            ? 'bg-primary/25'
                            : 'bg-primary/10'
                    )}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default Categories;

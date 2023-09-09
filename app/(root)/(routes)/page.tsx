import SearchInput from '@/components/search-input';
import prismaDb from '@/lib/prismadb';
import { Category } from '.prisma/client';
import Categories from '@/components/categories';
import {FC} from "react";
import Companions from "@/components/companions";

interface RootPageProps {
    searchParams: {
        categoryId: string;
        name: string
    }
}
const RootPage: FC<RootPageProps> = async ({searchParams}) => {
    const categories: Category[] = await prismaDb.category.findMany();

    const data = await prismaDb.companion.findMany({
        where: {
            categoryId: searchParams.categoryId,
            name: {
                search: searchParams.name
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: {
                    messages: true,
                }
            }
        },
    });

    return (
        <div className='h-full space-y-2 p-4'>
            <SearchInput />
            <Categories categories={categories} />
            <Companions data={data}/>
        </div>
    );
};
export default RootPage;

'use client';
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import qs from 'query-string';
const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');
    const name = searchParams.get('name');
    const [value, setValue] = useState(name || '');
    const debounceValue: string = useDebounce<string>(value, 500);

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        const query = {
            name: debounceValue,
            categoryId: categoryId,
        };
        const url = qs.stringifyUrl(
            {
                url: window.location.href,
                query,
            },
            { skipEmptyString: true, skipNull: true }
        );
        router.push(url);
    }, [debounceValue, router, categoryId]);
    return (
        <div className='relative'>
            <Search className='absolute left-4 top-3 h-4 w-4 text-muted-foreground' />
            <Input
                onChange={onChange}
                value={value}
                placeholder='search...'
                className='bg-primary/10 pl-10'
            />
        </div>
    );
};

export default SearchInput;

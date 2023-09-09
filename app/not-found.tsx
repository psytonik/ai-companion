import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NotFound = () => {
    return (
        <div className='flex h-full items-center justify-center'>
            <h2 className='font-bold'>Not Found </h2>
            <p className='mx-3'>Could not find requested resource</p>
            <Link href='/'>
                <Button>Return Home</Button>
            </Link>
        </div>
    );
};
export default NotFound;

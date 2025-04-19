import Link from 'next/link';
import { Button } from './ui/button';

export const Header = () => {
    return (
        <div className="mt-8 mb-12">
            <div className="max-w-5xl mx-auto px-5 flex justify-between items-center gap-4">
                <div className="font-bold">
                    <Link href="/">Expense App</Link>
                </div>
                <div >
                <Link href="/login" className='m-2'>
                    <Button>Sign In</Button>
                </Link>
                <Link href="/register">
                    <Button>Sign Up</Button>
                </Link> 
                </div>
            </div>
        </div>
    );
};

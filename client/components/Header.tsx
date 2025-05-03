import Link from 'next/link';
import { Button } from './ui/button';
import { logout } from '@/utils/logoutHandler';
import { CreateExpenseButton } from './createExpenseButton';

import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { setUser, clearUser } from '../utils/store/userSlice';
import { useEffect } from 'react';

export const Header = () => {
    const user = useAppSelector((state) => state.user.user);
    console.log("user", user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            dispatch(setUser(JSON.parse(storedUser)));
        }
    }, [dispatch]);

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("user");
        dispatch(clearUser());
    };

    return (
        <div className="mt-8 mb-12">
            <div className="max-w-5xl mx-auto px-5 flex justify-between items-center gap-4">
                <div className="font-bold">
                    <Link href="/">Expense App</Link>
                </div>                
                {user ? 
                (<div className='flex gap-4'>
                    <CreateExpenseButton />
                    <div className='flex items-center'>
                    <Button onClick={handleLogout}>Log Out</Button>
                    </div>
                </div>):
                (<div>
                    <Link href="/login" className='m-2'>
                        <Button>Log In</Button>
                    </Link>
                    <Link href="/register">
                        <Button>Sign Up</Button>
                    </Link>
                </div>)
 
                }
            </div>
        </div>
    );
};

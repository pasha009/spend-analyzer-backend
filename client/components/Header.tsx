import Link from 'next/link'
import { Button } from './ui/button';

const Header = () =>{
    return(
        <header className='mt-8 mb-12'
        >
            <div className='max-w-5xl mx-auto px-5 flex justify-between items-center gap-4'>
                <div className='font-bold'>
                    <Link href="/">Expense App</Link>
                </div>

                <Button>
                    <Link href="/login">
                        Sign In
                    </Link>
                </Button>
            </div>
        </header>
    )
}
export default Header;

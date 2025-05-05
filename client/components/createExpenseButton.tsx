import Link from 'next/link';
import { Button } from './ui/button';

export const CreateExpenseButton = () => {
    return (
        <div className="px-5 flex justify-between items-center gap-4">
            <Link href="/createExpense" className='m-2'>
                <Button>Create Expense</Button>
            </Link>
        </div>
    );
}
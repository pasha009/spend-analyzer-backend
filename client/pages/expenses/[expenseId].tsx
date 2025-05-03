import { notFound } from "next/navigation";
import {authorize} from "@/utils/Authorize";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { setUser, clearUser } from '@/utils/store/userSlice';
import { useRouter } from "next/navigation";

interface Transaction {
    _id: string;
    userId: string;
    title: string;
    amount: number;
    category: string;
    subcategory: string;
    description: string;
    updatedAt: string;
  }

export default function ExpensePage({expenseId} : {expenseId: string}) {
    // const local = params;
    const router = useRouter();  
    const dispatch = useAppDispatch();
    if(!expenseId){
        console.log("Invalid Invoice ID");
        throw new Error(`Invalid Invoice ID : ${expenseId}`);
    }

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    
  const fetchData = async () => {
      const authRes = await authorize();
      console.log(authRes.authReq);
      console.log(authRes.code);
      if(authRes.code===0){
        localStorage.removeItem("user");
        dispatch(clearUser());
        router.push('/login');
      }
      else if(authRes.code===1){
        console.log("Access token present");
        const response = await fetch(`http://localhost:3123/expenses/${expenseId}`, {
            headers: authRes.authReq.headers
        });
        console.log("Response:", response);
        if (!response.ok) {
            localStorage.removeItem("accessToken");
            router.push(`/expenses/${expenseId}`);
        }
        else{
            console.log("Response:", response.json()
            .then((data) => {
            console.log("Fetch Data:", data.data);
              setTransactions([data.data]);
        }));
        }
        console.log("Data pulled in");        
      }
    }

    useEffect(() => {
    fetchData();
    }, []);

    if (transactions === null) {
    return <div>Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6 my-12 px-6">
            {transactions.map((transaction) => (
            <div key={transaction._id}>
                <h1 className="text-xl font-semibold">Expense Details</h1>
                    <h2>Title: {transaction.title}</h2>
                    <p>Amount: {transaction.amount}</p>
                    <p>Category: {transaction.category}</p>
                    <p>Subcategory: {transaction.subcategory}</p>
                    <p>Description: {transaction.description}</p>
                    <p>Updated At: {new Date(transaction.updatedAt).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
}

// Fetch data on the server side
export async function getServerSideProps(context: any) {
    const { expenseId } = context.params;

    if (!expenseId) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            expenseId,
        },
    };
}
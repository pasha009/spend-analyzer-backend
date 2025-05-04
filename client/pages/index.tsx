import React, { useEffect, useState } from "react";
import axios from "axios";
import {authorize} from "@/utils/Authorize";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { setUser, clearUser } from '../utils/store/userSlice';
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

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

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ expenses: 0});

  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();  
  const dispatch = useAppDispatch();

  const calculateSummary = (data: Transaction[]) => {
    const expenses = data
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
    setSummary({expenses});
  };

  let sum = 0;

  //todo : fix line chart to show expenses with increasing time
  const sumTransactions : Array<number > = [];
  transactions.forEach((t: Transaction) => {
    sum += t.amount;
    sumTransactions.push(sum);
  });

  const lineData = {
    labels: transactions.map((t: Transaction) => t.updatedAt),
    datasets: [
      {
        label: 'Expenses Over Time',
        data: transactions.map((t) => t.amount),
        borderColor: 'rgb(184, 129, 17)',
        fill: false,
      },
      {
        label: 'Total Expenditure Over Time',
        data: sumTransactions.map((t) => t),
        borderColor: 'rgb(5, 111, 63)',
        fill: false,
      },
    ],
  };

  const fetchData = async () => {
      const authRes = await authorize();
      console.log(authRes.authReq); // Access the resolved object
      console.log(authRes.code);

      if(authRes.code===0){
        // console.log("Authorization failed returning to login");
        // setMessage("Authorization failed returning to login");
        localStorage.removeItem("user");
        dispatch(clearUser());
        router.push('/login');
      }
      else if(authRes.code===1){
        console.log("Access token present");

        const response = await fetch("http://localhost:3123/expenses", {
            headers: authRes.authReq.headers
          });
        if (!response.ok) {
          localStorage.removeItem("accessToken");
          router.push('/');
        }
        else{
        console.log("Response:", response.json().then((data) => {
          console.log("Fetch Data:", data.data);
          setTransactions(data.data);
          calculateSummary(data.data);
          // console.log("transactions:", transactions);
          // setMessage(JSON.stringify(data.data));
        }));
        }
        console.log("Data pulled in");        
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (transactions === null) {
    return <div>Loading...</div>;
  }

  return(
    <div>
        <div className="max-w-5xl mx-auto px-5 flex justify-between items-center gap-4">
            <p className="text-lg">Here is a summary of your expenses:</p>
              <p className="text-xl font-bold mb-2">Total Expenses: {summary.expenses}</p>
        </div>
        <div className='max-w-5xl mx-auto px-5 flex justify-between items-center gap-4'>    
              {/* todo:  add pie chart */}
              {/* todo: fix chart going out of bounds issue */}
          <h2 className="text-xl font-bold mb-2">Expenses Over Time</h2>
          <Line data={lineData} />
        </div>
        <div className='max-w-5xl mx-auto px-5 flex justify-between items-center gap-4'>          
          <Table>
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
              <TableRow>
              <TableHead className="w-[100px] p-4">Date</TableHead>
              <TableHead className="text-left p-4">Title</TableHead>
              <TableHead className="text-left p-4">Description</TableHead>
              <TableHead className="text-center p-4">Amount</TableHead>
              <TableHead className="text-right p-4">Category</TableHead>
              <TableHead className="text-right p-4">SubCategory</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* todo: link these table rows to go to expense page on click */}
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell className="p-4">
                  <Link className=" block p-4" href={`/expenses/${transaction._id}`}>
                    {new Date(transaction.updatedAt).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-4">
                <Link className=" block p-4" href={`/expenses/${transaction._id}`}>
                  {transaction.title}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-4">
                <Link className=" block p-4" href={`/expenses/${transaction._id}`}>
                  {transaction.description}
                  </Link>
                </TableCell>
                <TableCell className="text-center p-4">
                <Link className=" block p-4" href={`/expenses/${transaction._id}`}>
                  {transaction.amount}
                  </Link>
                </TableCell>
                <TableCell className="text-right p-4">
                <Link className=" block p-4" href={`/expenses/${transaction._id}`}>
                  {transaction.category}
                  </Link>
                </TableCell>
                <TableCell className="text-right p-4">
                <Link className=" block p-4" href={`/expenses/${transaction._id}`}>
                  {transaction.subcategory}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
      </div>
    </div>
    );
}
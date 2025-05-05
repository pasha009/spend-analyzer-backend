import { notFound } from "next/navigation";
import { authorize } from "@/utils/Authorize";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { setUser, clearUser } from "@/utils/store/userSlice";
import { useRouter } from "next/navigation";

/**
 * Represents a single transaction record.
 * 
 * @property {string} _id - The unique identifier for the transaction.
 * @property {string} userId - The ID of the user associated with the transaction.
 * @property {string} title - The title or name of the transaction.
 * @property {number} amount - The monetary amount of the transaction.
 * @property {string} category - The category under which the transaction falls.
 * @property {string} budget - The budget associated with the transaction.
 * @property {string} subcategory - The subcategory under which the transaction falls.
 * @property {string} description - A brief description of the transaction.
 * @property {string} updatedAt - The timestamp of the last update to the transaction.
 */
interface Transaction {
    _id: string;
    userId: string;
    title: string;
    amount: number;
    category: string;
    budget: string;
    subcategory: string;
    description: string;
    updatedAt: string;
  }

/**
 * Displays the details of a specific expense, allowing the user to edit or delete it.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.expenseId - The ID of the expense to display.
 * @returns {JSX.Element} The rendered expense page component.
 */
export default function ExpensePage({expenseId} : {expenseId: string}) {
// const local = params;
  const router = useRouter();
  const dispatch = useAppDispatch();
  if (!expenseId) {
    console.log("Invalid Invoice ID");
    throw new Error(`Invalid Invoice ID : ${expenseId}`);
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchData = async () => {
    const authRes = await authorize();
    console.log(authRes.authReq);
    console.log(authRes.code);
    if (authRes.code === 0) {
      localStorage.removeItem("user");
      dispatch(clearUser());
      router.push("/login");
    } else if (authRes.code === 1) {
      console.log("Access token present");
      const response = await fetch(`http://localhost:3123/expenses/${expenseId}`, {
        headers: authRes.authReq.headers,
      });
      console.log("Response:", response);
      if (!response.ok) {
        localStorage.removeItem("accessToken");
        router.push(`/expenses/${expenseId}`);
      } else {
        console.log(
          "Response:",
          response.json().then((data) => {
            console.log("Fetch Data:", data.data);
            setTransactions([data.data]);
          })
        );
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

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 my-12 px-6">
      {transactions.map((transaction) => (
        <div key={transaction._id}>
          <h1 className="text-xl font-semibold">Expense Details</h1>
          <h2>Title: {transaction.title}</h2>
          <p>Amount: {transaction.amount}</p>
          <p>Budget: {transaction.budget}</p>
          <p>Category: {transaction.category}</p>
          <p>Subcategory: {transaction.subcategory}</p>
          <p>Description: {transaction.description}</p>
          <p>Updated At: {new Date(transaction.updatedAt).toLocaleDateString()}</p>
        </div>
      ))}
      <div className="flex justify-between">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            const queryParams = new URLSearchParams({
              id: transactions[0]._id,
              title: transactions[0].title,
              amount: transactions[0].amount.toString(),
              description: transactions[0].description,
              budget: transactions[0].budget,
              category: transactions[0].category,
              subcategory: transactions[0].subcategory,
            });
            router.push(`/expenses/${expenseId}/edit?${queryParams.toString()}`);
          }}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={async () => {
            await fetch(`http://localhost:3123/expenses/${expenseId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            })
              .then((response) => {
                console.log("Response:", response);
                if (response.ok) {
                  alert("Expense deleted successfully");
                  router.push("/");
                } else {
                    //this might happen in case of access token expiry
                    //todo : handle this later

                    console.error("Failed to delete expense, try Again");
                    router.push(`/expenses/${expenseId}`);
                }
              })
              .catch((error) => {
                console.error("Error deleting expense:", error);
              });
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/**
 * Fetches server-side props for the expense page.
 * 
 * @param {Object} context - The context object containing route parameters.
 * @param {Object} context.params - The route parameters.
 * @param {string} context.params.expenseId - The ID of the expense to fetch.
 * @returns {Object} The server-side props or a notFound flag if the expense ID is invalid.
 */
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
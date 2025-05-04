import {authorize} from "@/utils/Authorize";
import React, { useEffect } from "react";
import { useAppDispatch } from '@/utils/hooks';
import { clearUser } from '@/utils/store/userSlice';
import { useRouter, useSearchParams } from "next/navigation";
import UpdateButton from "@/components/UpdateButton";
import { useForm, SubmitHandler } from "react-hook-form";
import ExpenseFormField from "@/components/newExpenseFormField";
import { FormData } from "@/lib/types/expenseTypes";
import axios from "axios";


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

  type ExpenseFormData = {
    title: string;
    amount: number;
    description: string;
    budget: string;
    category: string;
    subcategory: string;
  };

  const EditExpenseForm: React.FC = () =>{
    const dispatch = useAppDispatch();
    const router = useRouter();
    let authRes = {authReq:{}, code:0};

    const searchParams = useSearchParams();
    if(!searchParams){
        //todo : handle case where user directly inputs url with expenseId and doesnot go to it via edit button in expense page
        console.log("Direct url call, no search params passed");
        router.push('/');
    }
    const expenseId = searchParams.get("id");
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            title: searchParams.get("title") || "",
            amount: parseFloat(searchParams.get("amount") || "0"),
            description: searchParams.get("description") || "",
            budget: searchParams.get("budget") || "",
            category: searchParams.get("category") || "",
            subcategory: searchParams.get("subcategory") || "",
        }
    });


    const fetchData = async() =>{
        authRes = await authorize();
        console.log(authRes.authReq); // Access the resolved object
        console.log(authRes.code);
        if(authRes.code===0){
            console.log("Authorization failed returning to login");
            localStorage.removeItem("user");
            dispatch(clearUser());
            router.push('/login');
        }    
    }
    useEffect(() => {
        fetchData();
    }, []);


    const onSubmit: SubmitHandler<FormData> = async (data: ExpenseFormData, event?: React.BaseSyntheticEvent) => {
        if(authRes.code===1){
            const accessToken = localStorage.getItem("accessToken");
            console.log("Expense ID:", expenseId);
            event?.preventDefault();
            const resData = {
                title: data.title,
                amount: data.amount,
                description: data.description,
                budget: data.budget,
                category: data.category,
                subcategory: data.subcategory
            };
            console.log(resData);
            console.log(authRes.authReq);
            try{
                const response = await axios.put(`http://localhost:3123/expenses/${expenseId}`, resData, {
                    headers: { "Content-Type": "application/json" 
                    , "Authorization": `Bearer ${accessToken}`
                    //look into why authRes.authReq.headers.Authorization is not working
                    // , "Authorization": `Bearer ${authRes.authReq.headers.Authorization}`
                },
                });
                alert("Expense updated successfully!");
                console.log("Server Response:", response.data);
                router.push(`/expenses/${expenseId}`);
            }catch (error: any) {
                //no way of handling access token expiry
                //todo : find a way to handle access token expiry on the client side
                console.error("Error:", error.response?.data || error.message);
                alert("Expense updatation failed. Please try again.");
                router.push('/');
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid col-auto max-w-5xl mx-auto px-5 flex justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold mb-4">
                        Expense Form
                    </h1>
                    <ExpenseFormField
                        type="text"
                        placeholder="Title"
                        name="title"
                        register={register}
                        error={errors.title}
                    />
                    <ExpenseFormField
                        type="number"
                        placeholder="Amount"
                        name="amount"
                        register={register}
                        error={errors.amount}
                        valueAsNumber
                    />
                    <ExpenseFormField
                        type="text"
                        placeholder="Description"
                        name="description"
                        register={register}
                        error={errors.description}
                    />
                    <ExpenseFormField
                        type="text"
                        placeholder="Budget"
                        name="budget"
                        register={register}
                        error={errors.budget}
                    />
                    <ExpenseFormField
                        type="text"
                        placeholder="Category"
                        name="category"
                        register={register}
                        error={errors.category}
                    />
                    <ExpenseFormField
                        type="text"
                        placeholder="Subcategory"
                        name="subcategory"
                        register={register}
                        error={errors.subcategory}
                    />
                <UpdateButton />
                </div>
            </form>
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

export default EditExpenseForm;

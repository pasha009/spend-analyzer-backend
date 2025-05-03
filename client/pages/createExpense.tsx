import React, { BaseSyntheticEvent, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import SubmitButton from "@/components/SubmitButton";
import { FormData } from "@/lib/types/expenseTypes";
import ExpenseFormField from "@/components/newExpenseFormField";
import {useRouter} from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import {authorize} from "@/utils/Authorize";
import { setUser, clearUser } from '../utils/store/userSlice';
import axios from "axios";

type ExpenseFormData = {
  title: string;
  amount: number;
  description: string;
  budget: string;
  category: string;
  subcategory: string;
};

const ExpenseForm: React.FC = () =>{
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>();

    const dispatch = useAppDispatch();
    const router = useRouter();
    let authRes = {authReq:{}, code:0};

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
            event?.preventDefault();
            const resData = {
                title: data.title,
                amount: data.amount,
                description: data.description,
                budget: data.budget,
                category: data.category,
                subcategory: data.subcategory
            };
            console.log(authRes.authReq);
            try{
                const response = await axios.post("http://localhost:3123/expenses/", resData, {
                    headers: { "Content-Type": "application/json" 
                    , "Authorization": `Bearer ${accessToken}`
                    //look into why authRes.authReq.headers.Authorization is not working
                    // , "Authorization": `Bearer ${authRes.authReq.headers.Authorization}`
                },
                });
                alert("Expense created successfully!");
                console.log("Server Response:", response.data);
                router.push('/');
            }catch (error: any) {
                //no way of handling access token expiry
                //todo : find a way to handle access token expiry on the client side
                console.error("Error:", error.response?.data || error.message);
                alert("Expense creation failed. Please try again.");
                router.push('/login');
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
                <SubmitButton />
                </div>
            </form>
        </div>
    );
}


export default ExpenseForm;

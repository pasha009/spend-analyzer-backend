import { FieldError, UseFormRegister } from "react-hook-form";

export type FormData = {
    title: string;
    amount: number;
    description: string;
    budget: string;
    category: string;
    subcategory: string;
  };
  
  export type ExpenseFormFieldProps = {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<FormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
  };
  
  export type ValidFieldNames =
  | "title"
  | "amount"
  | "description"
  | "budget"
  | "category"
  | "subcategory";


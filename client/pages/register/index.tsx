"use client"
import React, { BaseSyntheticEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import SubmitButton from "@/components/SubmitButton";
import RegFormField from "@/components/RegFormField";
import { FormData } from "@/lib/types/regTypes";
import {useRouter} from "next/navigation"

import axios from "axios";

type RegFormData = {
  username: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const router = useRouter();

  const onSubmit: SubmitHandler<RegFormData> = async (data: RegFormData, event?: BaseSyntheticEvent) => {
    event?.preventDefault();
    // console.log("le bhai");
    if(data.password!==data.confirmPassword){
      console.log("Passwords and Confirm Password fields should match");
    }

    const resData={
      "user":data.username,
      "pwd":data.password
    }
    try {
      const response = await axios.post("http://localhost:3123/users/register", resData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response);
      alert("Registration successful!");
      console.log("Server Response:", response.data);
      router.push('/login');
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="grid col-auto max-w-5xl mx-auto px-5 flex justify-between items-center gap-4">
          <h1 className="text-3xl font-bold mb-4">
            User Registration
          </h1>
          <RegFormField
            type="username"
            placeholder="Username"
            name="username"
            register={register}
            error={errors.username}
          />

          <RegFormField
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            error={errors.password}
          />

          <RegFormField
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
          />

        <SubmitButton />
      </div>
    </form>
    </div>
  );
};

export default RegisterForm;

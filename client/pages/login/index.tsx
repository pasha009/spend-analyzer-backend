"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { FormData } from "@/lib/types/loginTypes";
import LoginFormField from "@/components/LoginFormField";
import SubmitButton from "@/components/SubmitButton";
import axios from "axios";
import { BaseSyntheticEvent} from "react";
import { useRouter } from "next/navigation";

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const router = useRouter();

  const onSubmit:SubmitHandler<FormData> = async (data: FormData, event ?: BaseSyntheticEvent) => {
    event?.preventDefault();
    console.log(data);
    try {
      const response = await axios.post("http://localhost:3123/users/login", data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      alert("Sign In successful!");
      console.log("Server Response:", response.data);

      const accessToken=response.data.data.accessToken;
      const refreshToken=response.data.data.refreshToken;

      console.log(accessToken);
      console.log(refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      router.push('/');
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert("Sign In failed. Please try again.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid col-auto max-w-5xl mx-auto px-5 flex justify-between items-center gap-4">
          <h1 className="text-3xl font-bold mb-4">
            User Login
          </h1>
          <LoginFormField
            type="username"
            placeholder="Username"
            name="username"
            register={register}
            error={errors.username}
          />
          
          <LoginFormField
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            error={errors.password}
          />

          <SubmitButton />
        </div>
      </form>
      </div>
  );
}

export default Form;
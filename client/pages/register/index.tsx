"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
  } = useForm<RegFormData>();

  const onSubmit: SubmitHandler<RegFormData> = async (data) => {
    try {
      const response = await axios.post("http://localhost:3123/users/register", data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response);
      alert("Registration successful!");
      console.log("Server Response:", response.data);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-md shadow-md max-w-sm mx-auto">
      <div>
        <label className="block text-sm font-semibold">Username</label>
        <input
          type="text"
          {...register("username", { required: "Username is required" })}
          className="border p-2 w-full rounded"
        />
        {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold">Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
          className="border p-2 w-full rounded"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match",
          })}
          className="border p-2 w-full rounded"
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 rounded w-full disabled:bg-gray-400"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;

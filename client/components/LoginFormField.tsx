"use client";
import { LoginFormFieldProps } from "@/lib/types/loginTypes";

const LoginFormField: React.FC<LoginFormFieldProps> = ({
    type,
    placeholder,
    name,
    register,
    error,
    valueAsNumber,
  }) => (
    <>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber })}
      />
      {error && <span className="error-message">{error.message}</span>}
    </>
  );
  export default LoginFormField;
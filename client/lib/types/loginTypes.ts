import { FieldError, UseFormRegister } from "react-hook-form";

export type FormData = {
    username: string;
    password: string;
  };

  export type LoginFormFieldProps = {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<FormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
  };

  export type ValidFieldNames =
  | "username"
  | "password";

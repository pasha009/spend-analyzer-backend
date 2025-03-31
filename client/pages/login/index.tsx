import { useForm } from "react-hook-form";
import { FormData } from "@/lib/types/loginTypes";
import LoginFormField from "@/components/LoginFormField";
import SubmitButton from "@/components/SubmitButton";

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
      console.log("SUCCESS", data);
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid col-auto">
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
  );
}

export default Form;
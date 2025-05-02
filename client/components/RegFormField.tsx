import { RegFormFieldProps } from "@/lib/types/regTypes";

const RegFormField: React.FC<RegFormFieldProps> = ({
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
  export default RegFormField;
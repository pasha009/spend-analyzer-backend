import {ExpenseFormFieldProps} from "@/lib/types/expenseTypes";

const ExpenseFormField: React.FC<ExpenseFormFieldProps> = ({
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
export default ExpenseFormField;
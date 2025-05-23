import { Schema, model } from "mongoose";

const expenseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  user_id:{
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
  }
}, { timestamps: true })


const Expense = model('Expense', expenseSchema);

export default Expense;



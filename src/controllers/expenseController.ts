import { Request, Response } from "express";
import Expense from "../models/expenseModel";

export const getExpense = async (req: Request, res: Response) => {
  const expense = await Expense.findById(req.sanitizedData.id);
  if (expense) {
    return res.success("Get expense", expense.toJSON());
  }
  res.error("Expense not found", "No expense found with specified id", 404);
}

export const getAllExpenses = async (req: Request, res: Response) => {
  const expenses = await Expense.find();
  res.success("Get all expenses", expenses.map(x => x.toJSON()));
}

export const postExpense = async (req: Request, res: Response) => {
  const newExpense = await Expense.create({
    title: req.sanitizedData.title,
    description: req.sanitizedData.description ?? null,
    amount: req.sanitizedData.amount,
    budget: req.sanitizedData.budget,
    category: req.sanitizedData.category,
    subcategory: req.sanitizedData.subcategory ?? null,
  });
  res.success("New expense created", newExpense.toJSON());
};

export const deleteExpense = async (req: Request, res: Response) => {
  const expense = await Expense.findByIdAndDelete(req.sanitizedData.id);
  if (expense) {
    return res.success("Expense deleted", expense.toJSON());
  }
  res.error("Expense not found", null, 404);
}

export const updateExpense = async (req: Request, res: Response) => {
  const expense = await Expense.findByIdAndUpdate(req.sanitizedData.id, {
    title: req.sanitizedData.title,
    description: req.sanitizedData.description ?? null,
    amount: req.sanitizedData.amount,
    budget: req.sanitizedData.budget,
    category: req.sanitizedData.category,
    subcategory: req.sanitizedData.subcategory ?? null,
  }, { new: true, runValidators: true });
  if (expense) {
    return res.success("Expense updated successfully", expense.toJSON());
  }
  res.error("Expense not found", null, 404);
}

export const getAllCategoryExpenses = async (req: Request, res: Response) =>{
  const expenses = await Expense.find({category : req.sanitizedData.category}).exec();
  if(expenses){
    return res.success(`Expenses for category ${req.sanitizedData.category} found`,expenses.map(x => x.toJSON()));
  }
  res.error("No such expenses found",null, 404);
}


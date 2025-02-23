import { Request, Response } from "express";

const expenses = [
  {
    id: 1,
    amount: 1500,
    budget: "Personal",
    category: "Self Improvement",
    subcategory: null,
    title: "Gym membership",
    description: null,
    timestamp: 1609459200
  },
  {
    id: 2,
    amount: 1001,
    budget: "Personal",
    category: "Travel",
    subcategory: "Petrol",
    title: "Petrol",
    description: "Raider at 8003 km",
    timestamp: 1708745234
  }
]

let nextId = expenses.length;

export const getExpense = (req: Request, res: Response) => {
  const expense = expenses.find(x => x.id === req.sanitizedData.id);
  if (expense) {
    return res.success("Get expense", expense);
  }
  res.error("Expense not found", "No expense found with specified id", 404);
}

export const getAllExpenses = (req: Request, res: Response) => {
  res.success("Get all expenses", expenses);
}

export const postExpense = (req: Request, res: Response) => {
  const newExpense = {
    id: nextId,
    amount: req.sanitizedData.amount,
    budget: req.sanitizedData.budget,
    category: req.sanitizedData.category,
    subcategory: req.sanitizedData.subcategory ?? null,
    title: req.sanitizedData.title,
    description: req.sanitizedData.description ?? null,
    timestamp: Date.now()
  };
  expenses.push(newExpense);
  res.success("New expense created", newExpense);
  nextId++;
};

export const deleteExpense = (req: Request, res: Response) => {
  const index = expenses.findIndex(x => x.id == req.sanitizedData.id);
  if (index !== -1) {
    expenses.splice(index, 1);
    return res.success("Expense deleted", null);
  }
  res.error("Expense not found", null, 404);
}

export const updateExpense = (req: Request, res: Response) => {
  const index = expenses.findIndex(x => x.id == req.sanitizedData.id);
  if (index !== -1) {
    expenses[index].amount = req.sanitizedData.amount;
    expenses[index].budget = req.sanitizedData.amount;
    expenses[index].category = req.sanitizedData.amount;
    expenses[index].subcategory = req.sanitizedData.amount ?? null;
    expenses[index].title = req.sanitizedData.title;
    expenses[index].description = req.sanitizedData.description;
    return res.success("Expense updated successfully", expenses[index]);
  }
  res.error("Expense not found", null, 404);
}


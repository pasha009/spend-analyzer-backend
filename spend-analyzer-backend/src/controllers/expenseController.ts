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
  const expenses = await Expense.find({category : req.params.id}).exec();
  return res.success(`Expenses for category ${req.params.id} found`,expenses.map(x => x.toJSON()));
}

export const getAllSubCategoryExpenses = async (req: Request, res: Response) =>{
  const expenses = await Expense.find({subcategory : req.params.id}).exec();
  return res.success(`Expenses for subcategory ${req.params.id} found`,expenses.map(x => x.toJSON()));
}

export const getAllBudgetExpenses = async (req: Request, res: Response) =>{
  const expenses = await Expense.find({budget : req.params.id}).exec();
  return res.success(`Expenses for budget ${req.params.id} found`,expenses.map(x => x.toJSON()));
}

export const getLatestExpenses = async (req:Request, res:Response) =>{
  try{
    const n : number = req.params.id?(+req.params.id):10;
    const expenses = await Expense.find().sort({_id:-1}).limit(n);

    return res.success(`Last ${n} transactions`,expenses.map(x => x.toJSON()),200);
  }catch(err){
    return res.error("Invalid input",err);
  }
}

export const getAllPriceExpenses = async (req:Request, res:Response) =>{
  const floorAmount = req.sanitizedData.floorAmount;
  const ceilAmount = req.sanitizedData.ceilAmount;
  if(floorAmount<ceilAmount) return res.error("Floor Amount should be less than Ceil Amount",null);
  
  const expenses = await Expense.where('amount').gte(floorAmount).lte(ceilAmount).exec();

  return res.success(`Expenses from Amount ${floorAmount} to ${ceilAmount}`, expenses.map(x => x.toJSON()),200)
}

export const getAllPeriodExpenses = async (req:Request, res:Response) =>{
  const startTime = +req.sanitizedData.startTime;
  const endTime = +req.sanitizedData.endTime;

  if(!startTime || !endTime) return res.error("Range for time period required",null);
  else if(startTime>endTime) return res.error("Start time should be less than End time",null);

  const expenses = await Expense.where('timestamps').gte(startTime).lte(endTime).exec();

  return res.success(`Expenses from timestamps ${startTime} to ${endTime}`, expenses.map(x => x.toJSON()),200)
}


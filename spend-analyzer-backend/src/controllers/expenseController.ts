import { Request, Response } from "express";
import Expense from "../models/expenseModel";

/**
 * get expense by id
 * @param req request object
 * @param res response object
 * @description : returns expense by id after validating user_id
 */
export const getExpense = async (req: Request, res: Response) => {
  const expense = await Expense.findById(req.sanitizedData.id);
  if (expense && expense.user_id === res.locals.user_id) {
    return res.success("Get expense", expense.toJSON());
  }
  res.error(`Expense not found", "No expense found with specified id from User ${res.locals.username}`, 404);
}

/**
 * get all expenses for a user
 * @param req request object
 * @param res response object
 * @description : get all expenses for a user
 */
export const getAllExpenses = async (req: Request, res: Response) => {
  const expenses = await Expense.find({user_id: res.locals.user_id}).exec();
  res.success("Get all expenses", expenses.map(x => x.toJSON()));
}

/**
 * post expense
 * @param req request object
 * @param res response object
 * @description : create a new expense
 */
export const postExpense = async (req: Request, res: Response) => {
  const newExpense = await Expense.create({
    title: req.sanitizedData.title,
    user_id: res.locals.user_id,
    description: req.sanitizedData.description ?? null,
    amount: req.sanitizedData.amount,
    budget: req.sanitizedData.budget,
    category: req.sanitizedData.category,
    subcategory: req.sanitizedData.subcategory ?? null,
  });
  res.success("New expense created", newExpense.toJSON());
};

/**
 * delete expense
 * @param req request object
 * @param res response object
 * @returns status 200 if expense deleted, 404 if expense not found
 * @description : delete expense by id
 */
export const deleteExpense = async (req: Request, res: Response) => {
  const expense = await Expense.findOneAndDelete({
    _id : req.sanitizedData.id,
    user_id: res.locals.user_id
  });
  if (expense) {
    return res.success("Expense deleted", expense.toJSON());
  }
  res.error("Expense not found", null, 404);
}

/**
 * update expense
 * @param req request object
 * @param res response object
 * @description : update expense by id
 * @returns 
 */
export const updateExpense = async (req: Request, res: Response) => {
  const expense = await Expense.findOneAndUpdate({
    _id : req.sanitizedData.id,
    user_id: res.locals.user_id
  },
  {
    title: req.sanitizedData.title,
    user_id: res.locals.user_id,
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

/** 
 * @param req request object
 * @param res response object
 * @description : get all expenses for a user by category
 * @returns expenses for a user by category
 */
export const getAllCategoryExpenses = async (req: Request, res: Response) =>{
  const expenses = await Expense.find({user_id: res.locals.user_id, category : req.params.id}).exec();
  return res.success(`Expenses for category ${req.params.id} found`,expenses.map(x => x.toJSON()));
}

/**
 * 
 * @param req request object
 * @param res response object
 * @description : get all expenses for a user by subcategory
 * @returns expenses for a user by subcategory
 */
export const getAllSubCategoryExpenses = async (req: Request, res: Response) =>{
  const expenses = await Expense.find({user_id: res.locals.user_id, subcategory : req.params.id}).exec();
  return res.success(`Expenses for subcategory ${req.params.id} found`,expenses.map(x => x.toJSON()));
}

/**
 * 
 * @param req request object
 * @param res response object
 * @description : get all expenses for a user by budget
 * @returns expenses for a user by budget
 */
export const getAllBudgetExpenses = async (req: Request, res: Response) =>{
  const expenses = await Expense.find({user_id: res.locals.user_id, budget : req.params.id}).exec();
  return res.success(`Expenses for budget ${req.params.id} found`,expenses.map(x => x.toJSON()));
}

/**
 * 
 * @param req request object
 * @param res response object
 * @description : get all expenses for a user by title
 * @returns expenses for a user by title
 */
export const getLatestExpenses = async (req:Request, res:Response) =>{
  try{
    const n : number = req.params.id?(+req.params.id):10;
    const expenses = await Expense.find({user_id: res.locals.user_id}).sort({_id:-1}).limit(n).exec();

    return res.success(`Last ${n} transactions`,expenses.map(x => x.toJSON()),200);
  }catch(err){
    return res.error("Invalid input",err);
  }
}

/**
 * 
 * @param req request object
 * @param res response object
 * @description : get all expenses for a user by amount
 * @returns expenses for a user in given amount range
 */
export const getAllPriceExpenses = async (req:Request, res:Response) =>{
  const floorAmount = req.sanitizedData.floorAmount;
  const ceilAmount = req.sanitizedData.ceilAmount;
  if(floorAmount<ceilAmount) return res.error("Floor Amount should be less than Ceil Amount",null);

  const expenses = await Expense.find({
    user_id: res.locals.user_id,
    amount: { $gte: floorAmount, $lte: ceilAmount },
  }).exec();
  // const expenses = await Expense.where('user_id').equals(res.locals.user_id).where('amount').gte(floorAmount).lte(ceilAmount).exec();

  return res.success(`Expenses from Amount ${floorAmount} to ${ceilAmount}`, expenses.map(x => x.toJSON()),200)
}

/**
 * 
 * @param req request object
 * @param res response object
 * @description : get all expenses for a user in given time period
 * @returns expenses for a user in given time period
 */
export const getAllPeriodExpenses = async (req:Request, res:Response) =>{
  const startTime = +req.sanitizedData.startTime;
  const endTime = +req.sanitizedData.endTime;

  if(!startTime || !endTime) return res.error("Range for time period required",null);
  else if(startTime>endTime) return res.error("Start time should be less than End time",null);

  const expenses = await Expense.find({
    user_id: res.locals.user_id,
    timestamps: { $gte: startTime, $lte: endTime },
    }).exec();
  // const expenses = await Expense.where('user_id').equals(res.locals.user_id).where('timestamps').gte(startTime).lte(endTime).exec();

  return res.success(`Expenses from timestamps ${startTime} to ${endTime}`, expenses.map(x => x.toJSON()),200)
}


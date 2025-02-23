import express, { RequestHandler } from "express";
import dotenv from "dotenv";
import { param, body, validationResult, matchedData } from "express-validator";

dotenv.config()
const app = express()
app.use(express.json());


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

let nextId = 3;

const checkValidation: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: errors.array(),
      data: null,
      msg: "Invalid Input"
    });
    return;
  }
  req.sanitizedData = matchedData(req);
  res.locals.sanitizedData = matchedData(req);
  next();
}

const validateExpenseId = [
  param('id')
    .isInt({ gt: 0 }).withMessage("ID must be a positive integer")
    .toInt(),
  checkValidation
];

app.get("/api/expense/:id", ...validateExpenseId, (req, res) => {
  const expense = expenses.find(x => x.id === res.locals.sanitizedData.id);
  if (expense) {
    res.json({
      success: true,
      error: null,
      data: expense,
      msg: "Get Expense"
    })
  }
  else {
    res.json({
      success: false,
      error: "No expense found with specified id",
      data: null,
      msg: "Expense not found"
    })
  }
});

const validateCreateExpense = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number").toFloat(),
  body("budget").isString().notEmpty().withMessage("Budget must be a non-empty string"),
  body("category").isString().notEmpty().withMessage("Category must be a non-empty string"),
  body("subcategory").optional().isString().notEmpty().withMessage("Subcategory must be a non-empty string"),
  body("title").isString().notEmpty().withMessage("Title must be a non-empty string"),
  body("description").optional().isString().notEmpty().withMessage("Description must be a non-empty string"),
  checkValidation
];

app.post("/api/expense/add", ...validateCreateExpense, (req, res) => {
  const newExpense = {
    id: nextId,
    amount: res.locals.sanitizedData.amount,
    budget: res.locals.sanitizedData.budget,
    category: res.locals.sanitizedData.category,
    subcategory: res.locals.sanitizedData.subcategory ?? null,
    title: res.locals.sanitizedData.title,
    description: res.locals.sanitizedData.description ?? null,
    timestamp: Date.now()
  };
  expenses.push(newExpense);
  res.json({
    success: true,
    error: null,
    data: newExpense,
    msg: "New Expense Created"
  })
  nextId++;
});

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

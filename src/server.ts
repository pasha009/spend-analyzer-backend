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

app.use((req, res, next) => {
  res.success = (msg, data = null, statusCode = 200) =>
    res.status(statusCode).json({ success: true, msg, data, error: null });
  res.error = (msg, error = null, statusCode = 500) =>
    res.status(statusCode).json({ success: false, msg, data: null, error });
  next();
})

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
  next();
}

const validateExpenseId = [
  param('id').isInt({ gt: 0 }).withMessage("ID must be a positive integer").toInt(),
  checkValidation
];

const validateCreateExpense = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number").toFloat(),
  body("budget").isString().notEmpty().withMessage("Budget must be a non-empty string"),
  body("category").isString().notEmpty().withMessage("Category must be a non-empty string"),
  body("subcategory").optional().isString().notEmpty().withMessage("Subcategory must be a non-empty string"),
  body("title").isString().notEmpty().withMessage("Title must be a non-empty string"),
  body("description").optional().isString().notEmpty().withMessage("Description must be a non-empty string"),
  checkValidation
];

app.get("/expenses/", (req, res) => {
  res.success("Get all expenses", expenses);
});

app.get("/expenses/:id", ...validateExpenseId, (req, res) => {
  const expense = expenses.find(x => x.id === req.sanitizedData.id);
  if (expense) {
    return res.success("Get expense", expense);
  }
  res.error("Expense not found", "No expense found with specified id", 404);
});

app.post("/expenses/", ...validateCreateExpense, (req, res) => {
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
});

app.delete("/expenses/:id", ...validateExpenseId, (req, res) => {
  const index = expenses.findIndex(x => x.id == req.sanitizedData.id);
  if (index !== -1) {
    expenses.splice(index, 1);
    return res.success("Expense deleted", null);
  }
  res.error("Expense not found", null, 404);
});

app.put("/expenses/:id", ...validateExpenseId, ...validateCreateExpense, (req, res) => {
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
});


const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

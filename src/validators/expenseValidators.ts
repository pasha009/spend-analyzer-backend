import { RequestHandler } from "express";
import { param, body, validationResult, matchedData } from "express-validator";

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

export const validateExpenseId = [
  param('id').isInt({ gt: 0 }).withMessage("ID must be a positive integer").toInt(),
  checkValidation
];

export const validateCreateExpense = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number").toFloat(),
  body("budget").isString().notEmpty().withMessage("Budget must be a non-empty string"),
  body("category").isString().notEmpty().withMessage("Category must be a non-empty string"),
  body("subcategory").optional().isString().notEmpty().withMessage("Subcategory must be a non-empty string"),
  body("title").isString().notEmpty().withMessage("Title must be a non-empty string"),
  body("description").optional().isString().notEmpty().withMessage("Description must be a non-empty string"),
  checkValidation
];


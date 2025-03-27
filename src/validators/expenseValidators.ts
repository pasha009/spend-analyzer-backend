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
  param('id').isMongoId().withMessage("ID must be a valid mongo id"),
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

export const validateCategoryExpense = [
  param('id').isString().notEmpty().withMessage("Category must be a non-empty string"),
  checkValidation
];

export const validateSubCategoryExpense = [
  param('id').isString().notEmpty().withMessage("Sub-Category must be a non-empty string"),
  checkValidation
];

export const validateBudgetExpense = [
  param('id').isString().notEmpty().withMessage("Budget must be a non-empty string"),
  checkValidation
];

export const validatePeriodExpense =[
  body("startTime").isTime({}).withMessage("Start Time must be in proper timestamp format"),
  body("endTime").isTime({}).withMessage("End Time must be in proper timestamp format"),
  checkValidation
];

export const validatePriceExpense =[
  body("floorAmount").isFloat({ gt: 0 }).withMessage("Flor Amount must be a float value").toFloat(),
  body("ceilAmount").isFloat({ gt: 0 }).withMessage("Ceil Amount must be a float value").toFloat(),
  checkValidation
];

export const validateLatestExpense =[
  param('id').notEmpty().isNumeric().withMessage("Input id should be a number").toInt(),
  checkValidation
];

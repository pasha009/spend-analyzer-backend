import express from "express";
import * as controller from "../controllers/expenseController";
import * as validators from "../validators/expenseValidators";
import * as middleware from "../middleware/auth";

const router = express.Router();

router.use((req, res, next) => {
  res.success = (msg, data = null, statusCode = 200) =>
    res.status(statusCode).json({ success: true, msg, data, error: null });
  res.error = (msg, error = null, statusCode = 500) =>
    res.status(statusCode).json({ success: false, msg, data: null, error });
  next();
})

router.get("/",
  middleware.verifyJWT,
  controller.getAllExpenses
);

router.get("/:id",
  ...validators.validateExpenseId,
  controller.getExpense
);

router.post("/",
  middleware.verifyJWT,
  ...validators.validateCreateExpense,
  controller.postExpense
);

router.delete("/:id",
  middleware.verifyJWT,
  ...validators.validateExpenseId,
  controller.deleteExpense
);

router.put("/:id",
  middleware.verifyJWT,  
  ...validators.validateExpenseId,
  ...validators.validateCreateExpense,
  controller.updateExpense
);

router.get("/category/:id",
...validators.validateCategoryExpense,
controller.getAllCategoryExpenses
);

router.get("/budget/:id",
...validators.validateBudgetExpense,
controller.getAllPeriodExpenses
);

router.get("/subcategory/:id",
...validators.validateSubCategoryExpense,
controller.getAllSubCategoryExpenses
);

router.get("/period",
...validators.validatePeriodExpense,
controller.getAllPeriodExpenses
);

router.get("/price",
...validators.validatePriceExpense,
controller.getAllPriceExpenses
);

router.get("/latest/:id",
...validators.validateLatestExpense,
controller.getLatestExpenses
);

export default router;

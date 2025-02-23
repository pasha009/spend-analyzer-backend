import express from "express";
import * as controller from "../controllers/expenseController";
import * as validators from "../validators/expenseValidators";

const router = express.Router();

router.use((req, res, next) => {
  res.success = (msg, data = null, statusCode = 200) =>
    res.status(statusCode).json({ success: true, msg, data, error: null });
  res.error = (msg, error = null, statusCode = 500) =>
    res.status(statusCode).json({ success: false, msg, data: null, error });
  next();
})

router.get("/",
  controller.getAllExpenses
);

router.get("/:id",
  ...validators.validateExpenseId,
  controller.getExpense
);

router.post("/",
  ...validators.validateCreateExpense,
  controller.postExpense
);

router.delete("/:id",
  ...validators.validateExpenseId,
  controller.deleteExpense
);

router.put("/:id",
  ...validators.validateExpenseId,
  ...validators.validateCreateExpense,
  controller.updateExpense
);

export default router;

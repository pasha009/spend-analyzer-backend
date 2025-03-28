import express from "express";
import * as controller from "../controllers/dashboardController"

const router = express.Router();

router.use((req, res, next) => {
  res.success = (msg, data = null, statusCode = 200) =>
    res.status(statusCode).json({ success: true, msg, data, error: null });
  res.error = (msg, error = null, statusCode = 500) =>
    res.status(statusCode).json({ success: false, msg, data: null, error });
  next();
})

router.get("/",
    controller.getDashboard
);

export default router;
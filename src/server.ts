import express from "express";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes";
import userRoutes from "./routes/userRoutes"
import connectDB from "./database";

dotenv.config();
const app = express()
app.use(express.json());
app.use("/expenses", expenseRoutes);
app.use("/users", userRoutes);

const startServer = async (dbURI?: string) => {
  await connectDB(dbURI);
  const PORT = process.env.PORT ?? 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;

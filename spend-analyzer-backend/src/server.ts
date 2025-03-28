import express from "express";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes";
import userRoutes from "./routes/userRoutes"
import connectDB from "./database";

var cors = require('cors')
dotenv.config();
const app = express()

var corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3123', 'http://127.0.0.1:3000', 'http://127.0.0.1:3123' ],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
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

import mongoose from "mongoose";

const connectDB = async (dbURI?: string) => {
  try {
    await mongoose.connect(dbURI ?? process.env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

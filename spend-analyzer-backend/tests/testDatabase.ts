import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

const connectTestDB = async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const mongoURI = mongod.getUri();
    await mongoose.connect(mongoURI);
    console.log("Test MongoDB connected");
  } catch (error) {
    console.error("Error creating test MongoDB", error);
    process.exit(1);
  }
}

const disconnectTestDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  } catch (error) {
    console.error("Error clearing test MongoDB", error);
    process.exit(1);
  }
}

export { connectTestDB, disconnectTestDB };

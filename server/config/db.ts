import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn("⚠️ MONGO_URI is not set in environment variables.");
    console.warn("📁 Falling back to elegant local file-based database for preview mode.");
    isConnected = false;
    return false;
  }

  try {
    // Set connection options
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("🟢 Connected to MongoDB Atlas successfully.");
    return true;
  } catch (error: any) {
    console.error("🔴 Failed to connect to MongoDB Atlas:", error.message);
    console.warn("📁 Gracefully falling back to local file-based database so the application doesn't crash.");
    isConnected = false;
    return false;
  }
}

export function getIsMongoConnected(): boolean {
  return isConnected;
}

import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export default async function connectDB(mongoUri, retries = MAX_RETRIES) {
  try {
    if (!mongoUri) {
      throw new Error("mongodb uri is required");
    }
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    if (retries > 0) {
      console.warn(
        `MongoDB connection failed, retrying in ${RETRY_DELAY_MS}ms... (${retries} retries left)`
      );
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(mongoUri, retries - 1);
    }
    console.error("Could not connect to MongoDB. Exiting...");
    process.exit(1);
  }
}

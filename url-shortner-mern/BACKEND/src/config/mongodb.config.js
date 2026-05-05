// src/config/mongodb.config.js
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export default async function connectDB(mongoUri, retries = MAX_RETRIES) {
  try {
    await mongoose.connect(mongoUri);
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    if (retries > 0) {
      logger.warn(
        `MongoDB connection failed, retrying in ${RETRY_DELAY_MS}ms... (${retries} retries left)`
      );
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(mongoUri, retries - 1);
    }
    logger.fatal("Could not connect to MongoDB. Exiting...");
    process.exit(1);
  }
}

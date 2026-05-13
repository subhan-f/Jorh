import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export async function connectDB(mongoUri, dbName, retries = MAX_RETRIES) {
  try {
    mongoUri = new URL(`${mongoUri}/${dbName}`).href;
    if (!mongoUri) throw new Error("[shared-db] MONGO_URI is required");
    await mongoose.connect(mongoUri);
    console.log(`[MongoDB] connected: ${mongoose.connection.host}`);
  } catch (err) {
    if (retries > 0) {
      console.warn(
        `[MongoDB] connection failed — retrying in ${RETRY_DELAY_MS}ms (${retries} left): ${err.message}`,
      );
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(mongoUri, dbName, retries - 1);
    }
    console.error("[MongoDB] could not connect. Exiting...");
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  console.log("[MongoDB] disconnected");
}

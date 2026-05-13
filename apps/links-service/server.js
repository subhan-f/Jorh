import "./loadEnv.js";
import http from "http";
import { connectDB } from "@repo/shared-db";
import { connectMQ } from "@repo/shared-messaging";
import { PORT, MONGO_URI, RABBITMQ_URI } from "./src/config/env.js";
import app from "./src/app.js";
import logger from "./src/config/logger.js";

async function bootstrap() {
  await connectDB(MONGO_URI, "links-service");
  await connectMQ(RABBITMQ_URI);

  const server = http.createServer(app);

  server.listen(PORT, () => logger.info(`links-service ready on :${PORT}`));

  const shutdown = (signal) => {
    logger.info({ signal }, "Shutdown signal received");
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

bootstrap().catch((err) => {
  console.error("[links-service] bootstrap failed:", err);
  process.exit(1);
});

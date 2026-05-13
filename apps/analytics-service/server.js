import "./loadEnv.js";
import http from "http";
import { connectDB } from "@repo/shared-db";
import { connectMQ } from "@repo/shared-messaging";
import { startClickSubscriber } from "./src/services/subscribers/click.subscriber.js";
import { startLinkSubscriber } from "./src/services/subscribers/link.subscriber.js";
import { PORT, MONGO_URI, RABBITMQ_URI } from "./src/config/env.js";
import app from "./src/app.js";
import logger from "./src/config/logger.js";

async function bootstrap() {
  await connectDB(MONGO_URI, "analytics-service");
  await connectMQ(RABBITMQ_URI);
  await startClickSubscriber();
  await startLinkSubscriber();

  const server = http.createServer(app);

  server.listen(PORT, () => logger.info(`analytics-service ready on :${PORT}`));

  const shutdown = (signal) => {
    logger.info({ signal }, "Shutdown signal received");
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

bootstrap().catch((err) => {
  console.error("[analytics-service] bootstrap failed:", err);
  process.exit(1);
});

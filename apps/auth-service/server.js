import "./loadEnv.js";
import http from "http";
import { connectDB } from "@repo/shared-db";
import { PORT, MONGO_URI } from "./src/config/env.js";
import app from "./src/app.js";
import logger from "./src/config/logger.js";

async function bootstrap() {
  await connectDB(MONGO_URI, "auth-service");

  const server = http.createServer(app);

  server.listen(PORT, () => logger.info(`auth-service ready on :${PORT}`));

  const shutdown = (signal) => {
    logger.info({ signal }, "Shutdown signal received");
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

bootstrap().catch((err) => {
  console.error("[auth-service] bootstrap failed:", err);
  process.exit(1);
});

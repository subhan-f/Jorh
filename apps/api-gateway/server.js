import "./loadEnv.js";
import http from "http";
import { PORT } from "./src/config/env.js";
import app from "./src/app.js";
import logger from "./src/config/logger.js";

async function bootstrap() {
  const server = http.createServer(app);

  server.listen(PORT, () => logger.info(`api-gateway ready on :${PORT}`));

  const shutdown = (signal) => {
    logger.info({ signal }, "Shutdown signal received");
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

bootstrap().catch((err) => {
  console.error("[api-gateway] bootstrap failed:", err);
  process.exit(1);
});

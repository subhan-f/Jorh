import "./loadEnv.js";
import http from "http";
import { PORT } from "./src/config/env.js";
import app from "./src/app.js";
import logger from "./src/config/logger.js";

const server = http.createServer(app);

server.listen(PORT, () => logger.info(`api-gateway ready on :${PORT}`));

const shutdown = (signal) => {
  logger.info({ signal }, "Shutdown signal received");
  server.close(() => process.exit(0));
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

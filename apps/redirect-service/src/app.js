import express from "express";
import helmet from "helmet";
import { createHttpLogger } from "@repo/shared-logger";
import { createErrorHandler } from "@repo/shared-errors";
import redirectController from "./controllers/redirect.controller.js";
import logger from "./config/logger.js";

const app = express();

app.use(helmet());
app.use(createHttpLogger(logger));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "pong", timestamp: new Date().toISOString() });
});

app.get("/:slug", redirectController.handleRedirect);

app.use(createErrorHandler(logger));

export default app;

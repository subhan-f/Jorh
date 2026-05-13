import express from "express";
import helmet from "helmet";
import { createHttpLogger } from "@repo/shared-logger";
import { createErrorHandler } from "@repo/shared-errors";
import routes from "./routes/index.js";
import redirectController from "./controllers/redirect.controller.js";
import logger from "./config/logger.js";

const app = express();

app.use(helmet());
app.use(createHttpLogger(logger));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "pong", timestamp: new Date().toISOString() });
});

// Specific API routes MUST come before the /:slug catch-all
app.use("/api", routes);
app.get("/:slug", redirectController.handleRedirect);

app.use(createErrorHandler(logger));

export default app;

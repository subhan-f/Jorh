import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { createHttpLogger } from "@repo/shared-logger";
import { createErrorHandler } from "@repo/shared-errors";
import routes from "./routes/index.js";
import logger from "./config/logger.js";

const app = express();

app.use(helmet());
app.use(createHttpLogger(logger));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "pong", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(createErrorHandler(logger));

export default app;

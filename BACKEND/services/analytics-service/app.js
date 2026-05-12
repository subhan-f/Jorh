import dotenv from "dotenv/config";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { MONGO_URI } from "./config/env.js";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import clickController from "./controllers/click.controller.js";

const app = express();

connectDB(MONGO_URI);
clickController.subscribeToClickEvents();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

// Global error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err.stack || err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;

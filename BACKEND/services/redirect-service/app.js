import dotenv from "dotenv/config";
import express from "express";
import morgan from "morgan";

import { MONGO_URI } from "./config/env.js";
import connectDB from "./config/db.js";
import routes from "./routes/mapping.route.js";
import redirectController from "./controllers/redirect.controller.js";
import rabbitmqService from "./services/rabbitMQ.service.js";

const app = express();

connectDB(MONGO_URI);
rabbitmqService.subscribeToLinks();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

app.get("/:slug", redirectController.handleRedirect);

app.use("/api", routes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;

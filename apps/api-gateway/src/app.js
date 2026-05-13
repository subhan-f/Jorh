import express from "express";
import { createHttpLogger } from "@repo/shared-logger";
import { REDIRECT_SERVICE_URL } from "./config/env.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import { createProxy } from "./proxy/proxy.js";
import apiRoutes from "./routes/index.js";
import logger from "./config/logger.js";

const app = express();

app.use(createHttpLogger(logger));
app.use(corsMiddleware);
app.use(globalRateLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "pong", timestamp: new Date().toISOString() });
});

// All /api/* traffic is routed to the appropriate microservice
app.use("/api", apiRoutes);

// Catch-all: forward /:slug to redirect-service
// Must be registered AFTER /api to avoid matching "api" as a slug
app.use(createProxy(REDIRECT_SERVICE_URL));

export default app;

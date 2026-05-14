import { Router } from "express";
import { createProxy } from "../proxy/proxy.js";
import { authRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
  AUTH_SERVICE_URL,
  LINKS_SERVICE_URL,
  ANALYTICS_SERVICE_URL,
} from "../config/env.js";

const router = Router();

// Auth service — stricter rate limit on auth endpoints
router.use("/auth", authRateLimiter, createProxy(AUTH_SERVICE_URL));
router.use("/users", createProxy(AUTH_SERVICE_URL));

// Links service
router.use("/links", createProxy(LINKS_SERVICE_URL));

// Analytics service
router.use("/analytics", createProxy(ANALYTICS_SERVICE_URL));

export default router;

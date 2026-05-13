import cors from "cors";
import { CORS_ORIGINS } from "../config/env.js";

export const corsMiddleware = cors({
  origin: CORS_ORIGINS.length ? CORS_ORIGINS : "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

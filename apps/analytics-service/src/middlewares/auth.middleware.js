import { createAuthMiddleware } from "@repo/shared-auth";
import { AUTH_SERVICE_URL } from "../config/env.js";

export const authMiddleware = createAuthMiddleware(AUTH_SERVICE_URL);

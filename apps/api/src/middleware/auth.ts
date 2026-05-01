import { createMiddleware } from "hono/factory";
import { adminAuth } from "../lib/firebase.js";
import type { HonoEnv } from "../types.js";

export const requireAuth = createMiddleware<HonoEnv>(async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ data: null, error: { code: "UNAUTHORIZED", message: "Missing token" } }, 401);
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    c.set("userId", decoded.uid);
    c.set("userEmail", decoded.email ?? "");
    return next();
  } catch {
    return c.json({ data: null, error: { code: "UNAUTHORIZED", message: "Invalid token" } }, 401);
  }
});

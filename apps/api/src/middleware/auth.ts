import { createMiddleware } from "hono/factory";
import { adminAuth, adminDb, Collections } from "../lib/firebase.js";
import type { HonoEnv } from "../types.js";

export const requireAuth = createMiddleware<HonoEnv>(async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ data: null, error: { code: "UNAUTHORIZED", message: "Missing token" } }, 401);
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection(Collections.USERS).doc(decoded.uid).get();
    const userRole = userDoc.exists
      ? ((userDoc.data() as { role?: "client" | "admin" }).role ?? "client")
      : "client";

    c.set("userId", decoded.uid);
    c.set("userEmail", decoded.email ?? "");
    c.set("userRole", userRole);
    return next();
  } catch {
    return c.json({ data: null, error: { code: "UNAUTHORIZED", message: "Invalid token" } }, 401);
  }
});

export const requireRole = (...allowedRoles: Array<"client" | "admin">) =>
  createMiddleware<HonoEnv>(async (c, next) => {
    const userRole = c.get("userRole");
    if (!allowedRoles.includes(userRole)) {
      return c.json(
        { data: null, error: { code: "FORBIDDEN", message: "Insufficient role" } },
        403
      );
    }
    return next();
  });

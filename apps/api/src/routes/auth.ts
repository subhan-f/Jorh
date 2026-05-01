import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { adminDb, adminAuth, Collections } from "../lib/firebase.js";
import { ok } from "@jorh/types";
import type { HonoEnv } from "../types.js";

export const authRoutes = new Hono<HonoEnv>();

authRoutes.post("/verify", requireAuth, async (c) => {
  const userId = c.get("userId");
  const userEmail = c.get("userEmail");

  const userRef = adminDb.collection(Collections.USERS).doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    const firebaseUser = await adminAuth.getUser(userId);
    const newUser = {
      email: userEmail,
      displayName: firebaseUser.displayName ?? userEmail.split("@")[0],
      avatarUrl: firebaseUser.photoURL ?? null,
      plan: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await userRef.set(newUser);
    return c.json(ok({ id: userId, ...newUser }), 201);
  }

  const userData = userDoc.data();
  return c.json(ok({ id: userId, ...userData }));
});

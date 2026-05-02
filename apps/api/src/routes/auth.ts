import { Hono } from "hono";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { adminDb, adminAuth, Collections } from "../lib/firebase.js";
import { ok } from "@jorh/types";
import { env } from "../env.js";
import type { HonoEnv } from "../types.js";

export const authRoutes = new Hono<HonoEnv>();

function getDefaultRole(email: string): "client" | "admin" {
  const adminEmails = env.ADMIN_EMAILS.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase()) ? "admin" : "client";
}

authRoutes.post("/verify", requireAuth, async (c) => {
  const userId = c.get("userId");
  const userEmail = c.get("userEmail");
  const defaultRole = getDefaultRole(userEmail);

  const userRef = adminDb.collection(Collections.USERS).doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    const firebaseUser = await adminAuth.getUser(userId);
    const newUser = {
      email: userEmail,
      displayName: firebaseUser.displayName ?? userEmail.split("@")[0],
      avatarUrl: firebaseUser.photoURL ?? null,
      role: defaultRole,
      plan: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await userRef.set(newUser);
    return c.json(ok({ id: userId, ...newUser }), 201);
  }

  const userData = userDoc.data() as { role?: "client" | "admin"; email?: string };
  if (!userData.role) {
    const role = getDefaultRole(userData.email ?? userEmail);
    await userRef.update({ role, updatedAt: new Date() });
    return c.json(ok({ id: userId, ...userData, role }));
  }

  return c.json(ok({ id: userId, ...userData }));
});

authRoutes.get("/admin/users", requireAuth, requireRole("admin"), async (c) => {
  const usersSnap = await adminDb
    .collection(Collections.USERS)
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  const users = usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return c.json(ok(users));
});

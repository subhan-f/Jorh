import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { adminDb, Collections } from "../lib/firebase.js";
import { kvDelete } from "../lib/kv.js";
import { ok } from "@jorh/types";
import type { HonoEnv } from "../types.js";

export const adminRoutes = new Hono<HonoEnv>();

adminRoutes.use("*", requireAuth, requireRole("admin"));

adminRoutes.get("/stats", async (c) => {
  const [usersSnap, linksSnap] = await Promise.all([
    adminDb.collection(Collections.USERS).get(),
    adminDb.collection(Collections.LINKS).where("isDeleted", "==", false).get(),
  ]);

  const now = Date.now();
  const oneDayAgo = now - 86_400_000;
  const oneWeekAgo = now - 7 * 86_400_000;

  const tsMs = (ts: unknown): number => {
    if (!ts) return 0;
    if (typeof (ts as { toMillis?: () => number }).toMillis === "function")
      return (ts as { toMillis: () => number }).toMillis();
    return new Date(ts as string).getTime();
  };

  const users = usersSnap.docs.map((d) => d.data() as Record<string, unknown>);
  const links = linksSnap.docs.map((d) => d.data() as Record<string, unknown>);

  return c.json(
    ok({
      totalUsers: users.length,
      newUsersToday: users.filter((u) => tsMs(u.createdAt) > oneDayAgo).length,
      paidUsers: users.filter((u) =>
        ["pro", "business", "enterprise"].includes(u.plan as string)
      ).length,
      totalLinks: links.length,
      activeLinks: links.filter((l) => l.isActive).length,
      linksCreatedToday: links.filter((l) => tsMs(l.createdAt) > oneDayAgo).length,
      linksCreatedThisWeek: links.filter((l) => tsMs(l.createdAt) > oneWeekAgo).length,
      totalClicks: links.reduce((sum, l) => sum + ((l.clickCount as number) ?? 0), 0),
      planBreakdown: {
        free: users.filter((u) => u.plan === "free").length,
        pro: users.filter((u) => u.plan === "pro").length,
        business: users.filter((u) => u.plan === "business").length,
        enterprise: users.filter((u) => u.plan === "enterprise").length,
      },
      topLinks: links
        .sort((a, b) => ((b.clickCount as number) ?? 0) - ((a.clickCount as number) ?? 0))
        .slice(0, 10)
        .map((l, i) => ({ rank: i + 1, ...l })),
    })
  );
});

adminRoutes.get(
  "/users",
  zValidator(
    "query",
    z.object({
      limit: z.coerce.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
      search: z.string().optional(),
      plan: z.enum(["free", "pro", "business", "enterprise"]).optional(),
    })
  ),
  async (c) => {
    const { limit, cursor, search, plan } = c.req.valid("query");

    let q = adminDb
      .collection(Collections.USERS)
      .orderBy("createdAt", "desc")
      .limit(limit + 1) as FirebaseFirestore.Query;

    if (plan) {
      q = adminDb
        .collection(Collections.USERS)
        .where("plan", "==", plan)
        .orderBy("createdAt", "desc")
        .limit(limit + 1);
    }

    if (cursor) {
      const cursorDoc = await adminDb.collection(Collections.USERS).doc(cursor).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }

    const snap = await q.get();
    const hasMore = snap.docs.length > limit;
    let users = snap.docs.slice(0, limit).map((d) => ({ id: d.id, ...d.data() })) as Record<
      string,
      unknown
    >[];

    if (search) {
      const term = search.toLowerCase();
      users = users.filter(
        (u) =>
          (u.email as string)?.toLowerCase().includes(term) ||
          (u.displayName as string)?.toLowerCase().includes(term)
      );
    }

    const lastDoc = snap.docs[limit - 1];
    return c.json(ok(users, { hasMore, cursor: hasMore && lastDoc ? lastDoc.id : undefined }));
  }
);

adminRoutes.get("/users/:id", async (c) => {
  const userId = c.req.param("id");
  const [userDoc, linksSnap] = await Promise.all([
    adminDb.collection(Collections.USERS).doc(userId).get(),
    adminDb
      .collection(Collections.LINKS)
      .where("ownerId", "==", userId)
      .where("isDeleted", "==", false)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get(),
  ]);

  if (!userDoc.exists)
    return c.json({ data: null, error: { code: "NOT_FOUND", message: "User not found" } }, 404);

  return c.json(
    ok({
      user: { id: userDoc.id, ...userDoc.data() },
      links: linksSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    })
  );
});

const UpdateUserAdminSchema = z.object({
  plan: z.enum(["free", "pro", "business", "enterprise"]).optional(),
  isSuspended: z.boolean().optional(),
  role: z.enum(["client", "admin"]).optional(),
});

adminRoutes.patch("/users/:id", zValidator("json", UpdateUserAdminSchema), async (c) => {
  const userId = c.req.param("id");
  const input = c.req.valid("json");

  const userDoc = await adminDb.collection(Collections.USERS).doc(userId).get();
  if (!userDoc.exists)
    return c.json({ data: null, error: { code: "NOT_FOUND", message: "User not found" } }, 404);

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (input.plan !== undefined) updates.plan = input.plan;
  if (input.isSuspended !== undefined) updates.isSuspended = input.isSuspended;
  if (input.role !== undefined) updates.role = input.role;

  await adminDb.collection(Collections.USERS).doc(userId).update(updates);
  return c.json(ok({ id: userId, ...userDoc.data(), ...updates }));
});

adminRoutes.get(
  "/links",
  zValidator(
    "query",
    z.object({
      limit: z.coerce.number().min(1).max(100).default(50),
      cursor: z.string().optional(),
      search: z.string().optional(),
      ownerId: z.string().optional(),
    })
  ),
  async (c) => {
    const { limit, cursor, search, ownerId } = c.req.valid("query");

    let q = adminDb
      .collection(Collections.LINKS)
      .where("isDeleted", "==", false)
      .orderBy("createdAt", "desc")
      .limit(limit + 1) as FirebaseFirestore.Query;

    if (ownerId) {
      q = adminDb
        .collection(Collections.LINKS)
        .where("ownerId", "==", ownerId)
        .where("isDeleted", "==", false)
        .orderBy("createdAt", "desc")
        .limit(limit + 1);
    }

    if (cursor) {
      const cursorDoc = await adminDb.collection(Collections.LINKS).doc(cursor).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }

    const snap = await q.get();
    const hasMore = snap.docs.length > limit;
    let links = snap.docs.slice(0, limit).map((d) => ({ id: d.id, ...d.data() })) as Record<
      string,
      unknown
    >[];

    if (search) {
      const term = search.toLowerCase();
      links = links.filter(
        (l) =>
          (l.originalUrl as string)?.toLowerCase().includes(term) ||
          (l.shortCode as string)?.toLowerCase().includes(term) ||
          (l.title as string)?.toLowerCase().includes(term)
      );
    }

    const lastDoc = snap.docs[limit - 1];
    return c.json(ok(links, { hasMore, cursor: hasMore && lastDoc ? lastDoc.id : undefined }));
  }
);

adminRoutes.patch(
  "/links/:id/status",
  zValidator("json", z.object({ isActive: z.boolean() })),
  async (c) => {
    const linkId = c.req.param("id");
    const { isActive } = c.req.valid("json");

    const doc = await adminDb.collection(Collections.LINKS).doc(linkId).get();
    if (!doc.exists)
      return c.json({ data: null, error: { code: "NOT_FOUND", message: "Link not found" } }, 404);

    await adminDb
      .collection(Collections.LINKS)
      .doc(linkId)
      .update({ isActive, updatedAt: new Date() });

    return c.json(ok({ id: linkId, isActive }));
  }
);

adminRoutes.delete("/links/:id", async (c) => {
  const linkId = c.req.param("id");

  const doc = await adminDb.collection(Collections.LINKS).doc(linkId).get();
  if (!doc.exists)
    return c.json({ data: null, error: { code: "NOT_FOUND", message: "Link not found" } }, 404);

  const data = doc.data() as Record<string, unknown>;
  await adminDb
    .collection(Collections.LINKS)
    .doc(linkId)
    .update({ isDeleted: true, isActive: false, updatedAt: new Date() });

  await kvDelete(data.shortCode as string);
  return c.json(ok(null));
});

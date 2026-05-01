import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { adminDb, Collections } from "../lib/firebase.js";
import { FieldValue } from "firebase-admin/firestore";
import { ok, err } from "@jorh/types";
import { env } from "../env.js";
import type { HonoEnv } from "../types.js";

export const analyticsRoutes = new Hono<HonoEnv>();

// Internal endpoint called by Cloudflare Worker — not user-auth'd
analyticsRoutes.post("/click", async (c) => {
  const secret = c.req.header("X-Internal-Key");
  if (secret !== env.INTERNAL_API_SECRET) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const body = await c.req.json<{
    linkId: string;
    timestamp: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    referrer?: string;
  }>();

  const clickRef = adminDb.collection(Collections.CLICKS).doc();
  await clickRef.set({ ...body, timestamp: new Date(body.timestamp) });

  // Increment denormalized count on the link doc
  await adminDb
    .collection(Collections.LINKS)
    .doc(body.linkId)
    .update({ clickCount: FieldValue.increment(1) });

  return c.json({ ok: true });
});

analyticsRoutes.use("*", requireAuth);

analyticsRoutes.get(
  "/:linkId",
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const linkId = c.req.param("linkId");

    const linkDoc = await adminDb.collection(Collections.LINKS).doc(linkId).get();
    if (!linkDoc.exists || (linkDoc.data() as { ownerId: string }).ownerId !== userId) {
      return c.json(err("NOT_FOUND", "Link not found"), 404);
    }

    const clicksSnap = await adminDb
      .collection(Collections.CLICKS)
      .where("linkId", "==", linkId)
      .orderBy("timestamp", "desc")
      .limit(1000)
      .get();

    const clicks = clicksSnap.docs.map((d) => d.data());

    const stats = {
      total: clicks.length,
      byDevice: aggregateBy(clicks, "device"),
      byCountry: aggregateBy(clicks, "country"),
      byBrowser: aggregateBy(clicks, "browser"),
      byReferrer: aggregateBy(clicks, "referrer"),
    };

    return c.json(ok(stats));
  }
);

function aggregateBy(items: Record<string, unknown>[], key: string) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const val = String(item[key] ?? "unknown");
    counts[val] = (counts[val] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([k, count]) => ({ [key]: k, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

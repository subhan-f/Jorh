import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { adminDb, Collections } from "../lib/firebase.js";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { ok, err } from "@jorh/types";
import { env } from "../env.js";
import type { HonoEnv } from "../types.js";

export const analyticsRoutes = new Hono<HonoEnv>();

const ClickPayloadSchema = z.object({
  linkId: z.string().min(1),
  timestamp: z.string().datetime(),
  country: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  device: z.enum(["mobile", "tablet", "desktop"]).optional(),
  browser: z.string().optional(),
  os: z.string().optional(),
  referrer: z.string().optional(),
});

// Internal endpoint called by Cloudflare Worker — not user-auth'd
analyticsRoutes.post("/click", zValidator("json", ClickPayloadSchema), async (c) => {
  const secret = c.req.header("X-Internal-Key");
  if (secret !== env.INTERNAL_API_SECRET) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const body = c.req.valid("json");

  const clickRef = adminDb.collection(Collections.CLICKS).doc();
  await clickRef.set({ ...body, timestamp: new Date(body.timestamp) });

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
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const linkId = c.req.param("linkId");
    const { from, to } = c.req.valid("query");

    const linkDoc = await adminDb.collection(Collections.LINKS).doc(linkId).get();
    if (!linkDoc.exists || (linkDoc.data() as { ownerId: string }).ownerId !== userId) {
      return c.json(err("NOT_FOUND", "Link not found"), 404);
    }

    let query = adminDb
      .collection(Collections.CLICKS)
      .where("linkId", "==", linkId)
      .orderBy("timestamp", "desc");

    if (from) query = query.where("timestamp", ">=", Timestamp.fromDate(new Date(from)));
    if (to) query = query.where("timestamp", "<=", Timestamp.fromDate(new Date(to)));

    const clicksSnap = await query.limit(1000).get();
    const clicks = clicksSnap.docs.map((d) => d.data());

    const stats = {
      total: clicks.length,
      byDevice: aggregateBy(clicks, "device"),
      byCountry: aggregateBy(clicks, "country"),
      byBrowser: aggregateBy(clicks, "browser"),
      byOs: aggregateBy(clicks, "os"),
      byReferrer: aggregateBy(clicks, "referrer"),
    };

    return c.json(ok(stats));
  }
);

function aggregateBy(items: Record<string, unknown>[], key: string): Array<{ label: string; count: number }> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const val = String(item[key] ?? "unknown");
    counts[val] = (counts[val] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

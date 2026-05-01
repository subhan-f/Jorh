import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { createLink, getUserLinks, getLinkById, updateLink, deleteLink } from "../services/link.service.js";
import { CreateLinkSchema, UpdateLinkSchema } from "@jorh/types";
import { ok, err } from "@jorh/types";
import type { HonoEnv } from "../types.js";

export const linkRoutes = new Hono<HonoEnv>();

linkRoutes.use("*", requireAuth);

linkRoutes.get("/", async (c) => {
  const userId = c.get("userId");
  const { limit, cursor } = c.req.query();
  const result = await getUserLinks(userId, { limit: limit ? Number(limit) : undefined, cursor });
  return c.json(ok(result.links, { hasMore: result.hasMore }));
});

linkRoutes.post("/", zValidator("json", CreateLinkSchema), async (c) => {
  const userId = c.get("userId");
  const input = c.req.valid("json");
  try {
    const link = await createLink(userId, input);
    return c.json(ok(link), 201);
  } catch (e) {
    const error = e as Error & { status?: number };
    if (error.status === 409) return c.json(err("SLUG_TAKEN", error.message), 409);
    throw e;
  }
});

linkRoutes.get("/:id", async (c) => {
  const link = await getLinkById(c.req.param("id"), c.get("userId"));
  if (!link) return c.json(err("NOT_FOUND", "Link not found"), 404);
  return c.json(ok(link));
});

linkRoutes.patch("/:id", zValidator("json", UpdateLinkSchema), async (c) => {
  const userId = c.get("userId");
  const link = await updateLink(c.req.param("id"), userId, c.req.valid("json"));
  return c.json(ok(link));
});

linkRoutes.delete("/:id", async (c) => {
  await deleteLink(c.req.param("id"), c.get("userId"));
  return c.json(ok(null));
});

linkRoutes.get(
  "/check-slug",
  zValidator("query", z.object({ slug: z.string().min(3).max(30) })),
  async (c) => {
    const { slug } = c.req.valid("query");
    const { adminDb, Collections } = await import("../lib/firebase.js");
    const snap = await adminDb
      .collection(Collections.LINKS)
      .where("shortCode", "==", slug)
      .where("isDeleted", "==", false)
      .limit(1)
      .get();
    return c.json(ok({ available: snap.empty }));
  }
);

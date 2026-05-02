import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ok } from "@jorh/types";
import { buildWhatsAppLink, buildTweetIntent, buildLinkedInShare, addUtmParams, generateShortCode } from "@jorh/utils";
import { adminDb, Collections } from "../lib/firebase.js";
import { kvSet } from "../lib/kv.js";

export const toolRoutes = new Hono();

// Public guest URL shortener — creates anonymous links (no auth required)
toolRoutes.post(
  "/shorten",
  zValidator("json", z.object({ url: z.string().url("Must be a valid URL") })),
  async (c) => {
    const { url } = c.req.valid("json");
    const shortCode = generateShortCode();

    const existing = await adminDb
      .collection(Collections.LINKS)
      .where("shortCode", "==", shortCode)
      .limit(1)
      .get();

    const finalCode = existing.empty ? shortCode : generateShortCode();
    const now = new Date();

    const link = {
      ownerId: "anonymous",
      originalUrl: url,
      shortCode: finalCode,
      tags: [],
      type: "short" as const,
      clickCount: 0,
      isActive: true,
      isDeleted: false,
      domain: "jorh.net",
      createdAt: now,
      updatedAt: now,
    };

    const ref = adminDb.collection(Collections.LINKS).doc();
    await ref.set(link);
    await kvSet(finalCode, {
      id: ref.id,
      originalUrl: url,
      isActive: true,
      clickCount: 0,
    });

    const shortUrl = `https://jorh.net/${finalCode}`;
    return c.json(ok({ shortUrl, shortCode: finalCode }), 201);
  }
);

toolRoutes.post(
  "/whatsapp",
  zValidator("json", z.object({ phone: z.string().min(7), message: z.string().max(4096).optional() })),
  (c) => {
    const { phone, message } = c.req.valid("json");
    return c.json(ok({ url: buildWhatsAppLink(phone, message) }));
  }
);

toolRoutes.post(
  "/tweet-intent",
  zValidator("json", z.object({ text: z.string().max(280), url: z.string().url().optional(), via: z.string().optional() })),
  (c) => {
    const { text, url, via } = c.req.valid("json");
    return c.json(ok({ url: buildTweetIntent(text, url, via) }));
  }
);

toolRoutes.post(
  "/linkedin-share",
  zValidator("json", z.object({ url: z.string().url() })),
  (c) => {
    const { url } = c.req.valid("json");
    return c.json(ok({ url: buildLinkedInShare(url) }));
  }
);

toolRoutes.post(
  "/utm-builder",
  zValidator(
    "json",
    z.object({
      url: z.string().url(),
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
  ),
  (c) => {
    const { url, ...params } = c.req.valid("json");
    return c.json(ok({ url: addUtmParams(url, params) }));
  }
);

toolRoutes.get(
  "/og-preview",
  zValidator("query", z.object({ url: z.string().url() })),
  async (c) => {
    const { url } = c.req.valid("query");
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const html = await res.text();

      const getMeta = (property: string) => {
        const match =
          html.match(new RegExp(`<meta[^>]+property=["']og:${property}["'][^>]+content=["']([^"']+)["']`)) ??
          html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${property}["']`));
        return match?.[1] ?? null;
      };

      const getTitleFallback = () => html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] ?? null;

      return c.json(
        ok({
          title: getMeta("title") ?? getTitleFallback(),
          description: getMeta("description"),
          image: getMeta("image"),
          siteName: getMeta("site_name"),
          url: getMeta("url") ?? url,
        })
      );
    } catch {
      return c.json(ok({ title: null, description: null, image: null, siteName: null, url }));
    }
  }
);

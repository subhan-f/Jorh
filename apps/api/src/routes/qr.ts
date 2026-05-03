import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { generateQrDataUrl, generateQrSvg } from "../services/qr.service.js";
import { createLink } from "../services/link.service.js";
import { requireAuth } from "../middleware/auth.js";
import { ok } from "@jorh/types";
import { env } from "../env.js";
import type { HonoEnv } from "../types.js";

export const qrRoutes = new Hono<HonoEnv>();

const QrSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  format: z.enum(["dataurl", "svg"]).default("dataurl"),
  width: z.coerce.number().min(100).max(1000).default(400),
  darkColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#000000"),
  lightColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF"),
  errorLevel: z.enum(["L", "M", "Q", "H"]).default("M"),
});

// Anonymous QR generation — no auth, no persistence (used by marketing site)
qrRoutes.post("/generate", zValidator("json", QrSchema), async (c) => {
  const { url, format, width, darkColor, lightColor, errorLevel } = c.req.valid("json");

  const opts = {
    width,
    color: { dark: darkColor, light: lightColor },
    errorCorrectionLevel: errorLevel,
  };

  if (format === "svg") {
    const svg = await generateQrSvg(url, opts);
    return c.json(ok({ format: "svg", data: svg }));
  }

  const dataUrl = await generateQrDataUrl(url, opts);
  return c.json(ok({ format: "dataurl", data: dataUrl }));
});

const QrCreateSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  title: z.string().max(100).optional(),
  darkColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#000000"),
  lightColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF"),
  errorLevel: z.enum(["L", "M", "Q", "H"]).default("M"),
  width: z.coerce.number().min(100).max(1000).default(400),
  customSlug: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9-]+$/)
    .optional(),
});

// Auth-required QR creation — creates a tracked link + returns QR image
qrRoutes.post("/create", requireAuth, zValidator("json", QrCreateSchema), async (c) => {
  const userId = c.get("userId");
  const { url, title, darkColor, lightColor, errorLevel, width, customSlug } = c.req.valid("json");

  const link = await createLink(userId, {
    originalUrl: url,
    type: "qr",
    title,
    customSlug,
    tags: [],
  });

  const qrTargetUrl = `${env.REDIRECT_BASE_URL}/${link.shortCode}`;
  const dataUrl = await generateQrDataUrl(qrTargetUrl, {
    width,
    color: { dark: darkColor, light: lightColor },
    errorCorrectionLevel: errorLevel,
  });

  return c.json(ok({ link, qrDataUrl: dataUrl }), 201);
});

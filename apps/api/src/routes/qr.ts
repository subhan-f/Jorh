import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { generateQrDataUrl, generateQrSvg } from "../services/qr.service.js";
import { ok } from "@jorh/types";

export const qrRoutes = new Hono();

const QrSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  format: z.enum(["dataurl", "svg"]).default("dataurl"),
  width: z.coerce.number().min(100).max(1000).default(400),
  darkColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#000000"),
  lightColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF"),
  errorLevel: z.enum(["L", "M", "Q", "H"]).default("M"),
});

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

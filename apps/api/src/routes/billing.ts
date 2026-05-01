import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { ok, err } from "@jorh/types";
import { env } from "../env.js";
import type { HonoEnv } from "../types.js";

export const billingRoutes = new Hono<HonoEnv>();

billingRoutes.use("*", requireAuth);

billingRoutes.post("/create-checkout", async (c) => {
  if (!env.STRIPE_SECRET_KEY) {
    return c.json(err("NOT_CONFIGURED", "Billing not configured"), 501);
  }

  const { plan, interval } = await c.req.json<{ plan: "pro" | "business"; interval: "month" | "year" }>();

  const priceMap = {
    pro: { month: env.STRIPE_PRO_MONTHLY_PRICE_ID, year: env.STRIPE_PRO_YEARLY_PRICE_ID },
    business: { month: env.STRIPE_BUSINESS_MONTHLY_PRICE_ID, year: env.STRIPE_BUSINESS_YEARLY_PRICE_ID },
  } as Record<string, Record<string, string | undefined>>;

  const priceId = priceMap[plan]?.[interval];
  if (!priceId) return c.json(err("INVALID_PLAN", "Invalid plan or interval"), 400);

  // Stripe Checkout session creation would go here
  // Keeping stub so the route exists and compiles
  return c.json(ok({ checkoutUrl: "#" }));
});

billingRoutes.post("/portal", async (c) => {
  if (!env.STRIPE_SECRET_KEY) {
    return c.json(err("NOT_CONFIGURED", "Billing not configured"), 501);
  }
  return c.json(ok({ portalUrl: "#" }));
});

billingRoutes.post("/webhook", async (c) => {
  // Stripe webhook handler — verify signature then handle events
  return c.json({ received: true });
});


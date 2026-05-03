import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { env } from "./env.js";
import { errorMiddleware } from "./middleware/error.js";
import { authRoutes } from "./routes/auth.js";
import { linkRoutes } from "./routes/links.js";
import { analyticsRoutes } from "./routes/analytics.js";
import { qrRoutes } from "./routes/qr.js";
import { toolRoutes } from "./routes/tools.js";
import { billingRoutes } from "./routes/billing.js";
import { adminRoutes } from "./routes/admin.js";

const app = new Hono();

app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: env.CORS_ORIGINS,
    allowHeaders: ["Authorization", "Content-Type", "X-Internal-Key"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/health", (c) => c.json({ status: "ok", ts: Date.now(), env: env.NODE_ENV }));

app.route("/auth", authRoutes);
app.route("/links", linkRoutes);
app.route("/analytics", analyticsRoutes);
app.route("/qr", qrRoutes);
app.route("/tools", toolRoutes);
app.route("/billing", billingRoutes);
app.route("/admin", adminRoutes);

app.onError(errorMiddleware);
app.notFound((c) =>
  c.json({ data: null, error: { code: "NOT_FOUND", message: "Route not found" } }, 404)
);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  process.stdout.write(`🚀 API running at http://localhost:${info.port}\n`);
});

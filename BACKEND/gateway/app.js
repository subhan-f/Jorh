import Express from "express";
import expressProxy from "express-http-proxy";
import morgan from "morgan";
import { getHealthResponse } from "./src/healthCheck.js";
import { services } from "./src/services.js";

const app = Express();
const port = 3000;

app.use(morgan("dev"));

app.use(
  "/api/auth",
  expressProxy(new URL(services.authService.devUrl), {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);
app.use(
  "/api/profile",
  expressProxy(new URL(services.authService.devUrl), {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);
app.use(
  "/api/links",
  expressProxy(new URL(services.linksService.devUrl), {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);
app.use(
  "/:slug",
  expressProxy(new URL(services.redirectService.devUrl), {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);

app.use(
  "/api/analytics",
  expressProxy(new URL(services.analyticsService.devUrl), {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);

app.use(
  "/api/clicks",
  expressProxy(new URL(services.analyticsService.devUrl), {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);

// Health check endpoint
app.get("/health", async (req, res) => {
  const { statusCode, body } = await getHealthResponse();
  res.status(statusCode).json(body);
});

// Simple ping endpoint for quick checks
app.get("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Gateway is running at http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🏓 Ping: http://localhost:${port}/ping`);
});

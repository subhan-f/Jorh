import { createProxyMiddleware } from "http-proxy-middleware";

/**
 * Creates a proxy middleware that forwards requests to the target service.
 * The full request path is preserved as-is.
 *
 * @param {string} target - Base URL of the downstream service
 */
export function createProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        proxyReq.path = req.originalUrl;
      },
      error: (err, req, res) => {
        console.error(`[proxy] ${target} unreachable:`, err.message);
        res.status(502).json({ success: false, message: "Service temporarily unavailable" });
      },
    },
  });
}

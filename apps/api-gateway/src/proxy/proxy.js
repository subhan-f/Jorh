import { createProxyMiddleware } from "http-proxy-middleware";
import logger from "../config/logger.js";

export function createProxy(target) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        proxyReq.path = req.originalUrl;
      },
      error: (err, _req, res) => {
        logger.error({ target, err: err.message }, "proxy error — service unreachable");
        res.status(502).json({ success: false, message: "Service temporarily unavailable" });
      },
    },
  });
}

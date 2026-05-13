import pino from "pino";
import pinoHttp from "pino-http";

export function createLogger(service) {
  const isDev = process.env.NODE_ENV !== "production";

  return pino({
    name: service,
    level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
    ...(isDev && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
          messageFormat: `[${service}] {msg}`,
        },
      },
    }),
  });
}

export function createHttpLogger(logger) {
  return pinoHttp({
    logger,
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    serializers: {
      req: (req) => ({ method: req.method, url: req.url }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    // Skip health check noise
    autoLogging: { ignore: (req) => req.url === "/health" },
  });
}

// src/middlewares/requestLogger.middleware.js
import pinoHttp from "pino-http";
import { logger } from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";

export const requestLogger = pinoHttp({
  logger,

  reqIdKey: "requestId",
  genReqId: (req) => req.headers["x-request-id"] || uuidv4(),

  autoLogging: {
    ignore: (req) => req.url === "/health",
  },

  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  serializers: {
    req: () => undefined, // removes the nested 'req' object entirely
    res: () => undefined, // removes the nested 'res' object entirely
  },

  customProps: (req, res) => {
    const props = {
      method: req.method,
      url: req.originalUrl || req.url,
      requestId: req.id,
      ip: req.ip,
      statusCode: res.statusCode,
      reqBody: req.body,
    };

    if (req.error) {
      const err = req.error;
      props.status = err.status;
      props.isOperational = err.isOperational;
      props.message = err.message;

      if (process.env.NODE_ENV !== "production") {
        props.stack = err.stack;
      }
    }

    return props;
  },
  customSuccessMessage: (req, res) => {
    return `(${res.statusCode}) ${req.method} ${req.originalUrl}`;
  },
  customErrorMessage: (req, res, err) => {
    return `(${res.statusCode}) ${req.method} ${req.originalUrl}`;
  },
});

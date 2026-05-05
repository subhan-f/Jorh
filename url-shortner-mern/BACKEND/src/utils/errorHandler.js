// src/utils/errorHandler.js
import { AppError } from "./AppError.js";

export const errorHandler = (err, req, res, next) => {
  // Attach default status if not set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // 1. Log the error with request context
  req.error = err; // <-- this is new

  // 2. Send safe response to client
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

  // Development or operational errors
  const response = {
    success: false,
    message: err.message,
    status: err.status,
    statusCode: err.statusCode,
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  return res.status(err.statusCode).json(response);
};

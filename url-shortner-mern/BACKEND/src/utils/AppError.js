import { logger } from "./logger.js";

/**
 * Base custom application error.
 * All operational errors (e.g., validation, not found) extend this class.
 * Programmer errors should have isOperational = false.
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message (safe for clients if operational)
   * @param {number} statusCode - HTTP status code
   * @param {boolean} [isOperational=true] - Whether the error is expected/operational
   */
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;
    // Capture the stack trace excluding the constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Log the error using the application logger.
   * - Operational errors are logged as warnings (they are expected).
   * - Programmer/unknown errors are logged as errors with full stack.
   * @param {object} [context={}] - Additional metadata (e.g., request ID, user ID)
   */
  log(context = {}) {
    const logPayload = {
      ...context,
      statusCode: this.statusCode,
      status: this.status,
      isOperational: this.isOperational,
      message: this.message,
      stack: this.stack,
    };

    if (this.isOperational) {
      logger.warn(logPayload, `⚠️ Operational Error: ${this.message}`);
    } else {
      logger.error(logPayload, `🔥 Non-operational Error: ${this.message}`);
    }
  }

  /**
   * Return a safe object for the error response.
   * In production, non-operational errors only expose a generic message.
   * @returns {{ success: boolean, message: string, statusCode: number, status: string }}
   */
  toSafeObject() {
    const isProduction = process.env.NODE_ENV === "production";
    const message = isProduction && !this.isOperational ? "Internal Server Error" : this.message;

    return {
      success: false,
      message,
      statusCode: this.statusCode,
      status: this.status,
    };
  }

  /**
   * JSON serializer used by Express when sending error objects.
   * Avoids leaking sensitive stack traces.
   */
  toJSON() {
    return this.toSafeObject();
  }
}

// ------------------------------------------------------------------
// Specific error subclasses – utilize the base class properties.
// ------------------------------------------------------------------

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class InternalServerError extends AppError {
  /**
   * Internal server errors are usually non-operational.
   * @param {string} [message="Internal server error"]
   */
  constructor(message = "Internal server error") {
    super(message, 500, false); // isOperational = false
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 422);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests, please try again later") {
    super(message, 429);
  }
}

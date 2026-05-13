// ─── Error Classes ────────────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") { super(message, 400); }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") { super(message, 401); }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") { super(message, 403); }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") { super(message, 404); }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") { super(message, 409); }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") { super(message, 422); }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = "Service temporarily unavailable") { super(message, 503); }
}

// ─── Express Error Handler ────────────────────────────────────────────────────

export function createErrorHandler(logger) {
  return (err, req, res, _next) => {
    const statusCode = err.statusCode ?? 500;
    const isOperational = err.isOperational ?? false;

    const meta = { err, req: { method: req.method, url: req.originalUrl } };

    if (!isOperational || statusCode >= 500) {
      logger.error(meta, err.message);
    } else {
      logger.warn({ err }, err.message);
    }

    res.status(statusCode).json({
      success: false,
      message: isOperational ? err.message : "Internal server error",
    });
  };
}

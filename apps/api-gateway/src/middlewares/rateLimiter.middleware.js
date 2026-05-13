import rateLimit from "express-rate-limit";

const limiterOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

// Applied to all routes
export const globalRateLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests, please try again later." },
});

// Stricter limit for auth endpoints (prevent brute-force)
export const authRateLimiter = rateLimit({
  ...limiterOptions,
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts, please try again later." },
});

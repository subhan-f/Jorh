const parseDurationToMs = (duration) => {
  const match = duration.match(/^(\d+)(ms|[smhdwyMY])$/);
  if (!match) throw new Error(`Invalid duration format: ${duration}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000, // approximate
    y: 365 * 24 * 60 * 60 * 1000, // approximate
  };

  if (!multipliers[unit]) throw new Error(`Unknown unit: ${unit}`);
  return value * multipliers[unit];
};

// Environment variables with defaults and validation
export const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is required");
}

export const DOMAIN = new URL(process.env.DOMAIN || "http://localhost:3000");

export const CORS_ORIGINS = process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : [];

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "your_jwt_secret";
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "1h";

export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret";
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// Cookie options – note: maxAge is in milliseconds
export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: parseDurationToMs(JWT_ACCESS_EXPIRES_IN),
};

// Optional: also create refresh cookie options
export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: parseDurationToMs(JWT_REFRESH_EXPIRES_IN),
};

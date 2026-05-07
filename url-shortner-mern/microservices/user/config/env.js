const parseDurationToMs = (duration) => {
  const match = duration.match(/^(\d+)([smhd]|ms)$/i);
  if (!match) throw new Error(`Invalid duration format: ${duration}`);

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "w":
      return value * 7 * 24 * 60 * 60 * 1000;
    case "M":
      return value * 30 * 24 * 60 * 60 * 1000;
    case "y":
      return value * 365 * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
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

import { createConfig, SERVICE_PORTS } from "@repo/shared-env";

export const env = createConfig(
  {
    PORT: process.env.AUTH_SERVICE_PORT ?? String(SERVICE_PORTS.AUTH_SERVICE),
    ...process.env,
  },
  { required: ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"] },
);

export const {
  PORT,
  MONGO_URI,
  NODE_ENV,
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  cookieOptions,
} = env;

export const ACCESS_COOKIE_OPTIONS = cookieOptions.access;
export const REFRESH_COOKIE_OPTIONS = cookieOptions.refresh;

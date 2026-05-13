import { createConfig, SERVICE_PORTS } from "@repo/shared-env";

export const env = createConfig(
  {
    PORT: process.env.LINKS_SERVICE_PORT ?? String(SERVICE_PORTS.LINKS_SERVICE),
    ...process.env,
  },
  { required: ["MONGO_URI", "RABBITMQ_URI"] },
);

export const {
  PORT,
  MONGO_URI,
  RABBITMQ_URI,
  DOMAIN,
  CORS_ORIGINS,
  NODE_ENV,
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  AUTH_SERVICE_URL,
  cookieOptions,
} = env;

export const ACCESS_COOKIE_OPTIONS = cookieOptions.access;
export const REFRESH_COOKIE_OPTIONS = cookieOptions.refresh;

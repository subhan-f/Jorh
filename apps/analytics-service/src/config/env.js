import { createConfig, SERVICE_PORTS } from "@repo/shared-env";

export const env = createConfig(
  {
    PORT: process.env.ANALYTICS_SERVICE_PORT ?? String(SERVICE_PORTS.ANALYTICS_SERVICE),
    ...process.env,
  },
  { required: ["MONGO_URI", "RABBITMQ_URI"] },
);

export const { PORT, MONGO_URI, RABBITMQ_URI, AUTH_SERVICE_URL, NODE_ENV, cookieOptions } = env;

export const ACCESS_COOKIE_OPTIONS = cookieOptions.access;

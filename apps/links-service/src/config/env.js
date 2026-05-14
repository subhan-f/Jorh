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
  AUTH_SERVICE_URL,
} = env;

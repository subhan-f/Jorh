import { createConfig, SERVICE_PORTS } from "@repo/shared-env";

export const env = createConfig(
  {
    PORT: process.env.API_GATEWAY_PORT ?? String(SERVICE_PORTS.API_GATEWAY),
    ...process.env,
  },
  {},
);

export const {
  PORT,
  NODE_ENV,
  CORS_ORIGINS,
  AUTH_SERVICE_URL,
  LINKS_SERVICE_URL,
  ANALYTICS_SERVICE_URL,
  REDIRECT_SERVICE_URL,
} = env;

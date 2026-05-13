import { createConfig, SERVICE_PORTS } from "@repo/shared-env";

export const env = createConfig(
  {
    PORT: process.env.REDIRECT_SERVICE_PORT ?? String(SERVICE_PORTS.REDIRECT_SERVICE),
    ...process.env,
  },
  { required: ["MONGO_URI", "RABBITMQ_URI"] },
);

export const { PORT, MONGO_URI, RABBITMQ_URI } = env;

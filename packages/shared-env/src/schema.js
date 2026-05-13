/**
 * Single source of truth for service port assignments.
 * Import this anywhere you need a port number or to build a service URL.
 */
export const SERVICE_PORTS = Object.freeze({
  API_GATEWAY: 3000,
  AUTH_SERVICE: 3001,
  LINKS_SERVICE: 3002,
  ANALYTICS_SERVICE: 3003,
  REDIRECT_SERVICE: 3004,
});

const host = "http://localhost";

/**
 * Platform-wide environment variable definitions.
 * Each service selectively declares which keys it requires via createConfig({ required: [...] }).
 */
export const ENV_SCHEMA = {
  // Server
  NODE_ENV: { default: "development" },
  PORT: { default: String(SERVICE_PORTS.API_GATEWAY) },

  // Database
  MONGO_URI: { default: null },

  // Messaging
  RABBITMQ_URI: { default: null },

  // JWT
  JWT_ACCESS_SECRET: { default: "dev-access-secret" },
  JWT_ACCESS_EXPIRES_IN: { default: "1h" },
  JWT_REFRESH_SECRET: { default: "dev-refresh-secret" },
  JWT_REFRESH_EXPIRES_IN: { default: "7d" },

  // App
  DOMAIN: { default: `${host}:${SERVICE_PORTS.API_GATEWAY}` },
  CORS_ORIGINS: { default: "[]" },

  // Inter-service URLs — derived from the port registry
  AUTH_SERVICE_URL: { default: `${host}:${SERVICE_PORTS.AUTH_SERVICE}` },
  LINKS_SERVICE_URL: { default: `${host}:${SERVICE_PORTS.LINKS_SERVICE}` },
  ANALYTICS_SERVICE_URL: { default: `${host}:${SERVICE_PORTS.ANALYTICS_SERVICE}` },
  REDIRECT_SERVICE_URL: { default: `${host}:${SERVICE_PORTS.REDIRECT_SERVICE}` },
};

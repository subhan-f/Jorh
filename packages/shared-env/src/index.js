import { ENV_SCHEMA, SERVICE_PORTS } from "./schema.js";

export { SERVICE_PORTS };
import { parseDurationToMs, createCookieOptions } from "./validators.js";

export { parseDurationToMs, createCookieOptions, ENV_SCHEMA };

/**
 * Build a validated, frozen config object from environment variables.
 *
 * @param {object} [rawEnv=process.env]  - Source of env vars (defaults to process.env)
 * @param {object} [options]
 * @param {string[]} [options.required=[]] - Keys that must be present for this service
 *
 * @example
 * // links-service startup
 * const env = createConfig(process.env, { required: ['MONGO_URI', 'RABBITMQ_URL'] });
 */
export function createConfig(rawEnv = process.env, { required = [] } = {}) {
  const config = {};

  for (const [key, def] of Object.entries(ENV_SCHEMA)) {
    const value = rawEnv[key];
    const isRequired = required.includes(key);

    if (value === undefined || value === "") {
      if (isRequired) {
        throw new Error(`[shared-env] Missing required environment variable: ${key}`);
      }
      config[key] = def.default;
    } else {
      config[key] = value;
    }
  }

  // Transform known fields
  config.PORT = Number(config.PORT);
  config.DOMAIN = new URL(config.DOMAIN);
  config.CORS_ORIGINS = (() => {
    try {
      return JSON.parse(config.CORS_ORIGINS);
    } catch {
      return [];
    }
  })();

  config.cookieOptions = createCookieOptions(
    config.JWT_ACCESS_EXPIRES_IN,
    config.JWT_REFRESH_EXPIRES_IN,
    config.NODE_ENV,
  );

  return Object.freeze(config);
}

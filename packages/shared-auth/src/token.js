import jwt from "jsonwebtoken";

/**
 * Factory that binds JWT helpers to the secrets/expiry values from your service's env config.
 *
 * @param {object} config - Config produced by createConfig() from @repo/shared-env
 * @returns {{ generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken }}
 *
 * @example
 * const env = createConfig(process.env, { required: ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] });
 * const { generateAccessToken, verifyAccessToken } = createTokenHelpers(env);
 */
export function createTokenHelpers(config) {
  const {
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN = "1h",
    JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN = "7d",
  } = config;

  if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("[shared-auth] JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are required");
  }

  const generateAccessToken = (user) =>
    jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_ACCESS_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRES_IN },
    );

  const generateRefreshToken = (user) =>
    jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN },
    );

  const verifyAccessToken = (token) => {
    try {
      return jwt.verify(token, JWT_ACCESS_SECRET);
    } catch {
      return null;
    }
  };

  const verifyRefreshToken = (token) => {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch {
      return null;
    }
  };

  return { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
}

import { createTokenHelpers } from "@repo/shared-auth";
import { env } from "./env.js";

export const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = createTokenHelpers(env);

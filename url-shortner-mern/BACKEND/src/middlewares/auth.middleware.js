import { findUserById } from "../dao/user.dao.js";
import { verifyAccessToken, verifyRefreshToken } from "../utils/helper.js";
import { UnauthorizedError } from "../utils/AppError.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  try {
    const decoded = await verifyAccessToken(token);
    if (!decoded) {
      throw new UnauthorizedError("Invalid or expired token");
    }
    const user = await findUserById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("Unauthorized: User not found");
    }
    const { _id, email, name, avatar } = user;
    req.user = { id: _id, email, name, avatar };
    next();
  } catch (err) {
    throw new UnauthorizedError("Authentication failed", err);
  }
};

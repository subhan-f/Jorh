import { verifyAccessToken } from "../config/tokens.js";
import BlackListToken from "../models/blackListToken.model.js";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const isBlacklisted = await BlackListToken.findOne({ token });
    if (isBlacklisted) {
      res.clearCookie("accessToken");
      return res.status(401).json({ success: false, message: "Token has been revoked" });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[auth-middleware] error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

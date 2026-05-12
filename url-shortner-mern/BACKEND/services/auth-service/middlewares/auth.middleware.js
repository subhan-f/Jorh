import { verifyAccessToken } from "../utils/token.js";
import blackListTokenModel from "../models/blackListToken.model.js";
import userModel from "../models/user.model.js";
import { ACCESS_COOKIE_OPTIONS } from "../config/env.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const blackListToken = await blackListTokenModel.findOne({ token });

    if (blackListToken && blackListToken.token === token) {
      res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

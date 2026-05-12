import { ACCESS_COOKIE_OPTIONS } from "../config/env.js";
import axios from "axios";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    try {
      const profileResponse = await axios.get("http://localhost:3001/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      req.user = profileResponse.data.result;
      next();
    } catch (axiosError) {
      if (axiosError.response?.status === 401) {
        res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
        return res.status(401).json({
          message: "Invalid or expired token",
        });
      }

      console.error("User service error:", axiosError.message);
      return res.status(503).json({ message: "User service unavailable" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

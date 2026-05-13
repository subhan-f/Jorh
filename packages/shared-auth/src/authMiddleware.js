import axios from "axios";

/**
 * Express middleware factory for services that delegate auth to the auth-service.
 * The auth-service validates the token and returns the user profile.
 *
 * @param {string} authServiceUrl - Base URL of the auth-service
 */
export function createAuthMiddleware(authServiceUrl = "http://localhost:3001") {
  return async (req, res, next) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }

      const { data } = await axios.get(`${authServiceUrl}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      req.user = data.result;
      next();
    } catch (err) {
      if (err.response?.status === 401) {
        res.clearCookie("accessToken");
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
      }
      if (err.response) {
        console.error("[shared-auth] auth service error:", err.message);
        return res.status(503).json({ success: false, message: "Auth service unavailable" });
      }
      console.error("[shared-auth] unexpected error:", err.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}

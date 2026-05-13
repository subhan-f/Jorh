import authService from "../services/auth.service.js";
import { ACCESS_COOKIE_OPTIONS } from "../config/env.js";

class AuthController {
  handleRegister = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const userData = await authService.register(name, email, password);
      res.cookie("accessToken", userData.accessToken, ACCESS_COOKIE_OPTIONS);
      res.status(201).json({ success: true, message: "Registration successful", result: userData });
    } catch (err) {
      next(err);
    }
  };

  handleLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);
      res.cookie("accessToken", userData.accessToken, ACCESS_COOKIE_OPTIONS);
      res.status(200).json({ success: true, message: "Login successful", result: userData });
    } catch (err) {
      next(err);
    }
  };

  handleLogout = async (req, res, next) => {
    try {
      await authService.logout(req.cookies.accessToken);
      res.clearCookie("accessToken");
      res.status(200).json({ success: true, message: "Logout successful" });
    } catch (err) {
      next(err);
    }
  };
}

const authController = new AuthController();
export default authController;

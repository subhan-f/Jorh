import authService from "../services/auth.service.js";
import { ACCESS_COOKIE_OPTIONS } from "../config/env.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { accessToken, ...userData } = await authService.register(name, email, password);
    res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
    res.status(201).json({
      success: true,
      message: "Registration successful",
      result: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, ...userData } = await authService.login(email, password);
    res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);
    res.status(200).json({
      success: true,
      message: "Login successful",
      result: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const result = await authService.logout(req.cookies.accessToken);
    res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

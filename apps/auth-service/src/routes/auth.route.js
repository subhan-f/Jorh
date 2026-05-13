import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", authController.handleRegister);
authRouter.post("/login", authController.handleLogin);
authRouter.post("/logout", authMiddleware, authController.handleLogout);

export default authRouter;

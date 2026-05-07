import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUserProfile } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/profile", authMiddleware, getUserProfile);

export default userRouter;

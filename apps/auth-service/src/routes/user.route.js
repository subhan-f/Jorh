import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/profile", authMiddleware, userController.handleGetProfile);
userRouter.patch("/profile", authMiddleware, userController.handleUpdateProfile);

export default userRouter;

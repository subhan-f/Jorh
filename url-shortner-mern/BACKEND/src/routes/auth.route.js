import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);

export default router;

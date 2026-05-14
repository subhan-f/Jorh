import { Router } from "express";
import clickController from "../controllers/click.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:slug", authMiddleware, clickController.handleGetClicks);

export default router;

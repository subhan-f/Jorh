import { Router } from "express";
import linkStatsController from "../controllers/linkStats.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:slug", authMiddleware, linkStatsController.handleGetStats);

export default router;

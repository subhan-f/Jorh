import { Router } from "express";
import { getStats } from "../controllers/linkStats.controller.js";

const linkStatsRoutes = Router();

// GET /api/analytics/:slug  → require auth + ownership
linkStatsRoutes.get("/:slug", getStats);

export default linkStatsRoutes;

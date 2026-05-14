import express from "express";
import clickRoutes from "./click.routes.js";
import linkStatsRoutes from "./linkStats.routes.js";

const router = express.Router();

router.use("/clicks", clickRoutes);
router.use("/stats", linkStatsRoutes);

export default router;

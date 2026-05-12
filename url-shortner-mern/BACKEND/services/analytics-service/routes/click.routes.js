import { Router } from "express";
import clickController from "../controllers/click.controller.js";

const router = Router();

router.get("/:slug", clickController.handleGetClicks);

router.post("/", clickController.handleRecordClick);
router.post("/:slug", clickController.handleRecordClick);

export default router;

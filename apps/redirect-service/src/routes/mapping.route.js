import { Router } from "express";
import mappingController from "../controllers/mapping.controller.js";

const router = Router();

router.post("/mappings", mappingController.handleCreateMapping);
router.patch("/mappings/:slug", mappingController.handleUpdateMapping);
router.delete("/mappings/:slug", mappingController.handleDeleteMapping);

export default router;

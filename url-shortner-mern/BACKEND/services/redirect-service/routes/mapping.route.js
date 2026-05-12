import express from "express";
import mappingController from "../controllers/mapping.controller.js";
import redirectController from "../controllers/redirect.controller.js";

const router = express.Router();

router.post("/mappings", mappingController.handleCreateMapping);
router.patch("/mappings/:slug", mappingController.handleUpdateMapping);
router.delete("/mappings/:slug", mappingController.handleDeleteMapping);

export default router;

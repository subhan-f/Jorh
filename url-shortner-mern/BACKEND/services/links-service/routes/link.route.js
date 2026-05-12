import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import linkController from "../controllers/link.controller.js";

const linksRouter = Router();

// Get all links for the authenticated user
linksRouter.get("/", authMiddleware, linkController.handleGetLinks);

// Create a new short link
linksRouter.post("/", authMiddleware, linkController.handleCreateLink);

// Get a single link by slug
linksRouter.get("/:slug", authMiddleware, linkController.handleGetLink);

// PATCH to update
linksRouter.patch("/:slug", authMiddleware, linkController.handleUpdateLink);

// Delete a link
linksRouter.delete("/:slug", authMiddleware, linkController.handleDeleteLink);

export default linksRouter;

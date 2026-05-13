import { Router } from "express";
import { AUTH_SERVICE_URL } from "../config/env.js";
import { createAuthMiddleware } from "@repo/shared-auth";

import linkController from "../controllers/link.controller.js";

const authMiddleware = createAuthMiddleware(AUTH_SERVICE_URL);

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

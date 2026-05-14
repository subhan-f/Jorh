import { Router } from "express";
import { AUTH_SERVICE_URL } from "../config/env.js";
import { createAuthMiddleware } from "@repo/shared-auth";

import linkController from "../controllers/link.controller.js";

const authMiddleware = createAuthMiddleware(AUTH_SERVICE_URL);

const linksRouter = Router();

// GET all links for the authenticated user
linksRouter.get("/", authMiddleware, linkController.handleGetLinks);

// GET a single link by slug
linksRouter.get("/:slug", authMiddleware, linkController.handleGetLink);

// POST to create a new short link
linksRouter.post("/", authMiddleware, linkController.handleCreateLink);

// PATCH to update short link details
linksRouter.patch("/:slug", authMiddleware, linkController.handleUpdateLink);

// DELETE to delete a short link
linksRouter.delete("/:slug", authMiddleware, linkController.handleDeleteLink);

export default linksRouter;

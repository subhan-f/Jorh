import express from "express";
import ShortUrlController from "../controllers/shorturl.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.post("/shorturls", ShortUrlController.createShortUrl);
router.post("/shorturls", authMiddleware, ShortUrlController.createShortUrl);

export default router;

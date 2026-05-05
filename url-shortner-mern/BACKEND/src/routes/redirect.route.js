import express from "express";
import ShortUrlController from "../controllers/shorturl.controller.js";

const router = express.Router();

router.get("/:shortId", ShortUrlController.redirectToOriginalUrl);

export default router;

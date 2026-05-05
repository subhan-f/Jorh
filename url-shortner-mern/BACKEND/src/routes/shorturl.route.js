import express from "express";
import ShortUrlController from "../controllers/shorturl.controller.js";

const router = express.Router();

router.post("/create", ShortUrlController.createShortUrl);

export default router;

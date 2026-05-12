import express from "express";
import linkRouter from "./link.route.js";

const router = express.Router();

router.use("/links", linkRouter);

export default router;

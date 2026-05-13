import express from "express";
import mappingRouter from "./mapping.route.js";

const router = express.Router();

router.use("/", mappingRouter);

export default router;

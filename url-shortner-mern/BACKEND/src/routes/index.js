import { Router } from "express";
import shortUrlRouter from "./shorturl.route.js";
import redirectRouter from "./redirect.route.js";
import authRouter from "./auth.route.js";

const ShortUrlRouter = Router();

ShortUrlRouter.use("/api", shortUrlRouter, authRouter);
ShortUrlRouter.use("/", redirectRouter);

export default ShortUrlRouter;

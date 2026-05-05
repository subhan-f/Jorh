import { Router } from "express";
import shortUrlRouter from "./shorturl.route.js";
import redirectRouter from "./redirect.route.js";

const ShortUrlRouter = Router();

ShortUrlRouter.use("/api", shortUrlRouter);
ShortUrlRouter.use("/", redirectRouter);

export default ShortUrlRouter;

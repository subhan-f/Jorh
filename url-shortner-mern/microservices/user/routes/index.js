// routes/index.js
import express from "express";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);

export default apiRouter;

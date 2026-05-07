import dotenv from "dotenv/config";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { MONGO_URI } from "./config/env.js";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

const app = express();

connectDB(MONGO_URI);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", routes);

export default app;

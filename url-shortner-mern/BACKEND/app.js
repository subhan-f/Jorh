import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv/config";

import { CORS_ORIGINS, MONGO_URI, DOMAIN } from "./src/config/env.config.js";
import connectDB from "./src/config/mongodb.config.js";
import urlSchema from "./src/models/shorturl.model.js";
import routes from "./src/routes/index.js";
import { requestLogger } from "./src/middlewares/requestLogger.middleware.js";
import { errorHandler } from "./src/utils/errorHandler.js";

const app = express();

app.use(requestLogger);

app.use(
  cors({
    origin: CORS_ORIGINS,
    methods: "GET,POST,PUT,PATCH,DELETE",
  })
);

app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", routes);

app.use(errorHandler);

app.listen(DOMAIN.port, () => {
  connectDB(MONGO_URI);
  console.log(`Server is running on port ${DOMAIN.port}`);
});

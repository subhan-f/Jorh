import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { v4 as uuidv4 } from "uuid";

import connectDB from "./src/config/mongodb.config.js";
import urlSchema from "./src/models/shorturl.model.js";
import routes from "./src/routes/index.js";
import { requestLogger } from "./src/middlewares/requestLogger.middleware.js";
import { errorHandler } from "./src/utils/errorHandler.js";

const DOMAIN = new URL(process.env.DOMAIN || "http://localhost:3000");
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.use(errorHandler);

app.listen(DOMAIN.port, () => {
  connectDB(MONGO_URI);
  console.log(`Server is running on port ${DOMAIN.port}`);
});

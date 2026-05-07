import express from "express";
import expressProxy from "express-http-proxy";

const app = express();
const port = 3000;

app.use("/api", expressProxy("http://localhost:3001"));

app.listen(port, () => {
  console.log(`Gateway listening at http://localhost:${port}`);
});

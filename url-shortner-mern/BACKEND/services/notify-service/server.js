import http from "http";
import app from "./app.js";

const server = http.createServer(app);

server.listen(3002, () => {
  console.log("User service listening on port 3001");
});

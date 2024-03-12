const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", () => {
  console.log("New WebSocket Connection");
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is Listening on PORT ${PORT} in Dev mode`);
});
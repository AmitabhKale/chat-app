const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("New WebSocket Connection");

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", formatMessage("Welcome", "Bot"));

    socket.broadcast
      .to(room)
      .emit("message", formatMessage(`${username} has joined!`, "Bot"));
  });

  // socket.broadcast.emit(
  //   "message",
  //   formatMessage("A new User has Joined", "Bot")
  // );

  socket.on("sendMessage", (msg) => {
    io.emit("message", formatMessage(msg, "Jack"));
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is Listening on PORT ${PORT} in Dev mode`);
});

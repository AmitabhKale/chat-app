const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("New WebSocket Connection");

  socket.on("join", ({ username, room }) => {
    const { user } = addUser({ id: socket.id, username, room });

    socket.join(user.room);

    socket.emit("message", formatMessage("Welcome", "Bot"));

    socket.broadcast
      .to(room)
      .emit("message", formatMessage(`${user.username} has joined!`, "Bot"));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  // socket.broadcast.emit(
  //   "message",
  //   formatMessage("A new User has Joined", "Bot")
  // );

  socket.on("sendMessage", (msg) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", formatMessage(msg, user.username));
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(`${user.username} has left the group`, "ADMIN")
      );
    }
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is Listening on PORT ${PORT} in Dev mode`);
});

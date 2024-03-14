const socket = io();

socket.on("message", (msg) => {
  console.log(`New Message:  ${msg.text}`);
  outputMessage(msg);
});

socket.on("roomData", ({ room, users }) => {
  // console.log(room, users);
  listUsersofRooms(users);
  showRoomName(room);
});

document.querySelector("#message_form").addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.message_input.value;

  e.target.elements.message_input.focus();
  e.target.elements.message_input.value = "";

  socket.emit("sendMessage", msg);
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.className = "chat-message";
  div.innerHTML = `<p>
  <span class="message-user">${message.username}</span>
  <span class="message-date">${message.time}</span>
  <p>
  <p>${message.text}</p>
  `;

  document.getElementById("messages").appendChild(div);
}

function listUsersofRooms(users) {
  const userList = document.getElementById("roomUsers");
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

function showRoomName(room) {
  document.getElementById("roomName").textContent = `${room} users`;
}

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// console.log(username, room);
socket.emit("join", { username, room });

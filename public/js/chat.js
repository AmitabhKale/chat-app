const socket = io();

socket.on("message", (msg) => {
  console.log(`New Message:  ${msg}`);
  outputMessage(msg);
});

document.querySelector("#message_form").addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.message_input.value;

  e.target.elements.message_input.focus();

  socket.emit("sendMessage", msg);
});

function outputMessage(message) {
  const testUser = {
    name: "John",
    text: "Blh blah blah",
    createdAt: "9:12pm",
  };

  const div = document.createElement("div");
  div.className = "chat-message";
  div.innerHTML = `<p>
  <span class="message-user">${testUser.name}</span>
  <span class="message-date">${testUser.createdAt}</span>
  <p>
  <p>${message}</p>
  `;

  document.getElementById("messages").appendChild(div);
}

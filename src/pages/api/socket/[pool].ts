import { Server } from "socket.io";
// import onSocketConnection from "../../helpers/onSocketConnection";

const onSocketConnection = (io, socket) => {
  const sayTextFromUrl = (msg) => {
    console.log("New message", msg);
    socket.broadcast.emit("newSayTextFromUrl", msg);
  };
  const triggerAnimationName = (msg) => {
    console.log("New message", msg);
    socket.broadcast.emit("newTriggerAnimationName", msg);
  };

  socket.on("sayTextFromUrl", sayTextFromUrl);
  socket.on("triggerAnimationName", triggerAnimationName);
};

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Server already started!");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket/avatar",
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  const onConnection = (socket) => {
    console.log("New connection", socket.id);
    onSocketConnection(io, socket);
  };

  io.on("connection", onConnection);

  console.log("Socket server started successfully!");
  res.end();
}

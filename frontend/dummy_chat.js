import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any origin for testing purposes
    methods: ["GET", "POST"]
  }
});

// Array of predetermined messages to be sent to connected clients.
const predeterminedMessages = [
  "Hello from server!",
  "This is a predetermined message.",
  "Another message from server.",
  "Stay tuned for more updates!"
];
let messageIndex = 0;

// Emit a predetermined message every 5 seconds.
setInterval(() => {
  const message = predeterminedMessages[messageIndex];
  io.emit("message", message);
  console.log("Sent predetermined message:", message);
  messageIndex = (messageIndex + 1) % predeterminedMessages.length;
}, 5000);

// Listen for client connections.
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Listen for 'message' events from clients.
  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    // Broadcast the received message to all connected clients.
    io.emit("message", msg);
  });

  // Handle client disconnection.
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server on port 5001.
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});

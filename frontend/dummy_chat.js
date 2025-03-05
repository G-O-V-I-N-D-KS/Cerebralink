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
  
];
let messageIndex = 0;

// Emit a predetermined message every 5 seconds.
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
  
  let messageIndex = 0;
  const intervalId = setInterval(() => {
    if (messageIndex < predeterminedMessages.length) {
      const message = predeterminedMessages[messageIndex];
      // Send the message only to this connected client.
      socket.emit("message", message);
      console.log(`Sent message to ${socket.id}: ${message}`);
      messageIndex++;
    } else {
      // Stop sending messages after one pass through the array.
      clearInterval(intervalId);
      console.log(`All messages sent to ${socket.id}. Stopping interval.`);
    }
  }, 5000);

  // Listen for 'message' events from clients.
  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    // Broadcast the received message to all connected clients.
    io.emit("message", msg);
  });

  // Handle client disconnection.
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Clear the interval in case the client disconnects before finishing the messages.
    clearInterval(intervalId);
  });
});


// Start the server on port 5001.
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});

// src/socket.js
import { io } from "socket.io-client";

// Create one instance of the socket connection
const commandSocket = io("http://localhost:5000");
export default commandSocket;

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let state = {
  container: "main", // Can be 'main', 'side', 'keyboard'
  position: 0,       // Index in the current container
  text: "",          // Text displayed in the keyboard
};

const leftContainer = ["Left 1"];
const mainContainer = ["Word 1", "Word 2", "Word 3", "Word 4", "Word 5"];
const sideContainer = ["Keyboard", "Downside Word"];
const keyboard = ["A", "B", "C", "D", "E", "Back"];

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send the current state to new clients
  socket.emit("updateState", state);

  // Handle movement (up, down, left, right)
  socket.on("move", (direction) => {
    if (state.container === "keyboard") {
      handleKeyboardMovement(direction);
    } else {
      handleContainerMovement(direction);
    }
    io.emit("updateState", state);
  });

  // Handle 'select' action
  socket.on("select", () => {
    if (state.container === "keyboard") {
      const selectedKey = keyboard[state.position];
      if (selectedKey === "Back") {
        state.container = "side"; // Go back to the side container
        state.position = 0;
      } else {
        state.text += selectedKey; // Add the selected letter to the text
      }
    } else if (state.container === "side" && state.position === 0) {
      state.container = "keyboard"; // Enter keyboard mode
      state.position = 0;
    }
    io.emit("updateState", state);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

function handleContainerMovement(direction) {
  if (state.container === "main") {
    const maxIndex = mainContainer.length - 1;
    if (direction === "up") {
      state.position = (state.position - 1 + maxIndex + 1) % (maxIndex + 1);
    } else if (direction === "down") {
      state.position = (state.position + 1) % (maxIndex + 1);
    } else if (direction === "left") {
      state.container = "left";
      state.position = 0;
    } else if (direction === "right") {
      state.container = "side";
      state.position = 0;
    }
  } else if (state.container === "left") {
    const maxIndex = leftContainer.length - 1;
    if (direction === "right") {
      state.container = "main";
      state.position = 0;
    }
  } else if (state.container === "side") {
    const maxIndex = sideContainer.length - 1;
    if (direction === "up") {
      state.position = (state.position - 1 + maxIndex + 1) % (maxIndex + 1);
    } else if (direction === "down") {
      state.position = (state.position + 1) % (maxIndex + 1);
    } else if (direction === "left") {
      state.container = "main";
      state.position = 0;
    }
  }
}


function handleKeyboardMovement(direction) {
  const maxIndex = keyboard.length - 1;
  if (direction === "up" || direction === "down") {
    state.position = (state.position + (direction === "up" ? -1 : 1) + maxIndex + 1) % (maxIndex + 1);
  }
}

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

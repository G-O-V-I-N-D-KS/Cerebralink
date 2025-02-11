import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

import Google from "./Google";
import Keyboard from "./Keyboard";
import Words from "./Words";
import News from "./News";
import Music from "./Music";

// Initialize the Socket.IO connection for commands
const socket = io("http://localhost:5000");

// Initialize the Socket.IO connection for chat messages
const chatSocket = io("http://localhost:5001", {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 5000,
});

function Home() {
  const tabs = ["google", "keyboard", "words", "news", "music"]; // Control panel buttons
  const [activeTabIndex, setActiveTabIndex] = useState(2); // Default to "words" (index 2)
  const [commandData, setCommandData] = useState({ command: null, timestamp: null }); // Store command with timestamp
  const [activeIndex, setActiveIndex] = useState(2); // Default to "help" (index 2)
  const words = ["water", "toilet", "help", "medicine", "tv"];

  // Keyboard state
  const [keyboardRow, setKeyboardRow] = useState(0);
  const [keyboardCol, setKeyboardCol] = useState(0);
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Space", "Enter", "Shift", "Backspace", "Back"],
  ];

  const [text, setText] = useState(""); // Store the entered text

  // Handle WebSocket events for command socket
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to command server");
    });

    socket.on("server_response", (data) => {
      const message = data.message.toLowerCase();
      console.log("Command from server:", message);
      setCommandData({ command: message, timestamp: Date.now() });
    });

    return () => {
      socket.off("connect");
      socket.off("server_response");
    };
  }, []);

  // Handle incoming messages from chat socket to display notifications and speak them out loud
  useEffect(() => {
    chatSocket.on("message", (msg) => {
      // Create a notification on the screen
      const notification = document.createElement("div");
      notification.textContent = msg;
      notification.style.position = "fixed";
      notification.style.bottom = "10px";
      notification.style.left = "10px";
      notification.style.padding = "10px";
      notification.style.backgroundColor = "#28a745";
      notification.style.color = "#fff";
      notification.style.borderRadius = "5px";
      notification.style.zIndex = "1000";
      document.body.appendChild(notification);

      // Use text-to-speech to speak the message
      
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    });

    return () => {
      chatSocket.off("message");
    };
  }, []);

  // Handle commands received from the command socket
  useEffect(() => {
    const { command } = commandData;
    if (!command) return;

    console.log("Processing command:", command);

    if (activeTabIndex === 1) {
      // In the keyboard tab, handle key navigation and selection.
      if (command === "up" && keyboardRow > 0) {
        setKeyboardRow((prev) => prev - 1);
      } else if (command === "down" && keyboardRow < rows.length - 1) {
        setKeyboardRow((prev) => prev + 1);
      } else if (command === "left" && keyboardCol > 0) {
        setKeyboardCol((prev) => prev - 1);
      } else if (command === "right" && keyboardCol < rows[keyboardRow].length - 1) {
        setKeyboardCol((prev) => prev + 1);
      } else if (command === "blink") {
        handleKeySelection(rows[keyboardRow][keyboardCol]);
      }
    } else {
      // In other tabs, handle navigation.
      if (command === "left") {
        setActiveTabIndex((prevIndex) => (prevIndex - 1 + tabs.length) % tabs.length);
      } else if (command === "right") {
        setActiveTabIndex((prevIndex) => (prevIndex + 1) % tabs.length);
      } else if (command === "up") {
        setActiveIndex((prevIndex) =>
          prevIndex === 0 ? words.length - 1 : prevIndex - 1
        );
      } else if (command === "down") {
        setActiveIndex((prevIndex) =>
          prevIndex === words.length - 1 ? 0 : prevIndex + 1
        );
      } else if (command === "blink") {
        handleWordClick(activeIndex);
      }
    }
  }, [commandData]);

  // This function handles a key selection (via command or mouse click)
  const handleKeySelection = (key) => {
    if (key === "Space") {
      setText((prevText) => prevText + " ");
    } else if (key === "Enter") {
      // Emit the current text as a message and clear the text area.
      chatSocket.emit("message", text);
      setText("");
    } else if (key === "Backspace") {
      setText((prevText) => prevText.slice(0, -1));
    } else if (key === "Back") {
      setActiveTabIndex(2); // Switch to "words" tab
    } else {
      setText((prevText) => prevText + key);
    }
    // Note: The message is spoken when received back from the server.
  };

  // When a word is clicked in the Words tab, show an alert and send the word
  const handleWordClick = (index) => {
    setActiveIndex(index);
    const selectedWord = words[index];

    // Show notification
    const alertBox = document.createElement("div");
    alertBox.textContent = selectedWord;
    alertBox.style.position = "fixed";
    alertBox.style.top = "10px";
    alertBox.style.right = "10px";
    alertBox.style.padding = "10px";
    alertBox.style.backgroundColor = "#333";
    alertBox.style.color = "#fff";
    alertBox.style.borderRadius = "5px";
    alertBox.style.zIndex = "1000";
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 3000);

    // Send message to chat server
    chatSocket.emit("message", selectedWord);

    // Speak the word
    const utterance = new SpeechSynthesisUtterance(selectedWord);
    utterance.lang = "en-US"; // Set language explicitly

    // Ensure a voice is set
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.lang === "en-US") || voices[0];

    console.log(utterance);
    
    window.speechSynthesis.cancel(); // Clear any pending speech
    window.speechSynthesis.speak(utterance);
};

// Ensure voices are loaded before using them
window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
};


  // When a key is clicked in the Keyboard tab, update the active key and send it
  const handleKeyClick = (row, col) => {
    setKeyboardRow(row);
    setKeyboardCol(col);
    const selectedKey = rows[row][col];
    handleKeySelection(selectedKey);
  };

  const renderComponent = () => {
    switch (tabs[activeTabIndex]) {
      case "google":
        return <Google />;
      case "keyboard":
        return (
          <Keyboard
            rows={rows}
            activeRow={keyboardRow}
            activeCol={keyboardCol}
            text={text}
            onKeyClick={handleKeyClick} // Pass click handler
          />
        );
      case "words":
        return (
          <Words
            activeIndex={activeIndex}
            words={words}
            onWordClick={handleWordClick} // Pass click handler
          />
        );
      case "news":
        return <News />;
      case "music":
        return <Music />;
      default:
        return <Words activeIndex={activeIndex} words={words} />;
    }
  };

  const getButtonClass = (index) => {
    switch (index) {
      case 0:
        return "position-1";
      case 1:
        return "position-2";
      case 2:
        return "center";
      case 3:
        return "position-4";
      case 4:
        return "position-5";
      default:
        return "";
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="background-overlay">
      {/* Main Card */}
      <div className="centered-modal">{renderComponent()}</div>

      {/* Navbar in semi-circle */}
      <div className="control-panel">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`${getButtonClass(index)} ${
              activeTabIndex === index ? "active" : ""
            }`}
            onClick={() => setActiveTabIndex(index)}
          >
            {capitalize(tab)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;

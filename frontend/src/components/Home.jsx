import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

import Chat from "./Chat";       // Replaces the former Google component
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
  // Change the first tab from "google" to "chat"
  const tabs = ["chat", "keyboard", "words", "news", "music"];
  const [activeTabIndex, setActiveTabIndex] = useState(2); // Default to "chat"
  const [commandData, setCommandData] = useState({ command: null, timestamp: null });
  const [activeIndex, setActiveIndex] = useState(2); // For Words component navigation
  const words = ["water", "toilet", "help", "medicine", "tv"];

  const [musicCommand, setMusicCommand] = useState(null);

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

  const [text, setText] = useState("");
  // Lift the chat history state here so it persists between tab switches.
  const [chatMessages, setChatMessages] = useState([]);

  // Handle WebSocket events for the command socket
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

  // Handle incoming chat messages: update the chat history and perform TTS/notification
  useEffect(() => {
    const handleChatMessage = (data) => {
      // Expect messages to be objects with a "text" and "sender" property.
      let msgObj;
      if (typeof data === "object" && data.text && data.sender) {
        msgObj = data;
      } else {
        msgObj = { text: data, sender: "other" };
      }
      setChatMessages((prev) => [...prev, msgObj]);

      // Display a temporary notification
      const notification = document.createElement("div");
      notification.textContent = msgObj.text;
      notification.style.position = "fixed";
      notification.style.bottom = "10px";
      notification.style.left = "10px";
      notification.style.padding = "10px";
      notification.style.backgroundColor = "#28a745";
      notification.style.color = "#fff";
      notification.style.borderRadius = "5px";
      notification.style.zIndex = "1000";
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);

      // Use text-to-speech to speak the message aloud.
      const utterance = new SpeechSynthesisUtterance(msgObj.text);
      utterance.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    chatSocket.on("message", handleChatMessage);

    return () => {
      chatSocket.off("message", handleChatMessage);
    };
  }, []);

  // Handle commands received from the command socket
  useEffect(() => {
    const { command } = commandData;
    if (!command) return;
    console.log(activeTabIndex)
    if (activeTabIndex === 4) { // Music tab is active
      if (["up", "down", "left", "right", "blink"].includes(command)) {
        setMusicCommand(commandData);
      }
    } else {
      // Existing logic for keyboard and words (unchanged)
      if (activeTabIndex === 1) {
        // keyboard tab logic
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
        // For words and others
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
    }
  }, [commandData]);

  // Handle key selection from the Keyboard component
  const handleKeySelection = (key) => {
    if (key === "Space") {
      setText((prevText) => prevText + " ");
    } else if (key === "Enter") {
      // Send the current text as a message (with sender "me") and clear it.
      chatSocket.emit("message", { text: text, sender: "me" });
      setText("");
    } else if (key === "Backspace") {
      setText((prevText) => prevText.slice(0, -1));
    } else if (key === "Back") {
      setActiveTabIndex(2); // Switch to "words" tab.
    } else {
      setText((prevText) => prevText + key);
    }
  };

  // Handle word selection from the Words component
  const handleWordClick = (index) => {
    setActiveIndex(index);
    const selectedWord = words[index];

    // Create a temporary alert notification.
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

    // Emit the selected word as a message.
    chatSocket.emit("message", { text: selectedWord, sender: "me" });
    const utterance = new SpeechSynthesisUtterance(selectedWord);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Handle key click events in the Keyboard component
  const handleKeyClick = (row, col) => {
    setKeyboardRow(row);
    setKeyboardCol(col);
    const selectedKey = rows[row][col];
    handleKeySelection(selectedKey);
  };

  // Render the appropriate component based on the active tab.
  // Note: The chat history is stored in Home so it persists between tab changes.
  const renderComponent = () => {
    switch (tabs[activeTabIndex]) {
      case "chat":
        return <Chat chatMessages={chatMessages} />;
      case "keyboard":
        return (
          <Keyboard
            rows={rows}
            activeRow={keyboardRow}
            activeCol={keyboardCol}
            text={text}
            onKeyClick={handleKeyClick}
          />
        );
      case "words":
        return (
          <Words activeIndex={activeIndex} words={words} onWordClick={handleWordClick} />
        );
      case "news":
        return <News />;
      case "music":
        return <Music musicCommand={musicCommand} />;
      default:
        return <Words activeIndex={activeIndex} words={words} onWordClick={handleWordClick} />;
    }
  };

  // Helper function for CSS classes on the control buttons.
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
      {/* Main Card: this area switches based on the active tab */}
      <div className="centered-modal">{renderComponent()}</div>

      {/* Navbar in semi-circle */}
      <div className="control-panel">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`${getButtonClass(index)} ${activeTabIndex === index ? "active" : ""}`}
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

// src/components/Home.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import commandSocket from "./socket"; // use the centralized connection
import Chat from "./Chat";
import Keyboard from "./Keyboard";
import Words from "./Words";
import News from "./News";
import Music from "./Music";

// Initialize sockets outside the component to avoid re-instantiation.
const chatSocket = io("http://localhost:5001", {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 5000,
});

const TABS = ["chat", "keyboard", "words", "news", "music"];

const Home = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(2); // Default: Chat tab
  const [commandData, setCommandData] = useState({ command: null, timestamp: null });
  const [activeWordIndex, setActiveWordIndex] = useState(2);
  const words = ["water", "toilet", "help", "medicine", "tv"];
  //const [musicCommand, setMusicCommand] = useState(null);

  // Keyboard state
  const [keyboardRow, setKeyboardRow] = useState(0);
  const [keyboardCol, setKeyboardCol] = useState(0);
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Space", "Enter", "Shift", "Backspace", "Back"],
  ];

  const [text, setText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // Listen for commands from the server.
  useEffect(() => {
    const handleConnect = () => {
      console.info("Connected to command server");
    };

    const handleServerResponse = (data) => {
      const message = data.message.toLowerCase();
      console.info("Command from server:", message);
      // Always set a new command object with a new timestamp.
      setCommandData({ command: message, timestamp: Date.now() });
    };

    commandSocket.on("connect", handleConnect);
    commandSocket.on("server_response", handleServerResponse);

    return () => {
      commandSocket.off("connect", handleConnect);
      commandSocket.off("server_response", handleServerResponse);
    };
  }, []);
  
  useEffect(() => {
    if (TABS[activeTabIndex] === "keyboard") {
      const interval = setInterval(() => {
        setKeyboardCol((prev) => (prev === keyboardRows[keyboardRow].length - 1 ? 0 : prev + 1));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [activeTabIndex]);

  // Handle incoming chat messages and notifications.
  useEffect(() => {
    const handleChatMessage = (data) => {
      const msgObj =
        typeof data === "object" && data.text && data.sender
          ? data
          : { text: data, sender: "other" };

      setChatMessages((prev) => [...prev, msgObj]);

      // Display temporary notification
      const notification = document.createElement("div");
      notification.textContent = msgObj.text;
      Object.assign(notification.style, {
        position: "fixed",
        bottom: "10px",
        left: "10px",
        padding: "10px",
        backgroundColor: "#28a745",
        color: "#fff",
        borderRadius: "5px",
        zIndex: "1000",
      });
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

      // Use text-to-speech
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

  // Process incoming commands and update state accordingly.
  useEffect(() => {
    const { command } = commandData;
    if (!command) return;
    console.log(activeTabIndex)
    if (TABS[activeTabIndex] === "music") {
     /* if (["up", "down", "blink"].includes(command)) {
        setMusicCommand(command);
      }*/
        if (command === "left") {
          setActiveTabIndex((prev) => (prev - 1 + TABS.length) % TABS.length);
        } else if (command === "right") {
          setActiveTabIndex((prev) => (prev + 1) % TABS.length);
        }
    } else if (TABS[activeTabIndex] === "keyboard") {
      if (command === "up") {
        setKeyboardRow((prev) => (prev === 0 ? keyboardRows.length - 1 : prev - 1));
      } else if (command === "down") {
        setKeyboardRow((prev) => (prev === keyboardRows.length - 1 ? 0 : prev + 1));
      } else if (command === "left") {
        setActiveTabIndex((prev) => (prev - 1 + TABS.length) % TABS.length);
      } else if (command === "right") {
        setActiveTabIndex((prev) => (prev + 1) % TABS.length);
      } else if (command === "blink") {
        handleKeySelection(keyboardRows[keyboardRow][keyboardCol]);
      }
    } else {
      if (command === "left") {
        setActiveTabIndex((prev) => (prev - 1 + TABS.length) % TABS.length);
      } else if (command === "right") {
        setActiveTabIndex((prev) => (prev + 1) % TABS.length);
      } else if (command === "up") {
        setActiveWordIndex((prev) => (prev === 0 ? words.length - 1 : prev - 1));
      } else if (command === "down") {
        setActiveWordIndex((prev) => (prev === words.length - 1 ? 0 : prev + 1));
      } else if (command === "blink") {
        handleWordClick(activeWordIndex);
      }
    }
  }, [commandData]);

  // Handlers for keyboard keys and word selection.
  const handleKeySelection = (key) => {
    if (key === "Space") {
      setText((prev) => prev + " ");
    } else if (key === "Enter") {
      chatSocket.emit("message", { text, sender: "me" });
      setText("");
    } else if (key === "Backspace") {
      setText((prev) => prev.slice(0, -1));
    } else if (key === "Back") {
      setActiveTabIndex(TABS.indexOf("words"));
    } else {
      setText((prev) => prev + key);
    }
  };

  const handleWordClick = (index) => {
    setActiveWordIndex(index);
    const selectedWord = words[index];

    // Show temporary alert
    const alertBox = document.createElement("div");
    Object.assign(alertBox.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      padding: "10px",
      backgroundColor: "#333",
      color: "#fff",
      borderRadius: "5px",
      zIndex: "1000",
    });
    alertBox.textContent = selectedWord;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);

    // Emit message and speak the word
    chatSocket.emit("message", { text: selectedWord, sender: "me" });
    const utterance = new SpeechSynthesisUtterance(selectedWord);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyClick = (row, col) => {
    setKeyboardRow(row);
    setKeyboardCol(col);
    handleKeySelection(keyboardRows[row][col]);
  };

  // Render the active component based on the selected tab.
  const renderComponent = () => {
    const currentTab = TABS[activeTabIndex];
    switch (currentTab) {
      case "chat":
        return <Chat chatMessages={chatMessages} />;
      case "keyboard":
        return (
          <Keyboard
            rows={keyboardRows}
            activeRow={keyboardRow}
            activeCol={keyboardCol}
            text={text}
            onKeyClick={handleKeyClick}
          />
        );
      case "words":
        return (
          <Words
            activeIndex={activeWordIndex}
            words={words}
            onWordClick={handleWordClick}
          />
        );
      case "news":
        return <News />;
      case "music":
        return <Music musicCommand={commandData} />;
      default:
        return <Words activeIndex={activeWordIndex} words={words} onWordClick={handleWordClick} />;
    }
  };

  // Helper for button positioning (if used in control-panel)
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
      <div className="centered-modal">{renderComponent()}</div>
      <div className="control-panel">
        {TABS.map((tab, index) => (
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
};

export default Home;

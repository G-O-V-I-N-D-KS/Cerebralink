import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

import Google from "./Google";
import Keyboard from "./Keyboard";
import Words from "./Words";
import News from "./News";
import Music from "./Music";

// Initialize the Socket.IO connection
const socket = io("http://localhost:5000");

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

  // Handle WebSocket events
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
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

  useEffect(() => {
    const { command } = commandData;
    if (!command) return;

    console.log("Processing command:", command);

    if (activeTabIndex === 1) {
      console.log("Entered keyboard-specific condition");
      // Handle keyboard navigation
      if (command === "up" && keyboardRow > 0) {
        setKeyboardRow((prev) => prev - 1);
      } else if (command === "down" && keyboardRow < rows.length - 1) {
        setKeyboardRow((prev) => prev + 1);
      } else if (command === "right" && keyboardCol > 0) {
        setKeyboardCol((prev) => prev - 1);
      } else if (command === "left" && keyboardCol < rows[keyboardRow].length - 1) {
        setKeyboardCol((prev) => prev + 1);
      } else if (command === "blink") {
        handleKeySelection(rows[keyboardRow][keyboardCol]);
        console.log("Selected key:", rows[keyboardRow][keyboardCol]);
      }
    } else {
      console.log("Default navigation block");
      if (command === "right") {
        setActiveTabIndex((prevIndex) => (prevIndex - 1 + tabs.length) % tabs.length);
      } else if (command === "left") {
        setActiveTabIndex((prevIndex) => (prevIndex + 1) % tabs.length);
      } else if (command === "up") {
        setActiveIndex((prevIndex) =>
          prevIndex === 0 ? words.length - 1 : prevIndex - 1
        );
      } else if (command === "down") {
        setActiveIndex((prevIndex) =>
          prevIndex === words.length - 1 ? 0 : prevIndex + 1
        );
      }
    }
  }, [commandData]);

  const handleKeySelection = (key) => {
    if (key === "Space") {
      setText((prevText) => prevText + " ");
    } else if (key === "Enter") {
      setText((prevText) => prevText + "\n");
    } else if (key === "Backspace") {
      setText((prevText) => prevText.slice(0, -1));
    } else if (key === "Back") {
      setActiveTabIndex(2); // Switch to "words" tab
    } else {
      setText((prevText) => prevText + key);
    }
  };

  const handleWordClick = (index) => {
    setActiveIndex(index);
    const selectedWord = words[index];
    const alertBox = document.createElement("div");
    alertBox.textContent = selectedWord;
    alertBox.style.position = "fixed";
    alertBox.style.display = 'block';  // Show the alert
    console.log("Selected word:", selectedWord);
    alertBox.style.top = "10px";
    alertBox.style.right = "10px";
    alertBox.style.padding = "10px";
    alertBox.style.backgroundColor = "#fff";
    alertBox.style.color = "#000";
    alertBox.style.borderRadius = "5px";
    alertBox.style.zIndex = "1000";
    alertBox.style.height = "50px"
    alertBox.style.width = "100px"
    alertBox.style.fontSize = "25px"
    

    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  };

  const handleKeyClick = (row, col) => {
    setKeyboardRow(row);
    setKeyboardCol(col);
    const selectedKey = rows[row][col];
    handleKeySelection(selectedKey);
  };

  const handleTabSelection = () => {
    console.log(`Selected tab: ${tabs[activeTabIndex]}`);
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

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import Google from "./components/Google";
import Keyboard from "./components/Keyboard";
import Words from "./components/Words";
import News from "./components/News";
import Music from "./components/Music";

// Initialize the Socket.IO connection
const socket = io("http://localhost:5000");

function App() {
  const tabs = ["google", "keyboard", "words", "news", "music"]; // Control panel buttons
  const [activeTab, setActiveTab] = useState(tabs[2]); // Default to "words"
  const [command, setCommand] = useState(null); // Store command from server
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
      setCommand(message);
      handleServerCommand(message);
    });

    return () => {
      socket.off("connect");
      socket.off("server_response");
    };
  }, []);

  const handleServerCommand = async (command) => {
    if (activeTab === "keyboard") {
      // Handle keyboard-specific navigation
      if (command === "up" && keyboardRow > 0) {
        setKeyboardRow(keyboardRow - 1);
      } else if (command === "down" && keyboardRow < rows.length - 1) {
        setKeyboardRow(keyboardRow + 1);
      } else if (command === "left" && keyboardCol > 0) {
        setKeyboardCol(keyboardCol - 1);
      } else if (command === "right" && keyboardCol < rows[keyboardRow].length - 1) {
        setKeyboardCol(keyboardCol + 1);
      } else if (command === "blink") {
        handleKeySelection();
      }
    } else {
      // Handle control panel navigation
      if (command === "up") {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? words.length - 1 : prevIndex - 1));
      } else if (command === "down") {
        setActiveIndex((prevIndex) => (prevIndex === words.length - 1 ? 0 : prevIndex + 1));
      } else if (command === "left" || command === "right") {
        var currentIndex = tabs.indexOf(activeTab);
        console.log("Current Tab Index:", currentIndex, "Active Tab:", activeTab);
        var newIndex =
          command === "left"
            ? (currentIndex - 1 + tabs.length) % tabs.length
            : (currentIndex + 1) % tabs.length;

        await setActiveTab(tabs[newIndex]);
        console.log(`Selected tab: ${activeTab}`);
        console.log("New Tab Index:", newIndex, "New Tab:", tabs[newIndex]);
      } else if (command === "blink") {
        handleTabSelection();
      }
    }

  };

  const handleKeySelection = () => {
    useEffect(() => {
      console.log('Fruit', activeTab);
    }, [activeTab])
    const selectedKey = rows[keyboardRow][keyboardCol];
    if (selectedKey === "Space") {
      setText((prevText) => prevText + " ");
    } else if (selectedKey === "Enter") {
      setText((prevText) => prevText + "\n");
    } else if (selectedKey === "Backspace") {
      setText((prevText) => prevText.slice(0, -1));
    } else if (selectedKey === "Back") {
      setActiveTab("words");
    } else {
      setText((prevText) => prevText + selectedKey);
    }
  };

  const handleTabSelection = () => {
    console.log(`Selected tab: ${activeTab}`);
  };

  const renderComponent = () => {
    switch (activeTab) {
      case "google":
        return <Google />;
      case "keyboard":
        return (
          <Keyboard
            rows={rows}
            activeRow={keyboardRow}
            activeCol={keyboardCol}
            text={text}
          />
        );
      case "words":
        return <Words activeIndex={activeIndex} words={words} />;
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
            className={`${getButtonClass(index)} ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {capitalize(tab)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;

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
  const [activeTab, setActiveTab] = useState("words"); // Default to "words"
  const [command, setCommand] = useState(null); // Store command from server
  const [activeIndex, setActiveIndex] = useState(2); // Default to "help" (index 2)
  const words = ["water", "toilet", "help", "medicine", "tv"];

  // Handle WebSocket events
  useEffect(() => {
    // On connect
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // Listen for server commands
    socket.on("server_response", (data) => {
      const message = data.message.toLowerCase();
      console.log("Command from server:", message);
      setCommand(message);

      // Handle movement and selection commands
      handleServerCommand(message);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("server_response");
    };
  }, []);

  // Handle server commands for changing words
  const handleServerCommand = (command) => {
    if (command === "up") {
      setActiveIndex((prevIndex) => (prevIndex === 0 ? words.length - 1 : prevIndex - 1));
    }
    if (command === "down") {
      setActiveIndex((prevIndex) => (prevIndex === words.length - 1 ? 0 : prevIndex + 1));
    }
    if (command === "left" || command === "right") {
      const currentIndex = tabs.indexOf(activeTab);
      const newIndex =
        command === "left"
          ? (currentIndex - 1 + tabs.length) % tabs.length
          : (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[newIndex]);
    }
    if (command === "blink") {
      handleTabSelection();
    }
  };

  // Handle tab selection (e.g., clicking the tab)
  const handleTabSelection = () => {
    console.log(`Selected tab: ${activeTab}`);
    // Add any additional actions when a tab is selected
  };

  // Render the active component
  // Inside App.jsx, update the component rendering logic
const renderComponent = () => {
  switch (activeTab) {
    case "google":
      return <Google />;
    case "keyboard":
      return <Keyboard command={command} />;
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


  // Get button class for styling
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

  // Capitalize tab names for display
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

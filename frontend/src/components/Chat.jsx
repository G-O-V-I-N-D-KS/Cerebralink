// src/components/Chat.jsx
import React from "react";
import "../styles/chat.css";

const Chat = ({ chatMessages }) => {
  if (window.currentAudio) {
    window.currentAudio.pause();
    window.currentAudio.currentTime = 0;
    window.currentAudio = null; // Clear it
  }
  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "me" ? "sent" : "received"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;

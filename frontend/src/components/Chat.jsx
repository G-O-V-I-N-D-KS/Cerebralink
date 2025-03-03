import React from "react";
import "../styles/chat.css";

function Chat({ chatMessages }) {
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
}

export default Chat;

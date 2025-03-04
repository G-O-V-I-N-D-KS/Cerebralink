import "./chatList.css";
import { useState, useEffect } from "react";
import Textbox from "../textbox/textbox";

function ChatList({ socket }) {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!socket) return;

        socket.on("connect", () => {
            console.log("✅ Connected to server");
            setIsConnected(true);
        });

        socket.on("message", (serverMessage) => {
            if (serverMessage || serverMessage.text) {  // Ensure valid message object
                console.log("📩 Received:", serverMessage.text);
                setMessages((prevMessages) => [...prevMessages, { text: serverMessage, sender: "server" }]);
            } else {
                console.warn("⚠️ Ignored an empty or invalid message from server.");
            }
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected from server");
            setIsConnected(false);
        });

        return () => {
            socket.off("message");
            socket.off("connect");
            socket.off("disconnect");
        };
    }, [socket]);

    const sendMessage = (message) => {
        if (!socket || !socket.connected) {
            console.error("❌ Socket is not connected.");
            return;
        }

        if (message.trim() !== "") {
            console.log("📤 Sending message:", message);
            socket.emit("message", { text: message }); // Ensure message is sent as an object
            setMessages((prevMessages) => [...prevMessages, { text: message, sender: "me" }]);
        }
    };

    return (
        <div className="chatList">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`item ${msg.sender === "me" ? "sent" : "received"}`}>
                        <img src={msg.sender === "server" ? "/mail.png" : "/sent.png"}  alt="Message Icon" />
                        
                        <div className="texts">
                            <span>{msg.text}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Ensure Textbox receives sendMessage function */}
            {isConnected ? <Textbox sendMessage={sendMessage} /> : <p>Connecting...</p>}
        </div>
    );
}

export default ChatList;

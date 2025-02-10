import "./chatList.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Use `wss://` if ngrok gives an HTTPS URL
const socket = io("https://f7cd-2409-4073-4ecf-f2f2-8079-af84-c97d-1da6.ngrok-free.app", {
    transports: ["websocket", "polling"],
    reconnection: true,  
    reconnectionAttempts: 10,  
    reconnectionDelay: 5000  
});

function ChatList() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("message", (serverMessage) => {
            console.log("Received from server:", serverMessage);
            if (serverMessage.trim() !== "") { 
                setMessages((prevMessages) => [...prevMessages, serverMessage]);
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.off("message");
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    return (
        <div className="chatList">
            <div className="search">
                {/* <div className="searchBar">
                    <img src="./search.png" alt="Search" />
                    <input type="text" placeholder="Search" />
                </div> */}
            </div>
            
            <div className="messages">
                {messages.map((msg, index) => (
                    <div className="item" key={index}>
                        <img src="./mail.png" alt="Message Icon" />
                        <div className="texts">
                            <span>{msg}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatList;

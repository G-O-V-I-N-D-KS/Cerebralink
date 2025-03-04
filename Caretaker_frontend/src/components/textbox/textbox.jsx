import "./textbox.css";
import { useState } from "react";

const Textbox = ({ sendMessage }) => {
    const [inputMessage, setInputMessage] = useState("");

    const handleSend = () => {
        if (inputMessage.trim() !== "") {
            sendMessage(inputMessage);  // Call parent function to handle sending
            setInputMessage("");  // Clear input field
        }
    };

    return (
        <div className="bottom">
            <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="sendButton" onClick={handleSend}>Send</button>
        </div>
    );
};

export default Textbox;

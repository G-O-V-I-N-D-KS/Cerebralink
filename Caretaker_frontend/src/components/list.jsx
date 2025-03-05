import "./list.css";
import Userinfo from "./userinfo/Userinfo.jsx";
import ChatList from "./chatList/chatList.jsx";
import Footer from "./footer/footer.jsx";
import { io } from "socket.io-client";

// Create socket instance in List.jsx and share it across components
const socket = io("https://7109-2409-40f3-1015-87bd-453a-3b87-8691-f0cf.ngrok-free.app/care", {
    transports: ["websocket", "polling"],
    reconnection: true,  
    reconnectionAttempts: 10,  
    reconnectionDelay: 5000  
});

const List = () => {
  return (
    <div className="list">
      <Userinfo />
      <ChatList socket={socket} /> {/* Pass socket to ChatList */}
      {/* Remove this: <Textbox /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default List;

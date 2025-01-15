import React from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const SecondSite = () => {
  const handleControl = (action) => {
    socket.emit("move", action);
  };

  const handleSelect = () => {
    socket.emit("select");
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => handleControl("up")}>
        Up
      </button>
      <button style={styles.button} onClick={() => handleControl("down")}>
        Down
      </button>
      <button style={styles.button} onClick={() => handleControl("left")}>
        Left
      </button>
      <button style={styles.button} onClick={() => handleControl("right")}>
        Right
      </button>
      <button style={styles.button} onClick={handleSelect}>
        Select
      </button>
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" },
  button: { margin: "10px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" },
};

export default SecondSite;

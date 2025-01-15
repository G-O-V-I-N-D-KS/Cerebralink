import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const socket = io("http://localhost:3000");

const FirstSite = () => {
  const [state, setState] = useState({
    container: "main",
    position: 0,
    text: "",
  });

  const leftContainer = ["Left 1"];
  const mainContainer = ["Word 1", "Word 2", "Word 3", "Word 4", "Word 5"];
  const sideContainer = ["Keyboard", "Downside Word"];
  const keyboardLayout = {
    default: [
      "q w e r t y u i o p",
      "a s d f g h j k l",
      "z x c v b n m {bksp}",
      "{space}",
    ],
  };

  useEffect(() => {
    socket.on("updateState", (newState) => {
      setState(newState);
    });

    return () => {
      socket.off("updateState");
    };
  }, []);

  const handleKeyPress = (button) => {
    if (button === "{bksp}") {
      setState((prevState) => ({
        ...prevState,
        text: prevState.text.slice(0, -1),
      }));
    } else if (button === "{space}") {
      setState((prevState) => ({
        ...prevState,
        text: prevState.text + " ",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        text: prevState.text + button,
      }));
    }

    if (button === "Back") {
      setState((prevState) => ({
        ...prevState,
        container: "side",
        position: 0,
      }));
    }
  };

  const renderContent = () => {
    if (state.container === "keyboard") {
      return (
        <div style={styles.keyboard}>
          <div style={styles.display}>{state.text}</div>
          <Keyboard
            layout={keyboardLayout}
            onKeyPress={handleKeyPress}
            buttonTheme={[
              {
                class: "highlighted-key",
                buttons: "Back",
              },
            ]}
          />
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div style={styles.leftBox}>
          {leftContainer.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.row,
                backgroundColor: state.container === "left" && index === state.position ? "#90caf9" : "#fff",
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div style={styles.mainBox}>
          {mainContainer.map((word, index) => (
            <div
              key={index}
              style={{
                ...styles.row,
                backgroundColor: state.container === "main" && index === state.position ? "#90caf9" : "#fff",
              }}
            >
              {word}
            </div>
          ))}
        </div>
        <div style={styles.sideBox}>
          {sideContainer.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.row,
                backgroundColor: state.container === "side" && index === state.position ? "#90caf9" : "#fff",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

const styles = {
  container: { display: "flex", flexDirection: "row" },
  leftBox: { margin: "10px", border: "1px solid #ccc", width: "100px" },
  mainBox: { margin: "10px", border: "1px solid #ccc", width: "200px" },
  sideBox: { margin: "10px", border: "1px solid #ccc", width: "150px" },
  row: { padding: "10px", borderBottom: "1px solid #ccc", textAlign: "center" },
  keyboard: { textAlign: "center", marginTop: "20px" },
  display: { marginBottom: "20px", padding: "10px", border: "1px solid #ccc", width: "200px", textAlign: "center" },
};

export default FirstSite;

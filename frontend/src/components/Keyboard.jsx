import React from "react";
import "../styles/Keyboard.css";

function Keyboard({ rows, activeRow, activeCol, text }) {
  return (
    <div className="keyboard-container">
      <textarea
        value={text}
        readOnly
        rows={6}
        cols={30}
        className="text-area"
      />

      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, colIndex) => (
            <div
              key={colIndex}
              className={`key ${rowIndex === activeRow && colIndex === activeCol ? "active" : ""}`}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;

// src/components/Keyboard.jsx
import React from "react";
import "../styles/Keyboard.css";

const Keyboard = ({ rows, activeRow, activeCol, text, onKeyClick }) => {
  return (
    <div className="keyboard-container">
      <textarea value={text} readOnly rows={6} cols={30} className="text-area" />
      <div className="keyboa">
        <div
          key={0}
          className={`key ${0 === activeCol ? "active" : ""} back`}
          onClick={() => onKeyClick(activeRow, 0)}
        >
          Back
        </div>
        <div className="con">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((key, colIndex) => {
                if (colIndex === 0 || colIndex === row.length - 1) return null;
                  return (
                    <div
                      key={colIndex}
                      className={`key ${rowIndex === activeRow && colIndex === activeCol ? "active" : ""}`}
                      onClick={() => onKeyClick(rowIndex, colIndex)}
                    >
                      {key}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
        <div
          key={rows[activeRow].length - 1}
          className={`key ${rows[activeRow].length - 1 === activeCol ? "active" : ""} back`}
          onClick={() => onKeyClick(activeRow, rows[activeRow].length - 1)}
        >
          Back
        </div>
      </div>
    </div>
  );
};

export default Keyboard;

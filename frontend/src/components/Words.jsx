import React from "react";
import "../styles/Words.css";

function Words({ activeIndex, words, onWordClick }) {
  return (
    <div className="words-container">
      {words.map((word, index) => (
        <div
          key={index}
          className={`word-box ${index === activeIndex ? "active" : ""}`}
          onClick={() => onWordClick(index)} // Handle mouse click
        >
          {word}
        </div>
      ))}
    </div>
  );
}

export default Words;

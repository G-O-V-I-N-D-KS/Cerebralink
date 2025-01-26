import React from "react";
import "../styles/Words.css";

function Words({ activeIndex, words }) {
  return (
    <div className="words-container">
      {words.map((word, index) => (
        <div
          key={index}
          className={`word-box ${index === activeIndex ? "active" : ""}`}
        >
          {word}
        </div>
      ))}
    </div>
  );
}

export default Words;

// src/components/Words.jsx
import React from "react";
import "../styles/Words.css";

const Words = ({ activeIndex, words, onWordClick }) => {
  return (
    <div className="words-container">
      {words.map((word, index) => (
        <div
          key={index}
          className={`word-box ${index === activeIndex ? "active" : ""}`}
          onClick={() => onWordClick(index)}
        >
          {word}
        </div>
      ))}
    </div>
  );
};

export default Words;

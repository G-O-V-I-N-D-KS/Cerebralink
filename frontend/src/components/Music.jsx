import React, { useState, useEffect, useRef } from "react";
import "../styles/Music.css";
import aatuthotil from "../assets/aatuthotil.mp3";
import alone from "../assets/alone.mp3";
import aswin1 from "../assets/aswin1.mp3";
import aswin2 from "../assets/aswin2.mp3";
import badboy from "../assets/badboy.mp3";
import fri from "../assets/fri.mp3";
import happy from "../assets/happy.mp3";
import kadumkappi from "../assets/kadumkappi.mp3";
import kanmani from "../assets/kanmani.mp3";
import katturumbu from "../assets/katturumbu.mp3";
import mashup from "../assets/MASHUP.mp3";
import ooSathi from "../assets/oo sathi.mp3";

const Music = ({ musicCommand }) => {
  const musicTracks = [
    { title: "aatuthotil", file: aatuthotil },
    { title: "alone", file: alone },
    { title: "aswin1", file: aswin1 },
    { title: "aswin2", file: aswin2 },
    { title: "badboy", file: badboy },
    { title: "fri", file: fri },
    { title: "happy", file: happy },
    { title: "kadumkappi", file: kadumkappi },
    { title: "kanmani", file: kanmani },
    { title: "katturumbu", file: katturumbu },
    { title: "MASHUP", file: mashup },
    { title: "oo sathi", file: ooSathi },
  ];

  const columns = 3;
  const [activeMusicIndex, setActiveMusicIndex] = useState(0);
  const audioRef = useRef(null);

  const playCurrentTrack = () => {
    const track = musicTracks[activeMusicIndex];
    if (track) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(track.file);
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (!musicCommand) return;

    // Use functional update to avoid including activeMusicIndex in dependency
    setActiveMusicIndex((prevIndex) => {
      const currentRow = Math.floor(prevIndex / columns);
      const currentCol = prevIndex % columns;
      let newIndex = prevIndex;
      console.log("musicCommand", musicCommand);
      let comm = musicCommand.command;
      if (comm === "up") {
        newIndex = (prevIndex - columns + musicTracks.length) % musicTracks.length;
      } else if (comm === "down") {
        newIndex = (prevIndex + columns) % musicTracks.length;
      } else if (comm === "left") {
        newIndex = currentRow * columns + ((currentCol - 1 + columns) % columns);
      } else if (comm === "right") {
        newIndex = currentRow * columns + ((currentCol + 1) % columns);
      } else if (comm === "blink") {
        playCurrentTrack();
        return prevIndex;
      }
      return newIndex;
    });
  }, [musicCommand, musicTracks.length, columns]); // activeMusicIndex removed

  return (
    <div className="music-container">
      {musicTracks.map((track, index) => (
        <div
          key={index}
          className={`music-box ${index === activeMusicIndex ? "active" : ""}`}
        >
          {track.title}
        </div>
      ))}
    </div>
  );
};

export default Music;

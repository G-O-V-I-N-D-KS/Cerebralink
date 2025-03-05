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
    // Process every command, even if it's the same as before.
    const currentRow = Math.floor(activeMusicIndex / columns);
    const currentCol = activeMusicIndex % columns;
    let newIndex = activeMusicIndex;

    if (musicCommand === "up") {
      newIndex = (activeMusicIndex - columns + musicTracks.length) % musicTracks.length;
    } else if (musicCommand === "down") {
      newIndex = (activeMusicIndex + columns) % musicTracks.length;
    } else if (musicCommand === "left") {
      newIndex = currentRow * columns + ((currentCol - 1 + columns) % columns);
    } else if (musicCommand === "right") {
      newIndex = currentRow * columns + ((currentCol + 1) % columns);
    } else if (musicCommand === "blink") {
      playCurrentTrack();
    }

    if (newIndex !== activeMusicIndex) {
      setActiveMusicIndex(newIndex);
    }
  }, [musicCommand, activeMusicIndex, musicTracks.length, columns]);

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

// src/components/Music.jsx
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
import MASHUP from "../assets/MASHUP.mp3";
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
    { title: "MASHUP", file: MASHUP },
    { title: "oo sathi", file: ooSathi },
  ];

  const [activeMusicIndex, setActiveMusicIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const updateAudioForNewTrack = (newIndex) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setActiveMusicIndex(newIndex);
    if (!audioRef.current) {
      audioRef.current = new Audio(musicTracks[newIndex].file);
    } else {
      audioRef.current.src = musicTracks[newIndex].file;
    }
  };

  const togglePlayback = () => {
    const track = musicTracks[activeMusicIndex];
    if (!track) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(track.file);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.info(`Paused: ${track.title}`);
    } else {
      audioRef.current.muted = true;
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.muted = false;
          setIsPlaying(true);
          console.info(`Playing: ${track.title}`);
        })
        .catch((error) =>
          console.error(`Autoplay prevented for ${track.title}:`, error)
        );
    }
  };

  // Process command object using the timestamp so that each new command triggers the effect.
  useEffect(() => {
    if (!musicCommand || !musicCommand.timestamp) return;
    // Process command based on its value
    const { command } = musicCommand;
    if (command === "up") {
      const newIndex =
        activeMusicIndex === 0 ? musicTracks.length - 1 : activeMusicIndex - 1;
      updateAudioForNewTrack(newIndex);
    } else if (command === "down") {
      const newIndex =
        activeMusicIndex === musicTracks.length - 1 ? 0 : activeMusicIndex + 1;
      updateAudioForNewTrack(newIndex);
    } else if (command === "blink") {
      togglePlayback();
    }
  }, [musicCommand.timestamp]); // Effect runs each time the timestamp changes

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

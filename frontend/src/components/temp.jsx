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

// Import corresponding images
import aatuthotilImg from "../assets/aatuthotil.jpeg";
import aloneImg from "../assets/alone.jpeg";
import aswin1Img from "../assets/aswin1.jpeg";
import aswin2Img from "../assets/aswin2.jpeg";
import badboyImg from "../assets/badboy.jpeg";
import friImg from "../assets/fri.jpeg";
import happyImg from "../assets/happy.jpeg";
import kadumkappiImg from "../assets/kadumkappi.jpeg";
import kanmaniImg from "../assets/kanmani.jpeg";
import katturumbuImg from "../assets/katturumbu.jpeg";
import MASHUPImg from "../assets/MASHUP.jpeg";
import ooSathiImg from "../assets/oo sathi.jpeg";

const Music = ({ musicCommand }) => {
  const musicTracks = [
    { title: "aatuthotil", file: aatuthotil, image: aatuthotilImg },
    { title: "alone", file: alone, image: aloneImg },
    { title: "aswin1", file: aswin1, image: aswin1Img },
    { title: "aswin2", file: aswin2, image: aswin2Img },
    { title: "badboy", file: badboy, image: badboyImg },
    { title: "fri", file: fri, image: friImg },
    { title: "happy", file: happy, image: happyImg },
    { title: "kadumkappi", file: kadumkappi, image: kadumkappiImg },
    { title: "kanmani", file: kanmani, image: kanmaniImg },
    { title: "katturumbu", file: katturumbu, image: katturumbuImg },
    { title: "MASHUP", file: MASHUP, image: MASHUPImg },
    { title: "oo sathi", file: ooSathi, image: ooSathiImg },
  ];

  const [activeMusicIndex, setActiveMusicIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  // Create an array of refs for music boxes.
  const boxRefs = useRef([]);

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
    audioRef.current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration);
    };
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

  useEffect(() => {
    if (!musicCommand || !musicCommand.timestamp) return;
    const { command } = musicCommand;
    console.log(command)
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
    window.currentAudio = audioRef.current;
  }, [musicCommand.timestamp]);

  // When activeMusicIndex changes, scroll the corresponding box into view.
  useEffect(() => {
    const activeBox = boxRefs.current[activeMusicIndex];
    if (activeBox) {
      activeBox.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeMusicIndex]);

  const formatDuration = (dur) => {
    if (!dur || isNaN(dur)) return "0:00";
    const minutes = Math.floor(dur / 60);
    const seconds = Math.floor(dur % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="music-container">
      {musicTracks.map((track, index) => (
        <div
          key={index}
          ref={(el) => (boxRefs.current[index] = el)}
          className={`music-box ${index === activeMusicIndex ? "active" : ""}`}
          onClick={() => {updateAudioForNewTrack(index);togglePlayback()}}
        >
          <div className="music-icon">
            <i className={`fa ${index === activeMusicIndex ? (isPlaying ? "fa-pause" : "fa-play") : "fa-play"}`}></i>
          </div>
          <img src={track.image} alt={track.title} className="music-image" />
          <div className="music-info">
            <span className="music-title">{track.title}</span>
            {index === activeMusicIndex && (
              <span className="music-duration">{formatDuration(duration)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Music;

import React, { useState, useEffect } from "react";
import "../styles/Music.css";

function Music() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await fetch(
          "https://api.jamendo.com/v3.0/tracks/?client_id=303d822c&format=json&limit=20"
        ); // Replace YOUR_CLIENT_ID with your Jamendo API key
        const data = await response.json();
        setTracks(data.results || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching music:", error);
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  if (loading) {
    return <div className="music-container">Loading music...</div>;
  }

  return (
    <div className="music-container">
      <h2 className="music-header">Top Music Tracks</h2>
      {tracks.length === 0 ? (
        <p className="music-message">No music tracks available at the moment.</p>
      ) : (
        <div className="music-list-container">
          <ul className="music-list">
            {tracks.map((track) => (
              <li key={track.id} className="music-item">
                <div className="music-info">
                  <h3 className="music-title">{track.name}</h3>
                  <p className="music-artist">by {track.artist_name}</p>
                </div>
                <audio controls className="music-player">
                  <source src={track.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Music;

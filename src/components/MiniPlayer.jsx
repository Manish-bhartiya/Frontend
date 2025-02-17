// src/components/MiniPlayer.jsx
import React from 'react';

// Function to format time in mm:ss format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const MiniPlayer = ({ song, currentTime, duration, progress, togglePlayer, handleVolumeChange, volume }) => {
  return (
    <div className="mini-player">
      <div className="song-info">
        <p>{song.name}</p>
        <p>{song.artist}</p>
      </div>
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <div className="time">
        <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
      </div>
      <div className="controls">
        <button onClick={togglePlayer}>Toggle Player</button>
        <input type="range" value={volume} onChange={handleVolumeChange} />
      </div>
    </div>
  );
};

export default MiniPlayer;

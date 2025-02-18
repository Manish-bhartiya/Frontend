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
      <div className="mini-player bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="song-info">
              <p className="text-white font-semibold">{song.name}</p>
              <p className="text-gray-400">{song.artist}</p>
          </div>
          <div className="progress-bar bg-gray-600 h-1 rounded-full mt-2">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="time text-gray-400 text-sm mt-2">
              <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
          </div>
          <div className="controls flex items-center justify-between mt-4">
              <button onClick={togglePlayer} className="text-white hover:text-emerald-400 transition duration-200">
                  Toggle Player
              </button>
              <input
                  type="range"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 accent-emerald-400"
              />
          </div>
    </div>
  );
};

export default MiniPlayer;

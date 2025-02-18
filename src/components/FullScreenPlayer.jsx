// src/components/FullScreenPlayer.js
import React from 'react';
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { IoIosVolumeHigh } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { prevSong, nextSong, togglePlayPause } from '../features/audioSlice';
import ProgressBar from './ProgressBar';

const FullScreenPlayer = ({ audioRef, songs, currentSongIndex, isPlaying, currentTime, duration, volume, handleVolumeChange }) => {
  const dispatch = useDispatch();

  const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center justify-center">
          <button onClick={() => dispatch(togglePlayPause(false))} className="absolute top-4 right-4 text-white text-lg">
              Close
          </button>
          <img src={songs[currentSongIndex].image} alt="Song cover" className="w-64 h-64 object-cover rounded-lg mb-6" />
          <h2 className="text-white text-2xl font-bold">{songs[currentSongIndex]?.name || 'Unknown Song'}</h2>
          <div className="flex items-center justify-center mt-4">
              <button onClick={() => dispatch(prevSong())} disabled={currentSongIndex <= 0} className="text-white mx-2">
                  <FaStepBackward size={30} />
              </button>
              <button onClick={() => dispatch(togglePlayPause())} className="text-white mx-4">
                  {isPlaying ? <FaPause size={40} /> : <FaPlay size={40} />}
              </button>
              <button onClick={() => dispatch(nextSong())} disabled={currentSongIndex >= songs.length - 1} className="text-white mx-2">
                  <FaStepForward size={30} />
              </button>
          </div>
          <ProgressBar currentTime={currentTime} duration={duration} progress={(currentTime / duration) * 100} />
          <div className="flex items-center mt-4">
              <IoIosVolumeHigh className="text-white" size={20} />
              <input
                  id="volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="cursor-pointer ml-2 w-40 accent-emerald-400 rounded-lg"
              />
          </div>
      </div>
  );
};

export default FullScreenPlayer;

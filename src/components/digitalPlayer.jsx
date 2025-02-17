import React, { useRef, useState, useEffect } from 'react';
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { IoIosVolumeHigh } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { stopAudio, togglePlayPause, prevSong, nextSong } from '../features/audioSlice';

const DigitalPlayer = () => {
  const dispatch = useDispatch();
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);
  const songs = useSelector((state) => state.audio.songs);

  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle time updates and metadata loading
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => {
        const current = audio.currentTime || 0;
        const duration = audio.duration || 1; // Prevent division by 0
        setCurrentTime(current);
        setProgress((current / duration) * 100);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 0);
        setCurrentTime(audio.currentTime || 0);
      };

      const handleEnded = () => {
        dispatch(nextSong());
        dispatch(togglePlayPause(true));
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [dispatch]);

  // Handle changes to current song
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && songs[currentSongIndex]) {
      audio.src = songs[currentSongIndex].url;
      if (isPlaying) {
        audio
          .play()
          .then(() => dispatch(togglePlayPause(true)))
          .catch((error) => console.error('Error playing audio:', error));
      }
    }
  }, [currentSongIndex, songs, isPlaying, dispatch]);

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    }
    return '00:00';
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTogglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      dispatch(togglePlayPause(false));
    } else {
      audioRef.current
        .play()
        .then(() => dispatch(togglePlayPause(true)))
        .catch((error) => console.error('Error playing audio:', error));
    }
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      dispatch(stopAudio());
      dispatch(togglePlayPause(false));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  if (currentSongIndex === null || !songs[currentSongIndex]) return null;

  return (
    <div className="min-h-screen  bg-black flex flex-col items-center justify-center text-white">
      {/* Song Image */}
      <div>
        <img
          src={songs[currentSongIndex]?.image || 'default-image.jpg'}
          alt="Song"
          className="w-48 h-48 rounded-full shadow-lg object-cover"
        />
      </div>

      {/* Song Name */}
      <h2 className="text-2xl font-semibold mb-2">
        {songs[currentSongIndex]?.name || 'No Song Selected'}
      </h2>

      {/* Progress Bar */}
      <div className="w-full max-w-md flex items-center space-x-2 mb-4">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <div
          className="flex-grow h-2 bg-gray-500 rounded cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-green-500 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-sm">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => dispatch(prevSong())}
          disabled={currentSongIndex <= 0}
        >
          <FaStepBackward size={24} />
        </button>
        <button onClick={handleTogglePlayPause}>
          {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
        </button>
        <button
          onClick={() => dispatch(nextSong())}
          disabled={currentSongIndex >= songs.length - 1}
        >
          <FaStepForward size={24} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 mt-4">
        <IoIosVolumeHigh size={24} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default DigitalPlayer;

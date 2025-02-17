import React, { useRef, useState, useEffect } from 'react';
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { IoIosVolumeHigh } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { stopAudio, togglePlayPause, prevSong, nextSong, setCurrentSongId  } from '../features/audioSlice';

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);
  const songs = useSelector((state) => state.audio.songs);

  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => {
        const current = audio.currentTime;
        const duration = audio.duration;
        setCurrentTime(current);
        setProgress((current / duration) * 100);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
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
  }, [setCurrentSongId, songs]);

  useEffect(() => {
    if(audioRef.current && setCurrentSongId != null && songs[setCurrentSongId]){
      audioRef.current.src = songs[setCurrentSongId].url;
      dispatch(togglePlayPause(true)).catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    if (audioRef.current && currentSongIndex !== null && songs[currentSongIndex]) {
      audioRef.current.src = songs[currentSongIndex].url;
      audioRef.current.play().then(() => {
        dispatch(togglePlayPause(true));
      }).catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentSongIndex,setCurrentSongId, dispatch, songs]);

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audioRef.current.duration;

    audioRef.current.currentTime = (clickX / width) * duration;
  };

  const handleTogglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      dispatch(togglePlayPause(false));
    } else {
      audioRef.current.play().then(() => {
        dispatch(togglePlayPause(true));
      }).catch(error => {
        console.error('Error playing audio:', error);
      });
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
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  if (currentSongIndex === null || !songs[currentSongIndex]) return null;

  return (
    <div className="fixed flex items-center bg-gradient-to-r from-gray-800 to-gray-600 bottom-0 left-0 right-0 p-4 rounded-t-lg shadow-lg z-50">
      {/* Song Image */}
      <div className="mr-4">
        <img
          src={songs[currentSongIndex].image}
          alt="Song cover"
          className="w-16 h-16 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Song Details and Controls */}
      <div className="flex flex-col flex-grow">
        {/* Song Title */}
        <div className="text-white text-sm md:text-base">
          <h2 className="font-bold">{songs[currentSongIndex]?.name || 'Unknown Song'}</h2>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between mt-2 w-full">
          {/* Control Buttons */}
          <div className="flex items-center space-x-3">
            <button
              className={`${
                currentSongIndex > 0 ? 'text-white hover:text-emerald-400' : 'text-gray-500'
              } rounded transition duration-200`}
              onClick={() => {
                dispatch(prevSong());
                if (isPlaying) dispatch(togglePlayPause(true));
              }}
              disabled={currentSongIndex <= 0}
            >
              <FaStepBackward size={20} />
            </button>
            <button className="text-white hover:text-emerald-400 rounded transition duration-200" onClick={handleTogglePlayPause}>
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
            <button
              className={`${
                currentSongIndex < songs.length - 1 ? 'text-white hover:text-emerald-400' : 'text-gray-500'
              } rounded transition duration-200`}
              onClick={() => {
                dispatch(nextSong());
                if (isPlaying) dispatch(togglePlayPause(true));
              }}
              disabled={currentSongIndex >= songs.length - 1}
            >
              <FaStepForward size={20} />
            </button>
          </div>

          {/* Progress Bar with Current Time and Duration */}
          <div className="flex-grow mx-4  flex items-center space-x-2">
            {/* Current Time */}
            <span className="text-xs text-gray-300">{formatTime(currentTime)}</span>

            {/* Progress Bar */}
            <div className="relative w-full h-1 bg-gray-500 rounded-full cursor-pointer" onClick={handleProgressClick}>
              <div className="absolute top-0 left-0 h-full bg-emerald-400 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Duration */}
            <span className="text-xs text-gray-300">{formatTime(duration)}</span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center">
            <IoIosVolumeHigh className="text-white" size={20} />
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="cursor-pointer ml-2 w-20 accent-emerald-400 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden">
        <source src={songs[currentSongIndex]?.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
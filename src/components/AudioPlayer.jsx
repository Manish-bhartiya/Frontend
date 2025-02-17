// src/components/AudioPlayer.js
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { togglePlayPause, setCurrentSongIndex, setCurrentTime, setDuration, setVolume } from '../features/audioSlice';
import MiniPlayer from './MiniPlayer';
import FullScreenPlayer from './FullScreenPlayer';

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const { songs, currentSongIndex, isPlaying, currentTime, duration, volume } = useSelector((state) => state.audio);

  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(true);  // state for toggling mini player visibility
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && songs[currentSongIndex]) {
      audioRef.current.src = songs[currentSongIndex].url;
      audioRef.current.play();
      dispatch(setDuration(audioRef.current.duration));
    }
  }, [currentSongIndex, songs, dispatch]);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  };

  const handleVolumeChange = (event) => {
    const volumeValue = event.target.value;
    dispatch(setVolume(volumeValue));
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
  };

  const togglePlayerView = () => {
    setIsMiniPlayerVisible(!isMiniPlayerVisible);  // Toggle mini player visibility
  };

  return (
    <div>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />
      
      {/* MiniPlayer for compact view */}
      {isMiniPlayerVisible && currentSongIndex !== null && songs.length > 0 && (
        <MiniPlayer
          song={songs[currentSongIndex]}
          currentTime={currentTime}
          duration={duration}
          progress={(currentTime / duration) * 100}
          togglePlayer={togglePlayerView}
          handleVolumeChange={handleVolumeChange}
          volume={volume}
        />
      )}

      {/* FullScreenPlayer for detailed view */}
      {currentSongIndex !== null && songs.length > 0 && (
        <FullScreenPlayer
          audioRef={audioRef}
          songs={songs}
          currentSongIndex={currentSongIndex}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
        />
      )}
    </div>
  );
};

export default AudioPlayer;

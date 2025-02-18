import React from 'react';

const ProgressBar = ({
  progress,
  currentTime,
  duration,
  audioRef,
  setCurrentTime,
}) => {
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

  
  return (
    <div className="flex-grow mx-4 flex items-center space-x-2">
        <span className="text-xs text-gray-300">{formatTime(currentTime)}</span>
        <div className="relative w-full h-1 bg-gray-500 rounded-full cursor-pointer" onClick={handleProgressClick}>
            <div className="absolute top-0 left-0 h-full bg-emerald-400 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs text-gray-300">{formatTime(duration)}</span>
    </div>
);
};

export default ProgressBar;

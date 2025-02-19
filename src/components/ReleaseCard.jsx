import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSongs, setCurrentSongIndex, togglePlayPause } from "../features/audioSlice";
import { FaPlay, FaPause } from "react-icons/fa";

console.log("ReleaseCard is rendering");

const ReleaseCard = ({ song = [] }) => {
  const tracks = Array.isArray(song) ? song.slice(0, 3) : [];

  // Redux state
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);
  const dispatch = useDispatch();

  const handleSongClick = (track, index) => {
    dispatch(setSongs(song)); // Set songs list in Redux
    dispatch(setCurrentSongIndex(index)); // Set current song index
    dispatch(togglePlayPause(currentSongIndex === index && isPlaying)); // Toggle play/pause based on current state
  };

  if (tracks.length === 0) {
    return (
      <div className="bg-black p-6 rounded-lg w-full max-w-[20rem] text-gray-400 text-center">
        No songs available
      </div>
    );
  }

  return (
    <div className="bg-black p-3 rounded-lg w-full max-w-[20rem] ml-14">
      {tracks.map((track, index) => (
        <div
          key={track._id || index}
          className="group flex items-center mb-6 last:mb-0 text-white hover:bg-gray-700 hover:rounded-md p-2 relative transition-all duration-300 ease-in-out truncate"
          onClick={() => handleSongClick(track, index)}
        >
          <img
            src={track.image || "/default-image.png"}
            alt={track.name || "Unknown Title"}
            className="w-10 h-10 lg:w-16 lg:h-16 md:w-16 md:h-16 rounded-md mr-4 border-x-2 border-white shadow-slate-500 shadow-md "
          />
          <div className="flex-1 flex-wrap">
            <h4 className="font-bold text-sm md:text-md lg:text-md">{track.name || "Unknown Title"}</h4>
            <p className="text-xs md:text-sm mt-1 lg:text-sm text-gray-400 truncate">
              {track.artist || "Unknown Artist"}
            </p>
          </div>
          {/* Play/Pause Button */}
          <button className="absolute right-3 p-3 rounded-full border-2 border-white  shadow-md  bg-black opacity-0 group-hover:opacity-100 transition-all duration-300">
            {currentSongIndex === index && isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ReleaseCard;

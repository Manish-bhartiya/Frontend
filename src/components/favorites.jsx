import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { setSongs, setCurrentSongIndex, togglePlayPause } from "../features/audioSlice";
import apiconnecter from "../services/apiconnecter";

const FavoriteSongs = () => {
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [songId, setSongId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("Users"));
        if (!user) {
          toast.error("User not found. Please log in again.");
          return;
        }
        const response = await apiconnecter('get', `users/getFavorites?userId=${user._id}`);
        setFavoriteSongs(response.data.favoriteSongs);
        dispatch(setSongs(response.data.favoriteSongs));
      } catch (err) {
        setError("Failed to fetch favorite songs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteSongs();
  }, [dispatch]);

  const handleSongClick = (index, _id) => {
    setSongId(_id);
    dispatch(setCurrentSongIndex(index));
    if (isPlaying) dispatch(togglePlayPause(true));
  };

  const removeSongFromFavorites = async (_id) => {
    try {
      const user = JSON.parse(localStorage.getItem("Users"));
      if (user && user._id) {
        const userId = user._id;
        await apiconnecter('delete', 'users/removeFavorite', { songId: _id, userId });
        setFavoriteSongs((prevSongs) => prevSongs.filter((song) => song._id !== _id));
        toast.success("Song removed from favorites successfully");
      } else {
        setError("User not found. Please login again.");
      }
    } catch (error) {
      console.error("Error removing song from favorites:", error.response ? error.response.data : error.message);
      setError("Failed to remove from favorites!");
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col mt-16 z-10 items-center mb-4 bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center gap-6 p-4 relative w-full text-white">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-white">
          <IoMdArrowRoundBack size={24} />
        </button>
        <h2 className="text-3xl font-bold">Your Favorite Songs</h2>
      </div>
      <div className="w-full max-w-3xl mx-auto bg-gray-800 p-5 rounded-lg">
        <div className="w-full border-b border-white/20 pb-4 mb-4">
          <div className="flex justify-between text-gray-300 text-sm font-bold">
            <span className="w-[50%]">Title</span>
            <span className="w-[30%] text-right">Artist</span>
            <span className="w-[20%] text-right">Favorite</span>
          </div>
        </div>
        <ul className="w-full space-y-2">
          {favoriteSongs.length > 0 ? (
            favoriteSongs.map((song, index) => (
              <li key={song._id} onClick={() => handleSongClick(index, song._id)}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/10 cursor-pointer ${songId === song._id ? "bg-white/20" : ""}`}>
                <div className="w-[50%] font-medium text-white">{song.name}</div>
                <div className="w-[30%] text-right text-white">{song.artist}</div>
                <div className="w-[20%] flex justify-end items-center">
                  <button onClick={(e) => { e.stopPropagation(); removeSongFromFavorites(song._id); }}
                          className="text-red-500 hover:scale-110 transition">
                    <FaHeart />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-center p-4">You have no favorite songs yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FavoriteSongs;

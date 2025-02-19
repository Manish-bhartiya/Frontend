import React, { useEffect, useState, useMemo } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setSongs,
  setCurrentSongIndex,
  togglePlayPause,
  setCurrentSongId,
} from "../features/audioSlice";
import  apiconnecter  from "../services/apiconnecter";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

// Utility function to get user from localStorage
const getUserFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("Users"));
  if (!user) {
    toast.error("User not found. Please log in again.");
    throw new Error("User not logged in");
  }
  return user;
};

const PlaylistSongs = ({ playlistName }) => {
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);
  const currentSongId = useSelector((state) => state.audio.currentSongId);

  const [playlist, setPlaylist] = useState(null);
  const [playlistsongs, setPlaylistsongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      try {
        const user = getUserFromLocalStorage();
        const response = await apiconnecter(
          "get",
          `users/getFavorites?userId=${user._id}`
        );

        if (response?.data?.favoriteSongs) {
          setFavoriteSongs(response.data.favoriteSongs);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError("Failed to fetch favorite songs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteSongs();
  }, []);

  useEffect(() => {
    // Fetch the playlist and songs as usual
    const fetchPlaylistAndSongs = async () => {
      try {
        const response = await apiconnecter("get", `playlists/${playlistName}`);
        const { playlist: playlistData, songs: songsData } = response.data;
        
        setPlaylist(playlistData);
        setPlaylistsongs(songsData);
        
        // Dispatch songs to Redux
        dispatch(setSongs(songsData));
        
        // Keep playing the current song if it's already selected
        if (currentSongId) {
          dispatch(setCurrentSongId(currentSongId));
          dispatch(setCurrentSongIndex(currentSongIndex));
        }
      } catch (error) {
        setError("Error fetching playlist and songs.");
        console.error("Error fetching playlist and songs:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (playlistName) {
      fetchPlaylistAndSongs();
    }
  }, [playlistName, dispatch, currentSongId, currentSongIndex]);

  // Memoized isFavorite function for optimization
  const isFavorite = useMemo(
    () => (_id) => favoriteSongs.some((fav) => fav._id === _id),
    [favoriteSongs]
  );

  const handleSongClick = (index, _id) => {
    // If the song clicked is the same as the current song, don't stop or reset
    if (_id === currentSongId) {
      return; // Don't do anything if the same song is clicked again
    }
  
    dispatch(setCurrentSongId(_id)); // Set new song ID
    // dispatch(setCurrentSongIndex(index)); // Set the song index
    if (!isPlaying) dispatch(togglePlayPause(true)); // Play the song if it's not already playing
  };
  

  const toggleFavorite = async (_id) => {
    try {
      const user = getUserFromLocalStorage();

      if (isFavorite(_id)) {
        await apiconnecter("delete", "users/removeFavorite", {
          songId: _id,
          userId: user._id,
        });
        setFavoriteSongs((prev) =>
          prev.filter((favSong) => favSong._id !== _id)
        );
        toast.success("Song removed from favorites.");
      } else {
        await apiconnecter("post", "users/addFavorite", {
          songId: _id,
          userId: user._id,
        });
        setFavoriteSongs((prev) => [...prev, { _id }]);
        toast.success("Song added to favorites.");
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast.error("Failed to update favorite status.");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen mt-16 bg-black text-white px-4">
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-white py-2 px-4 rounded"
      >
        <IoMdArrowRoundBack />
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Playlist Info */}
        <div className="text-center mb-8">
          {playlist && (
            <>
              <img
                src={playlist.image}
                alt={playlist.name}
                className="w-40 h-40 sm:size-80 mx-auto shadow-lg mb-4 object-cover rounded-full"
              />
              <h2 className="text-2xl sm:text-3xl font-bold">{playlist.name}</h2>
            </>
          )}
        </div>

        {/* Playlist Songs */}
        <ul className="bg-black overflow-y-scroll md:size-auto border border-gray-700 max-h-[70vh] rounded-lg">
          {playlistsongs.map((song, index) => (
            <li
              key={song._id}
              className={`flex items-center justify-between p-4 hover:bg-gray-700 transition duration-300 cursor-pointer ${
                currentSongId === song._id ? "bg-gray-800" : "bg-black"
              }`}
              onClick={() => handleSongClick(index, song._id)}
            >
              <p
                className={`flex-1  sm:text-3xl lg:text-lg font-semibold mb-2 ${
                  currentSongId === song._id
                    ? "text-gray-500"
                    : "text-white"
                }`}
              >
                {index + 1}. {song.name}
              </p>

              <p className="flex-1 text-right pr-4 sm:text-3xl lg:text-lg text-white">
                {song.artist}
              </p>
              {isFavorite(song._id) ? (
                <FaHeart
                  className="cursor-pointer"
                  onClick={() => toggleFavorite(song._id)}
                />
              ) : (
                <FaRegHeart
                  className="cursor-pointer sm:size-5"
                  onClick={() => toggleFavorite(song._id)}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaylistSongs;

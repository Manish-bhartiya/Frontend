import React, { useEffect, useState, useMemo } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaHeart, FaRegHeart, FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setSongs,
  setCurrentSongIndex,
  togglePlayPause,
  setCurrentSongId,
} from "../features/audioSlice";
import apiconnecter from "../services/apiconnecter";
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
  const currentSongId = useSelector((state) => state.audio.currentSongId);
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);

  const [playlist, setPlaylist] = useState(null);
  const [playlistsongs, setPlaylistsongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [playAll, setPlayAll] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch favorite songs
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

  // Fetch playlist and songs; if a song is already selected, preserve it
  useEffect(() => {
    const fetchPlaylistAndSongs = async () => {
      try {
        const response = await apiconnecter("get", `playlists/${playlistName}`);
        const { playlist: playlistData, songs: songsData } = response.data;
        setPlaylist(playlistData);
        setPlaylistsongs(songsData);
        dispatch(setSongs(songsData));

        if (currentSongId) {
          dispatch(setCurrentSongId(currentSongId));
          dispatch(setCurrentSongIndex(currentSongIndex));
        }
      } catch (error) {
        setError("Error fetching playlist");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (playlistName) {
      fetchPlaylistAndSongs();
    }
  }, [playlistName, dispatch, currentSongId, currentSongIndex]);

  // Memoized favorite check
  const isFavorite = useMemo(
    () => (_id) => favoriteSongs.some((fav) => fav._id === _id),
    [favoriteSongs]
  );

  // Song click handler: if the song is already playing, do nothing
  const handleSongClick = (index, _id) => {
    if (_id === currentSongId) return;
    dispatch(setCurrentSongId(_id));
    // Not updating currentSongIndex on click as per the updated functionality
    if (!isPlaying) dispatch(togglePlayPause(true));
  };

  // Toggle favorite status for a song
  const toggleFavorite = async (_id) => {
    try {
      const user = getUserFromLocalStorage();
      if (isFavorite(_id)) {
        await apiconnecter("delete", "users/removeFavorite", {
          songId: _id,
          userId: user._id,
        });
        setFavoriteSongs((prev) => prev.filter((fav) => fav._id !== _id));
        toast.success("Removed from favorites");
      } else {
        await apiconnecter("post", "users/addFavorite", {
          songId: _id,
          userId: user._id,
        });
        setFavoriteSongs((prev) => [...prev, { _id }]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
      console.error(error);
    }
  };

  // Play all songs functionality
  const handlePlayAll = () => {
    if (playlistsongs.length > 0) {
      dispatch(setCurrentSongId(playlistsongs[0]._id));
      dispatch(setCurrentSongIndex(0));
      dispatch(togglePlayPause(true));
      setPlayAll(true);
    }
  };

  if (loading)
    return <div className="text-center p-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-8 text-red-500">{error}</div>
    );

  return (
    <div
      className="flex flex-col mt-16 z-10 items-center mb-4 bg-cover bg-no-repeat relative"
      style={{ backgroundImage: `url(${playlist?.image})` }}
    >
      <div className="absolute inset-0 backdrop-blur-3xl bg-black/60" />

      <div className="flex flex-col lg:flex-row h-[400px] lg:h-[300px] items-center gap-6 backdrop-blur-3xl p-4 relative w-full">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white z-20"
        >
          <IoMdArrowRoundBack size={24} />
        </button>

        <img
          src={playlist?.image}
          alt={playlist?.name}
          className="w-[200px] h-[200px] lg:w-[250px] lg:h-[230px] shadow-2xl rounded-md"
        />

        <div className="flex flex-col text-white z-10 mt-4 lg:mt-0">
          <span className="text-xs font-bold mb-2">Playlist</span>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">
            {playlist?.name}
          </h1>
          <span className="text-sm font-bold">
            {playlistsongs.length} songs
          </span>
        </div>
      </div>

      <div className="w-full backdrop-blur-3xl bg-gradient-to-b from-transparent to-black/90">
        <div className="flex flex-col items-center justify-between p-4 w-full">
          <div className="w-full flex items-center gap-4 mb-6">
            <button
              onClick={handlePlayAll}
              className="bg-slate-400 rounded-full p-4 hover:scale-95 transition"
            >
              <FaPlay className="text-white" />
            </button>
            <span className="text-white font-bold">Play All</span>
          </div>

          {/* Header with three columns */}
          <div className="w-full border-b border-white/20 pb-4 mb-4">
            <div className="flex justify-between text-gray-300 text-sm font-bold">
              <span className="w-[50%]">Title</span>
              <span className="w-[30%] text-right">Artist</span>
              <span className="w-[20%] text-right">Favorite</span>
            </div>
          </div>

          {/* Song Rows */}
          <div className="w-full space-y-2">
            {playlistsongs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => handleSongClick(index, song._id)}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/10 cursor-pointer ${
                  currentSongId === song._id ? "bg-white/20" : ""
                }`}
              >
                <div className="w-[50%] font-medium text-white">{song.name}</div>
                <div className="w-[30%] text-right text-white">
                  {song.artist}
                </div>
                <div className="w-[20%] flex justify-end items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song._id);
                    }}
                    className="text-red-500 hover:scale-110 transition"
                  >
                    {isFavorite(song._id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSongs;

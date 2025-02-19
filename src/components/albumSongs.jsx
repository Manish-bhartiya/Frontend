import React, { useEffect, useState } from "react";
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

const AlbumSongs = ({ AlbumName }) => {
  const currentSongIndex = useSelector(
    (state) => state.audio.currentSongIndex
  );
  const isPlaying = useSelector((state) => state.audio.isPlaying);
  const currentSongId = useSelector((state) => state.audio.currentSongId);

  const [album, setAlbum] = useState(null);
  const [albumsongs, setAlbumsongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch favorite songs
  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("Users"));
        if (!user) {
          toast.error("User not found. Please log in again.");
          return;
        }
        const response = await apiconnecter(
          "get",
          `users/getFavorites?userId=${user._id}`
        );
        setFavoriteSongs(response.data.favoriteSongs);
      } catch (err) {
        setError("Failed to fetch favorite songs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteSongs();
  }, []);

  // Fetch album info and songs
  useEffect(() => {
    const fetchAlbumAndSongs = async () => {
      try {
        const response = await apiconnecter("get", `albums/${AlbumName}`);
        const albumData = response.data.album;
        if (albumData) {
          setAlbum(albumData);
          setAlbumsongs(albumData.songs);
          dispatch(setSongs(albumData.songs));
        }
      } catch (error) {
        setError("Error fetching album and songs.");
        console.error("Error fetching album and songs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (AlbumName) {
      fetchAlbumAndSongs();
    }
  }, [AlbumName, dispatch]);

  const handleSongClick = (index, _id) => {
    if (_id === currentSongId) return; // Prevent restarting the song if already playing
    dispatch(setCurrentSongId(_id));
    dispatch(setCurrentSongIndex(index));
    if (!isPlaying) dispatch(togglePlayPause(true));
  };

  const isFavorite = (songId) => {
    return favoriteSongs.some((favSong) => favSong._id === songId);
  };

  const toggleFavorite = async (_id) => {
    const user = JSON.parse(localStorage.getItem("Users") || "{}");
    if (!user || !user._id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    if (isFavorite(_id)) {
      try {
        await apiconnecter("delete", "users/removeFavorite", {
          songId: _id,
          userId: user._id,
        });
        setFavoriteSongs((prev) =>
          prev.filter((favSong) => favSong._id !== _id)
        );
        toast.success("Song removed from favorites.");
      } catch (error) {
        console.error(
          "Failed to remove from favorites:",
          error.response?.data || error.message
        );
        toast.error("Failed to remove from favorites.");
      }
    } else {
      try {
        await apiconnecter("post", "users/addFavorite", {
          songId: _id,
          userId: user._id,
        });
        setFavoriteSongs((prev) => [...prev, { _id }]);
        toast.success("Song added to favorites.");
      } catch (error) {
        console.error(
          "Failed to add to favorites:",
          error.response?.data || error.message
        );
        toast.error("Failed to add to favorites.");
      }
    }
  };

  // "Play All" button functionality
  const handlePlayAll = () => {
    if (albumsongs.length > 0) {
      dispatch(setCurrentSongId(albumsongs[0]._id));
      dispatch(setCurrentSongIndex(0));
      dispatch(togglePlayPause(true));
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div
      className="flex flex-col mt-16 z-10 items-center mb-4 bg-cover bg-no-repeat relative"
      style={{ backgroundImage: `url(${album?.image})` }}
    >
      <div className="absolute inset-0 backdrop-blur-3xl bg-black/60" />

      <div className="flex flex-col items-center gap-6 backdrop-blur-3xl p-4 relative w-full">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-white z-20"
        >
          <IoMdArrowRoundBack size={24} />
        </button>

        {/* Album Info */}
        <div className="text-center mb-8">
          {album && (
            <>
              <img
                src={album.image}
                alt={album.name}
                className="w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 mx-auto shadow-lg mb-4 object-cover rounded-full"
              />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {album.name}
              </h2>
            </>
          )}
        </div>

        {/* Songs List with "Play All" Button */}
        <div className="w-full backdrop-blur-3xl bg-gradient-to-b from-transparent to-black/90 p-4">
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
            {albumsongs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => handleSongClick(index, song._id)}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/10 cursor-pointer ${
                  currentSongId === song._id ? "bg-white/20" : ""
                }`}
              >
                <div className="w-[50%] font-medium text-white">
                  {index + 1}. {song.name}
                </div>
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
                    {isFavorite(song._id) ? <FaHeart /> : <FaRegHeart />}
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

export default AlbumSongs;

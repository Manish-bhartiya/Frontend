import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setSongs,
  setCurrentSongIndex,
  togglePlayPause,
  setCurrentSongId,
} from "../features/audioSlice";
import apiconnecter from "../services/apiconnecter";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

const AlbumSongs = ({ AlbumName }) => {
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);
  const currentSongId = useSelector((state) => state.audio.currentSongId);

  const [album, setAlbum] = useState(null);
  const [albumsongs, setAlbumsongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("Users"));
        if (!user) {
          toast.error("User not found. Please log in again.");
          return;
        }

        const response = await apiconnecter("get", `users/getFavorites?userId=${user._id}`);
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
    if (_id === currentSongId) {
      return; // Prevent restarting the song if already playing
    }

    dispatch(setCurrentSongId(_id)); // Set the new song ID
    dispatch(setCurrentSongIndex(index)); // Update song index
    if (!isPlaying) dispatch(togglePlayPause(true)); // Play the song if it's not already playing
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

        setFavoriteSongs((prev) => prev.filter((favSong) => favSong._id !== _id));
        toast.success("Song removed from favorites.");
      } catch (error) {
        console.error("Failed to remove from favorites:", error.response?.data || error.message);
        toast.error("Failed to remove from favorites.");
      }
    } else {
      try {
        await apiconnecter("post", "users/addFavorite", { songId: _id, userId: user._id });
        setFavoriteSongs((prev) => [...prev, { _id }]);
        toast.success("Song added to favorites.");
      } catch (error) {
        console.error("Failed to add to favorites:", error.response?.data || error.message);
        toast.error("Failed to add to favorites.");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-4">
      <button onClick={() => navigate("/")} className="mb-4 text-white py-2 px-4 rounded">
        <IoMdArrowRoundBack />
      </button>

      <div className="max-w-5xl mx-auto">
        {/* Album Info */}
        <div className="text-center mb-8">
          {album && (
            <>
              <img
                src={album.image}
                alt={album.name}
                className="w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 mx-auto shadow-lg mb-4 object-cover rounded-full"
              />
              <h2 className="text-2xl md:text-3xl font-bold">{album.name}</h2>
            </>
          )}
        </div>

        {/* Album Songs */}
        <ul className="bg-black overflow-y-scroll border border-gray-700 max-h-[70vh] rounded-lg">
          {albumsongs.map((song, index) => (
            <li
              key={song._id}
              className={`flex items-center justify-between p-4 hover:bg-gray-700 transition duration-300 cursor-pointer ${
                currentSongId === song._id ? "bg-gray-800" : "bg-black"
              }`}
              onClick={() => handleSongClick(index, song._id)}
            >
              <p
                className={`flex-1 text-sm md:text-lg font-semibold mb-2 ${
                  currentSongId === song._id ? "text-gray-500" : "text-white"
                }`}
              >
                {index + 1}. {song.name}
              </p>

              <p className="flex-1 text-right pr-4 text-sm md:text-lg text-white">
                {song.artist}
              </p>
              {isFavorite(song._id) ? (
                <FaHeart className="cursor-pointer" onClick={() => toggleFavorite(song._id)} />
              ) : (
                <FaRegHeart className="cursor-pointer" onClick={() => toggleFavorite(song._id)} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AlbumSongs;

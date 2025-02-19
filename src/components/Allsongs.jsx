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

const AllSongsPage = () => {
  const currentSongId = useSelector((state) => state.audio.currentSongId);
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);

  const [songsList, setSongsList] = useState([]);
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
        const response = await apiconnecter("get", `users/getFavorites?userId=${user._id}`);
        if (response?.data?.favoriteSongs) {
          setFavoriteSongs(response.data.favoriteSongs);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError("Failed to fetch favorite songs.");
        console.error(err);
      }
    };
    fetchFavoriteSongs();
  }, []);

  // Fetch all songs and randomize them
  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        // Replace the URL below with your actual API endpoint
        const response = await apiconnecter("get", `songs/songs`);
        // Assume the response returns an array of songs in response.data.songs
        const allSongs = response.data.songs;
        // Randomize the songs array
        const randomizedSongs = allSongs.sort(() => Math.random() - 0.5);
        setSongsList(randomizedSongs);
        dispatch(setSongs(randomizedSongs));
      } catch (error) {
        setError("Error fetching songs");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSongs();
  }, [dispatch]);

  // Memoized favorite check
  const isFavorite = useMemo(
    () => (_id) => favoriteSongs.some((fav) => fav._id === _id),
    [favoriteSongs]
  );

  // Handle song click: if already playing, do nothing
  const handleSongClick = (index, _id) => {
    if (_id === currentSongId) return;
    dispatch(setCurrentSongId(_id));
    if (!isPlaying) dispatch(togglePlayPause(true));
  };

  // Toggle favorite status
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

  // Play All functionality
  const handlePlayAll = () => {
    if (songsList.length > 0) {
      dispatch(setCurrentSongId(songsList[0]._id));
      dispatch(setCurrentSongIndex(0));
      dispatch(togglePlayPause(true));
      setPlayAll(true);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div
      className="flex flex-col mt-16 z-10 items-center mb-4 bg-cover bg-no-repeat relative"
      style={{ backgroundImage: `url(https://res.cloudinary.com/dhfjy459o/image/upload/v1739962701/ocu2xrwttgth6dl9trqb.png)` }}  // Replace with your background image URL if desired
    >
      {/* Background overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-black/60" />

      {/* Header section */}
      <div className="flex flex-row h-[300px] items-center gap-6 backdrop-blur-3xl p-4 relative w-full">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white z-20"
        >
          <IoMdArrowRoundBack size={24} />
        </button>

        {/* Collection Image on the Left */}
        <div className="w-[200px] h-[200px] lg:w-[250px] lg:h-[230px] flex items-center justify-center bg-gray-800 rounded-md shadow-2xl">
  <img
    src="https://res.cloudinary.com/dhfjy459o/image/upload/v1739962701/ocu2xrwttgth6dl9trqb.png"
    alt="All Songs"
    className="object-cover w-full h-full rounded-md"
  />
</div>


        {/* Collection Info on the Right */}
        <div className="flex flex-col text-white z-10">
          {/* <span className="text-xs font-bold mb-2">Collection</span> */}
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">Endless Songs</h1>
          {/* <span className="text-sm font-bold">{songsList.length} songs</span> */}
        </div>
      </div>

      {/* Songs list section */}
      <div className="w-full backdrop-blur-3xl bg-gradient-to-b from-transparent to-black/90">
        <div className="flex flex-col items-center justify-between p-4 w-full">
          {/* Play All Button */}
          <div className="w-full flex items-center gap-4 mb-6">
            <button
              onClick={handlePlayAll}
              className="bg-slate-400 rounded-full p-4 hover:scale-95 transition"
            >
              <FaPlay className="text-white" />
            </button>
            <span className="text-white font-bold">Play All</span>
          </div>

          {/* Table Header */}
          <div className="w-full border-b border-white/20 pb-4 mb-4">
            <div className="flex justify-between text-gray-300 text-sm font-bold">
              <span className="w-[50%]">Title</span>
              <span className="w-[30%] text-right">Artist</span>
              <span className="w-[20%] text-right">Favorite</span>
            </div>
          </div>

          {/* Songs List */}
          <div className="w-full space-y-2">
            {songsList.map((song, index) => (
              <div
                key={song._id}
                onClick={() => handleSongClick(index, song._id)}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/10 cursor-pointer ${
                  currentSongId === song._id ? "bg-white/20" : ""
                }`}
              >
                <div className="w-[50%] font-medium text-white">{song.name}</div>
                <div className="w-[30%] text-right text-white">{song.artist}</div>
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

export default AllSongsPage;

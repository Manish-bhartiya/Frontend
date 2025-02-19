import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PlaylistSongs from "./playlistSongs";
import {
  setSongs,
  setCurrentSongIndex,
  togglePlayPause,
  setCurrentSongId,
} from "../features/audioSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { MDBCard, MDBCardBody, MDBCardImage } from "mdb-react-ui-kit";
import "swiper/css";
import "swiper/css/bundle";
import { Link } from "react-router-dom";
import { togglePage } from "../features/searchSlice";

const SearchResults = () => {
  const { songs = [], playlists = [], status, error } = useSelector(
    (state) => state.search
  );
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [term, setTerm] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const dispatch = useDispatch();

  const currentSongId = useSelector((state) => state.audio.currentSongId);
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);

  // Update Redux songs state if new songs arrive
  useEffect(() => {
    if (songs.length > 0) {
      dispatch(setSongs(songs));
    }
  }, [songs, dispatch]);

  // Preserve current song state
  useEffect(() => {
    dispatch(setSongs(songs));
    if (currentSongId) {
      dispatch(setCurrentSongId(currentSongId));
      dispatch(setCurrentSongIndex(currentSongIndex));
    }
  }, [songs, dispatch, currentSongId, currentSongIndex]);

  // Filter songs and playlists based on the search term
  useEffect(() => {
    const lowerTerm = term.toLowerCase();
    setFilteredSongs(
      songs.filter((song) => song.name.toLowerCase().includes(lowerTerm))
    );
    setFilteredPlaylists(
      playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(lowerTerm)
      )
    );
  }, [term, songs, playlists]);

  if (status === "loading") {
    return <p className="text-white text-center mt-8">Loading...</p>;
  }
  if (status === "failed") {
    return (
      <p className="text-red-500 text-center mt-8">
        Error: {error}
      </p>
    );
  }

  const handleSongClick = (index, _id) => {
    dispatch(setCurrentSongId(_id));
    if (!isPlaying) {
      dispatch(togglePlayPause(true));
    }
  };

  const handlePlaylistClick = () => {
    dispatch(togglePage(false));
  };

  return (
    <div className="container mx-auto p-4 bg-black text-white min-h-screen">
      {/* Uncomment below to enable search input */}
      {/* <input
        type="text"
        placeholder="Search songs and playlists"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full p-2 mb-4 rounded-md text-black"
      /> */}
      {selectedPlaylist ? (
        <PlaylistSongs playlist={selectedPlaylist} />
      ) : (
        <div>
          {/* Songs Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Songs</h3>
            <div className="w-full border-b border-white/20 pb-4 mb-4">
              <div className="flex justify-between text-gray-300 text-sm font-bold">
                <span className="w-[50%]">Title</span>
                <span className="w-[50%] text-right">Artist</span>
              </div>
            </div>
            <ul className="space-y-2">
              {filteredSongs.map((song, index) => (
                <li
                  key={song._id}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition duration-300 cursor-pointer ${
                    currentSongIndex === index ? "bg-white/20" : "bg-black"
                  }`}
                  onClick={() => handleSongClick(index, song._id)}
                >
                  <p
                    className={`w-[50%] text-lg font-semibold ${
                      currentSongIndex === index ? "text-gray-500" : "text-white"
                    }`}
                  >
                    {index + 1}. {song.name}
                  </p>
                  <p className="w-[50%] text-right text-white">
                    {song.artist}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Playlists Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Artist's</h3>
            <Swiper
              spaceBetween={10}
              slidesPerView={5}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {Array.isArray(playlists) &&
                filteredPlaylists.map((playlist) => (
                  <SwiperSlide key={playlist._id}>
                    <MDBCard className="bg-black flex flex-col justify-center hover:shadow-2xl">
                      <MDBCardImage
                        className="rounded-full border-x-2 border-white shadow-white shadow-m opacity-90 transition-opacity duration-300 hover:opacity-50"
                        src={playlist.image}
                        alt={`${playlist.name} cover`}
                        style={{
                          height: "150px",
                          width: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <MDBCardBody className="ml-6">
                        <Link
                          onClick={handlePlaylistClick}
                          to={`/playlist/${playlist.name}`}
                          className="text-lg font-semibold text-white hover:text-gray-400"
                        >
                          {playlist.name}
                        </Link>
                      </MDBCardBody>
                    </MDBCard>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

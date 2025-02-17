import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PlaylistSongs from './playlistSongs';
import { setSongs, setCurrentSongIndex, togglePlayPause, setCurrentSongId } from '../features/audioSlice';
import { Swiper, SwiperSlide } from "swiper/react";
import { MDBCard, MDBCardBody, MDBCardImage } from "mdb-react-ui-kit";
import "swiper/css";
import 'swiper/css/bundle';
import { Link } from 'react-router-dom';
import { togglePage } from '../features/searchSlice';

const SearchResults = () => {
  const { songs = [], playlists = [], status, error } = useSelector((state) => state.search);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [term, setTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const dispatch = useDispatch();

  const currentSongId = useSelector ((state) => state.audio.currentSongId);
  const currentSongIndex = useSelector((state) => state.audio.currentSongIndex);
  const isPlaying = useSelector((state) => state.audio.isPlaying);

  useEffect(() => {
    if (songs.length > 0) {
      dispatch(setSongs(songs));
    }
  }, [songs, dispatch]);

  useEffect(() => {
    // Fetch search results and update the songs list
    dispatch(setSongs(songs));
    
    // Keep the current song if it's still playing
    if (currentSongId) {
      dispatch(setCurrentSongId(currentSongId));
      dispatch(setCurrentSongIndex(currentSongIndex));
    }
  }, [songs, dispatch, currentSongId, currentSongIndex]); // Ensure current song state persists
  

  useEffect(() => {
    const lowerTerm = term.toLowerCase();
    setFilteredSongs(songs.filter(song => song.name.toLowerCase().includes(lowerTerm)));
    setFilteredPlaylists(playlists.filter(playlist => playlist.name.toLowerCase().includes(lowerTerm)));
  }, [term, songs, playlists]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  const handleSongClick = (index, _id) => {
    dispatch(setCurrentSongId(_id)); // Updates both index and ID in audioSlice
    if (!isPlaying) {
      dispatch(togglePlayPause(true)); // Starts playback if not already playing
    }
  };
  

  const handlePlaylistClick = () => {
    dispatch(togglePage(false));
  };

  return (
    <div className="search-results container mx-auto p-4 bg-black text-white">
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
          <div>
            <h3>Songs</h3>
            <ul>
              {filteredSongs.map((song, index) => (
                <li
                  key={song._id}
                  className="bg-black flex shadow-md rounded-lg p-4 hover:bg-gray-700 transition duration-300 cursor-pointer"
                  onClick={() => handleSongClick(index,song._id)}
                >
                  <p className={`flex-1 text-lg font-semibold mb-2 ${currentSongIndex === index ? 'text-gray-500' : 'text-white'}`}>
                    {index + 1}. {song.name}
                  </p>
                  <p className="flex-1 text-right text-white">{song.artist}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Artists</h3>
            {/* <ul>
              {filteredPlaylists.map((playlist) => (
                <li key={playlist._id}>
                  <span
                    className="text-lg font-semibold text-white hover:text-gray-400 cursor-pointer"
                    onClick={() => setSelectedPlaylist(playlist.name)}
                  >
                    {playlist.name}
                  </span>
                </li>
              ))}
            </ul> */}

<Swiper
              spaceBetween={10}
              slidesPerView={5}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {Array.isArray(playlists) &&
                filteredPlaylists.map((playlist) => (
                  <SwiperSlide key={playlist._id}>
                    <MDBCard className="bg-black flex flex-col justify-center hover:shadow-2xl ">
                      <MDBCardImage
                        className="rounded-full opacity-90 transition-opacity duration-300 hover:opacity-50  "
                        src={playlist.image}
                        alt={`${playlist.name} cover`}
                        style={{ height: "150px", width: "150px", objectFit: "cover" }}
                       
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

// src/features/audioSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  songs: [],
  currentSongIndex: null,
  isPlaying: false,
  currentSongId: null,
  currentTime: 0, // Added to track current time
  duration: 0, // Added to track song duration
  volume: 1, // Added to track volume
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setSongs: (state, action) => {
      state.songs = action.payload;
    },
    togglePlayPause: (state, action) => {
      state.isPlaying = action.payload !== undefined ? action.payload : !state.isPlaying;
    },
    stopAudio: (state) => {
      state.isPlaying = false;
      state.currentSongIndex = null;
      state.currentSongId = null;
      state.currentTime = 0;
    },
    setCurrentSongIndex: (state, action) => {
      state.currentSongIndex = action.payload;
      state.currentSongId = state.songs[action.payload]?._id || null;
    },
    setCurrentSongId: (state, action) => {
      const songIndex = state.songs.findIndex((song) => song._id === action.payload);
      if (songIndex !== -1) {
        state.currentSongIndex = songIndex;
        state.currentSongId = action.payload;
      }
    },
    prevSong: (state) => {
      if (state.currentSongIndex > 0) {
        state.currentSongIndex -= 1;
        state.currentSongId = state.songs[state.currentSongIndex]._id;
      }
    },
    nextSong: (state) => {
      if (state.currentSongIndex < state.songs.length - 1) {
        state.currentSongIndex += 1;
        state.currentSongId = state.songs[state.currentSongIndex]._id;
      }
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
  },
});

export const {
  setSongs,
  togglePlayPause,
  stopAudio,
  setCurrentSongIndex,
  setCurrentSongId,
  prevSong,
  nextSong,
  setCurrentTime,
  setDuration,
  setVolume,
} = audioSlice.actions;

export default audioSlice.reducer;

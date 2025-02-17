import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiconnecter } from '../services/apiconnecter';

export const fetchPlaylist = createAsyncThunk('playlists/fetchPlaylist', async () => {
  try {
    const response = await apiconnecter('get','playlists/allPlaylist');
    // console.log(response)
    if (Array.isArray(response.data.playlists)) {
      // console.log(response.data.playlists[1].songs);    
      return response.data.playlists;
    } else {
      throw new Error('Data format is not correct');
    }
  } catch (error) {
    
    // console.log(response.data);
    throw new Error('Failed to fetch playlists');
  }
});



const playlistSlice = createSlice({
  name: 'playlist',
  initialState: {
    playlists: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlaylist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.playlists = action.payload;
      })
      .addCase(fetchPlaylist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default playlistSlice.reducer;

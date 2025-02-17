// store.js
import { configureStore } from '@reduxjs/toolkit';
import playlistReducer from '../features/playlistslice';
import audioReducer from '../features/audioSlice';
import albumReducer from '../features/albums';
import authReducer from '../features/authSlice';
import searchReducer from '../features/searchSlice';
import  userReducer  from '../features/userSlice';

export const store = configureStore({
  reducer: {
    playlist: playlistReducer,
    audio: audioReducer,
    album:albumReducer,
    auth: authReducer,      
    search: searchReducer,      
    User: userReducer,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  },
});

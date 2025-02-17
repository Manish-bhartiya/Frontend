import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiconnecter } from "../services/apiconnecter";

export const fetchAlbum = createAsyncThunk('allAlbums/fetchAlbum', async() =>{
    try {
        const response = await apiconnecter('get','albums/allAlbums');
        // const response = await axios.get(`http://localhost:4001/api/allAlbums`);
        if(Array.isArray(response.data.albums)){
            return response.data.albums;
        }else{
            throw new Error('data formet is not correct');
        }
    } catch (error) {
        throw new Error('Failed To Fatch Albums');
    }
})

const albums = createSlice({
    name :'album',
    initialState:{
        allAlbums :[],
        status : 'idle',
        error : null,        
    },
    reducers:{},
    extraReducers:(builder) =>{
        builder
        .addCase(fetchAlbum.pending,(state) =>{
            state.status =  'loading';
        }) 
        .addCase(fetchAlbum.fulfilled, (state,action) =>{
            state.status = 'succeeded';
            state.allAlbums = action.payload;
        })
        .addCase(fetchAlbum.rejected,(state,action) =>{
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
});

export default albums.reducer;
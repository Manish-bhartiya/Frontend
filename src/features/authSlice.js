import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authUser: JSON.parse(localStorage.getItem("Users")) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
      localStorage.setItem("Users", JSON.stringify(action.payload));
    },
    clearAuthUser: (state) => {
      state.authUser = null;
      localStorage.removeItem("Users");
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;

// Selector to get the authUser
export const selectAuthUser = (state) => state.auth.authUser;

export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "", // Ensure query exists
  search: "",
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setQuery, setSearch } = userSlice.actions;
export default userSlice.reducer;

import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { fetchResults, togglePage } from "../features/searchSlice";

const SearchBar = () => {
  const [term, setTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setTerm(e.target.value);
    if (e.target.value.trim()) {
      dispatch(fetchResults(e.target.value));
      dispatch(togglePage(true));
    } else {
      dispatch(togglePage(false));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      dispatch(fetchResults(term));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-md"
    >
      {/* Search Icon */}
      <IoSearchOutline
        className={`absolute left-3 text-gray-400 w-5 h-5 transition-all duration-300 ${
          isFocused ? "text-white scale-110" : ""
        }`}
      />

      {/* Input Field */}
      <input
        type="text"
        value={term}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full pl-10 pr-4 py-2 rounded-lg transition-all duration-300 outline-none bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-600 focus:ring-2 focus:ring-white focus:border-transparent ${
          isFocused ? "w-full shadow-lg" : "w-[400px]"
        }`}
        placeholder="Search songs, albums, artists..."
      />

      {/* Animated Border on Focus */}
      {isFocused && (
        <div className="absolute bottom-0 left-0 w-full h-0.5  rounded-full animate-border-expand"></div>
      )}
    </form>
  );
};

export default SearchBar;
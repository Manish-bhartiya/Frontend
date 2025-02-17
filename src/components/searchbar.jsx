  import React, { useState } from 'react';
  import { IoSearchOutline } from 'react-icons/io5';
  import { useDispatch } from 'react-redux';
  import { fetchResults, togglePage } from '../features/searchSlice';

  const SearchBar = () => {
    const [term, setTerm] = useState('');
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
      <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-md">
        <IoSearchOutline className="absolute left-3 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={term}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full pl-10 pr-4 py-2 rounded-md transition-all duration-300 outline-none bg-gray-800 text-white
            ${isFocused ? 'w-full' : 'w-[400px]'} focus:w-[500px]`}
          placeholder="Search"
        />
      </form>
    );
  };

  export default SearchBar;

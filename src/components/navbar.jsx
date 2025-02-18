import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import Logout from './logout';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser } from '../features/authSlice';
import { fetchResults, togglePage } from '../features/searchSlice';
import SearchBar from './searchbar';
import Userprofile from './userProfile';

const Navbar = () => {
  const authUser = useSelector(selectAuthUser);
  const [sticky, setSticky] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [term, setTerm] = useState("");

  const dispatch = useDispatch();
  const searchStatus = useSelector((state) => state.search.status);

  const submitHandler = (e) => {
    e.preventDefault();
    if (term.trim()) {
      dispatch(fetchResults(term));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleInputChange = (e) => {
    setTerm(e.target.value);
    if (e.target.value.trim()) {
      dispatch(fetchResults(e.target.value));
      dispatch(togglePage(true));
    } else {
      dispatch(togglePage(false));
    }
  };

  const navItems = (
    <>
      <li className="p-2 border-white">
        <Link to="/">Home</Link>
      </li>
      <li className="p-2">
        <Link to="/Song">AddSong</Link>
      </li>
      <li className="p-2">
        <Link to="/favorites">Favorites</Link>
      </li>
      <li className="p-2">
        <Link to="/Album">Album</Link>
      </li>
    </>
  );

  return (
    <div className={`navbar bg-black border-b-2 border-white text-white ${sticky ? 'sticky top-0 z-50' : ''}`}>
      <nav className="container mx-auto p-4 flex items-center justify-between">
        {/* Mobile Dropdown Button */}
        <div className="navbar-start flex items-center">
          <div className="lg:hidden">
            <button className="btn btn-ghost" onClick={toggleDropdown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <Link to="/" className="font-extrabold block">
            <img
              src="https://res.cloudinary.com/dhfjy459o/image/upload/v1722677369/logo_2-removebg-preview_nwfo5w.png"
              alt="Logo"
              className="h-12 lg:h-16"
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className={`flex-grow ${dropdownVisible ? 'hidden' : 'block'} lg:block`}>
          <SearchBar />
        </div>

        {/* Mobile Dropdown Menu */}
        {dropdownVisible && (
          <ul className="flex lg:hidden flex-col items-center absolute top-16 left-0 w-full bg-black text-white py-4 space-y-2">
            {navItems}
          </ul>
        )}

        {/* Desktop Menu */}
        <div className="navbar-end hidden lg:flex items-center gap-4">
          <ul className="menu flex gap-10">{navItems}</ul>
        </div>

        {/* User Profile */}
        <div className="p-2 lg:p-0">
          {authUser ? (
            <Userprofile />  
          ) : (
            <div className="p-2">
              <Link
                to="/signin"
                className="bg-black text-white p-2 rounded-md hover:bg-slate-800 duration-150 cursor-pointer"
              >
                Signin
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
  
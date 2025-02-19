import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../features/authSlice";
import { fetchResults, togglePage } from "../features/searchSlice";
import SearchBar from "./searchbar";
import Userprofile from "./userProfile";

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
      setSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Add Song", path: "/Song" },
    { name: "Favorites", path: "/favorites" },
    { name: "Albums", path: "/Album" },
  ];

  return (
    <div
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        sticky ? "bg-black/90 shadow-lg backdrop-blur-md" : "bg-black"
      }`}
    >
      <nav className="container mx-auto px-5 py-1 flex items-center justify-between border-b-2 border-white">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex justify-start gap-3">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white text-2xl"
            onClick={toggleDropdown}
          >
            {dropdownVisible ? <HiX /> : <HiMenu />}
          </button>

          {/* Logo with animation */}
          <Link to="/" className="font-extrabold block animate-logo">
  <img
    src="https://res.cloudinary.com/dhfjy459o/image/upload/v1722677369/logo_2-removebg-preview_nwfo5w.png"
    alt="Logo"
    className="h-10 sm:h-12 lg:h-14 transition-all duration-500 ease-in-out transform hover:shadow-xl hover:border-2 hover:border-blue-500/30 hover:rounded-lg animate-pulse"
  />
</Link>
        </div>

        {/* Center: Search Bar (Always Visible) */}
        <div className="flex-grow flex justify-center">
          <SearchBar />
        </div>

        {/* Right: User Profile (Always Visible) */}
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-6 text-white text-lg">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="text-white px-2 py-1 rounded-md font-semibold text-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 border-x-2 border-white"
                >
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>

          {/* User Profile (Always Visible) */}
          {authUser ? (
            <Userprofile />
          ) : (
            <Link
              to="/signin"
              className="text-white px-2 py-1 rounded-md font-semibold text-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110 border-x-2 border-white"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Dropdown Menu with Transition */}
      <div
        className={`lg:hidden bg-black text-white absolute  left-0 w-72 h-screen p-5 shadow-lg rounded-b-lg transform transition-transform duration-300 ease-in-out ${
          dropdownVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-4 text-center text-lg">
          {navItems.map((item) => (
            <li
              key={item.name}
              className="hover:text-gray-400 transition duration-200"
            >
              <Link to={item.path} onClick={toggleDropdown}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../features/authSlice";
import SearchBar from "./searchbar";
import Userprofile from "./userProfile";
import { FaHome, FaHeartbeat } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { PiMusicNotesPlusBold } from "react-icons/pi";
import { BiSolidPhotoAlbum } from "react-icons/bi";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillCustomerService } from "react-icons/ai";

// Full navigation items array (for sliding panel)
const navItems = [
  { name: "Home", path: "/", icon: <FaHome size={24} /> },
  { name: "Favorites", path: "/favorites", icon: <FaHeartbeat size={24} /> },
  { name: "Songs", path: "/Allsongs", icon: <PiMusicNotesPlusBold size={24} /> },
  { name: "Artist", path: "/AllArtists", icon: <AiFillCustomerService size={24} /> },
  { name: "Explore", path: "/", icon: <MdExplore size={24} /> },
  { name: "Add Song", path: "/Song", icon: <AiFillPlusCircle size={24} /> },
  { name: "Add Albums", path: "/Album", icon: <BiSolidPhotoAlbum size={24} /> },
];

// Desktop mini-navigation: Only Home, Favorites, Explore
const desktopNavItems = navItems.filter(
  (item) =>
    item.name === "Home" ||
    item.name === "Favorites" ||
    item.name === "Explore"
);

const Navbar = () => {
  const authUser = useSelector(selectAuthUser);
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();

  // Set sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative">
      {/* Main Navbar */}
      <div
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          sticky ? "bg-black/90 shadow-lg backdrop-blur-md" : "bg-black"
        }`}
      >
        <nav className="container mx-auto px-5 py-1 flex items-center justify-between border-b-2 border-white">
          {/* Left: Logo & Menu Button */}
          <div className="flex items-center gap-3">
            <button
              className="text-white text-2xl"
              onClick={toggleMenu}
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>
            <Link to="/" className="font-extrabold">
              <img
                src="https://res.cloudinary.com/dhfjy459o/image/upload/v1722677369/logo_2-removebg-preview_nwfo5w.png"
                alt="Logo"
                className="h-10 sm:h-12 lg:h-14 transition-all duration-500 ease-in-out transform hover:shadow-xl hover:border-2 hover:border-blue-500/30 hover:rounded-lg"
              />
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-grow flex justify-center">
            <SearchBar />
          </div>

          {/* Right: Desktop Mini-Navigation & User Profile */}
          <div className="flex items-center gap-4">
            {/* Desktop mini-navigation (icons only) */}
            <ul className="hidden lg:flex gap-6">
              {desktopNavItems.map((item) => (
                <li
                  key={item.name}
                  className="list-none p-2 rounded-md transition-all duration-300 hover:scale-110 border-x-2 border-white"
                >
                  <NavLink to={item.path} className="text-white flex gap-3">
                    {item.icon}
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            {authUser ? (
              <Userprofile />
            ) : (
              <Link
                to="/signin"
                className="text-white bg-red-400 px-3 py-2 rounded-md font-bold border border-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Sliding Navigation Panel (opens from the left, below the navbar) */}
      <div
        className={`fixed top-[60px] left-0 w-72 h-[calc(100vh-60px)] bg-black text-white shadow-lg transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5">
          <ul className="flex flex-col gap-4 text-left text-lg">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-2 hover:text-gray-400 transition duration-200"
                onClick={toggleMenu}
              >
                <NavLink to={item.path} className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

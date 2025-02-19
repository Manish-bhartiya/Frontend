import React from "react";
import { Link } from "react-router-dom";
import { MdHome, MdExplore, MdLibraryMusic, MdFavorite } from "react-icons/md";

const LeftSection = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 hidden lg:block">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="flex items-center text-lg hover:text-gray-400">
              <MdHome className="mr-4" /> Home
            </Link>
          </li>
          <li>
            <Link to="/explore" className="flex items-center text-lg hover:text-gray-400">
              <MdExplore className="mr-4" /> Explore
            </Link>
          </li>
          <li>
            <Link to="/library" className="flex items-center text-lg hover:text-gray-400">
              <MdLibraryMusic className="mr-4" /> Library
            </Link>
          </li>
          <li>
            <Link to="/favorites" className="flex items-center text-lg hover:text-gray-400">
              <MdFavorite className="mr-4" /> Favorites
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LeftSection;
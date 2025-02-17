// src/components/LeftSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const LeftSection = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="text-lg hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link to="/explore" className="text-lg hover:text-gray-400">Explore</Link>
          </li>
          <li>
            <Link to="/library" className="text-lg hover:text-gray-400">Library</Link>
          </li>
          <li>
            <Link to="/signup" className="text-lg hover:text-gray-400">Signup</Link>
          </li>
          <li>
            <Link to="/signin" className="text-lg hover:text-gray-400">Login</Link>
          </li>
        </ul>
      </nav> 
    </div>
  );
};

export default LeftSection;

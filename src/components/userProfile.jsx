import React, { useState } from "react";
import toast from "react-hot-toast";

const Userprofile = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the dialog box

  const user = JSON.parse(localStorage.getItem("Users"));

  if (!user) {
    toast.error("User not found, please login again :)");
    return null; // Ensure the component doesn't render without a user
  }

  const { name, gmail, image } = user; // Destructure user details

  // Toggle dialog box on profile picture click
  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Profile photo, clicking on this will toggle the dialog */}
      <div
        className="rounded-full cursor-pointer"
        onClick={toggleDialog}
      >
        <img
          src={
            image ||
            "https://via.placeholder.com/150" // Fallback in case no profile pic is available
          }
          alt="User profile"
          className="w-10 h-10 rounded-full border-x-2 border-slate-400 shadow-lg"
        />
      </div>

      {/* Dialog box that appears when profile picture is clicked */}
      {isOpen && (
        <div
          className="absolute top-16 right-0 mt-2 p-4 bg-white shadow-lg rounded-lg z-50"
          style={{ minWidth: "200px" }}
        >
          <div className="flex items-center space-x-4">
            <img
              src={
                image ||
                "https://via.placeholder.com/150" // Fallback in case no profile pic is available
              }
              alt="User profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-black">{name}</p>
              <p className="text-black">{gmail}</p>
            </div>
          </div>

          {/* Additional user details could go here */}
          <div className="mt-4">
            <button
              className="bg-black text-white p-2 rounded-md hover:bg-slate-800 duration-150 cursor-pointer w-full"
              onClick={() => {
                // Logic for logout or other actions
                localStorage.removeItem("Users");
                window.location.reload(); // Refresh page on logout
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userprofile;

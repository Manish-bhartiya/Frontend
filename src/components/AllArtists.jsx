import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiconnecter from "../services/apiconnecter";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AllArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all artists (from your playlists/allPlaylist endpoint)
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        // Replace 'playlists/allPlaylist' with your actual API endpoint for artists if needed.
        const response = await apiconnecter("get", "playlists/allPlaylist");
        console.log("response is this ->", response);
        // Use response.data.playlists instead of response.data.artists
        const artistsData = response.data?.playlists || [];
        setArtists(artistsData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch artists.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        {/* Display skeleton loaders for artists */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton circle={true} height={150} width={150} />
              <Skeleton height={20} width={150} className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-8">All Artists</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {artists.map((artist) => (
          <div key={artist._id} className="flex flex-col items-center">
            <Link to={`/playlist/${artist.name}`}>
              <img
                src={artist.image} // Update with your artist image URL if needed
                alt={artist.name}
                className="w-32 h-32 rounded-full object-cover shadow-lg hover:opacity-80 transition duration-300"
              />
              <p className="mt-2 text-lg font-semibold text-center hover:text-gray-400">
                {artist.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllArtistsPage;

import { useState } from "react";
import apiconnecter from "../services/apiconnecter";

const CreateAlbum = () => {
  const [albumData, setAlbumData] = useState({
    name: "",
    image: "",
  });

  const [songs, setSongs] = useState([{ name: "", image: "", artist: "", file: null }]);
  const [loading, setLoading] = useState(false);

  // Handle changes for album fields (name, image)
  const handleAlbumChange = (e) => {
    const { name, value } = e.target;
    setAlbumData({ ...albumData, [name]: value });
  };

  // Handle changes for song fields (name, image, artist, file)
  const handleSongChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedSongs = [...songs];
    if (name === "file") {
      updatedSongs[index][name] = files[0];
    } else {
      updatedSongs[index][name] = value;
    }
    setSongs(updatedSongs);
  };

  // Add a new song entry
  const handleAddSong = () => {
    setSongs([...songs, { name: "", image: "", artist: "", file: null }]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", albumData.name);
    formDataToSend.append("image", albumData.image);

    // Loop through songs and append each song field correctly
    songs.forEach((song, index) => {
      if (song.file) {
        formDataToSend.append(`songs[${index}][name]`, song.name);
        formDataToSend.append(`songs[${index}][image]`, song.image);
        formDataToSend.append(`songs[${index}][artist]`, song.artist);
        formDataToSend.append(`songs[${index}][file]`, song.file);
      }
    });

    try {
      const response = await apiconnecter("POST", "albums/createAlbum", formDataToSend);
      alert("Album created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating album:", error);
      alert("Failed to create album.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-lg mx-auto bg-slate-400 relative top-20 justify-center p-6 rounded shadow-md space-y-6"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-center">Create Album</h1>
      <div>
        <label className="block mb-2 text-gray-700">Album Name</label>
        <input
          type="text"
          name="name"
          value={albumData.name}
          onChange={handleAlbumChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Album Name"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-700">Album Image URL</label>
        <input
          type="text"
          name="image"
          value={albumData.image}
          onChange={handleAlbumChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Image URL"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-700">Songs</label>
        {songs.map((song, index) => (
          <div key={index} className="p-4 mb-4 border rounded-lg shadow-sm space-y-4">
            {/* Song Name */}
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Song Name:
              </label>
              <input
                type="text"
                name="name"
                value={song.name}
                onChange={(e) => handleSongChange(index, e)}
                placeholder="Enter song name"
                className="p-2 border border-gray-300 rounded"
                required
              />
            </div>
            {/* Song Image URL */}
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Song Image URL:
              </label>
              <input
                type="text"
                name="image"
                value={song.image}
                onChange={(e) => handleSongChange(index, e)}
                placeholder="Enter song image URL"
                className="p-2 border border-gray-300 rounded"
                required
              />
            </div>
            {/* Artist Name */}
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Artist Name:
              </label>
              <input
                type="text"
                name="artist"
                value={song.artist}
                onChange={(e) => handleSongChange(index, e)}
                placeholder="Enter artist name"
                className="p-2 border border-gray-300 rounded"
                required
              />
            </div>
            {/* Song File */}
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Song File:
              </label>
              <input
                type="file"
                name="file"
                accept="audio/*"
                onChange={(e) => handleSongChange(index, e)}
                className="p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSong}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Song
        </button>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} transition duration-200`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default CreateAlbum;

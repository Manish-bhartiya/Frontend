import { useState } from "react";
import axios from "axios";

const CreateAlbum = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    songs: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSong = () => {
    setFormData({
      ...formData,
      songs: [...formData.songs, { name: "", url: "" }],
    });
  };

  const handleSongChange = (index, field, value) => {
    const updatedSongs = [...formData.songs];
    updatedSongs[index][field] = value;
    setFormData({ ...formData, songs: updatedSongs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/albums", formData);
      alert("Album created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating album:", error);
      alert("Failed to create album.");
    }
  };

  return (
    <form
      className="max-w-lg mx-auto bg-white p-6 rounded shadow-md space-y-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-4">Create Album</h1>
      <div>
        <label className="block mb-2 text-gray-700">Album Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Album Name"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-700">Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Image URL"
        />
      </div>
      <div>
        <label className="block mb-2 text-gray-700">Songs</label>
        {formData.songs.map((song, index) => (
          <div key={index} className="space-y-2">
            <input
              type="text"
              placeholder="Song Name"
              value={song.name}
              onChange={(e) => handleSongChange(index, "name", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Song URL"
              value={song.url}
              onChange={(e) => handleSongChange(index, "url", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSong}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Song
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateAlbum;

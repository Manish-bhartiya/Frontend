import React, { useState } from "react";
import  apiconnecter  from "../services/apiconnecter";

const SongUploadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    artist: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    // Build FormData to match the Postman request
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("artist", formData.artist);
    formDataToSend.append("file", formData.file);

    // Debug: Log FormData contents (inspect keys/values in the console)
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key + ": ", value);
    }

    try {
      // Do not set the Content-Type header manually!
      const response = await apiconnecter("post", "songs/createsongs", formDataToSend);
      setResponseMessage(response.data.message || "Song uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error.response?.data);
      setResponseMessage(
        error.response?.data?.message || "Error uploading the song"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Upload a Song</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Song Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-medium text-gray-700">
            Song Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter song name"
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Artist Image URL */}
        <div className="flex flex-col">
          <label htmlFor="image" className="mb-2 font-medium text-gray-700">
            Artist Image URL:
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="Enter image URL"
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Artist Name */}
        <div className="flex flex-col">
          <label htmlFor="artist" className="mb-2 font-medium text-gray-700">
            Artist Name:
          </label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            placeholder="Enter artist name"
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Song File */}
        <div className="flex flex-col">
          <label htmlFor="file" className="mb-2 font-medium text-gray-700">
            Song File:
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Uploading..." : "Upload Song"}
        </button>
      </form>

      {responseMessage && (
        <p className="mt-4 text-center text-gray-700">{responseMessage}</p>
      )}
    </div>
  );
};

export default SongUploadForm;

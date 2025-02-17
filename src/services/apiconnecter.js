import axios from "axios";

// Create an Axios instance without a default Content-Type header
export const axiosinstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://backand-js.vercel.app/api/"
      : "http://localhost:4001/api/",
  // Do not set Content-Type here; let each request set it as needed.
});

// Utility function for API calls
export const apiconnecter = (
  method,
  url,
  bodydata = null,
  customHeaders = {},
  params = {}
) => {
  // Initialize headers from customHeaders
  let headers = { ...customHeaders };

  // If the bodydata is NOT an instance of FormData, then set the Content-Type to JSON
  if (!(bodydata instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return axiosinstance({
    method, // HTTP method (GET, POST, DELETE, etc.)
    url, // API endpoint
    data: bodydata, // Request body
    headers, // Use the headers computed above
    params, // Query parameters
  });
};

// Example usage for JSON data:
// apiconnecter("post", "users/addFavorite", { songId: "123", userId: "456" });

// Example usage for file uploads with FormData:
// const formData = new FormData();
// formData.append("name", "My New Song");
// formData.append("image", "https://example.com/song-cover.jpg");
// formData.append("artist", "Artist Name");
// formData.append("file", selectedFile);
// apiconnecter("post", "songs/createsongs", formData);

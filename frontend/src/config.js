let API_URL = import.meta.env.VITE_API_URL || "https://blog-api-74l4.onrender.com";

if (API_URL && !API_URL.startsWith("http")) {
  // If it's a Render host (no dots), append .onrender.com
  if (!API_URL.includes(".")) {
    API_URL = `${API_URL}.onrender.com`;
  }
  API_URL = `https://${API_URL}`;
}

export default API_URL;

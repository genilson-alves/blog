let API_URL = import.meta.env.VITE_API_URL || "https://blog-api-74l4.onrender.com";

if (API_URL && !API_URL.startsWith("http")) {
  API_URL = `https://${API_URL}`;
}

export default API_URL;

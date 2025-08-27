// Central Axios client. Attaches Authorization header automatically.
// Base URL comes from env or falls back to localhost.
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000/api",
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

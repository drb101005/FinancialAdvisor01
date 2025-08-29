import axios from "axios";

// Change the baseURL to your backend server (FastAPI/Django/Node etc.)
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // example for FastAPI
  withCredentials: true, // if you use cookies/session auth
});

export default api;
    
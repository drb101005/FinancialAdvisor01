// src/components/Unauthorized.jsx
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-4xl font-bold mb-6">Unauthorized</h1>
      <p className="mb-6">You must be logged in to access this page.</p>
      <Link
        to="/login"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold"
      >
        Go to Login
      </Link>
    </div>
  );
}

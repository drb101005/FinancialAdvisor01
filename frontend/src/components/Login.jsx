import React, { useState } from "react";
import { login } from "../authService";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (error) {
      setLoginErr("Incorrect username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans relative overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent tracking-tight">
            BrainBoard
          </h1>
          <p className="text-gray-300 mt-2 text-lg">Secure Login for Advisors</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200 text-lg"
            />
          </div>

          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition duration-200 text-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300 ease-in-out transform hover:-translate-y-0.5 text-lg shadow-lg"
          >
            Login
          </button>
        </form>

        {loginErr && (
          <p className="mt-6 text-center text-red-400 text-sm font-medium">
            {loginErr}
          </p>
        )}

        <p className="mt-8 text-center text-gray-400 text-base">
          New to BrainBoard?{" "}
          <span
            className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer transition duration-200"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

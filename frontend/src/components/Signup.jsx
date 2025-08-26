import React, { useState } from "react";
import { signup } from "../authService";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [errs, setErrs] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, username, password, password2);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.password) {
        setErrs(error.response.data.password);
      } else {
        setErrs(["An unexpected error occurred. Please try again."]);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans relative overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
            BrainBoard
          </h1>
          <p className="text-gray-300 mt-2 text-lg">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 text-lg"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 text-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 text-lg"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition duration-200 text-lg"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300 ease-in-out transform hover:-translate-y-0.5 text-lg shadow-lg"
          >
            Signup
          </button>
        </form>

        {errs.length > 0 && (
          <div className="mt-6">
            {errs.map((error, i) => (
              <p key={i} className="text-center text-red-400 text-sm font-medium">
                {error}
              </p>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-gray-400 text-base">
          Already have an account?{" "}
          <span
            className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer transition duration-200"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;

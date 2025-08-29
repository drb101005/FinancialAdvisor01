// src/components/CreatePortfolio.jsx
import React, { useState } from "react";
import api from "../api/apiClient";

export default function CreatePortfolio() {
  const [portfolio, setPortfolio] = useState({ name: "", traits: {} });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setPortfolio((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTraitChange = (e) => {
    setPortfolio((prev) => ({
      ...prev,
      traits: { ...prev.traits, [e.target.name]: e.target.value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    setSuccess(false);

    try {
      await api.post("/portfolio/create/", portfolio);
      setSuccess(true);
      setPortfolio({ name: "", traits: {} });
    } catch {
      setErr("Failed to create portfolio.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white/10 rounded-2xl border border-white/20 shadow-2xl text-white">
      <h2 className="text-xl font-bold mb-4">Create Portfolio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Portfolio Name"
          value={portfolio.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/5 border border-gray-600"
        />

        {/* Example trait fields */}
        <input
          type="text"
          name="risk_tolerance"
          placeholder="Risk Tolerance"
          value={portfolio.traits.risk_tolerance || ""}
          onChange={handleTraitChange}
          className="w-full p-2 rounded bg-white/5 border border-gray-600"
        />
        <input
          type="text"
          name="investment_style"
          placeholder="Investment Style"
          value={portfolio.traits.investment_style || ""}
          onChange={handleTraitChange}
          className="w-full p-2 rounded bg-white/5 border border-gray-600"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-2 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Portfolio"}
        </button>
      </form>
      {err && <div className="text-red-400 mt-3">{err}</div>}
      {success && <div className="text-emerald-400 mt-3">Portfolio created!</div>}
    </div>
  );
}

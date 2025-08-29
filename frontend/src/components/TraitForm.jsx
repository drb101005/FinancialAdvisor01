// src/components/TraitForm.jsx
import React, { useState } from "react";
import api from "../api/apiClient";

export default function TraitForm() {
  const [traits, setTraits] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setTraits((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setSuccess(false);

    try {
      await api.post("/profile/update/", { traits });
      setSuccess(true);
    } catch {
      setErr("Failed to save traits.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white/10 rounded-2xl border border-white/20 shadow-2xl text-white">
      <h2 className="text-xl font-bold mb-4">Update Traits</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Example trait fields — expand as per your backend schema */}
        <input
          type="text"
          name="risk_tolerance"
          placeholder="Risk Tolerance"
          value={traits.risk_tolerance || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/5 border border-gray-600"
        />
        <input
          type="text"
          name="investment_style"
          placeholder="Investment Style"
          value={traits.investment_style || ""}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/5 border border-gray-600"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-2 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Traits"}
        </button>
      </form>
      {err && <div className="text-red-400 mt-3">{err}</div>}
      {success && <div className="text-emerald-400 mt-3">Traits saved!</div>}
    </div>
  );
}

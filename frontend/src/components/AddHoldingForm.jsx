import React, { useState } from "react";
import api from "../api/apiClient";

export default function AddHoldingForm({ onCreated }) {
  const [form, setForm] = useState({
    ticker: "",
    quantity: "",
    avg_buy_price: "",
    current_price: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    try {
      const payload = {
        ticker: form.ticker.trim().toUpperCase(),
        quantity: Number(form.quantity),
        avg_buy_price: Number(form.avg_buy_price),
        current_price: Number(form.current_price || form.avg_buy_price),
      };
      await api.post("/holdings/add/", payload);
      setForm({ ticker: "", quantity: "", avg_buy_price: "", current_price: "" });
      onCreated?.();
    } catch {
      setErr("Failed to add holding.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <input
        name="ticker"
        placeholder="Ticker (e.g., AAPL)"
        value={form.ticker}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
      />
      <input
        type="number"
        step="any"
        name="quantity"
        placeholder="Quantity"
        value={form.quantity}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
      />
      <input
        type="number"
        step="any"
        name="avg_buy_price"
        placeholder="Avg Buy Price"
        value={form.avg_buy_price}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
      />
      <input
        type="number"
        step="any"
        name="current_price"
        placeholder="Current Price (optional)"
        value={form.current_price}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
      />

      {err && <div className="text-red-300 text-sm">{err}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add Holding"}
      </button>
    </form>
  );
}

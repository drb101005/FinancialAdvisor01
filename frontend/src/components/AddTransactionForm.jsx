import React, { useState } from "react";
import api from "../api/apiClient";

export default function AddTransactionForm({ onCreated }) {
  const [form, setForm] = useState({
    ticker: "",
    transaction_type: "BUY",
    quantity: "",
    price: "",
    date: "",
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
        transaction_type: form.transaction_type,
        quantity: Number(form.quantity),
        price: Number(form.price),
        date: form.date || new Date().toISOString().slice(0, 10),
      };
      await api.post("/transactions/add/", payload);
      setForm({ ticker: "", transaction_type: "BUY", quantity: "", price: "", date: "" });
      onCreated?.();
    } catch {
      setErr("Failed to add transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <input
        name="ticker"
        placeholder="Ticker (e.g., TSLA)"
        value={form.ticker}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
      />
      <select
        name="transaction_type"
        value={form.transaction_type}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
      >
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
        <option value="DIVIDEND">DIVIDEND</option>
      </select>
      <input
        type="number"
        step="any"
        name="quantity"
        placeholder="Quantity"
        value={form.quantity}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
      />
      <input
        type="number"
        step="any"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
      />

      {err && <div className="text-red-300 text-sm">{err}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
}

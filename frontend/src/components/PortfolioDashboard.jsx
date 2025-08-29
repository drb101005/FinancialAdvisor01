import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import AddHoldingForm from "./AddHoldingForm";
import AddTransactionForm from "./AddTransactionForm";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl ${className}`}>
    {children}
  </div>
);

export default function PortfolioDashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/portfolio/");
      setPortfolio(data);
      setErr("");
    } catch (e) {
      setErr("Failed to load portfolio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-end justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            Portfolio
          </h1>
          <button
            onClick={fetchPortfolio}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition"
          >
            Refresh
          </button>
        </div>

        {loading && <Card>Loading...</Card>}
        {err && !loading && <Card className="text-red-300">{err}</Card>}

        {portfolio && !loading && (
          <>
            <Card className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-gray-300 text-sm">Total Value</div>
                <div className="text-2xl font-semibold">${(portfolio.total_value ?? 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-300 text-sm">Holdings</div>
                <div className="text-2xl font-semibold">{(portfolio.holdings ?? []).length}</div>
              </div>
              <div>
                <div className="text-gray-300 text-sm">Created</div>
                <div className="text-lg">{new Date(portfolio.created_at).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-gray-300 text-sm">Updated</div>
                <div className="text-lg">{new Date(portfolio.updated_at).toLocaleDateString()}</div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Holdings table */}
              <Card className="md:col-span-2">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Holdings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="text-sm text-gray-300">
                      <tr>
                        <th className="py-2 pr-6">Ticker</th>
                        <th className="py-2 pr-6">Qty</th>
                        <th className="py-2 pr-6">Avg Buy</th>
                        <th className="py-2 pr-6">Current</th>
                        <th className="py-2 pr-6">Value</th>
                        <th className="py-2 pr-6">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-100/90">
                      {portfolio.holdings?.length ? (
                        portfolio.holdings.map((h) => (
                          <tr key={h.id} className="border-t border-white/10">
                            <td className="py-2 pr-6 font-semibold">{h.ticker}</td>
                            <td className="py-2 pr-6">{h.quantity}</td>
                            <td className="py-2 pr-6">${Number(h.avg_buy_price).toLocaleString()}</td>
                            <td className="py-2 pr-6">${Number(h.current_price).toLocaleString()}</td>
                            <td className="py-2 pr-6">${Number(h.current_value).toLocaleString()}</td>
                            <td className="py-2 pr-6">{new Date(h.last_updated).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="py-6 text-gray-400" colSpan="6">
                            No holdings yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Side forms */}
              <div className="space-y-8">
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Add Holding</h3>
                  <AddHoldingForm
                    onCreated={async () => {
                      await api.get("/portfolio/"); // no-op call hint; primary refresh below
                      fetchPortfolio();
                    }}
                  />
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
                  <AddTransactionForm
                    onCreated={() => {
                      // You may want to refetch if transactions affect totals on your backend.
                      fetchPortfolio();
                    }}
                  />
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// src/components/PortfolioDetail.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { motion } from 'framer-motion';
import { chartOptions } from '../utils/chartConfig';

const API_BASE = 'http://127.0.0.1:8000/api/portfolio';

const PortfolioDetail = ({ portfolioId }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('6mo');
  const [interval, setInterval] = useState('1d');
  const [expanded, setExpanded] = useState(null);

  const [selectedTickerData, setSelectedTickerData] = useState(null);
  const [selectedTickerName, setSelectedTickerName] = useState(null);

  useEffect(() => {
    fetchPortfolioData();
  }, [portfolioId]);

  useEffect(() => {
    if (portfolio) fetchHistoryData();
  }, [period, interval, portfolio]);

  const fetchPortfolioData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/portfolios/${portfolioId}/detail/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      setPortfolio(res.data);
    } catch (err) {
      setError('Failed to fetch portfolio data');
    }
  };

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/portfolios/${portfolioId}/history/?period=${period}&interval=${interval}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }
      );
      setHistoryData(res.data);
    } catch (err) {
      setError('Failed to fetch history data');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (ticker) => {
    const colors = [
      'rgb(6, 182, 212)',
      'rgb(20, 184, 166)',
      'rgb(34, 211, 238)',
      'rgb(45, 212, 191)',
      'rgb(59, 130, 246)',
      'rgb(56, 189, 248)'
    ];
    const idx = historyData.tickers.indexOf(ticker) % colors.length;
    const color = colors[idx];
    return {
      labels: ticker.dates,
      datasets: [
        {
          label: `${ticker.ticker} Price`,
          data: ticker.prices,
          borderColor: color,
          backgroundColor: color + '20',
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    };
  };

  if (loading && !portfolio) return <div className="p-4 text-white">Loading portfolio...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!portfolio) return <div className="p-4 text-white">No portfolio found</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* Header */}
        <div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-3 tracking-tight">
            {portfolio.name}
          </h1>
          <p className="text-gray-400 text-lg italic">{portfolio.note}</p>
          <p className="text-3xl font-bold mt-4">
            Total Value:
            <span className="ml-2 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              ${portfolio.total_value?.toLocaleString() || 'N/A'}
            </span>
          </p>
        </div>

        {/* Holdings Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              Holdings
            </h2>
            <p className="text-sm text-gray-300 sm:text-right">
              📊 Click on any tile to display its chart below
            </p>
          </div>

          {/* Holdings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.holdings.map((holding) => {
              const tickerData = historyData?.tickers.find(t => t.ticker === holding.ticker);
              return (
                <motion.div
                  key={holding.id}
                  className={`relative rounded-xl p-6 bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-cyan-400/20 duration-300`}
                  onClick={() => {
                    const newExpanded = expanded === holding.id ? null : holding.id;
                    setExpanded(newExpanded);
                    setSelectedTickerData(newExpanded ? tickerData : null);
                    setSelectedTickerName(newExpanded ? holding.ticker : null);
                  }}
                >
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                      {holding.ticker}
                    </h3>
                    <p className="text-gray-300">Quantity: {holding.quantity}</p>
                    <p className="text-gray-300">Avg Buy: ${holding.avg_buy_price}</p>
                    <p className="text-gray-300">Current: ${holding.current_price || 'N/A'}</p>
                    <p className="font-semibold">
                      Value:
                      <span className="ml-2 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                        ${holding.current_value?.toLocaleString() || 'N/A'}
                      </span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Chart Viewer */}
        {selectedTickerData && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-8 bg-white/10 border border-white/10 rounded-xl backdrop-blur-lg shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              {selectedTickerName} • Price History
            </h2>
            <div className="w-full h-96">
              <Line data={generateChartData(selectedTickerData)} options={chartOptions} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetail;

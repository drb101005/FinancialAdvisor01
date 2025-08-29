// src/components/PortfolioDetail.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { chartOptions } from '../utils/chartConfig';

const API_BASE = 'http://127.0.0.1:8000/api/portfolio';

const PortfolioDetail = ({ portfolioId }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('6mo');
  const [interval, setInterval] = useState('1d');

  useEffect(() => {
    fetchPortfolioData();
  }, [portfolioId]);

  useEffect(() => {
    if (portfolio) {
      fetchHistoryData();
    }
  }, [period, interval, portfolio]);
  const fetchPortfolioData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/portfolios/${portfolioId}/detail/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`, // Adjust auth as needed
        }
      });
      setPortfolio(response.data);
    } catch (err) {
      setError('Failed to fetch portfolio data');
      console.error(err);
    }
  };

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/portfolios/${portfolioId}/history/?period=${period}&interval=${interval}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
          }
        }
      );
      setHistoryData(response.data);
    } catch (err) {
      setError('Failed to fetch history data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (ticker) => {
    const colors = [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)'
    ];
    
    const colorIndex = historyData.tickers.indexOf(ticker) % colors.length;
    const color = colors[colorIndex];

    return {
      labels: ticker.dates,
      datasets: [
        {
          label: `${ticker.ticker} Price`,
          data: ticker.prices,
          borderColor: color,
          backgroundColor: color + '20',
          tension: 0.1,
        },
      ],
    };
  };

  if (loading && !portfolio) return <div className="p-4">Loading portfolio...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!portfolio) return <div className="p-4">No portfolio found</div>;

  return (
    <div className="p-6">
      {/* Portfolio Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{portfolio.name}</h1>
        <p className="text-gray-600 mb-2">{portfolio.note}</p>
        <p className="text-xl font-semibold">
          Total Value: ${portfolio.total_value?.toLocaleString() || 'N/A'}
        </p>
      </div>

      {/* Holdings Summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Holdings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.holdings.map((holding) => (
            <div key={holding.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-lg font-semibold">{holding.ticker}</h3>
              <p>Quantity: {holding.quantity}</p>
              <p>Avg Buy Price: ${holding.avg_buy_price}</p>
              <p>Current Price: ${holding.current_price || 'N/A'}</p>
              <p className="font-semibold">
                Current Value: ${holding.current_value?.toLocaleString() || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Controls */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Price Charts</h2>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Period:</label>
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="1mo">1 Month</option>
              <option value="3mo">3 Months</option>
              <option value="6mo">6 Months</option>
              <option value="1y">1 Year</option>
              <option value="2y">2 Years</option>
              <option value="5y">5 Years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Interval:</label>
            <select 
              value={interval} 
              onChange={(e) => setInterval(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="1d">Daily</option>
              <option value="1wk">Weekly</option>
              <option value="1mo">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      {loading && <div className="text-center py-8">Loading charts...</div>}
      
      {historyData && !loading && (
        <div className="space-y-8">
          {historyData.tickers.map((ticker, index) => (
            <div key={ticker.ticker} className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                {ticker.ticker} - {ticker.quantity} shares
              </h3>
              {ticker.error ? (
                <div className="text-red-600">Error loading data: {ticker.error}</div>
              ) : ticker.prices.length > 0 ? (
                <div style={{ height: '400px' }}>
                  <Line 
                    data={generateChartData(ticker)} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          display: true,
                          text: `${ticker.ticker} Price History (${period}, ${interval})`,
                        },
                      },
                    }} 
                  />
                </div>
              ) : (
                <div className="text-gray-500">No price data available</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioDetail;

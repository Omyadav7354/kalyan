import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MarketHistory() {
  const [marketHistory, setMarketHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch market history data
  const fetchMarketHistory = async () => {
    try {
      const response = await axios.get('https://sratebackend-1.onrender.com/api/marketHistory');
      setMarketHistory(response.data);
    } catch (err) {
      setError('Failed to fetch market history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketHistory();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Market History</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aankdo Open
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aankdo Close
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jodi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marketHistory.map((market, index) => (
              <tr key={market._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{market.market_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{market.aankdo_date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{market.aankdo_open || 'XXX'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{market.aankdo_close || 'XXX'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{market.jodi || 'XX'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {marketHistory.length === 0 && (
        <div className="text-center p-4 text-gray-500">No market history available.</div>
      )}
    </div>
  );
}

export default MarketHistory;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SettledBets() {
  const [settledBets, setSettledBets] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [betTypes, setBetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    username: '',
    market: '',
    betType: '',
    status: 'all',
  });

  const fetchSettledBets = async () => {
    try {
      const userResponse = await axios.get('https://sratebackend-1.onrender.com/user');
      const allUsers = userResponse.data;

      const allSettledBets = allUsers.flatMap((user) =>
        user.betDetails
          .filter((bet) => bet.status !== 'Pending')
          .map((bet) => ({
            ...bet,
            username: user.username,
            userId: user._id,
          }))
      );

      const uniqueBetTypes = [...new Set(allSettledBets.map((bet) => bet.matkaBetType.category))];
      setBetTypes(uniqueBetTypes);

      setSettledBets(allSettledBets);
    } catch (error) {
      console.error('Error fetching settled bets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarkets = async () => {
    try {
      const response = await axios.get('https://sratebackend-1.onrender.com/api/market-data');
      setMarkets(response.data);
    } catch (error) {
      console.error('Error fetching markets:', error);
    }
  };

  useEffect(() => {
    fetchSettledBets();
    fetchMarkets();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    let filtered = [...settledBets];

    if (filters.username) {
      filtered = filtered.filter((bet) =>
        bet.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    if (filters.market) {
      filtered = filtered.filter((bet) => bet.market_id === filters.market);
    }

    if (filters.betType) {
      filtered = filtered.filter((bet) => bet.matkaBetType.category === filters.betType);
    }

    if (filters.status === 'Won') {
      filtered = filtered.filter((bet) => bet.status === 'Won' );
    } else if (filters.status === 'Lost') {
      filtered = filtered.filter((bet) => bet.status === 'Lost');
    }

    return filtered;
  };

  const filteredBets = applyFilters();

  const getStatusBadgeClass = (bet) => {
    if (bet.status === 'Lost') return 'bg-red-100 text-red-800';
    if (bet.status === 'Won') return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold">Settled Bets</h1>

        <div className="flex space-x-4">
          <input
            type="text"
            name="username"
            placeholder="Filter by Username"
            value={filters.username}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          />

          <select
            name="market"
            value={filters.market}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Markets</option>
            {markets.map((market, index) => (
              <option key={index} value={market.market_name}>
                {market.market_name}
              </option>
            ))}
          </select>

          <select
            name="betType"
            value={filters.betType}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Bet Types</option>
            {betTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="all">All Status</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bet Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Winning Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBets.map((bet, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{bet.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bet.market_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bet.matkaBetType.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bet.matkaBetNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{bet.betAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                   <div className="text-sm font-medium">{`${bet?.matchResult?.aankdo_open || 'XXX'}-${bet?.matchResult?.jodi || 'XX'}-${bet?.matchResult?.aankdo_close || 'XXX'}`}</div>
                      <div className="text-xs">
                           ↳ {bet.matkaBetNumber} ({bet.matkaBetType?.category})
                      </div>
                </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">₹{bet.winningAmount || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bet.betTime || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                      bet
                    )}`}
                  >
                    {bet.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBets.length === 0 && (
        <div className="text-center p-4 text-gray-500">No settled bets found</div>
      )}
    </div>
  );
}

export default SettledBets;

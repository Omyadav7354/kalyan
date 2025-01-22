import React, { useState, useEffect } from "react";
import axios from "axios";

function PendingBets() {
  const [settledBets, setSettledBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [betTypes, setBetTypes] = useState([]);
  const [betTimes, setBetTimes] = useState([]);
  const [filters, setFilters] = useState({
    username: "",
    market: "",
    betType: "",
  });
  const [sortBy, setSortBy] = useState(null); // "asc" or "desc"
  const [markets, setMarkets] = useState([]); // Dropdown options

  const fetchSettledBets = async () => {
    try {
      const response = await axios.get(
        "https://sratebackend-1.onrender.com/user"
      );
      const allUsers = response.data;

      const allSettledBets = allUsers.flatMap((user) =>
        user.betDetails
          .filter((bet) => bet.status === "Pending")
          .map((bet) => ({
            ...bet,
            username: user.username,
            userId: user._id,
          }))
      );

      const uniqueBetTypes = [...new Set(allSettledBets.map((bet) => bet.matkaBetType.category))];
      setBetTypes(uniqueBetTypes);
      const uniqueBetTimes = [...new Set(allSettledBets.map((bet) => bet.betTime))];
      setBetTimes(uniqueBetTimes);

      axios.get("https://sratebackend-1.onrender.com/api/market-data").then((res) => {
        setMarkets(res.data);
      });

      setSettledBets(allSettledBets.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settled bets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettledBets();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFiltersAndSorting = () => {
    let filtered = [...settledBets];

    // Apply filters
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
    if (filters.betTime) {
      filtered = filtered.filter((bet) => bet.betTime === filters.betTime);
    }

    // Apply sorting
    if (sortBy === "asc") {
      filtered.sort((a, b) => a.betAmount - b.betAmount);
    } else if (sortBy === "desc") {
      filtered.sort((a, b) => b.betAmount - a.betAmount);
    }

    return filtered;
  };

  const filteredBets = applyFiltersAndSorting();

  const toggleSort = () => {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold">Pending Bets</h1>

        {/* Filter Inputs */}
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
            {betTypes.map((betType, index) => (
              <option key={index} value={betType}>
                {betType}
              </option>
            ))}
          </select>
          <select
            name="betTime"
            value={filters.betTime}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Bet Types</option>
            {betTimes.map((betTime, index) => (
              <option key={index} value={betTime}>
                {betTime}
              </option>
            ))}
          </select>

          <button
            onClick={toggleSort}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sort by Amount ({sortBy === "asc" ? "Ascending" : "Descending"})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bet Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Winning Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBets.map((bet, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{bet.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bet.market_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bet.matkaBetType.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bet.matkaBetNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">₹{bet.betAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{bet.winningAmount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bet.betTime || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bet.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
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
        <div className="text-center p-4 text-gray-500">No bets found</div>
      )}
    </div>
  );
}

export default PendingBets;

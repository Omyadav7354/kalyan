import React, { useState, useEffect } from "react";
import axios from "axios";

const PendingBets = () => {
  const [pendingBets, setPendingBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketResults, setMarketResults] = useState({});

  // Fetch all pending bets
  const fetchPendingBets = async () => {
    try {
      const response = await axios.get(
        "https://sratebackend-1.onrender.com/user"
      );
      const allUsers = response.data;

      // Extract pending bets from all users
      const allPendingBets = allUsers.flatMap((user) =>
        user.betDetails
          .filter((bet) => bet.status === "Pending")
          .map((bet) => ({
            ...bet,
            username: user.username,
            userId: user._id,
            userWallet: user.wallet,
          }))
      );

      setPendingBets(allPendingBets);

      // Fetch market results for all unique markets
      const uniqueMarkets = [
        ...new Set(allPendingBets.map((bet) => bet.market_id)),
      ];
      const results = {};
      for (const marketId of uniqueMarkets) {
        const marketResult = await getMarketResults(marketId);
        if (marketResult) {
          results[marketId] = marketResult;
        }
      }
      setMarketResults(results);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending bets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBets();
  }, []);

  const getMarketResults = async (marketId) => {
    try {
      const response = await axios.get(
        "https://sratebackend-1.onrender.com/api/market-data"
      );
      const market = response.data.find((m) => m.market_name === marketId);
      return market || null;
    } catch (error) {
      console.error("Error fetching market results:", error);
      return null;
    }
  };

  const handleSettleBet = async (bet, action) => {
    try {
      const isWon = action === "won";
      const winningAmount = isWon
        ? bet.betAmount * bet.matkaBetType.multiplier
        : 0;

      const userResponse = await axios.get(
        `https://sratebackend-1.onrender.com/user/${bet.userId}`
      );
      const userData = userResponse.data;

      const updatedBetDetails = userData.betDetails.map((existingBet) => {
        if (
          existingBet.matkaBetNumber === bet.matkaBetNumber &&
          existingBet.betTime === bet.betTime &&
          existingBet.market_id === bet.market_id &&
          existingBet.betAmount === bet.betAmount
        ) {
          return {
            ...existingBet,
            status: "Settled",
            isWinner: isWon,
            winningAmount: winningAmount,
            resultDeclared: true,
            resultDeclarationTime: new Date().toISOString(),
          };
        }
        return existingBet;
      });

      const newWalletBalance = isWon
        ? userData.wallet + winningAmount
        : userData.wallet;

      await axios.put(
        `https://sratebackend-1.onrender.com/user/${bet.userId}`,
        {
          betDetails: updatedBetDetails,
          wallet: newWalletBalance,
        }
      );

      alert(isWon ? "Bet marked as won!" : "Bet marked as lost!");
      fetchPendingBets();
    } catch (error) {
      console.error("Error processing bet:", error);
      alert("Error processing bet");
    }
  };
const renderMarketResults = (bet) => {
    const market = marketResults[bet.market_id];
    if (!market) return "Loading...";

    // Format: aankdo_open-jodi-aankdo_close
    const formattedResults = `${market.aankdo_open || "XXX"}-${
      market.jodi || "XX"
    }-${market.aankdo_close || "XXX"}`;

    return (
      <div className="space-y-1">
        <div className="text-sm font-medium">{formattedResults}</div>
        <div className="text-xs text-gray-500">
          {bet.betTime === "Open" && (
            <span className="text-blue-600">
              Your Bet: {bet.matkaBetNumber} ({bet.matkaBetType.category})
            </span>
          )}
          {bet.betTime === "Close" && (
            <span className="text-green-600">
              Your Bet: {bet.matkaBetNumber} ({bet.matkaBetType.category})
            </span>
          )}
          {!bet.betTime && bet.matkaBetType.category === "Jodi" && (
            <span className="text-purple-600">
              Your Bet: {bet.matkaBetNumber} (Jodi)
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Bets</h1>

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
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Results
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingBets.map((bet, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{bet.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bet.market_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bet.matkaBetType.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bet.matkaBetNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{bet.betAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bet.betTime || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderMarketResults(bet)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSettleBet(bet, "won")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Won
                    </button>
                    <button
                      onClick={() => handleSettleBet(bet, "lost")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Lost
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pendingBets.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No pending bets found
        </div>
      )}
    </div>
  );
};

export default PendingBets;

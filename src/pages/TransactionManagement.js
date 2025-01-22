import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MyData } from "./Context";

const TransactionVerification = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { allUserData, setAllUserData, getAllUserFn } = useContext(MyData);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("https://sratebackend-1.onrender.com/user");
      setTransactions(response.data.map((i) => i.transactionRequest));
    } catch (err) {
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    getAllUserFn();
  }, []);

  // Approve transaction
  const handleApprove = async (transaction) => {
    try {
      const userData = allUserData.filter((i) => i.username === transaction.username)[0];
      const oldTransactions = userData.transactionRequest.filter(
        (i) => i.requestTime !== transaction.requestTime
      );

      await axios.put(`https://sratebackend-1.onrender.com/user/${userData._id}`, {
        wallet: +userData.wallet + +transaction.amount,
        transactionRequest: [...oldTransactions, { ...transaction, status: "Approved" }],
      });
      fetchTransactions();
      alert("Transaction Approved!");
    } catch (err) {
      alert("Failed to approve transaction. Please try again.");
    }
  };

  // Reject transaction
  const handleReject = async (transactionId) => {
    const reason = prompt("Enter the reason for rejection:");
    if (!reason) {
      alert("Rejection reason is required.");
      return;
    }

    try {
      await axios.put(`https://your-backend-url.com/api/transactions/${transactionId}`, {
        status: "Failed",
        comments: reason,
      });
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.transactionId === transactionId
            ? { ...transaction, status: "Failed" }
            : transaction
        )
      );
    } catch (err) {
      alert("Failed to reject transaction. Please try again.");
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Transaction Verification</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white sticky top-0">
            <tr>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Request Date</th>
              <th className="py-3 px-4 text-left">UTR Number</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.flat().map((transaction, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="py-2 px-4 border">{transaction?.username}</td>
                <td className="py-2 px-4 border">₹{transaction?.amount}</td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      transaction?.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : transaction?.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {transaction?.status}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  {formatDate(transaction?.requestTime)}
                </td>
                <td className="py-2 px-4 border">{transaction?.utrNumber}</td>
                <td className="py-2 px-4 border flex gap-2">
                  {transaction?.status === "Pending" && (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleApprove(transaction)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleReject(transaction.transactionId)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionVerification;

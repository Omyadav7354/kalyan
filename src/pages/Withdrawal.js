import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MyData } from "./Context";

const BankDetailsModal = ({ details, onClose }) => {
  if (!details) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Bank Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">Account Number</p>
            <p className="font-medium">{details.accountNumber}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">IFSC Code</p>
            <p className="font-medium">{details.ifscCode}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">Account Holder</p>
            <p className="font-medium">{details.accountHolderName}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">UPI ID</p>
            <p className="font-medium">{details.upiId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Withdrawal = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // Add filter state

  const { allUserData, setAllUserData, getAllUserFn } = useContext(MyData);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "https://sratebackend-1.onrender.com/user"
      );
      const users = response.data;

      // Map transactions with user bank details
      const allTransactions = users.flatMap((user) => {
        return (user.withdrawalRequest || []).map((request) => ({
          ...request,
          bankDetails: user.bankDetails, // Include bank details from user
        }));
      });

      setTransactions([allTransactions.reverse()]);
      console.log("Fetched transactions with bank details:", allTransactions);
    } catch (err) {
      setError("Failed to fetch transactions. Please try again later.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    getAllUserFn();
  }, []);

  const handleApprove = async (transaction) => {
    try {
      const userData = allUserData.find(
        (i) => i.username === transaction.username
      );
      if (!userData) {
        alert("User not found!");
        return;
      }

      if (Number(transaction.amount) > Number(userData.wallet)) {
        alert("Insufficient wallet balance!");
        return;
      }

      if (Number(transaction.amount) <= 0) {
        alert("Invalid withdrawal amount!");
        return;
      }

      const reason = prompt("Enter the reason for Approve:");

     
      const oldTransactions = userData.withdrawalRequest.filter(
        (i) => i.requestTime !== transaction.requestTime
      );

      await axios.put(
        `https://sratebackend-1.onrender.com/user/${userData._id}`,
        {
          withdrawalRequest: [
            ...oldTransactions,
            {
              ...transaction,
              status: "Approved",
              approvedAt: new Date().toISOString(),
              message: reason,
            },
          ],
        }
      );

      await Promise.all([fetchTransactions(), getAllUserFn()]);
      alert(`Withdrawal of ₹${transaction.amount} approved successfully!`);
    } catch (err) {
      console.error("Approval error:", err);
      alert("Failed to approve withdrawal. Please try again.");
    }
  };
  const handleReject = async (transaction) => {
    try {
      const userData = allUserData.find(
        (i) => i.username === transaction.username
      );
      if (!userData) {
        alert("User not found!");
        return;
      }
  
      const reason = prompt("Enter the reason for rejection:");
      if (!reason) {
        alert("Rejection reason is required.");
        return;
      }
  
      const oldTransactions = userData.withdrawalRequest.filter(
        (i) => i.requestTime !== transaction.requestTime
      );
  
      // Calculate the updated wallet balance by adding back the rejected amount
      const updatedWalletBalance =
        parseFloat(userData.wallet) + parseFloat(transaction.amount);
  
      // Update the user's data on the server
      await axios.put(
        `https://sratebackend-1.onrender.com/user/${userData._id}`,
        {
          wallet: updatedWalletBalance, // Update the wallet balance
          withdrawalRequest: [
            ...oldTransactions,
            {
              ...transaction,
              status: "Rejected",
              message: reason,
              rejectedAt: new Date().toISOString(),
            },
          ],
        }
      );
  
      // Refresh data
      await Promise.all([fetchTransactions(), getAllUserFn()]);
  
      alert(
        `Withdrawal request rejected successfully!\nAmount ₹${transaction.amount} has been added back to the wallet.`
      );
    } catch (err) {
      console.error("Rejection error:", err);
      alert("Failed to reject withdrawal. Please try again.");
    }
  };
  

  // const handleReject = async (transaction) => {
  //   try {
  //     const userData = allUserData.find(
  //       (i) => i.username === transaction.username
  //     );
  //     if (!userData) {
  //       alert("User not found!");
  //       return;
  //     }

  //     const reason = prompt("Enter the reason for rejection:");
  //     if (!reason) {
  //       alert("Rejection reason is required.");
  //       return;
  //     }

  //     const oldTransactions = userData.withdrawalRequest.filter(
  //       (i) => i.requestTime !== transaction.requestTime
  //     );

  //     await axios.put(
  //       `https://sratebackend-1.onrender.com/user/${userData._id}`,
  //       {
  //         withdrawalRequest: [
  //           ...oldTransactions,
  //           {
  //             ...transaction,
  //             status: "Rejected",
  //             message: reason,
  //             rejectedAt: new Date().toISOString(),
  //           },
  //         ],
  //       }
  //     );

  //     await Promise.all([fetchTransactions(), getAllUserFn()]);
  //     alert("Withdrawal request rejected successfully!");
  //   } catch (err) {
  //     console.error("Rejection error:", err);
  //     alert("Failed to reject withdrawal. Please try again.");
  //   }
  // };

  // Filter transactions based on status
  const filteredTransactions = transactions.flat().filter((transaction) => {
    if (filterStatus === "all") return true;
    return transaction?.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {showBankModal && (
        <BankDetailsModal
          details={selectedBankDetails}
          onClose={() => {
            setShowBankModal(false);
            setSelectedBankDetails(null);
          }}
        />
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white sticky top-0">
            <tr>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Account Details</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Request Date</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr
                key={transaction?.requestTime || index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="py-2 px-4 border">{transaction?.username}</td>
                <td className="py-2 px-4 border">
                <td className="py-2 px-4 border">
  <div className="flex items-center space-x-2">
    <span className="text-sm">
      {transaction?.bankDetails?.accountNumber ? 
        `XXXX${transaction.bankDetails.accountNumber.slice(-4)}` : 
        'No Account'
      }
    </span>
    <button
      onClick={() => {
        if (transaction?.bankDetails) {
          setSelectedBankDetails(transaction.bankDetails);
          setShowBankModal(true);
        } else {
          alert('Bank details not available');
        }
      }}
      className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
    >
      View Details
    </button>
  </div>
</td>
                </td>
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
                  {transaction?.requestTime
                    ? new Date(transaction.requestTime).toLocaleString()
                    : "N/A"}
                </td>
                <td className="py-2 px-4 border">
                  {transaction?.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                        onClick={() => handleApprove(transaction)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        onClick={() => handleReject(transaction)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {transaction?.status === "Rejected" && (
                    <span className="text-xs text-red-600">
                      Reason: {transaction.message}
                    </span>
                  )}
                  {transaction?.status === "Approved" && (
                    <span className="text-xs text-green-600">Approved</span>
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

export default Withdrawal;

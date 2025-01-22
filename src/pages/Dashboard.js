import React, { useContext, useEffect, useState } from 'react';
import { MyData } from './Context';

const Dashboard = () => {
  const { allUserData, getAllUserFn } = useContext(MyData);
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
    totalTransactions: 0,
    recentTransactions: []
  });

  useEffect(() => {
    getAllUserFn();
  }, []);

  useEffect(() => {
    if (allUserData.length > 0) {
      calculateStats();
    }
  }, [allUserData]);

  const calculateStats = () => {
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let pendingWithdrawals = 0;
    let allTransactions = [];
  
    // Get the start and end time for the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Midnight of the current day
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of the current day
  
    allUserData.forEach(user => {
      // Filter and calculate deposits for the current day
      if (user.transactionRequest) {
        user.transactionRequest.forEach(trans => {
          const transactionDate = new Date(trans.requestTime);
  
          if (trans.status === 'Approved' && transactionDate >= startOfDay && transactionDate <= endOfDay) {
            totalDeposits += Number(trans.amount);
          }
  
          // Add all transactions for recent transactions table
          allTransactions.push({
            id: trans._id,
            user: user.username,
            amount: trans.amount,
            type: 'Deposit',
            status: trans.status,
            date: trans.requestTime,
            utrNumber: trans.utrNumber
          });
        });
      }
  
      // Filter and calculate withdrawals for the current day
      if (user.withdrawalRequest) {
        user.withdrawalRequest.forEach(withdraw => {
          const withdrawalDate = new Date(withdraw.requestTime);
  
          if (withdraw.status === 'Approved' && withdrawalDate >= startOfDay && withdrawalDate <= endOfDay) {
            totalWithdrawals += Number(withdraw.amount);
          }
          if (withdraw.status === 'Pending') {
            pendingWithdrawals += Number(withdraw.amount);
          }
  
          // Add all transactions for recent transactions table
          allTransactions.push({
            id: withdraw._id,
            user: user.username,
            amount: withdraw.amount,
            type: 'Withdrawal',
            status: withdraw.status,
            date: withdraw.requestTime,
            accountDetails: withdraw.bankDetails
          });
        });
      }
    });
  
    // Sort transactions by date (most recent first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    setStats({
      totalDeposits,
      totalWithdrawals,
      pendingWithdrawals,
      totalTransactions: allTransactions.length,
      recentTransactions: allTransactions.slice(0, 100) // Get last 10 transactions
    });
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{allUserData?.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-600">Total Deposits</h2>
          <p className="text-3xl font-bold text-green-600">₹{stats.totalDeposits}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-600">Total Withdrawals</h2>
          <p className="text-3xl font-bold text-red-600">₹{stats.totalWithdrawals}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-600">Pending Withdrawals</h2>
          <p className="text-3xl font-bold text-yellow-600">₹{stats.pendingWithdrawals}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTransactions.map((transaction, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{transaction.user}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === 'Deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-2 px-4">₹{transaction.amount}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{new Date(transaction.date).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    {transaction.type === 'Deposit' ? 
                      `UTR: ${transaction.utrNumber || 'N/A'}` :
                      `A/C: ${transaction.accountDetails?.accountNumber ? 
                        'XXXX' + transaction.accountDetails.accountNumber.slice(-4) : 'N/A'}`
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Mobile</th>
                <th className="py-3 px-4 text-left">Wallet Balance</th>
                <th className="py-3 px-4 text-left">Bank Status</th>
                <th className="py-3 px-4 text-left">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {allUserData.slice(-10).map((user, index) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.mobileNumber}</td>
                  <td className="py-2 px-4">₹{user.wallet}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.bankDetails?.isApproved ? 'bg-green-100 text-green-800' :
                      user.bankDetails ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.bankDetails?.isApproved ? 'Approved' :
                       user.bankDetails ? 'Pending' : 'Not Added'}
                    </span>
                  </td>
                  <td className="py-2 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
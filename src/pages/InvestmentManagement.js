import React, { useState, useEffect } from "react";
import axios from "axios";

const InvestmentManagement = () => {
  const [groupedInvestments, setGroupedInvestments] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [formData, setFormData] = useState({
    planId: "",
    amount: "",
    dailyProfit: "",
    monthlyProfit: "",
    totalProfit: "",
  });
  const [editingInvestment, setEditingInvestment] = useState(null);

  // Fetch investments grouped by user
  const fetchInvestments = async () => {
    try {
      const response = await axios.get("https://sratebackend-2.onrender.com/signup");
      const grouped = response.data.map((user) => ({
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        investments: user.investments.map((investment) => ({
          ...investment,
          planId:
            typeof investment.planId === "object"
              ? investment.planId.planName
              : investment.planId, // Adjust based on actual data
        })),
      }));
      setGroupedInvestments(grouped);
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const toggleUserInvestments = (userId) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      planId: "",
      amount: "",
      dailyProfit: "",
      monthlyProfit: "",
      totalProfit: "",
    });
    setEditingInvestment(null);
  };

  const handleAddUpdateInvestment = async () => {
    try {
      if (editingInvestment !== null) {
        await axios.put(
          `https://sratebackend-2.onrender.com/signup/${editingInvestment.userId}/investments/${editingInvestment._id}`,
          {
            ...formData,
          }
        );
      }
      fetchInvestments();
      resetForm();
    } catch (error) {
      console.error("Error saving investment:", error);
    }
  };

  const handleEditInvestment = (investment) => {
    setFormData({
      planId: investment.planId,
      amount: investment.amount,
      dailyProfit: investment.dailyProfit,
      monthlyProfit: investment.monthlyProfit,
      totalProfit: investment.totalProfit,
    });
    setEditingInvestment(investment);
  };

  const handleDeleteInvestment = async (investment) => {
    try {
      await axios.delete(
        `https://sratebackend-2.onrender.com/signup/${investment.userId}/investments/${investment._id}`
      );
      alert("Investment deleted successfully!");
      fetchInvestments();
    } catch (error) {
      console.error("Error deleting investment:", error);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Investment Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="planId"
          placeholder="Plan ID"
          value={formData.planId}
          onChange={handleInputChange}
          className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="amount"
          placeholder="Investment Amount"
          value={formData.amount}
          onChange={handleInputChange}
          className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="dailyProfit"
          placeholder="Daily Profit"
          value={formData.dailyProfit}
          onChange={handleInputChange}
          className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="monthlyProfit"
          placeholder="Monthly Profit"
          value={formData.monthlyProfit}
          onChange={handleInputChange}
          className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="totalProfit"
          placeholder="Total Profit"
          value={formData.totalProfit}
          onChange={handleInputChange}
          className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleAddUpdateInvestment}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        {editingInvestment ? "Update Investment" : "Add Investment"}
      </button>
      {editingInvestment && (
        <button onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
      )}
      <table className="min-w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">User</th>
            <th className="border px-4 py-2">Plan ID</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Profits</th>
            <th className="border px-4 py-2">Overall Profit</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupedInvestments.map((group) => (
            <React.Fragment key={group.userId}>
              <tr
                className="bg-gray-100 cursor-pointer"
                onClick={() => toggleUserInvestments(group.userId)}
              >
                <td className="border px-4 py-2">{group.userName}</td>
                <td colSpan={6} className="text-center">
                  {expandedUserId === group.userId ? "Click to Collapse" : "Click to Expand"}
                </td>
              </tr>
              {expandedUserId === group.userId &&
                group.investments.map((investment) => (
                  <tr key={investment._id} className="bg-white">
                    <td className="border px-4 py-2"></td>
                    <td className="border px-4 py-2">{investment.planId}</td>
                    <td className="border px-4 py-2">₹{investment.amount}</td>
                    <td className="border px-4 py-2">{new Date(investment.investmentDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}</td>
                    <td className="border px-4 py-2">
                      Daily: ₹{investment.dailyProfit}, Monthly: ₹{investment.monthlyProfit}, DailyTotal(Monthly): ₹{investment.totalProfit?.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      ₹{(investment.totalProfit + investment.monthlyProfit)?.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditInvestment(investment)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInvestment(investment)}
                        className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentManagement;

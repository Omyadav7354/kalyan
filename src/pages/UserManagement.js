import React, { useContext, useEffect, useState } from "react";
import { MyData } from "./Context";
import axios from "axios";
import DepositToggle from "../components/DepositToggle";
import WithdrawalToggle from "../components/WithdrawalToggle";

const UserManagement = () => {
  useEffect(() => {
    getUserData();
  }, []);


  const { getAllUserFn } = useContext(MyData);

  const [isCreditModalOpen, setIsCreditModal] = useState(false);
  const [isDebitModalOpen, setIsDebitModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");

  const closeModal = () => {
    setIsCreditModal(false);
    setIsDebitModal(false);
    setSelectedUser(null);
    setAmount("");
  };

  const handleCredit = async (user) => {
    try {
      const oldTransactions = user.transactionRequest || [];
      await axios.put(`https://sratebackend-1.onrender.com/user/${user._id}`, {
        wallet: +user.wallet + +amount,
        transactionRequest: [
          ...oldTransactions,
          {
            amount,
            status: "Approved",
            requestTime: Date.now(),
            utrNumber: "",
            username: user._id,
            message,
          },
        ],
      });
      alert("Credited Successfully");
      setIsCreditModal(false);
      getAllUserFn();
    } catch (err) {
      console.error("Failed to add Credit:", err);
      alert("Failed to add Credit. Please try again.");
    }
  };

  const handleDebit = async (user) => {
    try {
      const oldWithdrawals = user.withdrawalRequest || [];
      await axios.put(`https://sratebackend-1.onrender.com/user/${user._id}`, {
        wallet: +user.wallet - +amount,
        withdrawalRequest: [
          ...oldWithdrawals,
          {
            amount,
            status: "Approved",
            requestTime: Date.now(),
            username: user._id,
            message,
          },
        ],
      });
      alert("Debited Successfully");
      setIsDebitModal(false);
      getAllUserFn();
    } catch (err) {
      console.error("Failed to Debit:", err);
      alert("Failed to Debit. Please try again.");
    }
  };

  const [allUserData, setAllUserData] = useState([]);
  const getUserData = () => {
    axios.get("http://localhost:9000/users").then(
      (res) => {
        setAllUserData(res.data);
      },
      (err) => {}
    );
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:9000/users/${id}`).then(
      (res) => {
        alert("User Deleted!");
        getUserData();
      },
      (err) => alert(err.message)
    );
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
     
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Sr.</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">email</th>
              <th className="py-3 px-4 text-left">number</th>
              <th className="py-3 px-4 text-left">Delete User</th>
            </tr>
          </thead>
          <tbody>
            {allUserData.map((i, index) => (
              <tr className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{index + 1} </td>
                <td className="py-2 px-4 border">{i.name}</td>
                <td className="py-2 px-4 border">{i.email}</td>
                <td className="py-2 px-4 border">{i.mobile}</td>
                <button onClick={()=> deleteUser(i._id)} className="bg-red-600 h-8 w-[90px]">Delete</button>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Credit Modal */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">
              Add Credit for {selectedUser.username}
            </h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Amount:</label>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-2 w-full rounded-md"
              />
              <label className="block text-sm font-medium">Reason:</label>
              <input
                type="text"
                placeholder="Enter Reason"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border p-2 w-full rounded-md"
              />
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCredit(selectedUser)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Add Credit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debit Modal */}
      {isDebitModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">
              Debit Amount for {selectedUser.username}
            </h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Amount:</label>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-2 w-full rounded-md"
              />
              <label className="block text-sm font-medium">Reason:</label>
              <input
                type="text"
                placeholder="Enter Reason"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border p-2 w-full rounded-md"
              />
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDebit(selectedUser)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Debit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

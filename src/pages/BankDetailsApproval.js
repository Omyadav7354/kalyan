import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MyData } from "./Context";

const BankDetailsApproval = () => {
  const [users, setUsers] = useState([]);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const { getAllUserFn } = useContext(MyData);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://sratebackend-1.onrender.com/user");
      const usersWithBankDetails = response.data.filter(user => user.bankDetails);
      const pending = usersWithBankDetails.filter(user => user?.bankDetails?.isApproved == false );
      const verified = usersWithBankDetails.filter(user => user.bankDetails.isApproved=="true");
      setUsers(pending);
      setVerifiedUsers(verified);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editUser) return;

    try {
      const response = await axios.put(
        `https://sratebackend-1.onrender.com/user/${editUser._id}`,
        { bankDetails: editUser.bankDetails }
      );
      if (response.data) {
        alert("Details updated successfully!");
        fetchUsers();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating details:", error);
      alert("Failed to update details.");
    }
  };

  const handleApprove = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      const updatedBankDetails = {
        ...user.bankDetails,
        isApproved: true,
        approvedAt: new Date().toISOString(),
      };

      const response = await axios.put(
        `https://sratebackend-1.onrender.com/user/${userId}`,
        { bankDetails: updatedBankDetails }
      );

      if (response.data) {
        alert("Bank details approved successfully!");
        fetchUsers();
        await getAllUserFn();
      }
    } catch (error) {
      console.error("Error approving bank details:", error);
      alert("Failed to approve bank details.");
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const user = users.find(u => u._id === userId);
      const updatedBankDetails = {
        ...user.bankDetails,
        isApproved: "Rejected",
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
      };

      const response = await axios.put(
        `https://sratebackend-1.onrender.com/user/${userId}`,
        { bankDetails: updatedBankDetails }
      );

      if (response.data) {
        alert("Bank details rejected successfully!");
        fetchUsers();
        await getAllUserFn();
      }
    } catch (error) {
      console.error("Error rejecting bank details:", error);
      alert("Failed to reject bank details.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Pending Bank Details Approval */}
      <h1 className="text-3xl font-bold mb-6">Pending Bank Details Approval</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg mb-8">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Account Number</th>
              <th className="py-3 px-4 text-left">IFSC Code</th>
              <th className="py-3 px-4 text-left">Account Holder</th>
              <th className="py-3 px-4 text-left">UPI ID</th>
              <th className="py-3 px-4 text-left">UPI Phone Number</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center">
                  No pending bank details for approval
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{user.username}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.accountNumber}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.ifscCode}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.accountHolderName}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.upiId}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.upiphoneNumber}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Verified Bank Details */}
      <h2 className="text-2xl font-bold mb-4">Verified Bank Details</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Account Number</th>
              <th className="py-3 px-4 text-left">IFSC Code</th>
              <th className="py-3 px-4 text-left">Account Holder</th>
              <th className="py-3 px-4 text-left">UPI ID</th>
              <th className="py-3 px-4 text-left">UPI Phone Number</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifiedUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-4 px-4 text-center">
                  No verified bank details
                </td>
              </tr>
            ) : (
              verifiedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{user.username}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.accountNumber}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.ifscCode}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.accountHolderName}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.upiId}</td>
                  <td className="py-2 px-4 border">{user.bankDetails?.upiphoneNumber}</td>
                 
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">Edit Bank Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold">Account Number</label>
                <input
                  type="text"
                  value={editUser.bankDetails.accountNumber}
                  onChange={(e) =>
                    setEditUser((prev) => ({
                      ...prev,
                      bankDetails: {
                        ...prev.bankDetails,
                        accountNumber: e.target.value,
                      },
                    }))
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">IFSC Code</label>
                <input
                  type="text"
                  value={editUser.bankDetails.ifscCode}
                  onChange={(e) =>
                    setEditUser((prev) => ({
                      ...prev,
                      bankDetails: {
                        ...prev.bankDetails,
                        ifscCode: e.target.value,
                      },
                    }))
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">Account Holder Name</label>
                <input
                  type="text"
                  value={editUser.bankDetails.accountHolderName}
                  onChange={(e) =>
                    setEditUser((prev) => ({
                      ...prev,
                      bankDetails: {
                        ...prev.bankDetails,
                        accountHolderName: e.target.value,
                      },
                    }))
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">UPI ID</label>
                <input
                  type="text"
                  value={editUser.bankDetails.upiId}
                  onChange={(e) =>
                    setEditUser((prev) => ({
                      ...prev,
                      bankDetails: {
                        ...prev.bankDetails,
                        upiId: e.target.value,
                      },
                    }))
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">UPI Phone Number</label>
                <input
                  type="text"
                  value={editUser.bankDetails.upiphoneNumber}
                  onChange={(e) =>
                    setEditUser((prev) => ({
                      ...prev,
                      bankDetails: {
                        ...prev.bankDetails,
                        upiphoneNumber: e.target.value,
                      },
                    }))
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankDetailsApproval;

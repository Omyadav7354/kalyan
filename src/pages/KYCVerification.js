import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineCheck, AiOutlineClose, AiOutlineEye } from "react-icons/ai";

const KYCVerification = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch KYC requests
  useEffect(() => {
    axios.get("https://sratebackend-2.onrender.com/signup").then((res) => setUsers(res.data));
  }, []);

  // Approve KYC
  const handleApprove = (id) => {
    axios.put(`https://sratebackend-2.onrender.com/signup/${id}`, { kycVerified: true }).then(() => {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, kycVerified: true } : user
        )
      );
    });
  };

  // Reject KYC
  const handleReject = (id) => {
    const reason = prompt("Enter rejection reason:");
    axios.put(`https://sratebackend-2.onrender.com/signup`, { id, status: "Rejected", comments: reason }).then(() => {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, kycVerified: false } : user
        )
      );
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">KYC Verification</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Name</th>
              <th className="text-left px-6 py-3 font-semibold">Email</th>
              <th className="text-left px-6 py-3 font-semibold">Phone</th>
              <th className="text-left px-6 py-3 font-semibold">KYC Status</th>
              <th className="text-center px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="px-6 py-3">{`${user.firstName} ${user.lastName}`}</td>
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">{user.phoneNumber}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.kycVerified ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {user.kycVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-3 flex justify-center gap-2">
                  <button
                    className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex items-center gap-1"
                    onClick={() => handleApprove(user._id)}
                  >
                    <AiOutlineCheck /> Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 flex items-center gap-1"
                    onClick={() => handleReject(user._id)}
                  >
                    <AiOutlineClose /> Reject
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
                    onClick={() => setSelectedUser(user)}
                  >
                    <AiOutlineEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for user details */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedUser(null)}
              >
                ✖
              </button>
            </div>
            <p><strong>Name:</strong> {`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
            <p><strong>Occupation:</strong> {selectedUser.occupation || "N/A"}</p>
            <p><strong>Nominee Name:</strong> {selectedUser.nomineeName || "N/A"}</p>
            <p><strong>Nominee Relation:</strong> {selectedUser.nomineeRelation || "N/A"}</p>
            <p><strong>Nominee Aadhar:</strong> {selectedUser.nomineeAadharNumber || "N/A"}</p>
            <h3 className="text-lg font-bold mt-4 mb-2">Documents:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Selfie:</strong></p>
                <img src={selectedUser.selfie} alt="Selfie" className="w-full h-auto rounded" />
              </div>
              <div>
                <p><strong>Aadhar Front:</strong></p>
                <img src={selectedUser.aadharFrontPhoto} alt="Aadhar Front" className="w-full h-auto rounded" />
              </div>
              <div>
                <p><strong>Aadhar Back:</strong></p>
                <img src={selectedUser.aadharBackPhoto} alt="Aadhar Back" className="w-full h-auto rounded" />
              </div>
              <div>
                <p><strong>PAN:</strong></p>
                <img src={selectedUser.panPhoto} alt="PAN" className="w-full h-auto rounded" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCVerification;

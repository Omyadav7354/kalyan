import React from "react";
import {
  FaHome,
  FaPlusCircle,
  FaChartBar,
  FaMoneyBillWave,
  FaUsers,
  FaHistory,
  FaUniversity,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  return (
    <div className="bg-gray-900 text-white w-full shadow-md z-50">
      <ul className="flex justify-around py-2 border-t border-gray-700">
        <li
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaHome className="text-2xl" />
          <span className="text-sm mt-1">Dashboard</span>
        </li>
        {/* <li
          onClick={() => navigate("/transactions")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaPlusCircle className="text-2xl" />
          <span className="text-sm mt-1">Add Fund</span>
        </li>
        <li
          onClick={() => navigate("/market")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaChartBar className="text-2xl" />
          <span className="text-sm mt-1">Market</span>
        </li>
        <li
          onClick={() => navigate("/MarketHistory")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaHistory className="text-2xl" />
          <span className="text-sm mt-1">Market History</span>
        </li>
        <li
          onClick={() => navigate("/withdrawal")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaMoneyBillWave className="text-2xl" />
          <span className="text-sm mt-1">Withdrawal</span>
        </li> */}
        <li
          onClick={() => navigate("/users")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaUsers className="text-2xl" />
          <span className="text-sm mt-1">Users</span>
        </li>
        {/* <li
          onClick={() => navigate("/SettledBets")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaHistory className="text-2xl" />
          <span className="text-sm mt-1">Settled Bets</span>
        </li>
        <li
          onClick={() => navigate("/PendingBets")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaHistory className="text-2xl" />
          <span className="text-sm mt-1">Pending Bets</span>
        </li>
        <li
          onClick={() => navigate("/bank-details")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaUniversity className="text-2xl" />
          <span className="text-sm mt-1">Bank Details</span>
        </li>
        <li
          onClick={() => navigate("/AdminPaymentSettings")}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-blue-400 transition duration-300"
        >
          <FaCog className="text-2xl" />
          <span className="text-sm mt-1">Settings</span>
        </li>
        <li
          onClick={handleLogout}
          className="flex flex-col items-center cursor-pointer p-2 hover:text-red-400 transition duration-300"
        >
          <FaSignOutAlt className="text-2xl" />
          <span className="text-sm mt-1">Logout</span>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;

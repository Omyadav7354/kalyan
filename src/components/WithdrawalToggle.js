import React, { useState } from "react";

const WithdrawalToggle = ({ user, onToggle }) => {
  const [isWithdrawal, SetIsWithdrawal] = useState(user?.isWithdrawal || false);

  const handleToggle = () => {
    const newValue = !isWithdrawal;
    SetIsWithdrawal(newValue);
    onToggle(newValue); // Trigger the toggle function from parent
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md">
      <span
        className={`text-lg font-semibold ${
          isWithdrawal ? "text-green-600" : "text-red-600"
        }`}
      >
        {isWithdrawal ? "ON" : "OFF"}
      </span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ${
          isWithdrawal ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
            isWithdrawal ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default WithdrawalToggle;

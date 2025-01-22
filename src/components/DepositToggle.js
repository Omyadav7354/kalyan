import React, { useState } from "react";

const DepositToggle = ({ user, onToggle }) => {
  const [isDeposit, setIsDeposit] = useState(user?.isDeposit || false);

  const handleToggle = () => {
    const newValue = !isDeposit;
    setIsDeposit(newValue);
    onToggle(newValue); // Trigger the toggle function from parent
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md">
      <span
        className={`text-lg font-semibold ${
          isDeposit ? "text-green-600" : "text-red-600"
        }`}
      >
        {isDeposit ? "ON" : "OFF"}
      </span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ${
          isDeposit ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${
            isDeposit ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default DepositToggle;

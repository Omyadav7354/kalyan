import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const [notificationSound] = useState(new Audio("/notification.mp3")); // Pre-load the sound file

  // Fetch notifications periodically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("https://sratebackend-1.onrender.com/user");

        // Extract Add Fund (transactions) and Withdrawal requests
        const allNotifications = response.data.flatMap((user) => {
          const transactionRequests = (user.transactionRequest || []).map((transaction) => ({
            type: "Add Fund",
            amount: transaction.amount,
            username: user.username,
            time: new Date(transaction.requestTime).toLocaleString(),
            status: transaction.status,
          }));

          const withdrawalRequests = (user.withdrawalRequest || []).map((withdrawal) => ({
            type: "Withdrawal",
            amount: withdrawal.amount,
            username: user.username,
            time: new Date(withdrawal.requestTime).toLocaleString(),
            status: withdrawal.status,
          }));

          return [...transactionRequests, ...withdrawalRequests];
        });

        // Play sound if new notifications are added
        if (allNotifications.length > lastNotificationCount) {
          setLastNotificationCount(allNotifications.length);
          playNotificationSound();
        }

        // Update state
        setNotifications(allNotifications.reverse());
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Initial fetch and interval setup
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [lastNotificationCount]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const playNotificationSound = () => {
    notificationSound.play().catch((error) => {
      console.error("Error playing notification sound:", error);
    });
  };

  return (
    <header className="flex justify-between items-center bg-gray-800 text-white p-4 shadow-md">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <div className="flex items-center space-x-6">
        <FaBell
          className="text-xl cursor-pointer hover:text-gray-400"
          onClick={toggleModal}
        />
        <FaUserCircle className="text-xl cursor-pointer hover:text-gray-400" />
      </div>

      {/* Notification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-[50%] h-[80%] overflow-hidden">
            <div className="flex justify-between items-center mb-4 text-black">
              <h2 className="text-2xl font-bold">Latest Notifications</h2>
              <button
                onClick={toggleModal}
                className="text-red-500 text-xl hover:text-red-600"
              >
                ✕
              </button>
            </div>
            <div className="h-[85%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">No new notifications</p>
              ) : (
                <ul className="space-y-4">
                  {notifications.map((notification, index) => (
                    <li
                      key={index}
                      className={`p-4 border rounded-lg shadow-sm ${
                        notification.type === "Add Fund"
                          ? "bg-green-100 border-green-400"
                          : "bg-red-100 border-red-400"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-700">
                        <strong>Username:</strong> {notification.username}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        <strong>Amount:</strong> ₹{notification.amount}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        <strong>Type:</strong> {notification.type}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        <strong>Status:</strong> {notification.status}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        <strong>Time:</strong> {notification.time}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

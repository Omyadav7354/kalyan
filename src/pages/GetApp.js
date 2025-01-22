import logo from "../Kalyan.png";
import React from "react";

function App() {
  const rates = [
    { name: "Single Digit", rate: "10 ka 100" },
    { name: "Jodi Digit", rate: "10 ka 1000" },
    { name: "Single Pana", rate: "10 ka 1600" },
    { name: "Double Pana", rate: "10 ka 3200" },
    { name: "Triple Pana", rate: "10 ka 10,000" },
    { name: "Half Sangam", rate: "10 ka 15,000" },
    { name: "Full Sangam", rate: "10 ka 1,50,000" },
  ];

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-yellow-400 via-red-400 to-yellow-600 flex flex-col justify-between">
      {/* Announcement Banner with Animation */}
      <div className="bg-black text-white py-4 text-center shadow-lg animate-pulse">
        <p className="text-lg font-bold">
          🎉 First Deposit Offer: Add a minimum of ₹50 to get ₹200 bonus!
          <span className="block text-sm mt-1">Total ₹250 in your wallet!</span>
        </p>
      </div>

      <header className="flex flex-col items-center py-10 px-4">
        {/* Logo Section */}
        <div className="bg-transparent p-2 mb-6 shadow-lg">
          <img
            src={logo}
            alt="Matka Logo"
            className="w-40 h-auto"
          />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          Welcome to Matka App
        </h1>
        <p className="text-lg text-gray-700 max-w-lg text-center mb-8">
          Instant withdrawals, 24/7 support, and the best rates in the market!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://github.com/sourabh07032000/finalmatkaapp/releases/download/v3.0.0/app-release.apk"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition shadow-md"
          >
            Download Our App
          </a>
          <a
            href="https://wa.me/+918349146161"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition shadow-md"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Rates Section */}
        <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-4xl mt-8 ">
          <h2 className="text-2xl font-bold text-center mb-6">Our Rates</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rates.map((item, index) => (
              <li
                key={index}
                className="bg-gray-100 rounded-md p-4 text-center shadow-md"
              >
                <span className="font-semibold text-blue-600">{item.name}</span>:{" "}
                <span className="font-bold text-gray-800">{item.rate}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Footer */}
      <footer className="text-center py-4 bg-gray-900 text-gray-500 text-sm">
        
          {" "}
          <a
            href="/admin-panel-login"
            className="text-gray-300 hover:text-white underline"
          >
          © 2025 Kalyan Matka 365
          </a>
        
      </footer>
    </div>
  );
}

export default App;

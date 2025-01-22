import React, { useContext, useEffect, useState } from "react";
import { MyData } from "./Context";
import axios from "axios";
import MarketToggle from "../components/MarketToggle";

const Market = () => {
  // Context and States
  const [isAddMarketModalOpen, setIsAddMarketModalOpen] = useState(false);
  const { marketData, getMarketData, allUserData, getAllUserFn } = useContext(MyData);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(({
    aankdo_open_close_time: '',
    aankdo_close_close_time: '',
  }));
  const [processing, setProcessing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showUpdateModal, setShowUpdateModal] = useState(false);
// Add this function with the other functions
const openMarketModal = (market) => {
  setSelectedMarket(market);
  setIsMarketModalOpen(true);
};
  // Initial Data Load
  useEffect(() => {
    getMarketData();
    getAllUserFn();
  }, []);

  // Auto Date Update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);
      updateMarketDates(now);
    }, 60000);

    return () => clearInterval(timer);
  }, [marketData]);

  // Helper Functions
  const calculateFigure = (aankdo) => {
    if (!aankdo || aankdo === 'XXX') return 'X';
    const sum = aankdo.split('')
      .map(num => parseInt(num))
      .reduce((acc, curr) => acc + curr, 0);
    return String(sum % 10);
  };

  const calculateJodi = (figureOpen, figureClose) => {
    if (figureOpen === 'X' || figureClose === 'X') return 'XX';
    return `${figureOpen}${figureClose}`;
  };

  const validateTimeFormat = (time) => {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    return timeRegex.test(time);
  };

  const validateAankdo = (value) => {
    if (value === 'XXX') return true;
    return /^\d{1,3}$/.test(value);
  };

  // Market Update Functions
  const updateMarketDates = async (currentDate) => {
    const dateStr = currentDate.toISOString().split('T')[0];
    for (let market of marketData) {
      const openTime = new Date(`${currentDate.toDateString()} ${market.open_time_formatted}`);
      if (currentDate >= openTime && market.aankdo_date !== dateStr) {
        await resetMarketValues(market._id, dateStr);
      }
    }
  };

  const resetMarketValues = async (marketId, dateStr) => {
    try {
      await axios.put(`https://sratebackend-1.onrender.com/api/market-data/${marketId}`, {
        aankdo_open: 'XXX',
        aankdo_close: 'XXX',
        figure_open: 'X',
        figure_close: 'X',
        jodi: 'XX',
        aankdo_date: dateStr
      });
      await getMarketData();
    } catch (error) {
      console.error('Error resetting market:', error);
    }
  };
  const handleMarketToggle = (value) => {
    console.log("Market status changed to:", value ? "ON" : "OFF");
    // Perform additional actions like API calls here
  };


  // Input Handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setSelectedMarket(prev => {
      const updated = { ...prev };
  
      // Handle time fields
      if (name.includes('time_formatted')) {
        updated[name] = value;
        return updated;
      }
      if (name.includes('market_name')) {
        updated[name] = value.toUpperCase();
        return updated;
      }
  
      // Handle aankdo fields
      if (name === 'aankdo_open' || name === 'aankdo_close') {
        updated[name] = value;
  
        // If empty or user types X/x, set to XXX
        if (!value || value.toLowerCase().includes('x')) {
          updated[name] = 'XXX';
          if (name === 'aankdo_open') {
            updated.figure_open = 'X';
            // Update jodi when open figure changes to X
            updated.jodi = `X${updated.figure_close}`;
          } else {
            updated.figure_close = 'X';
            // Update jodi when close figure changes to X
            updated.jodi = `${updated.figure_open}X`;
          }
        } 
        // Handle numeric input
        else if (/^\d{0,3}$/.test(value)) {
          if (value.length === 3) {
            // Calculate figure for the specific field
            if (name === 'aankdo_open') {
              updated.figure_open = calculateFigure(value);
              // Update jodi with new open figure
              updated.jodi = `${updated.figure_open}${updated.figure_close === 'X' ? 'X' : updated.figure_close}`;
            } else {
              updated.figure_close = calculateFigure(value);
              // Update jodi with new close figure
              updated.jodi = `${updated.figure_open === 'X' ? 'X' : updated.figure_open}${updated.figure_close}`;
            }
          } else {
            // For incomplete number
            if (name === 'aankdo_open') {
              updated.figure_open = 'X';
              // Update jodi with X for open
              updated.jodi = `X${updated.figure_close === 'X' ? 'X' : updated.figure_close}`;
            } else {
              updated.figure_close = 'X';
              // Update jodi with X for close
              updated.jodi = `${updated.figure_open === 'X' ? 'X' : updated.figure_open}X`;
            }
          }
        }
      }
  
      return updated;
    });
  };
  // Bet Processing

  const processResults = async (market) => {
    try {
      setProcessing(true);
  
      for (let user of allUserData) {
        let allBets = [...user.betDetails]; // Clone user's betDetails
  
        const pendingBets = allBets.filter(
          (bet) => bet.market_id === market.market_name && bet.status === "Pending"
        );
  
        for (let bet of pendingBets) {
          let isWinner = false;
          let winningAmount = 0;
  
          // Determine if the bet wins based on category and conditions
          if (
            bet.matkaBetType.category === "Single Digit" &&
            bet.betTime === "Open" &&
            bet.matkaBetNumber === market.figure_open
          ) {
            isWinner = true;
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } else if (
            bet.matkaBetType.category === "Single Digit" &&
            bet.betTime === "Close" &&
            !market.figure_close.includes("X") && // Only process if close number is set
            bet.matkaBetNumber === market.figure_close
          ) {
            isWinner = true;
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } 
          else if (
            bet.matkaBetType.category === "Single Digit" &&
            bet.betTime === "Close" &&
            market.figure_close.includes("X")// Only process if close number is set
          ) {
            isWinner = "Pending";
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } 
          else if (
            bet.matkaBetType.category === "Jodi" &&
            bet.matkaBetNumber === market.jodi
          ) {
            isWinner = true;
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          }
          else if (
            bet.matkaBetType.category === "Jodi" &&
            market.jodi.includes("X") && 
            bet.matkaBetNumber.slice(0, 1) === market.jodi.slice(0, 1)
          ) {
            isWinner = "Pending";
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } else if (
            bet.matkaBetType.category === "Single Pana" &&
            ((bet.betTime === "Open" && bet.matkaBetNumber === market.aankdo_open) ||
              (bet.betTime === "Close" &&
                market.aankdo_close != "XXX" && // Only process if close number is set
                bet.matkaBetNumber === market.aankdo_close))
          ) {
            isWinner = true;
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } 
          else if (
            bet.matkaBetType.category === "Single Pana" &&
            (
              bet.betTime === "Close" &&
                market.aankdo_close === "XXX"  // Only process if close number is set
              )
          ) {
            isWinner = "Pending";
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } 
          
          else if (
            bet.matkaBetType.category === "Double Pana" &&
            ((bet.betTime === "Open" && bet.matkaBetNumber === market.aankdo_open) ||
              (bet.betTime === "Close" &&
                market.aankdo_close != "XXX" && // Only process if close number is set
                bet.matkaBetNumber === market.aankdo_close))
          ) {
            isWinner = true;
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          }
          else if (
            bet.matkaBetType.category === "Double Pana" &&
            (
              bet.betTime === "Close" &&
                market.aankdo_close === "XXX"  // Only process if close number is set
              )
          ) {
            isWinner = "Pending";
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          }  else if (
            bet.matkaBetType.category === "Triple Pana" &&
            ((bet.betTime === "Open" && bet.matkaBetNumber === market.aankdo_open) ||
              (bet.betTime === "Close" &&
                market.aankdo_close != "XXX" && // Only process if close number is set
                bet.matkaBetNumber === market.aankdo_close))
          ) {
            isWinner = true;
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } 
          else if (
            bet.matkaBetType.category === "Triple Pana" &&
            (
              bet.betTime === "Close" &&
                market.aankdo_close === "XXX"  // Only process if close number is set
              )
          ) {
            isWinner = "Pending";
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } 
          else if (
            bet.matkaBetType.category === "Full Sangam" &&
            bet.matkaBetNumber.slice(0, 3) === market.aankdo_open &&
            bet.matkaBetNumber.slice(4, 7) === market.aankdo_close
          ) {
            isWinner = true;
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } 
          else if (
            bet.matkaBetType.category === "Full Sangam" &&
            market.aankdo_close.includes("X") &&
            bet.matkaBetNumber.slice(0, 3) === market.aankdo_close
          ) {
            isWinner = "Pending";
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          } 
          else if (
            bet.matkaBetType.category === "Half Sangam" &&
            ((bet.betTime === "Open" &&
              bet.matkaBetNumber.slice(0, 1) === market.figure_open &&
              bet.matkaBetNumber.slice(2) === market.aankdo_close && market.aankdo_close != "XXX") ||
              (bet.betTime === "Close" &&
                market.aankdo_close != "XXX" && // Only process if close number is set
                bet.matkaBetNumber.slice(0, 3) === market.aankdo_open &&
                bet.matkaBetNumber.slice(4) === market.figure_close))
          ) {
            isWinner = true;
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          }
          else if (
            bet.matkaBetType.category === "Half Sangam" &&
            ((bet.betTime === "Open" &&
              market.aankdo_close == "XXX" &&
              bet.matkaBetNumber.slice(0, 1) === market.figure_open) ||
              (bet.betTime === "Close" &&
                market.aankdo_close == "XXX" &&
                bet.matkaBetNumber.slice(0, 3) === market.aankdo_open))
          ) {
            isWinner = "Pending";
            winningAmount = bet.betAmount * bet.matkaBetType.multiplier;
          }
  
          // Update the specific bet
          const updatedBet = {
            ...bet,
            status: isWinner === true
              ? "Won"
              : isWinner === "Pending"
              ? "Pending"
              : "Lost",
            matchResult: selectedMarket,
            
          };
  
          // Replace the bet in the user's betDetails
          allBets = allBets.map((b) =>
            b.betNo === bet.betNo &&
            b.matkaBetNumber == bet.matkaBetNumber &&
            b.betAmount == bet.betAmount
              ? updatedBet
              : b
          );

          console.log(updatedBet)
  
          // Update user wallet
          if (isWinner === true) {
            user.wallet += winningAmount;
          }
        }
        
        // After processing all bets for the user, update on the server
        await axios.put(`https://sratebackend-1.onrender.com/user/${user._id}`, {
          betDetails: allBets,
          wallet: user.wallet,
        });
      }
   
      alert("Results processed successfully!");
    } catch (error) {
      console.error("Error processing results:", error);
      alert("Error processing results");
    } finally {
      setProcessing(false);
    }
  };

  // Save Market Details

  const saveNewMarketDetails = ()=>{
    axios.post('https://sratebackend-1.onrender.com/api/market-data').then((res)=> {alert("New Market Added!"); getMarketData()})
  }

  const saveMarketDetails = async () => {
    try {
      setProcessing(true);
      
      await axios.put(
        `https://sratebackend-1.onrender.com/api/market-data/${selectedMarket._id}`, 
        {...selectedMarket, market_on: selectedMarket.aankdo_close.includes("X") ? true : false }
      );


      if (selectedMarket.figure_open !== "X" || selectedMarket.figure_close !== "X") {
        const shouldProcess = window.confirm("Process results for this market?");
        if (shouldProcess) {
          await processResults(selectedMarket);
        }
      }

      await getMarketData();
      setIsMarketModalOpen(false);
    } catch (error) {
      console.error("Error saving market:", error);
      alert("Error saving market details");
    } finally {
      setProcessing(false);
    }
  };

  const betAllowance = (market)=>{
    const reSetData = {
      aankdo_open: "XXX",
      aankdo_close: "XXX",
      figure_open: "X",
      figure_close: "X",
      jodi: "XX"
    }
    // alert("Hello")
    if (market.aankdo_close.includes("X")){
      axios.put("https://sratebackend-1.onrender.com/api/market-data/"+ market._id, {market_on: !market.market_on}).then(()=> {
        alert("Market Changed");
        getMarketData()
      })
    } else {
      axios.put("https://sratebackend-1.onrender.com/api/market-data/"+ market._id, {market_on: !market.market_on, ...reSetData}).then(()=> {
        alert("Market Changed");
        getMarketData()
      })
    }
    
    
  }

  // UI Components
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Market Management</h1>
        <button
          onClick={() => setIsAddMarketModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add New Market
        </button>
      </div>

      {/* Market Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "S.No", "Market Name", "Open Time", "Close Time", 
                "Date", "Aankdo Open", "Aankdo Close", 
                "Figure Open", "Figure Close",  "Market Start","Jodi", "Actions"
              ].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marketData.map((market, index) => (
              <tr key={market._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">{market.market_name}</td>
                <td className="px-6 py-4">{market.open_time_formatted}</td>
                <td className="px-6 py-4">{market.close_time_formatted}</td>
                <td className="px-6 py-4">{market.aankdo_date}</td>
                <td className="px-6 py-4">{market.aankdo_open}</td>
                <td className="px-6 py-4">{market.aankdo_close}</td>
                <td className="px-6 py-4">{market.figure_open}</td>
                <td className="px-6 py-4">{market.figure_close}</td>
                <td className="">
                <MarketToggle market={market} onToggle={()=>{handleMarketToggle();betAllowance(market)}} />
                
                </td>
                
                {/* <td  className={`px-6 py-4 `} style={{color: market?.market_on ? "green" : "red"}} >{market?.market_on ? "ON" : "OFF"}</td> */}
                <td className="px-6 py-4">{market.jodi}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openMarketModal(market)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
     {/* Edit Modal */}
{isMarketModalOpen && selectedMarket && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-[100] justify-center">
    <div className="bg-white rounded-lg p-6 w-[80%] max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Edit Market Details</h2>
      {/* <label>{JSON.stringify(selectedMarket)}</label> */}
      <div className="grid grid-cols-2 gap-4">
        {/* Market Name - Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MARKET NAME
          </label>
          <input
            type="text"
            value={selectedMarket.market_name}
            disabled
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Open Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OPEN TIME
          </label>
          <input
            type="text"
            name="open_time_formatted"
            value={selectedMarket.open_time_formatted}
            onChange={handleInputChange}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Close Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CLOSE TIME
          </label>
          <input
            type="text"
            name="close_time_formatted"
            value={selectedMarket.close_time_formatted}
            onChange={handleInputChange}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          AANKDO OPEN CLOSE TIME
          </label>
          <input
            type="text"
            name="aankdo_open_close_time"
            value={selectedMarket.aankdo_open_close_time}
            onChange={(e)=> setSelectedMarket({...selectedMarket, aankdo_open_close_time: e.target.value })}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          AANKDO CLOSE CLOSE TIME
          </label>
          <input
            type="text"
            name="aankdo_close_close_time"
            value={selectedMarket.aankdo_close_close_time}
            onChange={(e)=> setSelectedMarket({...selectedMarket, aankdo_close_close_time: e.target.value })}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Aankdo Open */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AANKDO OPEN
          </label>
          <input
            type="text"
            name="aankdo_open"
            value={selectedMarket.aankdo_open}
            onChange={handleInputChange}
            placeholder="XXX"
            maxLength={3}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Aankdo Close */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AANKDO CLOSE
          </label>
          <input
            type="text"
            name="aankdo_close"
            value={selectedMarket.aankdo_close}
            onChange={handleInputChange}
            placeholder="XXX"
            maxLength={3}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Figure Open - Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            FIGURE OPEN
          </label>
          <input
            type="text"
            value={selectedMarket.figure_open}
            disabled
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Figure Close - Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            FIGURE CLOSE
          </label>
          <input
            type="text"
            value={selectedMarket.figure_close}
            disabled
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Jodi - Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            JODI
          </label>
          <input
            type="text"
            value={selectedMarket.jodi}
            disabled
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setIsMarketModalOpen(false)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={saveMarketDetails}
          disabled={processing}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {processing ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  </div>
)}

{isAddMarketModalOpen ?
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-[100] justify-center">
    <div className="bg-white rounded-lg p-6 w-[80%] max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Edit Market Details</h2>
     
      {/* <label>{JSON.stringify(selectedMarket)}</label> */}
      <div className="grid grid-cols-2 gap-4">
        {/* Market Name - Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MARKET NAME
          </label>
          <input
           name="market_name"
            onChange={handleInputChange}
            type="text"
            value={selectedMarket.market_name}
            className="w-full p-2 border rounded-md 0"
          />
        </div>

        {/* Open Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OPEN TIME
          </label>
          <input
            type="text"
            name="open_time_formatted"
            value={selectedMarket.open_time_formatted}
            onChange={handleInputChange}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Close Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CLOSE TIME
          </label>
          <input
            type="text"
            name="close_time_formatted"
            value={selectedMarket.close_time_formatted}
            onChange={handleInputChange}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          AANKDO OPEN CLOSE TIME
          </label>
          <input
            type="text"
            name="aankdo_open_close_time"
            value={selectedMarket.aankdo_open_close_time}
            onChange={(e)=> setSelectedMarket({...selectedMarket, aankdo_open_close_time: e.target.value })}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          AANKDO CLOSE CLOSE TIME
          </label>
          <input
            type="text"
            name="aankdo_close_close_time"
            value={selectedMarket.aankdo_close_close_time}
            onChange={(e)=> setSelectedMarket({...selectedMarket, aankdo_close_close_time: e.target.value })}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Aankdo Open */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AANKDO OPEN
          </label>
          <input
            type="text"
            name="aankdo_open"
            value={selectedMarket.aankdo_open}
            onChange={handleInputChange}
            placeholder="XXX"
            maxLength={3}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Aankdo Close */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AANKDO CLOSE
          </label>
          <input
            type="text"
            name="aankdo_close"
            value={selectedMarket.aankdo_close}
            onChange={handleInputChange}
            placeholder="XXX"
            maxLength={3}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Figure Open - Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            FIGURE OPEN
          </label>
          <input
            type="text"
            value={selectedMarket.figure_open}
            disabled
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Figure Close - Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            FIGURE CLOSE
          </label>
          <input
            type="text"
            value={selectedMarket.figure_close}
            disabled
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Jodi - Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            JODI
          </label>
          <input
            type="text"
            value={selectedMarket.jodi}
            disabled
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setIsMarketModalOpen(false)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={saveNewMarketDetails}
          disabled={processing}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {processing ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  </div> : null}

      {/* Process All Results Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Process All Results</h2>
            <p>Are you sure you want to process all pending results?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowUpdateModal(false);
                  for (let market of marketData) {
                    if (market.figure_open !== 'X' || market.figure_close !== 'X') {
                      await processResults(market);
                    }
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Process All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
import React, { useContext, useEffect, useState } from "react";
import { MyData } from "./Context";
import axios from "axios";

const Market = () => {
  useEffect(() => {
    getMarketData();
    getAllUserFn()
  }, []);

  const { marketData, getMarketData, allUserData, setAllUserData, getAllUserFn } = useContext(MyData);

  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(null);

  const openMarketModal = (market) => {
    setSelectedMarket(market);
    setIsMarketModalOpen(true);
  };

  const UpdateBets = async (marketName, digit, panna) => {
    for (let user of allUserData) {
      const pendingBets = user.betDetails.filter((i)=>  i.market_id == marketName && i.betTime == "Open" ).map((bet) => bet)
      
      for (let pendingBet of pendingBets ){
        alert(JSON.stringify(pendingBet))
        if (pendingBet.betTime == "Open"){
          if(pendingBet.matkaBetType.category == "Single Digit" && pendingBet.matkaBetNumber == digit){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            alert("Two")
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet: winningAmount}).then(()=> getMarketData())
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
           else if (pendingBet.matkaBetType.category == "Single Pana" && pendingBet.matkaBetNumber == panna){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
           else if (pendingBet.matkaBetType.category == "Double Pana" && pendingBet.matkaBetNumber == panna){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
           else if (pendingBet.matkaBetType.category == "Triple Pana" && pendingBet.matkaBetNumber == panna){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
           else if (pendingBet.matkaBetType.category == "Half Sangam" && pendingBet.matkaBetNumber == `${digit}-${panna}` ){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
        } else {
          if(pendingBet.matkaBetType.category == "Single Digit" && pendingBet.matkaBetNumber == digit){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
           else if (pendingBet.matkaBetType.category == "Jodi Digit" && pendingBet.matkaBetNumber == digit){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
           else if (pendingBet.matkaBetType.category == "Single Pana" && pendingBet.matkaBetNumber == panna){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
           else if (pendingBet.matkaBetType.category == "Double Pana" && pendingBet.matkaBetNumber == panna){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
           else if (pendingBet.matkaBetType.category == "Triple Pana" && pendingBet.matkaBetNumber == panna){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
           else if (pendingBet.matkaBetType.category == "Half Sangam" && pendingBet.matkaBetNumber == `${digit}-${panna}` ){
            const winningAmount = user.wallet + pendingBet.betAmount*pendingBet.matkaBetType.multiplier;
            axios.put("https://sratebackend-1.onrender.com/user/"+user._id, {wallet:winningAmount})
            console.log(`${winningAmount} Updated of ${user.username}`);
           } 
        }
         
       }
    }
  };

  const closeModal = () => {
    setIsMarketModalOpen(false);
    setSelectedMarket(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedMarket((prev) => ({ ...prev, [name]: value }));
  };

  const saveMarketDetails = () => {
    // Implement save logic here, e.g., sending updated data to the backend
    axios.put('https://sratebackend-1.onrender.com/api/market-data/'+selectedMarket._id, selectedMarket).then((res)=> {getMarketData(); alert("Updated Successfully")})
    console.log("Updated Market Details:", selectedMarket);
    closeModal();
  };

  return (
    <div className="p-6 bg-gray-100 h-full">
      <h1 className="text-3xl font-bold mb-4">Market Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">S. No</th>
              <th className="py-3 px-4 text-left">Market Name</th>
              <th className="py-3 px-4 text-left">Open Time</th>
              <th className="py-3 px-4 text-left">Close Time</th>
              <th className="py-3 px-4 text-left">Aankdo Date</th>
              <th className="py-3 px-4 text-left">Aankdo Open</th>
              <th className="py-3 px-4 text-left">Aankdo Close</th>
              <th className="py-3 px-4 text-left">Figure Open</th>
              <th className="py-3 px-4 text-left">Figure Close</th>
              <th className="py-3 px-4 text-left">Jodi</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((market, index) => (
              <tr key={market.market_id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{market.market_name}</td>
                <td className="py-2 px-4 border">{market.open_time_formatted}</td>
                <td className="py-2 px-4 border">{market.close_time_formatted}</td>
                <td className="py-2 px-4 border">{market.aankdo_date}</td>
                <td className="py-2 px-4 border">{market.aankdo_open}</td>
                <td className="py-2 px-4 border">{market.aankdo_close}</td>
                <td className="py-2 px-4 border">{market.figure_open}</td>
                <td className="py-2 px-4 border">{market.figure_close}</td>
                <td className="py-2 px-4 border">{market.jodi}</td>
                <td className="py-2 px-4 border flex">
                  <button
                    onClick={() => openMarketModal(market)}
                    className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 transition duration-300 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => UpdateBets(market.market_name, market.figure_open, market.aankdo_open, )}
                    className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 transition duration-300 mr-2"
                  >
                    Update Bets
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Market Modal */}
      {isMarketModalOpen && selectedMarket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-[80%]">
            <h2 className="text-xl font-bold mb-4">Edit Market Details</h2>
            <div className="space-y-2 flex flex-wrap gap-4">
              {Object.keys(selectedMarket).map((key) => (
                key !== "_id" && (
                 
                  
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1">{key.replace('_', ' ')}</label>
                    <input
                      type="text"
                      name={key}
                      value={selectedMarket[key] || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  
                )
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={()=>saveMarketDetails()}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
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

export default Market;

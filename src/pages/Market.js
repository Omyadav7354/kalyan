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

  // Save Market Details

  const saveNewMarketDetails = ()=>{
    axios.post('https://sratebackend-1.onrender.com/api/market-data').then((res)=> {alert("New Market Added!"); getMarketData()})
  }



  const [productDetail, setProductDetail] = useState({features:[]})
  const [feature, setFeature] = useState("")

  const addFeature =()=>{
    setProductDetail({...productDetail, features: [...productDetail.features ,feature]})
    setFeature("")
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
           
              <tr  className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="">
                
                </td>
                
                {/* <td  className={`px-6 py-4 `} style={{color: market?.market_on ? "green" : "red"}} >{market?.market_on ? "ON" : "OFF"}</td> */}
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4">
                  <button
                   
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
          
          </tbody>
        </table>
      </div>

      
    

{isAddMarketModalOpen ?
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-[100] justify-center">
    <div className="bg-white rounded-lg p-6 w-[80%] max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Edit Product Details</h2>
     
      <label>{JSON.stringify(productDetail)}</label>
      <div className="grid grid-cols-2 gap-4">
        {/* Market Name - Read Only */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CATEGORY
          </label>
          <input
           name="market_name"
            onChange={(e)=>setProductDetail({...productDetail, category: e.target.value})}
            type="text"
            value={selectedMarket.market_name}
            className="w-full p-2 border rounded-md 0"
          />
        </div>

        {/* Open Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            TITLE
          </label>
          <input
            type="text"
            name="open_time_formatted"
            onChange={(e)=> setProductDetail({...productDetail ,title: e.target.value})}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Close Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PRICE
          </label>
          <input
            type="text"
            name="close_time_formatted"
            onChange={(e)=> setProductDetail({...productDetail ,price: e.target.value})}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          DISCOUNT(%)
          </label>
          <input
            type="text"
            name="aankdo_open_close_time"
            onChange={(e)=> setProductDetail({...productDetail ,discount: e.target.value})}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          DESCRIPTION
          </label>
          <input
            type="text"
            name="aankdo_close_close_time"
            onChange={(e)=> setProductDetail({...productDetail ,discription: e.target.value})}
            placeholder="12:00 PM"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Aankdo Open */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            FEATURES - {feature}
          </label>
          <div className="flex">
          <input
            type="text"
            onChange={(e)=> setFeature(e.target.value)}
            placeholder="XXX"
            className="w-full p-2 border rounded-md"
            value={feature}
          />
          <button onClick={()=> addFeature()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Add
        </button>

          </div>

          <ul className="">
          {productDetail.features?.map((i)=>
            <li>{i}</li>)}
          </ul>
          
        </div>

        {/* Aankdo Close */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IMAGE
          </label>
          <input
            type="text"
            name="aankdo_close"
            onChange={()=>setCurrentDate}
            className="w-full p-2 border rounded-md"
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
         
          disabled={processing}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {processing ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  </div> : null}

     
    </div>
  );
};

export default Market;
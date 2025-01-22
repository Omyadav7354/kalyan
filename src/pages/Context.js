import React, { createContext, useState } from 'react'
import axios from 'axios'

export const MyData = createContext()

function Context({children}) {
    const [allUserData, setAllUserData] = useState([])
    const getAllUserFn = ()=>{
        axios.get("https://sratebackend-1.onrender.com/user").then((res)=> setAllUserData(res.data))
    }

    const [marketData, setMarketData] = useState([])
    const getMarketData = ()=>{
        axios.get('https://sratebackend-1.onrender.com/api/market-data').then((res)=> setMarketData(res.data))
    }


  return (
    <MyData.Provider value={{allUserData, setAllUserData, getAllUserFn, marketData, setMarketData, getMarketData }}>
        {children}
    </MyData.Provider>
  )
}

export default Context
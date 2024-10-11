import React, { useEffect } from 'react';
import axios from 'axios'; 
import Main_Route from './Routes/Main_Route';

const App = () => {
  const GetIp = async () => {
    try {
      const res = await axios.get(`https://api.ipify.org?format=json`);
      return res.data.ip;
    } catch (err) {
      console.error("Error fetching IP:", err);
    }
  };

  useEffect(() => {
    const fetchIpData = async () => {
      const IP_Data = await GetIp(); 
      console.log("IP_Data", IP_Data);
      if (IP_Data) {
        localStorage.setItem("IP_Data", JSON.stringify(IP_Data));
      }
    };

    fetchIpData();  
  }, []);

  return (
    <Main_Route />
  );
};

export default App;

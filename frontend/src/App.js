import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Main_Route from './Routes/Main_Route';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Status } from './ReduxStore/Slice/Auth/authSlice'

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = JSON.parse(localStorage.getItem("staffDetails"))?.id;
  const token = JSON.parse(localStorage.getItem("token"));
  
 
  const getStatus = async () => { 
    const data = { id: id, authToken: token };
    await dispatch(Status(data))
      .unwrap()
      .then((res) => {
        if (res.status) { 
          console.log("Status", res.data[0].status);
          if (res?.data?.[0]?.status == '0') {
            localStorage.clear();
            navigate('/login');
            window.location.reload();
          }
        }
        else { 
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }


  useEffect(() => {
    getStatus();
  }, []);


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

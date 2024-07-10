import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from '../Components/Dashboard/Sidebar';
import Dashboard from '../layouts/Admin/Dashboard';
import Header from '../Components/Dashboard/Header';
import Customer from '../layouts/Admin/Customer';
import Status from '../layouts/Admin/Status';
import Reports from '../layouts/Admin/Reports';
import Footer from '../Components/Dashboard/Footer';
import Access from '../layouts/Admin/Access';
import Setting from '../layouts/Admin/Setting';
import Staff from '../layouts/Admin/Staff';

import { RoleAccess } from '../ReduxStore/Slice/Access/AccessSlice';


const Admin_Route = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));


  const accessDataFetch = async () => {
    try {
      const response = await dispatch(RoleAccess({ req: { "role_id": staffDetails.role_id,"action": "get" }, authToken: token })).unwrap();

    } catch (error) {
      console.error("Error fetching access data:", error);

    }
  };
  useEffect(() => {
    accessDataFetch();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="page-wrapper">
        <Header />
        <div className="page-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/status" element={<Status />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/access" element={<Access />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Admin_Route
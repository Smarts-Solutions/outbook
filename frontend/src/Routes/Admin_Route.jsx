import React from 'react';
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

const Admin_Route = () => {
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
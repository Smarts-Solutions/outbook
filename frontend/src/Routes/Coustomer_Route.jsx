
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerDashboard from '../layouts/Customer/Dashboard'
import CustomerList from '../layouts/Customer/Customer/CustomerList';
import ClientList from '../layouts/Customer/Customer/ClientList';
import JobList from '../layouts/Customer/Customer/JobList';
import Sidebar from '../Components/Dashboard/Sidebar';
import Header from '../Components/Dashboard/Header';

const Customer_Route = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="page-wrapper">
                <Header />
                <div className="page-content">
                    <Routes>
                        <Route path="/dashboard" element={<CustomerDashboard />} />
                        <Route path="/customer" element={<CustomerList />} />
                        <Route path="/client" element={<ClientList />} />
                        <Route path="/job" element={<JobList />} />

                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Customer_Route
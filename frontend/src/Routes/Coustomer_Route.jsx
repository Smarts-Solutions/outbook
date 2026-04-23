
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerDashboard from '../layouts/Customer/Dashboard'
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

                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Customer_Route
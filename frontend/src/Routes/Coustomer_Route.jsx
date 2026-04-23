
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerDashboard from '../layouts/Customer/Dashboard'

const Customer_Route = () => {
    return (
        <Routes>
            <Route path="" element={<CustomerDashboard />} />
        </Routes>
    )
}

export default Customer_Route
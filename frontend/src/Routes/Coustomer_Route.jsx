
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerDashboard from '../layouts/Customer/Dashboard'
import DashboardLinkData from '../layouts/Customer/DashboardLinkData';
import CustomerList from '../layouts/Customer/Customer/CustomerList';
import ClientList from '../layouts/Customer/Customer/ClientList';
import JobList from '../layouts/Customer/Customer/JobList';
import Sidebar from '../Components/Dashboard/Sidebar';
import Header from '../Components/Dashboard/Header';

import ClientEdit from "../layouts/Admin/Clients/Client_Edit";
import ClientProfiles from "../layouts/Customer/Customer/ClientProfile_sidebar";
import CreateJob from "../layouts/Customer/Customer/CreateJob";
import JobEdit from "../layouts/Customer/Customer/EditJob";
import JobLogs from "../layouts/Customer/Customer/JobLogs/CustomerJobLogs";
import AddNewClient from "../layouts/Admin/Clients/CreateClient";

const Customer_Route = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="page-wrapper">
                <Header />
                <div className="page-content">
                    <Routes>
                        <Route path="/dashboard" element={<CustomerDashboard />} />
                        <Route path="/dashboard/data" element={<DashboardLinkData />} />
                        <Route path="/customer" element={<CustomerList />} />
                        <Route path="/client" element={<ClientList />} />
                        <Route path="/job" element={<JobList />} />

                        <Route path="/client/edit" element={<ClientEdit />} />
                        <Route path="/client/profile" element={<ClientProfiles />} />
                        <Route path="/addclient" element={<AddNewClient />} />
                        <Route path="/createjob" element={<CreateJob />} />
                        <Route path="/job/edit" element={<JobEdit />} />
                        <Route path="/job/logs" element={<JobLogs />} />

                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Customer_Route
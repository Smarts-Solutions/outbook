
import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import CustomerDashboard from '../layouts/Customer/Dashboard'
import { useCustomerAccess } from '../Utils/CustomerAccessContext';
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
import AddNewClient from "../layouts/Customer/Customer/CreateClient";
import CustomerReports from "../layouts/Customer/Reports/Reports";
import CustomerReportJobs from "../layouts/Customer/Reports/CustomerReportJobs";
import CustomerProfile from "../layouts/Customer/CustomerProfile";
import CustomerTimesheetReport from "../layouts/Customer/Timesheet/CustomerTimesheetReport";
import CustomerJobCustomReport from "../layouts/Customer/Reports/CustomerJobCustomReport";
import AccessDenied from "../layouts/Customer/AccessDenied";

const Customer_Route = () => {
    const { hasAccess, loading: accessLoading } = useCustomerAccess();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessLoading) return;
        const role = JSON.parse(localStorage.getItem("role"));
        if (role === "SUPERADMIN") return;

        const canViewDashboard = hasAccess("dashboard", "view");
        const canViewClient = hasAccess("client", "view");
        const canViewJob = hasAccess("job", "view");

        // 1. If none of the 3 permissions exist, go to access-denied
        if (!canViewDashboard && !canViewClient && !canViewJob) {
            if (location.pathname !== "/customer/access-denied") {
                navigate("/customer/access-denied");
            }
            return;
        }

        // 2. Handle direct hits to pages they don't have access to
        if (location.pathname.startsWith("/customer/dashboard") && !canViewDashboard) {
            if (canViewClient) navigate("/customer/client");
            else if (canViewJob) navigate("/customer/job");
        } 
        else if (location.pathname.startsWith("/customer/client") && !canViewClient) {
            if (canViewDashboard) navigate("/customer/dashboard");
            else if (canViewJob) navigate("/customer/job");
        }
        else if (location.pathname.startsWith("/customer/job") && !canViewJob) {
            if (canViewDashboard) navigate("/customer/dashboard");
            else if (canViewClient) navigate("/customer/client");
        }
        else if (location.pathname === "/customer/access-denied") {
            if (canViewDashboard) navigate("/customer/dashboard");
            else if (canViewClient) navigate("/customer/client");
            else if (canViewJob) navigate("/customer/job");
        }

    }, [accessLoading, location.pathname, hasAccess, navigate]);

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
                        <Route path="/reports" element={<CustomerReports />} />
                        <Route path="/report/jobs" element={<CustomerReportJobs />} />
                        <Route path="/timesheetReports" element={<CustomerTimesheetReport />} />
                        <Route path="/job/customreport" element={<CustomerJobCustomReport />} />
                        <Route path="/profile" element={<CustomerProfile />} />
                        <Route path="/access-denied" element={<AccessDenied />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Customer_Route
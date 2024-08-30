import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from '../Components/Dashboard/Sidebar';
import Header from '../Components/Dashboard/Header';
import Profile from '../Components/Dashboard/Profile'

import Dashboard from '../layouts/Admin/DashboardPage/Dashboard';

import Service from '../layouts/Admin/customer/customer_add_process/Service';
import Customer from '../layouts/Admin/customer/Customer';

import Addcustomer from '../layouts/Admin/customer/customer_add_process/Addcustomer';
import Editcustomer from '../layouts/Admin/customer/customer_edit_process/Editcustomer';

import Status from '../layouts/Admin/StatusPage/Status';
import Reports from '../layouts/Admin/ReportsPage/Reports';
import Access from '../layouts/Admin/AccessPage/Access';
import Setting from '../layouts/Admin/Settings/Setting';
import Staff from '../layouts/Admin/Staff/Staff';
import ViewLogs from '../layouts/Admin/Staff/ViewLogs';

import JobType from '../layouts/Admin/Settings/JobType'
import { RoleAccess } from '../ReduxStore/Slice/Access/AccessSlice';

import AddNewClient from '../layouts/Admin/Clients/CreateClient'
import ClientList from '../layouts/Admin/Clients/Client_list'
import ClientEdit from '../layouts/Admin/Clients/Client_Edit'

import ClientProfile from '../layouts/Admin/Clients/ClientProfile'

import CreateCheckList from '../layouts/Admin/Clients/CreateCheckList';
import EditCheckList from '../layouts/Admin/Clients/Editchecklist';
import Statuses from '../layouts/Admin/Clients/Statuses';


import JobInformation from '../layouts/Admin/Jobs/JobInformation';
import TaskTimesheet from '../layouts/Admin/Jobs/TaskTimesheet';
import JobTimeline from '../layouts/Admin/Jobs/JobTimeline';
import MissingLogs from '../layouts/Admin/Jobs/MissingLogs';
import Queries from '../layouts/Admin/Jobs/Queries';
import Drafts from '../layouts/Admin/Jobs/Drafts';
import Documents from '../layouts/Admin/Jobs/Documents';

import CreateJob from '../layouts/Admin/Jobs/JobAction/CreateJob'
import JobEdit from '../layouts/Admin/Jobs/JobAction/EditJob'


const Admin_Route = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));

  const { pathname } = useLocation();

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth transition ke liye behavior 'smooth' set karein
    });
  }, [pathname]);
  const accessDataFetch = async () => {
    try {
      const response = await dispatch(RoleAccess({ req: { "role_id": staffDetails.role_id, "action": "get" }, authToken: token })).unwrap();

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
            <Route path="/profile" element={<Profile />} />
            <Route path="/status" element={<Status />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/viewlogs" element={<ViewLogs />} />
            <Route path="/access" element={<Access />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/add/jobtype" element={<JobType />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/addcustomer" element={<Addcustomer />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/service" element={<Service />} />
            <Route path="/addclient" element={<AddNewClient />} />
            <Route path="/Clientlist" element={<ClientList />} />
            <Route path="/client/edit" element={<ClientEdit />} />
            <Route path="/editcustomer" element={<Editcustomer />} />
            <Route path="/client/profile" element={<ClientProfile />} />
            <Route path="/createjob" element={<CreateJob />} />
            <Route path="/job/edit" element={<JobEdit />} />
            <Route path="/create/checklist" element={<CreateCheckList />} />
            <Route path="/create/statuses" element={<Statuses />} />
            <Route path="/edit/checklist" element={<EditCheckList />} />
            <Route path="/job/jobinformation" element={<JobInformation />} />
            <Route path="/job/tasktimesheet" element={<TaskTimesheet />} />
            <Route path="/job/missinglogs" element={<MissingLogs />} />
            <Route path="/job/queries" element={<Queries />} />
            <Route path="/job/drafts" element={<Drafts />} />
            <Route path="/job/documents" element={<Documents />} />
            <Route path="/job/jobtimeline" element={<JobTimeline />} />

          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Admin_Route
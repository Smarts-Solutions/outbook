import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from '../Components/Dashboard/Sidebar';
import Dashboard from '../layouts/Admin/Dashboard';
import Header from '../Components/Dashboard/Header';
import Customer from '../layouts/Admin/customer/Customer';
import Status from '../layouts/Admin/Status';
import Reports from '../layouts/Admin/Reports';
import Service from '../layouts/Admin/customer/customer_add_process/Service';
import Footer from '../Components/Dashboard/Footer';
import Access from '../layouts/Admin/Access';
import Setting from '../layouts/Admin/Setting';
import Staff from '../layouts/Admin/Staff';
import Addcustomer from '../layouts/Admin/customer/customer_add_process/Addcustomer';
import Editcustomer from '../layouts/Admin/customer/customer_edit_process/Editcustomer';
import AddNewClient from '../layouts/Admin/customer/Client_view/CreateClient'
import JobType from '../layouts/Admin/JobType'
import Profile from '../Components/Dashboard/Profile'
import { RoleAccess } from '../ReduxStore/Slice/Access/AccessSlice';
import ClientList from '../layouts/Admin/customer/Client_view/Client_list'
import ClientEdit from '../layouts/Admin/customer/Client_view/Client_Edit'
import CreateJob from '../layouts/Admin/customer/Client_view/ClientJobs/CreateJob'
import ClientProfile from '../layouts/Admin/customer/Client_view/ClientJob'
import JobEdit from '../layouts/Admin/customer/Client_view/ClientJobs/EditJob'
import CreateCheckList from '../layouts/Admin/customer/Client_view/CreateCheckList';
import EditCheckList from '../layouts/Admin/customer/Client_view/Editchecklist';


const Admin_Route = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));


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
            <Route path="/edit/checklist" element={<EditCheckList />} />



          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Admin_Route
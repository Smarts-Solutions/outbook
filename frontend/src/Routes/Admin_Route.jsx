import React, { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { BrowserRouter as Router,  Route,  Routes,  useLocation,  useNavigate} from "react-router-dom";
import Sidebar from "../Components/Dashboard/Sidebar";
import Header from "../Components/Dashboard/Header";
import Profile from "../Components/Dashboard/Profile";

import Dashboard from "../layouts/Admin/DashboardPage/Dashboard";

import Service from "../layouts/Admin/customer/customer_add_process/Service";
import Customer from "../layouts/Admin/customer/Customer";

import Addcustomer from "../layouts/Admin/customer/customer_add_process/Addcustomer";
import Editcustomer from "../layouts/Admin/customer/customer_edit_process/Editcustomer";

import Status from "../layouts/Admin/StatusPage/Status";
import Reports from "../layouts/Admin/ReportsPage/Reports";
import Access from "../layouts/Admin/AccessPage/Access";
import Setting from "../layouts/Admin/Settings/Setting";
import Staff from "../layouts/Admin/Staff/Staff";
import ViewLogs from "../layouts/Admin/Staff/ViewLogs";

import JobType from "../layouts/Admin/Settings/JobType";
import Subsource from "../layouts/Admin/Settings/Subsource";
import { RoleAccess } from "../ReduxStore/Slice/Access/AccessSlice";

import AddNewClient from "../layouts/Admin/Clients/CreateClient";
import ClientList from "../layouts/Admin/Clients/Client_list";
import ClientEdit from "../layouts/Admin/Clients/Client_Edit";

import ClientProfile from "../layouts/Admin/Clients/ClientProfile";

import CreateCheckList from "../layouts/Admin/Clients/CreateCheckList";
import EditCheckList from "../layouts/Admin/Clients/Editchecklist";
import Statuses from "../layouts/Admin/Clients/Statuses";
import SettingCheckList from '../layouts/Admin/Settings/CreateCheckList'
import EditSettingCheckList from '../layouts/Admin/Settings/EditCheckList'

import JobLogs from "../layouts/Admin/Jobs/JobLogs";
import JobInformation from "../layouts/Admin/Jobs/JobInformation";
import TaskTimesheet from "../layouts/Admin/Jobs/TaskTimesheet";
import JobTimeline from "../layouts/Admin/Jobs/JobTimeline";
import MissingLogs from "../layouts/Admin/Jobs/MissingLogs";
import Queries from "../layouts/Admin/Jobs/Queries";
import Drafts from "../layouts/Admin/Jobs/Drafts";
import Documents from "../layouts/Admin/Jobs/Documents";

import CreateJob from "../layouts/Admin/Jobs/JobAction/CreateJob";
import JobEdit from "../layouts/Admin/Jobs/JobAction/EditJob";
import Timesheet from "../layouts/Admin/Timesheet/Timesheet";



const Admin_Route = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = JSON.parse(localStorage.getItem("role"));

  const [showTab, setShowTab] = useState({
    setting: true,
    customer: true,
    staff: true,
    status: true,
    report: true,
  });

  useEffect(() => {
    accessDataFetch();
  }, []);

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const accessDataFetch = async () => {
    try {
      const response = await dispatch(
        RoleAccess({
          req: { role_id: staffDetails.role_id, action: "get" },
          authToken: token,
        })
      ).unwrap();

      if (response.data) {
        localStorage.setItem("accessData", JSON.stringify(response.data)); 
        
        response.data.forEach((item) => {
          if (!role == "ADMIN" || !role == "SUPERADMIN") {
            if (item.permission_name === "setting") {
              const settingView = item.items.find(
                (item) => item.type === "view"
              );

              if (settingView && settingView.is_assigned === 0) {
                navigate("/admin/dashboard");
              }
            } else if (item.permission_name === "customer") {
              const customerView = item.items.find(
                (item) => item.type === "view"
              );

              if (customerView && customerView.is_assigned === 0) {
                navigate("/admin/dashboard");
              }
            } else if (item.permission_name === "staff") {
              const staffView = item.items.find((item) => item.type === "view");

              if (staffView && staffView.is_assigned === 0) {
                navigate("/admin/dashboard");
              }
            } else if (item.permission_name === "status") {
              const statusView = item.items.find(
                (item) => item.type === "view"
              );

              if (statusView && statusView.is_assigned === 0) {
                navigate("/admin/dashboard");
              }
            } else if (item.permission_name === "report") {
              const reportView = item.items.find(
                (item) => item.type === "view"
              );

              if (reportView && reportView.is_assigned === 0) {
                navigate("/admin/dashboard");
              }
            }
          }

          const updatedShowTab = { ...showTab };

          response.data.forEach((item) => {
            if (item.permission_name === "setting") {
              const settingView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.setting =
                settingView && settingView.is_assigned === 1;
            } else if (item.permission_name === "customer") {
              const customerView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.customer =
                customerView && customerView.is_assigned === 1;
            } else if (item.permission_name === "staff") {
              const staffView = item.items.find((item) => item.type === "view");
              updatedShowTab.staff = staffView && staffView.is_assigned === 1;
            } else if (item.permission_name === "status") {
              const statusView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.status =
                statusView && statusView.is_assigned === 1;
            } else if (item.permission_name === "report") {
              const reportView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.report =
                reportView && reportView.is_assigned === 1;
            }else if (item.permission_name === "timesheet") {
              const timesheetView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.timesheet =
                timesheetView && timesheetView.is_assigned === 1;
            }
          });

          localStorage.setItem(
            "updatedShowTab",
            JSON.stringify(updatedShowTab)
          );
        });
      }
    } catch (error) {
      return;
    }
  };

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
            <Route path="/job/logs" element={<JobLogs />} />
            <Route path="/job/tasktimesheet" element={<TaskTimesheet />} />
            <Route path="/job/missinglogs" element={<MissingLogs />} />
            <Route path="/job/queries" element={<Queries />} />
            <Route path="/job/drafts" element={<Drafts />} />
            <Route path="/job/documents" element={<Documents />} />
            <Route path="/job/jobtimeline" element={<JobTimeline />} />
            <Route path="/job/jobinformation" element={<JobInformation />} />
            <Route path="/add/subSource" element={<Subsource />} />
            <Route path="/setting/checklist" element={<SettingCheckList />} />
            <Route path="/edit/setting/checklist" element={<EditSettingCheckList />} />
            <Route path="/timesheet" element={<Timesheet />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin_Route;

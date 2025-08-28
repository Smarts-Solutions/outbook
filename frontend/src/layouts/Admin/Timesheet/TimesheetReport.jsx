import React, { useState, useEffect } from 'react';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';
import { useDispatch, useSelector } from "react-redux";
// import TimesheetReport from './TimesheetReport';
// import JobStatusReport from './JobStatusPeport';
// import JobSummaryReport from './JobSummaryReport';
// import TeamMonthlyReport from './TeamMonthlyReports';
// import JobPendingReport from './JobPendingReports';
// import JobsReceivedSentReports from './JobsReceivedSentReports';
// import DueByReport from './DueByReport';
// import TextWeelyReport from './TextWeelyReport';
// import AverageTatReport from './AverageTatReport';



import Select from "react-select";



import * as XLSX from "xlsx";


import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";


function TimesheetReport() {

  const [filter, setFilter] = useState(false);
  const getActiveTab = sessionStorage.getItem('activeReport');
  const [activeTab, setActiveTab] = useState(getActiveTab || "jobStatusReport");

  const handleTabClick = (tabValue) => {
    sessionStorage.setItem('activeReport', tabValue);
    setActiveTab(tabValue);
  };


  //   const getTabContent = () => {
  //     switch (activeTab) {
  //       case 'jobStatusReport':
  //         return <JobStatusReport />
  //       case 'jobsReceivedSentReports':
  //         return <JobsReceivedSentReports />;
  //       case 'jobSummaryReport':
  //         return <JobSummaryReport />
  //       case 'jobsPendingReport':
  //         return <JobPendingReport />;
  //       case 'dueByReport':
  //         return <DueByReport />;
  //       case 'teamPerformanceReport':
  //         return <TeamMonthlyReport />;
  //       case 'timesheetReport':
  //         return <TimesheetReport />
  //       case 'averageTATReport':
  //         return <AverageTatReport />;
  //       case 'taxWeeklyStatusReport':
  //         return <TextWeelyReport />;
  //       default:
  //         return null;
  //     }
  //   };
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedStaff, setSelectedStaff] = useState({});
  const [options, setOptions] = useState([]);




  //  let options = [
  //   { value: "employee", label: "Employee Name" },
  //   { value: "customer", label: "Customer Name" },
  //   { value: "client", label: "Client Name" },
  //   { value: "job", label: "Job Type Name" },
  //   { value: "task", label: "Task Name" },
  //  ];


  const staffData = async () => {
    await dispatch(Staff({ req: { action: "get" }, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          // console.log("response.data ", response.data);
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.email
          }));
          setOptions(data);
        } else {
          setOptions([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    staffData();
  }, []);



  const data = [
    {
      jobId: "F & CLI_V3_00009",
      accountManager: "STAFF NINE",
      client: "CLI--2",
      serviceType: "Payroll",
      jobType: "V3",
      status: "To Be Started Yet Allocated Internally",
    },
    {
      jobId: "F & CLI_V3_00008",
      accountManager: "STAFF NINE",
      client: "CLI--2",
      serviceType: "Payroll",
      jobType: "V3",
      status: "To Be Started Yet Allocated Internally",
    },
  ];

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Status Report");
    XLSX.writeFile(workbook, "JobStatusReport.xlsx");
  };

  const dummyData = [
    {
      employee: "John",
      internalExternal: "Internal",
      customer: "ABC Corp",
      client: "XYZ Ltd",
      job: "Developer",
      task: "Coding",
      date: "2025-08-01",
    },
    {
      employee: "Mary",
      internalExternal: "External",
      customer: "DEF Inc",
      client: "XYZ Ltd",
      job: "Designer",
      task: "Design",
      date: "2025-08-05",
    },
    // aur bhi data items
  ];

  const [filters, setFilters] = useState({
    groupBy: "Employee",
    fieldsToDisplay: null,
    fieldsToDisplayId: null,
    timePeriod: "This month",
    displayBy: "Weekly",
    fromDate: null,
    toDate: null,
  });



  // Filter the data based on filters
  const filteredData = dummyData.filter((item) => {
    const itemDate = new Date(item.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    if (fromDate && itemDate < fromDate) return false;
    if (toDate && itemDate > toDate) return false;

    return true;
  });





  const handleFilterChange = (e) => {
    const { key, value, label } = e.target;

    if (key === "fieldsToDisplay") {
      setFilters((prev) => ({
        ...prev,
        [key]: label,
        [key + "Id"]: value
      }));
    }

    else if (key === "groupBy") {
      setOptions([])
      console.log("Group By changed: ", value);


      if (value == "employee") {
        staffData()
      }


      setFilters((prev) => ({
        ...prev,
        fieldsToDisplay: null,
        fieldsToDisplayId: null,
        [key]: value
      }));

    }

    else {
      setFilters((prev) => ({
        ...prev,
        [key]: value
      }));
    }



  };


  console.log("filters ", filters);


  return (
    <div className="container-fluid py-4">
      {/* Page Title */}
      <div className="row mb-3">
        <div className="col-12">
          <h5 className="fw-semibold mb-0">Timesheet Reports</h5>
        </div>
      </div>

      {/* Filters Section */}
      <div className="row g-3 mb-3 bg-light p-3 rounded shadow-sm">
        {/* Group By */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Group By</label>
          <select
            className="form-select shadow-sm"
            id="groupBy"
            value={filters.groupBy}
            onChange={(e) =>
              handleFilterChange({
                target: {
                  key: "groupBy",
                  value: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text
                }
              })
            }
          >
            <option value="employee">Employee</option>
            <option value="internal_external">Internal/External</option>
            <option value="customer">Customer</option>
            <option value="client">Client</option>
            <option value="job">Job</option>
            <option value="task">Task</option>
          </select>
        </div>


        {/* Field To Display */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Fields to Display</label>
          
          <Select
            options={options}
            value={
              options && options.length > 0
                ? options.find((opt) => Number(opt.value) === Number(filters.fieldsToDisplayId)) || null
                : null
            }
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "fieldsToDisplay", value: selected.value, label: selected.label },
              })
            }
            isSearchable
            className="shadow-sm"
          />

        </div>




        {/* Time Period */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Time Period</label>
          <select
            className="form-select shadow-sm"
            id="timePeriod"
            value={filters.timePeriod}
            onChange={handleFilterChange}
          >
            <option>This week</option>
            <option>This month</option>
            <option>This quarter</option>
            <option>This year</option>
            <option>Last Week</option>
            <option>Last Month</option>
            <option>Custom</option>
          </select>
        </div>



        {/* From Date */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">From Date</label>
          <input
            type="date"
            className="form-control shadow-sm"
            id="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
          />
        </div>

        {/* To Date */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">To Date</label>
          <input
            type="date"
            className="form-control shadow-sm"
            id="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
          />
        </div>


        {/* Display By */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Display By</label>
          <select
            className="form-select shadow-sm"
            id="displayBy"
            value={filters.displayBy}
            onChange={handleFilterChange}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Yearly</option>
          </select>
        </div>




      </div>




      {/* Buttons */}
      <div className="d-flex gap-2 align-items-center mb-4">
        <button
          className="btn btn-outline-secondary shadow-sm"
          id="btn-reset"
          onClick={() =>
            setFilters({
              groupBy: "Employee",
              timePeriod: "This month",
              displayBy: "Weekly",
              fromDate: "",
              toDate: "",
            })
          }
        >
          Reset
        </button>
        <button className="btn btn-info" id="btn-export">
          Export Excel
        </button>
      </div>

      {/* Filtered Data Display */}
      <div>
        <h6>Filtered Data:</h6>
        {filteredData.length === 0 ? (
          <p>No records found</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Internal/External</th>
                <th>Customer</th>
                <th>Client</th>
                <th>Job</th>
                <th>Task</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.employee}</td>
                  <td>{item.internalExternal}</td>
                  <td>{item.customer}</td>
                  <td>{item.client}</td>
                  <td>{item.job}</td>
                  <td>{item.task}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );




}

export default TimesheetReport;

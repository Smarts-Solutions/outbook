import React, { useState, useEffect } from 'react';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';
import { getAllCustomerDropDown, JobAction, getAllTaskByStaff, getTimesheetReportData } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import * as XLSX from "xlsx";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";


function TimesheetReport() {

  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [options, setOptions] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [showData, setShowData] = useState([]);

  console.log("showData ", showData);

  //  console.log("staffDetails ", staffDetails);


  //  let options = [
  //   { value: "employee", label: "Employee Name" },
  //   { value: "customer", label: "Customer Name" },
  //   { value: "client", label: "Client Name" },
  //   { value: "job", label: "Job Type Name" },
  //   { value: "task", label: "Task Name" },
  //  ];


  const staffData = async () => {

    let role = staffDetails?.role?.toUpperCase();
    //  console.log("role ", role);

    if (role === "SUPERADMIN") {
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
    }
    else {
      let data = [{ id: staffDetails?.id, email: staffDetails?.email }]
      data = data?.map((item) => ({
        value: item.id,
        label: item.email
      }));
      setOptions(data);
    }
  };

  useEffect(() => {
    staffData();
  }, []);


  // Get All Customers
  const GetAllCustomer = async () => {
    const req = { action: "get_dropdown" };
    const data = { req: req, authToken: token };
    await dispatch(getAllCustomerDropDown(data)).unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.trading_name
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

  // Get All Clients
  const GetAllClient = async () => {
    const req = { action: "get", customer_id: "" };
    const data = { req: req, authToken: token };
    await dispatch(ClientAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.client_name + " (" + item.client_code + ")"
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

  // Get All Jobs
  const GetAllJobs = async () => {
    const req = { action: "getByCustomer", customer_id: "" };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.job_id,
            label: item.job_code_id
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

  // Get All task
  const GetAllTask = async () => {
    const req = { action: "get" };
    const data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.task_id,
            label: item.task_name
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
    groupBy: "employee",
    fieldsToDisplay: null,
    fieldsToDisplayId: null,
    timePeriod: "this_week",
    displayBy: "Daily",
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
      //console.log("Group By changed: ", value);
      if (value == "employee") {
        staffData()
      }

      else if (value == "customer") {
        GetAllCustomer()
      }

      else if (value == "client") {
        GetAllClient()
      }

      else if (value == "job") {
        GetAllJobs()
      }

      else if (value == "task") {
        GetAllTask()
      }

      setFilters((prev) => ({
        ...prev,
        fieldsToDisplay: null,
        fieldsToDisplayId: null,
        [key]: value
      }));

    }

    else if (key == "timePeriod") {

      setFilters((prev) => ({
        ...prev,
        fromDate: null,
        toDate: null,
        [key]: value,
      }));
    }

    else if (key == "fromDate") {
      if (value > filters.toDate) {
        setFilters((prev) => ({
          ...prev,
          toDate: value,
        }));
      }

      setFilters((prev) => ({
        ...prev,
        fromDate: value,
      }));
    }

    else {
      setFilters((prev) => ({
        ...prev,
        [key]: value
      }));
    }



  };

  const callFilterApi = async () => {
    // Call your filter API here
    console.log("Calling filter API with filters: ", filters);
    const req = { action: "get", filters: filters };
    const data = { req: req, authToken: token };
    await dispatch(getTimesheetReportData(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setShowData(response.data);
        } else {
          setShowData([]);
        }
      })
      .catch((error) => {
        return;
      });


  };

  useEffect(() => {
    if (filters.fieldsToDisplay !== null) {
      callFilterApi();
    }
  }, [filters.fieldsToDisplay, filters.timePeriod, filters.fromDate, filters.toDate, filters.displayBy]);

  // console.log("filters ", filters);

  const resetFunction = () => {
    setFilters({
      groupBy: "employee",
      fieldsToDisplay: null,
      fieldsToDisplayId: null,
      timePeriod: "this_week",
      displayBy: "Daily",
      fromDate: null,
      toDate: null,
    })
    setShowData([]);
    staffData();
  }


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
            {/* <option value="internal_external">Internal/External</option> */}
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
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "timePeriod", value: selected.target.value },
              })
            }
          >
            <option value={"this_week"}>This week</option>
            <option value={"last_week"}>Last Week</option>
            <option value={"this_month"}>This month</option>
            <option value={"last_month"}>Last Month</option>
            <option value={"this_quarter"}>This quarter</option>
            <option value={"last_quarter"}>Last quarter</option>
            <option value={"this_year"}>This year</option>
            <option value={"last_year"}>Last year</option>
            <option value={"custom"}>Custom</option>
          </select>
        </div>



        {/* From Date  And To Date */}
        {filters.timePeriod == "custom" && (
          <>
            {/* <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">From Date</label>
          <input
            type="date"
            className="form-control shadow-sm"
            id="fromDate"
            value={filters.fromDate}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "fromDate", value: selected.target.value },
              })
            }
          />
        </div>

        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">To Date</label>
          <input
            type="date"
            className="form-control shadow-sm"
            id="toDate"
            value={filters.toDate}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "toDate", value: selected.target.value },
              })
            }
          />
        </div> */}
            {/* From Date */}
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">From Date</label>
              <input
                type="date"
                className="form-control shadow-sm"
                id="fromDate"
                value={filters.fromDate}
                //  min={today} 
                onChange={(selected) =>
                  handleFilterChange({
                    target: { key: "fromDate", value: selected.target.value },
                  })
                }
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
                min={filters.fromDate || today}
                onChange={(selected) =>
                  handleFilterChange({
                    target: { key: "toDate", value: selected.target.value },
                  })
                }
                disabled={!filters.fromDate} // जब तक fromDate select न हो, disable
              />
            </div>
          </>
        )}


        {/* Display By */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Display By</label>
          <select
            className="form-select shadow-sm"
            id="displayBy"
            value={filters.displayBy}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "displayBy", value: selected.target.value },
              })
            }
          >
            <option value={"Daily"}>Daily</option>
            <option value={"Weekly"}>Weekly</option>
            <option value={"Monthly"}>Monthly</option>
            <option value={"Yearly"}>Yearly</option>
          </select>
        </div>




      </div>




      {/* Buttons */}
      <div className="d-flex gap-2 align-items-center mb-4">
        <button
          className="btn btn-outline-secondary shadow-sm"
          id="btn-reset"
          onClick={() => resetFunction()}
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
        {showData.length === 0 ? (
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
              {showData && showData?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.employee_email}</td>
                  <td>{""}</td>
                  <td>{""}</td>
                  <td>{""}</td>
                  <td>{""}</td>
                  <td>{""}</td>
                  <td>{""}</td>
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

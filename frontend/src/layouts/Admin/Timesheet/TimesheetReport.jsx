import React, { useState, useEffect } from 'react';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';
import { getAllCustomerDropDown, JobAction, getAllTaskByStaff, getTimesheetReportData } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import * as XLSX from "xlsx";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
import dayjs from "dayjs";


function TimesheetReport() {
  const noDataImage = '/assets/images/No-data-amico.png';
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [options, setOptions] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = staffDetails?.role;
  const [showData, setShowData] = useState([]);

  console.log("showData ", showData);

  const [filters, setFilters] = useState({
    groupBy: ["staff_id"],
    internal_external: "2",
    fieldsToDisplay: null,
    fieldsToDisplayId: null,
    timePeriod: "this_week",
    displayBy: "Daily",
    fromDate: null,
    toDate: null,
  });

 let lastGroupValue = filters?.groupBy[filters?.groupBy?.length - 1];


   console.log("lastGroupValue ", lastGroupValue);



  const staffData = async () => {
    //  console.log("role ", role);
    if (role?.toUpperCase() === "SUPERADMIN") {
      await dispatch(Staff({ req: { action: "get" }, authToken: token }))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            console.log("response.data ", response.data);
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.email})`
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
      let data = [{ id: staffDetails?.id, email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})` }]

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
  const GetAllJobs = async (internal_external) => {
    if (internal_external == "1") {
      const req = { action: "getInternalJobs" };
      const data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {

            console.log("Internal jobs response: ", response.data);
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name
            }));
            setOptions(data);
          } else {
            setOptions([]);
          }
        })
        .catch((error) => {
          return;
        });


      return

    }


    // External get All jobs
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
  const GetAllTask = async (internal_external) => {
    if (internal_external == "1") {
      const req = { action: "getInternalTasks" };
      const data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {

            console.log("Internal tasks response: ", response.data);
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name
            }));
            setOptions(data);
          } else {
            setOptions([]);
          }
        })
        .catch((error) => {
          return;
        });

      return
    }


    // External Task
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


  const exportToCSV = (showData) => {
    if (!showData || showData.length === 0) {
      alert("No data to export!");
      return;
    }

    // Headers as per <thead>
    const headers = [
      "Staff",
      "Internal/External",
      "Customer",
      "Client",
      "Job",
      "Task",
      "Mon (hrs)",
      "Tue (hrs)",
      "Wed (hrs)",
      "Thu (hrs)",
      "Fri (hrs)",
      "Date",
    ];

    // Rows mapping data keys to headers
    const rows = showData.map((item) => {
      return [
        item.staff_fullname || "-", // Staff
        item.internal_external || "-", // Internal/External
        item.customer_name ?? "-", // Customer
        item.client_code ?? "-", // Client
        item.job_name || "-", // Job
        item.task_name || "-", // Task
        item.monday_hours || "-", // Mon
        item.tuesday_hours || "-", // Tue
        item.wednesday_hours || "-", // Wed
        item.thursday_hours || "-", // Thu
        item.friday_hours || "-", // Fri
        item.created_at ? dayjs(item.created_at).format("DD-MM-YYYY") : "-", // Date
      ];
    });

    // CSV content
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((val) =>
            typeof val === "string" && val.includes(",")
              ? `"${val}"` // agar string me comma ho to quotes me wrap
              : val
          )
          .join(",")
      )
      .join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "TimeSheetReportData.csv";
    link.click();
  };


  const handleFilterChange = (e) => {

    if (Array.isArray(e)) {
      // ye case sirf "groupBy" ke liye handle karte h
      const values = e.map((opt) => opt.value);
      const labels = e.map((opt) => opt.label);
      // console.log("Filter changed (multi): ", "groupBy", values, labels);
      setOptions([]);
      let gropByArray = sortByReference(values)

      let lastIndexValue = gropByArray[gropByArray.length - 1];
    //  console.log("lastIndexValue ", lastIndexValue);

      if (lastIndexValue == "staff_id") {
        staffData()
      }

      else if (lastIndexValue == "customer_id") {
        GetAllCustomer()
      }

      else if (lastIndexValue == "client_id") {
        GetAllClient()
      }

      else if (lastIndexValue == "job_id") {
        GetAllJobs(filters.internal_external)
      }

      else if (lastIndexValue == "task_id") {
        GetAllTask(filters.internal_external)
      }

      setFilters((prev) => ({
        ...prev,
        fieldsToDisplay: null,
        fieldsToDisplayId: null,
        groupBy: sortByReference(gropByArray)
      }));

      return; // multi-select ke liye yahi enough hai
    }


    const { key, value, label } = e.target;
    console.log("Filter changed: ", key, value, label);
    if (key === "fieldsToDisplay") {

      //console.log("Fields to Display changed field: ", value);

      if ([null, undefined, ""].includes(value)) {
        setFilters((prev) => ({
          ...prev,
          [key]: null,
          [key + "Id"]: null
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          [key]: label,
          [key + "Id"]: value
        }));
      }

    }
    else if (key === "internal_external") {
      
      

      setFilters((prev) => ({
        ...prev,
        [key]: value
      }));

      let remainingPart = filters?.groupBy
      if(value == "1"){
        setOptions([])
        let remainingPart = filters?.groupBy?.filter(item => item !== 'customer_id' && item !== 'client_id');
        setFilters((prev) => ({
        ...prev,
        [key]: value,
        groupBy: remainingPart,
        fieldsToDisplay: null,
        fieldsToDisplayId: null
       }));
      }


      let lastIndexValue = remainingPart[remainingPart.length - 1];
      if (lastIndexValue == 'job_id') {
        setOptions([])
        console.log("Internal/External changed, calling GetAllJobs with: ", value);
        GetAllJobs(value)
      } else if (lastIndexValue == 'task_id') {
        setOptions([])
        GetAllTask(value)
      }

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
    // console.log("Calling filter API with filters: ", filters);
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
    if (filters.fieldsToDisplay !== null || role?.toUpperCase() === "SUPERADMIN") {
      callFilterApi();
    }
  }, [filters.fieldsToDisplay, filters.timePeriod, filters.fromDate, filters.toDate, filters.displayBy, filters.internal_external, filters.groupBy]);





  // console.log("filters ", filters);

  const resetFunction = () => {
    setFilters({
      groupBy: ["staff_id"],
      internal_external: "2",
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

  // const optionGroupBy = [
  //   { value: "staff_id", label: "Staff" },
  //   { value: "customer_id", label: "Customer" },
  //   { value: "client_id", label: "Client" },
  //   { value: "job_id", label: "Job" },
  //   { value: "task_id", label: "Task" }
  // ];

  const optionGroupBy = [
    { value: "staff_id", label: "Staff" },
    ...(filters?.internal_external == '2' ? [{ value: "customer_id", label: "Customer" }] : []),
    ...(filters?.internal_external == '2' ? [{ value: "client_id", label: "Client" }] : []),
    { value: "job_id", label: "Job" },
    { value: "task_id", label: "Task" }
  ];

  const labels = {
  staff_id: "Staff",
  customer_id: "Customer",
  client_id: "Client",
  job_id: "Job",
  task_id: "Task"
};



  const orderMap = {};
  for (let i = 0; i < optionGroupBy.length; i++) {
    orderMap[optionGroupBy[i].value] = i;
  }

  // sabse fast function
  function sortByReference(selected) {
    if (!Array.isArray(selected) || selected.length <= 1) return selected;
    return selected.slice().sort((a, b) => orderMap[a] - orderMap[b]);
  }

  console.log("Filters after reset: ", filters);



  return (
    <div className="container-fluid pb-3">
      {/* Page Title */}
      <div className="content-title">
        <div className="tab-title mb-3">
          <div className="row align-items-center">
            <div className="col-12 col-sm-6">
              <h3 className="mt-0">Timesheet Reports</h3>
            </div>
            <div className="col-12 col-sm-6">
              <div className="d-block d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                <button className="btn btn-info" id="btn-export"
                  onClick={() => exportToCSV(showData)}>
                  Export Data
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row mb-3">
        <div className="col-12">
          <h5 className="fw-semibold mb-0">Timesheet Reports</h5>
        </div>
      </div> */}

      {/* Filters Section */}
      <div className="row g-3 mb-3 bg-light p-3  mt-4 rounded shadow-sm align-items-end">
        {/* Group By */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Group By</label>
          {/* <select
            className="form-select shadow-sm  rounded-pill"
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
            <option value="employee">Staff</option>
            <option value="customer">Customer</option>
            <option value="client">Client</option>
            <option value="job">Job</option>
            <option value="task">Task</option>
          </select> */}
          <Select
            isMulti
            options={optionGroupBy}
            value={optionGroupBy.filter((opt) => filters.groupBy.includes(opt.value))}
            onChange={handleFilterChange}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        {/* Field To Internal External */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Internal / External</label>
          <select
            className="form-select shadow-sm"
            id="internal_external"
            value={filters.internal_external}
            onChange={(e) =>
              handleFilterChange({
                target: {
                  key: "internal_external",
                  value: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text
                }
              })
            }
          >
            <option value="1">Internal</option>
            <option value="2">External</option>
          </select>
        </div>


        {/* Field To Display */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">
            {
              `Select ${labels[lastGroupValue] || "..." }`
            }

            {
              lastGroupValue == "job_id" || lastGroupValue == "task_id" ? filters.internal_external === "1" ? " ( Internal )" : " ( External )" : ""
            }

          </label>

          <Select
            //options={options}
            options={[
              { value: "", label: "Select..." },
              ...options,
            ]}
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
            className="shadow-sm select-staff rounded-pill"
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
                disabled={!filters.fromDate}
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
        {/* Reset Button */}
        <div className="col-lg-4 col-md-6">
          <button
            className="btn btn-outline-secondary shadow-sm rounded-pill"
            id="btn-reset"
            onClick={() => resetFunction()}
          >
            Clear Filter
          </button>
        </div>

      </div>




      {/* Buttons */}
      {/* <div className="d-flex gap-2 align-items-center mb-4">
    
        <button className="btn btn-info" id="btn-export"
          onClick={exportExcel}>
          Export Data
        </button>
      </div> */}

      {/* Filtered Data Display */}
      <div className='datatable-container'>
        {/* <h6>Filtered Data:</h6> */}
        {console.log("showData?.rows ", showData?.rows)}
        {showData?.rows == undefined || showData?.rows?.length === 0 ? (
          <div className='text-center'>
            <img
              src={noDataImage}
              alt="No records available"
              style={{ width: '250px', height: 'auto', objectFit: 'contain' }}
            />
            <p className='fs-16'>There are no records to display</p>
          </div>
        ) : (
          <table
            className="table rdt_Table"
           // className="table table-bordered"
            // style={{
            //   fontSize: "14px",
            //   width: "100%",
            //   overflowX: "auto",
            //   display: "block",
            // }}
          >
            <thead 
           // className="rdt_TableHead"
            >
              <tr 
              className="rdt_TableHeadRow"
              >
                {showData?.columns?.map((col, idx) => (
                  <th key={idx} 
                  style={{ fontSize:"17px", textAlign: "center" ,fontWeight: "bold"}}
                  >
                    {getColumnName(col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {showData?.rows?.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {showData?.columns?.map((col, colIdx) => (
                    <td key={colIdx} style={{ padding: "8px" , textAlign: "center" }}>
                      {row[col] !== undefined ? row[col] : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        )}
      </div>
    </div>
  );

}


function getColumnName(columnKey) {
  const dayMap = {
    staff_id: "Staff",
    customer_id: "Customer",
    client_id: "Client",
    job_id: "Job",
    task_id: "Task",
    total_hours: "Total Hours",
    total_records: "Total Records",
  };

  // ✅ check if columnKey is a date string (yyyy-mm-dd format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(columnKey)) {
    const date = new Date(columnKey); // convert string to Date
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${columnKey} ${days[date.getDay()]} (hrs)`; 
  }

  // fallback from map
  return dayMap[columnKey] || columnKey;
}

export default TimesheetReport;

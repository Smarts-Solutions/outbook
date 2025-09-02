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

  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [options, setOptions] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = staffDetails?.role;
  const [showData, setShowData] = useState([]);

  console.log("showData ", showData);

  const [filters, setFilters] = useState({
    groupBy: "employee",
    internal_external: "1",
    fieldsToDisplay: null,
    fieldsToDisplayId: null,
    timePeriod: "this_week",
    displayBy: "Daily",
    fromDate: null,
    toDate: null,
  });

  console.log("staffDetails ", staffDetails);


  //  let options = [
  //   { value: "employee", label: "Employee Name" },
  //   { value: "customer", label: "Customer Name" },
  //   { value: "client", label: "Client Name" },
  //   { value: "job", label: "Job Type Name" },
  //   { value: "task", label: "Task Name" },
  //  ];


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

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(showData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Status Report");
    XLSX.writeFile(workbook, "JobStatusReport.xlsx");
  };


  const handleFilterChange = (e) => {
    const { key, value, label } = e.target;

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
      if (filters.groupBy == 'job') {
        setOptions([])
        GetAllJobs(value)
      } else if (filters.groupBy == 'task') {
        setOptions([])
        GetAllTask(value)
      }

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
        GetAllJobs(filters.internal_external)
      }

      else if (value == "task") {
        GetAllTask(filters.internal_external)
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
    if (filters.fieldsToDisplay !== null || role?.toUpperCase() === "SUPERADMIN") {
      callFilterApi();
    }
  }, [filters.fieldsToDisplay, filters.timePeriod, filters.fromDate, filters.toDate, filters.displayBy, filters.internal_external]);





  // console.log("filters ", filters);

  const resetFunction = () => {
    setFilters({
      groupBy: "employee",
      internal_external: "1",
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

  console.log("Filters after reset: ", filters);

  return (
    <div className="container-fluid py-4">
      {/* Page Title */}
      <div className="content-title">
          <div className="tab-title">
            <div className="row">
              <div className="col-12 col-sm-6">
                <h3 className="mt-0">Timesheet Reports</h3>
              </div>
              <div className="col-12 col-sm-6">
                <div className="d-block d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                  <button className="btn btn-info" id="btn-export"
          onClick={exportExcel}>
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
      <div className="row g-3 mb-3 bg-light p-3 rounded shadow-sm align-items-end">
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
            <option value="employee">Staff</option>
            <option value="customer">Customer</option>
            <option value="client">Client</option>
            <option value="job">Job</option>
            <option value="task">Task</option>
          </select>
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
              'Select '
             } 
            
            {filters.groupBy == "employee" ? "Staff" : filters.groupBy.charAt(0).toUpperCase() + filters.groupBy.slice(1)
          }

            {
              filters.groupBy == "job" || filters.groupBy == "task" ? filters.internal_external === "1" ? " ( Internal )" : " ( External )" : ""
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
            className="shadow-sm select-staff"
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
        {showData.length === 0 ? (
          <p style={{ textAlign: "center" }}>No records found</p>
        ) : (
          <table className="table rdt_Table" style={{ fontSize: '14px', width: '100%', overflowX: 'auto', display: 'block' }}>
            <thead className=' rdt_TableHead'>
              <tr className='rdt_TableHeadRow'>
                <th className='rdt_TableCol'>Staff</th>
                <th className='rdt_TableCol'>Internal/External</th>
                <th className='rdt_TableCol'>Customer</th>
                <th className='rdt_TableCol'>Client</th>
                <th className='rdt_TableCol'>Job</th>
                <th className='rdt_TableCol'>Task</th>
                <th className='rdt_TableCol'>Mon (hrs)</th>
                <th className='rdt_TableCol'>Tue (hrs)</th>
                <th className='rdt_TableCol'>Wed (hrs)</th>
                <th className='rdt_TableCol'>Thu (hrs)</th>
                <th className='rdt_TableCol'>Fri (hrs)</th>
                <th className='rdt_TableCol'>Date</th>
              </tr>
            </thead>
            <tbody>
              {showData && showData?.map((item, idx) => (
                <tr key={idx}>
                  {/* <td>{`${item.staff_fullname} (${item.staff_email})`}</td> */}
                  <td>{`${item.staff_fullname}`}</td>
                  <td>{item.internal_external}</td>
                  <td>{item.customer_name ?? '-'}</td>
                  <td>{item.client_code ?? '-'}</td>
                  <td>{item.job_name}</td>
                  <td>{item.task_name}</td>
                  <td>{item.monday_hours || "-"}</td>
                  <td>{item.tuesday_hours || "-"}</td>
                  <td>{item.wednesday_hours || "-"}</td>
                  <td>{item.thursday_hours || "-"}</td>
                  <td>{item.friday_hours || "-"}</td>
                  <td>{dayjs(item.created_at).format("DD-MM-YYYY")}</td>

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

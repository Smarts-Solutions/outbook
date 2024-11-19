import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTimesheetData, getTimesheetTaskTypedData } from "../../../ReduxStore/Slice/Timesheet/TimesheetSlice";

const Timesheet = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));

  const GetTimeSheet = async () => {
    const req = { staff_id: staffDetails.id };
    const res = await dispatch(getTimesheetData({ req, authToken: token })).unwrap();
    if (res.status) {
      setTimeSheetRows(res.data)
    } else {
      setTimeSheetRows([])
    }
  }

  useEffect(() => {
    GetTimeSheet()
  }, [])



  const TaskType = useRef("0")

  const [jobData, setJobData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [taskData, setTaskData] = useState([]);

  const [addtask, setAddtask] = useState(false);
  const [timeSheetRows, setTimeSheetRows] = useState([]);
  const [selectedTab, setSelectedTab] = useState("this-week");

   // Initial state for timeSheetRows
//    const [timeSheetRows, setTimeSheetRows] = useState([
//     {
//         task_type: '',       // Will store "1" for Internal or "2" for External
//         customer_id: '',      // Stores selected customer ID
//         customer_name: '',    // Stores customer name if task_type is "2"
//         client_id: '',        // Stores selected client ID
//         client_name: '',      // Stores client name if task_type is "2"
//         job_id: '',           // Stores selected job ID
//         job_name: '',         // Stores job name
//         internal_name: '',    // Stores internal job name if task_type is "1"
//         task_id: '',          // Stores selected task ID
//         task_name: '',        // Stores selected task name
//         newRow: 1,     // To enable or disable inputs based on newRow flag
//         customerData: [],     // Holds the data for customer dropdown
//         clientData: [],       // Holds the data for client dropdown
//         jobData: [],          // Holds the data for job dropdown
//         taskData: []          // Holds the data for task dropdown
//     }
// ]);

  // Function to handle dropdown change
  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };
  const handleAddNewSheet = () => {
    const newSheetRow = {
      task_type: null,
      customer_id: null,
      client_id: null,
      job_id: null,
      task_id: null,
      monday_hours: null,
      tuesday_hours: null,
      wednesday_hours: null,
      thursday_hours: null,
      friday_hours: null,
      saturday_hours: null,
      sunday_date: null,
      newRow: 1,
      customerData: [],     // Holds the data for customer dropdown
      clientData: [],       // Holds the data for client dropdown
      jobData: [],          // Holds the data for job dropdown
      taskData: []          // Holds the data for task dropdown
    };
    setJobData([]);
    setCustomerData([]);
    setClientData([]);
    setTaskData([]);
    setTimeSheetRows((prevRows) => [...prevRows, newSheetRow]);
  };


  const handleDeleteRow = (index) => {
    const newSheetRows = [...timeSheetRows];
    newSheetRows.splice(index, 1);
    setTimeSheetRows(newSheetRows);
  };

  const [openRows, setOpenRows] = useState([]); // Track which rows are open

  // Function to toggle rows open/close
  const toggleRow = (index) => {
    if (openRows.includes(index)) {
      setOpenRows(openRows.filter((i) => i !== index)); // Close if open
    } else {
      setOpenRows([...openRows, index]); // Open if closed
    }
  };

  // const handleChangeTaskType = async (e, item, index) => {

  //   const updatedRows = [...timeSheetRows];
  //   updatedRows[index] = {
  //     ...updatedRows[index],
  //     task_type: e.target.value
  //   };

  //   setTimeSheetRows(updatedRows);

  //   setJobData([]);
  //   setCustomerData([]);
  //   setClientData([]);
  //   setTaskData([]);
  //   if (e.target.value === "1") {
  //     const req = { staff_id: staffDetails.id, task_type: e.target.value };
  //     const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
  //     if (res.status) {
  //       setJobData(res.data)
  //     } else {
  //       setJobData([])
  //     }
  //   }
  //   else if (e.target.value === "2") {
  //     const req = { staff_id: staffDetails.id, task_type: e.target.value };
  //     const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
  //     if (res.status) {
  //       setCustomerData(res.data)
  //     } else {
  //       setCustomerData([])
  //     }

  //   }

  // }
  const handleChangeTaskType = async (e, item, index) => {
    const updatedRows = [...timeSheetRows];
    
    // Update task_type for the specific row
    updatedRows[index] = {
        ...updatedRows[index],
        task_type: e.target.value,
        jobData: [], // Reset dependent data fields
        customerData: [],
        clientData: [],
        taskData: []
    };

    setTimeSheetRows(updatedRows);

    // Fetch data based on task type
    if (e.target.value === "1") {
        const req = { staff_id: staffDetails.id, task_type: e.target.value };
        const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
        
        if (res.status) {
            updatedRows[index].jobData = res.data;
        }
    } else if (e.target.value === "2") {
        const req = { staff_id: staffDetails.id, task_type: e.target.value };
        const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
        
        if (res.status) {
            updatedRows[index].customerData = res.data;
        }
    }

    setTimeSheetRows([...updatedRows]); // Save changes
};



  const selectCustomerData = async (e, index) => {

    setJobData([]);
    setClientData([]);
    setTaskData([]);

    const req = { staff_id: staffDetails.id, task_type: "3", customer_id: e.target.value };
    const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
    if (res.status) {
      setClientData(res.data)
    } else {
      setClientData([])
    }
  }


  const selectClientData = async (e, index) => {

    setJobData([]);
    setTaskData([]);

    const req = { staff_id: staffDetails.id, task_type: "4", client_id: e.target.value };
    const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
    if (res.status) {
      setJobData(res.data)
    } else {
      setJobData([])
    }
  }

  const selectJobData = async (e, task_type, index) => {
    setTaskData([]);

    let req;
    if (task_type === "1") {
      req = { staff_id: staffDetails.id, task_type: "5", internal_id: e.target.value };
    }
    else if (task_type === "2") {
      req = { staff_id: staffDetails.id, task_type: "6", job_id: e.target.value };
    }

    if (req.staff_id != undefined) {
      const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
 
      if (res.status) {
        setTaskData(res.data)
      } else {
        setTaskData([])
      }
    }
  }

  const selectTaskData = async (e) => {
    console.log(e.target.value);
  }
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="content-title">
          <div className="row">
            <div className="col-md-8">
              <div className="tab-title">
                <h3 className="mt-0">Timesheet</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="report-data mt-4">
          <div className="col-md-4">
            <div className="form-group">
              {/* <label htmlFor="tabSelect">Filter:</label> */}
              <select
                className="form-select"
                id="tabSelect"
                value={selectedTab}
                onChange={handleTabChange}
              >
                <option >Select Options</option>
                <option value="this-week">This Week</option>
                <option value="last-week">Last Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="this-6-months">This 6 Months</option>
                <option value="last-6-months">Last 6 Months</option>
                <option value="this-year">This Year</option>
                <option value="last-year">Last Year</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="tab-content mt-5">
            {/* Render content based on selected tab */}
            {selectedTab === "this-week" && (
              <div className="tab-pane show active">
                <div id="customerList">
                  <div className="row">

                    <div className="table-responsive table-card  mb-1">
                      <table
                        className="timesheetTable table align-middle table-nowrap"
                        id="customerTable"
                      >
                        <thead className="table-light table-head-blue">
                          <tr>
                            <th className="dropdwnCol2" data-field="phone">
                              No
                            </th>
                            <th className="" data-field="phone" >
                              Task Type
                            </th>
                            <th className="dropdwnCol7" data-field="phone">
                              Customer
                            </th>
                            <th className="dropdwnCol6" data-field="phone">
                              Client
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                              Job
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                              Task
                            </th>
                            <th
                              className="dropdwnCol5"
                              data-field="customer_name"
                            >
                              Mon 12/02/2024
                            </th>
                            <th
                              className="dropdwnCol5"
                              data-field="customer_name"
                            >
                              Tue 13/02/2024
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                              Wed 14/02/2024
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                              Thu 15/02/2024
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                              Fri 16/02/2024
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                              Sat 17/02/2024
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                              Sun 18/02/2024
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody className="list form-check-all">
                          {timeSheetRows?.map((item, index) => (
                            <tr className="tabel_new">
                              <td>{index + 1}</td>
                              {/* <td >
                                {
                                  item.newRow != undefined && item.newRow === 1 ?
                                    <select className="form-select form-control"
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleChangeTaskType(e, item, index)}
                                    >
                                      <option value="1" selected={item.task_type === "1"}>Internal</option>
                                      <option value="2" selected={item.task_type === "2"}>External</option>
                                    </select>

                                    :

                                    <select disabled className="form-select form-control"
                                      style={{ width: '100px' }}
                                      onChange={(e) => handleChangeTaskType(e, item, index)}
                                    >
                                      <option value="1" selected={item.task_type === "1"}>Internal</option>
                                      <option value="2" selected={item.task_type === "2"}>External</option>
                                    </select>
                                }
                              </td>

                              <td >
                                {

                                  item.newRow != undefined && item.newRow === 1 ?
                                    item.task_type === "2" ?

                                      <select className="form-select"
                                        name="customerData" onChange={(e) => { selectCustomerData(e , index) }}
                                        style={{ width: '150px' }}
                                        defaultValue={customerData && customerData[0]?.id}
                                      >
                                        {customerData && customerData?.map((val, i) =>
                                          <option value={val.id}>{val.trading_name}</option>)}
                                      </select>
                                      :
                                      <input
                                        className="form-control cursor-pointer"
                                        style={{ width: '150px' }}
                                        disabled
                                        readOnly
                                        defaultValue={"No Customer"}
                                      />
                                    :

                                    item.task_type === "1" ?
                                      <input
                                        className="form-control cursor-pointer"
                                        style={{ width: '150px' }}
                                        disabled
                                        readOnly
                                        defaultValue={"No Customer"}
                                      />
                                      :
                                      <select disabled className="form-select" style={{ width: '150px' }}>
                                        <option value={item.customer_id}>{item.customer_name}</option>
                                      </select>
                                }

                              </td> */}

<td>
                {item.newRow === 1 ? (
                    <select
                        className="form-select form-control"
                        style={{ width: '100px' }}
                        value={item.task_type}
                        onChange={(e) => handleChangeTaskType(e, item, index)}
                    >
                        <option value="1">Internal</option>
                        <option value="2">External</option>
                    </select>
                ) : (
                    <select
                        className="form-select form-control"
                        style={{ width: '100px' }}
                        value={item.task_type}
                        disabled
                    >
                        <option value="1">Internal</option>
                        <option value="2">External</option>
                    </select>
                )}
            </td>

            {/* Customer Selection */}
            <td>
                {item.newRow === 1 && item.task_type === "2" ? (
                    <select
                        className="form-select"
                        style={{ width: '150px' }}
                        value={item.customer_id || ''}
                        onChange={(e) => selectCustomerData(e, index)}
                    >
                        {item.customerData?.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.trading_name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        className="form-control cursor-pointer"
                        style={{ width: '150px' }}
                        value={item.task_type === "1" ? "No Customer" : item.customer_name}
                        disabled
                    />
                )}
            </td>
                            
                              <td>

                                {

                                  item.newRow != undefined && item.newRow === 1 ?
                                    item.task_type === "2" ?

                                      <select className="form-select"
                                        name="clientData" onChange={(e) => { selectClientData(e, index) }}
                                        style={{ width: '150px' }}
                                        defaultValue={clientData && clientData[0]?.id}
                                      >
                                        {clientData && clientData?.map((val, i) =>
                                          <option value={val.id}>{val.trading_name}</option>)}
                                      </select>
                                      :
                                      <input
                                        className="form-control cursor-pointer"
                                        style={{ width: '150px' }}
                                        disabled
                                        readOnly
                                        defaultValue={"No Client"}
                                      />
                                    :

                                    item.task_type === "1" ?
                                      <input
                                        className="form-control cursor-pointer"
                                        style={{ width: '150px' }}
                                        disabled
                                        readOnly
                                        defaultValue={"No Client"}
                                      />
                                      :
                                      <select disabled className="form-select" style={{ width: '150px' }}>
                                        <option value={item.client_id}>{item.client_name}</option>
                                      </select>

                                }
                              </td>
                              <td>
                                {

                                  item.newRow != undefined && item.newRow === 1 ?
                                    <select className="form-select"
                                      name="jobData" onChange={(e) => { selectJobData(e, item.task_type, index) }}
                                      style={{ width: '120px' }}
                                      defaultValue={jobData && jobData[0]?.id}
                                    >
                                      {jobData && jobData?.map((val, i) =>
                                        <option value={val.id}>{val.name}</option>)}
                                    </select>
                                    :

                                    item.task_type === "1" ?
                                      <select disabled className="form-select" style={{ width: '150px' }}>
                                        <option value={item.internal_id}>{item.internal_name}</option>
                                      </select>
                                      :
                                      <select disabled className="form-select" style={{ width: '150px' }}>
                                        <option value={item.job_id}>{item.job_name}</option>
                                      </select>
                                }
                              </td>
                              <td>

                                {


                                  item.newRow != undefined && item.newRow === 1 ?
                                    <select className="form-select"
                                      name="taskData" onChange={(e) => { selectTaskData(e, index) }}
                                      style={{ width: '120px' }}
                                      defaultValue={taskData && taskData[0]?.id}
                                    >
                                      {taskData && taskData?.map((val, i) =>
                                        <option value={val.id}>{val.name}</option>)}
                                    </select>
                                    :

                                    item.task_type === "1" ?
                                      <select disabled className="form-select" style={{ width: '150px' }}>
                                        <option value={item.sub_internal_id}>{item.sub_internal_name}</option>
                                      </select>
                                      :
                                      <select disabled className="form-select" style={{ width: '150px' }}>
                                        <option value={item.task_id}>{item.task_name}</option>
                                      </select>
                                }

                              </td>
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                  disabled
                                  readOnly
                                  defaultValue={2}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                  disabled
                                  readOnly
                                  defaultValue={5}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                  disabled
                                  readOnly
                                  defaultValue={7}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                  disabled
                                  readOnly
                                  defaultValue={9}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                  disabled
                                  readOnly
                                  defaultValue={3}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                  disabled
                                  readOnly
                                  defaultValue={2}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                  disabled
                                  readOnly
                                  defaultValue={5}
                                />
                              </td>

                              <td className="d-flex">
                                <button
                                  className="edit-icon"
                                  onClick={() => {

                                    setAddtask(true);
                                  }}
                                >
                                  <i className="fa fa-pencil text-primary  "></i>
                                </button>
                                <button
                                  className="delete-icon"
                                  onClick={() => handleDeleteRow(index)}
                                >
                                  <i className="ti-trash text-danger  "></i>
                                </button>
                                {/* <Trash2 className="delete-icon" /> */}

                              </td>
                            </tr>
                          ))}
                          <tr className="tabel_new">
                            <td>
                              <button
                                className="d-flex btn btn-info fw-normal px-2"
                                onClick={handleAddNewSheet}
                              >
                                <i
                                  style={{
                                    display: "block",
                                    fontSize: 18,
                                    cursor: "pointer",
                                  }}
                                  className="ri-add-circle-fill"
                                />
                              </button>
                            </td>
                            <td colSpan={12}></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "last-week" && (
              <div>This Last week content...</div>
            )}

            {selectedTab === "this-month" && (
              <div>This month's content...</div>
            )}
            {selectedTab === "last-month" && (
              <div>Last month's content...</div>
            )}
            {selectedTab === "last-quarter" && (
              <div>Last quarter's content...</div>
            )}
            {selectedTab === "this-6-months" && (
              <div>This 6 months' content...</div>
            )}
            {selectedTab === "last-6-months" && (
              <div>Last 6 months' content...</div>
            )}
            {selectedTab === "this-year" && (
              <div>This year's content...</div>
            )}
            {selectedTab === "last-year" && (
              <div>Last year's content...</div>
            )}
            {selectedTab === "custom" && <div>Custom content...</div>}
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-info">
              <i className="fa fa-check"></i> save
            </button>
            <button className="btn btn-outline-success ms-3">
              <i className="far fa-save"></i> submit
            </button>
          </div>





          <CommonModal
            isOpen={addtask}
            backdrop="static"
            size="lg"
            cancel_btn={false}
            btn_2="true"
            btn_name="Save"
            title="Task"
            hideBtn={false}
            handleClose={() => {
              setAddtask(false);
            }}
          >
            <div className="modal-body">
              <div className="row">


                <div className="col-lg-12">
                  <label htmlFor="customername-field" className="form-label">
                    Remark
                  </label>
                  <textarea
                    className="form-control cursor-pointer"
                    // placeholder="Remark"
                    defaultValue=""
                  />
                </div>
              </div>
            </div>
          </CommonModal>
        </div>
      </div>
    </div>
  );
};

export default Timesheet;

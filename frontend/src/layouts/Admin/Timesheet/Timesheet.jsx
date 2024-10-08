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
  const handleAddNewSheet = async () => {
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
    // setTimeSheetRows((prevRows) => [...prevRows, newSheetRow]);

    setTimeSheetRows((prevRows) => {
      const updatedRows = [...prevRows, newSheetRow];
      const newIndex = updatedRows.length - 1; // Index of the newly added row
      updatedRows[newIndex].task_type = "1";
      setTimeSheetRows(updatedRows);
      return updatedRows;
    });

    let req = { staff_id: staffDetails.id, task_type: "1" };
    const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();

    if (res.status) {

      let req = { staff_id: staffDetails.id, task_type: "5", internal_id: res.data[0].id };
      const res1 = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
      setTimeSheetRows((prevRows) => {
        const updatedRows = [...prevRows];
        const newIndex = updatedRows.length - 1;
        updatedRows[newIndex].task_type = "1";
        updatedRows[newIndex].jobData = res.data;
        updatedRows[newIndex].job_id = res.data[0].id;
        updatedRows[newIndex].taskData = res1.data;
        updatedRows[newIndex].task_id = res1.data[0].id;
        return updatedRows;
      });
    } else {
      // Handle the error case as needed
      console.log("API call failed:", res);
    }



  };

  console.log("setTimeSheetRows", timeSheetRows)

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


  const handleChangeTaskType = async (e, item, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index] = {
      ...updatedRows[index],
      task_type: e.target.value,
      jobData: [],
      customerData: [],
      clientData: [],
      taskData: []
    };

    setTimeSheetRows(updatedRows);

    if (e.target.value === "1") {
      const req = { staff_id: staffDetails.id, task_type: e.target.value };
      const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();

      if (res.status) {
        let req = { staff_id: staffDetails.id, task_type: "5", internal_id: res.data[0].id };
        const res1 = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
        updatedRows[index].jobData = res.data;
        updatedRows[index].job_id = res.data[0].id;
        updatedRows[index].taskData = res1.data;
        updatedRows[index].task_id = res1.data[0].id;
      }
    } else if (e.target.value === "2") {
      updatedRows[index].jobData = [];
      updatedRows[index].job_id = null;
      updatedRows[index].taskData = [];
      updatedRows[index].task_id = null;
      const req = { staff_id: staffDetails.id, task_type: e.target.value };
      const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
      if (res.status) {
        if (res.data.length > 0) {
          updatedRows[index].customerData = res.data;
          updatedRows[index].customer_id = res.data[0].id;
        }
      }
    }
    setTimeSheetRows([...updatedRows]); // Save changes
  };



  const selectCustomerData = async (e, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].jobData = [];
    updatedRows[index].clientData = [];
    updatedRows[index].taskData = [];

    const req = { staff_id: staffDetails.id, task_type: "3", customer_id: e.target.value };
    const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();

    if (res.status) {
      if (res.data.length > 0) {
        updatedRows[index].customer_id = e.target.value;
        updatedRows[index].clientData = res.data;
        updatedRows[index].client_id = res.data[0].id;

      }
    }
    setTimeSheetRows(updatedRows);
  };

  const selectClientData = async (e, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].jobData = [];
    updatedRows[index].taskData = [];

    const req = { staff_id: staffDetails.id, task_type: "4", client_id: e.target.value };
    const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
    if (res.status) {
      if (res.data.length > 0) {
        updatedRows[index].client_id = e.target.value;
        updatedRows[index].jobData = res.data;
        updatedRows[index].job_id = res.data[0].id;
        let req;
        if (updatedRows[index].task_type === "1") {
          req = { staff_id: staffDetails.id, task_type: "5", internal_id: res.data[0].id };
        } else if (updatedRows[index].task_type === "2") {
          req = { staff_id: staffDetails.id, task_type: "6", job_id: res.data[0].id };
        }
        if (req.staff_id != undefined) {
          const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
          if (res.status) {
            if (res.data.length > 0) {
              updatedRows[index].taskData = res.data;
              updatedRows[index].task_id = res.data[0].id;
            }
          }
        }
      }
    }
    setTimeSheetRows(updatedRows);
  };

  const selectJobData = async (e, task_type, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].taskData = [];
    let req;
    if (task_type === "1") {
      req = { staff_id: staffDetails.id, task_type: "5", internal_id: e.target.value };
    } else if (task_type === "2") {
      req = { staff_id: staffDetails.id, task_type: "6", job_id: e.target.value };
    }
    if (req.staff_id != undefined) {
      const res = await dispatch(getTimesheetTaskTypedData({ req, authToken: token })).unwrap();
      if (res.status) {
        if (res.data.length > 0) {
          updatedRows[index].job_id = e.target.value;
          updatedRows[index].taskData = res.data;
          updatedRows[index].task_id = res.data[0].id;
        }
      }
    }
    setTimeSheetRows(updatedRows);
  };

  const selectTaskData = async (e, index) => {
    const updatedRows = [...timeSheetRows];
    updatedRows[index].task_id = e.target.value;
    setTimeSheetRows(updatedRows);

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
                className="form-control"
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
                                    defaultValue={item.customer_id || ''}
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
                                    defaultValue={item.task_type === "1" ? "No Customer" : item.customer_name}
                                    disabled
                                  />
                                )}
                              </td>

                              {/* Client Selection */}
                              <td>
                                {item.newRow === 1 && item.task_type === "2" ? (
                                  <select
                                    className="form-select"
                                    style={{ width: '150px' }}
                                    defaultValue={item.client_id || ''}
                                    onChange={(e) => selectClientData(e, index)}
                                  >
                                    {item.clientData?.map((client) => (
                                      <option key={client.id} value={client.id}>
                                        {client.trading_name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    className="form-control cursor-pointer"
                                    style={{ width: '150px' }}
                                    defaultValue={item.task_type === "1" ? "No Client" : item.client_name}
                                    disabled
                                  />
                                )}
                              </td>

                              {/* Job Selection */}
                              <td>
                                {item.newRow === 1 ? (
                                  <select
                                    className="form-select"
                                    style={{ width: '150px' }}
                                    defaultValue={item.job_id || ''}
                                    onChange={(e) => selectJobData(e, item.task_type, index)}
                                  >
                                    {item.jobData?.map((job) => (
                                      <option key={job.id} value={job.id}>
                                        {job.name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    className="form-control cursor-pointer"
                                    style={{ width: '150px' }}
                                    defaultValue={item.task_type === "1" ? item.internal_name : item.job_name}
                                    disabled
                                  />
                                )}
                              </td>

                              {/* Task Selection */}
                              <td>
                                {item.newRow === 1 ? (
                                  <select
                                    className="form-select"
                                    style={{ width: '150px' }}
                                    defaultValue={item.task_id || ''}
                                    onChange={(e) => selectTaskData(e, index)}
                                  >
                                    {item.taskData?.map((task) => (
                                      <option key={task.id} value={task.id}>
                                        {task.name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    className="form-control cursor-pointer"
                                    style={{ width: '150px' }}
                                    defaultValue={item.task_name || ''}
                                    disabled
                                  />
                                )}
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

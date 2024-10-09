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

  const [currentDay, setCurrentDay] = useState('');

  const [weekDays, setWeekDays] = useState({
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });

  useEffect(() => {
    GetTimeSheet();

    // set day wise Input
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todays = new Date().getDay();
    setCurrentDay(days[todays]);
  
    // set date in table heading wise Input
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const startOfWeek = new Date(today);

    if (dayOfWeek === 0) {
      startOfWeek.setDate(today.getDate() - 6);
    } else {
      startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
    }

    setWeekDays({
      monday: formatDate(new Date(startOfWeek)),
      tuesday: formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))),
      wednesday: formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))),
      thursday: formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))),
      friday: formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))),
      saturday: formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))),
      sunday: formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1))),
    });


  }, [])

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',  // Mon, Tue, etc.
      day: '2-digit',    // 01, 02, etc.
      month: '2-digit',  // 01, 02, etc.
      year: 'numeric',   // 2024, etc.
    });
  };

  console.log("currentDay", currentDay);
  // 2024-10-09

  const [addtask, setAddtask] = useState(false);
  const [timeSheetRows, setTimeSheetRows] = useState([]);
  const [selectedTab, setSelectedTab] = useState("this-week");


  // Function to handle dropdown change
  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };
  const handleAddNewSheet = async () => {

    if (timeSheetRows.length > 0) {
      const lastObject = timeSheetRows[timeSheetRows.length - 1];
      if (lastObject.task_id == null) {
        alert("Please select the Task")
        return
      }
    }

    const newSheetRow = {
      task_type: null,
      customer_id: null,
      client_id: null,
      job_id: null,
      task_id: null,
      monday_date: null,
      monday_hours: null,
      tuesday_date: null,
      tuesday_hours: null,
      wednesday_date: null,
      wednesday_hours: null,
      thursday_date: null,
      thursday_hours: null,
      friday_date: null,
      friday_hours: null,
      saturday_date: null,
      saturday_hours: null,
      sunday_date: null,
      sunday_hours: null,
      newRow: 1,
      customerData: [],     // Holds the data for customer dropdown
      clientData: [],       // Holds the data for client dropdown
      jobData: [],          // Holds the data for job dropdown
      taskData: []          // Holds the data for task dropdown
    };

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

  const handleHoursInput = async (e, index , day_name , date_value) => {
    console.log("day_name ",day_name)
    console.log("date_value ",date_value)
    let value = e.target.value;
    let name = e.target.name;
    const updatedRows = [...timeSheetRows]
    if(updatedRows[index][name]  == null){
      updatedRows[index][name] = ""
      setTimeSheetRows(updatedRows);
    }
    // if (!/^[0-9.]*$/.test(value)) {
    //   return;
    // }
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }
    // const updatedRows = [...timeSheetRows]
    updatedRows[index][name] = value;
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
                            {weekDays.monday.replace(",", "")}
                            </th>
                            <th
                              className="dropdwnCol5"
                              data-field="customer_name"
                            >
                            {weekDays.tuesday.replace(",", "")}
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                            {weekDays.wednesday.replace(",", "")}
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                            {weekDays.thursday.replace(",", "")}
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                            {weekDays.friday.replace(",", "")}
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                            {weekDays.saturday.replace(",", "")}
                            </th>
                            <th className="dropdwnCol5" data-field="phone">
                            {weekDays.sunday.replace(",", "")}
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
                                    defaultValue={item.task_type === "1" ? item.sub_internal_name : item.task_name}
                                    disabled
                                  />
                                )}
                              </td>

                              {/*Monday Input*/}
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                  type="text"
                                  name="monday_hours"
                                  disabled={currentDay !== 'monday'}
                                />
                              </td>

                              {/*Tuesday Input*/}
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                   type="text"
                                  name="tuesday_hours"
                                  disabled={currentDay !== 'tuesday'}
                                />
                              </td>

                              {/*Wednesday Input*/}
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                  type="text"
                                  name="wednesday_hours"
                                  onChange={(e) => handleHoursInput(e, index , 'wednesday_date' , weekDays.monday)}
                                  value={item.wednesday_hours}
                                  disabled={currentDay !== 'wednesday'}
                                />
                              </td>

                              {/*Thursday Input*/}
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                   type="text"
                                  name="thursday_hours"
                                  disabled={currentDay !== 'thursday'}
                                />
                              </td>

                              {/*Friday Input*/}
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                   type="text"
                                  name="friday_hours"
                                  disabled={currentDay !== 'friday'}
                                />
                              </td>

                              {/*Saturday Input*/}
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                   type="text"
                                  name="saturday_hours"
                                  disabled={currentDay !== 'saturday'}
                                />
                              </td>

                              {/*Sunday Input*/}
                              <td>
                                <input
                                  className="form-control cursor-pointer"
                                   type="text"
                                  name="sunday_hours"
                                  disabled={currentDay !== 'sunday'}
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

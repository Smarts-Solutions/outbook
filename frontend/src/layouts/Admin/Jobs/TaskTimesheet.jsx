import React, { useEffect, useState } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllTaskTimeSheet, JobTimeSheetAction } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from 'sweetalert2';


const TaskTimesheet = ({ getAccessDataJob }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const location = useLocation();
  const dispatch = useDispatch();
  const [addjobtimesheet, setAddjobtimesheet] = useState(false);
  const [addtask, setAddtask] = useState(false);
  const [viewtimesheet, setViewtimesheet] = useState(false);
  const [taskTimeData, setTaskTimeData] = useState([]);
  const [jobTimeData, setJobTimeData] = useState([]);
  const [TotalTime, setTotalTime] = useState({ hours: 0, minutes: 0 })
  const [getRowData, setRowData] = useState({})
  const [getMasterStatusArr, setMasterStatusDataArr] = useState([])
  const [TaskStatus, setTaskStatus] = useState('')
  const [BudgetedTime, setBudgetedTime] = useState({ hours: 0, minutes: 0 })
  const [GetTimeSheetTotalHours, setTimeSheetTotalHours] = useState({ hours: 0, minutes: 0 })
  const [GetTimeSheetStatus, setTimeSheetStatus] = useState('')
  const [error, setError] = useState({})
  const [error1, setError1] = useState({})



  useEffect(() => {
    GetAllTaskTimeSheetData()
  }, [])

  useEffect(() => {
    getMasterStatusData()
    if (getRowData && getRowData.time) {
      const time = getRowData.time.split(":")
      setTotalTime({ hours: time[0], minutes: time[1] })
      setTaskStatus(getRowData.task_status)
    }
  }, [getRowData])

  useEffect(() => {
    if (jobTimeData?.length > 0) {
      const budgeted = jobTimeData[0]?.budgeted_hours?.split(":")
      const time = jobTimeData[0]?.total_hours ? jobTimeData[0].total_hours.split(":") : ["00", "00"];
      setBudgetedTime({ hours: budgeted[0], minutes: budgeted[1] })
      setTimeSheetTotalHours({ hours: time[0], minutes: time[1] })
      setTimeSheetStatus(jobTimeData[0]?.total_hours_status)
    }
  }, [jobTimeData, addjobtimesheet])



  const GetAllTaskTimeSheetData = async () => {
    const req = { action: "get", job_id: location.state.job_id }
    const data = { req: req, authToken: token }
    await dispatch(getAllTaskTimeSheet(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setTaskTimeData(response.data || [])
        }
        else {
          setTaskTimeData([])
        }
      })
      .catch((error) => {
        return;
      })
  }

  const handleTimeSheetView = async (job_id) => {
    const req = { action: "get", job_id: job_id }
    const data = { req: req, authToken: token }
    await dispatch(JobTimeSheetAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setJobTimeData(response.data || [])
        }
        else {
          setJobTimeData([])
        }
      })
      .catch((error) => {
        return;
      })
  }

  const getMasterStatusData = async () => {
    const req = { action: "get" }
    const data = { req: req, authToken: token }
    await dispatch(MasterStatusData(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setMasterStatusDataArr(response.data || [])
        }
        else {
          setMasterStatusDataArr([])
        }
      })
      .catch((error) => {
        return;
      })
  }

  const handleSubmit = async (type) => {
    let req = {}
    if (type === "AddTimesheet" && !validateAllfields()) {
      return
    }
    else if (type === "TimeSheet" && !validateAllfiledsOfTimeSheet()) {
      return
    }

    if (type === "AddTimesheet") {
      req = {
        action: "updateJobTimeTotalHours",
        job_id: location.state.job_id,
        total_hours: GetTimeSheetTotalHours.hours + ":" + GetTimeSheetTotalHours.minutes,
        total_hours_status: GetTimeSheetStatus,
      }
    }
    else {
      req = {
        action: "updateTaskTimeSheetStatus",
        id: getRowData?.id,
        time: TotalTime.hours + ":" + TotalTime.minutes,
        task_status: Number(TaskStatus)
      }
    }
    const data = { req: req, authToken: token }
    await dispatch(JobTimeSheetAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          GetAllTaskTimeSheetData()
          sweatalert.fire({
            icon: 'success',
            title: response.message,
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 1500
          })
          setTimeout(() => {
            setViewtimesheet(false)
            setAddjobtimesheet(false)

          }, 1500)
        }
        else {
          sweatalert.fire({
            icon: 'error',
            title: response.message,
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 1500
          })
        }
      })
      .catch((error) => {
        return;
      })

  }

  const columns = [
    {
      name: "Task Name",
      selector: (row) => row.task_name || '-',
      sortable: true,
    },
    {
      name: "Service Type",
      selector: (row) => row.service_name || '-',
      sortable: true
    },
    {
      name: "Job Type",
      selector: (row) => row.job_type_type || '-',
      sortable: true,
    },
    {
      name: "Task Status",
      selector: (row) => row.task_status_name || '-',
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => row.time ? row.time.split(":")[0] + "h " + row.time.split(":")[1] + "m" : '-',
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          {
            (getAccessDataJob.update === 1 || role === "ADMIN" || role === "SUPERADMIN") && (
              <button className="view-icon" onClick={() => { handleTimeSheetView(location.state.job_id); setRowData(row); setViewtimesheet(true) }}>
                <i className="fa fa-eye fs-6 text-warning" />
              </button>)
          }

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    const isMinutesValid = (value === '' || (Number(value) >= 0 && Number(value) <= 59));

    validate(name, value);

    switch (name) {
      case 'totalHours':
        setTimeSheetTotalHours((prev) => ({ ...prev, hours: value }));
        break;
      case 'totalMinutes':
        if (isMinutesValid) {
          setTimeSheetTotalHours((prev) => ({ ...prev, minutes: value }));
        }
        break;
      case 'budgetedHours':
        setBudgetedTime((prev) => ({ ...prev, hours: value }));
        break;
      case 'budgetedMinutes':
        if (isMinutesValid) {
          setBudgetedTime((prev) => ({ ...prev, minutes: value }));
        }
        break;
      case 'status':
        setTimeSheetStatus(value);
        break;
      default:
        break;
    }

  };

  const handleChangeTimeSheet = (e) => {
    const { name, value } = e.target;
    const isMinutesValid = (value === '' || (Number(value) >= 0 && Number(value) <= 59));
    validateTimeSheet(name, value);
    switch (name) {
      case 'TotalHours':
        setTotalTime((prev) => ({ ...prev, hours: value }));
        break;
      case 'TotalMinutes':
        if (isMinutesValid) {
          setTotalTime((prev) => ({ ...prev, minutes: value }));
        }
        break;
      case 'status':
        setTaskStatus(value);
        break;
      default:
        break;
    }
  };

  const validateTimeSheet = (name, value) => {
    let errors = { ...error1 };
    if (!value && name !== 'TotalHours' && name !== 'TotalMinutes') {
      errors[name] = "This field is required";
    }
    else if ((name === 'TotalHours' && value == 0)) {
      errors[name] = "This field is required";
    }
    else {
      delete errors[name];
      setError1((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
    if (Object.keys(errors).length !== 0) {
      setError1((prevErrors) => ({
        ...prevErrors,
        ...errors,
      }));
    }
    return Object.keys(errors).length === 0;
  }

  const validateAllfiledsOfTimeSheet = () => {
    let valid = true;
    if (!TotalTime.hours && !TotalTime.minutes) {
      valid = false;
      setError1((prevErrors) => ({
        ...prevErrors,

        TotalHours: "This field is required",
        TotalMinutes: "This field is required",
      }));
    }
    if (!TaskStatus) {
      valid = false;
      setError1((prevErrors) => ({
        ...prevErrors,
        status: "This field is required",
      }));
    }
    return valid;
  }



  const validate = (name, value) => {
    let errors = { ...error };
    if (!value && name !== 'budgetedHours' && name !== 'budgetedMinutes') {
      errors[name] = "This field is required";
    }
    else if ((name === 'totalHours' && value == 0)) {
      errors[name] = "This field is required";
    }
    else {
      delete errors[name];
      setError((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
    if (Object.keys(errors).length !== 0) {
      setError((prevErrors) => ({
        ...prevErrors,
        ...errors,
      }));
    }
    return Object.keys(errors).length === 0;
  }

  const validateAllfields = () => {
    let valid = true;
    if (!GetTimeSheetTotalHours.hours && !GetTimeSheetTotalHours.minutes) {
      valid = false;
      setError((prevErrors) => ({
        ...prevErrors,
        totalHours: "This field is required",
        totalMinutes: "This field is required",
      }));
    }
    if (!GetTimeSheetStatus) {
      valid = false;
      setError((prevErrors) => ({
        ...prevErrors,
        status: "This field is required",
      }));
    }
    return valid;
  }


  return (
    <>
      <div className="">
        <div className="row">
          <div className="col-md-8">
            <div className="tab-title">
              <h3>Task Timesheet</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              {
                (getAccessDataJob.insert === 1 || role === "ADMIN" || role === "SUPERADMIN") && (
                  <button type="button"
                    onClick={() => { handleTimeSheetView(location.state.job_id); setAddjobtimesheet(true) }}
                    className="btn btn-info text-white float-end ms-2">
                    <i className="fa fa-plus pe-1"></i> Job Timesheet
                  </button>
                )
              }

              {/* <button
                type="button"
                onClick={() => { setAddtask(true) }}
                className="btn btn-info text-white float-end"
              >
                <i className="fa-regular fa-plus pe-1"></i> Add
              </button> */}
            </div>
          </div>
        </div>

        <div className="datatable-wrapper">
          <Datatable filter={true} columns={columns} data={taskTimeData} />
        </div>
      </div>
      <CommonModal
        isOpen={addjobtimesheet}
        backdrop="static"
        size="ms-5"
        title="Add Timesheet"
        cancel_btn='true'
        btn_name="Save"
        hideBtn={false}
        handleClose={() => {
          setAddjobtimesheet(false);
          setBudgetedTime({ hours: 0, minutes: 0 })
          setTimeSheetTotalHours({ hours: 0, minutes: 0 })
          setTimeSheetStatus('')
          setError({})
        }}
        Submit_Cancel_Function={() => {
          setAddjobtimesheet(false);
          setBudgetedTime({ hours: 0, minutes: 0 })
          setTimeSheetTotalHours({ hours: 0, minutes: 0 })
          setTimeSheetStatus('')
          setError({})
        }}
        Submit_Function={() => handleSubmit("AddTimesheet")}
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="mb-3">
              <label className="form-label">Budgeted Hours</label>
              <div className="input-group">
                <div className="hours-div w-100">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Hours"
                    id="budgetedHours"
                    name="budgetedHours"
                    defaultValue=""
                    disabled
                    onChange={(e) => handleChange(e)}
                    value={BudgetedTime.hours}
                  />
                  <span className="input-group-text">H</span>
                </div>
                <div className="hours-div w-100">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Minutes"
                    defaultValue=""
                    id="budgetedMinutes"
                    name="budgetedMinutes"
                    disabled
                    onChange={(e) => handleChange(e)}
                    value={BudgetedTime.minutes}
                  />
                  <span className="input-group-text">M</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label className="form-label">Tolal Hours</label>
              <div className="input-group">
                <div className="hours-div w-100">
                  <input
                    type="text"
                    className={error['totalHours'] ? "error-field form-control" : "form-control"}
                    placeholder="Hours"
                    defaultValue=""
                    id="totalHours"
                    name="totalHours"
                    autoFocus
                    onChange={(e) => handleChange(e)}
                    value={GetTimeSheetTotalHours.hours}
                  />
                  <span className="input-group-text">H</span>
                </div>
                <div className="hours-div w-100">
                  <input
                    type="text"
                    className={error['totalMinutes'] ? "error-field form-control" : "form-control"}
                    placeholder="Minutes"
                    defaultValue=""
                    id="totalMinutes"
                    name="totalMinutes"
                    onChange={(e) => handleChange(e)}
                    value={GetTimeSheetTotalHours.minutes}
                  />
                  <span className="input-group-text">M</span>
                </div>

              </div>
              {error['totalHours'] ? <div className="error-text">{error['totalHours']}</div> :
                <div className="error-text">{error['totalMinutes']}</div>
              }
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className={error['status'] ? "error-field form-select" : "form-select"}
                // className="form-select"
                id="status"
                name="status"
                onChange={(e) => handleChange(e)}
                value={GetTimeSheetStatus}
              >
                <option value={''}>Select Status</option>
                <option value={'1'}>Active</option>
                <option value={'0'}>Deactive</option>
              </select>
              {error['status'] && <div className="error-text">{error['status']}</div>}
            </div>
          </div>
        </div>
      </CommonModal>

      <CommonModal
        isOpen={addtask}
        backdrop="static"
        size="lg"
        title="Add Task"
        hideBtn={true}
        handleClose={() => {
          setAddtask(false);
          // formik.resetForm();
        }}
      >
        <div className="row">
          <div className="col-lg-8">
            <div className="mb-3">
              <select className="form-select">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
                <option>Option 4</option>
              </select>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="mb-3">
              <button className="btn btn-secondary">
                <i className="fa fa-plus pe-1"></i>Add Task
              </button>
            </div>
          </div>

          <div className="col-lg-6 ">
            <div id="customerList" className="card">
              <div className="table-responsive table-card">
                <table
                  className="table align-middle table-nowrap mb-0"
                  id="customerTable"
                >
                  <thead className="table-light table-head-blue">
                    <tr>
                      <th className="" data-="status">
                        Task Name
                      </th>
                      <th className="" data-="status">
                        Budgeted Hour
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    <tr className="">
                      <td>Task 1 </td>
                      <td>10 hr</td>
                      <td>
                        <div className="add">
                          <button
                            className="btn btn-sm  add-item-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#addRecordModal"
                          >
                            <i className="fa fa-plus text-success" />
                            {/* Change the icon class to your desired plus icon */}
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="">
                      <td>Task 2 </td>
                      <td>10 hr</td>
                      <td>
                        <div className="add">
                          <button
                            className="btn btn-sm  add-item-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#addRecordModal"
                          >
                            <i className="fa fa-plus text-success" />
                            {/* Change the icon class to your desired plus icon */}
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="">
                      <td>Task 3 </td>
                      <td>10 hr</td>
                      <td>
                        <div className="add">
                          <button
                            className="btn btn-sm  add-item-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#addRecordModal"
                          >
                            <i className="fa fa-plus text-success" />
                            {/* Change the icon class to your desired plus icon */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-6 ">
            <div id="customerList" className="card">
              <div className="table-responsive table-card ">
                <table
                  className="table align-middle table-nowrap mb-0"
                  id="customerTable"
                >
                  <thead className="table-light table-head-blue">
                    <tr>
                      <th className="" data-="status">
                        Task Name
                      </th>
                      <th className="" data-="status">
                        Budgeted Hour
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    <tr className="">
                      <td>Task 1 </td>
                      <td>10 hr </td>
                      <td>
                        <div className="remove">
                          <button
                            className="btn "
                            data-bs-toggle="modal"
                            data-bs-target="#deleteRecordModal"
                          >
                            <i className="ti-trash text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </CommonModal>

      <CommonModal
        isOpen={viewtimesheet}
        backdrop="static"
        size="md"
        title="Time Sheet"
        cancel_btn='true'
        btn_name="Save"
        hideBtn={false}
        handleClose={() => {
          setViewtimesheet(false);
          setRowData({})
          setTotalTime({ hours: 0, minutes: 0 })
          setTaskStatus('')
          setError1({})
        }}
        Submit_Cancel_Function={() => {
          setViewtimesheet(false);
          setRowData({})
          setTotalTime({ hours: 0, minutes: 0 })
          setTaskStatus('')
          setError1({})

        }}

        Submit_Function={() => handleSubmit("TimeSheet")}
      >
        <div className="row">
          <div className="col-md-12">
            <div className="card-body">
              {/* <div className="row">
                <div className="col-md-4">
                  <label htmlFor="customername-field" className="form-label">
                    Job Name
                  </label>
                </div>
                <div className="col-md-8">
                  <span className="text-muted">Year End Accounting</span>
                </div>
              </div> */}
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="customername-field" className="form-label">
                    Job ID
                  </label>
                </div>
                <div className="col-md-8">

                  <span className="text-muted">{jobTimeData && jobTimeData[0] && jobTimeData[0].job_code_id}</span>
                </div>
              </div>

            </div>
          </div>
          <div className="col-md-12 ">
            <div className="mb-4 mt-3">
              <div className="">
                <div className="">
                  <div className="col-lg-12">
                    <label htmlFor="firstNameinput" className="form-label">
                      Total Time
                    </label>
                    <div className="row">
                      <div className="col-md-6 pe-0">
                        <div className="input-group">
                          <div className="hours-div w-100">
                            <input
                              type="text"
                              className={error1['TotalHours'] ? "error-field form-control" : "form-control"}

                              aria-label="Recipient's username"
                              aria-describedby="basic-addon2"
                              id="TotalHours"
                              name="TotalHours"
                              onChange={(e) => handleChangeTimeSheet(e)}
                              value={TotalTime.hours}
                              placeholder="Hours"
                            />
                            <span className="input-group-text" id="basic-addon2">
                              H
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 ps-0">
                        <div className="input-group">
                          <div className="hours-div w-100">
                            <input
                              type="text"
                              className={error1['TotalMinutes'] ? "error-field form-control" : "form-control"}

                              aria-label="Recipient's username"
                              aria-describedby="basic-addon2"
                              placeholder="Minutes"
                              id="TotalMinutes"
                              name="TotalMinutes"
                              onChange={(e) => handleChangeTimeSheet(e)}
                              value={TotalTime.minutes}
                            />
                            <span className="input-group-text" id="basic-addon2">
                              M
                            </span>
                          </div>
                        </div>
                      </div>
                      {error1['TotalHours'] ? <div className="error-text ps-3">{error1['TotalHours']}</div> :
                        <div className="error-text ps-2">{error1['TotalMinutes']}</div>
                      }
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mt-3">
                      <label htmlFor="status-field" className="form-label">
                        Task Status
                      </label>
                      <select

                        className={error1['status'] ? "error-field form-select" : "form-select"}

                        data-trigger=""
                        name="status"
                        id="status"
                        onChange={(e) => handleChangeTimeSheet(e)}
                        value={TaskStatus}
                      >

                        <option value=""> Select Status</option>
                        {getMasterStatusArr && getMasterStatusArr.map((item) => {
                          return (
                            <option value={item.id} key={item.id}>
                              {item.name}
                            </option>
                          );
                        })}

                      </select>
                      {error1['status'] && <div className="error-text">{error1['status']}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </CommonModal>
    </>
  );
};

export default TaskTimesheet;

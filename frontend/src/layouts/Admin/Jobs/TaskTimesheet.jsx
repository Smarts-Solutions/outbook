import React, { useEffect, useState } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllTaskTimeSheet, JobTimeSheetAction  } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from 'sweetalert2';


const TaskTimesheet = () => {
  const token = JSON.parse(localStorage.getItem("token"));
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
 

  useEffect(() => {
    GetAllTaskTimeSheetData()
  }, [])

  useEffect(() => {
    getMasterStatusData()
    if(getRowData && getRowData.time){
      const time = getRowData.time.split(":")
      setTotalTime({hours:time[0],minutes:time[1]})
      setTaskStatus(getRowData.task_status)
    }
  }, [getRowData])

   

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
        console.log("error", error)
      })
  }

  const handleTimeSheetView = async (row) => {
    setRowData(row)
    const req = { action: "get", job_id: row.job_id }
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
        console.log("error", error)
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
        console.log("error", error)
      })
  }

  const handleSubmit = async () => {
    const req = {
      action: "updateTaskTimeSheetStatus",
      id: getRowData?.id,
      time: TotalTime.hours + ":" + TotalTime.minutes,
      task_status: Number(TaskStatus)
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
        console.log("error", error)
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
      selector: (row) => row.time ? row.time.split(":")[0]+"h "+row.time.split(":")[1]+"m"  : '-' ,
      sortable: true,
    },

    
   

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => { handleTimeSheetView(row); setViewtimesheet(true) }}>
            <i className="fa fa-eye fs-6 text-secondary" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


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
              <button
                type="button"
                onClick={() => setAddjobtimesheet(true)}
                className="btn btn-info text-white float-end ms-2"
              >
                <i className="fa fa-plus pe-1"></i> Job Timesheet
              </button>
              {/* <button
                type="button"
                onClick={() => setAddtask(true)}
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
        hideBtn={true}
        handleClose={() => {
          setAddjobtimesheet(false);
          // formik.resetForm();
        }}
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="mb-3">
              <label className="form-label">Budgeted Hours</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hours"
                  defaultValue=""
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Minutes"
                  defaultValue=""
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label className="form-label">Tolal Hours</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hours"
                  defaultValue=""
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Minutes"
                  defaultValue=""
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select className="form-select">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
                <option>Option 4</option>
              </select>
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
        title="View Timesheet"
        cancel_btn='true'
        btn_name="Save"
        hideBtn={false}
        handleClose={() => {
          setViewtimesheet(false);

        }}

        Submit_Function={handleSubmit}
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
              {/* <div className="row">
                <div className="col-md-4">
                  <label htmlFor="customername-field" className="form-label">
                    Message
                  </label>
                </div>
                <div className="col-md-8">
                  <span className="text-muted">
                    This Task is Completed on 31st March 2023 by Nirav Patel
                  </span>
                </div>
              </div> */}
            </div>
          </div>
          <div className="col-md-12 ">
            <div className="mb-4 mt-3">
              <div className="card">
                <div className="card-body">
                  <div className="col-lg-12">
                    <label htmlFor="firstNameinput" className="form-label">
                      Total Time
                    </label>

                    <div className="row">
                      <div className="col-md-6 pe-0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            onChange={(e) => setTotalTime({ ...TotalTime, hours: e.target.value })}
                            value={TotalTime.hours}
                            placeholder="Hours"
                          />
                          <span className="input-group-text" id="basic-addon2">
                            Hours
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6 ps-0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"

                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            placeholder="Minutes"
                           onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || (Number(value) >= 0 && Number(value) <= 59)) {
                              setTotalTime({ ...TotalTime, minutes: e.target.value });
                            }
                            }}

                            value={TotalTime.minutes}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            Minutes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mt-3">
                      <label htmlFor="status-field" className="form-label">
                        Task Status
                      </label>
                      <select
                        className="form-control"
                        data-trigger=""
                        name="status-field"
                        id="status-field"
                        onChange={(e) => setTaskStatus(e.target.value)}
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

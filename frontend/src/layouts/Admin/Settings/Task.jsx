import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  JobType,
  AddTask,
  GETTASKDATA,
} from "../../../ReduxStore/Slice/Settings/settingSlice";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import Modal from "../../../Components/ExtraComponents/Modals/Modal";
import sweatalert from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { useFormik } from "formik";
import * as XLSX from "xlsx";

const Setting = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [taskData, setTaskData] = useState({ loading: true, data: [] });
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [viewtask, setViewtask] = useState(false);
  const [getJobTypeId, setJobTypeId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [budgetedHours, setBudgetedHours] = useState({
    hours: "",
    minutes: "",
  });
  const [tasks, setTasks] = useState([]);

  const [isModalOpenEditTask, setIsModalOpenEditTask] = useState(false);
  const [taskEditRow, setTaskEditRow] = useState({});
  

  const TaskData = async () => {
    const req = { service_id: location?.state?.service_id, job_type_id: location?.state?.Id };
    const data = { req: req, authToken: token };
    await dispatch(GETTASKDATA(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          console.log("response.data", response.data);
          setTaskData({ loading: false, data: response.data });
        } else {
          setTaskData({ loading: false, data: [] });

        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    TaskData();
  }, []);


  const columnJobType = [
    {
      name: "Task",
      selector: (row) => row.name,
      sortable: true,
      width: "20%",
    },
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
      width: "20%",
    },
    {
      name: "Job Type",
      selector: (row) => row.job_type_type,
      sortable: true,
      width: "20%",
    },
    {
      name: "Budgeted Time",
      selector: (row) => row?.budgeted_hour
                        ? `${row?.budgeted_hour.split(":")[0]} Hours ${row?.budgeted_hour.split(":")[1]} Minutes`
                        : "",
      sortable: true,
      width: "20%",
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <div className="d-lg-flex d-none">
            <button className="edit-icon" onClick={() => handleEdit(row)}>
              <i className="ti-pencil" />
            </button>
            {
              row?.is_assigned != 1 && (
                <button className="delete-icon" onClick={() => handleDelete(row)}>
                  <i className="ti-trash text-danger" />
                </button>
              )
            }
          </div>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "20%",
    },
  ];

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      status: "",
    },
    validation: {},
    onSubmit: async (values) => {
      let req = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role_id: values.role,
        status: values.status,
      };
    },
  });

  const fields = [
    {
      type: "text",
      name: "task",
      label: "Task",
      label_size: 12,
      col_size: 12,
      disable: false,
      placeholder: "Enter First Name",
    },
    {
      type: "text",
      name: "last_name",
      label: "Last Name",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Last Name",
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Email",
    },
    {
      type: "text",
      name: "phone",
      label: "Phone",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Phone Number",
    },
  ];

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prevModalData) => ({
      ...prevModalData,
      fields: prevModalData.fields.map((field) =>
        field.name === name ? { ...field, value: value } : field
      ),
    }));
  };

  const handleAdd = (e) => {
    setModalData({
      ...modalData,
      fields: [
        {
          type: "text",
          name: "name",
          label: "Task name",
          placeholder: "Enter Task name",
        },
      ],
      title: "Task",
    });
    // setIsEdit(false);
    // setIsModalOpen(true);

    setShowAddTask(true);
  };

  const handleEdit = (data) => {
    // setModalData({
    //   ...modalData,
    //   fields: [
    //     {
    //       type: "text",
    //       name: "name",
    //       label: "Task Name",
    //       placeholder: "Enter Task Name",
    //       value: data.name,
    //     },
    //     // {
    //     //   type: "select",
    //     //   name: "status",
    //     //   label: "Status",
    //     //   placeholder: "Select Status",
    //     //   value: data.status === "1" ? "1" : "0",
    //     //   options: [
    //     //     { label: "Active", value: "1" },
    //     //     { label: "Deactive", value: "0" },
    //     //   ],
    //     // },
    //   ],
    //   title: "Task",

    //   id: data.id,
    //   budgeted_hour: data.budgeted_hour,
    //   service_id: data.service_id,
    //   job_type_id: data.job_type_id,
    // });

    // setIsEdit(true);
    // setIsModalOpen(true);

    setIsModalOpenEditTask(true)
    setTaskEditRow(data)
    setBudgetedHours({
      hours: data?.budgeted_hour ? data?.budgeted_hour.split(":")[0] : "",
      minutes: data?.budgeted_hour ? data?.budgeted_hour.split(":")[1] : "",
    })
  };

  const onCloseEditTask = () => {
    setIsModalOpenEditTask(false)
    setTaskEditRow({})
    setBudgetedHours({ hours: "", minutes: "" })
  }
  const onSaveEditTask = () => {
    // Logic to save the edited task
    if (taskEditRow?.name?.trim() == "" || taskEditRow?.name == undefined) {
      sweatalert.fire({
        title: "Please enter task name",
        icon: "warning",
        timer: 2000,
      });
      return;
    }
    const req = { action: "update" };
    req.id = taskEditRow.id;
    req.budgeted_hour = `${budgetedHours.hours || "00"}:${budgetedHours.minutes || "00"}`;
    req.service_id = taskEditRow.service_id;
    req.job_type_id = taskEditRow.job_type_id;
    req.name = taskEditRow.name;
    dispatch(AddTask({ req, authToken: token }))  
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert.fire({
            title: response.message,
            icon: "success",
            timer: 2000,
          });
          TaskData();
          setTimeout(() => {
            onCloseEditTask();
            setTasks([]);
            formik.resetForm();
          }, 2000);
        } else {
          sweatalert.fire({
            title: response.message,
            icon: "error",
            timer: 2000,
          });
        }
      })
      .catch((error) => {
        return;
      });
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      modalData.fields[0]?.value?.trim() == "" ||
      modalData.fields[0].value == undefined
    ) {
      sweatalert.fire({
        title: "Please enter " + modalData.fields[0].label,
        icon: "warning",
        timer: 2000,
      });

      return;
    }
    const req = { action: isEdit ? "update" : "add" };
    if (isEdit) {
      req.id = modalData.id;
      req.budgeted_hour = modalData.budgeted_hour;
      req.service_id = modalData.service_id;
      req.job_type_id = modalData.job_type_id;
    }
    modalData.fields.map((field) => {
      req[field.name] = field.value;
      if (field.name == "status") {
        req.status = field.value;
      }
    });


    await dispatch(AddTask({ req, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert.fire({
            title: response.message,
            icon: "success",
            timer: 2000,
          });
          TaskData();
          setTimeout(() => {
            setShowAddTask(false);
            setTasks([]);
            formik.resetForm();
          }, 2000);
        } else {
          sweatalert.fire({
            title: response.message,
            icon: "error",
            timer: 2000,
          });
        }
      })
      .catch((error) => {
        return;
      });

    setModalData({});
    setIsModalOpen(false);
  };

  const handleDelete = (data) => {
    sweatalert
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })

      .then((result) => {
        if (result.isConfirmed) {
          const req = {
            action: "delete",
            id: data.id,
          };
          dispatch(AddTask({ req, authToken: token }))  
            .unwrap()
            .then(async (response) => {
              if (response.status) {
                TaskData();
                sweatalert.fire({
                  title: response.message,
                  icon: "success",
                  timer: 2000,
                });
              } else {
                sweatalert.fire({
                  title: response.message,
                  icon: "error",
                  timer: 2000,
                });
              }
            })
            .catch((error) => {
              return;
            });
        }
      });
  };

  const handleInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  // const handleAddTask = () => {
  //   if (taskInput.trim() !== "") {
  //     setTasks([...tasks, taskInput]);
  //     setTaskInput("");
  //   }
  // };

  const handleAddTask = () => {
  if (taskInput.trim() !== "") {
    const newTask = {
      name: taskInput,   
      budgeted_hour: `${budgetedHours.hours || "00"}:${budgetedHours.minutes || "00"}`,
    };

    setTasks([...tasks, newTask]);
    setTaskInput("");
  }
};


  const handleSaveTask = async () => {
    let req = {
      name: tasks,
      job_type_id: location.state.Id,
      service_id: location.state.service_id,
    };

    if (tasks.length == 0) {
      sweatalert.fire({
        title: "Please enter the task name",
        icon: "warning",
        timer: 2000,
      });
      return;
    }

    await dispatch(AddTask({ req, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert.fire({
            title: response.message,
            icon: "success",
            timer: 2000,
          });
          TaskData();
          setTimeout(() => {
            setShowAddTask(false);
            setTasks([]);
            formik.resetForm();
          }, 2000);
        } else {
          sweatalert.fire({
            title: response.message,
            icon: "error",
            timer: 2000,
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const handleDeleteTask = (e) => {
    const index = e.target.parentNode.parentNode.parentNode.rowIndex;
    let temp = [...tasks];
    temp.splice(index - 1, 1);
    setTasks(temp);
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="card mt-4">
          <div className="card-header align-items-center step-header-blue d-flex">
            <button
              type="button"
              className="btn p-0"
              onClick={(e) => {
                sessionStorage.setItem(
                  "settingTab",
                  location?.state?.settingTab
                );
                window.history.back();
              }}
            >
              <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4"></i>
            </button>
            <h4 className="card-title">Tasks</h4>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-end align-items-center">
              <div>
                <button
                  type="button"
                  style={{ zIndex: "1" }}
                  className="btn btn-info text-white float-end"
                  onClick={(e) => handleAdd(e, "1")}
                >
                  <i className="fa fa-plus" /> Add Task
                </button>
              </div>
            </div>
            <div className="datatable-wrapper mt-minus job-type">
              <Datatable
                filter={true}
                columns={columnJobType}
                data={taskData?.data}
              />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          modalId="exampleModal3"
          title={isEdit ? "Edit " + modalData.title : "Add " + modalData.title}
          fields={modalData.fields}
          onClose={() => {
            setIsModalOpen(false);
            setModalData({});
          }}
          onSave={handleSave}
          onChange={handleModalChange}
          buttonName={
            <>
              <i className={`far ${isEdit ? "fa-edit" : "fa-save"}`}></i>{" "}
              {isEdit ? "Update" : "Save"}
            </>
          }
        />
      )}


       {isModalOpenEditTask && (
         <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Edit Task</h5>
            <button type="button" className="btn-close" onClick={onCloseEditTask}></button>
          </div>

          <div className="modal-body">
             <div className="row ">
              <div className="col-lg-9">
                <div className="mb-3">
                  <label htmlFor="">Task Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Task Name"
                    id="firstNameinput"
                    autoFocus
                    value={taskEditRow?.name || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Budgeted Time
                  </label>
                  <div className="input-group">
                    {/* Hours Input */}
                    <div className="hours-div">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Hours"
                        onChange={(e) => {
                          const value = e.target.value;

                          // Only allow non-negative numbers for hours
                          if (
                            value === "" ||
                            Number(value) >= 0
                          ) {
                            setBudgetedHours({
                              ...budgetedHours,
                              hours: value,
                            });
                          }
                        }}
                        value={budgetedHours?.hours || ""}
                      />
                      <span
                        className="input-group-text"
                        id="basic-addon2"
                      >
                        H
                      </span>
                    </div>

                    {/* Minutes Input */}
                    <div className="hours-div">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Minutes"
                        onChange={(e) => {
                          const value = e.target.value;

                          // Only allow minutes between 0 and 59
                          if (
                            value === "" ||
                            (Number(value) >= 0 &&
                              Number(value) <= 59)
                          ) {
                            setBudgetedHours({
                              ...budgetedHours,
                              minutes: value,
                            });
                          }
                        }}
                        value={budgetedHours?.minutes || ""}
                      />
                      <span
                        className="input-group-text"
                        id="basic-addon2"
                      >
                        M
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
            </div>
            </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCloseEditTask}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={onSaveEditTask}>
              Update
            </button>
          </div>

        </div>
      </div>
    </div>
      )}



      <CommanModal
        isOpen={showAddTask}
        backdrop="static"
        size="ms-5"
        title=" Add Task"
        hideBtn={true}
        handleClose={() => {
          setShowAddTask(false);
          formik.resetForm();
          setTaskInput("");
          setTasks([]);
        }}
      >
        <div className="">
          <div className="mb-3" id="modal-id" style={{ display: "none" }}>
            <label htmlFor="id-field" className="form-label">
              ID
            </label>
            <input
              type="text"
              id="id-field"
              className="form-control"
              placeholder="ID"
              readOnly
            />
          </div>
          <div>
            <div className="row ">
              <div className="col-lg-9">
                <div className="mb-3">
                  {/* <label htmlFor="firstNameinput" className="form-label">
                    Task Name
                  </label> */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Task Name"
                    id="firstNameinput"
                    autoFocus
                    value={taskInput}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Budgeted Time
                  </label>
                  <div className="input-group">
                    {/* Hours Input */}
                    <div className="hours-div">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Hours"
                        onChange={(e) => {
                          const value = e.target.value;

                          // Only allow non-negative numbers for hours
                          if (
                            value === "" ||
                            Number(value) >= 0
                          ) {
                            setBudgetedHours({
                              ...budgetedHours,
                              hours: value,
                            });
                          }
                        }}
                        value={budgetedHours?.hours || ""}
                      />
                      <span
                        className="input-group-text"
                        id="basic-addon2"
                      >
                        H
                      </span>
                    </div>

                    {/* Minutes Input */}
                    <div className="hours-div">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Minutes"
                        onChange={(e) => {
                          const value = e.target.value;

                          // Only allow minutes between 0 and 59
                          if (
                            value === "" ||
                            (Number(value) >= 0 &&
                              Number(value) <= 59)
                          ) {
                            setBudgetedHours({
                              ...budgetedHours,
                              minutes: value,
                            });
                          }
                        }}
                        value={budgetedHours?.minutes || ""}
                      />
                      <span
                        className="input-group-text"
                        id="basic-addon2"
                      >
                        M
                      </span>
                    </div>
                  </div>
                </div>

              </div>
              <div className="col-lg-3 ps-lg-0">
                <div className="remove">
                  <button className="btn  btn-info" onClick={handleAddTask}>
                    <i className="fa fa-plus pe-2"> </i>
                    Add
                  </button>
                </div>
              </div>
            </div>
            {/* <h6 className="or text-center">OR</h6>
            <div className="row align-items-center">
              <div className="mb-3 col-lg-12">
                <label htmlFor="firstNameinput" className="form-label">
                  Import Excel
                </label>
                <input
                  type="file"
                  className="form-control"
                  placeholder="Job Name"
                  id="firstNameinput"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload} 
                />
              </div>
            </div> */}
          </div>
          <br />
          <div
            style={{ border: "2px hidden black", margin: "5px" }}
            className="table-responsive table-card mt-3 mb-1"
          >
            <table
              className="table align-middle table-nowrap"
              id="customerTable"
            >
              <thead className="table-light">
                <tr>
                  <th className="">Task Name</th>

                  <th className="">Budgeted Hours</th>

                  <th className="tabel_left" width="80">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="list form-check-all">
                {tasks && tasks?.map((task, index) => (
                  <tr className="tabel_new" key={index}>
                    <td>{task.name}</td>
                    <td>{task.budgeted_hour}</td>
                    <td className="tabel_left">
                      <div className="d-flex gap-2">
                        <div className="remove">
                          <button
                            className="delete-icon"
                            onClick={(e) => handleDeleteTask(e)}
                          >
                            <i className="ti-trash text-danger" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-lg-12">
            <div className="remove" style={{ float: "right" }}>
              <button
                className="btn btn-outline-success"
                onClick={(e) => handleSaveTask()}
              >
                <i className="far fa-save pe-1"></i>
                Submit
              </button>
            </div>
          </div>
        </div>
      </CommanModal>


    </div>
  );
};

export default Setting;

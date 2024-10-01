import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  JobType,
  AddTask,
  GETTASKDATA
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
  const [jobTypeData, setJobTypeData] = useState({ loading: true, data: [] });
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [viewtask, setViewtask] = useState(false);
  const [getJobTypeId, setJobTypeId] = useState(""); 
  const [isEdit, setIsEdit] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [ViewTaskData, setViewTaskData] = useState([]);
 
  console.log("ViewTaskData", ViewTaskData);

  const JobTypeData = async (req) => {
    if (location.state.Id) {
      req = {
        ...req,
        service_id: location.state.Id,
      };
    }
    const data = { req: req, authToken: token };
    await dispatch(JobType(data))
      .unwrap()
      .then(async (response) => {
        if (req.action == "get") {
          if (response.status) {
            setJobTypeData({ loading: false, data: response.data });
          } else {
            setJobTypeData({ loading: false, data: [] });
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              JobTypeData({ action: "get" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  const handleViewTask = async(row) => {
    // const req = {service_id: location.state.Id, job_type_id: row.id};
    const req = {service_id: 5, job_type_id: 3};

    const data = { req: req, authToken: token }
    await dispatch(GETTASKDATA(data))
    .unwrap()
    .then(async (response) => {
      if (response.status) {
        setViewTaskData(response.data);
      } else {
        setViewTaskData([]);
      }
    })
    .catch((error) => {
      return;
    });
  };

  const fetchApiData = () => {
    const req = {
      action: "get",
    };
    JobTypeData(req);
  };

  const columnJobType = [
    {
      name: "Job Type",
      selector: (row) => row.type,
      sortable: true,
      width: "85%",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => handleEdit(row)}>
            {" "}
            <i className="ti-pencil" />
          </button>
          <button className="delete-icon" onClick={() => handleDelete(row)}>
            {" "}
            <i className="ti-trash text-danger" />
          </button>
          <button
            className="view-icon"
            onClick={(e) => {
              handleViewTask(row);
              setViewtask(true);
            }}
          >
            {" "}
            <i className="fa-regular fa-eye " />
          </button>
          <button
            className="btn btn-info text-white"
            onClick={(e) => {
              setShowAddTask(true);
              setJobTypeId(row);
            }}
          >
            Add Task
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
          name: "type",
          label: "Job Type",
          placeholder: "Enter Job Type",
        },
      ],
      title: " Job Type",
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setModalData({
      ...modalData,
      fields: [
        {
          type: "text",
          name: "type",
          label: "Job Type",
          placeholder: "Enter Job Type",
          value: data.type,
        },
        {
          type: "select",
          name: "status",
          label: "Status",
          placeholder: "Select Status",
          value: data.status === "1" ? "1" : "0",
          options: [
            { label: "Active", value: "1" },
            { label: "Deactive", value: "0" },
          ],
        },
      ],
      title: "Job Type",

      id: data.id,
    });

    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (
      modalData.fields[0].value == "" ||
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
    }
    modalData.fields.map((field) => {
      req[field.name] = field.value;
      if (field.name == "status") {
        req.status = field.value;
      }
    });
    JobTypeData(req);

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
          JobTypeData(req);
          sweatalert.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
  };

  const handleInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleAddTask = () => {
    if (taskInput.trim() !== "") {
      setTasks([...tasks, taskInput]);
      setTaskInput(""); 
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const extractedTasks = jsonData.map(
        (row) => row.Task || row.task || row["Task Name"]
      ); 
      setTasks([...tasks, ...extractedTasks]); 
    };

    reader.readAsBinaryString(file);
  };

  const handleSaveTask = async () => {
    let req = {
      name: tasks,
      job_type_id: getJobTypeId.id,
      service_id: location.state.Id,
    };

    await dispatch(AddTask({ req, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert.fire({
            title: response.message,
            icon: "success",
            timer: 2000,
          });
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

  return (
    <div>
      <div className="container-fluid">
        <div className="card mt-4">
          <div className="card-header align-items-center step-header-blue d-flex">
            <button type="button" className="btn p-0" onClick={(e)=>  window.history.back()}>
              <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4"></i>
            </button>
            <h4 className="card-title">Job Type</h4>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-end align-items-center">
              <div>
                <button
                  type="button"
                  className="btn btn-info text-white float-end"
                  onClick={(e) => handleAdd(e, "1")}
                >
                  <i className="fa fa-plus" /> Add Job Type
                </button>
              </div>
            </div>
            <div className="datatable-wrapper mt-minus">
              <Datatable
                filter={true}
                columns={columnJobType}
                data={jobTypeData.data}
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
          buttonName={isEdit ? "Update" : "Save"}
        />
      )}

      <CommanModal
        isOpen={showAddTask}
        backdrop="static"
        size="ms-5"
        title="Task"
        hideBtn={true}
        handleClose={() => {
          setShowAddTask(false);
          formik.resetForm();
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
                  <input
                    type="text"
                    style={{ height: "2rem" }}
                    className="form-control"
                    placeholder="Enter Task"
                    id="firstNameinput"
                    value={taskInput} // Bind input to state
                    onChange={handleInputChange} // Handle input change
                  />
                </div>
              </div>
              <div className="col-lg-3 ps-0">
                <div className="remove">
                  <button
                    className="btn  btn-info"
                    onClick={handleAddTask} // Call handleAddTask when clicked
                  >
                    <i className="fa fa-plus pe-2"> </i>
                    Add
                  </button>
                </div>
              </div>
            </div>
            <h6 className="or text-center">OR</h6>
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
                  onChange={handleFileUpload} // Handle file upload
                />
              </div>
            </div>
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
                  <th className="">Task</th>
                  <th className="">&nbsp;&nbsp;</th>
                  <th className="">&nbsp;&nbsp;</th>
                  <th className="">&nbsp;&nbsp;</th>
                  <th className="">&nbsp;&nbsp;</th>
                  <th className="tabel_left">Action</th>
                </tr>
              </thead>
              <tbody className="list form-check-all">
                {tasks.map((task, index) => (
                  <tr className="tabel_new" key={index}>
                    <td>{task}</td>
                    <td>&nbsp;&nbsp;</td>
                    <td>&nbsp;&nbsp;</td>
                    <td>&nbsp;&nbsp;</td>
                    <td>&nbsp;&nbsp;</td>
                    <td className="tabel_left">
                      <div className="d-flex gap-2">
                        <div className="remove">
                          <a
                            style={{
                              backgroundColor: "rgb(75, 175, 75)",
                              color: "white",
                              width: "60px",
                              fontSize: "12px",
                            }}
                            className="btn btn-sm "
                          >
                          
                            Enable
                          </a>
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

      <CommanModal
        isOpen={viewtask}
        backdrop="static"
        size="ms-5"
        title="View Task"
        hideBtn={true}
        handleClose={() => {
          setViewtask(false);
        }}
      >
        <div className="modal-body">
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
                  <th className="">Task</th>

                  <th className="tabel_left">Status</th>
                </tr>
              </thead>
              <tbody className="list form-check-all">
                {tasks.map((task, index) => (
                  <tr className="tabel_new" key={index}>
                    <td>{task}</td>

                    <td className="tabel_left">
                      <div className="d-flex gap-2">
                        <div className="remove">
                          <a
                            style={{
                              backgroundColor: "rgb(75, 175, 75)",
                              color: "white",
                              width: "60px",
                              fontSize: "12px",
                            }}
                            className="btn btn-sm "
                          >
                            Enable
                          </a>
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
                className="btn btn-info text-white "
                onClick={(e) => handleSaveTask()}
              >
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

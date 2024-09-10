import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  JobType,
  AddTask,
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
  const [getJobTypeId, setJobTypeId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);

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
        console.log("Error", error);
      });
  };

  useEffect(() => {
    fetchApiData();
  }, []);

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
            <i className="ti-trash" />
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

    //setModalData(data);
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
      // alert("Please enter " + modalData.fields[0].label);
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





  return (
    <div>
      <div className="container-fluid">
        <div className="card mt-4">
          <div className="card-header align-items-center step-header-blue d-flex">
            <button type="button" className="btn p-0" onClick={() => window.history.back()} >
              <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4"></i>
            </button>
            <h4 className="card-title">Sub Source Type</h4>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-end align-items-center">
              <div>
                <button
                  type="button"
                  className="btn btn-info text-white float-end"
                  onClick={(e) => handleAdd(e, "1")}
                >
                  {" "}
                  <i className="fa fa-plus" /> Add Sub Source Type
                </button>
              </div>
            </div>
            <div className="datatable-wrapper mt-minus">
              <Datatable
                filter={true}
                columns={columnJobType}
                data={[{ type:"source",status:"1"},{ type:"source1",status:"1"},{ type:"source2",status:"0"}]}
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

   
    </div>
  );
};

export default Setting;

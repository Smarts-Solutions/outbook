import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  JobType,
  GetServicesByCustomers,
  GETTASKDATA,
  getList,
  UpdateChecklistData,
} from "../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from "sweetalert2";

const CreateCheckList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_id: location.state?.id || "",
    service_id: "",
    job_type_id: "",
    client_type_id: "",
    check_list_name: "",
    status: "",
  });

  const [tasks, setTasks] = useState([
    { task_id: "", task_name: "", budgeted_hour: "", checklist_tasks_id: "" },
  ]);
  const [errors, setErrors] = useState({});

  const [serviceList, setServiceList] = useState([]);
  const [clientTypeList, setClientTypeList] = useState([]);
  const [jobTypeList, setJobTypeList] = useState([]);

  useEffect(() => {
    if (location.state?.checklist_id) {
      let req = {
        action: "getById",
        checklist_id: location.state.checklist_id,
      };
      let data = { req, authToken: token };

      dispatch(getList(data))
        .unwrap()
        .then((response) => {
          if (response.status) {
            const checklistData = response.data;


            getJobTypeData(checklistData.service_id);

            setFormData({
              customer_id: location.state?.id || "",
              service_id: checklistData.service_id,
              job_type_id: checklistData.job_type_id,
              client_type_id: checklistData.client_type_id,
              check_list_name: checklistData.check_list_name,
              status: checklistData.status,
            });
            if (checklistData.task) {
              setTasks(
                checklistData.task.map((task) => ({
                  task_id: task.task_id,
                  task_name: task.task_name,
                  budgeted_hour: task.budgeted_hour,
                  checklist_tasks_id: task.checklist_tasks_id,
                }))
              );
            }
          }
        })
        .catch((error) => {
          console.log("Error fetching checklist data:", error);
        });
    }

    if (formData.customer_id) {
      let req = { customer_id: formData.customer_id };
      let data = { req, authToken: token };

      dispatch(GetServicesByCustomers(data))
        .unwrap()
        .then((response) => {
          if (response.status) {
            // Assuming response.data is an array of services
            setServiceList(response.data); // Store the list of services
            setFormData((prevData) => ({
              ...prevData,
              service_id: response.data.find(
                (service) => service.service_id === prevData.service_id
              )
                ? prevData.service_id
                : "",
            }));
          }
        })
        .catch((error) => console.error("Error fetching services:", error));
    }

    // Fetch client types
    let reqClientType = { action: "getClientType" };
    let dataClientType = { req: reqClientType, authToken: token };

    dispatch(getList(dataClientType))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setClientTypeList(response.data); // Store the list of client types
          setFormData((prevData) => ({
            ...prevData,
            client_type_id: response.data.find(
              (client) => client.id === prevData.client_type_id
            )
              ? prevData.client_type_id
              : "",
          }));
        }
      })
      .catch((error) => {
        console.log("Error fetching client types:", error);
      });
  }, [formData.customer_id, location.state?.checklist_id, dispatch, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const newTasks = [...tasks];
    newTasks[index][name] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        task_name: "",
        budgeted_hour: "",
        task_id: null,
        checklist_tasks_id: null,
      },
    ]);
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const getJobTypeData = async (service_id) => {
    const req = { service_id, action: "get" };
    const data = { req, authToken: token };
    await dispatch(JobType(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setJobTypeList(response.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching job types:", error);
      });
  };

  const handleSubmit = async () => {
    let validationErrors = {};

    if (!formData.service_id)
      validationErrors.service_id = "Service Type is required";
    if (!formData.job_type_id)
      validationErrors.job_type_id = "Job Type is required";
    if (!formData.client_type_id)
      validationErrors.client_type_id = "Client Type is required";
    if (!formData.check_list_name)
      validationErrors.check_list_name = "Check List Name is required";
    if (!formData.status) validationErrors.status = "Status is required";

    tasks.forEach((task, index) => {
      if (!task.task_name)
        validationErrors[`task_name_${index}`] = "Task Name is required";
      if (!task.budgeted_hour)
        validationErrors[`budgeted_hour_${index}`] =
          "Budgeted Hour is required";
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const req = {
      checklists_id: location.state.checklist_id,
      ...formData,
      task: tasks.map((task) => ({
        task_name: task.task_name,
        budgeted_hour: task.budgeted_hour,
        task_id: task.task_id,
        checklist_tasks_id: task.checklist_tasks_id,
      })),
    };

    const data = { req, authToken: token };
    await dispatch(UpdateChecklistData(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          sweatalert.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonText: "Ok",
          });
          setFormData({
            customer_id: location.state?.id || "",
            service_id: "",
            job_type_id: "",
            client_type_id: "",
            check_list_name: "",
            status: "",
          });
          setTasks([{ task_id: "", task_name: "", budgeted_hour: "" }]);
          navigate("/admin/Clientlist", {
            state: { id: location.state.id, route: "Checklist" },
          });
        }
      })
      .catch((error) => {
        console.log("Error fetching job types:", error);
      });
  };

  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="card-header d-flex justify-content-between">
          <h3 className="card-title mb-0">Update Checklist</h3>
          <button
            type="button"
            className="btn btn-info text-white blue-btn"
            onClick={() =>
              navigate("/admin/Clientlist", {
                state: { id: location.state.id, route: "Checklist" },
              })
            }
          >
            Back
          </button>
        </div>
      </div>
      <div className="report-data mt-4">
        <div>
          <div className="row">
            <div className="col-lg-4 mt-4">
              <div className="row">
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    name="service_id"
                    value={formData.service_id}
                    onChange={(e) => {
                      handleInputChange(e);
                      getJobTypeData(e.target.value);
                    }}
                    disabled={true}
                  >
                    <option value="">Please Select Service Type</option>
                    {serviceList.map((service) => (
                      <option
                        key={service.service_id}
                        value={service.service_id}
                      >
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                  {errors.service_id && (
                    <p className="text-danger">{errors.service_id}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className="row">
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    name="job_type_id"
                    value={formData.job_type_id}
                    disabled={true}
                    onChange={(e) => {
                      handleInputChange(e);
                      // getTaskData(e.target.value);
                    }}
                  >
                    <option value="">Please Select Job Type</option>
                    {jobTypeList &&
                      jobTypeList.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.type}
                        </option>
                      ))}
                  </select>
                  {errors.job_type_id && (
                    <p className="text-danger">{errors.job_type_id}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className="row">
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    name="client_type_id"
                    value={formData.client_type_id}
                    onChange={handleInputChange}
                    disabled={true}
                  >
                    <option value="">Please Select Client Type</option>
                    {clientTypeList.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.type}
                      </option>
                    ))}
                  </select>
                  {errors.client_type_id && (
                    <p className="text-danger">{errors.client_type_id}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className="row">
                <div className="col-lg-12">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Check List Name"
                    name="check_list_name"
                    value={formData.check_list_name}
                    onChange={handleInputChange}
                  />
                  {errors.check_list_name && (
                    <p className="text-danger">{errors.check_list_name}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className="row">
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Please Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="text-danger">{errors.status}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {tasks.map((task, index) => (
            <div key={index} className="row mt-4">
              <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Task Name"
                  name="task_name"
                  value={task.task_name}
                  disabled={task.task_id}
                  onChange={(e) => handleTaskChange(index, e)}
                />
                {errors[`task_name_${index}`] && (
                  <p className="text-danger">{errors[`task_name_${index}`]}</p>
                )}
              </div>
              <div className="col-lg-4">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Budgeted Hour"
                  name="budgeted_hour"
                  value={task.budgeted_hour}
                  onChange={(e) => handleTaskChange(index, e)}
                />
                {errors[`budgeted_hour_${index}`] && (
                  <p className="text-danger">
                    {errors[`budgeted_hour_${index}`]}
                  </p>
                )}
              </div>
              <div className="col-lg-4 d-flex align-items-center">
                {tasks.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeTask(index)}
                  >
                    Remove
                  </button>
                )}
                {index === tasks.length - 1 && (
                  <button
                    type="button"
                    className="btn btn-info ms-2"
                    onClick={addTask}
                  >
                    Add Task
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="row mt-4">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-info"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCheckList;

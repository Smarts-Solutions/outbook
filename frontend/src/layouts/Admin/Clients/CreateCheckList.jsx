import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  JobType,
  GetServicesByCustomers,
  GETTASKDATA,
  getList,
  addChecklists,
} from "../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from "sweetalert2";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";

const CreateCheckList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [selectedClientType, setSelectedClientType] = useState([]);
  const [tasks, setTasks] = useState([
    { task_id: "", task_name: "", budgeted_hour: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [errors1, setErrors1] = useState({});

  const [formData, setFormData] = useState({
    customer_id: location.state?.id || "",
    service_id: "",
    job_type_id: "",
    client_type_id: "",
    check_list_name: "",
    status: "1",
  });

  const [formData1, setFormData1] = useState({
    customer_id: location.state?.id || "",
    service_id: "",
    job_type_id: "",
    client_type_id: "",
    check_list_name: "",
    status: "1",
  });

  const options = [
    { key: "1", label: "Sole Trader" },
    { key: "2", label: "Company" },
    { key: "3", label: "Partnership" },
    { key: "4", label: "Individual" },
  ];

  useEffect(() => {
    if (formData.customer_id) {
      const req = { customer_id: formData.customer_id };
      const data = { req, authToken: token };
      dispatch(GetServicesByCustomers(data))
        .unwrap()
        .then((response) => {
          if (response.status) {
            setFormData((data) => ({ ...data, service_id: response.data }));
          }
        })
        .catch((error) => {
          return;
        });
    }

    const req = { action: "getClientType" };
    const data = { req, authToken: token };
    dispatch(getList(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setFormData((data) => ({ ...data, client_type_id: response.data }));
        }
      })
      .catch((error) => {
        return;
      });
  }, [formData.customer_id, dispatch, token]);

  const fieldErrors = {
    service_id: "Please Select Service Type",
    job_type_id: "Please Select Job Type",
    check_list_name: "Please Enter Check List Name",
   // status: "Please Select Status",
  };

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validate(name, value);
  };

  const validate = (name, value, isSubmitting = false) => {
    const newErrors = { ...errors };
    if (isSubmitting) {
      for (const key in fieldErrors) {
        if (!formData1[key]) {
          newErrors[key] = fieldErrors[key];
        }
      }
    } else {
      if (!value?.trim()) {
        if (fieldErrors[name]) {
          newErrors[name] = fieldErrors[name];
        }
      } else {
        delete newErrors[name];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    let isValid = true;
    for (const key in formData1) {
      if (!validate(key, formData1[key], true)) {
        isValid = false;
      }
    }
    return isValid;
  };

  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const newTasks = [...tasks];
    if (name === "hours" || name === "minutes") {
      const hours = newTasks[index].budgeted_hour?.hours || "";
      const minutes = newTasks[index].budgeted_hour?.minutes || "";

      if (name === "hours") {
        const numericValue = Number(value);
        if (!isNaN(numericValue) && numericValue >= 0) {
          newTasks[index].budgeted_hour = {
            hours: value === "" ? "" : numericValue.toString().padStart(2, "0"),
            minutes,
          };
        }
      } else if (name === "minutes") {
        const numericValue = Number(value);

        if (value === "" || (numericValue >= 0 && numericValue <= 59)) {
          newTasks[index].budgeted_hour = {
            hours,
            minutes:
              value === "" ? "" : numericValue.toString().padStart(2, "0"),
          };
        } else {
          e.target.value = "59";
          newTasks[index].budgeted_hour = {
            hours,
            minutes: "59",
          };
        }
        // If value is greater than 59 or not a number, do nothing (ignore the input)
      }
    } else {
      // Handle other changes, e.g., task_name
      newTasks[index][name] = value;
    }

    setTasks(newTasks);
  };

  const formatBudgetedHours = () => {
    return tasks.map((task) => {
      const hours = task.budgeted_hour?.hours || ""; 
      const minutes = task.budgeted_hour?.minutes || ""; 
      return {
        ...task,
        budgeted_hour: `${hours}:${minutes}`, 
      };
    });
  };

  const addTask = () => {
    setTasks([...tasks, { task_name: "", budgeted_hour: "", task_id: null }]);
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
          setFormData((data) => ({ ...data, job_type_id: response.data }));
        }
      })
      .catch((error) => {
        return;
      });
  };

  const getTaskData = async (job_type_id) => {
    const req = { service_id: formData1.service_id, job_type_id };
    const data = { req, authToken: token };
    await dispatch(GETTASKDATA(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (response.data.length > 0) {
            const taskData = response.data.map((item) => ({
              task_id: item.id,
              task_name: item.name,
              budgeted_hour: "",
            }));
            setTasks(taskData);
          } else {
            setTasks([{ task_name: "", budgeted_hour: "" }]);
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const handleSubmit = async () => {
    let validationErrors = {};
    const formattedTasks = formatBudgetedHours();

    const isValid = validateAllFields();
    if (!isValid) {
      return;
    }

    if(selectedClientType.length==0){
      setErrors({ ...errors, client_type_id: "Please Select Client Type" });
      return;
    }

    tasks.forEach((task, index) => {
      if (!task.task_name?.trim()) {
        validationErrors[`task_name_${index}`] = "Task Name is required";
      }

      if (
        !task.budgeted_hour ||
        task.budgeted_hour.hours === "" ||
        task.budgeted_hour.minutes === ""
      ) {
        validationErrors[`budgeted_hour_${index}`] =
          "Budgeted Time is required";
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors1(validationErrors);
      return;
    }

    let ClienTypeArr = "";
    selectedClientType.map((item) => {
      ClienTypeArr += item + ",";
    });

    const req = {
      ...formData1,
      client_type_id: ClienTypeArr.slice(0, -1),
      task: formattedTasks.map((task) => ({
        task_name: task.task_name,
        budgeted_hour: task.budgeted_hour,
        task_id: task.task_id,
      })),
    };

    
    const data = { req, authToken: token };
    await dispatch(addChecklists(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          sweatalert.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonText: "Ok",
          });

          // Reset form and tasks after successful submission
          setFormData({
            customer_id: location.state?.id || "",
            service_id: "",
            job_type_id: "",
            client_type_id: "",
            check_list_name: "",
            status: "",
          });
          setTasks([{ task_id: "", task_name: "", budgeted_hour: "" }]);

          // Redirect to Clientlist
          sessionStorage.setItem('activeTab', location.state.activeTab);
          window.history.back()
        }
      })
      .catch((error) => {
        return;
      });
  };

  const handleMultipleSelect = (e) => {
    if (e.length === 0) {
      setErrors({ ...errors, client_type_id: "Please Select Client Type" });
    } else {
      const { client_type_id, ...rest } = errors;
      setErrors(rest);
    }

    setSelectedClientType(e);
  };

  return (
    <div className="container-fluid">
      <div className="card mt-4">
        <div className="card-header d-flex step-header-blue">
          <button
            type="button"
            className="btn p-0"
            onClick={() => {
              sessionStorage.setItem('activeTab', location.state.activeTab)
              window.history.back()
            }
            }
          >
            <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4"></i>
          </button>
          <h3 className="card-title mb-0">Create New Checklist</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4 mb-lg-0 mb-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label"> Select Service Type</label>
                  <select
                    className={errors.service_id ? "error-field form-select" : "form-select"}
                    name="service_id"
                    defaultValue={formData.service_id}
                    onChange={(e) => {
                      handleInputChange(e);
                      getJobTypeData(e.target.value);
                    }}
                  >
                    <option value="">Please Select Service Type</option>
                    {formData.service_id &&
                      formData.service_id.map((service) => (
                        <option
                          key={service.service_id}
                          value={service.service_id}
                        >
                          {service.service_name}
                        </option>
                      ))}
                  </select>
                  {errors.service_id && (
                    <p className="mb-0 error-text">{errors.service_id}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-lg-0 mb-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label"> Select Job Type</label>
                  <select
                    className={errors.job_type_id ? "error-field form-select" : "form-select"}
                    name="job_type_id"
                    defaultValue={formData.job_type_id}
                    onChange={(e) => {
                      handleInputChange(e);
                      getTaskData(e.target.value);
                    }}
                  >
                    <option value="">Please Select Job Type</option>
                    {formData.job_type_id &&
                      formData.job_type_id.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.type}
                        </option>
                      ))}
                  </select>
                  {errors.job_type_id && (
                    <p className="mb-0 error-text">{errors.job_type_id}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 ">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Select Client Type</label>
                  <div className="custom-multiselect">
                    <DropdownMultiselect
                      options={options}
                      name="client_type_id"
                      className=""
                      handleOnChange={(e) => handleMultipleSelect(e)}
                    />
                  </div>
                  {errors.client_type_id && (
                    
                    <p className="mb-0 error-text">{errors.client_type_id}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-3">
              <div className=" row flex-column">
                <div>
                  <label className="form-label">Check List Name</label>
                  <input
                    type="text"
                    className={errors.check_list_name ? "error-field form-control" : "form-control"}
                    placeholder="Check List Name"
                    name="check_list_name"
                    defaultValue={formData.check_list_name}
                    onChange={handleInputChange}
                  />
                  {errors.check_list_name && (
                    <p className="mb-0 error-text">{errors.check_list_name}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Status</label>

                  <select
                    className={errors.status ? "error-field form-select" : "form-select"}
                    name="status"
                    defaultValue={formData.status}
                    onChange={handleInputChange}
                  >
                    {/* <option value="">Please Select Status</option> */}
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="mb-0 error-text">{errors.status}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button className="btn btn-info mt-3" onClick={addTask}>
            <i className="fa fa-plus"></i>Add Task
          </button>

          <div className="mt-4">
            {tasks.map((task, index) => (
              <div key={task.task_id} className="row  mt-4 ">
                <div className="col-lg-5 mb-lg-0 mb-3">
                  <div>
                    <label className="form-label">Task Name</label>
                    <input
                      type="text"
                      name="task_name"
                      className="form-control"
                      defaultValue={task.task_name}
                      onChange={(e) => handleTaskChange(index, e)}
                      placeholder="Task Name"
                      disabled={task.task_id}
                    />
                    {errors1[`task_name_${index}`] && (
                      <p className="mb-0 error-text">
                        {errors1[`task_name_${index}`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-lg-5 mb-lg-0 mb-3">
                  <label className="form-label">Budgeted Time</label>
                  <div className="input-group">
                    {/* Hours Input */}
                    <div className="hours-div w-50">
                      <input
                        type="number"

                        className={errors1[`budgeted_hour_${index}`] ? "error-field form-control" : "form-control"}

                        placeholder="Hours"
                        name="hours"
                        defaultValue={task.budgeted_hour?.hours || ""}
                        onChange={(e) => handleTaskChange(index, e)}
                      />
                      <span className="input-group-text">H</span>
                    </div>

                    {/* Minutes Input */}
                    <div className="hours-div w-50">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Minutes"
                        name="minutes"
                        min="0"
                        max="59"
                        defaultValue={task.budgeted_hour?.minutes || ""}
                        onChange={(e) => handleTaskChange(index, e)}
                      />
                      <span className="input-group-text">M</span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errors1[`budgeted_hour_${index}`] && (
                    <p className="mb-0 error-text">
                      {errors1[`budgeted_hour_${index}`]}
                    </p>
                  )}
                </div>
                <div className="col-lg-2">
                  <button className="delete-icon mt-4" onClick={() => removeTask(index)}>
                    <i className="ti-trash text-danger "></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-12 mt-4">
            <button
              className="btn btn-secondary "
              onClick={(e) =>{
                sessionStorage.setItem('activeTab', location.state.activeTab);
                window.history.back()
              }
              }
            >
              <i className="fa fa-times pe-1"></i>
              Cancel
            </button>
            <button className="btn btn-outline-success ms-2" onClick={handleSubmit}>
              <i className="far fa-save pe-1"></i>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCheckList;

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

import { Get_Service } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";

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


  console.log(formData, "formData");  

  const [tasks, setTasks] = useState([
    { task_id: "", task_name: "", budgeted_hour: "", checklist_tasks_id: "" },
  ]);

  const [data, setData] = useState(false);
  const [errors, setErrors] = useState({});
  const [serviceList, setServiceList] = useState([]);
  const [clientTypeList, setClientTypeList] = useState([]);
  const [jobTypeList, setJobTypeList] = useState([]);
  const [selectedClientType, setSelectedClientType] = useState([]);

  const options = [
    { key: "1", label: "Sole Trader" },
    { key: "2", label: "Company" },
    { key: "3", label: "Partnership" },
    { key: "4", label: "Individual" },
  ];

  console.log(location.state, "selectedClientType");
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

            setSelectedClientType(checklistData.client_type_id);

            getJobTypeData(checklistData.service_id);


            console.log(checklistData.service_id, "checklistData.service_id");
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
            setData(true);
          }
        })
        .catch((error) => {
          return;
        });
    }

    // if (formData.customer_id) {
    //   let req = { customer_id: formData.customer_id };
    //   let data = { req, authToken: token };

    //   dispatch(GetServicesByCustomers(data))
    //     .unwrap()
    //     .then((response) => {
    //       if (response.status) {
    //         setServiceList(response.data);
    //         setFormData((prevData) => ({
    //           ...prevData,
    //           service_id: response.data.find(
    //             (service) => service.service_id === prevData.service_id
    //           )
    //             ? prevData.service_id
    //             : "",
    //         }));
    //       }
    //     })
    //     .catch((error) => {
    //       return;
    //     });
    // }

    const req = { action: "get" };
    const data = { req, authToken: token };
     dispatch(Get_Service(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          

             setServiceList(response.data);
             setFormData((prevData) => ({
               ...prevData,
               service_id: response.data.find(
                 (service) => service.id === prevData.service_id
               )
                 ? prevData.service_id
                 : "",
             }));
        }
      })
      .catch((error) => {
        return;
      });

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
        return;
      });
  }, [formData.customer_id, location.state?.checklist_id, dispatch, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const newTasks = [...tasks];


    if (name === "hours" || name === "minutes") {

      const existingBudgetedHour = newTasks[index].budgeted_hour || "00:00";
      const [hours, minutes] = existingBudgetedHour.split(":");

      if (name === "hours") {
        const numericValue = Number(value);


        if (!isNaN(numericValue) && numericValue >= 0) {
          newTasks[index].budgeted_hour =
            value === '' ? '' : numericValue.toString().padStart(2, "0") + ":" + minutes;
        }
      } else if (name === "minutes") {
        const numericValue = Number(value);


        if (value === '' || (numericValue >= 0 && numericValue <= 59)) {
          newTasks[index].budgeted_hour =
            hours + ":" + (value === '' ? '' : numericValue.toString().padStart(2, "0"));
        } else {

          e.target.value = "59";
          newTasks[index].budgeted_hour = hours + ":59";
        }
      }
    } else {

      newTasks[index][name] = value;
    }



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
        return;
      });
  };

  const handleSubmit = async () => {
    let validationErrors = {};

    if (!formData.service_id)
      validationErrors.service_id = "Service Type is required";
    if (!formData.job_type_id)
      validationErrors.job_type_id = "Job Type is required";
    if (selectedClientType.length === 0)
      validationErrors.client_type_id = "Please Select Client Type";
    if (!formData.check_list_name)
      validationErrors.check_list_name = "Check List Name is required";
    if (!formData.status) validationErrors.status = "Status is required";

    tasks.forEach((task, index) => {
      if (!task.task_name)
        validationErrors[`task_name_${index}`] = "Task Name is required";
      if (!task.budgeted_hour)
        validationErrors[`budgeted_hour_${index}`] =
          "Budgeted Time is required";
    });

    console.log(validationErrors, "validationErrors");
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    let ClienTypeArr = "";
    selectedClientType.map((item) => {
      ClienTypeArr += item + ",";
    });


    const req = {
      checklists_id: location.state.checklist_id,
      ...formData,
      client_type_id: ClienTypeArr.slice(0, -1),
      task: tasks.map((task) => ({
        task_name: task.task_name,
        budgeted_hour: task.budgeted_hour,
        task_id: task.task_id,
        checklist_tasks_id: task.checklist_tasks_id,
      })),
    };
    console.log( "req", req);
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
        
            sessionStorage.setItem('settingTab', location?.state?.settingTab);
           
          window.history.back();
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
        <div className="card-header step-header-blue d-flex ">
          <button
            type="button"
            className="btn p-0"
            onClick={() =>{
              sessionStorage.setItem('settingTab', location?.state?.settingTab);
               window.history.back()}}
            
          >
            <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4" />
          </button>
          <h3 className="card-title mb-0">Update Checklist</h3>
        </div>

 
        {data && (
          <div className="card-body">
            <div className="row">
              <div className="col-lg-4 ">
                <div className="row">
                  <div className="col-lg-12">
                    <label className="form-label"> Select Service Type</label>
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
                          key={service.id}
                          value={service.id}
                        >
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {errors.service_id && (
                      <p className="text-danger">{errors.service_id}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ">
                <div className="row">
                  <div className="col-lg-12">
                    <label className="form-label"> Select Job Typ</label>
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
              <div className="col-lg-4 ">
                <div className="row">
                  <div className="col-lg-12">
                    <label className="form-label">Select Client Type</label>
                    <DropdownMultiselect
                      options={options}
                      name="client_type_id"
                      handleOnChange={(e) => handleMultipleSelect(e)}
                      selected={
                        selectedClientType?.length > 0 ? selectedClientType : []
                      } // Ensure it's an array
                      placeholder="Select Client Type"
                    />
                    {errors.client_type_id && (
                      <p className="error-text">{errors.client_type_id}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mt-4">
                <div className="row">
                  <div className="col-lg-12">
                    <label className="form-label">Check List Name</label>
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
                    <label className="form-label">Status</label>
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
            <div className="row">
              <div className="col-lg-12 mt-4">
                <button
                  type="button"
                  className="btn btn-info ms-2"
                  onClick={addTask}
                >
                  <i className="fa fa-plus"></i> Add Task
                </button>
              </div>
            </div>
            {tasks.map((task, index) => (
              <div key={task.task_id} className="row mt-4 align-items-end">
                <div className="col-lg-5">
                  <label className="form-label">Task Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Task Name"
                    name="task_name"
                    defaultValue={task.task_name}
                    disabled={task.task_id}
                    onChange={(e) => handleTaskChange(index, e)}
                  />
                  {errors[`task_name_${index}`] && (
                    <p className="text-danger">
                      {errors[`task_name_${index}`]}
                    </p>
                  )}
                </div>
                <div className="col-lg-5">
                  <label className="form-label">Budgeted Hours</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Hours"
                      name="hours"
                      defaultValue={task.budgeted_hour?.split(":")[0] || ""}
                      onChange={(e) => handleTaskChange(index, e)}
                    />

                    <input
                      type="number"
                      className="form-control"
                      placeholder="Minutes"
                      name="minutes"
                      min="0"
                      max="59"
                      defaultValue={task.budgeted_hour?.split(":")[1] || ""}
                      onChange={(e) => handleTaskChange(index, e)}
                    />
                    {/* Minutes Error */}
                    {errors[`budgeted_hour_${index}`] && (
                      <p className="text-danger">
                        {errors[`budgeted_hour_${index}`]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-lg-2 d-flex align-items-center">
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      className="delete-icon"
                      onClick={() => removeTask(index)}
                    >
                      <i className="ti-trash text-danger "></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="row mt-4">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={handleSubmit}
                >
                  <i className="far fa-save pe-1"></i>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCheckList;

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { JobType, GetServicesByCustomers, GETTASKDATA, getList, addChecklists } from '../../../../ReduxStore/Slice/Settings/settingSlice';
import sweatalert from 'sweetalert2';

const CreateCheckList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem('token'));
  const navigate = useNavigate();
  const [budgetedHours, setBudgetedHours] = useState({ hours: "", minutes: "" })

  const [formData, setFormData] = useState({
    customer_id: location.state?.id || '',
    service_id: '',
    job_type_id: '',
    client_type_id: '',
    check_list_name: '',
    status: '',
  });

  const [formData1, setFormData1] = useState({
    customer_id: location.state?.id || '',
    service_id: '',
    job_type_id: '',
    client_type_id: '',
    check_list_name: '',
    status: '',
  });

  const [tasks, setTasks] = useState([{ task_id: "", task_name: '', budgeted_hour: '' }]);

  const [errors, setErrors] = useState({}); // Validation errors

  useEffect(() => {
    if (formData.customer_id) {
      const req = { customer_id: formData.customer_id };
      const data = { req, authToken: token };
      dispatch(GetServicesByCustomers(data))
        .unwrap()
        .then(response => {
          if (response.status) {
            setFormData(data => ({ ...data, service_id: response.data }));
          }
        })
        .catch(error => console.error("Error fetching service types:", error));
    }

    const req = { "action": "getClientType" };
    const data = { req, authToken: token };
    dispatch(getList(data))
      .unwrap()
      .then(response => {
        if (response.status) {
          setFormData(data => ({ ...data, client_type_id: response.data }));
        }
      })
      .catch(error => console.log("Error fetching service types:", error));

  }, [formData.customer_id, dispatch, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData1(prev => ({ ...prev, [name]: value }));
  };


  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const newTasks = [...tasks];
  
    // If the name is hours or minutes, handle them separately
    if (name === "hours" || name === "minutes") {
      const hours = newTasks[index].budgeted_hour?.hours || "";
      const minutes = newTasks[index].budgeted_hour?.minutes || "";
  
      // Ensure the value is a number and update accordingly
      if (name === "hours") {
        const numericValue = Number(value);
        // Update only if numeric and non-negative
        if (!isNaN(numericValue) && numericValue >= 0) {
          newTasks[index].budgeted_hour = {
            hours: value === '' ? '' : numericValue.toString().padStart(2, "0"),
            minutes
          };
        }
      } else if (name === "minutes") {
        const numericValue = Number(value);
        // Update if numeric and within range 0-59
        if (value === '' || (numericValue >= 0 && numericValue <= 59)) {
          newTasks[index].budgeted_hour = {
            hours,
            minutes: value === '' ? '' : numericValue.toString().padStart(2, "0"),
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
      const hours = task.budgeted_hour?.hours || "";  // Fallback to "00" if empty
      const minutes = task.budgeted_hour?.minutes || "";  // Fallback to "00" if empty
      return {
        ...task,
        budgeted_hour: `${hours}:${minutes}`,  // Combine into HH:MM format
      };
    });
  };




  const addTask = () => {
    setTasks([...tasks, { task_name: '', budgeted_hour: '', task_id: null }]);
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const getJobTypeData = async (service_id) => {
    const req = { service_id, action: 'get' };
    const data = { req, authToken: token };
    await dispatch(JobType(data))
      .unwrap()
      .then(response => {
        if (response.status) {
          setFormData(data => ({ ...data, job_type_id: response.data }));
        }
      })
      .catch(error => console.log("Error fetching job types:", error));
  };

  const getTaskData = async (job_type_id) => {
    const req = { service_id: formData1.service_id, job_type_id };
    const data = { req, authToken: token };
    await dispatch(GETTASKDATA(data))
      .unwrap()
      .then(response => {
        if (response.status) {
          if (response.data.length > 0) {
            const taskData = response.data.map((item) => ({
              task_id: item.id,
              task_name: item.name,
              budgeted_hour: ""
            }));
            setTasks(taskData);
          } else {
            setTasks([{ task_name: '', budgeted_hour: '' }]);
          }
        }
      })
      .catch((error) => console.log("Error fetching job types:", error));
  };
  const handleSubmit = async () => {
    let validationErrors = {};

    // Validate form-level fields
    if (!formData1.service_id) validationErrors.service_id = "Service Type is required";
    if (!formData1.job_type_id) validationErrors.job_type_id = "Job Type is required";
    if (!formData1.client_type_id) validationErrors.client_type_id = "Client Type is required";
    if (!formData1.check_list_name) validationErrors.check_list_name = "Check List Name is required";
    if (!formData1.status) validationErrors.status = "Status is required";

    // Validate tasks-level fields
    tasks.forEach((task, index) => {
      if (!task.task_name) {
        validationErrors[`task_name_${index}`] = "Task Name is required";
      }
      if (!task.budgeted_hour || task.budgeted_hour.hours === '' || task.budgeted_hour.minutes === '') {
        validationErrors[`budgeted_hour_${index}`] = "Budgeted Hour is required";
      }
    });

    // If there are validation errors, set them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Display errors to the user
      return;
    }

    // Format the budgeted hours into HH:MM format
    const formattedTasks = formatBudgetedHours();

    // Create the request object
    const req = {
      ...formData1,
      task: formattedTasks.map(task => ({
        task_name: task.task_name,
        budgeted_hour: task.budgeted_hour,  // Now in HH:MM format
        task_id: task.task_id,
      })),
    };

    console.log("req", req);  // You can remove this once tested
    return; // Remove this return when ready to actually submit

    // Dispatch the request
    const data = { req, authToken: token };
    await dispatch(addChecklists(data))
      .unwrap()
      .then(response => {
        if (response.status) {
          sweatalert.fire({
            title: 'Success',
            text: response.message,
            icon: 'success',
            confirmButtonText: 'Ok',
          });

          // Reset form and tasks after successful submission
          setFormData({
            customer_id: location.state?.id || '',
            service_id: '',
            job_type_id: '',
            client_type_id: '',
            check_list_name: '',
            status: '',
          });
          setTasks([{ task_id: "", task_name: '', budgeted_hour: '' }]);

          // Redirect to Clientlist
          navigate('/admin/Clientlist', { state: { id: location.state.id, route: "Checklist" } });
        }
      })
      .catch((error) =>
        console.log("Error fetching job types:", error)
      );
  };





  return (
    <div className="container-fluid">
      <div className="content-title">


        <div className="card-header d-flex justify-content-between">
          <h3 className="card-title mb-0">Create New Checklist</h3>
          <button type="button" className="btn btn-info text-white blue-btn" onClick={() => navigate('/admin/Clientlist', { state: { id: location.state.id, route: "Checklist" } })}>Back</button>
        </div>



      </div>
      <div className="report-data mt-4">
        <div>
          <div className="row">
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    name="service_id"
                    defaultValue={formData.service_id}
                    onChange={(e) => {
                      handleInputChange(e);
                      getJobTypeData(e.target.value);
                    }}
                  >
                    <option value="">Please Select Service Type</option>
                    {formData.service_id && formData.service_id.map(service => (
                      <option key={service.service_id} value={service.service_id}>
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                  {errors.service_id && <p className="text-danger">{errors.service_id}</p>}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    name="job_type_id"
                    defaultValue={formData.job_type_id}
                    onChange={(e) => {
                      handleInputChange(e);
                      getTaskData(e.target.value);
                    }}
                  >
                    <option value="">Please Select Job Type</option>
                    {formData.job_type_id && formData.job_type_id.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.type}
                      </option>
                    ))}
                  </select>
                  {errors.job_type_id && <p className="text-danger">{errors.job_type_id}</p>}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    name="client_type_id"
                    defaultValue={formData.client_type_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Please Select Client Type</option>
                    {formData.client_type_id && formData.client_type_id.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.type}
                      </option>
                    ))}
                  </select>
                  {errors.client_type_id && <p className="text-danger">{errors.client_type_id}</p>}
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-3">
              <div className="mb-3 row flex-column">
                <div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Check List Name"
                    name="check_list_name"
                    defaultValue={formData.check_list_name}
                    onChange={handleInputChange}
                  />
                  {errors.check_list_name && <p className="text-danger">{errors.check_list_name}</p>}
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-3">
              <div className="row">
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    name="status"
                    defaultValue={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Please Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.status && <p className="text-danger">{errors.status}</p>}
                </div>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary mt-3" onClick={addTask}><i className='fa fa-plus'></i>Add Task</button>
          <div className="mt-4">
            {tasks.map((task, index) => (
              <div key={index} className="d-flex gap-3 mt-4">
                <div className="col-lg-5">
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
                    {errors[`task_name_${index}`] && (
                      <p className="text-danger">{errors[`task_name_${index}`]}</p>
                    )}
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="mb-3">
                    <label className="form-label">Budgeted Hours</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Hours"
                        name="hours"
                        defaultValue={task.budgeted_hour?.hours || ""}
                        onChange={(e) => handleTaskChange(index, e)}
                      />
                      {errors[`budgeted_hour_${index}`] && (
                        <p className="text-danger">{errors[`budgeted_hour_${index}`]}</p>
                      )}
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Minutes"
                        name="minutes"
                        defaultValue={task.budgeted_hour?.minutes || ""}
                        onChange={(e) => {
                          handleTaskChange(index, e)
                        }}
                        
                      />
                      {errors[`budgeted_minutes_${index}`] && (
                        <p className="text-danger">{errors[`budgeted_minutes_${index}`]}</p>
                      )}
                    </div>
                  </div>
                </div>

                <button className="btn" onClick={() => removeTask(index)}>
                  <i className="ti-trash text-danger fs-4"></i>
                </button>
              </div>
            ))}



          </div>

          <div className="col-lg-12 mt-4">
            <button className="btn btn-secondary " onClick={(e) => navigate('/admin/Clientlist', { state: { id: location.state.id, route: "Checklist" } })}>Cancel</button>
            <button className="btn btn-info ms-2" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCheckList;

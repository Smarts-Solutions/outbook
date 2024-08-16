import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { JobType, GetServicesByCustomers, GETTASKDATA } from '../../../../ReduxStore/Slice/Settings/settingSlice';

const CreateCheckList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem('token'));

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


  const [tasks, setTasks] = useState([
    { task_id: "", task_name: '', budgeted_hour: '' }
  ]);

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
  }, [formData.customer_id, dispatch, token]);




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData1(prev => ({ ...prev, [name]: value }));
  };


  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const newTasks = [...tasks];
    newTasks[index][name] = value;
    setTasks(newTasks);
  };



  const addTask = () => {
    setTasks([...tasks, { task_name: '', budgeted_hour: '' }]);
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
            var taskData = response.data.map((item) => {
              return { task_id: item.id, task_name: item.name, budgeted_hour: "" }
            })
            setTasks(taskData);
          }
          else {
            setTasks([{ task_name: '', budgeted_hour: '' }])
          }

        }
      })
      .catch(error => console.log("Error fetching job types:", error));

  };

  // Handle form submission
  const handleSubmit = async () => {
    const payload = {
      ...formData1,
      task: tasks.map(task => ({
        task_name: task.task_name,
        budgeted_hour: task.budgeted_hour,
        task_id:task.task_id
      })),
    };
    console.log('Submitting:', payload);
  };


  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="tab-title">
          <h3 className="mt-0">Create New Checklist</h3>
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
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
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
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className="row">
                <div className="col-lg-12">
                  <select
                    className="default-select wide form-select"
                    name="client_type_id"
                    defaultValue={formData.client_type_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Please Select Client Type</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
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
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="table-responsive table-card mt-3 mb-1">
            <table className="table align-middle table-nowrap" id="customerTable">
              <thead className="table-striped">
                <tr>
                  <th>Task Name</th>
                  <th>Budgeted Hour</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="list form-check-all">
                {tasks && tasks.map((task, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        name="task_name"
                        placeholder="Task Name"
                        value={task.task_name}
                        onChange={(e) => handleTaskChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        name="budgeted_hour"
                        placeholder="Budgeted Hour"
                        value={task.budgeted_hour}
                        onChange={(e) => handleTaskChange(index, e)}
                      />
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button onClick={addTask} className="edit-icon">
                          <i className="ti-plus" />
                        </button>
                        <button onClick={() => removeTask(index)} className="delete-icon">
                          <i className="ti-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary mt-3">Submit Checklist</button>
      </div>
    </div>
  );
};

export default CreateCheckList;

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  JobType,
  getList,
  UpdateChecklistData,
} from "../../../ReduxStore/Slice/Settings/settingSlice";
import {
  getAllCustomerDropDown,
  Get_Service
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { Save, Plus, ArrowLeft, X } from "lucide-react";
import Select from "react-select";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import sweatalert from "sweetalert2";

const EditCheckList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_id: [],
    service_id: [],
    job_type_id: [],
    client_type_id: "",
    check_list_name: "",
    work_flow_type: "",
    status: "1",
  });

  const [tasks, setTasks] = useState([
    { task_id: "", task_name: "", budgeted_hour: "", checklist_tasks_id: "" },
  ]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [customerAllData, setCustomerAllData] = useState([]);
  const [serviceAllData, setServiceAllData] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [selectedClientType, setSelectedClientType] = useState([]);

  const options = [
    { key: "1", label: "Sole Trader" },
    { key: "2", label: "Company" },
    { key: "3", label: "Partnership" },
    { key: "4", label: "Individual" },
  ];

  // For Customer Search
  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasMore, setCustomerHasMore] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const customerCache = useRef({});
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        getAllServices(),
        GetAllCustomer({ searchValue: "", pageNo: 1 })
      ]);
      
      const checklist_id = location.state?.checklist_id || location.state?.id;
      if (checklist_id) {
        await fetchChecklistDetails(checklist_id);
      } else {
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("fetchInitialData error", error);
      setIsLoaded(true);
    }
  };

  const fetchChecklistDetails = async (id) => {
    const req = { action: "getById", checklist_id: id };
    const data = { req, authToken: token };
    try {
      const response = await dispatch(getList(data)).unwrap();
      if (response.status && response.data) {
        const d = response.data;
        
        const mappedFormData = {
          customer_id: Array.isArray(d.customer_id) ? d.customer_id.map(id => id.toString()) : [],
          service_id: Array.isArray(d.service_id) ? d.service_id.map(id => id.toString()) : [],
          job_type_id: Array.isArray(d.job_type_id) ? d.job_type_id.map(id => id.toString()) : [],
          client_type_id: Array.isArray(d.client_type_id) ? d.client_type_id.join(",") : "",
          check_list_name: d.check_list_name || "",
          work_flow_type: d.work_flow_type || "",
          status: (d.status !== undefined && d.status !== null) ? d.status.toString() : "1",
        };

        setFormData(mappedFormData);
        if (Array.isArray(d.client_type_id)) {
          setSelectedClientType(d.client_type_id.map(id => id.toString()));
        }
        setTasks(d.task || []);
        
        if (Array.isArray(d.service_id) && d.service_id.length > 0) {
          getJobTypeData(d.service_id);
        }
      }
    } catch (error) {
      console.error("fetchChecklistDetails error", error);
    }
    setIsLoaded(true);
  };

  const GetAllCustomer = async ({ searchValue = "", pageNo = 1, append = false }) => {
    if (loadingCustomers) return;
    const cacheKey = `${searchValue}_${pageNo}`;

    if (customerCache.current[cacheKey]) {
      const cached = customerCache.current[cacheKey];
      setCustomerAllData((prev) => {
        const combined = [...prev, ...cached];
        return Array.from(new Map(combined.map((item) => [item.value, item])).values());
      });
      return;
    }

    setLoadingCustomers(true);
    const req = {
      action: "get_customers_filter",
      filters: { job_id: [], client_id: [] },
      pagination: { search: searchValue, page: pageNo, limit: 100 },
    };

    const data = { req, authToken: token };
    try {
      const response = await dispatch(getAllCustomerDropDown(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map((item) => ({
          value: item.id.toString(),
          label: item.trading_name,
        }));
        customerCache.current[cacheKey] = formatted;
        setCustomerAllData((prev) => {
          const combined = append ? [...prev, ...formatted] : formatted;
          return Array.from(new Map(combined.map((item) => [item.value, item])).values());
        });
        setCustomerHasMore(response.data.length === 100);
        setCustomerPage(pageNo);
      }
    } catch (error) { }
    setLoadingCustomers(false);
  };

  const handleCustomerSearch = (value) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCustomerSearch(value);
      GetAllCustomer({ searchValue: value, pageNo: 1 });
    }, 500);
  };

  const getAllServices = async () => {
    const req = { action: "get" };
    const data = { req, authToken: token };
    try {
      const response = await dispatch(Get_Service(data)).unwrap();
      if (response.status) {
        setServiceAllData(response.data);
      }
    } catch (error) { }
  };

  const getJobTypeData = async (service_ids) => {
    if (!Array.isArray(service_ids) || service_ids.length === 0) {
      setJobTypeOptions([]);
      return;
    }
    try {
      const calls = service_ids.map((service_id) => {
        const req = { service_id, action: "get" };
        const data = { req, authToken: token };
        return dispatch(JobType(data)).unwrap();
      });
      const responses = await Promise.all(calls);
      const allJobTypes = responses.filter((r) => r?.status).flatMap((r) => Array.isArray(r.data) ? r.data : []);
      const uniqueJobTypes = Array.from(new Map(allJobTypes.map((item) => [item.id.toString(), item])).values());
      setJobTypeOptions(uniqueJobTypes);
    } catch (error) {
      setJobTypeOptions([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (index, e) => {
    const { name, value } = e.target;
    const newTasks = [...tasks];
    if (name === "hours" || name === "minutes") {
      const current = newTasks[index].budgeted_hour || "00:00";
      let [h, m] = current.split(":");
      if (name === "hours") h = value.padStart(2, "0");
      else m = value.padStart(2, "0");
      newTasks[index].budgeted_hour = `${h}:${m}`;
    } else {
      newTasks[index][name] = value;
    }
    setTasks(newTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { task_name: "", budgeted_hour: "00:00", task_id: "", checklist_tasks_id: "" }]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation logic similar to Create
    if (!formData.check_list_name || !formData.work_flow_type || selectedClientType.length === 0) {
      sweatalert.fire("Error", "Please fill required fields", "error");
      return;
    }

    const req = {
      checklists_id: location.state.checklist_id,
      ...formData,
      client_type_id: selectedClientType.join(","),
      task: tasks.map(t => ({
        task_id: t.task_id,
        task_name: t.task_name,
        budgeted_hour: t.budgeted_hour,
        checklist_tasks_id: t.checklist_tasks_id
      }))
    };
    
    const data = { req, authToken: token };
    try {
      const resp = await dispatch(UpdateChecklistData(data)).unwrap();
      if (resp.status) {
        sweatalert.fire("Success", resp.message, "success");
        window.history.back();
      }
    } catch (err) {}
  };

  const handleMultipleSelect = (e) => {
    setSelectedClientType(e);
  };

  if (!isLoaded) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="card mt-4">
        <div className="card-header d-flex step-header-blue">
          <button type="button" className="btn p-0" onClick={() => window.history.back()}>
            <ArrowLeft size={16} />
          </button>
          <h3 className="card-title mb-0">Update Checklist</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4">
              <label className="form-label">CheckList Name</label>
              <input
                type="text"
                className="form-control"
                name="check_list_name"
                value={formData.check_list_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-lg-4">
              <label className="form-label">Work Flow Type</label>
              <select
                className="form-select"
                name="work_flow_type"
                value={formData.work_flow_type}
                onChange={handleInputChange}
              >
                <option value="">-- Select --</option>
                <option value="3">Processing Type</option>
                <option value="6">Reviewing Type</option>
              </select>
            </div>

            <div className="col-lg-4">
              <label className="form-label">Customer Name</label>
              <Select
                isMulti
                options={customerAllData}
                value={customerAllData.filter(opt => formData.customer_id.includes(opt.value))}
                onChange={(opts) => {
                  const values = opts ? opts.map(o => o.value) : [];
                  setFormData(p => ({ ...p, customer_id: values }));
                }}
                onInputChange={(v) => handleCustomerSearch(v)}
                className="select-staff"
              />
            </div>

            <div className="col-lg-4 mt-3">
              <label className="form-label">Service Type</label>
              <Select
                isMulti
                options={serviceAllData.map(s => ({ value: s.id.toString(), label: s.name }))}
                value={serviceAllData
                  .filter(s => formData.service_id.includes(s.id.toString()))
                  .map(s => ({ value: s.id.toString(), label: s.name }))}
                onChange={(opts) => {
                  const values = opts ? opts.map(o => o.value) : [];
                  setFormData(p => ({ ...p, service_id: values, job_type_id: [] }));
                  getJobTypeData(values);
                }}
              />
            </div>

            <div className="col-lg-4 mt-3">
              <label className="form-label">Job Type</label>
              <Select
                isMulti
                options={jobTypeOptions.map(j => ({ value: j.id.toString(), label: j.type }))}
                value={jobTypeOptions
                  .filter(j => formData.job_type_id.includes(j.id.toString()))
                  .map(j => ({ value: j.id.toString(), label: j.type }))}
                onChange={(opts) => {
                  const values = opts ? opts.map(o => o.value) : [];
                  setFormData(p => ({ ...p, job_type_id: values }));
                }}
              />
            </div>

            <div className="col-lg-4 mt-3">
              <label className="form-label">Client Type</label>
              <DropdownMultiselect
                options={options}
                handleOnChange={handleMultipleSelect}
                selected={selectedClientType}
              />
            </div>

            <div className="col-lg-4 mt-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          {/* <div className="mt-4">
            <button className="btn btn-info" onClick={addTask}><Plus size={16} /> Add Task</button>
          </div> */}

          {/* {tasks.map((task, index) => (
            <div key={index} className="row mt-3 align-items-end">
              <div className="col-lg-5">
                <label className="form-label">Task Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="task_name"
                  value={task.task_name}
                  onChange={(e) => handleTaskChange(index, e)}
                  disabled={task.task_id}
                />
              </div>
              <div className="col-lg-5">
                <label className="form-label">Budgeted Time</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    name="hours"
                    placeholder="HH"
                    value={task.budgeted_hour?.split(":")[0] || ""}
                    onChange={(e) => handleTaskChange(index, e)}
                  />
                  <span className="input-group-text">H</span>
                  <input
                    type="number"
                    className="form-control"
                    name="minutes"
                    placeholder="MM"
                    max="59"
                    value={task.budgeted_hour?.split(":")[1] || ""}
                    onChange={(e) => handleTaskChange(index, e)}
                  />
                  <span className="input-group-text">M</span>
                </div>
              </div>
              <div className="col-lg-2">
                <button className="btn text-danger" onClick={() => removeTask(index)}><i className="ti-trash"></i></button>
              </div>
            </div>
          ))} */}

          <div className="mt-4">
            <button className="btn btn-secondary" onClick={() => window.history.back()}><X size={16} /> Cancel</button>
            <button className="btn btn-outline-success ms-2" onClick={handleSubmit}><Save size={16} /> Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCheckList;

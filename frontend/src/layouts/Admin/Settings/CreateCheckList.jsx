import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  JobType,
  GETTASKDATA,
  getList,
  addChecklists,
} from "../../../ReduxStore/Slice/Settings/settingSlice";
import { Get_Service } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import { Save, Plus, ArrowLeft, X } from "lucide-react";

const CreateCheckList = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
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

  useEffect(() => {
    getAllServices();
  }, []);

  const getAllServices = async () => {
    const req = { action: "get" };
    const data = { req, authToken: token };
    await dispatch(Get_Service(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setFormData((data) => ({ ...data, service_id: response.data }));
        }
      })
      .catch((error) => {
        return;
      });
  };

  const fieldErrors = {
    work_flow_type: "Please Select Work Flow Type",
    // service_id: "Please Select Service Type",
    // job_type_id: "Please Select Job Type",
    check_list_name: "Please Enter CheckList Name",
    // status: "Please Select Status",
  };

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value?.trim(),
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
      if (!value) {
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


  const handleSubmit = async () => {
    let validationErrors = {};

    const isValid = validateAllFields();
    if (!isValid) {
      return;
    }
    if (selectedClientType.length == 0) {
      setErrors({ ...errors, client_type_id: "Please Select Client Type" });
      return;
    }
   
    if (Object.keys(validationErrors).length > 0) {
      setErrors1(validationErrors);
      return;
    }

    let ClienTypeArr = "";
    selectedClientType.map((item) => {
      ClienTypeArr += item + ",";
    });

    const req = {
      ...formData,
      client_type_id: ClienTypeArr.slice(0, -1)
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
            timer: 1000,
            timerProgressBar: true,
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

          sessionStorage.setItem("settingTab", location?.state?.settingTab);
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

  console.log("formData",formData)

  return (
    <div className="container-fluid">
      <div className="card mt-4">
        <div className="card-header d-flex step-header-blue">
          <button
            type="button"
            className="btn p-0"
            onClick={() => {
              sessionStorage.setItem("settingTab", location?.state?.settingTab);
              window.history.back();
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <h3 className="card-title mb-0">Create New Checklist</h3>
        </div>
        <div className="card-body">
          <div className="row">

             <div className="col-lg-4">
              <div className=" row flex-column">
                <div>
                  <label className="form-label">CheckList Name</label>
                  <input
                    type="text"
                    className={
                      errors.check_list_name
                        ? "error-field form-control"
                        : "form-control"
                    }
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

            <div className="col-lg-4 mb-lg-0 mb-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Work Flow Type</label>
                  <select
                    className={
                      errors.work_flow_type
                        ? "error-field form-select"
                        : "form-select"
                    }
                    name="work_flow_type"
                    defaultValue={formData.work_flow_type}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  >
                  <option value=""> -- Select --</option>
                    
                  </select>
                  {errors.work_flow_type && (
                    <p className="mb-0 error-text">{errors.work_flow_type}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-lg-0 mb-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Service Type</label>
                  <select
                    className={
                      errors.service_id
                        ? "error-field form-select"
                        : "form-select"
                    }
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
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                  </select>
                  
                </div>
              </div>
            </div>

            <div className="col-lg-4 mt-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Job Type</label>
                  <select
                    className={
                      errors.job_type_id
                        ? "error-field form-select"
                        : "form-select"
                    }
                    // className="default-select wide form-select"
                    name="job_type_id"
                    defaultValue={formData.job_type_id}
                    onChange={(e) => {
                      handleInputChange(e);
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
                  
                </div>
              </div>
            </div>

            <div className="col-lg-4 mt-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Client Type</label>
                  <div className="custom-multiselect">
                    <DropdownMultiselect
                      options={options}
                      name="client_type_id"
                      className=""
                      handleOnChange={(e) => handleMultipleSelect(e)}
                    />
                  </div>
                  
                </div>
              </div>
            </div>

            <div className="col-lg-4 mt-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Status</label>

                  <select
                    className={
                      errors.status ? "error-field form-select" : "form-select"
                    }
                    name="status"
                    value={formData.status}
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


          <div className="col-lg-12 mt-4">
            <button
              className="btn btn-secondary "
              onClick={(e) => {
                sessionStorage.setItem(
                  "settingTab",
                  location?.state?.settingTab,
                );
                window.history.back();
              }}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              className="btn btn-outline-success ms-2"
              onClick={handleSubmit}
            >
              <Save size={16} /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCheckList;

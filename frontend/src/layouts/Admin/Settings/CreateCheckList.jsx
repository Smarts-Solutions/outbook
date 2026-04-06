import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  JobType,
  GETTASKDATA,
  getList,
  addChecklists,
} from "../../../ReduxStore/Slice/Settings/settingSlice";
import {
  getAllCustomerDropDown
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { Get_Service } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import { Save, Plus, ArrowLeft, X } from "lucide-react";
import Select from "react-select";
import * as XLSX from "xlsx";


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
  const [loading, setLoading] = useState(false);
  const [customerAllData, setCustomerAllData] = useState([]);
  const [serviceAllData, setServiceAllData] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    customer_id: [],
    service_id: [],
    job_type_id: [],
    client_type_id: "",
    check_list_name: "",
    work_flow_type: "",
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
    { key: "5", label: "Charity Incorporated Organisation" },
    { key: "6", label: "Unincorporated Association" },
    { key: "7", label: "Trust" },
  ];



  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
      ];

      if (!allowedTypes.includes(file.type)) {
        sweatalert.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Only CSV or Excel files allowed",
        });
        e.target.value = null;
        setSelectedFile(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const binaryData = event.target.result;
          const workbook = XLSX.read(binaryData, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (rows.length === 0) {
            sweatalert.fire({
              icon: "error",
              title: "Invalid File",
              text: "The uploaded file is empty.",
            });
            e.target.value = null;
            setSelectedFile(null);
            return;
          }

          const expectedHeaders = ["S.No", "Questions", "Yes", "No", "Not Applicable", "Comment", "Date"];
          const headers = rows[0].map(h => (h ? h.toString().trim() : ""));

          // 1. Check if headers count matches (no extra, no less)
          if (headers.length !== expectedHeaders.length) {
            sweatalert.fire({
              icon: "error",
              title: "Invalid Format",
              text: `The file format is invalid. Please ensure there are exactly ${expectedHeaders.length} columns: ${expectedHeaders.join(", ")}.`,
            });
            e.target.value = null;
            setSelectedFile(null);
            return;
          }

          // 2. Check if header names match exactly
          const isHeaderValid = expectedHeaders.every((val, index) => val === headers[index]);
          if (!isHeaderValid) {
            sweatalert.fire({
              icon: "error",
              title: "Invalid Format",
              text: "Column headers do not match the required format. Please don't change any heading.",
            });
            e.target.value = null;
            setSelectedFile(null);
            return;
          }

          const dataRows = rows.slice(1);
          // Find the last row index that has any data
          let lastNonEmptyIndex = -1;
          for (let i = dataRows.length - 1; i >= 0; i--) {
            const row = dataRows[i];
            if (row && row.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== "")) {
              lastNonEmptyIndex = i;
              break;
            }
          }

          if (lastNonEmptyIndex === -1) {
            sweatalert.fire({
              icon: "error",
              title: "No Data found",
              text: "The file must contain at least one question and should not be empty.",
            });
            e.target.value = null;
            setSelectedFile(null);
            return;
          }

          let isDataFormatValid = true;
          let errorMessage = "";
          let expectedSNo = 1;

          // Only validate up to the last non-empty row to allow trailing empty rows
          for (let i = 0; i <= lastNonEmptyIndex; i++) {
            const row = dataRows[i];
            
            // 3. Skip empty rows in the middle of data instead of throwing error
            if (!row || row.every(cell => cell === null || cell === undefined || cell.toString().trim() === "")) {
              continue;
            }

            // 4. Comment out S.No (index 0) validation as requested
            /*
            const sNoVal = row[0];
            if (sNoVal === null || sNoVal === undefined || sNoVal.toString().trim() === "") {
              isDataFormatValid = false;
              errorMessage = `Error at row ${i + 2}: The 'S.No' column should have data.`;
              break;
            }

            const currentSNo = parseInt(sNoVal.toString().trim());
            if (isNaN(currentSNo)) {
              isDataFormatValid = false;
              errorMessage = `Error at row ${i + 2}: The 'S.No' must be a number.`;
              break;
            }

            if (currentSNo !== expectedSNo) {
              isDataFormatValid = false;
              errorMessage = `Error at row ${i + 2}: The 'S.No' must be in increasing order starting from 1 with no gaps. Expected ${expectedSNo} but found ${currentSNo}.`;
              break;
            }
            */

            // 5. Check data in Question column (index 1)
            const questionVal = row[1];
            if (!questionVal || questionVal.toString().trim() === "") {
              isDataFormatValid = false;
              errorMessage = `Error at row ${i + 2}: The 'Questions' column should have data.`;
              break;
            }

            // 6. Check if other columns have data (index 2 to end)
            for (let j = 2; j < row.length; j++) {
              if (row[j] !== null && row[j] !== undefined && row[j].toString().trim() !== "") {
                isDataFormatValid = false;
                errorMessage = `Invalid data at row ${i + 2}. Data should only be in 'S.No' and 'Questions' columns. All other columns must remain empty.`;
                break;
              }
            }
            if (!isDataFormatValid) break;

            expectedSNo++;
          }

          if (!isDataFormatValid) {
            sweatalert.fire({
              icon: "error",
              title: "Invalid Format",
              text: errorMessage,
            });
            e.target.value = null;
            setSelectedFile(null);
            return;
          }

          setSelectedFile(file);
        } catch (error) {
          console.error("File processing error:", error);
          sweatalert.fire({
            icon: "error",
            title: "Error",
            text: "Could not process the file. Please use a valid CSV or Excel file.",
          });
          e.target.value = null;
          setSelectedFile(null);
        }
      };

      reader.onerror = () => {
        sweatalert.fire({
          icon: "error",
          title: "Error",
          text: "Failed to read the file.",
        });
        e.target.value = null;
        setSelectedFile(null);
      };

      reader.readAsBinaryString(file);
    }
  };


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
    GetAllCustomer({ searchValue: "", pageNo: 1 });
  }, []);

  ///////////////---- FOR CUSTOMER SERACH  START-----//////////////
  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasMore, setCustomerHasMore] = useState(true);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const customerCache = useRef({});
  const debounceRef = useRef(null);

  const GetAllCustomer = async ({ searchValue = "", pageNo = 1, append = false }) => {
    if (loading) return;
    const cacheKey = `${searchValue}_${pageNo}`;

    if (customerCache.current[cacheKey]) {
      const cached = customerCache.current[cacheKey];
      setCustomerAllData((prev) => {
        const combined = [...prev, ...cached];
        const unique = Array.from(
          new Map(combined.map((item) => [item.value, item])).values(),
        );
        return unique;
      });
      return;
    }

    setLoading(true);
    const req = {
      action: "get_customers_filter",
      filters: {
        job_id: [],
        client_id: []
      },
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: 20,
      },
    };

    const data = { req: req, authToken: token };
    try {
      const response = await dispatch(getAllCustomerDropDown(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map((item) => ({
          value: item.id,
          label: item.trading_name,
        }));

        customerCache.current[cacheKey] = formatted;

        // setCustomerAllData(prev =>
        //   append ? [...prev, ...formatted] : formatted
        // );
        setCustomerAllData((prev) => {
          const combined = [...prev, ...formatted];
          const unique = Array.from(
            new Map(combined.map((item) => [item.value, item])).values(),
          );
          return unique;
        });

        setCustomerHasMore(response.data.length === 20);
        setCustomerPage(pageNo);
      } else {
        if (!append) setCustomerAllData([]);
      }
    } catch (error) { }

    setLoading(false);
  };

  const handleCustomerSearch = (value) => {
    if (value === "") {
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCustomerSearch(value);
      GetAllCustomer({
        searchValue: value,
        pageNo: 1,
      });
    }, 500);
  };

  ///////////////---- FOR CUSTOMER SERACH  END-----//////////////

  const getAllServices = async () => {
    const req = { action: "get" };
    const data = { req, authToken: token };
    await dispatch(Get_Service(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setServiceAllData(response.data)
          // setFormData((data) => ({ ...data, service_id: response.data }));
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
    client_type_id: "Please Select Client Type",
  };

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      // [name]: value?.trim(),
      [name]: value
    }));
    validate(name, value);
  };

  const validate = (name, value, isSubmitting = false) => {
    const newErrors = { ...errors };
    if (isSubmitting) {
      for (const key in fieldErrors) {
        if (!formData[key]) {
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

  // const validateAllFields = () => {
  //   let isValid = true;
  //   for (const key in formData) {
  //     if (!validate(key, formData[key], true)) {
  //       isValid = false;
  //     }
  //   }
  //   return isValid;
  // };

  const validateAllFields = () => {
    let isValid = true;
    let newErrors = {};

    for (const key in fieldErrors) {
      if (key === "client_type_id") {
        if (selectedClientType.length === 0) {
          newErrors[key] = fieldErrors[key];
          isValid = false;
        }
      } else {
        if (!formData[key]) {
          newErrors[key] = fieldErrors[key];
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const getJobTypeData = async (service_ids) => {
    if (!Array.isArray(service_ids) || service_ids.length === 0) {
      setJobTypeOptions([]);
      setFormData((data) => ({ ...data, job_type_id: [] }));
      return;
    }

    try {
      const calls = service_ids.map((service_id) => {
        const req = { service_id, action: "get" };
        const data = { req, authToken: token };
        return dispatch(JobType(data)).unwrap();
      });

      const responses = await Promise.all(calls);
      const allJobTypes = responses
        .filter((r) => r?.status)
        .flatMap((r) => Array.isArray(r.data) ? r.data : []);

      const uniqueJobTypes = Array.from(
        new Map(allJobTypes.map((item) => [item.id, item])).values(),
      );

      setJobTypeOptions(uniqueJobTypes);
      setFormData((data) => ({ ...data, job_type_id: [] }));
    } catch (error) {
      console.error("getJobTypeData error", error);
      setJobTypeOptions([]);
      setFormData((data) => ({ ...data, job_type_id: [] }));
    }
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

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("check_list_name", formData.check_list_name);
    formDataToSubmit.append("work_flow_type", formData.work_flow_type);
    formDataToSubmit.append("client_type_id", ClienTypeArr.slice(0, -1));
    formDataToSubmit.append("status", formData.status);

    formDataToSubmit.append("customer_id", formData.customer_id?.join(","));
    formDataToSubmit.append("service_id", formData.service_id?.join(","));
    formDataToSubmit.append("job_type_id", formData.job_type_id?.join(","));

    if (selectedFile) {
      formDataToSubmit.append("checklist_excel", selectedFile);
    }

    const data = { req: formDataToSubmit, authToken: token };
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

          // Reset form, tasks, and files after successful submission
          setFormData({
            customer_id: [],
            service_id: [],
            job_type_id: [],
            client_type_id: "",
            check_list_name: "",
            work_flow_type: "",
            status: "1",
          });
          setJobTypeOptions([]);
          setTasks([{ task_id: "", task_name: "", budgeted_hour: "" }]);
          setSelectedFile(null);

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
                    <option value="3">Processing Type</option>
                    <option value="6">Reviewing Type</option>

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
                  <label className="form-label">Customer Name</label>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    options={customerAllData}
                    value={customerAllData.filter((opt) =>
                      formData?.customer_id?.includes(opt.value),
                    )}

                    onChange={(selectedOptions) => {
                      const values = selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : [];
                      handleInputChange({
                        target: {
                          name: "customer_id",
                          value: values,
                        },
                      });

                      // Call API only when empty
                      if (values.length === 0) {
                        setCustomerHasMore(true);
                        setCustomerPage(1);
                        setCustomerSearch("");
                        setCustomerAllData([]);
                        customerCache.current = {};
                        GetAllCustomer({ searchValue: "", pageNo: 1 });
                      }
                    }}
                    onInputChange={(value) => handleCustomerSearch(value)}
                    onMenuScrollToBottom={() => {
                      if (customerHasMore) {
                        GetAllCustomer({
                          searchValue: customerSearch,
                          pageNo: customerPage + 1,
                          append: true,
                        });
                      }
                    }}
                    isSearchable
                    className="shadow-sm select-staff rounded-pill"
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  />

                </div>
              </div>
            </div>

            <div className="col-lg-4 mt-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Service Type</label>

                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    options={serviceAllData?.map((service) => ({
                      value: service.id,
                      label: service.name,
                    }))}
                    value={serviceAllData
                      .filter((service) => formData.service_id?.includes(service.id))
                      .map((service) => ({
                        value: service.id,
                        label: service.name,
                      }))}

                    onChange={(selectedOptions) => {
                      const values = selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : [];
                      handleInputChange({
                        target: {
                          name: "service_id",
                          value: values,
                        },
                      });
                      getJobTypeData(values);
                    }}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  />

                </div>
              </div>
            </div>

            <div className="col-lg-4 mt-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Job Type</label>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    options={jobTypeOptions.map((job) => ({
                      value: job.id,
                      label: job.type,
                    }))}
                    value={jobTypeOptions
                      .filter((job) => formData.job_type_id?.includes(job.id))
                      .map((job) => ({
                        value: job.id,
                        label: job.type,
                      }))}

                    onChange={(selectedOptions) => {
                      const values = selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : [];
                      handleInputChange({
                        target: {
                          name: "job_type_id",
                          value: values,
                        },
                      });
                    }}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  />

                </div>
              </div>
            </div>

            <div className="col-lg-4 mt-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Client Type</label>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    options={options.map((opt) => ({
                      value: opt.key,
                      label: opt.label,
                    }))}
                    value={options
                      .filter((opt) => selectedClientType.includes(opt.key))
                      .map((opt) => ({ value: opt.key, label: opt.label }))}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : [];
                      handleMultipleSelect(values);
                    }}
                    className={errors.client_type_id ? "field-error" : ""}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  />
                  {errors.client_type_id && (
                    <p className="mb-0 error-text">{errors.client_type_id}</p>
                  )}
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



            <div className="col-lg-4 mt-3">
              <div className="row">
                <div className="col-lg-12">
                  <label className="form-label">Upload File (CSV / Excel) <a href="/sample_checklist.csv" download className="ms-2 text-primary" style={{ fontSize: "12px", textDecoration: "underline" }}>Download Sample File</a></label>

                  <input
                    type="file"
                    accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="form-control"
                    onChange={handleFileChange}
                  />

                  {selectedFile && (
                    <p className="mt-2 text-success">
                      Selected File: {selectedFile.name}
                    </p>
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

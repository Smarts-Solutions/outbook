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
import { Save, ArrowLeft, X } from "lucide-react";
import Select from "react-select";
import sweatalert from "sweetalert2";
import * as XLSX from "xlsx";
import { base_url } from "../../../Utils/Config";

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

  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [customerAllData, setCustomerAllData] = useState([]);
  const [serviceAllData, setServiceAllData] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [selectedClientType, setSelectedClientType] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFile, setExistingFile] = useState("");
  const [allExistIds, setAllExistIds] = useState({});

  console.log("allExistIds", allExistIds);

  const options = [
    { key: "1", label: "Sole Trader" },
    { key: "2", label: "Company" },
    { key: "3", label: "Partnership" },
    { key: "4", label: "Individual" },
    { key: "5", label: "Charity Incorporated Organisation" },
    { key: "6", label: "Unincorporated Association" },
    { key: "7", label: "Trust" },
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
      console.log("response", response);
      if (response.status && response?.data?.result) {
        const d = response?.data?.result;

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
        setExistingFile(d.upload_checklist_name || "");
        if (Array.isArray(d.client_type_id)) {
          setSelectedClientType(d.client_type_id.map(id => id.toString()));
        }

        if (Array.isArray(d.service_id) && d.service_id.length > 0) {
          getJobTypeData(d.service_id);
        }

        setAllExistIds(response?.data?.allExistIds || {});
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

          for (let i = 0; i <= lastNonEmptyIndex; i++) {
            const row = dataRows[i];

            if (!row || row.every(cell => cell === null || cell === undefined || cell.toString().trim() === "")) {
              continue;
            }

            // Comment out S.No (index 0) validation as requested
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

            const questionVal = row[1];
            if (!questionVal || questionVal.toString().trim() === "") {
              isDataFormatValid = false;
              errorMessage = `Error at row ${i + 2}: The 'Questions' column should have data.`;
              break;
            }

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

  const fieldErrors = {
    work_flow_type: "Please Select Work Flow Type",
    check_list_name: "Please Enter CheckList Name",
    client_type_id: "Please Select Client Type",
  };

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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

  const handleSubmit = async () => {
    const isValid = validateAllFields();
    if (!isValid) {
      return;
    }

    const checklist_id = location.state?.checklist_id || location.state?.id;
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("checklists_id", checklist_id);
    formDataToSubmit.append("check_list_name", formData.check_list_name);
    formDataToSubmit.append("work_flow_type", formData.work_flow_type);
    formDataToSubmit.append("client_type_id", selectedClientType.join(","));
    formDataToSubmit.append("status", formData.status);
    formDataToSubmit.append("customer_id", formData.customer_id?.join(","));
    formDataToSubmit.append("service_id", formData.service_id?.join(","));
    formDataToSubmit.append("job_type_id", formData.job_type_id?.join(","));

    if (selectedFile) {
      formDataToSubmit.append("checklist_excel", selectedFile);
    }

    const data = { req: formDataToSubmit, authToken: token };
    try {
      const resp = await dispatch(UpdateChecklistData(data)).unwrap();
      if (resp.status) {
        sweatalert.fire({
          title: "Success",
          text: resp.message,
          icon: "success",
          confirmButtonText: "Ok",
          timer: 1000,
          timerProgressBar: true,
        });
        window.history.back();
      }
    } catch (err) { }
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
                    value={formData.check_list_name}
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
                    value={formData.work_flow_type}
                    onChange={handleInputChange}
                  >

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
                  {/* <Select
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
                      setFormData((p) => ({ ...p, customer_id: values }));
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
                  /> */}

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

                      let finalValues = values;
                      if (values.length > 0) {

                        const confirmSelect = window.confirm(
                          "Are you sure you want to select this customer?"
                        );

                        if (confirmSelect) {
                          if(allExistIds?.customer_ids?.length > 0){
                            finalValues = [...new Set([...values, ...allExistIds?.customer_ids])];
                          }else{
                            finalValues = values
                          }
                        } else {
                          return
                        }
                      }


                      setFormData((p) => ({
                        ...p,
                        customer_id: finalValues
                      }));


                      // Reset logic
                      if (finalValues.length === 0) {
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
                    styles={{
                      menuPortal: base => ({
                        ...base,
                        zIndex: 9999
                      })
                    }}
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
                    options={serviceAllData.map((s) => ({
                      value: s.id.toString(),
                      label: s.name,
                    }))}
                    value={serviceAllData
                      .filter((s) =>
                        formData.service_id.includes(s.id.toString()),
                      )
                      .map((s) => ({ value: s.id.toString(), label: s.name }))}

                    onChange={(opts) => {

                      const values = opts ? opts.map((o) => o.value) : [];
                      let finalValues = values;
                      if (values.length > 0) {

                        const confirmSelect = window.confirm(
                          "Are you sure you want to select this service?"
                        );

                        if (confirmSelect) {
                          if (allExistIds?.service_ids?.length > 0) {
                            finalValues = [...new Set([...values, ...allExistIds?.service_ids])];
                          } else {
                            finalValues = [...new Set([...values])];
                          }
                        } else {
                          return
                        }
                      }
                      setFormData((p) => ({
                        ...p,
                        service_id: finalValues,
                        job_type_id: [],
                      }));
                      getJobTypeData(finalValues);


                      // const values = opts ? opts.map((o) => o.value) : [];
                      // setFormData((p) => ({
                      //   ...p,
                      //   service_id: values,
                      //   job_type_id: [],
                      // }));
                      // getJobTypeData(values);
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
                    options={jobTypeOptions.map((j) => ({
                      value: j.id.toString(),
                      label: j.type,
                    }))}
                    value={jobTypeOptions
                      .filter((j) =>
                        formData.job_type_id.includes(j.id.toString()),
                      )
                      .map((j) => ({ value: j.id.toString(), label: j.type }))}

                    onChange={(opts) => {

                      const values = opts ? opts.map((o) => o.value) : [];
                      let finalValues = values;
                      if (values.length > 0) {

                        const confirmSelect = window.confirm(
                          "Are you sure you want to select this job type?"
                        );

                        if (confirmSelect) {
                          if (allExistIds?.job_type_ids?.length > 0) {
                            finalValues = [...new Set([...values, ...allExistIds?.job_type_ids])];
                          } else {
                            finalValues = [...new Set([...values])];
                          }
                        } else {
                          return
                        }
                      }
                      setFormData((p) => ({
                        ...p,
                        job_type_id: finalValues
                      }));


                      // const values = opts ? opts.map((o) => o.value) : [];
                      // setFormData((p) => ({ ...p, job_type_id: values }));

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

                      const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];

                
                      let finalValues = values;
                      if (values.length > 0) {

                        const confirmSelect = window.confirm(
                          "Are you sure you want to select this client type?"
                        );



                        if (confirmSelect) {
                          if (allExistIds?.client_type_ids?.length > 0) {
                            finalValues = [...new Set([...values, ...allExistIds?.client_type_ids])];
                          } else {
                            finalValues = [...new Set([...values])];
                          }
                        } else {
                          return
                        }
                      }

                      handleMultipleSelect(finalValues);


                      // const values = selectedOptions
                      //   ? selectedOptions.map((opt) => opt.value)
                      //   : [];
                      // handleMultipleSelect(values);
                    }}
                    className={errors.client_type_id ? "error-field" : ""}
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
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="mb-0 error-text">{errors.status}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-12 mt-3">
              <label className="form-label">Upload File (CSV / Excel) </label>
              <div className="d-flex align-items-center">
                <input
                  type="file"
                  className="form-control w-50"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                />

                <div className="ms-3">
                  {existingFile ? (
                    <div className="d-flex flex-column">
                      <span className="text-muted small">Previously Uploaded:</span>
                      <a
                        href={`${base_url}downloadChecklist/${location.state?.checklist_id || location.state?.id}`}
                        className="text-primary text-decoration-none fw-bold"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {existingFile}
                      </a>
                    </div>
                  ) : (
                    <span className="text-danger small">No file uploaded previously</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12 mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => window.history.back()}
            >
              <X size={16} /> Cancel
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

export default EditCheckList;

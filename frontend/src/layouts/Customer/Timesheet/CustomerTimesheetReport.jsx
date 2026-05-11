import React, { useState, useEffect, useRef } from "react";
import {
  CustomerTimesheetReports,
  CustomerGetAllTaskByStaff,
} from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import {
  getAllCustomerDropDown,
  JobAction,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
import sweatalert from "sweetalert2";
import { Trash, Download } from "lucide-react";

function CustomerTimesheetReport() {
  const noDataImage = "/assets/images/No-data-amico.png";
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const today = new Date().toISOString().split("T")[0];
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = staffDetails?.role;
  const [showData, setShowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [staffAllData, setStaffAllData] = useState([]);
  const [customerAllData, setCustomerAllData] = useState([]);
  const [clientAllData, setClientAllData] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [taskAllData, setTaskAllData] = useState([]);

  const [internalJobAllData, setInternalJobAllData] = useState([]);
  const [internalTaskAllData, setInternalTaskAllData] = useState([]);
  const [employeeNumberAllData, setEmployeeNumberAllData] = useState([]);

  const [getAllFilterData, setGetAllFilterData] = useState([]);
  const [filterId, setFilterId] = useState(null);

  const [filters, setFilters] = useState({
    groupBy: ["staff_id"],
    internal_external: "0",
    fieldsToDisplay: null,
    fieldsToDisplayId: null,
    staff_id: null,
    employee_number: null,
    customer_id: null,
    client_id: null,
    job_id: null,
    task_id: null,
    internal_job_id: null,
    internal_task_id: null,
    timePeriod: "this_month",
    displayBy: "Weekly",
    fromDate: null,
    toDate: null,
  });

  const [staffPage, setStaffPage] = useState(1);
  const [staffHasMore, setStaffHasMore] = useState(true);
  const [staffSearch, setStaffSearch] = useState("");
  const staffCache = useRef({});
  const staffDebounceRef = useRef(null);

  const GetAllStaff = async ({ searchValue = "", pageNo = 1, append = false }) => {
    const cacheKey = `${searchValue}_${pageNo}`;
    if (staffCache.current[cacheKey]) {
      const cached = staffCache.current[cacheKey];
      setStaffAllData(prev => {
        const combined = append ? [...prev, ...cached] : cached;
        return Array.from(new Map(combined.map(item => [item.value, item])).values());
      });
      return;
    }
    const req = { action: "get", page: pageNo, limit: 20, search: searchValue };
    const data = { req: req, authToken: token };
    try {
      const response = await dispatch(Staff(data)).unwrap();
      if (response.status) {
        const formatted = response.data.data.map((item) => ({
          value: item.id,
          label: `${item.first_name} ${item.last_name} (${item.email})`
        }));
        staffCache.current[cacheKey] = formatted;
        setStaffAllData(prev => {
          const combined = append ? [...prev, ...formatted] : formatted;
          return Array.from(new Map(combined.map(item => [item.value, item])).values());
        });
        setStaffHasMore(response.data.data.length === 20);
        setStaffPage(pageNo);
      }
    } catch (error) { }
  };

  const handleStaffSearch = (value) => {
    clearTimeout(staffDebounceRef.current);
    staffDebounceRef.current = setTimeout(() => {
      setStaffSearch(value);
      setStaffPage(1);
      staffCache.current = {};
      GetAllStaff({ searchValue: value, pageNo: 1 });
    }, 500);
  };

  const employeeData = async () => {
    var req = { action: "getStaffWithRole", role_id: "employee_number" };
    var data = { req: req, authToken: token };
    await dispatch(CustomerGetAllTaskByStaff(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          const data = response?.data
            ?.filter((item) => ![null, "", "null", undefined].includes(item.employee_number))
            ?.map((item) => ({ value: item.employee_number, label: `${item.employee_number}` }));
          setEmployeeNumberAllData(data);
        }
      });
  };

  const getAllFilters = async () => {
    var req = { action: "getAllFilters", type: "timesheet_report" };
    var data = { req: req, authToken: token };
    await dispatch(CustomerGetAllTaskByStaff(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: `
            Group By : [${JSON.parse(item?.groupBy)?.map((it) => it.replace(/_id$/i, ""))}]<br/>
            ${item.staff_fullname ? `â®ž Staff : ${item.staff_fullname}<br/>` : ""}
            ${item.customer_name ? `â®ž Customer : ${item.customer_name}<br/>` : ""}
            ${item.client_name ? `â®ž Client : ${item.client_name}<br/>` : ""}
            ${item.job_name ? `â®ž Job : ${item.job_name}<br/>` : ""}
            ${item.task_name ? `â®ž Task : ${item.task_name}<br/>` : ""}
            ${item.internal_job_name ? `â®ž Internal Job : ${item.internal_job_name}<br/>` : ""}
            ${item.internal_task_name ? `â®ž Internal Task : ${item.internal_task_name}<br/>` : ""}
          `,
            filters: item.filter_record,
          }));
          setGetAllFilterData(data);
        }
      });
  };

  useEffect(() => {
    GetAllStaff({ searchValue: "", pageNo: 1 });
    getAllFilters();
    employeeData();
    GetAllJobs_internal("0");
    GetAllTask("0");
  }, []);

  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasMore, setCustomerHasMore] = useState(true);
  const [customerSearch, setCustomerSearch] = useState("");
  const customerCache = useRef({});
  const debounceRef = useRef(null);

  const GetAllCustomer = async ({ searchValue = "", pageNo = 1, append = false }) => {
    const cacheKey = `${searchValue}_${pageNo}`;
    if (customerCache.current[cacheKey]) {
      const cached = customerCache.current[cacheKey];
      setCustomerAllData(prev => {
        const combined = append ? [...prev, ...cached] : cached;
        return Array.from(new Map(combined.map(item => [item.value, item])).values());
      });
      return;
    }
    const req = { action: "get_customers_filter", filters: filters, pagination: { search: searchValue, page: pageNo, limit: 20 } };
    const data = { req: req, authToken: token };
    try {
      const response = await dispatch(getAllCustomerDropDown(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map((item) => ({ value: item.id, label: item.trading_name }));
        customerCache.current[cacheKey] = formatted;
        setCustomerAllData(prev => {
          const combined = append ? [...prev, ...formatted] : formatted;
          return Array.from(new Map(combined.map(item => [item.value, item])).values());
        });
        setCustomerHasMore(response.data.length === 20);
        setCustomerPage(pageNo);
      }
    } catch (error) { }
  };

  const handleCustomerSearch = (value) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCustomerSearch(value);
      setCustomerPage(1);
      customerCache.current = {};
      GetAllCustomer({ searchValue: value, pageNo: 1 });
    }, 500);
  };

  const [clientPage, setClientPage] = useState(1);
  const [clientHasMore, setClientHasMore] = useState(true);
  const [clientSearch, setClientSearch] = useState("");
  const clientCache = useRef({});
  const clientDebounceRef = useRef(null);

  const GetAllClient = async ({ searchValue = "", pageNo = 1, append = false }) => {
    const cacheKey = `${searchValue}_${pageNo}`;
    if (clientCache.current[cacheKey]) {
      const cached = clientCache.current[cacheKey];
      setClientAllData(prev => {
        const combined = append ? [...prev, ...cached] : cached;
        return Array.from(new Map(combined.map(item => [item.value, item])).values());
      });
      return;
    }
    const req = { action: "get_clients_filter", filters: filters, pagination: { search: searchValue, page: pageNo, limit: 20 } };
    const data = { req, authToken: token };
    try {
      const response = await dispatch(ClientAction(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map((item) => ({ value: item.id, label: `${item.client_name} (${item.client_code})` }));
        clientCache.current[cacheKey] = formatted;
        setClientAllData(prev => {
          const combined = append ? [...prev, ...formatted] : formatted;
          return Array.from(new Map(combined.map(item => [item.value, item])).values());
        });
        setClientHasMore(response.data.length === 20);
        setClientPage(pageNo);
      }
    } catch (error) { }
  };

  const handleClientSearch = (value) => {
    clearTimeout(clientDebounceRef.current);
    clientDebounceRef.current = setTimeout(() => {
      setClientSearch(value);
      setClientPage(1);
      clientCache.current = {};
      GetAllClient({ searchValue: value, pageNo: 1 });
    }, 500);
  };

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const cacheRef = useRef({});
  const debounceTimeout = useRef(null);

  const GetAllJobs = async ({ searchValue = "", pageNo = 1, append = false }) => {
    const cacheKey = `${searchValue}_${pageNo}`;
    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey];
      setJobOptions(prev => {
        const combined = append ? [...prev, ...cached] : cached;
        return Array.from(new Map(combined.map(item => [item.value, item])).values());
      });
      return;
    }
    const req = { action: "get_jobs_filter", filters: filters, pagination: { search: searchValue, page: pageNo, limit: 20 } };
    const data = { req, authToken: token };
    try {
      const response = await dispatch(JobAction(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map(item => ({ value: item.job_id, label: item.job_code_id }));
        cacheRef.current[cacheKey] = formatted;
        setJobOptions(prev => {
          const combined = append ? [...prev, ...formatted] : formatted;
          return Array.from(new Map(combined.map(item => [item.value, item])).values());
        });
        setHasMore(response.data.length === 20);
        setPage(pageNo);
      }
    } catch (err) { }
  };

  const handleSearch = (value) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
      cacheRef.current = {};
      GetAllJobs({ searchValue: value, pageNo: 1 });
    }, 500);
  };

  const GetAllJobs_internal = async (internal_external) => {
    if (internal_external === "0" || internal_external === "1") {
      var req = { action: "getInternalJobs" };
      var data = { req: req, authToken: token };
      await dispatch(CustomerGetAllTaskByStaff(data))
        .unwrap()
        .then((response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({ value: item.id, label: item.name }));
            setInternalJobAllData(data);
          }
        });
    }
  };

  const GetAllTask = async (internal_external) => {
    if (internal_external === "0" || internal_external === "1") {
      var reqInt = { action: "getInternalTasks" };
      var dataInt = { req: reqInt, authToken: token };
      await dispatch(CustomerGetAllTaskByStaff(dataInt))
        .unwrap()
        .then((response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({ value: item.id, label: item.name }));
            setInternalTaskAllData(data);
          }
        });
    }
    if (internal_external === "0" || internal_external === "2") {
      var reqExt = { action: "get" };
      var dataExt = { req: reqExt, authToken: token };
      await dispatch(CustomerGetAllTaskByStaff(dataExt))
        .unwrap()
        .then((response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({ value: item.task_id, label: item.task_name }));
            setTaskAllData(data);
          }
        });
    }
  };

  const exportToCSV = (data) => {
    if (!data || !data.rows || data.rows.length === 0) return;
    const colMap = { staff_id: "Staff", customer_id: "Customer", client_id: "Client", job_id: "Job", task_id: "Task", total_hours: "Total Hours", task_type: "Task Type", employee_number: "Employee ID" };
    const headers = data.columns.map((col) => colMap[col] || col);
    const rows = data.rows.map((row) => data.columns.map((col) => {
      let val = row[col] === undefined || row[col] === null ? "-" : row[col];
      return typeof val === "string" && val.includes(",") ? `"${val}"` : val;
    }));
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "TimeSheetReportData.csv";
    link.click();
  };

  const handleFilterChange = (e) => {
    if (Array.isArray(e)) {
      const values = e.map((opt) => opt.value);
      let gropByArray = sortByReference(values);
      setFilters((prev) => ({ ...prev, groupBy: gropByArray }));
      return;
    }
    const { key, value } = e.target;
    if (["staff_id", "customer_id", "client_id", "job_id", "task_id", "internal_job_id", "internal_task_id", "employee_number"].includes(key)) {
      if ([null, undefined, ""].includes(value)) {
        if (key === "staff_id") { setStaffPage(1); setStaffHasMore(true); setStaffSearch(""); staffCache.current = {}; GetAllStaff({ searchValue: "", pageNo: 1 }); }
        else if (key === "customer_id") { setCustomerPage(1); setCustomerHasMore(true); setCustomerSearch(""); customerCache.current = {}; GetAllCustomer({ searchValue: "", pageNo: 1 }); }
        else if (key === "client_id") { setClientPage(1); setClientHasMore(true); setClientSearch(""); clientCache.current = {}; GetAllClient({ searchValue: "", pageNo: 1 }); }
        else if (key === "job_id") { setPage(1); setHasMore(true); setSearch(""); cacheRef.current = {}; GetAllJobs({ searchValue: "", pageNo: 1 }); }
        setFilters((prev) => ({ ...prev, [key]: null }));
      } else {
        setFilters((prev) => ({ ...prev, [key]: value }));
      }
    } else if (key === "internal_external") {
      let remainingGroupBy = filters.groupBy;
      if (value === "1") {
        remainingGroupBy = filters.groupBy.filter((item) => item !== "customer_id" && item !== "client_id");
      }
      setFilters((prev) => ({ ...prev, [key]: value, groupBy: remainingGroupBy }));
      GetAllJobs_internal(value);
      GetAllTask(value);
    } else if (key === "timePeriod") {
      setFilters((prev) => ({ ...prev, fromDate: null, toDate: null, [key]: value }));
    } else if (key === "fromDate") {
      setFilters((prev) => ({ ...prev, fromDate: value, toDate: value > (prev.toDate || "") ? value : prev.toDate }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const addAndRemoveGroupBy = (value, type) => {
    if (type === "add") {
      if (value === "staff_id") GetAllStaff({ searchValue: "", pageNo: 1 });
      else if (value === "customer_id") GetAllCustomer({ searchValue: "", pageNo: 1 });
      else if (value === "client_id") GetAllClient({ searchValue: "", pageNo: 1 });
      else if (value === "job_id") { GetAllJobs_internal(filters.internal_external); GetAllJobs({ searchValue: "", pageNo: 1 }); }
      else if (value === "task_id") GetAllTask(filters.internal_external);
      else if (value === "employee_number") employeeData();
    }
  };

  const callFilterApi = async () => {
    setLoading(true);
    const req = { action: "get", filters: filters, role: role };
    const data = { req: req, authToken: token };
    try {
      const response = await dispatch(CustomerTimesheetReports(data)).unwrap();
      if (response.status) setShowData(response.data);
      else setShowData([]);
    } catch (error) { setShowData([]); }
    setLoading(false);
  };

  useEffect(() => { callFilterApi(); }, [filters]);

  const resetFunction = () => {
    setFilters({ groupBy: ["staff_id"], internal_external: "0", fieldsToDisplay: null, fieldsToDisplayId: null, staff_id: null, customer_id: null, client_id: null, job_id: null, task_id: null, internal_job_id: null, internal_task_id: null, timePeriod: "this_month", displayBy: "Weekly", fromDate: null, toDate: null });
    setFilterId(null);
    setShowData([]);
  };

  const optionGroupBy = [
    { value: "staff_id", label: "Staff" },
    ...(filters.internal_external !== "1" ? [{ value: "customer_id", label: "Customer" }, { value: "client_id", label: "Client" }] : []),
    { value: "job_id", label: "Job" },
    { value: "task_id", label: "Task" },
    { value: "employee_number", label: "Employee ID" },
  ];

  const orderMap = { staff_id: 0, customer_id: 1, client_id: 2, job_id: 3, task_id: 4, employee_number: 5 };
  function sortByReference(selected) { return selected.slice().sort((a, b) => orderMap[a] - orderMap[b]); }

  const saveFilterFunction = async () => {
    if (filters.groupBy.length === 0) {
      sweatalert.fire({ title: "Warning", text: "Please select group by one value", icon: "warning" });
      return;
    }
    const req = { action: "saveFilters", filters: filters, id: filterId, type: "timesheet_report" };
    const data = { req: req, authToken: token };
    await dispatch(CustomerGetAllTaskByStaff(data)).unwrap().then((response) => {
      if (response.status) {
        sweatalert.fire({ title: "Success", text: response.message, icon: "success" });
        getAllFilters();
      }
    });
  };

  const handleFilterSelect = (selected) => {
    setFilterId(selected.value);
    const selectedFilter = getAllFilterData.find((opt) => Number(opt.value) === Number(selected.value));
    if (selectedFilter && selectedFilter.filters) {
      const parsedFilters = JSON.parse(selectedFilter.filters);
      setFilters(parsedFilters);
    }
  };

  const deleteFilterIdFunction = async () => {
    const result = await sweatalert.fire({ title: "Are you sure?", text: "You won't be able to revert this!", icon: "warning", showCancelButton: true });
    if (result.isConfirmed) {
      const req = { action: "deleteFilterId", filterId: filterId, type: "timesheet_report" };
      const data = { req: req, authToken: token };
      await dispatch(CustomerGetAllTaskByStaff(data)).unwrap().then((response) => {
        if (response.status) {
          sweatalert.fire({ title: "Success", text: response.message, icon: "success" });
          getAllFilters();
          resetFunction();
        }
      });
    }
  };

  return (
    <div className="container-fluid pb-3">
      <div className="content-title">
        <div className="tab-title mb-3">
          <div className="row align-items-start">
            <div className="col-12 col-sm-7">
              <h3 className="mt-0">Timesheet Reports</h3>
              <div className="w-50 mt-2">
                <label className="form-label fw-medium mt-2 mb-1">Saved Filters</label>
                <div className="d-flex align-items-center gap-2">
                  <Select
                    options={[
                      { value: "", label: "Select..." },
                      ...(getAllFilterData || []).map((opt) => ({
                        value: opt.value,
                        label: <span dangerouslySetInnerHTML={{ __html: opt.label }} />,
                      })),
                    ]}
                    value={getAllFilterData.find((opt) => Number(opt.value) === Number(filterId)) || null}
                    onChange={handleFilterSelect}
                    isSearchable
                    className="shadow-sm select-staff rounded-pill flex-grow-1"
                  />
                  {filterId && <Trash size={20} title="Delete Filter" onClick={deleteFilterIdFunction} style={{ cursor: "pointer", color: "red" }} />}
                </div>
              </div>
            </div>
            {showData && showData?.rows && showData?.rows?.length > 0 && (
              <div className="col-12 col-sm-5">
                <div className="d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                  <button
                    className="btn btn-outline-info fw-bold border-3 d-inline-flex align-items-center gap-2 lh-1"
                    id="btn-export"
                    onClick={() => exportToCSV(showData)}
                  >
                    <Download size={16} />
                    <span>Export Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3 bg-light p-3 mt-4 rounded shadow-sm align-items-end">
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Group By</label>
          <Select
            isMulti
            options={optionGroupBy}
            value={optionGroupBy.filter((opt) => filters.groupBy.includes(opt.value))}
            onChange={(selectedOptions, actionMeta) => {
              if (actionMeta.action === "select-option") addAndRemoveGroupBy(actionMeta.option.value, "add");
              handleFilterChange(selectedOptions);
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Internal / External</label>
          <select
            className="form-select shadow-sm"
            id="internal_external"
            value={filters.internal_external}
            onChange={(e) =>
              handleFilterChange({
                target: { key: "internal_external", value: e.target.value },
              })
            }
          >
            <option value="0">Both</option>
            <option value="1">Internal</option>
            <option value="2">External</option>
          </select>
        </div>

        {filters.groupBy.includes("staff_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Staff</label>
            <Select
              options={[{ value: "", label: "Select..." }, ...staffAllData]}
              value={staffAllData.find((opt) => Number(opt.value) === Number(filters.staff_id)) || null}
              onChange={(selected) => handleFilterChange({ target: { key: "staff_id", value: selected.value } })}
              onInputChange={handleStaffSearch}
              onMenuScrollToBottom={() => staffHasMore && GetAllStaff({ searchValue: staffSearch, pageNo: staffPage + 1, append: true })}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {filters.groupBy.includes("customer_id") && filters.internal_external !== "1" && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Customer</label>
            <Select
              options={[{ value: "", label: "Select..." }, ...customerAllData]}
              value={customerAllData.find((opt) => Number(opt.value) === Number(filters.customer_id)) || null}
              onChange={(selected) => handleFilterChange({ target: { key: "customer_id", value: selected.value } })}
              onInputChange={handleCustomerSearch}
              onMenuScrollToBottom={() => customerHasMore && GetAllCustomer({ searchValue: customerSearch, pageNo: customerPage + 1, append: true })}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {filters.groupBy.includes("client_id") && filters.internal_external !== "1" && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Client</label>
            <Select
              options={[{ value: "", label: "Select..." }, ...clientAllData]}
              value={clientAllData.find((opt) => Number(opt.value) === Number(filters.client_id)) || null}
              onChange={(selected) => handleFilterChange({ target: { key: "client_id", value: selected.value } })}
              onInputChange={handleClientSearch}
              onMenuScrollToBottom={() => clientHasMore && GetAllClient({ searchValue: clientSearch, pageNo: clientPage + 1, append: true })}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {filters.groupBy.includes("job_id") && filters.internal_external !== "1" && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Job</label>
            <Select
              options={[{ value: "", label: "Select..." }, ...jobOptions]}
              value={jobOptions.find((opt) => Number(opt.value) === Number(filters.job_id)) || null}
              onChange={(selected) => handleFilterChange({ target: { key: "job_id", value: selected.value } })}
              onInputChange={handleSearch}
              onMenuScrollToBottom={() => hasMore && GetAllJobs({ searchValue: search, pageNo: page + 1, append: true })}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {filters.groupBy.includes("task_id") && filters.internal_external !== "1" && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Task</label>
            <Select
              options={[{ value: "", label: "Select..." }, ...taskAllData]}
              value={taskAllData.find((opt) => Number(opt.value) === Number(filters.task_id)) || null}
              onChange={(selected) => handleFilterChange({ target: { key: "task_id", value: selected.value } })}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {filters.groupBy.includes("job_id") && filters.internal_external !== "2" && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Select Internal Job</label>
            <Select
              options={[{ value: "", label: "Select..." }, ...internalJobAllData]}
              value={internalJobAllData.find((opt) => Number(opt.value) === Number(filters.internal_job_id)) || null}
              onChange={(selected) => handleFilterChange({ target: { key: "internal_job_id", value: selected.value } })}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {filters.groupBy.includes("task_id") && filters.internal_external !== "2" && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Select Internal Task</label>
            <Select
              options={[{ value: "", label: "Select..." }, ...internalTaskAllData]}
              value={internalTaskAllData.find((opt) => Number(opt.value) === Number(filters.internal_task_id)) || null}
              onChange={(selected) => handleFilterChange({ target: { key: "internal_task_id", value: selected.value } })}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {filters.groupBy.includes("employee_number") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Employee ID</label>
            <Select
              options={[{ value: "", label: "Select..." }, ...employeeNumberAllData]}
              value={employeeNumberAllData.find((opt) => opt.value === filters.employee_number) || null}
              onChange={(selected) => handleFilterChange({ target: { key: "employee_number", value: selected.value } })}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Time Period</label>
          <select
            className="form-select shadow-sm"
            id="timePeriod"
            value={filters.timePeriod}
            onChange={(e) =>
              handleFilterChange({
                target: { key: "timePeriod", value: e.target.value },
              })
            }
          >
            <option value="">--Select--</option>
            <option value="this_week">This week</option>
            <option value="last_week">Last Week</option>
            <option value="this_month">This month</option>
            <option value="last_month">Last Month</option>
            <option value="this_quarter">This quarter</option>
            <option value="last_quarter">Last quarter</option>
            <option value="this_year">This year</option>
            <option value="last_year">Last year</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {filters.timePeriod === "custom" && (
          <>
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">From Date</label>
              <input
                type="date"
                className="form-control shadow-sm"
                id="fromDate"
                value={filters.fromDate || ""}
                onChange={(e) =>
                  handleFilterChange({
                    target: { key: "fromDate", value: e.target.value },
                  })
                }
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">To Date</label>
              <input
                type="date"
                className="form-control shadow-sm"
                id="toDate"
                value={filters.toDate || ""}
                min={filters.fromDate || ""}
                onChange={(e) =>
                  handleFilterChange({
                    target: { key: "toDate", value: e.target.value },
                  })
                }
                disabled={!filters.fromDate}
              />
            </div>
          </>
        )}

        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Display By</label>
          <select
            className="form-select shadow-sm"
            id="displayBy"
            value={filters.displayBy}
            onChange={(e) =>
              handleFilterChange({
                target: { key: "displayBy", value: e.target.value },
              })
            }
          >
            <option value="">--Select--</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Fortnightly">Fortnightly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div className="col-lg-4 col-md-6">
          <button
            className="btn btn-outline-secondary shadow-sm rounded-pill border-3 fw-bold"
            id="btn-reset"
            onClick={resetFunction}
          >
            Clear Filter
          </button>
          <button
            className="btn btn-info shadow-sm rounded-pill ms-3"
            id="btn-reset"
            onClick={saveFilterFunction}
          >
            Save Filters
          </button>
        </div>
      </div>

      <div className="datatable-container mt-4">
        {loading ? (
          <div className="text-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>
        ) : !showData?.rows || showData.rows.length === 0 ? (
          <div className="text-center"><img src={noDataImage} alt="No Data" style={{ width: "250px" }} /><p className="fs-16">There are no records to display</p></div>
        ) : (
          <div className="table-responsive fixed-table-header">
            <table className="table rdt_Table">
              <thead>
                <tr className="rdt_TableHeadRow">
                  {showData.columns.map((col, idx) => (<th key={idx} className="border-bottom-0" style={{ fontSize: "15px", fontWeight: "bold", minWidth: "130px" }}>{getColumnName(col)}</th>))}
                </tr>
              </thead>
              <tbody>
                {showData.rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {showData.columns.map((col, colIdx) => (<td key={colIdx} style={{ padding: "10px" }}>{row[col] !== undefined ? row[col] : ""}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getColumnName(columnKey) {
  const dayMap = { staff_id: "Staff", customer_id: "Customer", client_id: "Client", job_id: "Job", task_id: "Task", total_hours: "Total Hours", total_records: "Total Records", task_type: "Task Type", employee_number: "Employee ID" };
  if (/^\d{4}-\d{2}-\d{2}$/.test(columnKey)) {
    const date = new Date(columnKey);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${columnKey} ${days[date.getDay()]} (hrs)`;
  }
  if (typeof columnKey === "string" && columnKey.toLowerCase().startsWith("week ending")) {
    return columnKey.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
  return dayMap[columnKey] || columnKey;
}

export default CustomerTimesheetReport;

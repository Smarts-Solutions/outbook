import React, { useState, useEffect, useRef } from "react";
import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import {
  getAllCustomerDropDown,
  JobAction,
  getAllTaskByStaff,
  getTimesheetReportData,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
import dayjs from "dayjs";
import sweatalert from "sweetalert2";
import { Trash, Download } from "lucide-react";

function TimesheetReport() {
  const noDataImage = "/assets/images/No-data-amico.png";
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [options, setOptions] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = staffDetails?.role;
  const [showData, setShowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setCurrentPage(newPage);
    callFilterApi(newPage, pageSize);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
    callFilterApi(1, newSize);
  };


  const [staffAllData, setStaffAllData] = useState([]);
  const [customerAllData, setCustomerAllData] = useState([]);
  const [clientAllData, setClientAllData] = useState([]);
  const [jobAllData, setJobAllData] = useState([]);
  const [taskAllData, setTaskAllData] = useState([]);

  const [internalJobAllData, setInternalJobAllData] = useState([]);
  const [internalTaskAllData, setInternalTaskAllData] = useState([]);
  const [employeeNumberAllData, setEmployeeNumberAllData] = useState([]);

  const [getAllFilterData, setGetAllFilterData] = useState([]);
  // set filter id
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

  // Tracks the order in which customer/client/job filters were selected.
  // The FIRST item in this array was selected first → it always shows ALL options.
  // Later selections only filter based on what came before them.
  const [selectionOrder, setSelectionOrder] = useState([]);

  // Helper: get the upstream filters (those selected before `key` in selectionOrder)
  const getUpstreamFilters = (key, currentFilters) => {
    const idx = selectionOrder.indexOf(key);
    const upstream = idx === -1 ? selectionOrder : selectionOrder.slice(0, idx);
    return {
      staff_id: upstream.includes("staff_id") ? currentFilters?.staff_id : null,
      customer_id: upstream.includes("customer_id") ? currentFilters?.customer_id : null,
      client_id: upstream.includes("client_id") ? currentFilters?.client_id : null,
      job_id: upstream.includes("job_id") ? currentFilters?.job_id : null,
      task_id: upstream.includes("task_id") ? currentFilters?.task_id : null,
    };
  };

  let lastGroupValue = filters?.groupBy[filters?.groupBy?.length - 1];


  // const staffData = async () => {
  //   if (role?.toUpperCase() === "SUPERADMIN" || role?.toUpperCase() === "ADMIN") {
  //     await dispatch(Staff({ req: { action: "get" }, authToken: token }))
  //       .unwrap()
  //       .then(async (response) => {
  //         if (response.status) {
  //           const data = response?.data?.map((item) => ({
  //             value: item.id,
  //             label: `${item.first_name} ${item.last_name} (${item.email})`,
  //           }));
  //           setStaffAllData(data);
  //         } else {
  //           setStaffAllData([]);
  //         }
  //       })
  //       .catch((error) => {
  //         return;
  //       });
  //   } else {
  //     let data = [
  //       {
  //         id: staffDetails?.id,
  //         email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})`,
  //       },
  //     ];

  //     data = data?.map((item) => ({
  //       value: item.id,
  //       label: item.email,
  //     }));
  //     setStaffAllData(data);
  //   }
  // };

  const [staffPage, setStaffPage] = useState(1);
  const [staffHasMore, setStaffHasMore] = useState(true);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");
  const staffCache = useRef({});
  const staffDebounceRef = useRef(null);

  const GetAllStaff = async ({ searchValue = "", pageNo = 1, append = false, customer_id = null, client_id = null, job_id = null, task_id = null }) => {
    if (role?.toUpperCase() === "SUPERADMIN" || role?.toUpperCase() === "ADMIN") {
      // guard removed to match JobCustomReport pattern - each fetch has its own dedicated loading flag
      const cacheKey = `${searchValue}_${pageNo}_${customer_id}_${client_id}_${job_id}_${task_id}`;
      if (staffCache.current[cacheKey]) {

        const cached = staffCache.current[cacheKey];

        setStaffAllData(prev => {
          const combined = append ? [...prev, ...cached] : cached;
          const unique = Array.from(
            new Map(combined.map(item => [item.value, item])).values()
          );
          return unique;
        });

        return;
      }
      setStaffLoading(true);
      let req = {};
      if (customer_id || client_id || job_id || task_id) {
        req = {
          action: "getstaffbyfilter",
          page: pageNo,
          limit: (customer_id || client_id || job_id || task_id) ? 1000 : 20,
          search: searchValue,
          customer_id: customer_id || "",
          client_id: client_id || "",
          job_id: job_id || "",
          task_id: task_id || ""
        };
      } else {
        req = {
          action: "get",
          page: pageNo,
          limit: 20,
          search: searchValue
        };
      }
      const data = { req: req, authToken: token };
      try {
        const response = await dispatch(Staff(data)).unwrap();
        if (response.status) {
          const staffList = response.data.data;

          const formatted = staffList.map((item) => ({
            value: item.id,
            label: `${item.first_name} ${item.last_name} (${item.email})`,
            employee_number: item.employee_number
          }));

          staffCache.current[cacheKey] = formatted;
          setStaffAllData(prev => {
            const combined = append ? [...prev, ...formatted] : formatted;
            const unique = Array.from(
              new Map(combined.map(item => [item.value, item])).values()
            );
            return unique;
          });

          setStaffHasMore(req.action === "getstaffbyfilter" ? false : staffList.length === 20);
          setStaffPage(pageNo);
        } else {
          if (!append) setStaffAllData([]);
        }
      } catch (error) { }
      setStaffLoading(false);

    } else {
      let dataList = [];

      try {
        const req = { action: "get_my_line_managers" };
        const response = await dispatch(Staff({ req, authToken: token })).unwrap();
        if (response.status && response.data) {
          response.data.forEach(manager => {
            // Check if this manager matches the selected customer, client, or job
            let keep = true;
            
            // manager.assigned_customers is a comma-separated string like '89,90'
            if (customer_id) {
              const assignedCusts = manager.assigned_customers ? manager.assigned_customers.split(',') : [];
              const targetCusts = Array.isArray(customer_id) ? customer_id.map(String) : [String(customer_id)];
              if (!targetCusts.some(c => assignedCusts.includes(c))) keep = false;
            }
            if (client_id && keep) {
              const assignedClients = manager.assigned_clients ? manager.assigned_clients.split(',') : [];
              const targetClients = Array.isArray(client_id) ? client_id.map(String) : [String(client_id)];
              if (!targetClients.some(c => assignedClients.includes(c))) keep = false;
            }
            if (job_id && keep) {
              const assignedJobs = manager.assigned_jobs ? manager.assigned_jobs.split(',') : [];
              const targetJobs = Array.isArray(job_id) ? job_id.map(String) : [String(job_id)];
              if (!targetJobs.some(j => assignedJobs.includes(j))) keep = false;
            }

            if (keep && !dataList.find(item => item.value === manager.id)) {
              dataList.push({
                value: manager.id,
                label: `${manager.first_name} ${manager.last_name} (${manager.email})`,
                employee_number: manager.employee_number
              });
            }
          });
        }
      } catch (err) { }

      // Logged-in user should always be added if no filters are applied
      if (!customer_id && !client_id && !job_id && !dataList.find(item => item.value === staffDetails?.id)) {
        dataList.unshift({
          value: staffDetails?.id,
          label: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})`,
          employee_number: staffDetails?.employee_number
        });
      }

      if (searchValue) {
        dataList = dataList.filter(item => 
          item.label.toLowerCase().includes(searchValue.toLowerCase())
        );
      }

      setStaffAllData(dataList);
    }
  };

  const handleStaffSearch = (value) => {

    if (value === "") return;
    clearTimeout(staffDebounceRef.current);
    staffDebounceRef.current = setTimeout(() => {
      setStaffSearch(value);
      const up = getUpstreamFilters("staff_id", filters);
      GetAllStaff({
        searchValue: value,
        pageNo: 1,
        customer_id: up.customer_id,
        client_id: up.client_id,
        job_id: up.job_id,
        task_id: up.task_id,
      });

    }, 500);

  };

  // All Employee Number Data
  const employeeData = async () => {
    if (role?.toUpperCase() === "SUPERADMIN" || role?.toUpperCase() === "ADMIN") {
      var req = {
        action: "getStaffWithRole",
        role_id: "employee_number" || "",
      };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data
              ?.filter(
                (item) =>
                  ![null, "", "null", undefined].includes(item.employee_number),
              )
              ?.map((item) => ({
                value: item.employee_number,
                staff_id: item.id,
                label: `${item.employee_number}`,
                staff_label: `${item.first_name || ""} ${item.last_name || ""} (${item.email || ""})`.trim(),
              }));
            setEmployeeNumberAllData(data);
          } else {
            setEmployeeNumberAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
    } else {
      let dataList = [
        {
          value: staffDetails?.employee_number,
          staff_id: staffDetails?.id,
          label: `${staffDetails.employee_number}`,
          staff_label: `${staffDetails.first_name || ""} ${staffDetails.last_name || ""} (${staffDetails.email || ""})`.trim(),
        }
      ];

      try {
        const req = { action: "get_my_line_managers" };
        const response = await dispatch(Staff({ req, authToken: token })).unwrap();
        if (response.status && response.data) {
          response.data.forEach(manager => {
            if (manager.employee_number && !dataList.find(item => item.value === manager.employee_number)) {
              dataList.push({
                value: manager.employee_number,
                staff_id: manager.id,
                label: `${manager.employee_number}`,
                staff_label: `${manager.first_name || ""} ${manager.last_name || ""} (${manager.email || ""})`.trim()
              });
            }
          });
        }
      } catch (err) { }

      setEmployeeNumberAllData(dataList);
    }
  };

  function formatStringToTitleCase(text, key) {
    if (!text) return "";

    if (key == "date") {
      return dayjs(text).format("DD-MM-YYYY");
    }

    return text
      .replace(/_/g, " ") // underscores → spaces
      .toLowerCase() // make all lowercase first
      .replace(/\b\w/g, (char) => char.toUpperCase()) // capitalize first letter of each word
      .trim();
  }

  const getAllFilters = async () => {
    var req = { action: "getAllFilters", type: "timesheet_report" };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            // label: `Group By : [${JSON.parse(item?.groupBy)}]  ⮞ Staff : ${item.staff_fullname}  ⮞ Customer : ${item.customer_name}  ⮞ Client : ${item.client_name}  ⮞ Job : ${item.job_name}  ⮞ Task : ${item.task_name}  ⮞ Internal Job : ${item.internal_job_name}  ⮞ Internal Task : ${item.internal_task_name}`,
            label: `
            Group By : [${JSON.parse(item?.groupBy)?.map((item) => item.replace(/_id$/i, ""))}]<br/>
            ${item.staff_fullname ? `⮞ Staff : ${item.staff_fullname}<br/>` : ""}
            ${item.customer_name ? `⮞ Customer : ${item.customer_name}<br/>` : ""}
            ${item.client_name ? `⮞ Client : ${item.client_name}<br/>` : ""}
            ${item.job_name ? `⮞ Job : ${item.job_name}<br/>` : ""}
            ${item.task_name ? `⮞ Task : ${item.task_name}<br/>` : ""}
            ${item.internal_job_name ? `⮞ Internal Job : ${item.internal_job_name}<br/>` : ""}
            ${item.internal_task_name ? `⮞ Internal Task : ${item.internal_task_name}<br/>` : ""}
            ${item.timePeriod ? `⮞ Time Period : ${formatStringToTitleCase(item.timePeriod)}<br/>` : ""}
            ${item.displayBy ? `⮞ Display By : ${formatStringToTitleCase(item.displayBy)}<br/>` : ""}
            ${!["", null, "null", undefined].includes(item.fromDate) ? `⮞ From Date : ${formatStringToTitleCase(item.fromDate, "date")}<br/>` : ""}
            ${!["", null, "null", undefined].includes(item.toDate) ? `⮞ To Date : ${formatStringToTitleCase(item.toDate, "date")}` : ""}
          `,

            filters: item.filter_record,
          }));
          setGetAllFilterData(data);
        } else {
          setGetAllFilterData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    // Dropdown APIs have been deferred to onMenuOpen events
  }, []);

  // Get All Customers
  // const GetAllCustomer = async () => {
  //   const req = { action: "get_dropdown" };
  //   const data = { req: req, authToken: token };
  //   await dispatch(getAllCustomerDropDown(data))
  //     .unwrap()
  //     .then(async (response) => {
  //       if (response.status) {
  //         const data = response?.data?.map((item) => ({
  //           value: item.id,
  //           label: item.trading_name,
  //         }));
  //         setCustomerAllData(data);
  //       } else {
  //         setCustomerAllData([]);
  //       }
  //     })
  //     .catch((error) => {
  //       return;
  //     });
  // };


  ///////////////---- FOR CUSTOMER SERACH  START-----//////////////
  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasMore, setCustomerHasMore] = useState(true);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const customerCache = useRef({});
  const debounceRef = useRef(null);

  const GetAllCustomer = async ({ searchValue = "", pageNo = 1, append = false, job_id = null, client_id = null, staff_id = null, task_id = null }) => {
    const cacheKey = `${searchValue}_${pageNo}_${job_id}_${client_id}_${staff_id}_${task_id}`;
    if (customerCache.current[cacheKey]) {
      const cached = customerCache.current[cacheKey];
      setCustomerAllData(prev => {
        const combined = append ? [...prev, ...cached] : cached;
        const unique = Array.from(
          new Map(combined.map(item => [item.value, item])).values()
        );
        return unique;
      });
      return;
    }

    setCustomerLoading(true);
    const req = {
      action: "get_customers_filter",
      filters: { ...filters, staff_id: staff_id !== null ? staff_id : filters.staff_id },
      job_id: job_id ? [job_id] : [],
      client_id: client_id ? [client_id] : [],
      task_id: task_id ? [task_id] : [],
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: job_id || client_id || staff_id || task_id ? 1000 : 20
      }
    };

    const data = { req: req, authToken: token };
    try {
      const response = await dispatch(getAllCustomerDropDown(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map((item) => ({
          value: item.id,
          label: item.trading_name
        }));

        customerCache.current[cacheKey] = formatted;
        setCustomerAllData(prev => {
          const combined = append ? [...prev, ...formatted] : formatted;
          const unique = Array.from(
            new Map(combined.map(item => [item.value, item])).values()
          );
          return unique;
        });
        setCustomerHasMore(response.data.length === 20);
        setCustomerPage(pageNo);

      } else {
        if (!append) setCustomerAllData([]);
      }
    } catch (error) { }
    setCustomerLoading(false);
  };

  const handleCustomerSearch = (value) => {
    if (value === "") {
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCustomerSearch(value);
      const up = getUpstreamFilters("customer_id", filters);
      GetAllCustomer({
        searchValue: value,
        pageNo: 1,
        job_id: up.job_id,
        client_id: up.client_id,
        staff_id: up.staff_id,
        task_id: up.task_id,
      });
    }, 500);

  };

  ///////////////---- FOR CUSTOMER SERACH  END-----//////////////



  // Get All Clients
  // const GetAllClient = async () => {
  //   const req = { action: "get", customer_id: "" };
  //   const data = { req: req, authToken: token };
  //   await dispatch(ClientAction(data))
  //     .unwrap()
  //     .then(async (response) => {
  //       if (response.status) {
  //         const data = response?.data?.map((item) => ({
  //           value: item.id,
  //           label: item.client_name + " (" + item.client_code + ")",
  //         }));
  //         setClientAllData(data);
  //       } else {
  //         setClientAllData([]);
  //       }
  //     })
  //     .catch((error) => {
  //       return;
  //     });
  // };
  /////////////////---- FOR CLIENT SERACH  START-----//////////////
  const [clientPage, setClientPage] = useState(1);
  const [clientHasMore, setClientHasMore] = useState(true);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const clientCache = useRef({});
  const clientDebounceRef = useRef(null);

  const GetAllClient = async ({ searchValue = "", pageNo = 1, append = false, job_id = null, customer_id = null, staff_id = null, task_id = null }) => {
    const cacheKey = `${searchValue}_${pageNo}_${job_id}_${customer_id}_${staff_id}_${task_id}`;
    if (clientCache.current[cacheKey]) {
      const cached = clientCache.current[cacheKey];
      setClientAllData(prev => {
        const combined = append ? [...prev, ...cached] : cached;
        const unique = Array.from(
          new Map(combined.map(item => [item.value, item])).values()
        );
        return unique;
      });
      return;
    }
    setClientLoading(true);
    const req = {
      action: "get_clients_filter",
      filters: { ...filters, staff_id: staff_id !== null ? staff_id : filters.staff_id },
      job_id: job_id ? [job_id] : [],
      customer_id: customer_id ? [customer_id] : [],
      task_id: task_id ? [task_id] : [],
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: job_id || customer_id || staff_id || task_id ? 1000 : 20
      }
    };
    const data = { req, authToken: token };
    try {
      const response = await dispatch(ClientAction(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map((item) => ({
          value: item.id,
          label: `${item.client_name} (${item.client_code})`
        }));

        // Cache store
        clientCache.current[cacheKey] = formatted;
        setClientAllData(prev => {
          const combined = append ? [...prev, ...formatted] : formatted;
          const unique = Array.from(
            new Map(combined.map(item => [item.value, item])).values()
          );
          return unique;
        });
        setClientHasMore(response.data.length === 20);
        setClientPage(pageNo);

      } else {
        if (!append) setClientAllData([]);
      }
    } catch (error) { }
    setClientLoading(false);
  };
  const handleClientSearch = (value) => {
    if (value === "") {
      return;
    }
    clearTimeout(clientDebounceRef.current);
    clientDebounceRef.current = setTimeout(() => {
      setClientSearch(value);
      const up = getUpstreamFilters("client_id", filters);
      GetAllClient({
        searchValue: value,
        pageNo: 1,
        job_id: up.job_id,
        customer_id: up.customer_id,
        staff_id: up.staff_id,
        task_id: up.task_id,
      });
    }, 500);
  };

  /////////////////---- FOR CLIENT SERACH  END-----//////////////

  // Get All Jobs
  const GetAllJobs_internal = async (internal_external) => {
    if (internal_external == "0") {
      var req = { action: "getInternalJobs" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setInternalJobAllData(data);
          } else {
            setInternalJobAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return
      // External get All jobs
      var req = { action: "getByCustomer", customer_id: "", page: 1, limit: 100000, search: "" };
      var data = { req: req, authToken: token };
      await dispatch(JobAction(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.job_id,
              label: item.job_code_id,
            }));
            setJobAllData(data);
          } else {
            setJobAllData([]);
          }
        })
        .catch((error) => {
          return;
        });

      return;
    } else if (internal_external == "1") {
      var req = { action: "getInternalJobs" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setInternalJobAllData(data);
          } else {
            setInternalJobAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return;
    } else if (internal_external == "2") {
      return;
      // External get All jobs
      const req = { action: "getByCustomer", customer_id: "", page: 1, limit: 100000, search: "" };
      const data = { req: req, authToken: token };
      await dispatch(JobAction(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.job_id,
              label: item.job_code_id,
            }));
            setJobAllData(data);
          } else {
            setJobAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return;
    }
  };

  ///////////////---- FOR JOB SERACH  START-----//////////////
  const [jobOptions, setJobOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const cacheRef = useRef({});
  const debounceTimeout = useRef(null);
  const [jobLoading, setJobLoading] = useState(false);

  const GetAllJobs = async ({ searchValue = "", pageNo = 1, append = false, customer_id = null, client_id = null, staff_id = null, task_id = null }) => {
    const cacheKey = `${searchValue}_${pageNo}_${customer_id}_${client_id}_${staff_id}_${task_id}`;
    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey];
      setJobOptions(prev => {
        const combined = append ? [...prev, ...cached] : cached;
        const unique = Array.from(
          new Map(combined.map(item => [item.value, item])).values()
        );
        return unique;
      });
      return;
    }
    setJobLoading(true);
    const req = {
      action: "get_jobs_filter",
      filters: { ...filters, staff_id: staff_id !== null ? staff_id : filters.staff_id },
      customer_id: customer_id ? [customer_id] : [],
      client_id: client_id ? [client_id] : [],
      task_id: task_id ? [task_id] : [],
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: customer_id || client_id || staff_id || task_id ? 1000 : 20
      }
    };
    const data = { req, authToken: token };

    try {
      const response = await dispatch(JobAction(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map(item => ({
          value: item.job_id,
          label: item.job_code_id
        }));

        cacheRef.current[cacheKey] = formatted;
        setJobOptions(prev => {
          const combined = append ? [...prev, ...formatted] : formatted;
          const unique = Array.from(
            new Map(combined.map(item => [item.value, item])).values()
          );
          return unique;
        });
        setHasMore(response.data.length === 20);
        setPage(pageNo);
      }
    } catch (err) { }
    setJobLoading(false);

  };

  const handleSearch = (value) => {
    if (value === "") {
      return;
    }
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
      const up = getUpstreamFilters("job_id", filters);
      GetAllJobs({
        searchValue: value,
        pageNo: 1,
        customer_id: up.customer_id,
        client_id: up.client_id,
        staff_id: up.staff_id,
        task_id: up.task_id,
      });
    }, 500);

  };
  ///////////////---- FOR JOB SERACH  END-----//////////////

  // NOTE: Cascade-clearing useEffects for customer_id / client_id removed.
  // Clearing dependent dropdowns on selection of another is now handled explicitly
  // in handleFilterChange using selectionOrder, so we do NOT auto-clear here.

  ///////////////---- FOR TASK SERACH  START-----//////////////
  const [taskPage, setTaskPage] = useState(1);
  const [taskHasMore, setTaskHasMore] = useState(true);
  const [taskSearch, setTaskSearch] = useState("");
  const taskCache = useRef({});
  const taskDebounceRef = useRef(null);
  const [taskLoading, setTaskLoading] = useState(false);

  const GetAllTask = async (internal_external, options = {}) => {
    const { searchValue = "", pageNo = 1, append = false, customer_id = null, client_id = null, job_id = null, staff_id = null } = options;

    if (internal_external == "1") {
      var reqInternal = { action: "getInternalTasks" };
      var dataInternal = { req: reqInternal, authToken: token };
      await dispatch(getAllTaskByStaff(dataInternal))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setInternalTaskAllData(data);
          } else {
            setInternalTaskAllData([]);
          }
        })
        .catch(() => {});
      return;
    }

    if (internal_external == "0") {
      var reqInternal = { action: "getInternalTasks" };
      var dataInternal = { req: reqInternal, authToken: token };
      await dispatch(getAllTaskByStaff(dataInternal))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            setInternalTaskAllData(data);
          } else {
            setInternalTaskAllData([]);
          }
        })
        .catch(() => {});
    }

    const cacheKey = `${searchValue}_${pageNo}_${customer_id}_${client_id}_${job_id}_${staff_id}`;
    if (taskCache.current[cacheKey]) {
      const cached = taskCache.current[cacheKey];
      setTaskAllData(prev => {
        const combined = append ? [...prev, ...cached] : cached;
        const unique = Array.from(
          new Map(combined.map(item => [item.value, item])).values()
        );
        return unique;
      });
      return;
    }

    setTaskLoading(true);
    const req = {
      action: "get_tasks_filter",
      filters: { ...filters, staff_id: staff_id !== null ? staff_id : filters.staff_id },
      customer_id: customer_id ? [customer_id] : [],
      client_id: client_id ? [client_id] : [],
      job_id: job_id ? [job_id] : [],
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: customer_id || client_id || job_id || staff_id ? 1000 : 20
      }
    };
    const data = { req, authToken: token };

    try {
      const response = await dispatch(getAllTaskByStaff(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map(item => ({
          value: item.task_id,
          label: item.task_name
        }));

        taskCache.current[cacheKey] = formatted;
        setTaskAllData(prev => {
          const combined = append ? [...prev, ...formatted] : formatted;
          const unique = Array.from(
            new Map(combined.map(item => [item.value, item])).values()
          );
          return unique;
        });
        setTaskHasMore(response.data.length === 20);
        setTaskPage(pageNo);
      } else {
        if (!append) setTaskAllData([]);
      }
    } catch (err) { }
    setTaskLoading(false);
  };

  const handleTaskSearch = (value) => {
    if (value === "") return;
    clearTimeout(taskDebounceRef.current);
    taskDebounceRef.current = setTimeout(() => {
      setTaskSearch(value);
      setTaskPage(1);
      const up = getUpstreamFilters("task_id", filters);
      GetAllTask(filters.internal_external, {
        searchValue: value,
        pageNo: 1,
        customer_id: up.customer_id,
        client_id: up.client_id,
        job_id: up.job_id,
        staff_id: up.staff_id
      });
    }, 500);
  };
  ///////////////---- FOR TASK SERACH  END-----//////////////

  const exportToCSV = (data) => {
    if (!data || !data.rows || data.rows.length === 0) {
      alert("No data to export!");
      return;
    }

    //  Headers dynamically from data.columns
    //  const headers = data.columns;
    const colMap = {
      staff_id: "Staff Name",
      customer_id: "Customer Name",
      client_id: "Client Name",
      job_id: "Job Name",
      task_id: "Task Name",
      employee_number: "Employee ID",
      total_hours: "Total Hours",
      task_type: "Task Type",
    };
    const headers = data.columns.map((col) => colMap[col] || col);

    const rows = data.rows.map((row) => {
      return data.columns.map((col) => {
        let val = row[col];
        if (val === undefined || val === null) val = "-";

        if (typeof val === "string" && val.includes(",")) val = `"${val}"`;
        return val;
      });
    });

    //  CSV content
    const csvContent = [headers, ...rows]
      .map((r) => r.join(",")) // join by comma
      .join("\n"); // join rows by newline

    //  Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "TimeSheetReportData.csv";
    link.click();
  };

  const handleFilterChange = (e) => {
    if (Array.isArray(e)) {
      // this case is for multi-select (Group By)
      const values = e.map((opt) => opt.value);
      const labels = e.map((opt) => opt.label);
      setOptions([]);
      let gropByArray = sortByReference(values);
      setFilters((prev) => ({
        ...prev,
        fieldsToDisplay: null,
        fieldsToDisplayId: null,
        groupBy: sortByReference(gropByArray),
      }));

      return; // multi-select
    }

    const { key, value, label } = e.target;

    if (
      key === "staff_id" ||
      key === "customer_id" ||
      key === "client_id" ||
      key === "job_id" ||
      key === "task_id" ||
      key === "internal_job_id" ||
      key === "internal_task_id" ||
      key === "employee_number"
    ) {
      if ([null, undefined, ""].includes(value)) {
        if (key === "staff_id") {
          setStaffPage(1);
          setStaffHasMore(true);
          setStaffSearch("");
          staffCache.current = {};
          staffDebounceRef.current = null;
        }
        else if (key === "customer_id") {
          setCustomerPage(1);
          setCustomerHasMore(true);
          setCustomerSearch("");
          customerCache.current = {};
          debounceRef.current = null;
        }
        else if (key === "client_id") {
          setClientPage(1);
          setClientHasMore(true);
          setClientSearch("");
          clientCache.current = {};
          clientDebounceRef.current = null;
        }
        else if (key === "job_id") {
          setPage(1);
          setHasMore(true);
          setSearch("");
          cacheRef.current = {};
          debounceTimeout.current = null;
        }
      }

      setFilters((prev) => {
        let updated = { ...prev, [key]: [null, undefined, ""].includes(value) ? null : value };
        if (key === "staff_id" || key === "employee_number") {
updated.internal_job_id = null;
          updated.internal_task_id = null;

          let resolvedStaffId = value;

          if (key === "employee_number") {
            if (updated.employee_number) {
              const matchedEmployee = employeeNumberAllData.find(e => e.value === updated.employee_number);
              if (matchedEmployee) {
                updated.staff_id = matchedEmployee.staff_id;
                resolvedStaffId = matchedEmployee.staff_id;
                setStaffAllData(prev => {
                  if (prev && !prev.find(s => Number(s.value) === Number(matchedEmployee.staff_id))) {
                    return [...prev, { value: matchedEmployee.staff_id, label: matchedEmployee.staff_label, employee_number: matchedEmployee.value }];
                  }
                  return prev || [];
                });
              }
            } else {
              updated.staff_id = null;
              resolvedStaffId = null;
            }
          } else {
            if (!updated.staff_id) {
              updated.employee_number = null;
            } else {
              const matchedStaff = staffAllData.find(s => Number(s.value) === Number(updated.staff_id));
              if (matchedStaff && matchedStaff.employee_number) {
                updated.employee_number = matchedStaff.employee_number;
                setEmployeeNumberAllData(prev => {
                  if (prev && !prev.find(e => e.value === matchedStaff.employee_number)) {
                    return [...prev, { value: matchedStaff.employee_number, staff_id: matchedStaff.value, label: `${matchedStaff.employee_number}`, staff_label: matchedStaff.label }];
                  }
                  return prev || [];
                });
              } else if (updated.employee_number) {
                const matchedEmployee = employeeNumberAllData.find(e => Number(e.staff_id) === Number(updated.staff_id));
                if (!matchedEmployee || matchedEmployee.value !== updated.employee_number) {
                  updated.employee_number = null;
                }
              }
            }
          }

          const isClearing = [null, undefined, ""].includes(resolvedStaffId);
          if (isClearing) {
            // Auto-clear downstream filters
            const staffIdx = selectionOrder.indexOf("staff_id");
            if (staffIdx !== -1) {
              const upstream = selectionOrder.slice(0, staffIdx);
              if (!upstream.includes("customer_id")) {
                updated.customer_id = null;
                setCustomerAllData([]);
                customerCache.current = {};
                setCustomerPage(1);
                setCustomerHasMore(true);
                setCustomerSearch("");
              }
              if (!upstream.includes("client_id")) {
                updated.client_id = null;
                setClientAllData([]);
                clientCache.current = {};
                setClientPage(1);
                setClientHasMore(true);
                setClientSearch("");
              }
              if (!upstream.includes("job_id")) {
                updated.job_id = null;
                setJobOptions([]);
                cacheRef.current = {};
                setPage(1);
                setHasMore(true);
                setSearch("");
              }
              if (!upstream.includes("task_id")) {
                updated.task_id = null;
                setTaskAllData([]);
                taskCache.current = {};
                setTaskPage(1);
                setTaskHasMore(true);
                setTaskSearch("");
              }
              setSelectionOrder(upstream);
            } else {
              setSelectionOrder(prev => prev.filter(k => k !== "staff_id"));
            }
          } else {
            // Selecting: refresh downstream dropdowns filtered by new staff
            setSelectionOrder(prev => {
              const newOrder = prev.includes("staff_id") ? prev : [...prev, "staff_id"];
              const staffIdx = newOrder.indexOf("staff_id");
              const customerIdx = newOrder.indexOf("customer_id");
              const clientIdx = newOrder.indexOf("client_id");
              const jobIdx = newOrder.indexOf("job_id");

              if (customerIdx === -1 || staffIdx < customerIdx) {
                const upJobForCustomer = jobIdx !== -1 && jobIdx < staffIdx ? filters.job_id : null;
                const upClientForCustomer = clientIdx !== -1 && clientIdx < staffIdx ? filters.client_id : null;
                customerCache.current = {};
                setCustomerAllData([]);
                setCustomerPage(1);
                setCustomerHasMore(true);
                GetAllCustomer({ searchValue: "", pageNo: 1, job_id: upJobForCustomer, client_id: upClientForCustomer, staff_id: resolvedStaffId });
              }

              if (clientIdx === -1 || staffIdx < clientIdx) {
                const upJobForClient = jobIdx !== -1 && jobIdx < staffIdx ? filters.job_id : null;
                const upCustomerForClient = customerIdx !== -1 && customerIdx < staffIdx ? filters.customer_id : null;
                clientCache.current = {};
                setClientAllData([]);
                setClientPage(1);
                setClientHasMore(true);
                GetAllClient({ searchValue: "", pageNo: 1, job_id: upJobForClient, customer_id: upCustomerForClient, staff_id: resolvedStaffId });
              }

              if (jobIdx === -1 || staffIdx < jobIdx) {
                const upCustomerForJob = customerIdx !== -1 && customerIdx < staffIdx ? filters.customer_id : null;
                const upClientForJob = clientIdx !== -1 && clientIdx < staffIdx ? filters.client_id : null;
                cacheRef.current = {};
                setJobOptions([]);
                setPage(1);
                setHasMore(true);
                GetAllJobs({ searchValue: "", pageNo: 1, customer_id: upCustomerForJob, client_id: upClientForJob, staff_id: resolvedStaffId });
              }

              return newOrder;
            });
          }

          setInternalJobAllData([]);
          setInternalTaskAllData([]);

        } else if (key === "customer_id") {
updated.internal_job_id = null;
          updated.internal_task_id = null;

          const isClearing = [null, undefined, ""].includes(value);

          if (isClearing) {
            // Auto-clear downstream filters (those selected after customer in selectionOrder)
            const custIdx = selectionOrder.indexOf("customer_id");
            if (custIdx !== -1) {
              const upstream = selectionOrder.slice(0, custIdx);
              if (!upstream.includes("client_id")) {
                updated.client_id = null;
                setClientAllData([]);
                clientCache.current = {};
                setClientPage(1);
                setClientHasMore(true);
                setClientSearch("");
              }
              if (!upstream.includes("job_id")) {
                updated.job_id = null;
                setJobOptions([]);
                cacheRef.current = {};
                setPage(1);
                setHasMore(true);
                setSearch("");
              }
              if (!upstream.includes("staff_id")) {
                updated.staff_id = null;
                updated.employee_number = null;
                setStaffAllData([]);
                staffCache.current = {};
                setStaffPage(1);
                setStaffHasMore(true);
                setStaffSearch("");
              }
              if (!upstream.includes("task_id")) {
                updated.task_id = null;
                setTaskAllData([]);
                taskCache.current = {};
                setTaskPage(1);
                setTaskHasMore(true);
                setTaskSearch("");
              }
              // Remove customer and all downstream from selectionOrder
              setSelectionOrder(upstream);
            } else {
              setSelectionOrder(prev => prev.filter(k => k !== "customer_id"));
            }
          } else {
            // Selecting: refresh downstream dropdowns filtered by new customer
            setSelectionOrder(prev => {
              const newOrder = prev.includes("customer_id") ? prev : [...prev, "customer_id"];
              const customerIdx = newOrder.indexOf("customer_id");
              const jobIdx = newOrder.indexOf("job_id");
              const staffIdx = newOrder.indexOf("staff_id");
              const clientIdx = newOrder.indexOf("client_id");

              if (jobIdx === -1 || customerIdx < jobIdx) {
                const upClientForJob = clientIdx !== -1 && clientIdx < customerIdx ? filters.client_id : null;
                const upStaffForJob = staffIdx !== -1 && staffIdx < customerIdx ? filters.staff_id : null;
                cacheRef.current = {};
                setJobOptions([]);
                setPage(1);
                setHasMore(true);
                GetAllJobs({ searchValue: "", pageNo: 1, customer_id: value, client_id: upClientForJob, staff_id: upStaffForJob });
              }

              if (clientIdx === -1 || customerIdx < clientIdx) {
                const upJobForClient = jobIdx !== -1 && jobIdx < customerIdx ? filters.job_id : null;
                const upStaffForClient = staffIdx !== -1 && staffIdx < customerIdx ? filters.staff_id : null;
                clientCache.current = {};
                setClientAllData([]);
                setClientPage(1);
                setClientHasMore(true);
                GetAllClient({ searchValue: "", pageNo: 1, customer_id: value, job_id: upJobForClient, staff_id: upStaffForClient });
              }

              if (staffIdx === -1 || customerIdx < staffIdx) {
                const upJobForStaff = jobIdx !== -1 && jobIdx < customerIdx ? filters.job_id : null;
                const upClientForStaff = clientIdx !== -1 && clientIdx < customerIdx ? filters.client_id : null;
                staffCache.current = {};
                setStaffAllData([]);
                setStaffPage(1);
                setStaffHasMore(true);
                GetAllStaff({ searchValue: "", pageNo: 1, customer_id: value, job_id: upJobForStaff, client_id: upClientForStaff });
              }

              return newOrder;
            });
          }

          setInternalJobAllData([]);
          setInternalTaskAllData([]);
        } else if (key === "client_id") {
updated.internal_job_id = null;
          updated.internal_task_id = null;

          const isClearing = [null, undefined, ""].includes(value);

          if (isClearing) {
            // Auto-clear downstream filters (those selected after client in selectionOrder)
            const clientIdx = selectionOrder.indexOf("client_id");
            if (clientIdx !== -1) {
              const upstream = selectionOrder.slice(0, clientIdx);
              if (!upstream.includes("customer_id")) {
                updated.customer_id = null;
                setCustomerAllData([]);
                customerCache.current = {};
                setCustomerPage(1);
                setCustomerHasMore(true);
                setCustomerSearch("");
              }
              if (!upstream.includes("job_id")) {
                updated.job_id = null;
                setJobOptions([]);
                cacheRef.current = {};
                setPage(1);
                setHasMore(true);
                setSearch("");
              }
              if (!upstream.includes("staff_id")) {
                updated.staff_id = null;
                updated.employee_number = null;
                setStaffAllData([]);
                staffCache.current = {};
                setStaffPage(1);
                setStaffHasMore(true);
                setStaffSearch("");
              }
              if (!upstream.includes("task_id")) {
                updated.task_id = null;
                setTaskAllData([]);
                taskCache.current = {};
                setTaskPage(1);
                setTaskHasMore(true);
                setTaskSearch("");
              }
              // Remove client and all downstream from selectionOrder
              setSelectionOrder(upstream);
            } else {
              setSelectionOrder(prev => prev.filter(k => k !== "client_id"));
            }
          } else {
            // Selecting: refresh downstream dropdowns filtered by new client
            setSelectionOrder(prev => {
              const newOrder = prev.includes("client_id") ? prev : [...prev, "client_id"];
              const clientIdx = newOrder.indexOf("client_id");
              const jobIdx = newOrder.indexOf("job_id");
              const customerIdx = newOrder.indexOf("customer_id");
              const staffIdx = newOrder.indexOf("staff_id");

              if (jobIdx === -1 || clientIdx < jobIdx) {
                const upCustomerForJob = customerIdx !== -1 && customerIdx < clientIdx ? filters.customer_id : null;
                const upStaffForJob = staffIdx !== -1 && staffIdx < clientIdx ? filters.staff_id : null;
                cacheRef.current = {};
                setJobOptions([]);
                setPage(1);
                setHasMore(true);
                GetAllJobs({ searchValue: "", pageNo: 1, client_id: value, customer_id: upCustomerForJob, staff_id: upStaffForJob });
              }

              if (customerIdx === -1 || clientIdx < customerIdx) {
                const upJobForCustomer = jobIdx !== -1 && jobIdx < clientIdx ? filters.job_id : null;
                const upStaffForCustomer = staffIdx !== -1 && staffIdx < clientIdx ? filters.staff_id : null;
                customerCache.current = {};
                setCustomerAllData([]);
                setCustomerPage(1);
                setCustomerHasMore(true);
                GetAllCustomer({ searchValue: "", pageNo: 1, client_id: value, job_id: upJobForCustomer, staff_id: upStaffForCustomer });
              }

              if (staffIdx === -1 || clientIdx < staffIdx) {
                const upJobForStaff = jobIdx !== -1 && jobIdx < clientIdx ? filters.job_id : null;
                const upCustomerForStaff = customerIdx !== -1 && customerIdx < clientIdx ? filters.customer_id : null;
                staffCache.current = {};
                setStaffAllData([]);
                setStaffPage(1);
                setStaffHasMore(true);
                GetAllStaff({ searchValue: "", pageNo: 1, client_id: value, job_id: upJobForStaff, customer_id: upCustomerForStaff });
              }

              return newOrder;
            });
          }

          setInternalJobAllData([]);
          setInternalTaskAllData([]);
        } else if (key === "job_id") {
updated.internal_task_id = null;

          const isClearing = [null, undefined, ""].includes(value);

          if (isClearing) {
            // Auto-clear downstream filters (those selected after job in selectionOrder)
            const jobIdx = selectionOrder.indexOf("job_id");
            if (jobIdx !== -1) {
              const upstream = selectionOrder.slice(0, jobIdx);
              if (!upstream.includes("customer_id")) {
                updated.customer_id = null;
                setCustomerAllData([]);
                customerCache.current = {};
                setCustomerPage(1);
                setCustomerHasMore(true);
                setCustomerSearch("");
              }
              if (!upstream.includes("client_id")) {
                updated.client_id = null;
                setClientAllData([]);
                clientCache.current = {};
                setClientPage(1);
                setClientHasMore(true);
                setClientSearch("");
              }
              if (!upstream.includes("staff_id")) {
                updated.staff_id = null;
                updated.employee_number = null;
                setStaffAllData([]);
                staffCache.current = {};
                setStaffPage(1);
                setStaffHasMore(true);
                setStaffSearch("");
              }
              if (!upstream.includes("task_id")) {
                updated.task_id = null;
                setTaskAllData([]);
                taskCache.current = {};
                setTaskPage(1);
                setTaskHasMore(true);
                setTaskSearch("");
              }
              // Remove job and all downstream from selectionOrder
              setSelectionOrder(upstream);
            } else {
              setSelectionOrder(prev => prev.filter(k => k !== "job_id"));
            }
          } else {
            // Selecting: refresh downstream dropdowns filtered by new job
            setSelectionOrder(prev => {
              const newOrder = prev.includes("job_id") ? prev : [...prev, "job_id"];
              const jobIdx = newOrder.indexOf("job_id");
              const customerIdx = newOrder.indexOf("customer_id");
              const clientIdx = newOrder.indexOf("client_id");
              const staffIdx = newOrder.indexOf("staff_id");

              if (customerIdx === -1 || jobIdx < customerIdx) {
                const upClientForCustomer = clientIdx !== -1 && clientIdx < jobIdx ? filters.client_id : null;
                const upStaffForCustomer = staffIdx !== -1 && staffIdx < jobIdx ? filters.staff_id : null;
                customerCache.current = {};
                setCustomerAllData([]);
                setCustomerPage(1);
                setCustomerHasMore(true);
                GetAllCustomer({ searchValue: "", pageNo: 1, job_id: value, client_id: upClientForCustomer, staff_id: upStaffForCustomer });
              }

              if (clientIdx === -1 || jobIdx < clientIdx) {
                const upCustomerForClient = customerIdx !== -1 && customerIdx < jobIdx ? filters.customer_id : null;
                const upStaffForClient = staffIdx !== -1 && staffIdx < jobIdx ? filters.staff_id : null;
                clientCache.current = {};
                setClientAllData([]);
                setClientPage(1);
                setClientHasMore(true);
                GetAllClient({ searchValue: "", pageNo: 1, job_id: value, customer_id: upCustomerForClient, staff_id: upStaffForClient });
              }

              if (staffIdx === -1 || jobIdx < staffIdx) {
                const upCustomerForStaff = customerIdx !== -1 && customerIdx < jobIdx ? filters.customer_id : null;
                const upClientForStaff = clientIdx !== -1 && clientIdx < jobIdx ? filters.client_id : null;
                staffCache.current = {};
                setStaffAllData([]);
                setStaffPage(1);
                setStaffHasMore(true);
                GetAllStaff({ searchValue: "", pageNo: 1, job_id: value, customer_id: upCustomerForStaff, client_id: upClientForStaff });
              }

              return newOrder;
            });
          }

          setTaskAllData([]);
          taskCache.current = {};
          setTaskPage(1);
          setTaskHasMore(true);
          setTaskSearch("");
          setInternalTaskAllData([]);
        } else if (key === "task_id") {
          updated.internal_task_id = null;
          
          const isClearing = [null, undefined, ""].includes(value);

          if (isClearing) {
            const taskIdx = selectionOrder.indexOf("task_id");
            if (taskIdx !== -1) {
              const upstream = selectionOrder.slice(0, taskIdx);
              if (!upstream.includes("customer_id")) {
                updated.customer_id = null;
                setCustomerAllData([]);
                customerCache.current = {};
                setCustomerPage(1);
                setCustomerHasMore(true);
                setCustomerSearch("");
              }
              if (!upstream.includes("client_id")) {
                updated.client_id = null;
                setClientAllData([]);
                clientCache.current = {};
                setClientPage(1);
                setClientHasMore(true);
                setClientSearch("");
              }
              if (!upstream.includes("job_id")) {
                updated.job_id = null;
                setJobOptions([]);
                cacheRef.current = {};
                setPage(1);
                setHasMore(true);
                setSearch("");
              }
              if (!upstream.includes("staff_id")) {
                updated.staff_id = null;
                updated.employee_number = null;
                setStaffAllData([]);
                staffCache.current = {};
                setStaffPage(1);
                setStaffHasMore(true);
                setStaffSearch("");
              }
              setSelectionOrder(upstream);
            } else {
              setSelectionOrder(prev => prev.filter(k => k !== "task_id"));
            }
          } else {
            setSelectionOrder(prev => {
              const newOrder = prev.includes("task_id") ? prev : [...prev, "task_id"];
              const taskIdx = newOrder.indexOf("task_id");
              const customerIdx = newOrder.indexOf("customer_id");
              const clientIdx = newOrder.indexOf("client_id");
              const staffIdx = newOrder.indexOf("staff_id");
              const jobIdx = newOrder.indexOf("job_id");

              if (customerIdx === -1 || taskIdx < customerIdx) {
                const upClientForCustomer = clientIdx !== -1 && clientIdx < taskIdx ? filters.client_id : null;
                const upStaffForCustomer = staffIdx !== -1 && staffIdx < taskIdx ? filters.staff_id : null;
                const upJobForCustomer = jobIdx !== -1 && jobIdx < taskIdx ? filters.job_id : null;
                customerCache.current = {};
                setCustomerAllData([]);
                setCustomerPage(1);
                setCustomerHasMore(true);
                GetAllCustomer({ searchValue: "", pageNo: 1, task_id: value, job_id: upJobForCustomer, client_id: upClientForCustomer, staff_id: upStaffForCustomer });
              }

              if (clientIdx === -1 || taskIdx < clientIdx) {
                const upCustomerForClient = customerIdx !== -1 && customerIdx < taskIdx ? filters.customer_id : null;
                const upStaffForClient = staffIdx !== -1 && staffIdx < taskIdx ? filters.staff_id : null;
                const upJobForClient = jobIdx !== -1 && jobIdx < taskIdx ? filters.job_id : null;
                clientCache.current = {};
                setClientAllData([]);
                setClientPage(1);
                setClientHasMore(true);
                GetAllClient({ searchValue: "", pageNo: 1, task_id: value, job_id: upJobForClient, customer_id: upCustomerForClient, staff_id: upStaffForClient });
              }

              if (staffIdx === -1 || taskIdx < staffIdx) {
                const upCustomerForStaff = customerIdx !== -1 && customerIdx < taskIdx ? filters.customer_id : null;
                const upClientForStaff = clientIdx !== -1 && clientIdx < taskIdx ? filters.client_id : null;
                const upJobForStaff = jobIdx !== -1 && jobIdx < taskIdx ? filters.job_id : null;
                staffCache.current = {};
                setStaffAllData([]);
                setStaffPage(1);
                setStaffHasMore(true);
                GetAllStaff({ searchValue: "", pageNo: 1, task_id: value, job_id: upJobForStaff, customer_id: upCustomerForStaff, client_id: upClientForStaff });
              }
              
              if (jobIdx === -1 || taskIdx < jobIdx) {
                const upCustomerForJob = customerIdx !== -1 && customerIdx < taskIdx ? filters.customer_id : null;
                const upClientForJob = clientIdx !== -1 && clientIdx < taskIdx ? filters.client_id : null;
                const upStaffForJob = staffIdx !== -1 && staffIdx < taskIdx ? filters.staff_id : null;
                cacheRef.current = {};
                setJobOptions([]);
                setPage(1);
                setHasMore(true);
                GetAllJobs({ searchValue: "", pageNo: 1, task_id: value, customer_id: upCustomerForJob, client_id: upClientForJob, staff_id: upStaffForJob });
              }

              return newOrder;
            });
          }
        } else if (key === "internal_job_id") {
          updated.task_id = null;
          updated.internal_task_id = null;
          setTaskAllData([]);
          taskCache.current = {};
          setTaskPage(1);
          setTaskHasMore(true);
          setTaskSearch("");
          setInternalTaskAllData([]);
        }
        return updated;
      });
    } else if (key === "internal_external") {
      let remainingPart = filters?.groupBy;

      if (value == "1") {
        setOptions([]);
        let remainingPart = filters?.groupBy?.filter(
          (item) => item !== "customer_id" && item !== "client_id",
        );

        let lastIndexValue = remainingPart[remainingPart.length - 1];

        let fieldsToDisplayId = null;
        if (lastIndexValue == "staff_id") {
          if (
            filters?.groupBy.some((item) =>
              ["customer_id", "client_id"].includes(item),
            )
          ) {
            fieldsToDisplayId = null;
          } else {
            fieldsToDisplayId = filters.fieldsToDisplayId;
          }
          // staffData();
          // staffData({ searchValue: "", pageNo: 1 });
        } else {
          fieldsToDisplayId = null;
        }

        setFilters((prev) => ({
          ...prev,
          [key]: value,
          groupBy: remainingPart,
          fieldsToDisplay: null,
          fieldsToDisplayId: fieldsToDisplayId,
        }));
      } else {
        setFilters((prev) => ({
          ...prev,
          [key]: value,
        }));
      }

      let lastIndexValue = remainingPart[remainingPart.length - 1];
      if (lastIndexValue == "job_id") {
        setOptions([]);
      } else if (lastIndexValue == "task_id") {
        setOptions([]);
      } else if (lastIndexValue == "staff_id") {
        setOptions([]);
      } else if (lastIndexValue == "employee_number") {
        setOptions([]);
      }
    } else if (key == "timePeriod") {
      setFilters((prev) => ({
        ...prev,
        fromDate: null,
        toDate: null,
        [key]: value,
      }));
    } else if (key == "fromDate") {
      if (value > filters.toDate) {
        setFilters((prev) => ({
          ...prev,
          toDate: value,
        }));
      }

      setFilters((prev) => ({
        ...prev,
        fromDate: value,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const addAndRemoveGroupBy = (value, type) => {
    if (type == "add") {
      // Do nothing, data will be fetched on dropdown open
    } else if (type == "remove") {
      if (value == "staff_id") {
        setStaffAllData([]);
        setFilters((prev) => ({
          ...prev,
          [value]: null,
        }));
      } else if (value == "customer_id") {
        setCustomerAllData([]);
        setFilters((prev) => ({
          ...prev,
          [value]: null,
        }));
      } else if (value == "client_id") {
        setClientAllData([]);
        setFilters((prev) => ({
          ...prev,
          [value]: null,
        }));
      } else if (value == "job_id") {
        if (filters.internal_external == "0") {
          setJobAllData([]);
          setJobOptions([]);
          setInternalJobAllData([]);
          setFilters((prev) => ({
            ...prev,
            job_id: null,
            internal_job_id: null,
          }));
        } else if (filters.internal_external == "1") {
          setInternalJobAllData([]);
          setFilters((prev) => ({
            ...prev,
            internal_job_id: null,
          }));
        } else if (filters.internal_external == "2") {
          setJobAllData([]);
          setJobOptions([]);
          setFilters((prev) => ({
            ...prev,
            job_id: null,
          }));
        }
      } else if (value == "task_id") {
        if (filters.internal_external == "0") {
          setTaskAllData([]);
          taskCache.current = {};
          setTaskPage(1);
          setTaskHasMore(true);
          setTaskSearch("");
          setInternalTaskAllData([]);
          setFilters((prev) => ({
            ...prev,
            task_id: null,
            internal_task_id: null,
          }));
        } else if (filters.internal_external == "1") {
          setInternalTaskAllData([]);
          setFilters((prev) => ({
            ...prev,
            internal_task_id: null,
          }));
        } else if (filters.internal_external == "2") {
          setTaskAllData([]);
          taskCache.current = {};
          setTaskPage(1);
          setTaskHasMore(true);
          setTaskSearch("");
          setFilters((prev) => ({
            ...prev,
            task_id: null,
          }));
        }
      } else if (value == "employee_number") {
        setEmployeeNumberAllData([]);
        setFilters((prev) => ({
          ...prev,
          [value]: null,
        }));
      }
    }
  };

  const callFilterApi = async (page = currentPage, limit = pageSize) => {
    // Call your filter API here
    setLoading(true);
    const req = { action: "get", filters: filters, role: role, page: page, limit: limit };
    const data = { req: req, authToken: token };
    await dispatch(getTimesheetReportData(data))
      .unwrap()
      .then(async (response) => {
        setLoading(false);
        if (response.status) {
          setShowData(response.data);
          setTotalRecords(response?.data?.pagination?.total || 0);
        } else {
          setShowData([]);
          setTotalRecords(0);
        }
      })
      .catch((error) => {
        setLoading(false);
        return;
      });
  };

  useEffect(() => {
    //if (filters.fieldsToDisplay !== null || role?.toUpperCase() === "SUPERADMIN" || role?.toUpperCase() === "ADMIN") {
    callFilterApi(currentPage, pageSize);
    // }
  }, [
    filters.fieldsToDisplay,
    filters.timePeriod,
    filters.fromDate,
    filters.toDate,
    filters.displayBy,
    filters.internal_external,
    filters.groupBy,
    filters.staff_id,
    filters.customer_id,
    filters.client_id,
    filters.job_id,
    filters.task_id,
    filters.internal_job_id,
    filters.internal_task_id,
    filters.employee_number,
  ]);


  const resetFunction = () => {
    setFilters({
      groupBy: [],
      internal_external: "2",
      fieldsToDisplay: null,
      fieldsToDisplayId: null,
      staff_id: null,
      customer_id: null,
      client_id: null,
      job_id: null,
      task_id: null,
      internal_job_id: null,
      internal_task_id: null,
      timePeriod: "",
      displayBy: "",
      fromDate: null,
      toDate: null,
    });
    setFilterId(null);
    setShowData([]);

    setSelectionOrder([]);
    setStaffAllData([]);
    setCustomerAllData([]);
    setClientAllData([]);
    setJobAllData([]);
    setJobOptions([]);
    setTaskAllData([]);
    taskCache.current = {};
    setTaskPage(1);
    setTaskHasMore(true);
    setTaskSearch("");
    setInternalJobAllData([]);
    setInternalTaskAllData([]);

    //staffData();
  };

  const optionGroupBy = [
    { value: "staff_id", label: "Staff" },
    ...(filters?.internal_external == "2" || filters?.internal_external == "0"
      ? [{ value: "customer_id", label: "Customer" }]
      : []),
    ...(filters?.internal_external == "2" || filters?.internal_external == "0"
      ? [{ value: "client_id", label: "Client" }]
      : []),
    { value: "job_id", label: "Job" },
    { value: "task_id", label: "Task" },
    { value: "employee_number", label: "Employee ID" },
  ];

  const labels = {
    staff_id: "Staff",
    customer_id: "Customer",
    client_id: "Client",
    job_id: "Job",
    task_id: "Task",
  };

  const orderMap = {};
  for (let i = 0; i < optionGroupBy.length; i++) {
    orderMap[optionGroupBy[i].value] = i;
  }

  // sabse fast function
  function sortByReference(selected) {
    if (!Array.isArray(selected) || selected.length <= 1) return selected;
    return selected.slice().sort((a, b) => orderMap[a] - orderMap[b]);
  }


  const saveFilterFunction = async () => {
    if (filters?.groupBy?.length == 0) {
      sweatalert.fire({
        title: "Warning",
        text: "Please select group by one value",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    var req = {
      action: "saveFilters",
      filters: filters,
      id: filterId,
      type: "timesheet_report",
    };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonText: "OK",
          });
          getAllFilters();
        } else {
          sweatalert.fire({
            title: "Error",
            text: "Failed to save filters. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const handleFilterSelect = async (selected) => {
    setFilterId(selected.value);
    // set filters from selected
    let selectedFilter = getAllFilterData?.find(
      (opt) => Number(opt?.value) === Number(selected?.value),
    );

    if (selectedFilter != undefined && selectedFilter.filters) {
      let parsedFilters = {};
      try {
        parsedFilters = JSON.parse(selectedFilter?.filters);

        if (parsedFilters?.groupBy?.includes("staff_id")) {
          //await staffData();
          // staffData({ searchValue: "", pageNo: 1 });
          GetAllStaff({
            searchValue: "",
            pageNo: 1,
            customer_id: parsedFilters?.customer_id,
            client_id: parsedFilters?.client_id,
            job_id: parsedFilters?.job_id
          });
        }
        if (parsedFilters?.groupBy?.includes("customer_id")) {
          // await GetAllCustomer();
          GetAllCustomer({
            searchValue: "",
            pageNo: 1,
            job_id: parsedFilters?.job_id,
            client_id: parsedFilters?.client_id,
          });
        }
        if (parsedFilters?.groupBy?.includes("client_id")) {
          // await GetAllClient();
          GetAllClient({
            searchValue: "",
            pageNo: 1,
            job_id: parsedFilters?.job_id,
            customer_id: parsedFilters?.customer_id,
            staff_id: parsedFilters?.staff_id,
          });
        }
        if (parsedFilters?.groupBy?.includes("job_id")) {
          await GetAllJobs_internal(parsedFilters?.internal_external);
          await GetAllJobs({
            searchValue: "",
            pageNo: 1,
            customer_id: parsedFilters?.customer_id,
            client_id: parsedFilters?.client_id,
            staff_id: parsedFilters?.staff_id,
          });
        }
        if (parsedFilters?.groupBy?.includes("task_id")) {
          await GetAllTask(parsedFilters?.internal_external);
        }

        setFilters(parsedFilters);
        callFilterApi();
      } catch (e) {
        console.error("Error parsing filters JSON: ", e);
      }
    } else {
      setFilters({
        groupBy: ["staff_id"],
        internal_external: "0",
        fieldsToDisplay: null,
        fieldsToDisplayId: null,
        staff_id: null,
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
    }
  };

  const deleteFilterIdFunction = async () => {
    // confirm before delete
    const result = await sweatalert.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      var req = {
        action: "deleteFilterId",
        filterId: filterId,
        type: "timesheet_report",
      };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            sweatalert.fire({
              title: "Success",
              text: response.message,
              icon: "success",
              confirmButtonText: "OK",
            });
            getAllFilters();
            resetFunction();
          } else {
            sweatalert.fire({
              title: "Error",
              text: "Failed to save filters. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((error) => {
          return;
        });
    } else {
      return;
    }
  };


  return (
    <div className="container-fluid pb-3">
      {/* Page Title */}
      <div className="content-title">
        <div className="tab-title mb-3">
          <div className="row align-items-start">
            <div className="col-12 col-sm-7 ">
              <div>
                <h3 className="mt-0">Timesheet Reports</h3>
              </div>




              <div className="w-50 mt-2">
                <label className="form-label fw-medium mt-2 mb-1">
                  Saved Filters
                </label>

                <div className="d-flex align-items-center gap-2">
                  <Select
                    onMenuOpen={() => {
                      if (getAllFilterData.length === 0) getAllFilters();
                    }}
                    options={[
                      { value: "", label: "Select..." },
                      ...getAllFilterData.map((opt) => ({
                        value: opt.value,
                        label: (
                          <span
                            dangerouslySetInnerHTML={{ __html: opt.label }}
                          />
                        ),
                      })),
                    ]}
                    value={
                      getAllFilterData && getAllFilterData.length > 0
                        ? getAllFilterData.find(
                          (opt) => Number(opt.value) === Number(filterId),
                        ) || null
                        : null
                    }
                    onChange={handleFilterSelect}
                    isSearchable
                    className="shadow-sm select-staff rounded-pill flex-grow-1"
                  />

                  {!["", null, undefined].includes(filterId) && (
                    <Trash
                      size={50}
                      title="Delete Filter"
                      onClick={deleteFilterIdFunction}
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* get filters Dropdown */}

            {/* end get filters Dropdown */}

            {/* <div className="col-12 col-sm-5">
              <div className="d-block d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                <button
                  className="btn btn-info d-inline-flex align-items-center gap-2 lh-1"
                  id="btn-export"
                  onClick={() => exportToCSV(showData)}
                >
                     <Download size={16}/>

                  <span>Export Data</span>
                </button>
              </div>
            </div> */}

            {showData && showData.rows && showData.rows.length > 0 && (
              <div className="col-12 col-sm-5">
                <div className="d-block d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                  <button
                    className="btn btn-info d-inline-flex align-items-center gap-2 lh-1"
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
      {/* <div className="row mb-3">
        <div className="col-12">
          <h5 className="fw-semibold mb-0">Timesheet Reports</h5>
        </div>
      </div> */}

      {/* Filters Section */}
      <div className="row g-3 mb-3 bg-light p-3  mt-4 rounded shadow-sm align-items-end">
        {/* Group By */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Group By</label>

          <Select
            isMulti
            options={optionGroupBy}
            value={optionGroupBy.filter((opt) =>
              filters.groupBy.includes(opt.value),
            )}
            onChange={(selectedOptions, actionMeta) => {


              if (actionMeta.action === "remove-value") {
                addAndRemoveGroupBy(actionMeta.removedValue.value, "remove");
              }
              if (actionMeta.action === "select-option") {
                addAndRemoveGroupBy(actionMeta.option.value, "add");
              }
              handleFilterChange(selectedOptions);
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        {/* Field To Internal External */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Internal / External</label>
          <select
            className="form-select shadow-sm"
            id="internal_external"
            value={filters.internal_external}
            onChange={(e) =>
              handleFilterChange({
                target: {
                  key: "internal_external",
                  value: e.target.value,
                  label: e.target.options[e.target.selectedIndex].text,
                },
              })
            }
          >
            <option value="0">Both</option>
            <option value="1">Internal</option>
            <option value="2">External</option>
          </select>
        </div>

        {/* Field To Display */}
        {/* <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">
            {
              `Select ${labels[lastGroupValue] || "..."}`
            }
            {
              lastGroupValue == "job_id" || lastGroupValue == "task_id" ? filters.internal_external === "1" ? " ( Internal )" : " ( External )" : ""
            }

          </label>

          <Select
            options={[
              { value: "", label: "Select..." },
              ...options,
            ]}
            value={
              options && options.length > 0
                ? options.find((opt) => Number(opt.value) === Number(filters.fieldsToDisplayId)) || null
                : null
            }
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "fieldsToDisplay", value: selected.value, label: selected.label },
              })
            }
            isSearchable
            className="shadow-sm select-staff rounded-pill"
          />
        </div> */}

        {/* Field To Display Staff */}
        {filters?.groupBy?.includes("staff_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Staff</label>

            {/* <Select
              options={[{ value: "", label: "Select..." }, ...staffAllData]}
              value={
                staffAllData && staffAllData.length > 0
                  ? staffAllData.find(
                    (opt) => Number(opt.value) === Number(filters.staff_id),
                  ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "staff_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}
            <Select
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                if (staffAllData.length === 0) {
                  const up = getUpstreamFilters("staff_id", filters);
                  GetAllStaff({ searchValue: "", pageNo: 1, customer_id: up.customer_id, client_id: up.client_id, job_id: up.job_id });
                }
              }}
              // options={staffAllData}
              options={[{ value: "", label: "Select..." }, ...staffAllData]}

              value={
                staffAllData && staffAllData.length > 0
                  ? staffAllData.find(
                    (opt) => Number(opt.value) === Number(filters.staff_id)
                  ) || null
                  : null
              }

              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "staff_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }

              onInputChange={(value) => handleStaffSearch(value)}

              onMenuScrollToBottom={() => {
                if (staffHasMore) {
                  const up = getUpstreamFilters("staff_id", filters);
                  GetAllStaff({
                    searchValue: staffSearch,
                    pageNo: staffPage + 1,
                    append: true,
                    customer_id: up.customer_id,
                    client_id: up.client_id,
                    job_id: up.job_id
                  });
                }
              }}

              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Employee Number */}
        {filters?.groupBy?.includes("employee_number") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Employee ID</label>
            <Select
              onMenuOpen={() => {
                if (employeeNumberAllData.length === 0) employeeData();
              }}
              options={[
                { value: "", label: "Select..." },
                ...employeeNumberAllData.filter(e => {
                  // If upstream filters apply, staff must be in staffAllData
                  if (filters.customer_id || filters.client_id || filters.job_id || filters.task_id) {
                    if (!staffAllData.some(staff => Number(staff.value) === Number(e.staff_id))) return false;
                  }
                  return true;
                })
              ]}
              value={
                employeeNumberAllData && employeeNumberAllData.length > 0
                  ? employeeNumberAllData.find(opt => {
                      if (opt.value !== filters.employee_number) return false;
                      // Must also be valid in staffAllData if upstream filters apply
                      if (filters.customer_id || filters.client_id || filters.job_id || filters.task_id) {
                        return staffAllData.some(staff => Number(staff.value) === Number(opt.staff_id));
                      }
                      return true;
                    }) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "employee_number",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Customer */}
        {filters?.groupBy?.includes("customer_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Customer</label>
            {/* <Select
              options={[{ value: "", label: "Select..." }, ...customerAllData]}
              value={
                customerAllData && customerAllData.length > 0
                  ? customerAllData.find(
                    (opt) =>
                      Number(opt.value) === Number(filters.customer_id),
                  ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "customer_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}
            <Select
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                if (customerAllData.length === 0) {
                  const up = getUpstreamFilters("customer_id", filters);
                  GetAllCustomer({ searchValue: "", pageNo: 1, job_id: up.job_id, client_id: up.client_id });
                }
              }}
              options={[{ value: "", label: "Select..." }, ...customerAllData]}
              value={
                customerAllData && customerAllData.length > 0
                  ? customerAllData.find(
                    (opt) =>
                      Number(opt.value) === Number(filters.customer_id),
                  ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "customer_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              onInputChange={(value) => handleCustomerSearch(value)}
              onMenuScrollToBottom={() => {
                if (customerHasMore) {
                  const up = getUpstreamFilters("customer_id", filters);
                  GetAllCustomer({
                    searchValue: customerSearch,
                    pageNo: customerPage + 1,
                    append: true,
                    job_id: up.job_id,
                    client_id: up.client_id,
                  });
                }
              }}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Client */}
        {filters?.groupBy?.includes("client_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Client</label>
            {/* <Select
              options={[{ value: "", label: "Select..." }, ...clientAllData]}
              value={
                clientAllData && clientAllData.length > 0
                  ? clientAllData.find(
                    (opt) => Number(opt.value) === Number(filters.client_id),
                  ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "client_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}

            <Select
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                if (clientAllData.length === 0) {
                  const up = getUpstreamFilters("client_id", filters);
                  GetAllClient({ searchValue: "", pageNo: 1, job_id: up.job_id, customer_id: up.customer_id });
                }
              }}
              options={[{ value: "", label: "Select..." }, ...clientAllData]}
              value={
                clientAllData && clientAllData.length > 0
                  ? clientAllData.find(
                    (opt) => Number(opt.value) === Number(filters.client_id),
                  ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "client_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              onInputChange={(value) => handleClientSearch(value)}
              onMenuScrollToBottom={() => {
                if (clientHasMore) {
                  const up = getUpstreamFilters("client_id", filters);
                  GetAllClient({
                    searchValue: clientSearch,
                    pageNo: clientPage + 1,
                    append: true,
                    job_id: up.job_id,
                    customer_id: up.customer_id,
                  });
                }
              }}
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Job */}

        {filters?.groupBy?.includes("job_id") &&
          filters.internal_external != "1" && (
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">Job</label>
              {/* <Select
                options={[{ value: "", label: "Select..." }, ...jobAllData]}
                value={
                  jobAllData && jobAllData.length > 0
                    ? jobAllData.find(
                      (opt) => Number(opt.value) === Number(filters.job_id),
                    ) || null
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange({
                    target: {
                      key: "job_id",
                      value: selected.value,
                      label: selected.label,
                    },
                  })
                }
                isSearchable
                className="shadow-sm select-staff rounded-pill"
              /> */}
              <Select
                closeMenuOnSelect={false}
                onMenuOpen={() => {
                  if (jobOptions.length === 0) {
                    const up = getUpstreamFilters("job_id", filters);
                    GetAllJobs({ searchValue: "", pageNo: 1, customer_id: up.customer_id, client_id: up.client_id });
                  }
                }}
                options={[{ value: "", label: "Select..." }, ...jobOptions]}
                value={
                  jobOptions && jobOptions.length > 0
                    ? jobOptions.find(
                      (opt) => Number(opt.value) === Number(filters.job_id),
                    ) || null
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange({
                    target: {
                      key: "job_id",
                      value: selected.value,
                      label: selected.label,
                    },
                  })
                }
                onInputChange={(value) => handleSearch(value)}
                onMenuScrollToBottom={() => {
                  if (hasMore) {
                    const up = getUpstreamFilters("job_id", filters);
                    GetAllJobs({
                      searchValue: search,
                      pageNo: page + 1,
                      append: true,
                      customer_id: up.customer_id,
                      client_id: up.client_id,
                    });
                  }
                }}
                isSearchable
                className="shadow-sm select-staff rounded-pill"
              />
            </div>
          )}

        {/* Field To Display task */}
        {filters?.groupBy?.includes("task_id") &&
          filters.internal_external != "1" && (
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">Task</label>
              <Select
                closeMenuOnSelect={false}
                onMenuOpen={() => {
                  if (taskAllData.length === 0) {
                    const up = getUpstreamFilters("task_id", filters);
                    GetAllTask(filters.internal_external, { searchValue: "", pageNo: 1, customer_id: up.customer_id, client_id: up.client_id, job_id: up.job_id, staff_id: up.staff_id });
                  }
                }}
                options={[{ value: "", label: "Select..." }, ...taskAllData]}
                value={
                  taskAllData && taskAllData.length > 0
                    ? taskAllData.find(
                      (opt) => Number(opt.value) === Number(filters.task_id),
                    ) || null
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange({
                    target: {
                      key: "task_id",
                      value: selected.value,
                      label: selected.label,
                    },
                  })
                }
                onInputChange={(value) => handleTaskSearch(value)}
                onMenuScrollToBottom={() => {
                  if (taskHasMore) {
                    const up = getUpstreamFilters("task_id", filters);
                    GetAllTask(filters.internal_external, {
                      searchValue: taskSearch,
                      pageNo: taskPage + 1,
                      append: true,
                      customer_id: up.customer_id,
                      client_id: up.client_id,
                      job_id: up.job_id,
                      staff_id: up.staff_id
                    });
                  }
                }}
                isSearchable
                className="shadow-sm select-staff rounded-pill"
              />
            </div>
          )}

        {/* Field To Display Internal Job */}
        {filters?.groupBy?.includes("job_id") &&
          filters.internal_external != "2" && (
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">
                Select Internal Job
              </label>
              <Select
                onMenuOpen={() => {
                  if (internalJobAllData.length === 0) GetAllJobs_internal(filters.internal_external);
                }}
                options={[
                  { value: "", label: "Select..." },
                  ...internalJobAllData,
                ]}
                value={
                  internalJobAllData && internalJobAllData.length > 0
                    ? internalJobAllData.find(
                      (opt) =>
                        Number(opt.value) === Number(filters.internal_job_id),
                    ) || null
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange({
                    target: {
                      key: "internal_job_id",
                      value: selected.value,
                      label: selected.label,
                    },
                  })
                }
                isSearchable
                className="shadow-sm select-staff rounded-pill"
              />
            </div>
          )}

        {/* Field To Display Internal Task */}
        {filters?.groupBy?.includes("task_id") &&
          filters.internal_external != "2" && (
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">
                Select Internal Task
              </label>
              <Select
                onMenuOpen={() => {
                  if (internalTaskAllData.length === 0) GetAllTask(filters.internal_external);
                }}
                options={[
                  { value: "", label: "Select..." },
                  ...internalTaskAllData,
                ]}
                value={
                  internalTaskAllData && internalTaskAllData.length > 0
                    ? internalTaskAllData.find(
                      (opt) =>
                        Number(opt.value) ===
                        Number(filters.internal_task_id),
                    ) || null
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange({
                    target: {
                      key: "internal_task_id",
                      value: selected.value,
                      label: selected.label,
                    },
                  })
                }
                isSearchable
                className="shadow-sm select-staff rounded-pill"
              />
            </div>
          )}

        {/* Time Period */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Time Period</label>
          <select
            className="form-select shadow-sm"
            id="timePeriod"
            value={filters.timePeriod}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "timePeriod", value: selected.target.value },
              })
            }
          >
            <option value={""}>--Select--</option>
            <option value={"this_week"}>This week</option>
            <option value={"last_week"}>Last Week</option>
            <option value={"this_month"}>This month</option>
            <option value={"last_month"}>Last Month</option>
            <option value={"this_quarter"}>This quarter</option>
            <option value={"last_quarter"}>Last quarter</option>
            <option value={"this_year"}>This year</option>
            <option value={"last_year"}>Last year</option>
            <option value={"custom"}>Custom</option>
          </select>
        </div>

        {/* From Date  And To Date */}
        {filters.timePeriod == "custom" && (
          <>
            {/* <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">From Date</label>
          <input
            type="date"
            className="form-control shadow-sm"
            id="fromDate"
            value={filters.fromDate}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "fromDate", value: selected.target.value },
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
            value={filters.toDate}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "toDate", value: selected.target.value },
              })
            }
          />
        </div> */}
            {/* From Date */}
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">From Date</label>
              <input
                type="date"
                className="form-control shadow-sm"
                id="fromDate"
                value={filters.fromDate}
                //  min={today}
                onChange={(selected) =>
                  handleFilterChange({
                    target: { key: "fromDate", value: selected.target.value },
                  })
                }
              />
            </div>

            {/* To Date */}
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-medium">To Date</label>
              <input
                type="date"
                className="form-control shadow-sm"
                id="toDate"
                value={filters.toDate}
                min={filters.fromDate || today}
                onChange={(selected) =>
                  handleFilterChange({
                    target: { key: "toDate", value: selected.target.value },
                  })
                }
                disabled={!filters.fromDate}
              />
            </div>
          </>
        )}

        {/* Display By */}
        <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Display By</label>
          <select
            className="form-select shadow-sm"
            id="displayBy"
            value={filters.displayBy}
            onChange={(selected) =>
              handleFilterChange({
                target: { key: "displayBy", value: selected.target.value },
              })
            }
          >
            <option value={""}>--Select--</option>
            <option value={"Daily"}>Daily</option>
            <option value={"Weekly"}>Weekly</option>
            <option value={"Monthly"}>Monthly</option>
            <option value={"Fortnightly"}>Fortnightly</option>
            <option value={"Quarterly"}>Quarterly</option>
            <option value={"Yearly"}>Yearly</option>
          </select>
        </div>
        {/* Reset Button */}
        <div className="col-lg-4 col-md-6">
          <button
            className="btn btn-outline-secondary shadow-sm rounded-pill border-3 fw-bold"
            id="btn-reset"
            onClick={() => resetFunction()}
          >
            Clear Filter
          </button>
          <button
            className="btn btn-info shadow-sm rounded-pill ms-3"
            id="btn-reset"
            onClick={() => saveFilterFunction()}
          >
            Save Filters
          </button>
        </div>
      </div>

      {/* Filtered Data Display */}
      <div className="datatable-container">
        {loading && (
          <div className="overlay">
            <div className="loader"></div>
          </div>
        )}

        {showData?.rows == undefined || showData?.rows?.length === 0 ? (
          <div className="text-center">
            <img
              src={noDataImage}
              alt="No records available"
              style={{ width: "250px", height: "auto", objectFit: "contain" }}
            />
            <p className="fs-16">There are no records to display</p>
          </div>
        ) : (
          <div className="table-responsive fixed-table-header">
            <table
              className="table rdt_Table"

            >
              <thead >
                <tr className="rdt_TableHeadRow">
                  {showData?.columns?.map((col, idx) => (
                    <th
                      className="border-bottom-0"
                      key={idx}
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        minWidth: "130px",
                      }}
                    >
                      {getColumnName(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {showData?.rows?.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {showData?.columns?.map((col, colIdx) => (
                      <td key={colIdx} style={{ padding: "10px" }}>
                        {[undefined, null, ""]?.includes(row[col]) ? "-" : row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalRecords > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(totalRecords / pageSize) || 1}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              activeClassName={"active"}
              forcePage={currentPage - 1}
            />
            <select
              className="perpage-select"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </div>
        )}

      </div>
    </div>
  );
}

function getColumnName(columnKey) {
  const dayMap = {
    staff_id: "Staff",
    customer_id: "Customer",
    client_id: "Client",
    job_id: "Job",
    task_id: "Task",
    total_hours: "Total Hours",
    total_records: "Total Records",
    task_type: "Task Type",
    employee_number: "Employee ID",
  };

  // ✅ check if columnKey is a date string (yyyy-mm-dd format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(columnKey)) {
    const date = new Date(columnKey); // convert string to Date
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${columnKey} ${days[date.getDay()]} (hrs)`;
  }

  // fallback from map
  return dayMap[columnKey] || columnKey;
}

export default TimesheetReport;
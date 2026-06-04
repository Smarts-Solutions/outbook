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
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
import dayjs from "dayjs";
import sweatalert from "sweetalert2";
import { Trash,Download } from "lucide-react";

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

  const GetAllStaff = async ({ searchValue = "", pageNo = 1, append = false }) => {
    if (role?.toUpperCase() === "SUPERADMIN" || role?.toUpperCase() === "ADMIN") {
      if (loading) return;
      const cacheKey = `${searchValue}_${pageNo}`;
      if (staffCache.current[cacheKey]) {

        const cached = staffCache.current[cacheKey];

        setStaffAllData(prev => {
          const combined = [...prev, ...cached];
          const unique = Array.from(
            new Map(combined.map(item => [item.value, item])).values()
          );
          return unique;
        });

        return;
      }
      setLoading(true);
      const req = {
        action: "get",
        page: pageNo,
        limit: 20,
        search: searchValue
      };
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
            const unique = Array.from(
              new Map(combined.map(item => [item.value, item])).values()
            );
            return unique;
          });

          setStaffHasMore(response.data.data.length === 20);
          setStaffPage(pageNo);
        } else {
          if (!append) setStaffAllData([]);
        }
      } catch (error) { }
      setLoading(false);

    } else {
      let dataList = [
        {
          value: staffDetails?.id,
          label: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})`,
        }
      ];

      try {
        const req = { action: "get_my_line_managers" };
        const response = await dispatch(Staff({ req, authToken: token })).unwrap();
        if (response.status && response.data) {
          response.data.forEach(manager => {
            if (!dataList.find(item => item.value === manager.id)) {
              dataList.push({
                value: manager.id,
                label: `${manager.first_name} ${manager.last_name} (${manager.email})`
              });
            }
          });
        }
      } catch (err) {}

      setStaffAllData(dataList);
    }

  };

  const handleStaffSearch = (value) => {

    if (value === "") return;
    clearTimeout(staffDebounceRef.current);
    staffDebounceRef.current = setTimeout(() => {
      setStaffSearch(value);
      GetAllStaff({
        searchValue: value,
        pageNo: 1
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
                label: `${manager.employee_number}`
              });
            }
          });
        }
      } catch (err) {}

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

  const GetAllCustomer = async ({ searchValue = "", pageNo = 1, append = false }) => {
    if (loading) return;
    const cacheKey = `${searchValue}_${pageNo}`;
    if (customerCache.current[cacheKey]) {
      const cached = customerCache.current[cacheKey];
      setCustomerAllData(prev => {
        const combined = [...prev, ...cached];
        const unique = Array.from(
          new Map(combined.map(item => [item.value, item])).values()
        );
        return unique;
      });
      return;
    }

    setLoading(true);
    const req = {
      action: "get_customers_filter",
      filters: filters,
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: 20
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
        // setCustomerAllData(prev =>
        //   append ? [...prev, ...formatted] : formatted
        // );
        setCustomerAllData(prev => {
          const combined = [...prev, ...formatted];
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
        pageNo: 1
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

  const GetAllClient = async ({ searchValue = "", pageNo = 1, append = false }) => {
    if (loading) return;
    const cacheKey = `${searchValue}_${pageNo}`;
    if (clientCache.current[cacheKey]) {
      const cached = clientCache.current[cacheKey];
      setClientAllData(prev => {
        const combined = [...prev, ...cached];
        const unique = Array.from(
          new Map(combined.map(item => [item.value, item])).values()
        );
        return unique;
      });
      return;
    }
    setLoading(true);
    const req = {
      action: "get_clients_filter",
      filters: filters,
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: 20
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
        // setClientAllData(prev =>
        //   append ? [...prev, ...formatted] : formatted
        // );
        setClientAllData(prev => {
          const combined = [...prev, ...formatted];
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
    setLoading(false);
  };
  const handleClientSearch = (value) => {
    if (value === "") {
      return;
    }
    clearTimeout(clientDebounceRef.current);
    clientDebounceRef.current = setTimeout(() => {
      setClientSearch(value);
      GetAllClient({
        searchValue: value,
        pageNo: 1
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

  const GetAllJobs = async ({ searchValue = "", pageNo = 1, append = false }) => {
    if (loading) return;
    const cacheKey = `${searchValue}_${pageNo}`;
    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey];
      setJobOptions(prev => {
        const combined = [...prev, ...cached];
        const unique = Array.from(
          new Map(combined.map(item => [item.value, item])).values()
        );
        return unique;
      });
      return;
    }
    setLoading(true);
    const req = {
      action: "get_jobs_filter",
      filters: filters,
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: 20
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
        // setJobOptions(prev =>
        //   append ? [...prev, ...formatted] : formatted
        // );
        setJobOptions(prev => {
          const combined = [...prev, ...formatted];
          const unique = Array.from(
            new Map(combined.map(item => [item.value, item])).values()
          );
          return unique;
        });
        setHasMore(response.data.length === 20);
        setPage(pageNo);
      }
    } catch (err) { }
    setLoading(false);

  };

  const handleSearch = (value) => {
    if (value === "") {
      return;
    }
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
      GetAllJobs({ searchValue: value, pageNo: 1 });
    }, 500);

  };
  ///////////////---- FOR JOB SERACH  END-----//////////////

  // Get All task
  const GetAllTask = async (internal_external) => {
    if (internal_external == "0") {
      var req = { action: "getInternalTasks" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
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
        .catch((error) => {
          return;
        });

      // External Task
      var req = { action: "get" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.task_id,
              label: item.task_name,
            }));
            setTaskAllData(data);
          } else {
            setTaskAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return;
    } else if (internal_external == "1") {
      var req = { action: "getInternalTasks" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
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
        .catch((error) => {
          return;
        });
      return;
    } else if (internal_external == "2") {
      // External Task
      const req = { action: "get" };
      const data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.task_id,
              label: item.task_name,
            }));
            setTaskAllData(data);
          } else {
            setTaskAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
      return;
    }
  };

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
        if (key === "staff_id") {
          if (prev.staff_id !== updated.staff_id) {
            updated.customer_id = null;
            updated.client_id = null;
            updated.job_id = null;
            updated.task_id = null;
            updated.internal_job_id = null;
            updated.internal_task_id = null;

            setCustomerAllData([]);
            customerCache.current = {};
            debounceRef.current = null;
            setCustomerPage(1);
            setCustomerHasMore(true);
            setCustomerSearch("");

            setClientAllData([]);
            clientCache.current = {};
            clientDebounceRef.current = null;
            setClientPage(1);
            setClientHasMore(true);
            setClientSearch("");

            setJobAllData([]);
            setJobOptions([]);
            cacheRef.current = {};
            debounceTimeout.current = null;
            setPage(1);
            setHasMore(true);
            setSearch("");

            setInternalJobAllData([]);
            setTaskAllData([]);
            setInternalTaskAllData([]);
          }

          if (updated.staff_id && updated.employee_number) {
            const matchedEmployee = employeeNumberAllData.find(e => Number(e.staff_id) === Number(updated.staff_id));
            if (!matchedEmployee || matchedEmployee.value !== updated.employee_number) {
              updated.employee_number = null;
            }
          }
        } else if (key === "employee_number") {
          if (prev.employee_number !== updated.employee_number) {
            updated.customer_id = null;
            updated.client_id = null;
            updated.job_id = null;
            updated.task_id = null;
            updated.internal_job_id = null;
            updated.internal_task_id = null;

            setCustomerAllData([]);
            customerCache.current = {};
            debounceRef.current = null;
            setCustomerPage(1);
            setCustomerHasMore(true);
            setCustomerSearch("");

            setClientAllData([]);
            clientCache.current = {};
            clientDebounceRef.current = null;
            setClientPage(1);
            setClientHasMore(true);
            setClientSearch("");

            setJobAllData([]);
            setJobOptions([]);
            cacheRef.current = {};
            debounceTimeout.current = null;
            setPage(1);
            setHasMore(true);
            setSearch("");

            setInternalJobAllData([]);
            setTaskAllData([]);
            setInternalTaskAllData([]);
          }

          if (updated.employee_number) {
            const matchedEmployee = employeeNumberAllData.find(e => e.value === updated.employee_number);
            if (matchedEmployee) {
              updated.staff_id = matchedEmployee.staff_id;
            }
          }
        } else if (key === "customer_id") {
          updated.client_id = null;
          updated.job_id = null;
          updated.task_id = null;
          updated.internal_job_id = null;
          updated.internal_task_id = null;
          
          setClientAllData([]);
          clientCache.current = {};
          clientDebounceRef.current = null;
          setClientPage(1);
          setClientHasMore(true);

          setJobAllData([]);
          setJobOptions([]);
          cacheRef.current = {};
          debounceTimeout.current = null;
          setPage(1);
          setHasMore(true);

          setInternalJobAllData([]);
          setTaskAllData([]);
          setInternalTaskAllData([]);
        } else if (key === "client_id") {
          updated.job_id = null;
          updated.task_id = null;
          updated.internal_job_id = null;
          updated.internal_task_id = null;
          
          setJobAllData([]);
          setJobOptions([]);
          cacheRef.current = {};
          debounceTimeout.current = null;
          setPage(1);
          setHasMore(true);

          setInternalJobAllData([]);
          setTaskAllData([]);
          setInternalTaskAllData([]);
        } else if (key === "job_id" || key === "internal_job_id") {
          updated.task_id = null;
          updated.internal_task_id = null;
          setTaskAllData([]);
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

  const callFilterApi = async () => {
    // Call your filter API here
    const req = { action: "get", filters: filters, role: role };
    const data = { req: req, authToken: token };
    await dispatch(getTimesheetReportData(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setShowData(response.data);
        } else {
          setShowData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    //if (filters.fieldsToDisplay !== null || role?.toUpperCase() === "SUPERADMIN" || role?.toUpperCase() === "ADMIN") {
    callFilterApi();
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

    setStaffAllData([]);
    setCustomerAllData([]);
    setClientAllData([]);
    setJobAllData([]);
    setJobOptions([]);
    setTaskAllData([]);
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
            pageNo: 1
          });
        }
        if (parsedFilters?.groupBy?.includes("customer_id")) {
          // await GetAllCustomer();
          GetAllCustomer({ searchValue: "", pageNo: 1 });
        }
        if (parsedFilters?.groupBy?.includes("client_id")) {
          // await GetAllClient();
          GetAllClient({ searchValue: "", pageNo: 1 });
        }
        if (parsedFilters?.groupBy?.includes("job_id")) {
          await GetAllJobs_internal(parsedFilters?.internal_external);
          await GetAllJobs({ searchValue: "", pageNo: 1 });
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
                   <Download size={16}/>
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
                if (staffAllData.length === 0) GetAllStaff({ searchValue: "", pageNo: 1 });
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
                  GetAllStaff({
                    searchValue: staffSearch,
                    pageNo: staffPage + 1,
                    append: true
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
                ...(filters.staff_id 
                  ? employeeNumberAllData.filter(e => Number(e.staff_id) === Number(filters.staff_id)) 
                  : employeeNumberAllData),
              ]}
              value={
                employeeNumberAllData && employeeNumberAllData?.length > 0
                  ? employeeNumberAllData?.find(
                    (opt) => opt.value === filters.employee_number,
                  ) || null
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
                if (customerAllData.length === 0) GetAllCustomer({ searchValue: "", pageNo: 1 });
              }}
              // options={customerAllData}
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
                  GetAllCustomer({
                    searchValue: customerSearch,
                    pageNo: customerPage + 1,
                    append: true
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
                if (clientAllData.length === 0) GetAllClient({ searchValue: "", pageNo: 1 });
              }}
              // options={clientAllData}
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
                  GetAllClient({
                    searchValue: clientSearch,
                    pageNo: clientPage + 1,
                    append: true
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
                  if (jobOptions.length === 0) GetAllJobs({ searchValue: "", pageNo: 1 });
                }}
                // options={jobOptions}
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
                    GetAllJobs({
                      searchValue: search,
                      pageNo: page + 1,
                      append: true
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
                onMenuOpen={() => {
                  if (taskAllData.length === 0) GetAllTask(filters.internal_external);
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
                        {row[col] !== undefined ? row[col] : ""}
                      </td>
                    ))}
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

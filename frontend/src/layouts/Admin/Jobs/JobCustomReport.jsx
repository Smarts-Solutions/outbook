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
import { TextSelect } from "lucide-react";
import { convertDate, convertDate1 } from "../../../Utils/Comman_function";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { AsyncPaginate } from "react-select-async-paginate";
import { Download, Trash } from "lucide-react";

function JobCustomReport() {
  const noDataImage = "/assets/images/No-data-amico.png";
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [options, setOptions] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = staffDetails?.role;

  const [showData, setShowData] = useState([]);
  const navigate = useNavigate();

  const clientToCustomerMap = useRef({});
  const jobToClientMap = useRef({});
  const jobToCustomerMap = useRef({});
  const optionCacheRef = useRef({});



  /////////PAGINATION/////////
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  ////////////////////////

  const [accountManagerAllData, setAccountManagerAllData] = useState([]);
  const [allocatedToAllData, setAllocatedToAllData] = useState([]);
  const [reviewerAllData, setReviewerAllData] = useState([]);
  const [otherStaffAllData, setOtherStaffAllData] = useState([]);
  const [employeeNumberAllData, setEmployeeNumberAllData] = useState([]);
  const [customerAllData, setCustomerAllData] = useState([]);
  const [clientAllData, setClientAllData] = useState([]);
  const [jobAllData, setJobAllData] = useState([]);
  const [serviceAllData, setServiceAllData] = useState([]);
  const [jobTypeAllData, setJobTypeAllData] = useState([]);
  const [statusAllData, setStatusAllData] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const [taskAllData, setTaskAllData] = useState([]);
  const [internalJobAllData, setInternalJobAllData] = useState([]);
  const [internalTaskAllData, setInternalTaskAllData] = useState([]);

  const [getAllFilterData, setGetAllFilterData] = useState([]);

  // set filter id
  const [filterId, setFilterId] = useState(null);

  const [filters, setFilters] = useState({
    groupBy: [
      "job_id",
      "customer_id",
      "client_id",
      "account_manager_id",
      "allocated_to_id",
      "reviewer_id",
      "allocated_to_other_id",
      "service_id",
      "job_type_id",
      "status_type_id",
    ],
    additionalField: [],
    job_id: [],
    customer_id: [],
    client_id: [],
    account_manager_id: [],
    allocated_to_id: [],
    reviewer_id: [],
    allocated_to_other_id: [],
    service_id: [],
    job_type_id: [],
    status_type_id: [],
    employee_number: [],
    line_manager_id: [],
    timePeriod: "this_week",
    displayBy: "",
    fromDate: null,
    toDate: null,
  });

  let lastGroupValue = filters?.groupBy[filters?.groupBy?.length - 1];

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

  // Get All Jobs
  // const GetAllJobs = async (filter) => {
  //   const req = { action: "get_jobs_filter", filters: filter };
  //   const data = { req: req, authToken: token };
  //   await dispatch(JobAction(data))
  //     .unwrap()
  //     .then(async (response) => {
  //       if (response.status) {
  //         const data = response?.data?.map((item) => ({
  //           value: item.job_id,
  //           label: item.job_code_id,
  //         }));
  //         setJobAllData(data);
  //       } else {
  //         setJobAllData([]);
  //       }
  //     })
  //     .catch((error) => {
  //       return;
  //     });
  //   return;

  // };

  const getAllFilters = async () => {
    var req = { action: "getAllFilters", type: "job_custom_report" };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            // label: `Group By : [${JSON.parse(item?.groupBy)}]  ⮞ Staff : ${item.staff_fullname}  ⮞ Customer : ${item.customer_name}  ⮞ Client : ${item.client_name}  ⮞ Job : ${item.job_name}  ⮞ Task : ${item.task_name}  ⮞ Internal Job : ${item.internal_job_name}  ⮞ Internal Task : ${item.internal_task_name}`,
            label: `
            Group By : [${JSON.parse(item?.groupBy)?.map((item) =>
              item.replace(/_id$/i, ""),
            )}]<br/>
            
            ${item.job_name ? `⮞ Job : ${item.job_name}<br/>` : ""}
            ${item.customer_name
                ? `⮞ Customer : ${item.customer_name}<br/>`
                : ""
              }
            ${item.client_name ? `⮞ Client : ${item.client_name}<br/>` : ""}
            ${item.account_manager_name
                ? `⮞ Account Manager Name : ${item.account_manager_name}<br/>`
                : ""
              }
            ${item.allocated_to_name
                ? `⮞ Allocated To : ${item.allocated_to_name}<br/>`
                : ""
              }
            ${item.reviewer_name
                ? `⮞ Reviewer : ${item.reviewer_name}<br/>`
                : ""
              }
            ${item.allocated_to_other_name
                ? `⮞ Allocated To (Other) : ${item.allocated_to_other_name}<br/>`
                : ""
              }
            ${item.service_name
                ? `⮞ Service Type : ${item.service_name}<br/>`
                : ""
              }
            ${item.job_type_name
                ? `⮞ Job Type : ${item.job_type_name}<br/>`
                : ""
              }
            ${item.status_type_name
                ? `⮞ Status : ${item.status_type_name}<br/>`
                : ""
              }

            ${item.timePeriod
                ? `⮞ Time Period : ${formatStringToTitleCase(
                  item.timePeriod,
                )}<br/>`
                : ""
              }
            ${item.displayBy
                ? `⮞ Display By : ${formatStringToTitleCase(
                  item.displayBy,
                )}<br/>`
                : ""
              }
            ${!["", null, "null", undefined].includes(item.fromDate)
                ? `⮞ From Date : ${formatStringToTitleCase(
                  item.fromDate,
                  "date",
                )}<br/>`
                : ""
              }
            ${!["", null, "null", undefined].includes(item.toDate)
                ? `⮞ To Date : ${formatStringToTitleCase(item.toDate, "date")}`
                : ""
              }
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
    // API calls deferred to onMenuOpen of their respective dropdowns to reduce initial load time
    getAllFilters();
  }, []);

  // Get All Customers
  // const GetAllCustomer = async (type) => {
  //   const req = { action: "get_customers_filter", filters: type };
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
  //     });
  //   return
  // };

  // Get All Clients
  // const GetAllClient = async (type) => {
  //   const req = { action: "get_clients_filter", filters: type };
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
  //     });
  //   return
  // };

  // All Type Staff Get
  const staffData = async (role_id, type) => {
    /// alert(role_id);
    if (["", null, undefined].includes(role_id)) {
      return;
    }

    if (Number(role_id) == 4) {
      var req = {
        action: "getStaffWithRole",
        role_id: role_id || "",
        filters: type,
      };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.email})`,
            }));
            setAccountManagerAllData(data);
          } else {
            setAccountManagerAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
    } else if (Number(role_id) == 3) {
      var req = {
        action: "getStaffWithRole",
        role_id: role_id || "",
        filters: type,
      };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.email})`,
            }));
            setAllocatedToAllData(data);
          } else {
            setAllocatedToAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
    } else if (Number(role_id) == 6) {
      var req = {
        action: "getStaffWithRole",
        role_id: role_id || "",
        filters: type,
      };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.email})`,
            }));
            setReviewerAllData(data);
          } else {
            setReviewerAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
    } else if (role_id == "other") {
      var req = {
        action: "getStaffWithRole",
        role_id: role_id || "",
        filters: type,
      };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data?.map((item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.email})`,
            }));
            setOtherStaffAllData(data);
          } else {
            setOtherStaffAllData([]);
          }
        })
        .catch((error) => {
          return;
        });
    } else if (role_id == "employee_number") {
      var req = { action: "getStaffWithRole", role_id: role_id || "", filters: type };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            const data = response?.data
              ?.filter(
                (item) =>
                  ![null, "", "null", undefined].includes(
                    item.employee_number,
                  ),
              )
              ?.map((item) => ({
                value: item.employee_number,
                // value: item.id,
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
      return;
    }
  };

  // Get All Service
  const GetAllService = async (type) => {
    var req = { action: "getAllService", filters: type };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setServiceAllData(data);
        } else {
          setServiceAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
    return;
  };

  // Get All Service
  const GetAllJobType = async (type) => {
    var req = { action: "getAllJobType", filters: type };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.type,
          }));
          setJobTypeAllData(data);
        } else {
          setJobTypeAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
    return;
  };

  // Get All Status
  const GetAllStatus = async (type) => {
    var req = { action: "getAllStatus", filters: type };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setStatusAllData(data);
        } else {
          setStatusAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
    return;
  };

  const exportToCSV = async (data1) => {
    setLoading(true);
    const req = {
      action: "getJobCustomReport",
      filters: filters,
      role: role,
      page: 1,
      limit: 100000,
    };
    const data = { req: req, authToken: token };
    await dispatch(getTimesheetReportData(data))
      .unwrap()
      .then(async (response) => {
        setLoading(false);

        if (response.status) {
          const data = response.data;
          const colMap = {
            job_id: "Job Name",
            customer_id: "Customer Name",
            client_id: "Client Name",
            account_manager_id: "Account Manager Name",
            allocated_to_id: "Allocated To",
            reviewer_id: "Reviewer",
            allocated_to_other_id: "Allocated To (Other)",
            service_id: "Service Type",
            job_type_id: "Job Type",
            status_type_id: "Job Status",
            employee_number: "Employee ID",
            allocated_on: "Allocated On",
            job_priority: "Job Priority",
            engagement_model: "Engagement Model",
            customer_account_manager_officer:
              "Customer Account Manager (Officer)",
            status_updation_date: "Status Updation Date",
            Transactions_Posting_id_2: "Transactions Posting",
            Number_of_Bank_Transactions_id_2: "Number of Bank Transactions",
            Number_of_Journal_Entries_id_2: "Number of Journal Entries",
            Number_of_Other_Transactions_id_2: "Number of Other Transactions",
            Number_of_Petty_Cash_Transactions_id_2:
              "Number of Petty Cash Transactions",
            Number_of_Purchase_Invoices_id_2: "Number of Purchase Invoices",
            Number_of_Sales_Invoices_id_2: "Number of Sales Invoices",
            Number_of_Total_Transactions_id_2: "Number of Total Transactions",
            submission_deadline: "Submission Deadline",
            Tax_Year_id_4: "Tax Year",
            If_Sole_Trader_Who_is_doing_Bookkeeping_id_4:
              "Who is doing Bookkeeping",
            Whose_Tax_Return_is_it_id_4: "Whose Tax Return is it",
            Type_of_Payslip_id_3: "Type of Payslip",
            Year_Ending_id_1: "Year Ending",
            Bookkeeping_Frequency_id_2: "Bookkeeping Frequency",
            CIS_Frequency_id_3: "CIS Frequency",
            Filing_Frequency_id_8: "Filing Frequency",
            Management_Accounts_Frequency_id_6: "Management Accounts Frequency",
            Payroll_Frequency_id_3: "Payroll Frequency",
            budgeted_hours: "Budgeted Hours",
            feedback_incorporation_time: "Feedback Incorporation Time",
            review_time: "Review Time",
            total_preparation_time: "Total Preparation Time",
            total_time: "Total Time",
            due_on: "Due On",
            customer_deadline_date: "Customer Deadline Date",
            date_received_on: "Date Received On",
            expected_delivery_date: "Expected Delivery Date",
            internal_deadline_date: "Internal Deadline Date",
            sla_deadline_date: "SLA Deadline Date",
            Management_Accounts_FromDate_id_6: "Management Accounts From Date",
            Management_Accounts_ToDate_id_6: "Management Accounts To Date",
            staff_full_name: "Staff Full Name",
            role: "Role",
            staff_email: "Staff Email",
            line_manager: "Line Manager",
            staff_status: "Staff Status",
          };

          const headers = data.columns.map((col) => colMap[col] || col);
          const rows = data.rows.map((row) => {
            return data.columns.map((col) => {
              let val = row[col];

              // 1) NULL / undefined / empty
              if (val === undefined || val === null || val === "") {
                val = "-";
              }

              // 2) Convert to string
              val = String(val);

              // 3) Safe date (dd/mm/yyyy)
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
                val = `"${val}"`;
                return val;
              }

              // 4) If contains comma OR quotes → wrap in quotes
              if (val.includes(",") || val.includes('"')) {
                val = val.replace(/"/g, '""'); // escape inner quotes
                val = `"${val}"`; // wrap for CSV
              }
              return val;
            });
          });

          const csvContent = [headers, ...rows]
            .map((r) => r.join(","))
            .join("\n");
          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "JobCustomReportData.csv";
          link.click();
          setLoading(false);
          return;
        } else {
          setLoading(false);
          return;
        }
      })
      .catch((error) => {
        setLoading(false);
        return;
      });
  };

  const handleFilterChange = (e, type) => {
    
    if (type == "additionalField") {
      const values = e.map((opt) => opt.value);
      let additionalFieldArray = sortByReference(values);
      setFilters((prev) => ({
        ...prev,
        additionalField: sortByReference(additionalFieldArray),
      }));
      return;
    }

    if (Array.isArray(e)) {

      
      // this case is for multi-select (Group By)
      const values = e.map((opt) => opt.value);
      setOptions([]);
      let gropByArray = sortByReference(values);


      if (gropByArray.length == 0) {
        setIsAllSelected(false);
      }

      if (!gropByArray.includes("job_id")) {
        setFilters((prev) => ({
          ...prev,
          groupBy: sortByReference(gropByArray),
          additionalField: [],
        }));
        return;
      } else {
        setFilters((prev) => ({
          ...prev,
          groupBy: sortByReference(gropByArray),
        }));
        return;
      }
    }

    const { key, value, label } = e.target;
    

    if (key == "timePeriod") {
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
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        
        // Downward hierarchy clearing only when completely deselected
        // if (key === "customer_id") {
        //   if (!value || value.length === 0) {
        //     newFilters.client_id = [];
        //     newFilters.job_id = [];
        //   } else {
        //     newFilters.client_id = (prev.client_id || []).filter((id) => {
        //       const custId = clientToCustomerMap.current[id];
        //       return custId && value.map(Number).includes(Number(custId));
        //     });
        //     newFilters.job_id = (prev.job_id || []).filter((id) => {
        //       const custId = jobToCustomerMap.current[id];
        //       return custId && value.map(Number).includes(Number(custId));
        //     });
        //   }
        // } 
        // else if (key === "client_id") {
        //   if (!value || value.length === 0) {
        //     newFilters.job_id = [];
        //   } else {
        //     newFilters.job_id = (prev.job_id || []).filter((id) => {
        //       const cliId = jobToClientMap.current[id];
        //       return cliId && value.map(Number).includes(Number(cliId));
        //     });
        //   }
        // }
        return newFilters;
      });
    
        if(key === "job_id") {
        setCustomerAllData([]);
        GetAllCustomer({
        searchValue: "",
        pageNo: 1,
        append: true,
        job_id: value,
        client_id: filters.client_id,
        });

        GetAllClient({
        searchValue: "",
        pageNo: 1,
        append: true,
        job_id: value,
        customer_id: filters.customer_id,
        });  
      }

      else if (key === "customer_id") {
        setJobOptions([]); 
        GetAllJobs({
        searchValue: "",
        pageNo: 1,
        append: true,
        customer_id: value,
        client_id: filters.client_id,
        });
        
        setClientAllData([]);
        GetAllClient({
        searchValue: "",
        pageNo: 1,
        append: true,
        customer_id: value,
        job_id: filters.job_id,
        });  
       } 

      // The rest of the commented code below can remain as is
      // if (key == "job_id") {
      //   if ([null, "", "null", undefined].includes(value)) {
      //     GetAllCustomer("all");
      //     GetAllClient("all");
      //     GetAllService("all");
      //     GetAllJobType("all");
      //     GetAllStatus("all");
      //     staffData(4);
      //     staffData(3);
      //     staffData(6);
      //     staffData("other");
      //   } else {
      //     GetAllCustomer(newFilters);
      //     GetAllClient(newFilters);
      //     GetAllService(newFilters);
      //     GetAllJobType(newFilters);
      //     GetAllStatus(newFilters);
      //     staffData(4, newFilters);
      //     staffData(3, newFilters);
      //     staffData(6, newFilters);
      //     staffData("other", newFilters);
      //   }
      // } else if (key == "customer_id") {
      //   if ([null, "", "null", undefined].includes(value)) {
      //     GetAllClient("all");
      //     GetAllJobs("all");
      //   } else {
      //     GetAllClient(newFilters);
      //     GetAllJobs(newFilters);
      //   }
      // } else if (key == "client_id") {
      //   if ([null, "", "null", undefined].includes(value)) {
      //     if ([null, "", "null", undefined].includes(filters.job_id)) {
      //       GetAllCustomer("all");
      //     }

      //     if (![null, "", "null", undefined].includes(filters.customer_id)) {
      //       GetAllJobs("all");
      //     } else {
      //       GetAllJobs(newFilters);
      //     }
      //   } else {
      //     GetAllJobs(newFilters);
      //     GetAllCustomer(newFilters);
      //   }
      // }
    }
  };

  const addAndRemoveGroupBy = (value, type) => {
    if (type == "add") {
      // if (value == "job_id") {
      //   GetAllJobs("all");
      // } else if (value == "customer_id") {
      //   if (["", null, undefined].includes(filters.job_id)) {
      //     GetAllCustomer("all"); // fetch all customers
      //   } else {
      //     GetAllCustomer(filters); // fetch filtered customers
      //   }
      // } else if (value == "client_id") {
      //   if (["", null, undefined].includes(filters.job_id)) {
      //     GetAllClient("all"); // fetch all clients
      //   } else {
      //     GetAllClient(filters); // fetch filtered clients
      //   }
      // }

      const hasFilters = filters?.job_id?.length > 0 || filters?.client_id?.length > 0 || filters?.customer_id?.length > 0;
      if (value == "account_manager_id") {
        if (!hasFilters) staffData(4, "all");
        else staffData(4, filters);
      } else if (value == "allocated_to_id") {
        if (!hasFilters) staffData(3, "all");
        else staffData(3, filters);
      } else if (value == "reviewer_id") {
        if (!hasFilters) staffData(6, "all");
        else staffData(6, filters);
      } else if (value == "allocated_to_other_id") {
        if (!hasFilters) staffData("other", "all");
        else staffData("other", filters);
      } else if (value == "service_id") {
        if (!hasFilters) GetAllService("all");
        else GetAllService(filters);
      } else if (value == "job_type_id") {
        if (!hasFilters) GetAllJobType("all");
        else GetAllJobType(filters);
      } else if (value == "status_type_id") {
        if (!hasFilters) GetAllStatus("all");
        else GetAllStatus(filters);
      } else if (value == "employee_number") {
        if (!hasFilters) staffData("employee_number", "all");
        else staffData("employee_number", filters);
      }
    } else if (type == "remove") {
      if (value == "job_id") {
        setJobAllData([]);
        setFilters((prev) => ({
          ...prev,
          job_id: [],
        }));
      } else if (value == "customer_id") {
        setCustomerAllData([]);
        setFilters((prev) => ({
          ...prev,
          customer_id: [],
        }));
      } else if (value == "client_id") {
        setClientAllData([]);
        setFilters((prev) => ({
          ...prev,
          client_id: [],
        }));
      } else if (value == "account_manager_id") {
        setAccountManagerAllData([]);
        setFilters((prev) => ({
          ...prev,
          account_manager_id: [],
        }));
      } else if (value == "allocated_to_id") {
        setAllocatedToAllData([]);
        setFilters((prev) => ({
          ...prev,
          allocated_to_id: [],
        }));
      } else if (value == "reviewer_id") {
        setReviewerAllData([]);
        setFilters((prev) => ({
          ...prev,
          reviewer_id: [],
        }));
      } else if (value == "allocated_to_other_id") {
        setOtherStaffAllData([]);
        setFilters((prev) => ({
          ...prev,
          allocated_to_other_id: [],
        }));
      } else if (value == "service_id") {
        setServiceAllData([]);
        setFilters((prev) => ({
          ...prev,
          service_id: [],
        }));
      } else if (value == "job_type_id") {
        setJobTypeAllData([]);
        setFilters((prev) => ({
          ...prev,
          job_type_id: [],
        }));
      } else if (value == "status_type_id") {
        setStatusAllData([]);
        setFilters((prev) => ({
          ...prev,
          status_type_id: [],
        }));
      } else if (value == "allocated_to_other_id") {
        setOtherStaffAllData([]);
        setFilters((prev) => ({
          ...prev,
          allocated_to_other_id: [],
        }));
      } else if (value == "employee_number") {
        setEmployeeNumberAllData([]);
        setFilters((prev) => ({
          ...prev,
          employee_number: [],
        }));
      }
    }
  };


  const callFilterApi = async (currentPage, pageSize, searchTerm) => {
    setLoading(true);
    // Call your filter API here

    const req = {
      action: "getJobCustomReport",
      filters: filters,
      role: role,
      page: currentPage,
      limit: pageSize,
    };
    const data = { req: req, authToken: token };
    await dispatch(getTimesheetReportData(data))
      .unwrap()
      .then(async (response) => {
        setLoading(false);

        if (response.status) {
          setLoading(false);
          setShowData(response.data);
          setTotalRecords(response?.data?.pagination?.total || 0);
        } else {
          setLoading(false);
          setShowData([]);
          setTotalRecords(0);
        }
      })
      .catch((error) => {
        setLoading(false);
        return;
      });
  };

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setCurrentPage(newPage);
    callFilterApi(newPage, pageSize, searchTerm);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
    callFilterApi(1, newSize, searchTerm);
  };

  useEffect(() => {
    // if (role?.toUpperCase() === "SUPERADMIN") {
    callFilterApi(currentPage, pageSize, searchTerm);
    // }
  }, [
    filters.groupBy,
    filters.additionalField,
    filters.timePeriod,
    filters.fromDate,
    filters.toDate,
    filters.displayBy,
    filters.job_id,
    filters.customer_id,
    filters.client_id,
    filters.account_manager_id,
    filters.allocated_to_id,
    filters.reviewer_id,
    filters.allocated_to_other_id,
    filters.service_id,
    filters.job_type_id,
    filters.status_type_id,
    filters.employee_number,
  ]);


  const resetFunction = () => {
    setFilters({
      groupBy: [],
      additionalField: [],
      job_id: null,
      customer_id: null,
      client_id: null,
      account_manager_id: null,
      allocated_to_id: null,
      reviewer_id: null,
      allocated_to_other_id: null,
      service_id: null,
      job_type_id: null,
      status_type_id: null,
      employee_number: null,
      line_manager_id: null,
      timePeriod: "",
      displayBy: "",
      fromDate: null,
      toDate: null,
    });
    setFilterId(null);
    setShowData([]);

    setCustomerAllData([]);
    setClientAllData([]);
    setJobAllData([]);
    setTaskAllData([]);
    setInternalJobAllData([]);
    setInternalTaskAllData([]);

    //staffData();
  };

  const optionGroupBy = [
    { value: "job_id", label: "Job Name" },
    { value: "customer_id", label: "Customer Name" },
    { value: "client_id", label: "Client Name" },
    { value: "account_manager_id", label: "Account Manager Name" },
    { value: "allocated_to_id", label: "Allocated To" },
    { value: "reviewer_id", label: "Reviewer" },
    { value: "allocated_to_other_id", label: "Allocated To (Other)" },
    { value: "service_id", label: "Service Type" },
    { value: "job_type_id", label: "Job Type" },
    { value: "status_type_id", label: "Job Status" },
    { value: "employee_number", label: "Employee ID" },

    { value: "allocated_on", label: "Allocated On" },
    { value: "job_priority", label: "Job Priority" },
    { value: "engagement_model", label: "Engagement Model" },
    {
      value: "customer_account_manager_officer",
      label: "Customer Account Manager (Officer)",
    },
    { value: "status_updation_date", label: "Status Updation Date" },
    { value: "Transactions_Posting_id_2", label: "Transactions Posting" },
    {
      value: "Number_of_Bank_Transactions_id_2",
      label: "Number of Bank Transactions",
    },
    {
      value: "Number_of_Journal_Entries_id_2",
      label: "Number of Journal Entries",
    },
    {
      value: "Number_of_Other_Transactions_id_2",
      label: "Number of Other Transactions",
    },
    {
      value: "Number_of_Petty_Cash_Transactions_id_2",
      label: "Number of Petty Cash Transactions",
    },
    {
      value: "Number_of_Purchase_Invoices_id_2",
      label: "Number of Purchase Invoices",
    },
    {
      value: "Number_of_Sales_Invoices_id_2",
      label: "Number of Sales Invoices",
    },
    {
      value: "Number_of_Total_Transactions_id_2",
      label: "Number of Total Transactions",
    },
    { value: "submission_deadline", label: "Submission Deadline" },
    { value: "Tax_Year_id_4", label: "Tax Year" },
    {
      value: "If_Sole_Trader_Who_is_doing_Bookkeeping_id_4",
      label: "If Sole Trader, Who is doing Bookkeeping",
    },
    { value: "Whose_Tax_Return_is_it_id_4", label: "Whose Tax Return is it" },
    { value: "Type_of_Payslip_id_3", label: "Type of Payslip" },
    { value: "Year_Ending_id_1", label: "Year Ending" },
    { value: "Bookkeeping_Frequency_id_2", label: "Bookkeeping Frequency" },
    { value: "CIS_Frequency_id_3", label: "CIS Frequency" },
    { value: "Filing_Frequency_id_8", label: "Filing Frequency" },
    {
      value: "Management_Accounts_Frequency_id_6",
      label: "Management Accounts Frequency",
    },
    { value: "Payroll_Frequency_id_3", label: "Payroll Frequency" },
    { value: "budgeted_hours", label: "Budgeted Time" },
    {
      value: "feedback_incorporation_time",
      label: "Feedback Incorporation Time",
    },
    { value: "review_time", label: "Review Time" },
    { value: "total_preparation_time", label: "Total Preparation Time" },
    { value: "total_time", label: "Total Time" },
    { value: "due_on", label: "Due On" },
    { value: "customer_deadline_date", label: "Customer Deadline Date" },
    { value: "date_received_on", label: "Date Received On" },
    { value: "expected_delivery_date", label: "Expected Delivery Date" },
    { value: "internal_deadline_date", label: "Internal Deadline Date" },
    { value: "sla_deadline_date", label: "SLA Deadline Date" },
    {
      value: "Management_Accounts_FromDate_id_6",
      label: "From Date (Management Accounts)",
    },
    {
      value: "Management_Accounts_ToDate_id_6",
      label: "To Date (Management Accounts)",
    },
    { value: "staff_full_name", label: "Staff Full Name" },
    { value: "role", label: "Role" },
    { value: "staff_email", label: "Email Address" },
    { value: "line_manager", label: "Line Manager" },
    { value: "staff_status", label: "Staff Status" },
    // { value: "line_manager_id", label: "Line Manager" },
  ];

  const optionAdditionalBy = [
    { value: "date_received_on", label: "Date Received On" },
    { value: "staff_full_name", label: "Staff Full Name" },
    { value: "role", label: "Role" },
    { value: "staff_email", label: "Email Address" },
    { value: "line_manager", label: "Line Manager" },
    { value: "staff_status", label: "Status" },
  ];

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
      type: "job_custom_report",
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

    let selectedFilter = getAllFilterData?.find(
      (opt) => Number(opt?.value) === Number(selected?.value),
    );

    if (selectedFilter != undefined && selectedFilter.filters) {
      let parsedFilters = {};
      try {
        parsedFilters = JSON.parse(selectedFilter.filters);


        if (parsedFilters?.groupBy?.includes("account_manager_id")) {
          if (["", null, undefined].includes(parsedFilters?.job_id)) {
            await staffData(4);
          } else {
            await staffData(4, parsedFilters);
          }
        }
        if (parsedFilters?.groupBy?.includes("allocated_to_id")) {
          if (["", null, undefined].includes(parsedFilters?.job_id)) {
            await staffData(3);
          } else {
            await staffData(3, parsedFilters);
          }
        }
        if (parsedFilters?.groupBy?.includes("reviewer_id")) {
          if (["", null, undefined].includes(parsedFilters?.job_id)) {
            await staffData(6);
          } else {
            await staffData(6, parsedFilters);
          }
        }
        if (parsedFilters?.groupBy?.includes("allocated_to_other_id")) {
          if (["", null, undefined].includes(parsedFilters?.job_id)) {
            await staffData("other");
          } else {
            await staffData("other", parsedFilters);
          }
        }
        if (parsedFilters?.groupBy?.includes("service_id")) {
          if (["", null, undefined].includes(parsedFilters?.job_id)) {
            await GetAllService("all");
          } else {
            await GetAllService(parsedFilters);
          }
        }
        if (parsedFilters?.groupBy?.includes("job_type_id")) {
          if (["", null, undefined].includes(parsedFilters?.job_id)) {
            await GetAllJobType("all");
          } else {
            await GetAllJobType(parsedFilters);
          }
        }
        if (parsedFilters?.groupBy?.includes("status_type_id")) {
          if (["", null, undefined].includes(parsedFilters?.job_id)) {
            await GetAllStatus("all");
          } else {
            await GetAllStatus(parsedFilters);
          }
        }
        setFilters(parsedFilters);
        callFilterApi();
      } catch (e) {
        console.error("Error parsing filters JSON: ", e);
      }
    } else {
      setFilters({
        groupBy: [
          "job_id",
          "customer_id",
          "client_id",
          "account_manager_id",
          "allocated_to_id",
          "reviewer_id",
          "allocated_to_other_id",
          "service_id",
          "job_type_id",
          "status_type_id",
        ],
        additionalField: [],
        job_id: null,
        customer_id: null,
        client_id: null,
        account_manager_id: null,
        allocated_to_id: null,
        reviewer_id: null,
        allocated_to_other_id: null,
        service_id: null,
        job_type_id: null,
        status_type_id: null,
        line_manager_id: null,
        timePeriod: "this_week",
        displayBy: "",
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
        type: "job_custom_report",
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

  const HandleJob = (jobData) => {
    navigate("/admin/job/logs", {
      state: {
        job_id: jobData?.id,
        timesheet_job_id: 1,
        data: {
          client: {},
          customer: {},
          job: {
            job_id: jobData?.id,
            job_code_id: jobData?.job_id,
          },
        },
        goto: "client",
        activeTab: undefined,
      },
    });
  };

  //  { job_id: row?.job_id, timesheet_job_id: row?.timesheet_job_id, data: updatedData, goto: "client", activeTab: location?.state?.activeTab }

  ///////////////---- FOR JOB SERACH  START-----//////////////
  const [jobOptions, setJobOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const cacheRef = useRef({});
  const debounceTimeout = useRef(null);

  const [jobLoading, setJobLoading] = useState(false);

  const GetAllJobs = async ({
    searchValue = "",
    pageNo = 1,
    append = false,
    client_id = [],
    customer_id = [],
  }) => {
   // if (jobLoading) return;
    const filtersKey = JSON.stringify(filters?.customer_id || []) + JSON.stringify(filters?.client_id || []);
    const cacheKey = `${searchValue}_${pageNo}_${client_id}_${customer_id}`;
    // if (cacheRef.current[cacheKey]) {
    //   alert("from cache");
    //   const cached = cacheRef.current[cacheKey];
    //   setJobOptions(prev =>
    //     append ? [...prev, ...cached] : cached
    //   );
    //   return;
    // }
    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey];
      setJobOptions((prev) => {
        const combined = [...prev, ...cached];
        const unique = Array.from(
          new Map(combined.map((item) => [item.value, item])).values(),
        );
        return unique;
      });
      return;
    }

    setJobLoading(true);

    const req = {
      action: "get_jobs_filter",
      filters: filters,
      client_id: client_id,
      customer_id: customer_id,
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: 20,
      },
    };
    const data = { req, authToken: token };

    try {
      if (client_id.length > 0 || customer_id.length > 0) {
        setJobOptions([]);
      }
      const response = await dispatch(JobAction(data)).unwrap();
      if (response.status) {
        response.data.forEach((item) => {
          jobToClientMap.current[item.job_id] = item.client_id;
          jobToCustomerMap.current[item.job_id] = item.customer_id;
          optionCacheRef.current[item.job_id] = {
            value: item.job_id,
            label: item.job_code_id,
          };
        });
        const formatted = response.data.map((item) => ({
          value: item.job_id,
          label: item.job_code_id,
        }));
        cacheRef.current[cacheKey] = formatted;
        // setJobOptions(prev =>
        //   append ? [...prev, ...formatted] : formatted
        // );
        setJobOptions((prev) => {
          const combined = [...prev, ...formatted];
          const unique = Array.from(
            new Map(combined.map((item) => [item.value, item])).values(),
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
      GetAllJobs({ 
        searchValue: value, 
        pageNo: 1 ,
        client_id: filters?.client_id || [],
        customer_id: filters?.customer_id || [],
      });
    }, 500);
  };
  ///////////////---- FOR JOB SERACH  END-----//////////////

  ///////////////---- FOR CUSTOMER SERACH  START-----//////////////
  const [customerPage, setCustomerPage] = useState(1);
  const [customerHasMore, setCustomerHasMore] = useState(true);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const customerCache = useRef({});
  const debounceRef = useRef(null);

  const GetAllCustomer = async ({
    searchValue = "",
    pageNo = 1,
    append = false,
    job_id = [],
    client_id = [],
  }) => {

    //if (customerLoading) return;
    const filtersKey = JSON.stringify(filters?.client_id || []);
    
    console.log("client_id --", client_id)
    console.log("job_id --", job_id)

    const cacheKey = `${searchValue}_${pageNo}_${client_id}_${job_id}`;
    //const cacheKey = `${searchValue}_${pageNo}_${filtersKey}`;
    // if (customerCache.current[cacheKey]) {
    //   const cached = customerCache.current[cacheKey];
    //   setCustomerAllData(prev =>
    //     append ? [...prev, ...cached] : cached
    //   );
    //   return;
    // }
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

    setCustomerLoading(true);
    const req = {
      action: "get_customers_filter",
      filters: filters,
      job_id: job_id,
      client_id: client_id,
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: 20,
      },
    };

    const data = { req: req, authToken: token };
    try {
      if (job_id.length > 0 || client_id.length > 0) {
        setCustomerAllData([]);
      }
      const response = await dispatch(getAllCustomerDropDown(data)).unwrap();
      if (response.status) {
        const formatted = response.data.map((item) => {
          const opt = {
            value: item.id,
            label: item.trading_name,
          };
          optionCacheRef.current[item.id] = opt;
          return opt;
        });

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

    setCustomerLoading(false);
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
        append: false,
        job_id: filters?.job_id || [],
        client_id: filters?.client_id || [],
      });
    }, 500);
  };

  ///////////////---- FOR CUSTOMER SERACH  END-----//////////////

  /////////////////---- FOR CLIENT SERACH  START-----//////////////
  const [clientPage, setClientPage] = useState(1);
  const [clientHasMore, setClientHasMore] = useState(true);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  const clientCache = useRef({});
  const clientDebounceRef = useRef(null);

  useEffect(() => {
    // Clear dependent caches when customer changes
    clientCache.current = {};
    setClientAllData([]);
    setClientPage(1);
    setClientHasMore(true);

    cacheRef.current = {};
    setJobOptions([]);
    setPage(1);
    setHasMore(true);
  }, [JSON.stringify(filters?.customer_id)]);

  useEffect(() => {
    // Clear dependent caches when client changes
    cacheRef.current = {};
    setJobOptions([]);
    setPage(1);
    setHasMore(true);
  }, [JSON.stringify(filters?.client_id)]);

  const GetAllClient = async ({
    searchValue = "",
    pageNo = 1,
    append = false,
    job_id = [],
    customer_id = [],
  }) => {
   // if (clientLoading) return;
    const filtersKey = JSON.stringify(filters?.customer_id || []);
    const cacheKey = `${searchValue}_${pageNo}_${job_id}_${customer_id}`;
    // Cache check
    // if (clientCache.current[cacheKey]) {
    //   const cached = clientCache.current[cacheKey];
    //   setClientAllData(prev =>
    //     append ? [...prev, ...cached] : cached
    //   );

    //   return;
    // }

    if (clientCache.current[cacheKey]) {
      const cached = clientCache.current[cacheKey];
      setClientAllData((prev) => {
        const combined = [...prev, ...cached];
        const unique = Array.from(
          new Map(combined.map((item) => [item.value, item])).values(),
        );
        return unique;
      });
      return;
    }

    setClientLoading(true);

    const req = {
      action: "get_clients_filter",
      filters: filters,
      job_id: job_id,
      customer_id: customer_id,
      pagination: {
        search: searchValue,
        page: pageNo,
        limit: 20,
      },
    };

    const data = { req, authToken: token };

    try {
      if (job_id.length > 0 || customer_id.length > 0) {
        setClientAllData([]);
      }
      const response = await dispatch(ClientAction(data)).unwrap();
      if (response.status) {
        response.data.forEach((item) => {
          clientToCustomerMap.current[item.id] = item.customer_id;
          optionCacheRef.current[item.id] = {
            value: item.id,
            label: `${item.client_name} (${item.client_code})`,
          };
        });
        const formatted = response.data.map((item) => ({
          value: item.id,
          label: `${item.client_name} (${item.client_code})`,
        }));

        // Cache store
        clientCache.current[cacheKey] = formatted;
        // setClientAllData(prev =>
        //   append ? [...prev, ...formatted] : formatted
        // );
        setClientAllData((prev) => {
          const combined = [...prev, ...formatted];
          const unique = Array.from(
            new Map(combined.map((item) => [item.value, item])).values(),
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
      GetAllClient({
        searchValue: value,
        pageNo: 1,
        job_id: filters?.job_id || [],
        customer_id: filters?.customer_id || [],
      });
    }, 500);
  };

  /////////////////---- FOR CLIENT SERACH  END-----//////////////

  return (
    <div className="container-fluid pb-3">
      {loading && (
        <div className="overlay">
          <div className="loader"></div>
        </div>
      )}
      {/* Page Title */}
      <div className="content-title">
        <div className="tab-title mb-3">
          <div className="row align-items-start">
            <div className="col-12 col-sm-7 ">
              <div>
                <h3 className="mt-0">Custom Job Report</h3>
              </div>

              <div className="w-50 mt-2">
                <label className="form-label fw-medium mt-2 mb-1">
                  Saved Filters
                </label>

                <div className="d-flex align-items-center gap-2">
                  <Select
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
                      size={18}
                      color="red"
                      title="Delete Filter"
                      onClick={deleteFilterIdFunction}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* get filters Dropdown */}

            {showData && showData.rows && showData.rows.length > 0 && (
              <div className="col-12 col-sm-5">
                <div className="d-block d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                  <button
                    className="btn btn-info d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2"
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

          <span className="ms-2">
            <button
              type="button"
              className="btn btn-sm btn-info dropdown-toggle p-0 ms-2 mb-2"
              onClick={() => {
                const allValues = optionGroupBy.map((opt) => opt.value);

                if (!isAllSelected) {
                  // --- SELECT ALL ---
                  addAndRemoveGroupBy(allValues, "addAll");
                  handleFilterChange(optionGroupBy);
                  setIsAllSelected(true);
                } else {
                  // --- CLEAR ALL ---
                  addAndRemoveGroupBy([], "clearAll");
                  handleFilterChange([]);
                  setIsAllSelected(false);
                }
              }}
            >
              {isAllSelected ? "Clear" : "Select All"}
            </button>
          </span>

          <Select
            isMulti
            closeMenuOnSelect={false}
            options={optionGroupBy}
            value={optionGroupBy.filter((opt) =>
              filters?.groupBy?.includes(opt.value),
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




        {filters?.groupBy?.includes("job_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Job Name</label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => { if (jobOptions.length === 0) GetAllJobs({ searchValue: "", pageNo: 1 , client_id: filters?.client_id || [], customer_id: filters?.customer_id || []}); }}
              options={jobOptions}
              value={(filters?.job_id || []).map((id) =>
                optionCacheRef.current[id] || { value: id, label: `Loading...` }
              )}

              onChange={(selectedOptions) => {
                const values = selectedOptions
                  ? selectedOptions.map((opt) => opt.value)
                  : [];
                handleFilterChange({
                  target: {
                    key: "job_id",
                    value: values,
                  },
                });
              }}
              onInputChange={(value) => handleSearch(value)}
              onMenuScrollToBottom={() => {
                if (hasMore) {
                  GetAllJobs({
                    searchValue: search,
                    pageNo: page + 1,
                    append: true,
                    client_id: filters?.client_id || [],
                    customer_id: filters?.customer_id || [],
                  });
                }
              }}
              isSearchable
              // onBlur={() => {
              //   setHasMore(true);
              //   setPage(1);
              //   setSearch("");
              //   setJobOptions([]);
              //   setJobAllData([]);
              //   cacheRef.current = {};
              //   GetAllJobs({ searchValue: "", pageNo: 1 });
              // }}
              // onMenuClose={() => {
              //   setHasMore(true);
              //   cacheRef.current = {};
              // }}
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Customer */}
        {filters?.groupBy?.includes("customer_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Customer Name</label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => { if (customerAllData.length === 0) GetAllCustomer({ searchValue: "", pageNo: 1 , job_id: filters?.job_id || [], client_id: filters?.client_id || [] }); }}
              options={customerAllData}
              value={(filters?.customer_id || []).map((id) =>
                optionCacheRef.current[id] || { value: id, label: `Loading...` }
              )}
              // onChange={(selectedOptions) =>
              //   handleFilterChange({
              //     target: {
              //       key: "customer_id",
              //       value: selectedOptions
              //         ? selectedOptions.map((opt) => opt.value)
              //         : [],
              //     },
              //   })
              // }
              onChange={(selectedOptions) => {
                const values = selectedOptions
                  ? selectedOptions.map((opt) => opt.value)
                  : [];
                handleFilterChange({
                  target: {
                    key: "customer_id",
                    value: values,
                  },
                });
              }}
              onInputChange={(value) => handleCustomerSearch(value)}
              onMenuScrollToBottom={() => {
                if (customerHasMore) {
                  GetAllCustomer({
                    searchValue: customerSearch,
                    pageNo: customerPage + 1,
                    job_id: filters?.job_id || [],
                    client_id: filters?.client_id || [],
                  });
                }
              }}
              isSearchable
              // onBlur={() => {
              //   setCustomerHasMore(true);
              //   setCustomerPage(1);
              //   setCustomerSearch("");
              //   setCustomerAllData([]);
              //   customerCache.current = {};
              //   GetAllCustomer({ searchValue: "", pageNo: 1 });
              // }}
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Client */}
        {filters?.groupBy?.includes("client_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Client Name</label>

            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => { if (clientAllData.length === 0) GetAllClient({ searchValue: "", pageNo: 1 , job_id: filters?.job_id || [], customer_id: filters?.customer_id || [] }); }}
              options={clientAllData}
              value={(filters?.client_id || []).map((id) =>
                optionCacheRef.current[id] || { value: id, label: `Loading...` }
              )}
              // onChange={(selectedOptions) =>
              //   handleFilterChange({
              //     target: {
              //       key: "client_id",
              //       value: selectedOptions
              //         ? selectedOptions.map((opt) => opt.value)
              //         : [],
              //     },
              //   })
              // }
              onChange={(selectedOptions) => {
                const values = selectedOptions
                  ? selectedOptions.map((opt) => opt.value)
                  : [];
                handleFilterChange({
                  target: {
                    key: "client_id",
                    value: values,
                  },
                });
              }}
              onInputChange={(value) => handleClientSearch(value)}
              onMenuScrollToBottom={() => {
                if (clientHasMore) {
                  GetAllClient({
                    searchValue: clientSearch,
                    pageNo: clientPage + 1,
                    append: true,
                    job_id: filters?.job_id || [],
                    customer_id: filters?.customer_id || [],
                  });
                }
              }}
              isSearchable
              // onBlur={() => {
              //   setClientHasMore(true);
              //   setClientPage(1);
              //   setClientSearch("");
              //   setClientAllData([]);
              //   clientCache.current = {};
              //   GetAllClient({ searchValue: "", pageNo: 1 });
              // }}
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Employee ID Number  */}
        {filters?.groupBy?.includes("employee_number") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Employee ID</label>
            {/* <Select
              options={[
                { value: "", label: "Select..." },
                ...employeeNumberAllData,
              ]}
              value={
                employeeNumberAllData && employeeNumberAllData.length > 0
                  ? employeeNumberAllData.find(
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
            /> */}

            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                const hasFilters = filters?.job_id?.length > 0 || filters?.client_id?.length > 0 || filters?.customer_id?.length > 0;
                if (hasFilters) {
                  staffData("employee_number", filters);
                } else if (employeeNumberAllData.length === 0) {
                  staffData("employee_number", "all");
                }
              }}
              options={employeeNumberAllData}
              value={employeeNumberAllData.filter((opt) =>
                filters?.employee_number?.includes(opt.value),
              )}
              onChange={(selectedOptions) =>
                handleFilterChange({
                  target: {
                    key: "employee_number",
                    value: selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Account Manager  */}
        {filters?.groupBy?.includes("account_manager_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Account Manager Name</label>

            {/* <Select
              options={[
                { value: "", label: "Select..." },
                ...accountManagerAllData,
              ]}
              value={
                accountManagerAllData && accountManagerAllData.length > 0
                  ? accountManagerAllData.find(
                      (opt) =>
                        Number(opt.value) ===
                        Number(filters.account_manager_id),
                    ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "account_manager_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}

            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                const hasFilters = filters?.job_id?.length > 0 || filters?.client_id?.length > 0 || filters?.customer_id?.length > 0;
                if (hasFilters) {
                  staffData(4, filters);
                } else if (accountManagerAllData.length === 0) {
                  staffData(4, "all");
                }
              }}
              options={accountManagerAllData}
              value={accountManagerAllData.filter((opt) =>
                filters?.account_manager_id?.includes(opt.value),
              )}
              onChange={(selectedOptions) =>
                handleFilterChange({
                  target: {
                    key: "account_manager_id",
                    value: selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Allocated To */}
        {filters?.groupBy?.includes("allocated_to_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Allocated To</label>

            {/* <Select
              options={[
                { value: "", label: "Select..." },
                ...allocatedToAllData,
              ]}
              value={
                allocatedToAllData && allocatedToAllData?.length > 0
                  ? allocatedToAllData?.find(
                      (opt) =>
                        Number(opt.value) === Number(filters.allocated_to_id),
                    ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "allocated_to_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}

            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                const hasFilters = filters?.job_id?.length > 0 || filters?.client_id?.length > 0 || filters?.customer_id?.length > 0;
                if (hasFilters) {
                  staffData(3, filters);
                } else if (allocatedToAllData.length === 0) {
                  staffData(3, "all");
                }
              }}
              options={allocatedToAllData}
              value={allocatedToAllData.filter((opt) =>
                filters?.allocated_to_id?.includes(opt.value),
              )}
              onChange={(selectedOptions) =>
                handleFilterChange({
                  target: {
                    key: "allocated_to_id",
                    value: selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Reviewer  */}
        {filters?.groupBy?.includes("reviewer_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Reviewer</label>

            {/* <Select
              options={[{ value: "", label: "Select..." }, ...reviewerAllData]}
              value={
                reviewerAllData && reviewerAllData?.length > 0
                  ? reviewerAllData?.find(
                      (opt) =>
                        Number(opt.value) === Number(filters.reviewer_id),
                    ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "reviewer_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}

            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                const hasFilters = filters?.job_id?.length > 0 || filters?.client_id?.length > 0 || filters?.customer_id?.length > 0;
                if (hasFilters) {
                  staffData(6, filters);
                } else if (reviewerAllData.length === 0) {
                  staffData(6, "all");
                }
              }}
              options={reviewerAllData}
              value={reviewerAllData.filter((opt) =>
                filters?.reviewer_id?.includes(opt.value),
              )}
              onChange={(selectedOptions) =>
                handleFilterChange({
                  target: {
                    key: "reviewer_id",
                    value: selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Allocated Other  */}
        {filters?.groupBy?.includes("allocated_to_other_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Allocated To (Other)</label>

            {/* <Select
              options={[
                { value: "", label: "Select..." },
                ...otherStaffAllData,
              ]}
              value={
                otherStaffAllData && otherStaffAllData?.length > 0
                  ? otherStaffAllData?.find(
                      (opt) =>
                        Number(opt.value) ===
                        Number(filters.allocated_to_other_id),
                    ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "allocated_to_other_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}

            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                const hasFilters = filters?.job_id?.length > 0 || filters?.client_id?.length > 0 || filters?.customer_id?.length > 0;
                if (hasFilters) {
                  staffData("other", filters);
                } else if (otherStaffAllData.length === 0) {
                  staffData("other", "all");
                }
              }}
              options={otherStaffAllData}
              value={otherStaffAllData.filter((opt) =>
                filters?.allocated_to_other_id?.includes(opt.value),
              )}
              onChange={(selectedOptions) =>
                handleFilterChange({
                  target: {
                    key: "allocated_to_other_id",
                    value: selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Services  */}
        {filters?.groupBy?.includes("service_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Service Type</label>

            {/* <Select
              options={[{ value: "", label: "Select..." }, ...serviceAllData]}
              value={
                serviceAllData && serviceAllData?.length > 0
                  ? serviceAllData?.find(
                      (opt) => Number(opt.value) === Number(filters.service_id),
                    ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "service_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}

            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                const hasFilters = filters?.job_id?.length > 0 || filters?.client_id?.length > 0 || filters?.customer_id?.length > 0;
                if (hasFilters) {
                  GetAllService(filters);
                } else if (serviceAllData.length === 0) {
                  GetAllService("all");
                }
              }}
              options={serviceAllData}
              value={serviceAllData.filter((opt) =>
                filters?.service_id?.includes(opt.value),
              )}
              onChange={(selectedOptions) =>
                handleFilterChange({
                  target: {
                    key: "service_id",
                    value: selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Job Type  */}
        {filters?.groupBy?.includes("job_type_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Job Type</label>

            {/* <Select
              options={[{ value: "", label: "Select..." }, ...jobTypeAllData]}
              value={
                jobTypeAllData && jobTypeAllData?.length > 0
                  ? jobTypeAllData?.find(
                      (opt) =>
                        Number(opt.value) === Number(filters.job_type_id),
                    ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "job_type_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}

            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                const hasFilters = filters?.job_id?.length > 0 || filters?.client_id?.length > 0 || filters?.customer_id?.length > 0;
                if (hasFilters) {
                  GetAllJobType(filters);
                } else if (jobTypeAllData.length === 0) {
                  GetAllJobType("all");
                }
              }}
              options={jobTypeAllData}
              value={jobTypeAllData.filter((opt) =>
                filters?.job_type_id?.includes(opt.value),
              )}
              onChange={(selectedOptions) =>
                handleFilterChange({
                  target: {
                    key: "job_type_id",
                    value: selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Status  */}
        {filters?.groupBy?.includes("status_type_id") && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">Job Status</label>
            {/* <Select
              options={[{ value: "", label: "Select..." }, ...statusAllData]}
              value={
                statusAllData && statusAllData?.length > 0
                  ? statusAllData?.find(
                      (opt) =>
                        Number(opt.value) === Number(filters.status_type_id),
                    ) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: {
                    key: "status_type_id",
                    value: selected.value,
                    label: selected.label,
                  },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            /> */}

            <Select
              isMulti
              closeMenuOnSelect={false}
              onMenuOpen={() => {
                const hasFilters = filters?.job_id?.length > 0 || filters?.client_id?.length > 0 || filters?.customer_id?.length > 0;
                if (hasFilters) {
                  GetAllStatus(filters);
                } else if (statusAllData.length === 0) {
                  GetAllStatus("all");
                }
              }}
              options={statusAllData}
              value={statusAllData.filter((opt) =>
                filters?.status_type_id?.includes(opt.value),
              )}
              onChange={(selectedOptions) =>
                handleFilterChange({
                  target: {
                    key: "status_type_id",
                    value: selectedOptions
                      ? selectedOptions.map((opt) => opt.value)
                      : [],
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
          <>
            <div className="table-responsive fixed-table-header">
              <table
                className="table rdt_Table"
              // className="table table-bordered"
              // style={{
              //   fontSize: "14px",
              //   width: "100%",
              //   overflowX: "auto",
              //   display: "block",
              // }}
              >
                <thead
                // className="rdt_TableHead"
                >
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
                          {/* Job ID column ke liye special handling */}
                          {col === "job_id" && row[col] ? (
                            <a
                              onClick={() => HandleJob(row)}
                              style={{
                                cursor: "pointer",
                                color: "#26bdf0",
                                textDecoration: "underline",
                              }}
                            >
                              {row[col]}
                            </a>
                          ) : row[col] !== undefined ? (
                            row[col]
                          ) : (
                            ""
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(totalRecords / pageSize)}
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
              {/* <option value={100000}>All</option> */}
            </select>
          </>
        )}
      </div>
    </div>
  );
}

function getColumnName(columnKey) {
  const dayMap = {
    job_id: "Job",
    customer_id: "Customer",
    customer_code: "Customer Code",
    client_id: "Client",
    account_manager_id: "Account Manager",
    allocated_to_id: "Allocated To",
    reviewer_id: "Reviewer",
    allocated_to_other_id: "Allocated To (Other)",
    service_id: "Service",
    job_type_id: "Job Type",
    status_type_id: "Job Status",
    employee_number: "Employee ID",
    // line_manager_id: "Line Manager",
    date: "Created Date",
    total_count: "Total Count",
    date_received_on: "Date Received On",
    allocated_on: "Allocated On",
    job_priority: "Job Priority",
    engagement_model: "Engagement Model",
    customer_account_manager_officer: "Customer Account Manager (Officer)",
    status_updation_date: "Status Updation Date",
    Transactions_Posting_id_2: "Transactions Posting",
    Number_of_Bank_Transactions_id_2: "Number of Bank Transactions",
    Number_of_Journal_Entries_id_2: "Number of Journal Entries",
    Number_of_Other_Transactions_id_2: "Number of Other Transactions",
    Number_of_Petty_Cash_Transactions_id_2: "Number of Petty Cash Transactions",
    Number_of_Purchase_Invoices_id_2: "Number of Purchase Invoices",
    Number_of_Sales_Invoices_id_2: "Number of Sales Invoices",
    Number_of_Total_Transactions_id_2: "Number of Total Transactions",
    submission_deadline: "Submission Deadline",
    Tax_Year_id_4: "Tax Year",
    If_Sole_Trader_Who_is_doing_Bookkeeping_id_4:
      "If Sole Trader, Who is doing Bookkeeping",
    Whose_Tax_Return_is_it_id_4: "Whose Tax Return is it",
    Type_of_Payslip_id_3: "Type of Payslip",
    Year_Ending_id_1: "Year Ending",
    Bookkeeping_Frequency_id_2: "Bookkeeping Frequency",
    CIS_Frequency_id_3: "CIS Frequency",
    Filing_Frequency_id_8: "Filing Frequency",
    Management_Accounts_Frequency_id_6: "Management Accounts Frequency",
    Payroll_Frequency_id_3: "Payroll Frequency",
    budgeted_hours: "Budgeted Time",
    feedback_incorporation_time: "Feedback Incorporation Time",
    review_time: "Review Time",
    total_preparation_time: "Total Preparation Time",
    total_time: "Total Time",
    due_on: "Due On",
    customer_deadline_date: "Customer Deadline Date",
    expected_delivery_date: "Expected Delivery Date",
    internal_deadline_date: "Internal Deadline Date",
    sla_deadline_date: "SLA Deadline Date",
    Management_Accounts_FromDate_id_6: "From Date (Management Accounts)",
    Management_Accounts_ToDate_id_6: "To Date (Management Accounts)",

    staff_full_name: "Staff Full Name",
    role: "Role",
    staff_email: "Email Address",
    line_manager: "Line Manager",
    staff_status: "Staff Status",
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

export default JobCustomReport;

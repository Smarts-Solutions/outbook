import React, { useState, useEffect } from 'react';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';
import { getAllCustomerDropDown, JobAction, getAllTaskByStaff, getTimesheetReportData } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import * as XLSX from "xlsx";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
import dayjs from "dayjs";
import sweatalert from "sweetalert2";
import { TextSelect } from 'lucide-react';


function JobCustomReport() {
  const noDataImage = '/assets/images/No-data-amico.png';
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [options, setOptions] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = staffDetails?.role;
  const [showData, setShowData] = useState([]);

  //console.log("showData ", showData);

  const [accountManagerAllData, setAccountManagerAllData] = useState([]);
  const [allocatedToAllData, setAllocatedToAllData] = useState([]);
  const [reviewerAllData, setReviewerAllData] = useState([]);
  const [otherStaffAllData, setOtherStaffAllData] = useState([]);
  const [customerAllData, setCustomerAllData] = useState([]);
  const [clientAllData, setClientAllData] = useState([]);
  const [jobAllData, setJobAllData] = useState([]);
  const [serviceAllData, setServiceAllData] = useState([]);
  const [jobTypeAllData, setJobTypeAllData] = useState([]);
  const [statusAllData, setStatusAllData] = useState([]);






  const [taskAllData, setTaskAllData] = useState([]);

  const [internalJobAllData, setInternalJobAllData] = useState([]);
  const [internalTaskAllData, setInternalTaskAllData] = useState([]);


  const [getAllFilterData, setGetAllFilterData] = useState([]);
  // set filter id
  const [filterId, setFilterId] = useState(null);





  const [filters, setFilters] = useState({
    groupBy:
      ["job_id",
        "customer_id",
        "client_id",
        "account_manager_id",
        "allocated_to_id",
        "reviewer_id",
        "allocated_to_other_id",
        "service_id",
        "job_type_id",
        "status_type_id"
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

  let lastGroupValue = filters?.groupBy[filters?.groupBy?.length - 1];


  function formatStringToTitleCase(text, key) {
    if (!text) return "";

    if (key == 'date') {
      return dayjs(text).format('DD-MM-YYYY');
    }

    return text
      .replace(/_/g, " ")                 // underscores → spaces
      .toLowerCase()                      // make all lowercase first
      .replace(/\b\w/g, char => char.toUpperCase()) // capitalize first letter of each word
      .trim();
  }


  //  console.log("lastGroupValue ", lastGroupValue);

  // Get All Jobs
  const GetAllJobs = async () => {
    // External get All jobs
    const req = { action: "getByCustomer", customer_id: "" };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.job_id,
            label: item.job_code_id
          }));
          setJobAllData(data);
        } else {
          setJobAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
    return

  };

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
            Group By : [${(JSON.parse(item?.groupBy))?.map(item => item.replace(/_id$/i, ""))}]<br/>
            
            ${item.job_name ? `⮞ Job : ${item.job_name}<br/>` : ""}
            ${item.customer_name ? `⮞ Customer : ${item.customer_name}<br/>` : ""}
            ${item.client_name ? `⮞ Client : ${item.client_name}<br/>` : ""}
            ${item.account_manager_name ? `⮞ Account Manager Name : ${item.account_manager_name}<br/>` : ""}
            ${item.allocated_to_name ? `⮞ Allocated To : ${item.allocated_to_name}<br/>` : ""}
            ${item.reviewer_name ? `⮞ Reviewer : ${item.reviewer_name}<br/>` : ""}
            ${item.allocated_to_other_name ? `⮞ Allocated To (Other) : ${item.allocated_to_other_name}<br/>` : ""}
            ${item.service_name ? `⮞ Service Type : ${item.service_name}<br/>` : ""}
            ${item.job_type_name ? `⮞ Job Type : ${item.job_type_name}<br/>` : ""}
            ${item.status_type_name ? `⮞ Status : ${item.status_type_name}<br/>` : ""}

            ${item.timePeriod ? `⮞ Time Period : ${formatStringToTitleCase(item.timePeriod)}<br/>` : ""}
            ${item.displayBy ? `⮞ Display By : ${formatStringToTitleCase(item.displayBy)}<br/>` : ""}
            ${!['', null, 'null', undefined].includes(item.fromDate) ? `⮞ From Date : ${formatStringToTitleCase(item.fromDate, 'date')}<br/>` : ""}
            ${!['', null, 'null', undefined].includes(item.toDate) ? `⮞ To Date : ${formatStringToTitleCase(item.toDate, 'date')}` : ""}
          `,

            filters: item.filter_record
          }));
          setGetAllFilterData(data);
        } else {
          setGetAllFilterData([]);
        }
      })
      .catch((error) => {
        return;
      });
  }

  useEffect(() => {
    GetAllJobs();
    GetAllCustomer();
    GetAllClient();
    GetAllService();
    GetAllJobType();
    GetAllStatus();
    staffData(4);
    staffData(3);
    staffData(6);
    staffData('other');
    getAllFilters();
  }, []);

  // Get All Customers
  const GetAllCustomer = async () => {
    const req = { action: "get_dropdown" };
    const data = { req: req, authToken: token };
    await dispatch(getAllCustomerDropDown(data)).unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.trading_name
          }));
          setCustomerAllData(data);
        } else {
          setCustomerAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };


  // Get All Clients
  const GetAllClient = async () => {
    const req = { action: "get", customer_id: "" };
    const data = { req: req, authToken: token };
    await dispatch(ClientAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.client_name + " (" + item.client_code + ")"
          }));
          setClientAllData(data);
        } else {
          setClientAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  // All Type Staff Get
  const staffData = async (role_id) => {
    //  console.log("role ", role);
    if (['', null, undefined].includes(role_id)) {
      return
    }
    if (Number(role_id) == 4) {
      if (role?.toUpperCase() === "SUPERADMIN") {
        var req = { action: "getStaffWithRole", role_id: role_id || "" };
        var data = { req: req, authToken: token };
        await dispatch(getAllTaskByStaff(data))
          .unwrap()
          .then(async (response) => {
            if (response.status) {
              // console.log("response.data ", response.data);
              const data = response?.data?.map((item) => ({
                value: item.id,
                label: `${item.first_name} ${item.last_name} (${item.email})`
              }));
              setAccountManagerAllData(data);
            } else {
              setAccountManagerAllData([]);
            }
          })
          .catch((error) => {
            return;
          });

      } else {
        let data = [{ id: staffDetails?.id, email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})` }]

        data = data?.map((item) => ({
          value: item.id,
          label: item.email
        }));
        setAccountManagerAllData(data);
      }
    }

    else if (Number(role_id) == 3) {
      if (role?.toUpperCase() === "SUPERADMIN") {
        var req = { action: "getStaffWithRole", role_id: role_id || "" };
        var data = { req: req, authToken: token };
        await dispatch(getAllTaskByStaff(data))
          .unwrap()
          .then(async (response) => {
            if (response.status) {
              // console.log("response.data ", response.data);
              const data = response?.data?.map((item) => ({
                value: item.id,
                label: `${item.first_name} ${item.last_name} (${item.email})`
              }));
              setAllocatedToAllData(data);
            } else {
              setAllocatedToAllData([]);
            }
          })
          .catch((error) => {
            return;
          });

      } else {
        let data = [{ id: staffDetails?.id, email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})` }]

        data = data?.map((item) => ({
          value: item.id,
          label: item.email
        }));
        setAllocatedToAllData(data);
      }
    }

    else if (Number(role_id) == 6) {
      if (role?.toUpperCase() === "SUPERADMIN") {
        var req = { action: "getStaffWithRole", role_id: role_id || "" };
        var data = { req: req, authToken: token };
        await dispatch(getAllTaskByStaff(data))
          .unwrap()
          .then(async (response) => {
            if (response.status) {
              // console.log("response.data ", response.data);
              const data = response?.data?.map((item) => ({
                value: item.id,
                label: `${item.first_name} ${item.last_name} (${item.email})`
              }));
              setReviewerAllData(data);
            } else {
              setReviewerAllData([]);
            }
          })
          .catch((error) => {
            return;
          });

      } else {
        let data = [{ id: staffDetails?.id, email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})` }]

        data = data?.map((item) => ({
          value: item.id,
          label: item.email
        }));
        setReviewerAllData(data);
      }
    }

    else if (role_id == 'other') {
      if (role?.toUpperCase() === "SUPERADMIN") {
        var req = { action: "getStaffWithRole", role_id: role_id || "" };
        var data = { req: req, authToken: token };
        await dispatch(getAllTaskByStaff(data))
          .unwrap()
          .then(async (response) => {
            if (response.status) {
              // console.log("response.data ", response.data);
              const data = response?.data?.map((item) => ({
                value: item.id,
                label: `${item.first_name} ${item.last_name} (${item.email})`
              }));
              setOtherStaffAllData(data);
            } else {
              setOtherStaffAllData([]);
            }
          })
          .catch((error) => {
            return;
          });

      } else {
        let data = [{ id: staffDetails?.id, email: `${staffDetails.first_name} ${staffDetails?.last_name} (${staffDetails?.email})` }]

        data = data?.map((item) => ({
          value: item.id,
          label: item.email
        }));
        setOtherStaffAllData(data);
      }
    }
    else {
      return
    }

  };

  // Get All Service
  const GetAllService = async () => {

    var req = { action: "getAllService" };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.name
          }));
          setServiceAllData(data);
        } else {
          setServiceAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
    return


  };

  // Get All Service
  const GetAllJobType = async () => {

    var req = { action: "getAllJobType" };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.type
          }));
          setJobTypeAllData(data);
        } else {
          setJobTypeAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
    return


  };

  // Get All Status
  const GetAllStatus = async () => {

    var req = { action: "getAllStatus" };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const data = response?.data?.map((item) => ({
            value: item.id,
            label: item.name
          }));
          setStatusAllData(data);
        } else {
          setStatusAllData([]);
        }
      })
      .catch((error) => {
        return;
      });
    return


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
      total_hours: "Total Hours",
      task_type: "Task Type"

    };
    const headers = data.columns.map(col => colMap[col] || col);


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

  const handleFilterChange = (e, type) => {

    if (type == 'additionalField') {
      const values = e.map((opt) => opt.value);
      let additionalFieldArray = sortByReference(values)
      setFilters((prev) => ({
        ...prev,
        additionalField: sortByReference(additionalFieldArray)
      }));
      return;
    }

    if (Array.isArray(e)) {
      // this case is for multi-select (Group By)
      const values = e.map((opt) => opt.value);
      setOptions([]);
      let gropByArray = sortByReference(values)

      // console.log("gropByArray ", gropByArray);

      if (!gropByArray.includes('job_id')) {
        setFilters((prev) => ({
          ...prev,
          groupBy: sortByReference(gropByArray),
          additionalField: []
        }));
        return;
      } else {
        setFilters((prev) => ({
          ...prev,
          groupBy: sortByReference(gropByArray)
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
    }

    else if (key == "fromDate") {
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
    }

    else {
      setFilters((prev) => ({
        ...prev,
        [key]: value
      }));
    }


  };

  const addAndRemoveGroupBy = (value, type) => {
    if (type == 'add') {
      if (value == 'job_id') {
        GetAllJobs()
      }
      else if (value == 'customer_id') {
        GetAllCustomer()
      }
      else if (value == 'client_id') {
        GetAllClient()
      }
      else if (value == 'account_manager_id') {
        staffData(4)  // role_id 4 for account manager
      }
      else if (value == "allocated_to_id") {
        staffData(3)  // role_id 3 for staff
      }
      else if (value == "reviewer_id") {
        staffData(6)  // role_id 2 for reviewer
      }
      else if (value == "allocated_to_other_id") {
        staffData('other')  // role_id 5 for allocated to other
      }
      else if (value == 'service_id') {
        GetAllService()
      }
      else if (value == 'job_type_id') {
        GetAllJobType()
      }
      else if (value == 'status_type_id') {
        GetAllStatus()
      }

    }

    else if (type == 'remove') {



      if (value == 'job_id') {
        setJobAllData([]);
        setFilters((prev) => ({
          ...prev,
          job_id: null
        }));

      }
      else if (value == 'customer_id') {
        setCustomerAllData([]);
        setFilters((prev) => ({
          ...prev,
          customer_id: null
        }));
      }
      else if (value == 'client_id') {
        setClientAllData([]);
        setFilters((prev) => ({
          ...prev,
          client_id: null
        }));
      }
      else if (value == 'account_manager_id') {
        setAccountManagerAllData([]);
        setFilters((prev) => ({
          ...prev,
          account_manager_id: null
        }));
      }
      else if (value == 'allocated_to_id') {
        setAllocatedToAllData([]);
        setFilters((prev) => ({
          ...prev,
          allocated_to_id: null
        }));
      }
      else if (value == 'reviewer_id') {
        setReviewerAllData([]);
        setFilters((prev) => ({
          ...prev,
          reviewer_id: null
        }));
      }
      else if (value == 'allocated_to_other_id') {
        setOtherStaffAllData([]);
        setFilters((prev) => ({
          ...prev,
          allocated_to_other_id: null
        }));
      }
      else if (value == 'service_id') {
        setServiceAllData([]);
        setFilters((prev) => ({
          ...prev,
          service_id: null
        }));
      }
      else if (value == 'job_type_id') {
        setJobTypeAllData([]);
        setFilters((prev) => ({
          ...prev,
          job_type_id: null
        }));
      }
      else if (value == 'status_type_id') {
        setStatusAllData([]);
        setFilters((prev) => ({
          ...prev,
          status_type_id: null
        }));
      }
      else if (value == 'allocated_to_other_id') {
        setOtherStaffAllData([]);
        setFilters((prev) => ({
          ...prev,
          allocated_to_other_id: null
        }));
      }




    }
  }

  console.log("filters ", filters);
  const callFilterApi = async () => {
    // Call your filter API here
    // console.log("Calling filter API with filters: ", filters);
    const req = { action: "getJobCustomReport", filters: filters };
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
    if (role?.toUpperCase() === "SUPERADMIN") {
      callFilterApi();
    }
  }, [filters.groupBy, filters.additionalField, filters.timePeriod, filters.fromDate, filters.toDate, filters.displayBy, filters.job_id, filters.customer_id, filters.client_id, filters.account_manager_id, filters.allocated_to_id, filters.reviewer_id, filters.allocated_to_other_id, filters.service_id, filters.job_type_id, filters.status_type_id]);


  //console.log("filters ", filters);

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
      line_manager_id: null,
      timePeriod: "",
      displayBy: "",
      fromDate: null,
      toDate: null,
    })
    setFilterId(null)
    setShowData([]);


    setCustomerAllData([]);
    setClientAllData([]);
    setJobAllData([]);
    setTaskAllData([]);
    setInternalJobAllData([]);
    setInternalTaskAllData([]);

    //staffData();
  }

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

    { value: "allocated_on", label: "Allocated On" },
    { value: "job_priority", label: "Job Priority" },
    { value: "engagement_model", label: "Engagement Model" },
    { value: "customer_account_manager_officer", label: "Customer Account Manager (Officer)" },
    { value: "status_updation_date", label: "Status Updation Date" },
    { value: "Transactions_Posting_id_2", label: "Transactions Posting" },
    { value: "Number_of_Bank_Transactions_id_2", label: "Number of Bank Transactions" },
    { value: "Number_of_Journal_Entries_id_2", label: "Number of Journal Entries" },
    { value: "Number_of_Other_Transactions_id_2", label: "Number of Other Transactions" },
    { value: "Number_of_Petty_Cash_Transactions_id_2", label: "Number of Petty Cash Transactions" },
    { value: "Number_of_Purchase_Invoices_id_2", label: "Number of Purchase Invoices" },
    { value: "Number_of_Sales_Invoices_id_2", label: "Number of Sales Invoices" },
    { value: "Number_of_Total_Transactions_id_2", label: "Number of Total Transactions" },
    { value: "submission_deadline", label: "Submission Deadline" },
    { value: "Tax_Year_id_4", label: "Tax Year" },
    { value: "If_Sole_Trader_Who_is_doing_Bookkeeping_id_4", label: "If Sole Trader, Who is doing Bookkeeping" },
    { value: "Whose_Tax_Return_is_it_id_4", label: "Whose Tax Return is it" },
    { value: "Type_of_Payslip_id_3", label: "Type of Payslip" },
    { value: "Year_Ending_id_1", label: "Year Ending" },
    { value: "Bookkeeping_Frequency_id_2", label: "Bookkeeping Frequency" },
    { value: "CIS_Frequency_id_3", label: "CIS Frequency" },
    { value: "Filing_Frequency_id_8", label: "Filing Frequency" },
    { value: "Management_Accounts_Frequency_id_6", label: "Management Accounts Frequency" },
    { value: "Payroll_Frequency_id_3", label: "Payroll Frequency" },
    { value: "budgeted_hours", label: "Budgeted Time" },
    { value: "feedback_incorporation_time", label: "Feedback Incorporation Time" },
    { value: "review_time", label: "Review Time" },
    { value: "total_preparation_time", label: "Total Preparation Time" },
    { value: "total_time", label: "Total Time" },
    { value: "due_on", label: "Due On" },
    { value: "customer_deadline_date", label: "Customer Deadline Date" },
    { value: "date_received_on", label: "Date Received On" },
    { value: "expected_delivery_date", label: "Expected Delivery Date" },
    { value: "internal_deadline_date", label: "Internal Deadline Date" },
    { value: "sla_deadline_date", label: "SLA Deadline Date" },
    { value: "Management_Accounts_FromDate_id_6", label: "From Date (Management Accounts)" },
    { value: "Management_Accounts_ToDate_id_6", label: "To Date (Management Accounts)" },
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


  //  console.log("Filters: ", filters);

  const saveFilterFunction = async () => {

    if (filters?.groupBy?.length == 0) {
      sweatalert.fire({
        title: 'Warning',
        text: 'Please select group by one value',
        icon: 'warning',
        confirmButtonText: 'OK'
      });

      return
    }

    var req = { action: "saveFilters", filters: filters, id: filterId, type: "job_custom_report" };
    var data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {

          sweatalert.fire({
            title: 'Success',
            text: response.message,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          getAllFilters();

        } else {
          sweatalert.fire({
            title: 'Error',
            text: 'Failed to save filters. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });

        }
      })
      .catch((error) => {
        return;
      });



  }

  const handleFilterSelect = async (selected) => {
    setFilterId(selected.value);
    // set filters from selected
    // console.log("selected  1 --", selected);
    let selectedFilter = getAllFilterData?.find((opt) => Number(opt?.value) === Number(selected?.value));

    //console.log("selectedFilter  2 --", selectedFilter);
    if (selectedFilter != undefined && selectedFilter.filters) {
      let parsedFilters = {};
      try {

        parsedFilters = JSON.parse(selectedFilter.filters);

        if (parsedFilters?.groupBy?.includes('job_id')) {
          await GetAllJobs();
        }
        if (parsedFilters?.groupBy?.includes('customer_id')) {
          await GetAllCustomer();
        }
        if (parsedFilters?.groupBy?.includes('client_id')) {
          await GetAllClient();
        }
        if (parsedFilters?.groupBy?.includes('account_manager_id')) {
          await staffData(4);
        }
        if (parsedFilters?.groupBy?.includes('allocated_to_id')) {
          await staffData(3);
        }
        if (parsedFilters?.groupBy?.includes('reviewer_id')) {
          await staffData(6);
        }
        if (parsedFilters?.groupBy?.includes('allocated_to_other_id')) {
          await staffData('other');
        }
        if (parsedFilters?.groupBy?.includes('service_id')) {
          await GetAllService();
        }
        if (parsedFilters?.groupBy?.includes('job_type_id')) {
          await GetAllJobType();
        }
        if (parsedFilters?.groupBy?.includes('status_type_id')) {
          await GetAllStatus();
        }
        setFilters(parsedFilters);
        callFilterApi();
      } catch (e) {
        console.error("Error parsing filters JSON: ", e);
      }
    } else {

      setFilters({
        groupBy:
          ["job_id",
            "customer_id",
            "client_id",
            "account_manager_id",
            "allocated_to_id",
            "reviewer_id",
            "allocated_to_other_id",
            "service_id",
            "job_type_id",
            "status_type_id"
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
      })

    }
  };

  const deleteFilterIdFunction = async () => {
    // confirm before delete
    const result = await sweatalert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      var req = { action: "deleteFilterId", filterId: filterId, type: "job_custom_report" };
      var data = { req: req, authToken: token };
      await dispatch(getAllTaskByStaff(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {

            sweatalert.fire({
              title: 'Success',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            getAllFilters();
            resetFunction();

          } else {
            sweatalert.fire({
              title: 'Error',
              text: 'Failed to save filters. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });

          }
        })
        .catch((error) => {
          return;
        });
    } else {
      return
    }


  }



  return (
    <div className="container-fluid pb-3">
      {/* Page Title */}
      <div className="content-title">
        <div className="tab-title mb-3">
          <div className="row align-items-start">
            <div className="col-12 col-sm-7 ">
              <div>
                <h3 className="mt-0">Custom Job Report</h3>

              </div>

              <div className='w-50 mt-2'>
                <label className="form-label fw-medium mt-2 mb-1">
                  Select Saved Filters
                </label>

                <div className="d-flex align-items-center gap-2">
                  <Select

                    options={[
                      { value: "", label: "Select..." },
                      ...getAllFilterData.map(opt => ({
                        value: opt.value,
                        label: <span dangerouslySetInnerHTML={{ __html: opt.label }} />
                      }))
                    ]}
                    value={
                      getAllFilterData && getAllFilterData.length > 0
                        ? getAllFilterData.find(
                          (opt) => Number(opt.value) === Number(filterId)
                        ) || null
                        : null
                    }
                    onChange={handleFilterSelect}
                    isSearchable
                    className="shadow-sm select-staff rounded-pill flex-grow-1"
                  />

                  {

                    !['', null, undefined].includes(filterId) && (
                      <i
                        className="fa fa-trash"
                        title="Delete Filter"
                        onClick={() => deleteFilterIdFunction()}
                        style={{ cursor: "pointer", color: "red" }}
                      ></i>
                    )
                  }

                </div>
              </div>


            </div>

            {/* get filters Dropdown */}



            {/* end get filters Dropdown */}






            <div className="col-12 col-sm-5">
              <div className="d-block d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                <button className="btn btn-info" id="btn-export"
                  onClick={() => exportToCSV(showData)}>
                  Export Data
                </button>

              </div>
            </div>
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

          <button
            onClick={() => {
              const allValues = optionGroupBy.map(opt => opt.value);
              addAndRemoveGroupBy(allValues, "addAll");
              handleFilterChange(optionGroupBy);
            }}
            style={{
              marginBottom: "5px",
              padding: "6px 10px",
              background: "#eee",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
          <TextSelect />
          </button>

           
        
  
          <label className="form-label fw-medium">Group By</label>

          <Select
            isMulti
            closeMenuOnSelect={false}
            options={optionGroupBy}
            value={optionGroupBy.filter((opt) => filters.groupBy.includes(opt.value))}
            onChange={(selectedOptions, actionMeta) => {
              // console.log("Selected Options:", selectedOptions);
              //console.log("Action Meta:", actionMeta);

              if (actionMeta.action === "remove-value") {
                console.log("Removed value:", actionMeta.removedValue.value);
                addAndRemoveGroupBy(actionMeta.removedValue.value, 'remove');
              }
              if (actionMeta.action === "select-option") {
                console.log("Added value:", actionMeta.option.value);
                addAndRemoveGroupBy(actionMeta.option.value, 'add');
              }
              handleFilterChange(selectedOptions);
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div>

        {/* Additional Field */}
        {/* <div className="col-lg-4 col-md-6">
          <label className="form-label fw-medium">Additional Fields</label>

          <Select
            isMulti
            options={optionAdditionalBy}
            value={optionAdditionalBy?.filter((opt) => filters?.additionalField.includes(opt.value))}
            onChange={(selectedOptions, actionMeta) => {
              // console.log("Selected Options:", selectedOptions);
              //console.log("Action Meta:", actionMeta);
              handleFilterChange(selectedOptions, 'additionalField');
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </div> */}


        {/* Field To Display Job */}
        {(filters?.groupBy?.includes('job_id')) && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Job Name
            </label>
            <Select
              options={[
                { value: "", label: "Select..." },
                ...jobAllData,
              ]}
              value={
                jobAllData && jobAllData.length > 0
                  ? jobAllData.find((opt) => Number(opt.value) === Number(filters.job_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "job_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Customer */}
        {filters?.groupBy?.includes('customer_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Customer Name
            </label>
            <Select
              options={[
                { value: "", label: "Select..." },
                ...customerAllData,
              ]}
              value={
                customerAllData && customerAllData.length > 0
                  ? customerAllData.find((opt) => Number(opt.value) === Number(filters.customer_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "customer_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Client */}
        {filters?.groupBy?.includes('client_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Client Name
            </label>
            <Select
              options={[
                { value: "", label: "Select..." },
                ...clientAllData,
              ]}
              value={
                clientAllData && clientAllData.length > 0
                  ? clientAllData.find((opt) => Number(opt.value) === Number(filters.client_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "client_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Account Manager  */}
        {filters?.groupBy?.includes('account_manager_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Account Manager Name
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...accountManagerAllData,
              ]}
              value={
                accountManagerAllData && accountManagerAllData.length > 0
                  ? accountManagerAllData.find((opt) => Number(opt.value) === Number(filters.account_manager_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "account_manager_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Allocated To */}
        {filters?.groupBy?.includes('allocated_to_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Allocated To
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...allocatedToAllData,
              ]}
              value={
                allocatedToAllData && allocatedToAllData?.length > 0
                  ? allocatedToAllData?.find((opt) => Number(opt.value) === Number(filters.allocated_to_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "allocated_to_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Reviewer  */}
        {filters?.groupBy?.includes('reviewer_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Reviewer
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...reviewerAllData,
              ]}
              value={
                reviewerAllData && reviewerAllData?.length > 0
                  ? reviewerAllData?.find((opt) => Number(opt.value) === Number(filters.reviewer_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "reviewer_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Allocated Other  */}
        {filters?.groupBy?.includes('allocated_to_other_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Allocated To (Other)
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...otherStaffAllData,
              ]}
              value={
                otherStaffAllData && otherStaffAllData?.length > 0
                  ? otherStaffAllData?.find((opt) => Number(opt.value) === Number(filters.allocated_to_other_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "allocated_to_other_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Services  */}
        {filters?.groupBy?.includes('service_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Service Type
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...serviceAllData,
              ]}
              value={
                serviceAllData && serviceAllData?.length > 0
                  ? serviceAllData?.find((opt) => Number(opt.value) === Number(filters.service_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "service_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}


        {/* Field To Display Job Type  */}
        {filters?.groupBy?.includes('job_type_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Job Type
            </label>

            <Select

              options={[
                { value: "", label: "Select..." },
                ...jobTypeAllData,
              ]}
              value={
                jobTypeAllData && jobTypeAllData?.length > 0
                  ? jobTypeAllData?.find((opt) => Number(opt.value) === Number(filters.job_type_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "job_type_id", value: selected.value, label: selected.label },
                })
              }
              isSearchable
              className="shadow-sm select-staff rounded-pill"
            />
          </div>
        )}

        {/* Field To Display Status  */}
        {filters?.groupBy?.includes('status_type_id') && (
          <div className="col-lg-4 col-md-6">
            <label className="form-label fw-medium">
              Job Status
            </label>
            <Select
              options={[
                { value: "", label: "Select..." },
                ...statusAllData,
              ]}
              value={
                statusAllData && statusAllData?.length > 0
                  ? statusAllData?.find((opt) => Number(opt.value) === Number(filters.status_type_id)) || null
                  : null
              }
              onChange={(selected) =>
                handleFilterChange({
                  target: { key: "status_type_id", value: selected.value, label: selected.label },
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
      <div className='datatable-container'>
        {/* <h6>Filtered Data:</h6> */}
        {
          //console.log("showData?.rows ", showData?.rows)
        }
        {showData?.rows == undefined || showData?.rows?.length === 0 ? (
          <div className='text-center'>
            <img
              src={noDataImage}
              alt="No records available"
              style={{ width: '250px', height: 'auto', objectFit: 'contain' }}
            />
            <p className='fs-16'>There are no records to display</p>
          </div>
        ) : (
          <div className='table-responsive fixed-table-header'>
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
                <tr
                  className="rdt_TableHeadRow"
                >
                  {showData?.columns?.map((col, idx) => (
                    <th className='border-bottom-0' key={idx}
                      style={{ fontSize: "15px", fontWeight: "bold", minWidth: "130px" }}
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
                      <td key={colIdx} style={{ padding: "10px", }}>
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
    If_Sole_Trader_Who_is_doing_Bookkeeping_id_4: "If Sole Trader, Who is doing Bookkeeping",
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

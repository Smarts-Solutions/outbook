import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GetAllJabData,
  AddAllJobType,
  GET_ALL_CHECKLIST,
  GetOfficerDetails
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import { JobType } from "../../../ReduxStore/Slice/Settings/settingSlice";
import axios from "axios";
import * as XLSX from "xlsx";
import { base_url } from "../../../Utils/Config";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { ScrollToViewFirstError } from "../../../Utils/Comman_function";
import { CreateJobErrorMessage } from "../../../Utils/Common_Message";
import Select from 'react-select';
import { Save, Plus, ArrowLeft, X, ExternalLink, RotateCcw } from "lucide-react";

const CreateJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = JSON.parse(localStorage.getItem("role"));

  const token = JSON.parse(localStorage.getItem("token"));
  const staffCreatedId = JSON.parse(localStorage.getItem("staffDetails")).id;
  const [AllJobData, setAllJobData] = useState({ loading: false, data: [] });
  const [get_Job_Type, setJob_Type] = useState({ loading: false, data: [] });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [PreparationTimne, setPreparationTimne] = useState({
    hours: "",
    minutes: "",
  });
  const [FeedbackIncorporationTime, setFeedbackIncorporationTime] = useState({
    hours: "",
    minutes: "",
  });
  const [reviewTime, setReviewTime] = useState({ hours: "", minutes: "" });
  const [budgetedHours, setBudgetedHours] = useState({
    hours: "",
    minutes: "",
  });
  const [invoiceTime, setInvoiceTime] = useState({ hours: "", minutes: "" });
  const [AllChecklistData, setAllChecklistData] = useState({
    loading: false,
    data: [],
  });
  const [getChecklistId, setChecklistId] = useState("");
  const [AddTaskArr, setAddTaskArr] = useState([]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskNameError, setTaskNameError] = useState("");
  const [jobModalStatus, jobModalSetStatus] = useState(false);
  const [BudgetedHoursAddTask, setBudgetedHoursAddTask] = useState({
    hours: "",
    minutes: "",
  });
  const [BudgetedHoureError, setBudgetedHourError] = useState("");
  const [BudgetedMinuteError, setBudgetedMinuteError] = useState("");
  const [Totaltime, setTotalTime] = useState({ hours: "", minutes: "" });

  //// Checklist Modal State
  const [checklistModal, setChecklistModal] = useState({
    show: false,
    data: [],
    title: "",
    loading: false,
    type: ""
  });

  const [jobData, setJobData] = useState({
    AccountManager: "",
    Customer: "",
    Client: "",
    ClientJobCode: "",
    CustomerAccountManager: "",
    Service: "",
    JobType: "",
    Reviewer: "",
    AllocatedTo: "",
    AllocatedOn: new Date().toISOString().slice(0, 10),
    DateReceivedOn: new Date().toISOString().slice(0, 10),
    ExpectedDeliveryDate: "",
    DueOn: "",
    SubmissionDeadline: "",
    CustomerDeadlineDate: "",
    SLADeadlineDate: "",
    InternalDeadlineDate: "",
    job_priority: "normal",
    FilingWithCompaniesHouseRequired: "",
    CompaniesHouseFilingDate: "",
    FilingWithHMRCRequired: "",
    HMRCFilingDate: "",
    YearEnd: "",
    EngagementModel: "",
    processing_checklist: null,
    reviewing_checklist: null,

    // Service-specific fields
    Turnover_Period_id_0: "",
    Turnover_Currency_id_0: "",
    Turnover_id_0: "",
    VAT_Registered_id_0: "",
    VAT_Frequency_id_0: "",

    Who_Did_The_Bookkeeping_id_1: "",
    PAYE_Registered_id_1: "",
    Number_of_Trial_Balance_Items_id_1: "",
    Year_Ending_id_1: "",

    Bookkeeping_Frequency_id_2: "",
    Day_Date_id_2: "",
    Week_Year_id_2: "",
    Week_Month_id_2: "",
    Week_id_2: "",
    Fortnight_Year_id_2: "",
    Fortnight_Month_id_2: "",
    Fortnight_id_2: "",
    Month_Year_id_2: "",
    Month_id_2: "",
    Quarter_Year_id_2: "",
    Quarter_id_2: "",
    Year_id_2: "",
    Other_FromDate_id_2: "",
    Other_ToDate_id_2: "",
    Number_of_Total_Transactions_id_2: "",
    Number_of_Bank_Transactions_id_2: "",
    Number_of_Purchase_Invoices_id_2: "",
    Number_of_Sales_Invoices_id_2: "",
    Number_of_Petty_Cash_Transactions_id_2: "",
    Number_of_Journal_Entries_id_2: "",
    Number_of_Other_Transactions_id_2: "",
    Transactions_Posting_id_2: "",
    Quality_of_Paperwork_id_2: "",
    Number_of_Integration_Software_Platforms_id_2: "",
    CIS_id_2: "",
    Posting_Payroll_Journals_id_2: "",
    Department_Tracking_id_2: "",
    Sales_Reconciliation_Required_id_2: "",
    Factoring_Account_id_2: "",
    Payment_Methods_id_2: "",

    Payroll_Frequency_id_3: "",
    Payroll_Week_Year_id_3: "",
    Payroll_Week_Month_id_3: "",
    Payroll_Week_id_3: "",
    Payroll_Fortnight_Year_id_3: "",
    Payroll_Fortnight_Month_id_3: "",
    Payroll_Fortnight_id_3: "",
    Payroll_Month_Year_id_3: "",
    Payroll_Month_id_3: "",
    Payroll_Quarter_Year_id_3: "",
    Payroll_Quarter_id_3: "",
    Payroll_Year_id_3: "",
    Type_of_Payslip_id_3: "",
    Percentage_of_Variable_Payslips_id_3: "",
    Is_CIS_Required_id_3: "",
    CIS_Frequency_id_3: "",
    Number_of_Sub_contractors_id_3: "",

    Whose_Tax_Return_is_it_id_4: "",
    Number_of_Income_Sources_id_4: "",
    If_Landlord_Number_of_Properties_id_4: "",
    If_Sole_Trader_Who_is_doing_Bookkeeping_id_4: "",
    Tax_Year_id_4: "",

    Management_Accounts_Frequency_id_6: "",
    Management_Accounts_FromDate_id_6: "",
    Management_Accounts_ToDate_id_6: "",

    Year_id_33: "",

    Period_id_32: "",
    Day_Date_id_32: "",
    Week_Year_id_32: "",
    Week_Month_id_32: "",
    Week_id_32: "",
    Fortnight_Year_id_32: "",
    Fortnight_Month_id_32: "",
    Fortnight_id_32: "",
    Month_Year_id_32: "",
    Month_id_32: "",
    Quarter_Year_id_32: "",
    Quarter_id_32: "",
    Year_id_32: "",
    Other_FromDate_id_32: "",
    Other_ToDate_id_32: "",

    Payroll_Frequency_id_31: "",
    Payroll_Week_Year_id_31: "",
    Payroll_Week_Month_id_31: "",
    Payroll_Week_id_31: "",
    Payroll_Fortnight_Year_id_31: "",
    Payroll_Fortnight_Month_id_31: "",
    Payroll_Fortnight_id_31: "",
    Payroll_Month_Year_id_31: "",
    Payroll_Month_id_31: "",
    Payroll_Quarter_Year_id_31: "",
    Payroll_Quarter_id_31: "",
    Payroll_Year_id_31: "",

    Audit_Year_Ending_id_27: "",

    Filing_Frequency_id_8: "",
    Period_Ending_Date_id_8: "",
    Filing_Date_id_8: "",

    Year_id_28: "",
  });

  const [allClientDetails, setAllClientDetails] = useState([]);
  const [clientType, setClientType] = useState("");
  const [serviceFieldsData, setServiceFieldsData] = useState([]);
  const [allStaffData, setAllStaffData] = useState([]);
  const [selectedStaffData, setSelectedStaffData] = useState([]);

  const getMonths = () => [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getQuarters = () => ["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"];

  const getLastFiveYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  };

  const getDueDate = (date, months) => {
    if (!date) return "";
    const d = new Date(date);
    d.setMonth(d.getMonth() + months + 1);
    d.setDate(0);
    return d.toISOString().slice(0, 10);
  };

  const dueOn_date_set = async (type, service_id) => {
    if (type == "2") {
      if (Number(service_id) === 1) {
        const d = new Date();
        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        if (m >= 4 || m <= 1) {
          return `${m >= 4 ? y + 1 : y}-01-31`;
        }
        return `${y}-01-31`;
      } else if (Number(service_id) === 8) {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const nextNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1);
        nextNextMonth.setDate(nextNextMonth.getDate() + 6);
        const y = nextNextMonth.getFullYear();
        const m = String(nextNextMonth.getMonth() + 1).padStart(2, "0");
        const d = String(nextNextMonth.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      } else {
        return null;
      }
    } else {
      if (Number(service_id) === 8) {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const nextNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1);
        nextNextMonth.setDate(nextNextMonth.getDate() + 6);
        const y = nextNextMonth.getFullYear();
        const m = String(nextNextMonth.getMonth() + 1).padStart(2, "0");
        const d = String(nextNextMonth.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      } else if (Number(service_id) === 4) {
        const d = new Date();
        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        if (m >= 4 || m <= 1) {
          return `${m >= 4 ? y + 1 : y}-01-31`;
        }
        return `${y}-01-31`;
      } else {
        return null;
      }
    }
  };

  const get_information_company_number = async (company_number, service_id) => {
    try {
      const response = await axios.get(`${base_url}get_information_company_number/${company_number}`);
      if (response.data.status) {
        const next_accounts = response.data.data.next_accounts;
        const period_end_on = next_accounts.period_end_on;
        setJobData((prev) => ({
          ...prev,
          YearEnd: period_end_on,
          Year_Ending_id_1: period_end_on,
          DueOn: next_accounts.due_on,
          SLADeadlineDate: next_accounts.due_on,
        }));
      }
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  const handleViewChecklist = async (checklistId, title, type) => {
    if (!checklistId) return;

    setChecklistModal(prev => ({ ...prev, show: true, loading: true, title, type: type }));

    if (checklistModal[type] && checklistModal[type].length > 0) {
      setChecklistModal(prev => ({
        ...prev,
        loading: false,
        data: [...prev[type]]
      }));
      return;
    }

    try {
      const response = await axios.get(`${base_url}downloadChecklist/${checklistId}`, {
        responseType: 'arraybuffer'
      });
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const formattedTasks = jsonData.slice(1)
        .filter(row => row[0])
        .map((row, index) => ({
          id: index + 1,
          task_name: row[0],
          status: "pending",
          remark: ""
        }));

      setChecklistModal(prev => ({
        ...prev,
        loading: false,
        data: formattedTasks,
        [type]: formattedTasks
      }));
    } catch (error) {
      console.error("Error downloading checklist:", error);
      setChecklistModal(prev => ({ ...prev, loading: false }));
      sweatalert.fire("Error", "Could not load checklist tasks", "error");
    }
  };

  const handleTaskStatusChange = (taskId, status) => {
    setChecklistModal(prev => ({
      ...prev,
      data: prev.data.map(task =>
        task.id === taskId ? { ...task, status } : task
      )
    }));
  };

  const handleTaskRemarkChange = (taskId, remark) => {
    setChecklistModal(prev => ({
      ...prev,
      data: prev.data.map(task =>
        task.id === taskId ? { ...task, remark } : task
      )
    }));
  };

  const handleSubmitChecklist = () => {
    const type = checklistModal.type;
    setChecklistModal(prev => ({
      ...prev,
      show: false,
      [type]: [...prev.data]
    }));
    sweatalert.fire("Success", `${checklistModal.title} saved in session`, "success");
  };

  const GetJobData = async () => {
    const req = {
      action: "get",
      customer_id: location.state.customer_id
    };
    const data = { req: req, authToken: token };
    await dispatch(GetAllJabData(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setAllJobData({ loading: true, data: response.data });
          setAllClientDetails(response.data?.client || []);
          setAllStaffData(response.data?.staff_other || []);

          setJobData((prev) => ({
            ...prev,
            AccountManager: response.data?.customer?.customer_officer_name || "",
            Customer: response.data?.customer?.customer_name || "",
            EngagementModel: Object.entries(response.data?.engagement_model[0] || {}).find(([key, value]) => value === "1")?.[0] || "",
          }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    GetJobData();
  }, []);

  const GetJobType = async () => {
    if (!jobData.Service) return;
    const req = { action: "get", service_id: jobData.Service };
    const data = { req: req, authToken: token };
    await dispatch(JobType(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setJob_Type({ loading: true, data: response.data });
        } else {
          setJob_Type({ loading: true, data: [] });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    GetJobType();
  }, [jobData.Service]);

  const getAllChecklist = async () => {
    if (
      jobData.Client &&
      jobData.Service &&
      AllJobData?.data?.customer?.customer_id &&
      jobData.JobType
    ) {
      const req = {
        action: "getByServiceWithJobType",
        service_id: jobData.Service,
        customer_id: AllJobData?.data?.customer?.customer_id,
        job_type_id: jobData.JobType,
        clientId: Number(jobData.Client),
      };
      const data = { req: req, authToken: token };
      await dispatch(GET_ALL_CHECKLIST(data))
        .unwrap()
        .then(() => {})
        .catch(() => {});
    }
  };

  useEffect(() => {
    getAllChecklist();
  }, [jobData.JobType, AllJobData?.data]);

  const HandleChange = async (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === 'Client') {
      const clientInfo = allClientDetails?.find((client) => Number(client?.client_id) === Number(value)) || "";
      setClientType(clientInfo?.client_client_type || "");

      if (clientInfo !== "" && clientInfo?.client_company_number && clientInfo?.client_client_type === "2") {
        if (Number(jobData?.Service) === 1) {
          await get_information_company_number(clientInfo?.client_company_number, jobData?.Service);
        } else if ([4, 8].includes(Number(jobData?.Service))) {
          const dueOn = await dueOn_date_set(clientInfo?.client_client_type, jobData?.Service);
          if (dueOn) setJobData(prev => ({ ...prev, DueOn: dueOn, SLADeadlineDate: dueOn }));
        }
      } else if (clientInfo !== "" && ["5"].includes(clientInfo?.client_client_type)) {
        if (Number(jobData?.Service) === 1) {
          await get_information_company_number(clientInfo?.company_number, jobData?.Service);
        } else if ([4, 8].includes(Number(jobData?.Service))) {
          const dueOn = await dueOn_date_set(clientInfo?.client_client_type, jobData?.Service);
          if (dueOn) setJobData(prev => ({ ...prev, DueOn: dueOn, SLADeadlineDate: dueOn }));
        }
      } else if (["1", "3", "7"].includes(clientInfo?.client_client_type)) {
        if ([4, 8].includes(Number(jobData?.Service))) {
          const dueOn = await dueOn_date_set(clientInfo?.client_client_type, jobData?.Service);
          if (dueOn) setJobData(prev => ({ ...prev, DueOn: dueOn, SLADeadlineDate: dueOn }));
        }
      }
    }

    if (name === "Service") {
      setJobData(prev => ({
        ...prev,
        [name]: value,
        JobType: "",
        processing_checklist: null,
        reviewing_checklist: null
      }));
      setChecklistModal(prev => ({ ...prev, processing: [], reviewing: [] }));
      
      const clientInfo = allClientDetails?.find((client) => Number(client?.client_id) === Number(jobData.Client)) || "";
      if (clientInfo) {
        if (Number(value) === 1 && clientInfo.client_company_number) {
          await get_information_company_number(clientInfo.client_company_number, value);
        } else if ([4, 8].includes(Number(value))) {
          const dueOn = await dueOn_date_set(clientInfo.client_client_type, value);
          if (dueOn) setJobData(prev => ({ ...prev, DueOn: dueOn, SLADeadlineDate: dueOn }));
        }
      }
    } else {
      setJobData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const openJobModal = (e) => {
    const value = e.target.value;
    const selectedJobType = get_Job_Type?.data?.find((item) => Number(item.id) === Number(value));
    if (selectedJobType) {
      setAddTaskArr(selectedJobType.task || []);
      jobModalSetStatus(true);
    }
  };

  const shouldShowField = (field, currentJobData) => {
    if (!field.showIf) return true;
    return Object.entries(field.showIf).every(([key, expectedValue]) => {
      const actualValue = currentJobData[key];
      if (Array.isArray(expectedValue)) {
        return expectedValue.includes(actualValue);
      }
      return actualValue === expectedValue;
    });
  };

  const validateAllFields = () => {
    const newErrors = {};
    const requiredFields = [
      "AccountManager", "Customer", "Client", "CustomerAccountManager",
      "Service", "JobType", "DateReceivedOn"
    ];

    requiredFields.forEach(field => {
      if (!jobData[field]) {
        newErrors[field] = CreateJobErrorMessage[field];
      }
    });

    if (Number(jobData.Service) === 1 && !jobData.Year_Ending_id_1) {
      newErrors["Year_Ending_id_1"] = "Year Ending is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateAllFields()) {
      ScrollToViewFirstError();
      return;
    }

    const submissionAddTaskArr = AddTaskArr.map(task => {
      const [h, m] = (task.budgeted_hour || "0:0").split(":");
      const totalMin = (Number(h) || 0) * 60 + (Number(m) || 0);
      return { ...task, budgeted_hour: totalMin };
    });

    const payload = {
      ...jobData,
      AllocatedOn: jobData.AllocatedOn || null,
      ExpectedDeliveryDate: jobData.ExpectedDeliveryDate || null,
      SubmissionDeadline: jobData.SubmissionDeadline || null,
      CustomerDeadlineDate: jobData.CustomerDeadlineDate || null,
      InternalDeadlineDate: jobData.InternalDeadlineDate || null,
      CompaniesHouseFilingDate: jobData.CompaniesHouseFilingDate || null,
      HMRCFilingDate: jobData.HMRCFilingDate || null,
      YearEnd: jobData.YearEnd || null,
      
      TotalPreparationTime: (Number(PreparationTimne.hours) || 0) * 60 + (Number(PreparationTimne.minutes) || 0),
      review_time: (Number(reviewTime.hours) || 0) * 60 + (Number(reviewTime.minutes) || 0),
      FeedbackIncorporationTime: (Number(FeedbackIncorporationTime.hours) || 0) * 60 + (Number(FeedbackIncorporationTime.minutes) || 0),
      budgeted_hour: (Number(budgetedHours.hours) || 0) * 60 + (Number(budgetedHours.minutes) || 0),
      
      staff: selectedStaffData?.map(s => s.value).join(",") || null,
      addTaskArr: submissionAddTaskArr,
      
      processing_checklist_status: checklistModal.processing ? JSON.stringify(checklistModal.processing) : null,
      reviewing_checklist_status: checklistModal.reviewing ? JSON.stringify(checklistModal.reviewing) : null,
      
      action: "add",
      customer_id: location.state.customer_id
    };

    const data = { req: payload, authToken: token };
    
    sweatalert.fire({
      title: "Are you sure?",
      text: "You want to create this job!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, create it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(AddAllJobType(data))
          .unwrap()
          .then((response) => {
            if (response.status) {
              sweatalert.fire("Success", response.message, "success");
              navigate("/Customer/JobList", { state: { activeTab: "1" } });
            } else {
              sweatalert.fire("Error", response.message, "error");
            }
          })
          .catch((error) => {
            sweatalert.fire("Error", error.message || "Something went wrong", "error");
          });
      }
    });
  };

  const RearrangeEngagementOptionArr = [];
  const filteredData = AllJobData.data?.engagement_model?.[0]
    ? Object.keys(AllJobData.data.engagement_model[0])
      .filter((key) => AllJobData.data.engagement_model[0][key] === "1")
      .reduce((obj, key) => {
        const keyMapping = {
          fte_dedicated_staffing: "FTE Dedicated Staffing",
          percentage_model: "Percentage Model",
          adhoc_payg_hourly: "Adhoc Payg Hourly",
          customised_pricing: "Customised Pricing",
        };
        if (keyMapping[key]) {
          RearrangeEngagementOptionArr.push(keyMapping[key]);
        }
        obj[key] = AllJobData.data.engagement_model[0][key];
        return obj;
      }, {})
    : {};

  const totalHours =
    (Number(PreparationTimne.hours) || 0) * 60 +
    (Number(PreparationTimne.minutes) || 0) +
    (Number(reviewTime.hours) || 0) * 60 +
    (Number(reviewTime.minutes) || 0) +
    (Number(FeedbackIncorporationTime.hours) || 0) * 60 +
    (Number(FeedbackIncorporationTime.minutes) || 0);

  useEffect(() => {
    setTotalTime({
      hours: Math.floor(totalHours / 60),
      minutes: totalHours % 60,
    });
  }, [PreparationTimne, reviewTime, FeedbackIncorporationTime]);

  const serviceFields = [
    {
      id: 0,
      fields: [
        { name: "Turnover Period", key: "Turnover_Period_id_0", type: "dropdown", options: ["Monthly", "Quarterly", "Yearly"] },
        { name: "Turnover Currency", key: "Turnover_Currency_id_0", type: "dropdown", options: ["GBP", "USD", "INR", "EUR", "JPY", "SGD", "CNY", "Other"] },
        { name: "Turnover", key: "Turnover_id_0", type: "number", min: 0, max: 1000000000 },
        { name: "VAT Registered", key: "VAT_Registered_id_0", type: "dropdown", options: ["No", "Cash", "Accrual", "Flat Rate", "TOMS", "Margin", "Other"] },
        { name: "VAT Frequency", key: "VAT_Frequency_id_0", type: "dropdown", options: ["Quarterly", "Monthly", "Yearly", "NA"] },
      ],
    },
    {
      id: 1,
      fields: [
        { name: "Who Did The Bookkeeping", key: "Who_Did_The_Bookkeeping_id_1", type: "dropdown", options: ["Outbooks", "Customer", "Client", "Other Outsourced Bookkeeper", "Internal Bookkeeper", "Other"] },
        { name: "PAYE Registered", key: "PAYE_Registered_id_1", type: "dropdown", options: ["No", "0", "1 to 5", "6 to 10", "11 to 20", "21 to 50", "51 to 100", "100+"] },
        { name: "Number of Trial Balance Items", key: "Number_of_Trial_Balance_Items_id_1", type: "dropdown", options: ["1 to 5", "6 to 10", "11 to 20", "21 to 30", "31 to 40", "41 to 50", "51 to 75", "75 to 100", "101 to 200", "201 to 300", "301 to 400", "401 to 500", "500+"] },
        { name: "Year Ending", key: "Year_Ending_id_1", type: "date" },
      ],
    },
    {
      id: 2,
      fields: [
        { name: "Frequency", key: "Bookkeeping_Frequency_id_2", type: "dropdown", options: ["Daily", "Weekly", "Fortnightly", "Monthly", "Quarterly", "Yearly", "Other"] },
        { name: "Select Date", key: "Day_Date_id_2", type: "date", showIf: { Bookkeeping_Frequency_id_2: "Daily" } },
        { name: "Year", key: "Week_Year_id_2", type: "dropdown", options: getLastFiveYears(), showIf: { Bookkeeping_Frequency_id_2: "Weekly" } },
        { name: "Month", key: "Week_Month_id_2", type: "dropdown", options: getMonths(), showIf: { Bookkeeping_Frequency_id_2: "Weekly" } },
        { name: "Week", key: "Week_id_2", type: "dropdown", options: ["Week 1", "Week 2", "Week 3", "Week 4"], showIf: { Bookkeeping_Frequency_id_2: "Weekly" } },
        { name: "Year", key: "Fortnight_Year_id_2", type: "dropdown", options: getLastFiveYears(), showIf: { Bookkeeping_Frequency_id_2: "Fortnight" } },
        { name: "Month", key: "Fortnight_Month_id_2", type: "dropdown", options: getMonths(), showIf: { Bookkeeping_Frequency_id_2: "Fortnight" } },
        { name: "Fortnight", key: "Fortnight_id_2", type: "dropdown", options: ["1st Half", "2nd Half"], showIf: { Bookkeeping_Frequency_id_2: "Fortnight" } },
        { name: "Year", key: "Month_Year_id_2", type: "dropdown", options: getLastFiveYears(), showIf: { Bookkeeping_Frequency_id_2: "Month" } },
        { name: "Month", key: "Month_id_2", type: "dropdown", options: getMonths(), showIf: { Bookkeeping_Frequency_id_2: "Month" } },
        { name: "Year", key: "Quarter_Year_id_2", type: "dropdown", options: getLastFiveYears(), showIf: { Bookkeeping_Frequency_id_2: "Quarter" } },
        { name: "Quarter", key: "Quarter_id_2", type: "dropdown", options: getQuarters(), showIf: { Bookkeeping_Frequency_id_2: "Quarter" } },
        { name: "Year", key: "Year_id_2", type: "dropdown", options: getLastFiveYears(), showIf: { Bookkeeping_Frequency_id_2: "Yearly" } },
        { name: "From Date", key: "Other_FromDate_id_2", type: "date", showIf: { Bookkeeping_Frequency_id_2: "Other" } },
        { name: "To Date", key: "Other_ToDate_id_2", type: "date", showIf: { Bookkeeping_Frequency_id_2: "Other" } },
        { name: "Number of Total Transactions", key: "Number_of_Total_Transactions_id_2", type: "number", min: 0, max: 100000 },
        { name: "Number of Bank Transactions", key: "Number_of_Bank_Transactions_id_2", type: "number", min: 0, max: 100000 },
        { name: "Number of Purchase Invoices", key: "Number_of_Purchase_Invoices_id_2", type: "number", min: 0, max: 100000 },
        { name: "Number of Sales Invoices", key: "Number_of_Sales_Invoices_id_2", type: "number", min: 0, max: 100000 },
        { name: "Number of Petty Cash Transactions", key: "Number_of_Petty_Cash_Transactions_id_2", type: "number", min: 0, max: 100000 },
        { name: "Number of Journal Entries", key: "Number_of_Journal_Entries_id_2", type: "number", min: 0, max: 100000 },
        { name: "Number of Other Transactions", key: "Number_of_Other_Transactions_id_2", type: "number", min: 0, max: 100000 },
        { name: "Transactions Posting", key: "Transactions_Posting_id_2", type: "dropdown", options: ["Manual", "Dext", "Hubdoc", "Auto Entry", "Other"] },
        { name: "Quality of Paperwork", key: "Quality_of_Paperwork_id_2", type: "dropdown", options: ["Bad", "Good", "Excellent"] },
        { name: "Number of Integration Software Platforms", key: "Number_of_Integration_Software_Platforms_id_2", type: "dropdown", options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "9+"] },
        { name: "CIS", key: "CIS_id_2", type: "dropdown", options: ["No", "Yes"] },
        { name: "Posting Payroll Journals", key: "Posting_Payroll_Journals_id_2", type: "dropdown", options: ["Yes", "No"] },
        { name: "Department Tracking", key: "Department_Tracking_id_2", type: "dropdown", options: ["No", "Yes"] },
        { name: "Sales Reconciliation Required", key: "Sales_Reconciliation_Required_id_2", type: "dropdown", options: ["No", "Yes"] },
        { name: "Factoring Account", key: "Factoring_Account_id_2", type: "dropdown", options: ["Provider Deducts Commission Only", "Rapid Cash Account", "Provider Deducts Fixed Percentage", "No Factoring Account"] },
        { name: "Payment Methods", key: "Payment_Methods_id_2", type: "dropdown", options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "9+"] },
      ],
    },
    {
      id: 3,
      fields: [
        { name: "Payroll Frequency", key: "Payroll_Frequency_id_3", type: "dropdown", options: ["Weekly", "Monthly", "Fortnightly", "Quarterly", "Yearly"] },
        { name: "Year", key: "Payroll_Week_Year_id_3", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_3: "Weekly" } },
        { name: "Month", key: "Payroll_Week_Month_id_3", type: "dropdown", options: getMonths(), showIf: { Payroll_Frequency_id_3: "Weekly" } },
        { name: "Week", key: "Payroll_Week_id_3", type: "dropdown", options: ["Week 1", "Week 2", "Week 3", "Week 4"], showIf: { Payroll_Frequency_id_3: "Weekly" } },
        { name: "Year", key: "Payroll_Fortnight_Year_id_3", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_3: "Fortnightly" } },
        { name: "Month", key: "Payroll_Fortnight_Month_id_3", type: "dropdown", options: getMonths(), showIf: { Payroll_Frequency_id_3: "Fortnightly" } },
        { name: "Fortnight", key: "Payroll_Fortnight_id_3", type: "dropdown", options: ["1st Half", "2nd Half"], showIf: { Payroll_Frequency_id_3: "Fortnightly" } },
        { name: "Year", key: "Payroll_Month_Year_id_3", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_3: "Monthly" } },
        { name: "Month", key: "Payroll_Month_id_3", type: "dropdown", options: getMonths(), showIf: { Payroll_Frequency_id_3: "Monthly" } },
        { name: "Year", key: "Payroll_Quarter_Year_id_3", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_3: "Quarterly" } },
        { name: "Quarter", key: "Payroll_Quarter_id_3", type: "dropdown", options: getQuarters(), showIf: { Payroll_Frequency_id_3: "Quarterly" } },
        { name: "Year", key: "Payroll_Year_id_3", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_3: "Yearly" } },
        { name: "Type of Payslip", key: "Type_of_Payslip_id_3", type: "dropdown", options: ["Wages Only", "Wages Pension"] },
        { name: "Percentage of Variable Payslips", key: "Percentage_of_Variable_Payslips_id_3", type: "dropdown", options: ["0%", "up to 25%", "25.1 to 50%", "50.1 to 75%", "75.1 to 100%"] },
        { name: "Is CIS Required", key: "Is_CIS_Required_id_3", type: "dropdown", options: ["No", "Yes"] },
        { name: "CIS Frequency", key: "CIS_Frequency_id_3", type: "dropdown", options: ["Weekly", "Monthly", "Weekly & Monthly", "Quarterly"] },
        { name: "Number of Sub-contractors", key: "Number_of_Sub_contractors_id_3", type: "number", min: 0, max: 10000 },
      ],
    },
    {
      id: 4,
      fields: [
        { name: "Whose Tax Return is it", key: "Whose_Tax_Return_is_it_id_4", type: "dropdown", options: ["Director", "Sole Trader", "Individual Earning more than £100k", "Partner in Partnership", "Landlord", "Other"] },
        { name: "Number of Income Sources", key: "Number_of_Income_Sources_id_4", type: "dropdown", options: ["1", "2", "3", "4", "5", "6", "7", "8", "9+"] },
        { name: "If Landlord, Number of Properties", key: "If_Landlord_Number_of_Properties_id_4", type: "dropdown", options: Array.from({ length: 30 }, (_, i) => (i + 1).toString()).concat(["30+"]) },
        { name: "If Sole Trader, Who is doing Bookkeeping", key: "If_Sole_Trader_Who_is_doing_Bookkeeping_id_4", type: "dropdown", options: ["Outbooks", "Customer", "Client", "Other Outsourced Bookkeeper", "Internal Bookkeeper", "Other"] },
        { name: "Tax Year", key: "Tax_Year_id_4", type: "dropdown", options: ["2018/19", "2019/20", "2020/21", "2021/22", "2022/23", "2023/24", "2024/25", "2025/26", "2026/27", "2027/28"] },
      ],
    },
    { id: 5, fields: [] },
    {
      id: 6,
      fields: [
        { name: "Management Accounts Frequency", key: "Management_Accounts_Frequency_id_6", type: "dropdown", options: ["Quarterly", "Yearly", "Monthly", "Weekly", "Fortnightly"] },
        { name: "From Date", key: "Management_Accounts_FromDate_id_6", type: "date" },
        { name: "To Date", key: "Management_Accounts_ToDate_id_6", type: "date" },
      ],
    },
    { id: 7, fields: [] },
    {
      id: 33,
      fields: [
        { name: "Year", key: "Year_id_33", type: "dropdown", options: getLastFiveYears() },
      ],
    },
    {
      id: 32,
      fields: [
        { name: "Period", key: "Period_id_32", type: "dropdown", options: ["Day", "Week", "Fortnight", "Month", "Quarter", "Year", "Other"] },
        { name: "Select Date", key: "Day_Date_id_32", type: "date", showIf: { Period_id_32: "Day" } },
        { name: "Year", key: "Week_Year_id_32", type: "dropdown", options: getLastFiveYears(), showIf: { Period_id_32: "Week" } },
        { name: "Month", key: "Week_Month_id_32", type: "dropdown", options: getMonths(), showIf: { Period_id_32: "Week" } },
        { name: "Week", key: "Week_id_32", type: "dropdown", options: ["Week 1", "Week 2", "Week 3", "Week 4"], showIf: { Period_id_32: "Week" } },
        { name: "Year", key: "Fortnight_Year_id_32", type: "dropdown", options: getLastFiveYears(), showIf: { Period_id_32: "Fortnight" } },
        { name: "Month", key: "Fortnight_Month_id_32", type: "dropdown", options: getMonths(), showIf: { Period_id_32: "Fortnight" } },
        { name: "Fortnight", key: "Fortnight_id_32", type: "dropdown", options: ["1st Half", "2nd Half"], showIf: { Period_id_32: "Fortnight" } },
        { name: "Year", key: "Month_Year_id_32", type: "dropdown", options: getLastFiveYears(), showIf: { Period_id_32: "Month" } },
        { name: "Month", key: "Month_id_32", type: "dropdown", options: getMonths(), showIf: { Period_id_32: "Month" } },
        { name: "Year", key: "Quarter_Year_id_32", type: "dropdown", options: getLastFiveYears(), showIf: { Period_id_32: "Quarter" } },
        { name: "Quarter", key: "Quarter_id_32", type: "dropdown", options: getQuarters(), showIf: { Period_id_32: "Quarter" } },
        { name: "Year", key: "Year_id_32", type: "dropdown", options: getLastFiveYears(), showIf: { Period_id_32: "Year" } },
        { name: "From Date", key: "Other_FromDate_id_32", type: "date", showIf: { Period_id_32: "Other" } },
        { name: "To Date", key: "Other_ToDate_id_32", type: "date", showIf: { Period_id_32: "Other" } },
      ],
    },
    {
      id: 31,
      fields: [
        { name: "Frequency", key: "Payroll_Frequency_id_31", type: "dropdown", options: ["Weekly", "Fortnightly", "Monthly", "Quarterly", "Yearly"] },
        { name: "Year", key: "Payroll_Week_Year_id_31", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_31: "Weekly" } },
        { name: "Month", key: "Payroll_Week_Month_id_31", type: "dropdown", options: getMonths(), showIf: { Payroll_Frequency_id_31: "Weekly" } },
        { name: "Week", key: "Payroll_Week_id_31", type: "dropdown", options: ["Week 1", "Week 2", "Week 3", "Week 4"], showIf: { Payroll_Frequency_id_31: "Weekly" } },
        { name: "Year", key: "Payroll_Fortnight_Year_id_31", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_31: "Fortnightly" } },
        { name: "Month", key: "Payroll_Fortnight_Month_id_31", type: "dropdown", options: getMonths(), showIf: { Payroll_Frequency_id_31: "Fortnightly" } },
        { name: "Fortnight", key: "Payroll_Fortnight_id_31", type: "dropdown", options: ["1st Half", "2nd Half"], showIf: { Payroll_Frequency_id_31: "Fortnightly" } },
        { name: "Year", key: "Payroll_Month_Year_id_31", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_31: "Monthly" } },
        { name: "Month", key: "Payroll_Month_id_31", type: "dropdown", options: getMonths(), showIf: { Payroll_Frequency_id_31: "Monthly" } },
        { name: "Year", key: "Payroll_Quarter_Year_id_31", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_31: "Quarterly" } },
        { name: "Quarter", key: "Payroll_Quarter_id_31", type: "dropdown", options: getQuarters(), showIf: { Payroll_Frequency_id_31: "Quarterly" } },
        { name: "Year", key: "Payroll_Year_id_31", type: "dropdown", options: getLastFiveYears(), showIf: { Payroll_Frequency_id_31: "Yearly" } },
      ],
    },
    {
      id: 27,
      fields: [
        { name: "Year Ending", key: "Audit_Year_Ending_id_27", type: "date" },
      ],
    },
    {
      id: 8,
      fields: [
        { name: "Filing Frequency", key: "Filing_Frequency_id_8", type: "dropdown", options: ["Monthly", "Quarterly", "Yearly"] },
        { name: "Period Ending Date", key: "Period_Ending_Date_id_8", type: "date", showIf: { Filing_Frequency_id_8: ["Monthly", "Quarterly", "Yearly"] } },
        { name: "Filing Date", key: "Filing_Date_id_8", type: "date", showIf: { Filing_Frequency_id_8: ["Monthly", "Quarterly", "Yearly"] } },
      ],
    },
    {
      id: 28,
      fields: [
        { name: "Year", key: "Year_id_28", type: "dropdown", options: getLastFiveYears() },
      ],
    }
  ];

  const serviceOptions = [
    { value: '', label: 'Select Service' },
    ...(AllJobData?.data?.services || []).map((service) => ({
      value: service.service_id,
      label: service.service_name
    }))
  ];

  const jobTypeOptions = [
    { value: '', label: 'Select Job Type' },
    ...(get_Job_Type?.data || []).map((jobtype) => ({
      value: jobtype.id,
      label: jobtype.type
    }))
  ];

  const reviewerOptions = [
    { value: '', label: 'Select Reviewer' },
    ...(AllJobData?.data?.reviewer || []).map((reviewer) => ({
      value: reviewer.reviewer_id,
      label: `${reviewer.reviewer_name} (${reviewer?.reviewer_email})`
    }))
  ];

  const allocatedStaffOptions = [
    { value: '', label: 'Select Staff' },
    ...(AllJobData?.data?.allocated || []).map((staff) => ({
      value: staff.allocated_id,
      label: `${staff.allocated_name} (${staff.allocated_email})`
    }))
  ];

  const customerAccountManagerOptions = [
    { value: '', label: 'Select Customer Account Manager' },
    ...(AllJobData?.data?.customer_account_manager || []).map((manager) => ({
      value: manager.customer_account_manager_officer_id,
      label: manager.customer_account_manager_officer_name
    }))
  ];

  const clientOptions = [
    { value: '', label: 'Select Client' },
    ...(AllJobData?.data?.client || []).map((client) => ({
      value: client.client_id,
      label: client.client_trading_name
    }))
  ];

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header step-header-blue d-flex align-items-center">
              <button
                type="button"
                className="btn p-0"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={16} />
              </button>
              <h3 className="card-title mb-0 ms-2">Create New Job</h3>
            </div>

            <div className="card-body form-steps">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card card_shadow">
                    <div className="card-header card-header-light-blue align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1 fs-16">Job Information</h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Account Manager <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            disabled
                            value={jobData.AccountManager}
                          />
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Customer <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            disabled
                            value={jobData.Customer}
                          />
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Client <span className="text-danger">*</span></label>
                          <Select
                            options={clientOptions}
                            value={clientOptions.find(opt => String(opt.value) === String(jobData.Client))}
                            onChange={(opt) => HandleChange({ target: { name: "Client", value: opt.value } })}
                            className={errors["Client"] ? "error-field" : ""}
                          />
                          {errors["Client"] && <div className="error-text">{errors["Client"]}</div>}
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Client Job Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="ClientJobCode"
                            value={jobData.ClientJobCode}
                            onChange={HandleChange}
                          />
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Customer Account Manager <span className="text-danger">*</span></label>
                          <Select
                            options={customerAccountManagerOptions}
                            value={customerAccountManagerOptions.find(opt => String(opt.value) === String(jobData.CustomerAccountManager))}
                            onChange={(opt) => HandleChange({ target: { name: "CustomerAccountManager", value: opt.value } })}
                            className={errors["CustomerAccountManager"] ? "error-field" : ""}
                          />
                          {errors["CustomerAccountManager"] && <div className="error-text">{errors["CustomerAccountManager"]}</div>}
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Service <span className="text-danger">*</span></label>
                          <Select
                            options={serviceOptions}
                            value={serviceOptions.find(opt => String(opt.value) === String(jobData.Service))}
                            onChange={(opt) => HandleChange({ target: { name: "Service", value: opt.value } })}
                            className={errors["Service"] ? "error-field" : ""}
                            isDisabled={!jobData.Client}
                          />
                          {errors["Service"] && <div className="error-text">{errors["Service"]}</div>}
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Job Type <span className="text-danger">*</span></label>
                          <Select
                            options={jobTypeOptions}
                            value={jobTypeOptions.find(opt => String(opt.value) === String(jobData.JobType))}
                            onChange={(opt) => {
                              HandleChange({ target: { name: "JobType", value: opt.value } });
                              openJobModal({ target: { value: opt.value } });
                            }}
                            className={errors["JobType"] ? "error-field" : ""}
                          />
                          {errors["JobType"] && <div className="error-text">{errors["JobType"]}</div>}
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Budgeted Time</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="H"
                              value={budgetedHours.hours}
                              onChange={(e) => setBudgetedHours({ ...budgetedHours, hours: e.target.value })}
                            />
                            <span className="input-group-text">H</span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="M"
                              value={budgetedHours.minutes}
                              onChange={(e) => setBudgetedHours({ ...budgetedHours, minutes: Math.min(59, Math.max(0, e.target.value)) })}
                            />
                            <span className="input-group-text">M</span>
                          </div>
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Reviewer</label>
                          <Select
                            options={reviewerOptions}
                            value={reviewerOptions.find(opt => String(opt.value) === String(jobData.Reviewer))}
                            onChange={(opt) => HandleChange({ target: { name: "Reviewer", value: opt.value } })}
                          />
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Allocated To</label>
                          <Select
                            options={allocatedStaffOptions}
                            value={allocatedStaffOptions.find(opt => String(opt.value) === String(jobData.AllocatedTo))}
                            onChange={(opt) => HandleChange({ target: { name: "AllocatedTo", value: opt.value } })}
                          />
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Allocated On</label>
                          <input
                            type="date"
                            className="form-control"
                            name="AllocatedOn"
                            value={jobData.AllocatedOn}
                            onChange={HandleChange}
                          />
                        </div>
                        <div className="mb-3 col-lg-4">
                          <label className="form-label">Date Received On <span className="text-danger">*</span></label>
                          <input
                            type="date"
                            className="form-control"
                            name="DateReceivedOn"
                            value={jobData.DateReceivedOn}
                            onChange={HandleChange}
                          />
                          {errors["DateReceivedOn"] && <div className="error-text">{errors["DateReceivedOn"]}</div>}
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Preparation Time</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="H"
                              value={PreparationTimne.hours}
                              onChange={(e) => setPreparationTimne({ ...PreparationTimne, hours: e.target.value })}
                            />
                            <span className="input-group-text">H</span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="M"
                              value={PreparationTimne.minutes}
                              onChange={(e) => setPreparationTimne({ ...PreparationTimne, minutes: Math.min(59, Math.max(0, e.target.value)) })}
                            />
                            <span className="input-group-text">M</span>
                          </div>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Review Time</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="H"
                              value={reviewTime.hours}
                              onChange={(e) => setReviewTime({ ...reviewTime, hours: e.target.value })}
                            />
                            <span className="input-group-text">H</span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="M"
                              value={reviewTime.minutes}
                              onChange={(e) => setReviewTime({ ...reviewTime, minutes: Math.min(59, Math.max(0, e.target.value)) })}
                            />
                            <span className="input-group-text">M</span>
                          </div>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Feedback Incorporation Time</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="H"
                              value={FeedbackIncorporationTime.hours}
                              onChange={(e) => setFeedbackIncorporationTime({ ...FeedbackIncorporationTime, hours: e.target.value })}
                            />
                            <span className="input-group-text">H</span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="M"
                              value={FeedbackIncorporationTime.minutes}
                              onChange={(e) => setFeedbackIncorporationTime({ ...FeedbackIncorporationTime, minutes: Math.min(59, Math.max(0, e.target.value)) })}
                            />
                            <span className="input-group-text">M</span>
                          </div>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Total Time</label>
                          <div className="input-group">
                            <input type="text" className="form-control" disabled value={Totaltime.hours} />
                            <span className="input-group-text">H</span>
                            <input type="text" className="form-control" disabled value={Totaltime.minutes} />
                            <span className="input-group-text">M</span>
                          </div>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Engagement Model</label>
                          <select
                            className="form-select"
                            name="EngagementModel"
                            value={jobData.EngagementModel}
                            onChange={HandleChange}
                          >
                            <option value="">Select Engagement Model</option>
                            {Object.keys(filteredData).map((key, index) => (
                              <option key={key} value={key}>{RearrangeEngagementOptionArr[index]}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Allocated to (Other)</label>
                          <Select
                            options={allStaffData.map(s => ({ label: s.full_name, value: s.id }))}
                            isMulti
                            value={selectedStaffData}
                            onChange={setSelectedStaffData}
                            placeholder="Select options"
                          />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Job Priority</label>
                          <select className="form-select" name="job_priority" value={jobData.job_priority} onChange={HandleChange}>
                            <option value="normal">Normal</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Processing Checklist</label>
                          <select
                            className="form-select"
                            name="processing_checklist"
                            value={jobData.processing_checklist || ""}
                            onChange={HandleChange}
                          >
                            <option value="">-- Select --</option>
                            <option value="0">Not Required</option>
                            {AllJobData?.data?.processing_checklist_data
                              ?.filter(item => {
                                const serviceIds = item.service_id?.split(",").map(Number) || [];
                                const jobTypeIds = item.job_type_id?.split(",").map(Number) || [];
                                return serviceIds.includes(Number(jobData.Service)) && jobTypeIds.includes(Number(jobData.JobType));
                              })
                              .map(item => <option key={item.id} value={item.id}>{item.check_list_name}</option>)
                            }
                          </select>
                          {jobData.processing_checklist && jobData.processing_checklist !== "0" && (
                            <button
                              type="button"
                              className="btn btn-link p-0 fs-12 text-primary mt-1"
                              onClick={() => {
                                const selected = AllJobData?.data?.processing_checklist_data?.find(i => Number(i.id) === Number(jobData.processing_checklist));
                                handleViewChecklist(selected.id, selected.check_list_name, "processing");
                              }}
                            >
                              <ExternalLink size={12} className="me-1" /> Fill checklist
                            </button>
                          )}
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Reviewing Checklist</label>
                          <select
                            className="form-select"
                            name="reviewing_checklist"
                            value={jobData.reviewing_checklist || ""}
                            onChange={HandleChange}
                          >
                            <option value="">-- Select --</option>
                            <option value="0">Not Required</option>
                            {AllJobData?.data?.reviewing_checklist_data
                              ?.filter(item => {
                                const serviceIds = item.service_id?.split(",").map(Number) || [];
                                const jobTypeIds = item.job_type_id?.split(",").map(Number) || [];
                                return serviceIds.includes(Number(jobData.Service)) && jobTypeIds.includes(Number(jobData.JobType));
                              })
                              .map(item => <option key={item.id} value={item.id}>{item.check_list_name}</option>)
                            }
                          </select>
                          {jobData.reviewing_checklist && jobData.reviewing_checklist !== "0" && (
                            <button
                              type="button"
                              className="btn btn-link p-0 fs-12 text-primary mt-1"
                              onClick={() => {
                                const selected = AllJobData?.data?.reviewing_checklist_data?.find(i => Number(i.id) === Number(jobData.reviewing_checklist));
                                handleViewChecklist(selected.id, selected.check_list_name, "reviewing");
                              }}
                            >
                              <ExternalLink size={12} className="me-1" /> Fill checklist
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Service Fields Section */}
                {serviceFields.find(s => s.id === Number(jobData.Service))?.fields.length > 0 && (
                  <div className="col-lg-12">
                    <div className="card card_shadow">
                      <div className="card-header card-header-light-blue">
                        <h4 className="card-title mb-0 fs-16">Other Data</h4>
                      </div>
                      <div className="card-body">
                        <div className="row mt-3">
                          {serviceFields.find(s => s.id === Number(jobData.Service))?.fields.map((field, idx) => {
                            if (!shouldShowField(field, jobData)) return null;
                            return (
                              <div className="col-lg-4 mb-3" key={idx}>
                                <label className="form-label">{field.name}</label>
                                {field.type === "dropdown" ? (
                                  <select
                                    className="form-select"
                                    name={field.key}
                                    value={jobData[field.key] || ""}
                                    onChange={HandleChange}
                                  >
                                    <option value="">-- Select --</option>
                                    {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                                  </select>
                                ) : (
                                  <input
                                    type={field.type || "text"}
                                    className="form-control"
                                    name={field.key}
                                    value={jobData[field.key] || ""}
                                    onChange={HandleChange}
                                    min={field.min}
                                    max={field.max}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deadline Section */}
                <div className="col-lg-12">
                  <div className="card card_shadow">
                    <div className="card-header card-header-light-blue">
                      <h4 className="card-title mb-0 fs-16">Deadline</h4>
                    </div>
                    <div className="card-body">
                      <div className="row mt-3">
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Expected Delivery Date</label>
                          <input type="date" className="form-control" name="ExpectedDeliveryDate" value={jobData.ExpectedDeliveryDate} onChange={HandleChange} />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Due On</label>
                          <input type="date" className="form-control" name="DueOn" value={jobData.DueOn} onChange={HandleChange} />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Submission Deadline</label>
                          <input type="date" className="form-control" name="SubmissionDeadline" value={jobData.SubmissionDeadline} onChange={HandleChange} />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Customer Deadline Date</label>
                          <input type="date" className="form-control" name="CustomerDeadlineDate" value={jobData.CustomerDeadlineDate} onChange={HandleChange} />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">SLA Deadline Date</label>
                          <input type="date" className="form-control" name="SLADeadlineDate" value={jobData.SLADeadlineDate} onChange={HandleChange} />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Internal Deadline Date</label>
                          <input type="date" className="form-control" name="InternalDeadlineDate" value={jobData.InternalDeadlineDate} onChange={HandleChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Task Section */}
                <div className="col-lg-12">
                  <div className="card card_shadow">
                    <div className="card-header card-header-light-blue">
                      <h4 className="card-title mb-0 fs-16">Other Task</h4>
                    </div>
                    <div className="card-body">
                      <div className="row mt-3">
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Filing With Companies House Required?</label>
                          <select className="form-select" name="FilingWithCompaniesHouseRequired" value={jobData.FilingWithCompaniesHouseRequired} onChange={HandleChange}>
                            <option value="">Please Select</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Companies House Filing Date</label>
                          <input type="date" className="form-control" name="CompaniesHouseFilingDate" value={jobData.CompaniesHouseFilingDate} onChange={HandleChange} />
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">Filing with HMRC Required?</label>
                          <select className="form-select" name="FilingWithHMRCRequired" value={jobData.FilingWithHMRCRequired} onChange={HandleChange}>
                            <option value="">Please Select</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                          </select>
                        </div>
                        <div className="col-lg-4 mb-3">
                          <label className="form-label">HMRC Filing Date</label>
                          <input type="date" className="form-control" name="HMRCFilingDate" value={jobData.HMRCFilingDate} onChange={HandleChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 text-end mb-4">
                  <button type="button" className="btn btn-light me-2" onClick={() => navigate(-1)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Create Job</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Modal */}
      <Modal show={checklistModal.show} onHide={() => setChecklistModal(prev => ({ ...prev, show: false }))} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{checklistModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checklistModal.loading ? (
            <div className="text-center p-5">Loading tasks...</div>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Task Name</th>
                  <th>Status</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {checklistModal.data.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.task_name}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={task.status}
                        onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="n/a">N/A</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Remark"
                        value={task.remark}
                        onChange={(e) => handleTaskRemarkChange(task.id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setChecklistModal(prev => ({ ...prev, show: false }))}>Close</Button>
          <Button variant="primary" onClick={handleSubmitChecklist}>Save Checklist</Button>
        </Modal.Footer>
      </Modal>

      {/* Tasks Modal (triggered by Job Type selection) */}
      <Modal show={jobModalStatus} onHide={() => jobModalSetStatus(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tasks for Job Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Budgeted Time (H:M)</th>
              </tr>
            </thead>
            <tbody>
              {AddTaskArr.map((task, index) => (
                <tr key={index}>
                  <td>{task.task_name}</td>
                  <td>{task.budgeted_hour}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => jobModalSetStatus(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateJob;

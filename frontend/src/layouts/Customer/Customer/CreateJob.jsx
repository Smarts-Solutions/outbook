import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GetAllJabData,
  AddAllJobType,
  GET_ALL_CHECKLIST,
  GetOfficerDetails,
  JobType,
  DownloadChecklist
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import * as XLSX from "xlsx";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { ScrollToViewFirstError } from "../../../Utils/Comman_function";
import { CreateJobErrorMessage } from "../../../Utils/Common_Message";
import Select from 'react-select';
import { Save, Plus, ArrowLeft, X, ExternalLink, RotateCcw } from "lucide-react";

const CreateJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const staffCreatedId = staffDetails ? staffDetails.id : "";

  const [AllJobData, setAllJobData] = useState({ loading: false, data: [] });
  const [get_Job_Type, setJob_Type] = useState({ loading: false, data: [] });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [PreparationTimne, setPreparationTimne] = useState({ hours: "", minutes: "" });
  const [FeedbackIncorporationTime, setFeedbackIncorporationTime] = useState({ hours: "", minutes: "" });
  const [reviewTime, setReviewTime] = useState({ hours: "", minutes: "" });
  const [budgetedHours, setBudgetedHours] = useState({ hours: "", minutes: "" });
  const [invoiceTime, setInvoiceTime] = useState({ hours: "", minutes: "" });
  const [AllChecklistData, setAllChecklistData] = useState({ loading: false, data: [] });
  const [getChecklistId, setChecklistId] = useState("");
  const [AddTaskArr, setAddTaskArr] = useState([]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskNameError, setTaskNameError] = useState("");
  const [jobModalStatus, jobModalSetStatus] = useState(false);
  const [BudgetedHoursAddTask, setBudgetedHoursAddTask] = useState({ hours: "", minutes: "" });
  const [BudgetedHoureError, setBudgetedHourError] = useState("");
  const [BudgetedMinuteError, setBudgetedMinuteError] = useState("");
  const [Totaltime, setTotalTime] = useState({ hours: "", minutes: "" });

  const [checklistModal, setChecklistModal] = useState({
    show: false,
    data: [],
    title: "",
    loading: false,
    type: "",
    processing: [],
    reviewing: []
  });

  const [serviceFieldsData, setServiceFieldsData] = useState([]);
  const [allStaffData, setAllStaffData] = useState([]);
  const [selectedStaffData, setSelectedStaffData] = useState([]);
  const [allClientDetails, setAllClientDetails] = useState([]);
  const [clientInfoCompanyDetails, setClientInfoCompanyDetails] = useState({});
  const [clientType, setClientType] = useState("");

  const [jobData, setJobData] = useState({
    CustomerDetails: [],
    AccountManager: "",
    Customer: "",
    Client: "",
    client_id: "",
    ClientJobCode: "",
    CustomerAccountManager: "",
    Service: "",
    JobType: "",
    BudgetedHours: "",
    Reviewer: "",
    AllocatedTo: "",
    AllocatedOn: "",
    DateReceivedOn: new Date().toISOString().split("T")[0],
    YearEnd: "",
    TotalPreparationTime: "",
    ReviewTime: "",
    FeedbackIncorporationTime: "",
    TotalTime: "",
    EngagementModel: "",
    ExpectedDeliveryDate: null,
    DueOn: null,
    SubmissionDeadline: null,
    CustomerDeadlineDate: null,
    SLADeadlineDate: null,
    InternalDeadlineDate: null,
    FilingWithCompaniesHouseRequired: "0",
    CompaniesHouseFilingDate: null,
    FilingWithHMRCRequired: "0",
    HMRCFilingDate: null,
    OpeningBalanceAdjustmentRequired: "0",
    OpeningBalanceAdjustmentDate: null,
    NumberOfTransactions: "",
    NumberOfTrialBalanceItems: "",
    Turnover: "",
    NoOfEmployees: "",
    VATReconciliation: "0",
    Bookkeeping: "0",
    ProcessingType: "0",
    Invoiced: "0",
    Currency: "0",
    InvoiceValue: "0",
    InvoiceDate: null,
    InvoiceHours: "",
    InvoiceRemark: "",
    notes: "",
    job_priority: "normal",
    Bookkeeping_Frequency_id_2: "Daily",
    processing_checklist: null,
    reviewing_checklist: null
  });

  useEffect(() => {
    setJobData((prevState) => ({
      ...prevState,
      AccountManager: AllJobData?.data?.Manager?.[0]?.manager_name || "",
      Customer: AllJobData?.data?.customer?.customer_trading_name || "",
      CustomerDetails: AllJobData?.data?.customerDetails || [],
      Client: location?.state?.goto == "Customer" ? "" : location?.state?.clientName?.client_name || "",
      client_id: location?.state?.goto == "Customer" ? "" : location?.state?.clientName?.id || "",
    }));
  }, [AllJobData]);

  const GetJobData = async () => {
    const req = { customer_id: location.state.customer_id };
    const data = { req: req, authToken: token };
    await dispatch(GetAllJabData(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setAllJobData({ loading: true, data: response.data });
          setJobData((prevState) => ({
            ...prevState,
            Service: response.data?.services?.[0]?.service_id || "",
            CustomerAccountManager: response.data?.customer_account_manager?.[0]?.customer_account_manager_officer_id?.toString() || "",
            EngagementModel: Object.entries(response.data?.engagement_model[0] || {}).find(([key, value]) => value === "1")?.[0] || "",
          }));
          setAllStaffData(response?.data?.allStaff || []);
          setAllClientDetails(response?.data?.client || []);

          if (location?.state?.goto != "Customer") {
            const clientInfo = response?.data?.client?.find((client) => Number(client?.client_id) == Number(location.state?.clientName?.id)) || "";
            setClientType(clientInfo?.client_client_type || "");
            if (clientInfo != "" && clientInfo?.client_company_number != undefined && clientInfo?.client_client_type == "2") {
              if (response.data?.services?.[0]?.service_id == 1) {
                await get_information_company_number(clientInfo?.client_company_number, response.data?.services?.[0]?.service_id);
              } else if ([4, 8].includes(Number(response.data?.services?.[0]?.service_id))) {
                await dueOn_date_set(clientInfo?.client_client_type, response.data?.services?.[0]?.service_id);
              }
            } else if (clientInfo != "" && ["5"].includes(clientInfo?.client_client_type)) {
              if (response.data?.services?.[0]?.service_id == 1) {
                await get_information_company_number(clientInfo?.company_number, response.data?.services?.[0]?.service_id);
              } else if ([4, 8].includes(Number(response.data?.services?.[0]?.service_id))) {
                await dueOn_date_set(clientInfo?.client_client_type, response.data?.services?.[0]?.service_id);
              }
            } else if (clientInfo != "" && ["1", "3", "7"].includes(clientInfo?.client_client_type)) {
              await dueOn_date_set(clientInfo?.client_client_type, response.data?.services?.[0]?.service_id);
            } else if ([1, 4, 8].includes(Number(response.data?.services?.[0]?.service_id))) {
              await dueOn_date_set(clientInfo?.client_client_type, response.data?.services?.[0]?.service_id);
            }
          }
        } else {
          setAllJobData({ loading: true, data: [] });
          setAllStaffData([]);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    GetJobData();
  }, []);

  const get_information_company_number = async (company_number, service_id) => {
    const data = { company_number: company_number, type: 'company_info' };
    await dispatch(GetOfficerDetails(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setClientInfoCompanyDetails(res.data);
          if (!['', null, undefined].includes(service_id) && Number(service_id) == 1) {
            setJobData((prevState) => ({
              ...prevState,
              Year_Ending_id_1: res.data?.accounts?.next_accounts?.period_end_on,
              DueOn: res.data?.accounts?.next_accounts?.due_on,
            }));
          }
        } else {
          setClientInfoCompanyDetails({});
        }
      })
      .catch(() => {});
  };

  const dueOn_date_set = async (client_type, service_id) => {
    let due_date = getDueDate(client_type, service_id);
    due_date = ['', null, undefined].includes(due_date) ? null : due_date;
    setJobData((prevState) => ({
      ...prevState,
      DueOn: due_date,
    }));
  };

  function getDueDate(client_type, service_id) {
    if (["1", "3", "7"].includes(client_type)) {
      if (Number(service_id) === 1) {
        const d = new Date();
        const year = d.getFullYear();
        let dueYear = year;
        if (d > new Date(`${year}-01-31`)) { dueYear = year + 1; }
        return `${dueYear}-01-31`;
      } else if (Number(service_id) === 4) {
        const d = new Date();
        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        if (m >= 4 || m <= 1) { return `${m >= 4 ? y + 1 : y}-01-31`; }
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
      } else { return null; }
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
        if (m >= 4 || m <= 1) { return `${m >= 4 ? y + 1 : y}-01-31`; }
        return `${y}-01-31`;
      } else { return null; }
    }
  }

  const getAllChecklist = async () => {
    if (
      (location?.state?.goto == "Customer" ? jobData.Client : location?.state?.clientName?.id) &&
      jobData?.Service &&
      AllJobData?.data?.customer?.customer_id &&
      jobData?.JobType
    ) {
      const req = {
        action: "getByServiceWithJobType",
        service_id: jobData.Service,
        customer_id: AllJobData?.data?.customer?.customer_id,
        job_type_id: jobData.JobType,
        clientId: location?.state?.goto == "Customer" ? Number(jobData.Client) : location?.state?.clientName?.id,
      };
      const data = { req: req, authToken: token };
      await dispatch(GET_ALL_CHECKLIST(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            setAllChecklistData({ loading: true, data: response.data || [] });
          } else {
            setAllChecklistData({ loading: true, data: [] });
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    getAllChecklist();
  }, [jobData.JobType, AllJobData?.data]);

  const GetJobType = async () => {
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

  const HandleChange = async (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name == 'Client') {
      const clientInfo = allClientDetails?.find((client) => Number(client?.client_id) == Number(value)) || "";
      setClientType(clientInfo?.client_client_type || "");
      if (clientInfo != "" && clientInfo?.client_company_number != undefined && clientInfo?.client_client_type == "2") {
        if (Number(jobData?.Service) == 1) {
          await get_information_company_number(clientInfo?.client_company_number, jobData?.Service);
        } else if ([4, 8].includes(Number(jobData?.Service))) {
          await dueOn_date_set(clientInfo?.client_client_type, jobData?.Service);
        }
      } else if (clientInfo != "" && ["5"].includes(clientInfo?.client_client_type)) {
        if (Number(jobData?.Service) == 1) {
          await get_information_company_number(clientInfo?.company_number, jobData?.Service);
        } else if ([4, 8].includes(Number(jobData?.Service))) {
          await dueOn_date_set(clientInfo?.client_client_type, jobData?.Service);
        }
      } else if (["1", "3", "7"].includes(clientInfo?.client_client_type)) {
        dueOn_date_set(clientInfo?.client_client_type, jobData?.Service);
      } else if ([1, 4, 8].includes(Number(jobData?.Service))) {
        dueOn_date_set(clientType, jobData?.Service);
      }
    }

    if (name === "JobType") {
      if (!['', 'undefined', undefined, null, 'null'].includes(jobData.JobType) && Number(jobData.JobType) === Number(value) && AddTaskArr.length > 0) {
      } else {
        setAddTaskArr([]);
      }
    }

    const date = new Date();
    if (name == "Service") {
      if ([1, 2, 3, 4, 8].includes(Number(value))) {
        if (value == 1) {
          const clientInfo = allClientDetails?.find((client) => Number(client?.client_id) == Number(jobData.client_id)) || "";
          if (clientInfo != "" && clientInfo?.client_company_number != undefined && clientInfo?.client_client_type == "2") {
            await get_information_company_number(clientInfo?.client_company_number, value);
          } else if (clientInfo != "" && ["5"].includes(clientInfo?.client_client_type)) {
            await get_information_company_number(clientInfo?.company_number, value);
          } else {
            await dueOn_date_set(clientType, value);
          }
          date.setDate(date.getDate() + 28);
          setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
        } else {
          setJobData((prevState) => ({ ...prevState, Year_Ending_id_1: null, DueOn: null }));
        }

        if (value == 2) {
          date.setDate(date.getDate() + 1);
          setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
        } else if (value == 3) {
          date.setDate(date.getDate() + 5);
          setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
        } else if (value == 4) {
          await dueOn_date_set(clientType, value);
          date.setDate(date.getDate() + 5);
          setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
        } else if (value == 8) {
          await dueOn_date_set(clientType, value);
          date.setDate(date.getDate() + 10);
          setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
        }
      } else {
        setJobData((prevState) => ({ ...prevState, SLADeadlineDate: null }));
      }
    }

    if (jobData.Service == 2 && name == "Bookkeeping_Frequency_id_2") {
      if (value == "Daily") {
        date.setDate(date.getDate() + 1);
        setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
      } else if (value == "Weekly") {
        date.setDate(date.getDate() + 3);
        setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
      } else if (value == "Monthly") {
        date.setDate(date.getDate() + 10);
        setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
      } else if (value == "Quarterly") {
        date.setDate(date.getDate() + 15);
        setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
      } else if (value == "Yearly") {
        date.setDate(date.getDate() + 30);
        setJobData((prevState) => ({ ...prevState, SLADeadlineDate: date.toISOString().split("T")[0] }));
      }
    }

    if (["NumberOfTransactions", "NumberOfTrialBalanceItems", "Turnover"].includes(name)) {
      if (!/^[0-9+]*$/.test(value)) { return; }
    }
    if (["BudgetedHours", "TotalPreparationTime", "ReviewTime", "FeedbackIncorporationTime"].includes(name)) {
      value = value.replace(":", "");
    }

    setJobData((prevState) => ({ ...prevState, [name]: value }));
    validate(name, value);
  };

  const validate = (name, value, isSubmitting = false) => {
    const newErrors = { ...errors };
    if (isSubmitting) {
      for (const key in CreateJobErrorMessage) {
        if (!jobData[key] && !["NumberOfTransactions", "NumberOfTrialBalanceItems", "Turnover"].includes(key)) {
          newErrors[key] = CreateJobErrorMessage[key];
        }
      }
    } else {
      if (!value && !["NumberOfTransactions", "NumberOfTrialBalanceItems", "Turnover"].includes(name)) {
        if (CreateJobErrorMessage[name]) { newErrors[name] = CreateJobErrorMessage[name]; }
      } else if (name == "NumberOfTransactions" && value > 1000000) {
        newErrors[name] = CreateJobErrorMessage[name];
      } else if (name == "NumberOfTrialBalanceItems" && value > 5000) {
        newErrors[name] = CreateJobErrorMessage[name];
      } else if (name == "Turnover" && value > 200000000) {
        newErrors[name] = CreateJobErrorMessage[name];
      } else {
        delete newErrors[name];
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    let isValid = true;
    for (const key in CreateJobErrorMessage) {
       if (!validate(key, jobData[key], true)) { isValid = false; }
    }
    return isValid;
  };

  function formatTime(hours, minutes) {
    const formattedHours = (hours != "" && hours != null) ? String(hours).padStart(2, "0") : "00";
    const formattedMinutes = (minutes != "" && minutes != null) ? String(minutes).padStart(2, "0") : "00";
    return `${formattedHours}:${formattedMinutes}`;
  }

  const budgeted_hour_totalTime = AddTaskArr.length > 0 ? AddTaskArr.reduce((acc, task) => {
    const [hours, minutes] = (task?.budgeted_hour || "0:0").split(":").map(Number);
    acc.hours += hours;
    acc.minutes += minutes;
    if (acc.minutes >= 60) {
      acc.hours += Math.floor(acc.minutes / 60);
      acc.minutes = acc.minutes % 60;
    }
    return acc;
  }, { hours: 0, minutes: 0 }) : { hours: 0, minutes: 0 };

  useEffect(() => {
    setBudgetedHours({
      hours: budgeted_hour_totalTime.hours || "0",
      minutes: budgeted_hour_totalTime.minutes || "0",
    });
  }, [AddTaskArr]);

  const handleSubmit = async () => {
    if (!validateAllFields()) {
        ScrollToViewFirstError(errors);
        return;
    }

    if (AddTaskArr.length === 0) {
      sweatalert.fire({ icon: "error", title: "Please add at least one task.", timer: 1500 });
      return;
    }

    let checklist_modal_data = null;
    let processing_checklist_status = "2";
    let reviewing_checklist_status = "2";

    if (Array.isArray(checklistModal?.processing) && checklistModal?.processing?.length) {
      checklist_modal_data = JSON.stringify(checklistModal);
      let isNotChecked = checklistModal?.processing?.find(val => val.answer == "");
      processing_checklist_status = isNotChecked ? "2" : "1";
    }

    if (Array.isArray(checklistModal?.reviewing) && checklistModal?.reviewing?.length) {
      checklist_modal_data = JSON.stringify(checklistModal);
      let isNotChecked = checklistModal?.reviewing?.find(val => val.answer == "");
      reviewing_checklist_status = isNotChecked ? "2" : "1";
    }

    if (["", null, undefined, 0].includes(jobData?.processing_checklist)) { processing_checklist_status = "0"; }
    if (["", null, undefined, 0].includes(jobData?.reviewing_checklist)) { reviewing_checklist_status = "0"; }

    const totalHours = Number(PreparationTimne.hours) * 60 + Number(PreparationTimne.minutes) +
      Number(reviewTime.hours) * 60 + Number(reviewTime.minutes) +
      Number(FeedbackIncorporationTime.hours) * 60 + Number(FeedbackIncorporationTime.minutes);

    const req = {
      ...jobData,
      customer_id: AllJobData?.data?.customer?.customer_id,
      client_id: location?.state?.goto == "Customer" ? Number(jobData.Client) : location?.state?.clientName?.id,
      client_job_code: jobData.ClientJobCode,
      customer_contact_details_id: Number(jobData.CustomerAccountManager),
      service_id: Number(jobData.Service),
      job_type_id: Number(jobData.JobType),
      budgeted_hours: formatTime(budgetedHours.hours, budgetedHours.minutes),
      reviewer: Number(jobData.Reviewer),
      allocated_to: Number(jobData.AllocatedTo),
      allocated_on: jobData.AllocatedOn || new Date().toISOString().split("T")[0],
      date_received_on: jobData.DateReceivedOn || new Date().toISOString().split("T")[0],
      year_end: jobData.YearEnd,
      total_preparation_time: formatTime(PreparationTimne.hours, PreparationTimne.minutes),
      review_time: formatTime(reviewTime.hours, reviewTime.minutes),
      feedback_incorporation_time: formatTime(FeedbackIncorporationTime.hours, FeedbackIncorporationTime.minutes),
      total_time: formatTime(Math.floor(totalHours / 60), totalHours % 60),
      staff_created_id: staffCreatedId,
      other_staff: selectedStaffData?.map((data) => data.value).join(","),
      tasks: { checklist_id: getChecklistId, task: AddTaskArr },
      processing_checklist_status: processing_checklist_status,
      reviewing_checklist_status: reviewing_checklist_status,
      checklist_modal_data: checklist_modal_data,
    };

    const data = { req: req, authToken: token };
    setIsSubmitted(true);
    await dispatch(AddAllJobType(data)).unwrap().then((response) => {
      if (response.status) {
        sweatalert.fire({ icon: "success", title: "Job Created Successfully", timer: 1500 });
        navigate(-1);
      } else {
        sweatalert.fire({ icon: "error", title: response.message || "Error creating job" });
      }
    }).catch(() => {});
  };

  const getLastFiveYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());
  };

  const getMonths = () => [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getQuarters = () => ["Q1", "Q2", "Q3", "Q4"];

  const matchesCondition = (expected, actual) => {
    if (Array.isArray(expected)) return expected.map(String).includes(String(actual));
    return String(expected) === String(actual);
  };

  const shouldShowField = (field, values) => {
    if (!field.showIf) return true;
    return Object.entries(field.showIf).every(([depKey, depVal]) => {
      return matchesCondition(depVal, values[depKey]);
    });
  };

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
        { name: "Bookkeeping Frequency", key: "Bookkeeping_Frequency_id_2", type: "dropdown", options: ["Daily", "Weekly", "Fortnightly", "Monthly", "Quarterly", "Yearly", "Other"] },
        { name: "Select Date", key: "Day_Date_id_2", type: "date", showIf: { Bookkeeping_Frequency_id_2: "Daily" } },
        { name: "Year", key: "Week_Year_id_2", type: "dropdown", options: getLastFiveYears(), showIf: { Bookkeeping_Frequency_id_2: "Weekly" } },
        { name: "Month", key: "Week_Month_id_2", type: "dropdown", options: getMonths(), showIf: { Bookkeeping_Frequency_id_2: "Weekly" } },
        { name: "Week", key: "Week_id_2", type: "dropdown", options: ["Week 1", "Week 2", "Week 3", "Week 4"], showIf: { Bookkeeping_Frequency_id_2: "Weekly" } },
        { name: "Year", key: "Fortnight_Year_id_2", type: "dropdown", options: getLastFiveYears(), showIf: { Bookkeeping_Frequency_id_2: "Fortnightly" } },
        { name: "Month", key: "Fortnight_Month_id_2", type: "dropdown", options: getMonths(), showIf: { Bookkeeping_Frequency_id_2: "Fortnightly" } },
        { name: "Fortnight", key: "Fortnight_id_2", type: "dropdown", options: ["1st Half", "2nd Half"], showIf: { Bookkeeping_Frequency_id_2: "Fortnightly" } },
        { name: "Year", key: "Month_Year_id_2", type: "dropdown", options: getLastFiveYears(), showIf: { Bookkeeping_Frequency_id_2: "Monthly" } },
        { name: "Month", key: "Month_id_2", type: "dropdown", options: getMonths(), showIf: { Bookkeeping_Frequency_id_2: "Monthly" } },
        { name: "Year", key: "Quarter_Year_id_2", type: "dropdown", options: getLastFiveYears(), showIf: { Bookkeeping_Frequency_id_2: "Quarterly" } },
        { name: "Quarter", key: "Quarter_id_2", type: "dropdown", options: getQuarters(), showIf: { Bookkeeping_Frequency_id_2: "Quarterly" } },
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
        { name: "If Landlord, Number of Properties", key: "If_Landlord_Number_of_Properties_id_4", type: "dropdown", options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "30+"] },
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
      id: 8,
      fields: [
        { name: "Filing Frequency", key: "Filing_Frequency_id_8", type: "dropdown", options: ["Monthly", "Quarterly", "Yearly"] },
        { name: "Period Ending Date", key: "Period_Ending_Date_id_8", type: "date", showIf: { Filing_Frequency_id_8: ["Monthly", "Quarterly", "Yearly"] } },
        { name: "Filing Date", key: "Filing_Date_id_8", type: "date", showIf: { Filing_Frequency_id_8: ["Monthly", "Quarterly", "Yearly"] } },
      ],
    },
  ];

  const handleViewChecklist = async (checklistId, title, type) => {
    if (!checklistId) return;
    setChecklistModal(prev => ({ ...prev, show: true, loading: true, title, type: type }));
    if (checklistModal[type] && checklistModal[type].length > 0) {
      setChecklistModal(prev => ({ ...prev, loading: false, data: [...prev[type]] }));
      return;
    }
    try {
      const response = await dispatch(DownloadChecklist({ checklistId, token })).unwrap();
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
      const formattedRows = json.slice(1).filter(row => row && row[1]).map((row) => ({
        s_no: row[0],
        question: row[1],
        answer: '',
        comment: '',
        date: ""
      }));
      setChecklistModal(prev => ({ ...prev, loading: false, [type]: formattedRows, data: formattedRows }));
    } catch (error) {
      sweatalert.fire({ icon: 'error', title: 'Error', text: 'Failed to load checklist file' });
      setChecklistModal(prev => ({ ...prev, show: false, loading: false }));
    }
  };

  const handleChecklistAnswerChange = (index, answer, type, attribute) => {
    setChecklistModal(prev => {
      const newData = [...prev[type]];
      newData[index] = { ...newData[index], [attribute]: answer, date: (attribute === "answer" && !answer) ? "" : new Date().toISOString().split('T')[0] };
      return { ...prev, [type]: newData };
    });
  };

  const openJobModal = (e) => { if (e.target.value != "") { jobModalSetStatus(true); } };
  const AddTask = (id) => {
    const filterData = AllChecklistData.data.find((data) => data.task_id == id);
    if (!filterData) return;
    setAddTaskArr((prev) => prev.some(t => t.task_id === filterData.task_id) ? prev : [...prev, filterData]);
  };
  const RemoveTask = (id) => setAddTaskArr((prev) => prev.filter((task) => task.task_id !== id));

  const handleBudgetTime = (e, index, type) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return;
    setAddTaskArr((prev) => {
      const updated = [...prev];
      let [hour, minute] = (updated[index]?.budgeted_hour || "0:0").split(":");
      if (type === "hour") hour = value;
      else if (type === "minute") {
        let numValue = Number(value);
        if (numValue > 59) numValue = 59;
        minute = numValue.toString();
      }
      updated[index] = { ...updated[index], budgeted_hour: `${hour}:${minute}` };
      return updated;
    });
  };

  const handleAddTask = () => {
    if (!taskName.trim() || !BudgetedHoursAddTask.hours || BudgetedHoursAddTask.hours <= 0) {
      sweatalert.fire({ icon: "error", title: "Please enter task name and hours" });
      return;
    }
    const req = { task_id: "", task_name: taskName, budgeted_hour: `${BudgetedHoursAddTask.hours}:${BudgetedHoursAddTask.minutes || "0"}` };
    setAddTaskArr([...AddTaskArr, req]);
    setTaskName("");
    setBudgetedHoursAddTask({ hours: "", minutes: "" });
    setShowAddJobModal(false);
  };

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header step-header-blue d-flex align-items-center">
              <button type="button" className="btn p-0" onClick={() => navigate(-1)}><ArrowLeft size={16} /></button>
              <h3 className="card-title mb-0 ms-2">Create New Job</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="card card_shadow mb-4">
                  <div className="card-header card-header-light-blue"><h4 className="card-title mb-0 fs-16">Job Information</h4></div>
                  <div className="card-body">
                    <div className="row">
                      <div className="mb-3 col-lg-4">
                        <label className="form-label">Outbook Account Manager <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" disabled value={jobData.AccountManager} />
                      </div>
                      <div className="mb-3 col-lg-4">
                        <label className="form-label">Customer <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" disabled value={jobData.Customer} />
                      </div>
                      <div className="mb-3 col-lg-4">
                        <label className="form-label">Client <span className="text-danger">*</span></label>
                        {location?.state?.goto == "Customer" ? (
                          <select className={`form-select ${errors["Client"] ? "is-invalid" : ""}`} name="Client" value={jobData.Client} onChange={HandleChange}>
                            <option value="">Select Client</option>
                            {allClientDetails?.map((client) => (<option key={client.client_id} value={client.client_id}>{client.client_trading_name}</option>))}
                          </select>
                        ) : (
                          <input type="text" className="form-control" disabled value={jobData.Client} />
                        )}
                        {errors["Client"] && <div className="invalid-feedback">{errors["Client"]}</div>}
                      </div>
                      <div className="mb-3 col-lg-4">
                        <label className="form-label">Service <span className="text-danger">*</span></label>
                        <select className={`form-select ${errors["Service"] ? "is-invalid" : ""}`} name="Service" value={jobData.Service} onChange={HandleChange}>
                          <option value="">Select Service</option>
                          {AllJobData?.data?.services?.map((service) => (<option key={service.service_id} value={service.service_id}>{service.service_name}</option>))}
                        </select>
                        {errors["Service"] && <div className="invalid-feedback">{errors["Service"]}</div>}
                      </div>
                      <div className="mb-3 col-lg-4">
                        <label className="form-label">Job Type <span className="text-danger">*</span></label>
                        <select className={`form-select ${errors["JobType"] ? "is-invalid" : ""}`} name="JobType" value={jobData.JobType} onChange={HandleChange}>
                          <option value="">Select Job Type</option>
                          {get_Job_Type?.data?.map((jt) => (<option key={jt.id} value={jt.id}>{jt.type}</option>))}
                        </select>
                        {errors["JobType"] && <div className="invalid-feedback">{errors["JobType"]}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Service Fields */}
                <div className="card card_shadow mb-4">
                  <div className="card-header card-header-light-blue"><h4 className="card-title mb-0 fs-16">Service Specifications</h4></div>
                  <div className="card-body">
                    <div className="row">
                      {serviceFields.filter(group => group.id === 0 || group.id === Number(jobData.Service)).map(group => (
                        group.fields.filter(field => shouldShowField(field, jobData)).map(field => (
                          <div className="mb-3 col-lg-4" key={field.key}>
                            <label className="form-label">{field.name}</label>
                            {field.type === "dropdown" ? (
                              <select className="form-select" name={field.key} value={jobData[field.key] || ""} onChange={HandleChange}>
                                <option value="">Select {field.name}</option>
                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            ) : (
                              <input type={field.type} className="form-control" name={field.key} value={jobData[field.key] || ""} onChange={HandleChange} />
                            )}
                          </div>
                        ))
                      ))}
                    </div>
                  </div>
                </div>

                {/* Checklist & Tasks */}
                <div className="card card_shadow mb-4">
                  <div className="card-header card-header-light-blue d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 fs-16">Tasks & Checklist</h4>
                    <Button variant="primary" size="sm" onClick={() => setShowAddJobModal(true)}><Plus size={14} /> Add Task</Button>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-lg-6">
                        <label className="form-label">Select Checklist</label>
                        <select className="form-select" value={getChecklistId} onChange={(e) => { setChecklistId(e.target.value); openJobModal(e); }}>
                          <option value="">Select Checklist</option>
                          {AllChecklistData?.data?.map(c => <option key={c.checklist_id} value={c.checklist_id}>{c.checklist_name}</option>)}
                        </select>
                      </div>
                    </div>
                    <Table bordered hover responsive size="sm">
                      <thead className="table-light">
                        <tr>
                          <th>Task Name</th>
                          <th style={{ width: '200px' }}>Budgeted Time (HH:MM)</th>
                          <th style={{ width: '100px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AddTaskArr.map((task, index) => (
                          <tr key={index}>
                            <td>{task.task_name}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <input type="text" className="form-control form-control-sm text-center" style={{ width: '60px' }} value={(task.budgeted_hour || "0:0").split(":")[0]} onChange={(e) => handleBudgetTime(e, index, 'hour')} />
                                <span className="mx-1">:</span>
                                <input type="text" className="form-control form-control-sm text-center" style={{ width: '60px' }} value={(task.budgeted_hour || "0:0").split(":")[1]} onChange={(e) => handleBudgetTime(e, index, 'minute')} />
                              </div>
                            </td>
                            <td className="text-center"><Button variant="link" className="text-danger p-0" onClick={() => RemoveTask(task.task_id)}><X size={16} /></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>

                <div className="d-flex justify-content-end mb-4">
                  <Button variant="light" className="me-2" onClick={() => navigate(-1)}>Cancel</Button>
                  <Button variant="success" onClick={handleSubmit}><Save size={16} className="me-1" /> Create Job</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal show={showAddJobModal} onHide={() => setShowAddJobModal(false)} centered>
        <Modal.Header closeButton><Modal.Title className="fs-18">Add New Task</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Task Name</label>
            <input type="text" className="form-control" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>
          <div className="row">
            <div className="col-6">
              <label className="form-label">Hours</label>
              <input type="number" className="form-control" value={BudgetedHoursAddTask.hours} onChange={(e) => setBudgetedHoursAddTask({ ...BudgetedHoursAddTask, hours: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="form-label">Minutes</label>
              <input type="number" className="form-control" value={BudgetedHoursAddTask.minutes} onChange={(e) => setBudgetedHoursAddTask({ ...BudgetedHoursAddTask, minutes: e.target.value })} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowAddJobModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddTask}>Add Task</Button>
        </Modal.Footer>
      </Modal>

      {/* Checklist Selection Modal */}
      <Modal show={jobModalStatus} onHide={() => jobModalSetStatus(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title className="fs-18">Checklist Tasks</Modal.Title></Modal.Header>
        <Modal.Body>
          <Table bordered hover>
            <thead className="table-light"><tr><th>Task Name</th><th className="text-center">Action</th></tr></thead>
            <tbody>
              {AllChecklistData.data.map(task => (
                <tr key={task.task_id}>
                  <td>{task.task_name}</td>
                  <td className="text-center">
                    <Button variant="soft-primary" size="sm" onClick={() => AddTask(task.task_id)}>Add</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer><Button variant="primary" onClick={() => jobModalSetStatus(false)}>Done</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateJob;

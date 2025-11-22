import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GetAllJabData,
  AddAllJobType,
  GET_ALL_CHECKLIST,
  GetOfficerDetails
} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import { JobType } from "../../../../ReduxStore/Slice/Settings/settingSlice";
import { Modal, Button } from "react-bootstrap";
import { ScrollToViewFirstError } from "../../../../Utils/Comman_function";
import { CreateJobErrorMessage } from "../../../../Utils/Common_Message";
import { use } from "react";
import Select from 'react-select';

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

  const [serviceFieldsData, setServiceFieldsData] = useState([]);
  const [allStaffData, setAllStaffData] = useState([]);
  const [selectedStaffData, setSelectedStaffData] = useState([]);
  const [allClientDetails, setAllClientDetails] = useState([]);
  const [clientInfoCompanyDetails, setClientInfoCompanyDetails] = useState({});



  console.log("clientInfoCompanyDetails", clientInfoCompanyDetails);


  const [jobData, setJobData] = useState({
    CustomerDetails: [],
    AccountManager: "",
    Customer: "",
    Client: "",
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
    SLADeadlineDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
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
    //Bookkeeping_Frequency_id_2: "Daily",

  });

  console.log("jobData", jobData.Service);

  // console.log("CustomerDetails", jobData.CustomerDetails);
  // console.log("Reviewer", jobData.Reviewer);
  // console.log("staffCreatedId", staffCreatedId);
  // console.log("selectedStaffData", selectedStaffData);

  useEffect(() => {
    setJobData((prevState) => ({
      ...prevState,
      AccountManager: AllJobData?.data?.Manager?.[0]?.manager_name || "",
      Customer: AllJobData?.data?.customer?.customer_trading_name || "",
      CustomerDetails: AllJobData?.data?.customerDetails || [],
      Client:
        location.state.goto == "Customer"
          ? ""
          : location.state.clientName.client_name || "",
    }));
  }, [AllJobData]);

  const GetJobData = async () => {
    const req = { customer_id: location.state.customer_id };
    const data = { req: req, authToken: token };
    await dispatch(GetAllJabData(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setAllJobData({
            loading: true,
            data: response.data,
          });

          setJobData((prevState) => ({
            ...prevState,
            Service: response.data?.services?.[0]?.service_id,
            CustomerAccountManager: response.data?.customer_account_manager?.[0]?.customer_account_manager_officer_id.toString() || "",
            EngagementModel: Object.entries(response.data?.engagement_model[0]).find(([key, value]) => value === "1")?.[0] || "",
          }));

          setAllStaffData(response?.data?.allStaff || []);
          setAllClientDetails(response?.data?.client || []);

          if (location?.state?.goto != "Customer") {
            const clientInfo = response?.data?.client?.find((client) => Number(client?.client_id) == Number(location.state?.clientName?.id) && client?.client_client_type == "2") || "";
            console.log("clientInfo", clientInfo);
            if (clientInfo != "" && clientInfo?.client_company_number != undefined) {
              await get_information_company_umber(clientInfo?.client_company_number ,response.data?.services?.[0]?.service_id);
            }
          }
        } else {
          setAllJobData({
            loading: true,
            data: [],
          });
          setAllStaffData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    GetJobData();
  }, []);

  const get_information_company_umber = async (company_number , service_id) => {
    const data = { company_number: company_number, type: 'company_info' };
    await dispatch(GetOfficerDetails(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setClientInfoCompanyDetails(res.data);
          if (!['',null,undefined].includes(service_id) && Number(service_id) == 1) {
            setJobData((prevState) => ({
              ...prevState,
              Year_Ending_id_1: res.data?.accounts?.next_accounts?.period_end_on,
              DueOn : res.data?.accounts?.next_accounts?.due_on,
            }));
          }

        } else {
          setClientInfoCompanyDetails({});

        }
      })
      .catch((err) => {
        return;
      }
      );
  };

  const getAllChecklist = async () => {
    if (
      AllJobData?.data?.client?.[0]?.client_id &&
      jobData?.Service &&
      AllJobData?.data?.customer?.customer_id &&
      jobData?.JobType
    ) {
      const req = {
        action: "getByServiceWithJobType",
        service_id: jobData.Service,
        customer_id: AllJobData?.data?.customer?.customer_id,
        job_type_id: jobData.JobType,
        // clientId: AllJobData?.data?.client[0]?.client_id,
        clientId:
          location?.state?.goto == "Customer"
            ? Number(jobData.Client)
            : location?.state?.clientName?.id,
      };
      const data = { req: req, authToken: token };



      await dispatch(GET_ALL_CHECKLIST(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            if (response.data.length > 0) {

              console.log("response.data", response.data)
              setAllChecklistData({
                loading: true,
                data: response.data,
              });
            } else {
              setAllChecklistData({
                loading: true,
                data: [],
              });
            }
          } else {
            setAllChecklistData({
              loading: true,
              data: [],
            });
          }
        })
        .catch((error) => {
          return;
        });
    }
  };

  useEffect(() => {
    getAllChecklist();
  }, [jobData.JobType, AllJobData?.data]);

  //console.log("AllChecklistData", AllChecklistData);

  const GetJobType = async () => {
    const req = { action: "get", service_id: jobData.Service };
    const data = { req: req, authToken: token };
    await dispatch(JobType(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setJob_Type({
            loading: true,
            data: response.data,
          });
        } else {
          setJob_Type({
            loading: true,
            data: [],
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    GetJobType();
  }, [jobData.Service]);

  const getChecklistData = async () => {
    const req = {
      action: "getById",
      checklist_id: getChecklistId && getChecklistId,
    };


    const data = { req: req, authToken: token };
    await dispatch(GET_ALL_CHECKLIST(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setAllChecklistData({
            loading: true,
            data: response.data.task || [],
          });
        } else {
          setAllChecklistData({
            loading: true,
            data: [],
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    getChecklistData();
  }, [getChecklistId]);

  const HandleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name == 'Client') {
      const clientInfo = allClientDetails?.find((client) => Number(client?.client_id) == Number(value) && client?.client_client_type == "2") || "";
      if (clientInfo != "" && clientInfo?.client_company_number != undefined) {
        get_information_company_umber(clientInfo?.client_company_number ,jobData?.Service);
      } else {
        setClientInfoCompanyDetails({});
      }
    }

    if (name === "JobType") {
      if (!['', 'undefined', undefined, null, 'null'].includes(jobData.JobType) && Number(jobData.JobType) === Number(value) && AddTaskArr.length > 0) {

      } else {
        setAddTaskArr([]);
      }
    }

    const date = new Date();
    if (name == "Service" && [1, 3, 4, 5, 6, 7, 8].includes(Number(value))) {
      if (value == 1) {
        date.setDate(date.getDate() + 28);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));

        if (clientInfoCompanyDetails && Object.keys(clientInfoCompanyDetails).length > 0) {
          alert("Data exists");
          setJobData((prevState) => ({
          ...prevState,
          Year_Ending_id_1: clientInfoCompanyDetails?.accounts?.next_accounts?.period_end_on,
          DueOn : clientInfoCompanyDetails?.accounts?.next_accounts?.due_on,
        }));
        } 
      }else{
        alert("No Data");
        setJobData((prevState) => ({
          ...prevState,
          Year_Ending_id_1: null,
          DueOn: null,
        }));
      }
      
      
      
      if (value == 4) {
        date.setDate(date.getDate() + 5);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));
      } else if (value == 3) {
        date.setDate(date.getDate() + 5);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));
      } else if (value == 8) {
        date.setDate(date.getDate() + 10);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));
      }
    }
    if (jobData.Service == 2 && name == "Bookkeeping_Frequency_id_2") {

      if (value == "Daily") {
        date.setDate(date.getDate() + 1);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));
      } else if (value == "Weekly") {
        date.setDate(date.getDate() + 3);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));
      } else if (value == "Monthly") {
        date.setDate(date.getDate() + 10);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));
      } else if (value == "Quarterly") {
        date.setDate(date.getDate() + 15);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));
      } else if (value == "Yearly") {
        date.setDate(date.getDate() + 30);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));
      }
    }

    if (
      name == "NumberOfTransactions" ||
      name == "NumberOfTrialBalanceItems" ||
      name == "Turnover"
    ) {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    if (
      [
        "BudgetedHours",
        "TotalPreparationTime",
        "ReviewTime",
        "FeedbackIncorporationTime",
      ].includes(name)
    ) {
      value = value.replace(":", "");
    }

    setJobData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    validate(name, value);
  };

 

  const validate = (name, value, isSubmitting = false) => {
    const newErrors = { ...errors };

    if (isSubmitting) {
      for (const key in CreateJobErrorMessage) {
        if (
          !jobData[key] &&
          key != "NumberOfTransactions" &&
          key != "NumberOfTrialBalanceItems" &&
          key != "Turnover"
        ) {
          newErrors[key] = CreateJobErrorMessage[key];
        }
      }
    } else {
      if (
        !value &&
        name != "NumberOfTransactions" &&
        name != "NumberOfTrialBalanceItems" &&
        name != "Turnover"
      ) {
        if (CreateJobErrorMessage[name]) {
          newErrors[name] = CreateJobErrorMessage[name];
        }
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

    ScrollToViewFirstError(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    let isValid = true;
    for (const key in jobData) {
      if (!validate(key, jobData[key], true)) {
        isValid = false;
      }
    }
    return isValid;
  };

  function formatTime(hours, minutes) {
    const formattedHours =
      hours != "" || hours != null ? String(hours).padStart(2, "0") : "00";
    const formattedMinutes =
      minutes != "" || minutes != null
        ? String(minutes).padStart(2, "0")
        : "00";
    return `${formattedHours}:${formattedMinutes}`;
  }

  let budgeted_hour_totalTime = { hours: "", minutes: "" };
  // if (AddTaskArr.length > 0) {
  //   budgeted_hour_totalTime = AddTaskArr?.reduce(
  //     (acc, task) => {
  //       const [hours, minutes] = task?.budgeted_hour?.split(":").map(Number);

  //       acc.hours += hours;
  //       acc.minutes += minutes;

  //       // Convert every 60 minutes into an hour
  //       if (acc.minutes >= 60) {
  //         acc.hours += Math.floor(acc.minutes / 60);
  //         acc.minutes = acc.minutes % 60;
  //       }
  //       return acc;
  //     },
  //     { hours: 0, minutes: 0 }
  //   );
  // }
  if (AddTaskArr.length > 0) {
    budgeted_hour_totalTime = AddTaskArr.reduce(
      (acc, task) => {
        // safe split with default "0:0" if null/undefined/empty
        const [hours, minutes] = (task?.budgeted_hour || "0:0")
          .split(":")
          .map(Number);

        acc.hours += hours;
        acc.minutes += minutes;

        // Convert every 60 minutes into an hour
        if (acc.minutes >= 60) {
          acc.hours += Math.floor(acc.minutes / 60);
          acc.minutes = acc.minutes % 60;
        }

        return acc;
      },
      { hours: 0, minutes: 0 }
    );
  }


  useEffect(() => {
    setBudgetedHours({
      hours: budgeted_hour_totalTime.hours || "0",
      minutes: budgeted_hour_totalTime.minutes || "0",
    });
  }, [AddTaskArr]);

  const handleSubmit = async () => {


    if (AddTaskArr.length === 0) {
      sweatalert.fire({
        icon: "error",
        title: "Please add at least one task.",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }

    if (["", null, undefined].includes(jobData.DateReceivedOn)) {
      sweatalert.fire({
        icon: "error",
        title: "Please select Date Received On.",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }



    const req = {
      selectedStaffData: selectedStaffData,
      staffCreatedId: staffCreatedId,
      account_manager_id: AllJobData?.data?.Manager[0]?.manager_id,
      customer_id: AllJobData?.data?.customer?.customer_id,
      client_id:
        location?.state?.goto == "Customer"
          ? Number(jobData.Client)
          : location?.state?.clientName?.id,
      client_job_code: jobData.ClientJobCode,
      customer_contact_details_id: Number(jobData.CustomerAccountManager),
      service_id: Number(jobData.Service),
      job_type_id: Number(jobData.JobType),
      budgeted_hours: formatTime(budgetedHours.hours, budgetedHours.minutes),
      reviewer: Number(jobData.Reviewer),
      allocated_to: Number(jobData.AllocatedTo),
      allocated_on: jobData.AllocatedOn
        ? jobData.AllocatedOn
        : new Date().toISOString().split("T")[0],
      date_received_on: jobData.DateReceivedOn
        ? jobData.DateReceivedOn
        : new Date().toISOString().split("T")[0],
      year_end: jobData.YearEnd,
      total_preparation_time: formatTime(
        PreparationTimne.hours,
        PreparationTimne.minutes
      ),
      review_time: formatTime(reviewTime.hours, reviewTime.minutes),
      feedback_incorporation_time: formatTime(
        FeedbackIncorporationTime.hours,
        FeedbackIncorporationTime.minutes
      ),
      total_time: formatTime(Math.floor(totalHours / 60), totalHours % 60),
      engagement_model: jobData.EngagementModel,
      expected_delivery_date: jobData.ExpectedDeliveryDate,
      due_on: jobData.DueOn,
      submission_deadline: jobData.SubmissionDeadline,
      customer_deadline_date: jobData.CustomerDeadlineDate,


      sla_deadline_date: jobData?.SLADeadlineDate
        ? jobData?.SLADeadlineDate
        : new Date().toISOString().split("T")[0],

      internal_deadline_date: jobData.InternalDeadlineDate,
      filing_Companies_required: jobData.FilingWithCompaniesHouseRequired,
      filing_Companies_date: jobData.CompaniesHouseFilingDate,
      filing_hmrc_required: jobData.FilingWithHMRCRequired,
      filing_hmrc_date: jobData.HMRCFilingDate,
      opening_balance_required: jobData.OpeningBalanceAdjustmentRequired,
      opening_balance_date: jobData.OpeningBalanceAdjustmentDate,
      number_of_transaction: Number(jobData.NumberOfTransactions),
      number_of_balance_items: Number(jobData.NumberOfTrialBalanceItems),
      turnover: Number(jobData.Turnover),
      number_of_employees: Number(jobData.NoOfEmployees),
      vat_reconciliation: jobData.VATReconciliation,
      bookkeeping: jobData.Bookkeeping,
      processing_type: jobData.ProcessingType,
      invoiced: jobData.Invoiced,
      currency: jobData.Currency,
      invoice_value: jobData.InvoiceValue,
      invoice_date: jobData.InvoiceDate,
      invoice_hours: formatTime(invoiceTime.hours, invoiceTime.minutes),
      invoice_remark: jobData.InvoiceRemark,
      notes: jobData.notes,
      tasks: {
        checklist_id: getChecklistId,
        task: AddTaskArr,
      },
      ...jobData,
    };


    const data = { req: req, authToken: token };
    setIsSubmitted(true);
    const isValid = validateAllFields();
    if (isValid) {
      await dispatch(AddAllJobType(data))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            sweatalert.fire({
              icon: "success",
              title: response.message,
              timerProgressBar: true,
              showConfirmButton: true,
              timer: 1500,
            });
            setTimeout(() => {
              sessionStorage.setItem("activeTab", location.state.activeTab);
              window.history.back();
            }, 1500);
          } else {
          }
        })
        .catch((error) => {
          return;
        });
    } else {
    }
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
    Number(PreparationTimne.hours) * 60 +
    Number(PreparationTimne.minutes) +
    Number(reviewTime.hours) * 60 +
    Number(reviewTime.minutes) +
    Number(FeedbackIncorporationTime.hours) * 60 +
    Number(FeedbackIncorporationTime.minutes);

  useEffect(() => {
    setTotalTime({
      ...Totaltime,
      hours: Math.floor(totalHours / 60),
      minutes: totalHours % 60,
    });
  }, [totalHours]);

  const openJobModal = (e) => {
    if (e.target.value != "") {
      jobModalSetStatus(true);
    }
  };

  const AddTask = (id) => {
    const filterData = AllChecklistData.data.find((data) => data.task_id == id);

    if (!filterData) {
      return;
    }

    setAddTaskArr((prevTasks) => {
      const taskExists = prevTasks.some(
        (task) => task.task_id === filterData.task_id
      );

      if (taskExists) {
        return prevTasks;
      } else {
        return [...prevTasks, filterData];
      }
    });
  };

  const RemoveTask = (id) => {
    setAddTaskArr((prevTasks) =>
      prevTasks.filter((task) => task.task_id !== id)
    );
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    const validate = (field, setter, message) => {
      if (value.trim() === "" || isNaN(value) || value <= 0) {
        setter(message);
      } else {
        setter("");
      }
    };

    if (name === "taskname") {
      setTaskName(value);
      setTaskNameError(value.trim() === "" ? "Please Enter Task Name" : "");
    } else if (name === "budgeted_hour") {
      validate(name, setBudgetedHourError, "Required");
      if (value === "" || Number(value) >= 0) {
        setBudgetedHoursAddTask({ ...BudgetedHoursAddTask, hours: value });
      }
    } else if (name === "budgeted_minute") {
      validate(name, setBudgetedMinuteError, "Required");
      if (value === "" || (Number(value) >= 0 && Number(value) <= 59)) {
        setBudgetedHoursAddTask({ ...BudgetedHoursAddTask, minutes: value });
      }
    }
  };

  const handleAddTask = () => {
    const errors = {
      taskNameError: taskName.trim() ? "" : "Please Enter Task Name",
      budgetedHourError:
        BudgetedHoursAddTask.hours && BudgetedHoursAddTask.hours > 0
          ? ""
          : "Required",
      budgetedMinuteError:
        BudgetedHoursAddTask.minutes &&
          BudgetedHoursAddTask.minutes >= 0 &&
          BudgetedHoursAddTask.minutes <= 59
          ? ""
          : "Required",
    };

    setTaskNameError(errors.taskNameError);
    setBudgetedHourError(errors.budgetedHourError);
    setBudgetedMinuteError(errors.budgetedMinuteError);

    if (
      !errors.taskNameError &&
      !errors.budgetedHourError &&
      !errors.budgetedMinuteError
    ) {
      const req = {
        task_id: "",
        task_name: taskName,
        budgeted_hour: `${BudgetedHoursAddTask.hours}:${BudgetedHoursAddTask.minutes}`,
      };
      setAddTaskArr([...AddTaskArr, req]);
      HandleReset();
      setShowAddJobModal(false);
    }
  };

  const HandleReset = () => {
    setBudgetedHoursAddTask({
      ...BudgetedHoursAddTask,
      hours: "",
      minutes: "",
    });
    setTaskName("");
  };

  const HandleReset1 = () => {
    setAddTaskArr([]);
    setChecklistId("");
  };

  const [errorsBudgetTimeTask, setErrorsBudgetTimeTask] = useState({});
  const validateBudgetedHours = (tasks) => {
    const newErrors = {};

    tasks.forEach((task) => {
      const value = task.budgeted_hour || "";
      const [hours, minutes] = value.split(":");

      // Convert safely to numbers (default to 0 if NaN or empty)
      const h = Number(hours) || 0;
      const m = Number(minutes) || 0;

      // Condition: invalid if missing ":" or both hour and minute are 0 or blank
      if (
        !value.includes(":") ||          // missing colon
        hours === undefined ||           // missing hours
        minutes === undefined ||         // missing minutes
        hours.trim() === "" ||           // empty hours
        minutes.trim() === "" ||         // empty minutes
        (h === 0 && m === 0)             // both zero
      ) {
        newErrors[task.task_id] = "Please enter valid hours or minutes.";
      }
    });

    setErrorsBudgetTimeTask(newErrors);
    // Return true if all valid
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCheckList = () => {

    if (AddTaskArr.length === 0) {
      sweatalert.fire({
        icon: "warning",
        title: "Please add at least one task.",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500,
      });
      return;
    }

    const isValid = validateBudgetedHours(AddTaskArr);
    if (!isValid) {
      console.log("Invalid inputs found");
      return;
    }

    jobModalSetStatus(false);
  };

  // Years (last 5 + current)
  const getLastFiveYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());
  };

  // Months
  const getMonths = () => [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Quarters
  const getQuarters = () => ["Q1", "Q2", "Q3", "Q4"];


  // helper functions (copy once globally)
  const matchesCondition = (expected, actual) => {
    if (Array.isArray(expected)) return expected.map(String).includes(String(actual));
    return String(expected) === String(actual);
  };

  const shouldShowField = (field, values) => {
    if (!field.showIf) return true; // no condition → always show
    return Object.entries(field.showIf).every(([depKey, depVal]) => {
      return matchesCondition(depVal, values[depKey]);
    });
  };

  const serviceFields = [
    {
      id: 0, // Common fields (default)
      fields: [
        {
          name: "Turnover Period",
          key: "Turnover_Period_id_0",
          type: "dropdown",
          options: ["Monthly", "Quarterly", "Yearly"],
        },
        {
          name: "Turnover Currency",
          key: "Turnover_Currency_id_0",
          type: "dropdown",
          options: ["GBP", "USD", "INR", "EUR", "JPY", "SGD", "CNY", "Other"],
        },
        {
          name: "Turnover",
          key: "Turnover_id_0",
          type: "number",
          min: 0,
          max: 1000000000,
        },
        {
          name: "VAT Registered",
          key: "VAT_Registered_id_0",
          type: "dropdown",
          options: [
            "No",
            "Cash",
            "Accrual",
            "Flat Rate",
            "TOMS",
            "Margin",
            "Other",
          ],
        },
        {
          name: "VAT Frequency",
          key: "VAT_Frequency_id_0",
          type: "dropdown",
          options: ["Quarterly", "Monthly", "Yearly", "NA"],
        },
      ],
    },
    {
      id: 1, // Accounts Production
      fields: [
        {
          name: "Who Did The Bookkeeping",
          key: "Who_Did_The_Bookkeeping_id_1",
          type: "dropdown",
          options: [
            "Outbooks",
            "Customer",
            "Client",
            "Other Outsourced Bookkeeper",
            "Internal Bookkeeper",
            "Other",
          ],
        },
        {
          name: "PAYE Registered",
          key: "PAYE_Registered_id_1",
          type: "dropdown",
          options: [
            "No",
            "0",
            "1 to 5",
            "6 to 10",
            "11 to 20",
            "21 to 50",
            "51 to 100",
            "100+",
          ],
        },
        {
          name: "Number of Trial Balance Items",
          key: "Number_of_Trial_Balance_Items_id_1",
          type: "dropdown",
          options: [
            "1 to 5",
            "6 to 10",
            "11 to 20",
            "21 to 30",
            "31 to 40",
            "41 to 50",
            "51 to 75",
            "75 to 100",
            "101 to 200",
            "201 to 300",
            "301 to 400",
            "401 to 500",
            "500+",
          ],
        },
        {
          name: "Year Ending",
          key: "Year_Ending_id_1",
          type: "date",   // date input field
        },
      ],
    },
    {
      id: 2, // Bookkeeping
      fields: [
        {
          name: "Bookkeeping Frequency",
          key: "Bookkeeping_Frequency_id_2",
          type: "dropdown",
          options: [
            "Daily",
            "Weekly",
            "Fortnightly",
            "Monthly",
            "Quarterly",
            "Yearly",
            "Other",
          ],
        },


        // Day
        {
          name: "Select Date",
          key: "Day_Date_id_2",
          type: "date",
          showIf: { Bookkeeping_Frequency_id_2: "Daily" },
        },
        // Week
        {
          name: "Year",
          key: "Week_Year_id_2",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Bookkeeping_Frequency_id_2: "Weekly" },
        },
        {
          name: "Month",
          key: "Week_Month_id_2",
          type: "dropdown",
          options: getMonths(),
          showIf: { Bookkeeping_Frequency_id_2: "Weekly" },
        },
        {
          name: "Week",
          key: "Week_id_2",
          type: "dropdown",
          options: ["Week 1", "Week 2", "Week 3", "Week 4"],
          showIf: { Bookkeeping_Frequency_id_2: "Weekly" },
        },
        // Fortnight
        {
          name: "Year",
          key: "Fortnight_Year_id_2",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Bookkeeping_Frequency_id_2: "Fortnightly" },
        },
        {
          name: "Month",
          key: "Fortnight_Month_id_2",
          type: "dropdown",
          options: getMonths(),
          showIf: { Bookkeeping_Frequency_id_2: "Fortnightly" },
        },
        {
          name: "Fortnight",
          key: "Fortnight_id_2",
          type: "dropdown",
          options: ["1st Half", "2nd Half"],
          showIf: { Bookkeeping_Frequency_id_2: "Fortnightly" },
        },
        // Month
        {
          name: "Year",
          key: "Month_Year_id_2",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Bookkeeping_Frequency_id_2: "Monthly" },
        },
        {
          name: "Month",
          key: "Month_id_2",
          type: "dropdown",
          options: getMonths(),
          showIf: { Bookkeeping_Frequency_id_2: "Monthly" },
        },
        // Quarter
        {
          name: "Year",
          key: "Quarter_Year_id_2",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Bookkeeping_Frequency_id_2: "Quarterly" },
        },
        {
          name: "Quarter",
          key: "Quarter_id_2",
          type: "dropdown",
          options: getQuarters(),
          showIf: { Bookkeeping_Frequency_id_2: "Quarterly" },
        },
        // Year
        {
          name: "Year",
          key: "Year_id_2",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Bookkeeping_Frequency_id_2: "Yearly" },
        },
        // Other
        {
          name: "From Date",
          key: "Other_FromDate_id_2",
          type: "date",
          showIf: { Bookkeeping_Frequency_id_2: "Other" },
        },
        {
          name: "To Date",
          key: "Other_ToDate_id_2",
          type: "date",
          showIf: { Bookkeeping_Frequency_id_2: "Other" },
        },




        {
          name: "Number of Total Transactions",
          key: "Number_of_Total_Transactions_id_2",
          type: "number",
          min: 0,
          max: 100000,
        },
        {
          name: "Number of Bank Transactions",
          key: "Number_of_Bank_Transactions_id_2",
          type: "number",
          min: 0,
          max: 100000,
        },
        {
          name: "Number of Purchase Invoices",
          key: "Number_of_Purchase_Invoices_id_2",
          type: "number",
          min: 0,
          max: 100000,
        },
        {
          name: "Number of Sales Invoices",
          key: "Number_of_Sales_Invoices_id_2",
          type: "number",
          min: 0,
          max: 100000,
        },
        {
          name: "Number of Petty Cash Transactions",
          key: "Number_of_Petty_Cash_Transactions_id_2",
          type: "number",
          min: 0,
          max: 100000,
        },
        {
          name: "Number of Journal Entries",
          key: "Number_of_Journal_Entries_id_2",
          type: "number",
          min: 0,
          max: 100000,
        },
        {
          name: "Number of Other Transactions",
          key: "Number_of_Other_Transactions_id_2",
          type: "number",
          min: 0,
          max: 100000,
        },
        {
          name: "Transactions Posting",
          key: "Transactions_Posting_id_2",
          type: "dropdown",
          options: ["Manual", "Dext", "Hubdoc", "Auto Entry", "Other"],
        },
        {
          name: "Quality of Paperwork",
          key: "Quality_of_Paperwork_id_2",
          type: "dropdown",
          options: ["Bad", "Good", "Excellent"],
        },
        {
          name: "Number of Integration Software Platforms",
          key: "Number_of_Integration_Software_Platforms_id_2",
          type: "dropdown",
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "9+"],
        },
        {
          name: "CIS",
          key: "CIS_id_2",
          type: "dropdown",
          options: ["No", "Yes"],
        },
        {
          name: "Posting Payroll Journals",
          key: "Posting_Payroll_Journals_id_2",
          type: "dropdown",
          options: ["Yes", "No"],
        },
        {
          name: "Department Tracking",
          key: "Department_Tracking_id_2",
          type: "dropdown",
          options: ["No", "Yes"],
        },
        {
          name: "Sales Reconciliation Required",
          key: "Sales_Reconciliation_Required_id_2",
          type: "dropdown",
          options: ["No", "Yes"],
        },
        {
          name: "Factoring Account",
          key: "Factoring_Account_id_2",
          type: "dropdown",
          options: [
            "Provider Deducts Commission Only",
            "Rapid Cash Account",
            "Provider Deducts Fixed Percentage",
            "No Factoring Account",
          ],
        },
        {
          name: "Payment Methods",
          key: "Payment_Methods_id_2",
          type: "dropdown",
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "9+"],
        },
      ],
    },
    {
      id: 3, // Payroll
      fields: [
        {
          name: "Payroll Frequency",
          key: "Payroll_Frequency_id_3",
          type: "dropdown",
          options: [
            "Weekly",
            "Monthly",
            "Fortnightly",
            "Quarterly",
            "Yearly",
          ],
        },

        // ==================== WEEKLY ====================
        {
          name: "Year",
          key: "Payroll_Week_Year_id_3",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_3: "Weekly" },
        },
        {
          name: "Month",
          key: "Payroll_Week_Month_id_3",
          type: "dropdown",
          options: getMonths(),
          showIf: { Payroll_Frequency_id_3: "Weekly" },
        },
        {
          name: "Week",
          key: "Payroll_Week_id_3",
          type: "dropdown",
          options: ["Week 1", "Week 2", "Week 3", "Week 4"],
          showIf: { Payroll_Frequency_id_3: "Weekly" },
        },

        // ==================== FORTNIGHTLY ====================
        {
          name: "Year",
          key: "Payroll_Fortnight_Year_id_3",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_3: "Fortnightly" },
        },
        {
          name: "Month",
          key: "Payroll_Fortnight_Month_id_3",
          type: "dropdown",
          options: getMonths(),
          showIf: { Payroll_Frequency_id_3: "Fortnightly" },
        },
        {
          name: "Fortnight",
          key: "Payroll_Fortnight_id_3",
          type: "dropdown",
          options: ["1st Half", "2nd Half"],
          showIf: { Payroll_Frequency_id_3: "Fortnightly" },
        },

        // ==================== MONTHLY ====================
        {
          name: "Year",
          key: "Payroll_Month_Year_id_3",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_3: "Monthly" },
        },
        {
          name: "Month",
          key: "Payroll_Month_id_3",
          type: "dropdown",
          options: getMonths(),
          showIf: { Payroll_Frequency_id_3: "Monthly" },
        },

        // ==================== QUARTERLY ====================
        {
          name: "Year",
          key: "Payroll_Quarter_Year_id_3",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_3: "Quarterly" },
        },
        {
          name: "Quarter",
          key: "Payroll_Quarter_id_3",
          type: "dropdown",
          options: getQuarters(),
          showIf: { Payroll_Frequency_id_3: "Quarterly" },
        },

        // ==================== YEARLY ====================
        {
          name: "Year",
          key: "Payroll_Year_id_3",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_3: "Yearly" },
        },






        {
          name: "Type of Payslip",
          key: "Type_of_Payslip_id_3",
          type: "dropdown",
          options: ["Wages Only", "Wages Pension"],
        },
        {
          name: "Percentage of Variable Payslips",
          key: "Percentage_of_Variable_Payslips_id_3",
          type: "dropdown",
          options: [
            "0%",
            "up to 25%",
            "25.1 to 50%",
            "50.1 to 75%",
            "75.1 to 100%",
          ],
        },
        {
          name: "Is CIS Required",
          key: "Is_CIS_Required_id_3",
          type: "dropdown",
          options: ["No", "Yes"],
        },
        {
          name: "CIS Frequency",
          key: "CIS_Frequency_id_3",
          type: "dropdown",
          options: ["Weekly", "Monthly", "Weekly & Monthly", "Quarterly"],
        },
        {
          name: "Number of Sub-contractors",
          key: "Number_of_Sub_contractors_id_3",
          type: "number",
          min: 0,
          max: 10000,
        },
      ],
    },
    {
      id: 4, // Personal Tax Return
      fields: [
        {
          name: "Whose Tax Return is it",
          key: "Whose_Tax_Return_is_it_id_4",
          type: "dropdown",
          options: [
            "Director",
            "Sole Trader",
            "Individual Earning more than £100k",
            "Partner in Partnership",
            "Landlord",
            "Other",
          ],
        },
        {
          name: "Number of Income Sources",
          key: "Number_of_Income_Sources_id_4",
          type: "dropdown",
          options: ["1", "2", "3", "4", "5", "6", "7", "8", "9+"],
        },
        {
          name: "If Landlord, Number of Properties",
          key: "If_Landlord_Number_of_Properties_id_4",
          type: "dropdown",
          options: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "30+",
          ],
        },
        {
          name: "If Sole Trader, Who is doing Bookkeeping",
          key: "If_Sole_Trader_Who_is_doing_Bookkeeping_id_4",
          type: "dropdown",
          options: [
            "Outbooks",
            "Customer",
            "Client",
            "Other Outsourced Bookkeeper",
            "Internal Bookkeeper",
            "Other",
          ],
        },
        {
          name: "Tax Year",
          key: "Tax_Year_id_4",
          type: "dropdown",
          options: [
            "2018/19",
            "2019/20",
            "2020/21",
            "2021/22",
            "2022/23",
            "2023/24",
            "2024/25",
            "2025/26",
            "2026/27",
            "2027/28",
          ],
        },
      ],
    },
    {
      id: 5, // Admin Support
      fields: [],
    },
    {
      id: 6, // Management Accounts
      fields: [
        {
          name: "Management Accounts Frequency",
          key: "Management_Accounts_Frequency_id_6",
          type: "dropdown",
          options: ["Quarterly", "Yearly", "Monthly", "Weekly", "Fortnightly"],
        },
        {
          name: "From Date",
          key: "Management_Accounts_FromDate_id_6",
          type: "date",
        },
        {
          name: "To Date",
          key: "Management_Accounts_ToDate_id_6",
          type: "date",
        },
      ],
    },
    {
      id: 7, // Company Secretarial
      fields: [],
    },
    {
      id: 33, // Aus - Compliance
      fields: [
        {
          name: "Year",
          key: "Year_id_33",
          type: "dropdown",
          options: Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - (i + 1);
            return year.toString();
          }),
        },
      ],
    },
    {
      id: 32, // Aus - Bookkeeping
      fields: [
        {
          name: "Period",
          key: "Period_id_32",
          type: "dropdown",
          options: ["Day", "Week", "Fortnight", "Month", "Quarter", "Year", "Other"],
        },
        // Day
        {
          name: "Select Date",
          key: "Day_Date_id_32",
          type: "date",
          showIf: { Period_id_32: "Day" },
        },
        // Week
        {
          name: "Year",
          key: "Week_Year_id_32",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Period_id_32: "Week" },
        },
        {
          name: "Month",
          key: "Week_Month_id_32",
          type: "dropdown",
          options: getMonths(),
          showIf: { Period_id_32: "Week" },
        },
        {
          name: "Week",
          key: "Week_id_32",
          type: "dropdown",
          options: ["Week 1", "Week 2", "Week 3", "Week 4"],
          showIf: { Period_id_32: "Week" },
        },
        // Fortnight
        {
          name: "Year",
          key: "Fortnight_Year_id_32",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Period_id_32: "Fortnight" },
        },
        {
          name: "Month",
          key: "Fortnight_Month_id_32",
          type: "dropdown",
          options: getMonths(),
          showIf: { Period_id_32: "Fortnight" },
        },
        {
          name: "Fortnight",
          key: "Fortnight_id_32",
          type: "dropdown",
          options: ["1st Half", "2nd Half"],
          showIf: { Period_id_32: "Fortnight" },
        },
        // Month
        {
          name: "Year",
          key: "Month_Year_id_32",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Period_id_32: "Month" },
        },
        {
          name: "Month",
          key: "Month_id_32",
          type: "dropdown",
          options: getMonths(),
          showIf: { Period_id_32: "Month" },
        },
        // Quarter
        {
          name: "Year",
          key: "Quarter_Year_id_32",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Period_id_32: "Quarter" },
        },
        {
          name: "Quarter",
          key: "Quarter_id_32",
          type: "dropdown",
          options: getQuarters(),
          showIf: { Period_id_32: "Quarter" },
        },
        // Year
        {
          name: "Year",
          key: "Year_id_32",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Period_id_32: "Year" },
        },
        // Other
        {
          name: "From Date",
          key: "Other_FromDate_id_32",
          type: "date",
          showIf: { Period_id_32: "Other" },
        },
        {
          name: "To Date",
          key: "Other_ToDate_id_32",
          type: "date",
          showIf: { Period_id_32: "Other" },
        },
      ],
    },
    {
      id: 31, // Aus - Payroll
      fields: [
        {
          name: "Frequency",
          key: "Payroll_Frequency_id_31",
          type: "dropdown",
          options: ["Weekly", "Fortnightly", "Monthly", "Quarterly", "Yearly"],
        },

        // ==================== WEEKLY ====================
        {
          name: "Year",
          key: "Payroll_Week_Year_id_31",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_31: "Weekly" },
        },
        {
          name: "Month",
          key: "Payroll_Week_Month_id_31",
          type: "dropdown",
          options: getMonths(),
          showIf: { Payroll_Frequency_id_31: "Weekly" },
        },
        {
          name: "Week",
          key: "Payroll_Week_id_31",
          type: "dropdown",
          options: ["Week 1", "Week 2", "Week 3", "Week 4"],
          showIf: { Payroll_Frequency_id_31: "Weekly" },
        },

        // ==================== FORTNIGHTLY ====================
        {
          name: "Year",
          key: "Payroll_Fortnight_Year_id_31",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_31: "Fortnightly" },
        },
        {
          name: "Month",
          key: "Payroll_Fortnight_Month_id_31",
          type: "dropdown",
          options: getMonths(),
          showIf: { Payroll_Frequency_id_31: "Fortnightly" },
        },
        {
          name: "Fortnight",
          key: "Payroll_Fortnight_id_31",
          type: "dropdown",
          options: ["1st Half", "2nd Half"],
          showIf: { Payroll_Frequency_id_31: "Fortnightly" },
        },

        // ==================== MONTHLY ====================
        {
          name: "Year",
          key: "Payroll_Month_Year_id_31",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_31: "Monthly" },
        },
        {
          name: "Month",
          key: "Payroll_Month_id_31",
          type: "dropdown",
          options: getMonths(),
          showIf: { Payroll_Frequency_id_31: "Monthly" },
        },

        // ==================== QUARTERLY ====================
        {
          name: "Year",
          key: "Payroll_Quarter_Year_id_31",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_31: "Quarterly" },
        },
        {
          name: "Quarter",
          key: "Payroll_Quarter_id_31",
          type: "dropdown",
          options: getQuarters(),
          showIf: { Payroll_Frequency_id_31: "Quarterly" },
        },

        // ==================== YEARLY ====================
        {
          name: "Year",
          key: "Payroll_Year_id_31",
          type: "dropdown",
          options: getLastFiveYears(),
          showIf: { Payroll_Frequency_id_31: "Yearly" },
        },
      ],
    },
    {
      id: 27, // Audit
      fields: [
        {
          name: "Year Ending",
          key: "Audit_Year_Ending_id_27",
          type: "date",   // date input field
        },
      ],
    },
    {
      id: 8, // VAT Returns
      fields: [
        {
          name: "Filing Frequency",
          key: "Filing_Frequency_id_8",
          type: "dropdown",
          options: ["Monthly", "Quarterly", "Yearly"],
        },
        {
          name: "Period Ending Date",
          key: "Period_Ending_Date_id_8",
          type: "date",
          showIf: { Filing_Frequency_id_8: ["Monthly", "Quarterly", "Yearly"] },
        },
        {
          name: "Filing Date",
          key: "Filing_Date_id_8",
          type: "date",
          showIf: { Filing_Frequency_id_8: ["Monthly", "Quarterly", "Yearly"] },
        },
      ],
    },
    {
      id: 28, // Aus - SMSF
      fields: [
        {
          name: "Year",
          key: "Year_id_28",
          type: "dropdown",
          options: Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - (i + 1);
            return year.toString();
          }),
        },
      ],
    }



  ];


  // console.log("serviceFields", serviceFields);
  // console.log("jobData?.Service", jobData?.Service);


  useEffect(() => {
    setServiceFieldsData(
      //  serviceFields[jobData?.Service]?.fields || serviceFields[0]?.fields
      serviceFields?.find(item => item.id === jobData?.Service)?.fields || serviceFields?.[0]?.fields
    );


    if (jobData?.Service == 2 && jobData.Bookkeeping_Frequency_id_2 == "Daily") {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      setJobData((prevState) => ({
        ...prevState,
        SLADeadlineDate: date.toISOString().split("T")[0],
      }));

    }

  }, [jobData?.Service]);





  useEffect(() => {
    console.log("UPDATE ALL DEFAULT FEILDS");
    setJobData((prevState) => ({
      ...prevState,
      Turnover_Period_id_0: "Monthly",
      Turnover_Currency_id_0: "GBP",
      Turnover_id_0: 0,
      VAT_Registered_id_0: "No",
      VAT_Frequency_id_0: "Quarterly",
      Who_Did_The_Bookkeeping_id_1: "Outbooks",
      PAYE_Registered_id_1: "No",
      Number_of_Trial_Balance_Items_id_1: "1 to 5",

      //  Bookkeeping_Frequency_id_2: "Daily",
      Number_of_Total_Transactions_id_2: 0,
      Number_of_Bank_Transactions_id_2: 0,
      Number_of_Purchase_Invoices_id_2: 0,
      Number_of_Sales_Invoices_id_2: 0,
      Number_of_Petty_Cash_Transactions_id_2: 0,
      Number_of_Journal_Entries_id_2: 0,
      Number_of_Other_Transactions_id_2: 0,
      Transactions_Posting_id_2: "Manual",
      Quality_of_Paperwork_id_2: "Bad",
      Number_of_Integration_Software_Platforms_id_2: "1",
      CIS_id_2: "No",
      Posting_Payroll_Journals_id_2: "Yes",
      Department_Tracking_id_2: "No",
      Sales_Reconciliation_Required_id_2: "No",
      Factoring_Account_id_2: "Provider Deducts Commission Only",
      Payment_Methods_id_2: "1",
      // Payroll_Frequency_id_3: "Weekly",
      Type_of_Payslip_id_3: "Wages Only",
      Percentage_of_Variable_Payslips_id_3: "0%",
      Is_CIS_Required_id_3: "No",
      CIS_Frequency_id_3: "Weekly",
      Number_of_Sub_contractors_id_3: 0,
      Whose_Tax_Return_is_it_id_4: "Director",
      Number_of_Income_Sources_id_4: "1",
      If_Landlord_Number_of_Properties_id_4: "1",
      If_Sole_Trader_Who_is_doing_Bookkeeping_id_4: "Outbooks",


      Management_Accounts_Frequency_id_6: "Quarterly",

      ////////////////////////// 
      Year_Ending_id_1: null,

      Day_Date_id_2: null,
      Week_Year_id_2: null,
      Week_Month_id_2: null,
      Week_id_2: null,
      Fortnight_Year_id_2: null,
      Fortnight_Month_id_2: null,
      Fortnight_id_2: null,
      Month_Year_id_2: null,
      Month_id_2: null,
      Quarter_Year_id_2: null,
      Quarter_id_2: null,
      Year_id_2: null,
      Other_FromDate_id_2: null,
      Other_ToDate_id_2: null,


      Payroll_Week_Year_id_3: null,
      Payroll_Week_Month_id_3: null,
      Payroll_Week_id_3: null,
      Payroll_Fortnight_Year_id_3: null,
      Payroll_Fortnight_Month_id_3: null,
      Payroll_Fortnight_id_3: null,
      Payroll_Month_Year_id_3: null,
      Payroll_Month_id_3: null,
      Payroll_Quarter_Year_id_3: null,
      Payroll_Quarter_id_3: null,
      Payroll_Year_id_3: null,



      Tax_Year_id_4: null,

      Management_Accounts_FromDate_id_6: null,
      Management_Accounts_ToDate_id_6: null,

      Year_id_33: null,

      Period_id_32: null,
      Day_Date_id_32: null,
      Week_Year_id_32: null,
      Week_Month_id_32: null,
      Week_id_32: null,
      Fortnight_Year_id_32: null,
      Fortnight_Month_id_32: null,
      Fortnight_id_32: null,
      Month_Year_id_32: null,
      Month_id_32: null,
      Quarter_Year_id_32: null,
      Quarter_id_32: null,
      Year_id_32: null,
      Other_FromDate_id_32: null,
      Other_ToDate_id_32: null,


      Payroll_Frequency_id_31: null,
      Payroll_Week_Year_id_31: null,
      Payroll_Week_Month_id_31: null,
      Payroll_Week_id_31: null,
      Payroll_Fortnight_Year_id_31: null,
      Payroll_Fortnight_Month_id_31: null,
      Payroll_Fortnight_id_31: null,
      Payroll_Month_Year_id_31: null,
      Payroll_Month_id_31: null,
      Payroll_Quarter_Year_id_31: null,
      Payroll_Quarter_id_31: null,
      Payroll_Year_id_31: null,

      Audit_Year_Ending_id_27: null,

      Filing_Frequency_id_8: null,
      Period_Ending_Date_id_8: null,
      Filing_Date_id_8: null,

      Year_id_28: null,





    }));
  }, []);


  // console.log("jobData", jobData);

  // SELECT OPTION 
  // 1. Build service options
  let serviceOptions = [
    { value: '', label: 'Select Service' },
    ...(AllJobData?.data?.services || []).map((service) => ({
      value: service.service_id,
      label: service.service_name
    }))
  ];


  // let isAssignDetails = jobData?.CustomerDetails.find(
  //   (detail) => detail.assigned_source === "assign_customer_service"
  // );

  // if (isAssignDetails != undefined) {
  //   serviceOptions = serviceOptions.filter((option) => Number(option.value) === Number(isAssignDetails?.service_id_assign));
  // }

  let assignDetails = jobData?.CustomerDetails?.filter(
    (detail) => detail.assigned_source === "assign_customer_service"
  );

  let assignedServiceIds = assignDetails?.map((d) => Number(d.service_id_assign));

  if (assignedServiceIds != undefined && Array.isArray(assignedServiceIds) && assignedServiceIds.length > 0) {
    serviceOptions = serviceOptions.filter((option) =>
      assignedServiceIds.includes(Number(option.value))
    );
  }



  // 2. Build job type options based on selected service
  const jobTypeOptions = [
    { value: '', label: 'Select Job Type' },
    ...(get_Job_Type?.data || []).map((jobtype) => ({
      value: jobtype.id,
      label: jobtype.type
    }))
  ];

  // 3. Build reviewer options
  const reviewerOptions = [
    { value: '', label: 'Select Reviewer' },
    ...(AllJobData?.data?.reviewer || []).map((reviewer) => ({
      value: reviewer.reviewer_id,
      label: `${reviewer.reviewer_name} (${reviewer?.reviewer_email})`
    }))
  ];


  // 4. Build allocated to options
  const allocatedStaffOptions = [
    { value: '', label: 'Select Staff' },
    ...(AllJobData?.data?.allocated || []).map((staff) => ({
      value: staff.allocated_id,
      label: `${staff.allocated_name} (${staff.allocated_email})`
    }))
  ];


  // 5. Build customer account manager options
  const customerAccountManagerOptions = [
    { value: '', label: 'Select Customer Account Manager' },
    ...(AllJobData?.data?.customer_account_manager || []).map((manager) => ({
      value: manager.customer_account_manager_officer_id,
      label: manager.customer_account_manager_officer_name
    }))
  ];

  // 6. Build client options
  const clientOptions = [
    { value: '', label: 'Select Client' },
    ...(AllJobData?.data?.client || []).map((client) => ({
      value: client.client_id,
      label: client.client_trading_name
    }))
  ];




  const handleBudgetTime = (e, index, row, type) => {
    const { value } = e.target;

    const isValid = /^\d*$/.test(value);
    if (!isValid) {
      return;
    }

    setAddTaskArr((prev) => {
      // Copy array
      const updated = [...prev];

      // Split current budgeted_hour into [hour, minute]
      const budgetedValue = updated[index]?.budgeted_hour || "0:0";
      let [hour, minute] = budgetedValue?.split(":");

      if (type === "hour") {
        //hour = value.padStart(2, "0");
        hour = value
      } else if (type === "minute") {
        // minute = value.padStart(2, "0");

        let numValue = Number(value);
        if (isNaN(numValue) || numValue < 0) numValue = 0;
        if (numValue > 59) numValue = 59;
        minute = numValue.toString()
      }

      // Update budgeted_hour
      updated[index] = {
        ...updated[index],
        budgeted_hour: `${hour}:${minute}`,
      };

      return updated;
    });
  };




  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header step-header-blue d-flex align-items-center">
                <button
                  type="button "
                  className="btn p-0"
                  onClick={() => {
                    sessionStorage.setItem(
                      "activeTab",
                      location.state.activeTab
                    );
                    window.history.back();
                  }}
                >
                  <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4" />{" "}
                </button>
                <h3 className="card-title mb-0">Create New Job</h3>
              </div>

              <div className="card-body form-steps">
                <div>
                  <div className="tab-content">
                    <div className="tab-pane fade show active">
                      <div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="card card_shadow">
                              <div className="card-header card-header-light-blue align-items-center d-flex">
                                <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                  Job Information
                                </h4>
                              </div>
                              <div className="card-body">
                                <div className="row">
                                  <div className="mb-3 col-lg-4">
                                    <label className="form-label">
                                      {" "}
                                      Outbook Account Manager
                                      <span className="text-danger">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      //   className="form-control"
                                      className={
                                        errors["AccountManager"]
                                          ? "error-field form-control"
                                          : "form-control"
                                      }
                                      placeholder="Account Manager"
                                      disabled
                                      name="AccountManager"
                                      id="AccountManager"
                                      onChange={HandleChange}
                                      value={jobData.AccountManager}
                                    />
                                    {errors["AccountManager"] && (
                                      <div className="error-text">
                                        {errors["AccountManager"]}
                                      </div>
                                    )}
                                  </div>

                                  <div
                                    id="invoiceremark"
                                    className="mb-3 col-lg-4"
                                  >
                                    <label className="form-label">
                                      Customer
                                      <span className="text-danger">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      className={
                                        errors["Customer"]
                                          ? "error-field form-control"
                                          : "form-control"
                                      }
                                      placeholder="Customer"
                                      disabled
                                      name="Customer"
                                      id="Customer"
                                      onChange={HandleChange}
                                      value={jobData.Customer}
                                    />
                                    {errors["Customer"] && (
                                      <div className="error-text">
                                        {errors["Customer"]}
                                      </div>
                                    )}
                                  </div>
                                  {location.state.goto == "Customer" ? (
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Client
                                        <span className="text-danger">*</span>
                                      </label>

                                      {/* <select
                                        className={
                                          errors["Client"]
                                            ? "error-field form-select"
                                            : "form-select"
                                        }
                                        name="Client"
                                        id="Client"
                                        onChange={HandleChange}
                                        value={jobData.Client}
                                      >
                                        <option value="">Select Client</option>
                                        {(AllJobData?.data?.client || []).map(
                                          (client) => (
                                            <option
                                              value={client.client_id}
                                              key={client.client_id}
                                            >
                                              {client.client_trading_name}
                                            </option>
                                          )
                                        )}
                                      </select> */}
                                      <Select
                                        name="Client"
                                        id="Client"
                                        options={clientOptions}
                                        value={clientOptions.find(
                                          (opt) => String(opt.value) === String(jobData.Client)
                                        )}
                                        onChange={(selectedOption) => {
                                          const e = {
                                            target: {
                                              name: 'Client',
                                              value: selectedOption.value
                                            }
                                          };
                                          HandleChange(e); // Original handler
                                        }}
                                        className={errors["Client"] ? "error-field react-select basic-multi-select" : "react-select basic-multi-select"}
                                        classNamePrefix="react-select"
                                        isSearchable
                                      />

                                      {errors["Client"] && (
                                        <div className="error-text">
                                          {errors["Client"]}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="col-lg-4">
                                      <label className="form-label">
                                        Client
                                        <span className="text-danger">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        className={
                                          errors["Client"]
                                            ? "error-field form-control"
                                            : "form-control"
                                        }
                                        placeholder="Client Job Code"
                                        name="Client"
                                        id="Client"
                                        onChange={HandleChange}
                                        value={jobData.Client}
                                        disabled
                                      />

                                      {errors["Client"] && (
                                        <div className="error-text">
                                          {errors["Client"]}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="mb-3 col-lg-4">
                                    <label className="form-label">
                                      Client Job Code
                                    </label>
                                    <input
                                      type="text"
                                      className={
                                        errors["ClientJobCode"]
                                          ? "error-field form-control"
                                          : "form-control"
                                      }
                                      placeholder="Client Job Code"
                                      name="ClientJobCode"
                                      id="ClientJobCode"
                                      autoFocus={true}
                                      onChange={HandleChange}
                                      maxLength={50}
                                      value={jobData.ClientJobCode}
                                    />
                                    {errors["ClientJobCode"] && (
                                      <div className="error-text">
                                        {errors["ClientJobCode"]}
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-lg-4 mb-3">
                                    <label className="form-label">
                                      Customer Account Manager(Officer)
                                      <span className="text-danger">*</span>
                                    </label>
                                    {/* <select
                                      className={
                                        errors["CustomerAccountManager"]
                                          ? "error-field form-select"
                                          : "form-select"
                                      }
                                      name="CustomerAccountManager"
                                      id="CustomerAccountManager"
                                      onChange={HandleChange}
                                      value={jobData.CustomerAccountManager}
                                    >
                                      <option value="">
                                        Select Customer Account Manager
                                      </option>
                                      {(
                                        AllJobData?.data
                                          ?.customer_account_manager || []
                                      ).map((customer_account_manager) => (
                                        <option
                                          value={
                                            customer_account_manager.customer_account_manager_officer_id
                                          }
                                          key={
                                            customer_account_manager.customer_account_manager_officer_id
                                          }
                                        >
                                          {
                                            customer_account_manager.customer_account_manager_officer_name
                                          }
                                        </option>
                                      ))}
                                    </select> */}

                                    <Select
                                      name="CustomerAccountManager"
                                      id="CustomerAccountManager"
                                      options={customerAccountManagerOptions}
                                      value={customerAccountManagerOptions.find(
                                        (opt) => String(opt.value) === String(jobData.CustomerAccountManager)
                                      )}
                                      onChange={(selectedOption) => {
                                        const e = {
                                          target: {
                                            name: 'CustomerAccountManager',
                                            value: selectedOption.value
                                          }
                                        };
                                        HandleChange(e);
                                      }}
                                      className={
                                        errors["CustomerAccountManager"]
                                          ? "error-field react-select basic-multi-select"
                                          : "react-select basic-multi-select"
                                      }
                                      classNamePrefix="react-select"
                                      isSearchable
                                    />

                                    {errors["CustomerAccountManager"] && (
                                      <div className="error-text">
                                        {errors["CustomerAccountManager"]}
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-lg-4 mb-3">
                                    <label className="form-label">
                                      Service
                                      <span className="text-danger">*</span>
                                    </label>
                                    {/* <select
                                      className={
                                        errors["Service"]
                                          ? "error-field form-select"
                                          : "form-select"
                                      }
                                      name="Service"
                                      id="Service"
                                      onChange={HandleChange}
                                      value={jobData.Service}
                                      disabled={
                                        jobData.Client == "" ? true : false
                                      }
                                    >
                                      <option value="">Select Service</option>
                                      {(AllJobData?.data?.services || []).map(
                                        (service) => (
                                          <option
                                            value={service.service_id}
                                            key={service.service_id}
                                          >
                                            {service.service_name}
                                          </option>
                                        )
                                      )}
                                    </select> */}



                                    <Select
                                      name="Service"
                                      id="Service"
                                      options={serviceOptions}
                                      value={serviceOptions.find(
                                        (opt) => String(opt.value) === String(jobData.Service)
                                      )}
                                      onChange={(selectedOption) => {
                                        const e = {
                                          target: {
                                            name: 'Service',
                                            value: selectedOption.value
                                          }
                                        };
                                        HandleChange(e);
                                      }}
                                      isDisabled={jobData.Client === ""}
                                      className={errors["Service"] ? "error-field react-select basic-multi-select" : "basic-multi-select react-select"}
                                      classNamePrefix="react-select"
                                      isSearchable
                                    />
                                    {errors["Service"] && (
                                      <div className="error-text">
                                        {errors["Service"]}
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-lg-4 mb-3">
                                    <label className="form-label">
                                      Job Type{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    {/* <select
                                      className={
                                        errors["JobType"]
                                          ? "error-field form-select  jobtype"
                                          : "form-select  jobtype"
                                      }
                                      name="JobType"
                                      id="JobType"
                                      onChange={(e) => {
                                        HandleChange(e);
                                        openJobModal(e);
                                      }}
                                      value={jobData.JobType}
                                    >
                                      <option value="">Select Job Type</option>
                                      {get_Job_Type.loading &&
                                        get_Job_Type.data &&
                                        get_Job_Type.data.map((jobtype) => (
                                          <option
                                            value={jobtype.id}
                                            key={jobtype.id}
                                          >
                                            {jobtype.type}
                                          </option>
                                        ))}
                                    </select> */}
                                    <Select
                                      name="JobType"
                                      id="JobType"
                                      options={jobTypeOptions}
                                      value={jobTypeOptions.find(opt => String(opt.value) === String(jobData.JobType))}
                                      onChange={(selectedOption) => {
                                        const e = {
                                          target: {
                                            name: 'JobType',
                                            value: selectedOption.value
                                          }
                                        };
                                        HandleChange(e);
                                        openJobModal(e);
                                      }}
                                      isLoading={get_Job_Type.loading}
                                      className={errors["JobType"] ? "error-field react-select jobtype basic-multi-select" : "basic-multi-select react-select jobtype"}
                                      classNamePrefix="react-select"
                                      isSearchable
                                    />

                                    {errors["JobType"] && (
                                      <div className="error-text">
                                        {errors["JobType"]}
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-lg-4">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Budgeted Time
                                      </label>
                                      <div className="input-group">
                                        {/* Hours Input */}
                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Hours"
                                            onChange={(e) => {
                                              const value = e.target.value;

                                              // Only allow non-negative numbers for hours
                                              if (
                                                value === "" ||
                                                Number(value) >= 0
                                              ) {
                                                setBudgetedHours({
                                                  ...budgetedHours,
                                                  hours: value,
                                                });
                                              }
                                            }}
                                            value={budgetedHours?.hours || ""}
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            H
                                          </span>
                                        </div>

                                        {/* Minutes Input */}
                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Minutes"
                                            onChange={(e) => {
                                              const value = e.target.value;

                                              // Only allow minutes between 0 and 59
                                              if (
                                                value === "" ||
                                                (Number(value) >= 0 &&
                                                  Number(value) <= 59)
                                              ) {
                                                setBudgetedHours({
                                                  ...budgetedHours,
                                                  minutes: value,
                                                });
                                              }
                                            }}
                                            value={budgetedHours?.minutes || ""}
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            M
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-lg-4 mb-3">
                                    <label className="form-label">
                                      Reviewer
                                    </label>
                                    {/* <select
                                      className={
                                        errors["Reviewer"]
                                          ? "error-field form-select"
                                          : "form-select"
                                      }
                                      name="Reviewer"
                                      onChange={HandleChange}
                                      value={jobData.Reviewer}
                                    >
                                      <option value=""> Select Reviewer</option>
                                      {(AllJobData?.data?.reviewer || []).map(
                                        (reviewer) => (
                                          <option
                                            value={reviewer.reviewer_id}
                                            key={reviewer.reviewer_id}
                                          >
                                            {reviewer.reviewer_name +
                                              " (" +
                                              reviewer?.reviewer_email +
                                              ")"}
                                          </option>
                                        )
                                      )}
                                    </select> */}
                                    <Select
                                      name="Reviewer"
                                      id="Reviewer"
                                      options={reviewerOptions}
                                      value={reviewerOptions.find(
                                        (opt) => String(opt.value) === String(jobData.Reviewer)
                                      )}
                                      onChange={(selectedOption) => {
                                        const e = {
                                          target: {
                                            name: 'Reviewer',
                                            value: selectedOption.value
                                          }
                                        };
                                        HandleChange(e);
                                      }}
                                      className={errors["Reviewer"] ? "error-field react-select basic-multi-select" : "react-select basic-multi-select"}
                                      classNamePrefix="react-select"
                                      isSearchable
                                    />
                                    {errors["Reviewer"] && (
                                      <div className="error-text">
                                        {errors["Reviewer"]}
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-lg-4 mb-3">
                                    <label className="form-label">
                                      Allocated To
                                    </label>
                                    {/* <select
                                      className={
                                        errors["AllocatedTo"]
                                          ? "error-field form-select"
                                          : "form-select"
                                      }
                                      name="AllocatedTo"
                                      onChange={HandleChange}
                                      value={jobData.AllocatedTo}
                                    // disabled={ role === "SUPERADMIN" ? false : true}
                                    >
                                      <option value=""> Select Staff</option>
                                      {(AllJobData?.data?.allocated || []).map(
                                        (staff) => (
                                          <option
                                            value={staff.allocated_id}
                                            key={staff.allocated_id}
                                          >
                                            {staff.allocated_name +
                                              " (" +
                                              staff?.allocated_email +
                                              ")"}
                                          </option>
                                        )
                                      )}
                                    </select> */}
                                    <Select
                                      name="AllocatedTo"
                                      id="AllocatedTo"
                                      options={allocatedStaffOptions}
                                      value={allocatedStaffOptions.find(
                                        (opt) => String(opt.value) === String(jobData.AllocatedTo)
                                      )}
                                      onChange={(selectedOption) => {
                                        const e = {
                                          target: {
                                            name: 'AllocatedTo',
                                            value: selectedOption.value
                                          }
                                        };
                                        HandleChange(e);
                                      }}
                                      className={errors["AllocatedTo"] ? "error-field react-select basic-multi-select" : "basic-multi-select react-select"}
                                      classNamePrefix="react-select"
                                      isSearchable
                                    // Uncomment below if you want to enable/disable based on role
                                    // isDisabled={role !== "SUPERADMIN"}
                                    />
                                    {errors["AllocatedTo"] && (
                                      <div className="error-text">
                                        {errors["AllocatedTo"]}
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-lg-4 mb-3">
                                    <label className="form-label">
                                      {" "}
                                      Allocated On{" "}
                                    </label>
                                    <input
                                      type="date"
                                      className={
                                        errors["AllocatedOn"]
                                          ? "error-field form-control"
                                          : "form-control"
                                      }
                                      placeholder="DD-MM-YYYY"
                                      name="AllocatedOn"
                                      onChange={HandleChange}
                                      value={jobData.AllocatedOn}
                                    />
                                    {errors["AllocatedOn"] && (
                                      <div className="error-text">
                                        {errors["AllocatedOn"]}
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-lg-4 mb-3">
                                    <label className="form-label">
                                      Date Received On
                                    </label>
                                    <span className="text-danger">*</span>
                                    <input
                                      type="date"
                                      className={
                                        errors["DateReceivedOn"]
                                          ? "error-field form-control"
                                          : "form-control"
                                      }
                                      placeholder="DD-MM-YYYY"
                                      name="DateReceivedOn"
                                      onChange={HandleChange}
                                      value={jobData.DateReceivedOn || new Date().toISOString().slice(0, 10)}
                                    />
                                    {errors["DateReceivedOn"] && (
                                      <div className="error-text">
                                        {errors["DateReceivedOn"]}
                                      </div>
                                    )}
                                  </div>

                                  {/* <div className="col-lg-4">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Year End
                                      </label>
                                      <input
                                        type="month"
                                        className="form-control"
                                        placeholder="MM/YYYY"
                                        name="YearEnd"
                                        onChange={HandleChange}
                                        value={jobData.YearEnd}
                                      />
                                      {errors["YearEnd"] && (
                                        <div className="error-text">
                                          {errors["YearEnd"]}
                                        </div>
                                      )}
                                    </div>
                                  </div> */}
                                  <div className="col-lg-4">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Total Preparation Time
                                      </label>
                                      <div className="input-group">
                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Hours"
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value === "" ||
                                                Number(value) >= 0
                                              ) {
                                                setPreparationTimne({
                                                  ...PreparationTimne,
                                                  hours: value,
                                                });
                                              }
                                            }}
                                            value={PreparationTimne.hours}
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            H
                                          </span>
                                        </div>
                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Minutes"
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value === "" ||
                                                (Number(value) >= 0 &&
                                                  Number(value) <= 59)
                                              ) {
                                                setPreparationTimne({
                                                  ...PreparationTimne,
                                                  minutes: value,
                                                });
                                              }
                                            }}
                                            value={PreparationTimne.minutes}
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            M
                                          </span>
                                        </div>
                                      </div>
                                      {errors["TotalPreparationTime"] && (
                                        <div className="error-text">
                                          {errors["TotalPreparationTime"]}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-lg-4">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Review Time
                                      </label>
                                      <div className="input-group">
                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Hours"
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value === "" ||
                                                Number(value) >= 0
                                              ) {
                                                setReviewTime({
                                                  ...reviewTime,
                                                  hours: value,
                                                });
                                              }
                                            }}
                                            value={reviewTime.hours}
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            H
                                          </span>
                                        </div>

                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Minutes"
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value === "" ||
                                                (Number(value) >= 0 &&
                                                  Number(value) <= 59)
                                              ) {
                                                setReviewTime({
                                                  ...reviewTime,
                                                  minutes: value,
                                                });
                                              }
                                            }}
                                            value={reviewTime.minutes}
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            M
                                          </span>
                                        </div>
                                      </div>

                                      {errors["TotalPreparationTime"] && (
                                        <div className="error-text">
                                          {errors["TotalPreparationTime"]}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Feedback Incorporation Time
                                      </label>
                                      <div className="input-group">
                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Hours"
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value === "" ||
                                                /^[0-9]*$/.test(value)
                                              ) {
                                                setFeedbackIncorporationTime({
                                                  ...FeedbackIncorporationTime,
                                                  hours: value,
                                                });
                                              }
                                            }}
                                            value={
                                              FeedbackIncorporationTime.hours
                                            }
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            H
                                          </span>
                                        </div>
                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Minutes"
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value === "" ||
                                                (Number(value) >= 0 &&
                                                  Number(value) <= 59)
                                              ) {
                                                setFeedbackIncorporationTime({
                                                  ...FeedbackIncorporationTime,
                                                  minutes: value,
                                                });
                                              }
                                            }}
                                            value={
                                              FeedbackIncorporationTime.minutes
                                            }
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            M
                                          </span>
                                        </div>
                                      </div>
                                      {errors["TotalPreparationTime"] && (
                                        <div className="error-text">
                                          {errors["TotalPreparationTime"]}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-lg-4">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Total Time
                                      </label>
                                      <div className="input-group">
                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Hours"
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value === "" ||
                                                /^[0-9]*$/.test(value)
                                              ) {
                                                setTotalTime({
                                                  ...Totaltime,
                                                  hours: value,
                                                });
                                              }
                                            }}
                                            value={Totaltime.hours}
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            H
                                          </span>
                                        </div>
                                        <div className="hours-div">
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Minutes"
                                            disabled
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value === "" ||
                                                (Number(value) >= 0 &&
                                                  Number(value) <= 59)
                                              ) {
                                                setTotalTime({
                                                  ...Totaltime,
                                                  minutes: value,
                                                });
                                              }
                                            }}
                                            value={Totaltime.minutes}
                                          />
                                          <span
                                            className="input-group-text"
                                            id="basic-addon2"
                                          >
                                            M
                                          </span>
                                        </div>
                                      </div>
                                      {errors["TotalPreparationTime"] && (
                                        <div className="error-text">
                                          {errors["TotalPreparationTime"]}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div
                                    id="invoice_type"
                                    className="col-lg-4 mb-3"
                                  >
                                    <label
                                      htmlFor="firstNameinput"
                                      className="form-label"
                                    >
                                      Engagement Model
                                    </label>
                                    <select
                                      className="form-select invoice_type_dropdown"
                                      name="EngagementModel"
                                      onChange={HandleChange}
                                      value={jobData.EngagementModel}
                                    >
                                      <option value="">
                                        Please Select Engagement Model
                                      </option>
                                      {Object.keys(filteredData).map(
                                        (key, index) => (
                                          <option key={key} value={key}>
                                            {
                                              RearrangeEngagementOptionArr[
                                              index
                                              ]
                                            }
                                          </option>
                                        )
                                      )}
                                    </select>
                                    {errors["EngagementModel"] && (
                                      <div className="error-text">
                                        {errors["EngagementModel"]}
                                      </div>
                                    )}
                                  </div>


                                  <div
                                    id="satff"
                                    className="col-lg-4 mb-3"
                                  >
                                    <label
                                      htmlFor="firstNameinput"
                                      className="form-label"
                                    >
                                      Allocated to (Other)
                                    </label>

                                    <Select
                                      options={allStaffData
                                        ?.filter(data => data.id !== jobData.AllocatedTo && data.id !== jobData.Reviewer && data.id !== staffCreatedId)
                                        ?.map((data) => {
                                          return { label: data.full_name, value: data.id };
                                        })}
                                      isMulti
                                      closeMenuOnSelect={false}
                                      className="basic-multi-select"
                                      name="staff"
                                      id="staff"
                                      value={selectedStaffData}
                                      onChange={(e) => {
                                        setSelectedStaffData(e);
                                      }}
                                      placeholder="Select options"
                                    />

                                  </div>


                                  <div className="col-lg-4">
                                    <div className="mb-3">
                                      <label className="form-label">
                                        Job Priority
                                      </label>
                                      <select
                                        className="form-select"
                                        name="job_priority"
                                        onChange={HandleChange}
                                        value={
                                          jobData.job_priority
                                        }
                                      >
                                        <option value="normal">Normal</option>
                                        <option value="urgent">Urgent</option>
                                      </select>
                                      {errors[
                                        "job_priority"
                                      ] && (
                                          <div className="error-text">
                                            {
                                              errors[
                                              "job_priority"
                                              ]
                                            }
                                          </div>
                                        )}
                                    </div>
                                  </div>


                                </div>
                              </div>
                            </div>
                          </div>
                          {serviceFieldsData?.length > 0 && (
                            <div className="col-lg-12">
                              <div className="card card_shadow">
                                <div className="card-header card-header-light-blue align-items-center d-flex">
                                  <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                    Other Data{" "}
                                  </h4>
                                </div>
                                <div className="card-body">
                                  <div className="" style={{ marginTop: 15 }}>
                                    {/* <div className="row">
                                  {serviceFieldsData?.length > 0 &&
                                    serviceFieldsData?.map((field, index) => (
                                      <div
                                        className="col-lg-4 mb-3"
                                        key={index}
                                      >
                                        <label className="form-label">
                                          {field.name}
                                        </label>
                                        {field.type === "dropdown" ? (
                                          <select
                                            className="form-control"
                                            name={field.key}
                                            onChange={(e) => HandleChange(e)}
                                            value={jobData[field.key]}
                                          >
                                            {field.options?.map(
                                              (option, i) => (
                                                <option
                                                  value={option}
                                                  key={i}
                                                >
                                                  {option}
                                                </option>
                                              )
                                            )}
                                          </select>
                                        ) : (
                                          <input
                                            type={field.type || "text"}
                                            className="form-control"
                                            placeholder={field.name}
                                            name={field.key}
                                            min={field.min}
                                            max={field.max}
                                            onChange={(e) => HandleChange(e)}
                                            value={jobData[field.key]}

                                          />
                                        )}
                                      </div>
                                    ))}
                                </div> */}
                                    <div className="row">
                                      {serviceFieldsData?.length > 0 &&
                                        serviceFieldsData?.map((field, index) => {
                                          // 👇 check if field should be visible
                                          const isVisible = shouldShowField(field, jobData);
                                          if (!isVisible) return null;

                                          return (
                                            <div className="col-lg-4 mb-3" key={index}>
                                              <label className="form-label">{field.name}</label>
                                              {field.type === "dropdown" ? (
                                                <select
                                                  className="form-control"
                                                  name={field.key}
                                                  onChange={(e) => HandleChange(e)}
                                                  value={jobData[field.key] || ""}
                                                >
                                                  <option value="">-- Select --</option>
                                                  {field.options?.map((option, i) => (
                                                    <option value={option} key={i}>
                                                      {option}
                                                    </option>
                                                  ))}
                                                </select>
                                              ) : (
                                                <input
                                                  type={field.type || "text"}
                                                  className="form-control"
                                                  placeholder={field.name}
                                                  name={field.key}
                                                  min={field.min}
                                                  max={field.max}
                                                  onChange={(e) => HandleChange(e)}
                                                  value={jobData[field.key] || ""}
                                                />
                                              )}
                                            </div>
                                          );
                                        })}
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="col-lg-12">
                            <div className="card card_shadow">
                              <div className="card-header align-items-center d-flex card-header-light-blue">
                                <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                  Deadline
                                </h4>
                              </div>
                              <div className="card-body">
                                <div className="" style={{ marginTop: 15 }}>
                                  <div className="row">
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Expected Delivery Date
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        placeholder="DD-MM-YYYY"
                                        name="ExpectedDeliveryDate"
                                        onChange={HandleChange}
                                        value={jobData.ExpectedDeliveryDate}
                                      />
                                      {errors["ExpectedDeliveryDate"] && (
                                        <div className="error-text">
                                          {errors["ExpectedDeliveryDate"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Due On
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        placeholder="DD-MM-YYYY"
                                        name="DueOn"
                                        onChange={HandleChange}
                                        defaultValue={jobData.DueOn}
                                      />
                                      {errors["DueOn"] && (
                                        <div className="error-text">
                                          {errors["DueOn"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Submission Deadline
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        placeholder="DD-MM-YYYY"
                                        name="SubmissionDeadline"
                                        onChange={HandleChange}
                                        value={jobData.SubmissionDeadline}
                                      />
                                      {errors["SubmissionDeadline"] && (
                                        <div className="error-text">
                                          {errors["SubmissionDeadline"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Customer Deadline Date
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        placeholder="DD-MM-YYYY"
                                        name="CustomerDeadlineDate"
                                        onChange={HandleChange}
                                        value={jobData.CustomerDeadlineDate}
                                      />
                                      {errors["CustomerDeadlineDate"] && (
                                        <div className="error-text">
                                          {errors["CustomerDeadlineDate"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        SLA Deadline Date
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        placeholder="DD-MM-YYYY"
                                        name="SLADeadlineDate"
                                        onChange={HandleChange}
                                        value={jobData.SLADeadlineDate}
                                      />
                                      {errors["SLADeadlineDate"] && (
                                        <div className="error-text">
                                          {errors["SLADeadlineDate"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4">
                                      <label className="form-label">
                                        Internal Deadline Date
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control"
                                        placeholder="DD-MM-YYYY"
                                        name="InternalDeadlineDate"
                                        onChange={HandleChange}
                                        value={jobData.InternalDeadlineDate}
                                      />
                                      {errors["InternalDeadlineDate"] && (
                                        <div className="error-text">
                                          {errors["InternalDeadlineDate"]}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="card card_shadow">
                              <div className="card-header card-header-light-blue align-items-center d-flex">
                                <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                  Other Task
                                </h4>
                              </div>
                              <div className="card-body">
                                <div className="" style={{ marginTop: 15 }}>
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label className="form-label">
                                          Filing With Companies House Required?
                                        </label>
                                        <select
                                          className="form-select"
                                          name="FilingWithCompaniesHouseRequired"
                                          onChange={HandleChange}
                                          value={
                                            jobData.FilingWithCompaniesHouseRequired
                                          }
                                        >
                                          <option value="">
                                            Please Select Companies House
                                            Required
                                          </option>
                                          <option value="1">Yes</option>
                                          <option value="0">No</option>
                                        </select>
                                        {errors[
                                          "FilingWithCompaniesHouseRequired"
                                        ] && (
                                            <div className="error-text">
                                              {
                                                errors[
                                                "FilingWithCompaniesHouseRequired"
                                                ]
                                              }
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label className="form-label">
                                          Companies House Filing Date
                                        </label>
                                        <input
                                          type="date"
                                          className="form-control"
                                          name="CompaniesHouseFilingDate"
                                          onChange={HandleChange}
                                          value={
                                            jobData.CompaniesHouseFilingDate
                                          }
                                        />
                                        {errors["CompaniesHouseFilingDate"] && (
                                          <div className="error-text">
                                            {errors["CompaniesHouseFilingDate"]}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Filing with HMRC Required?
                                      </label>
                                      <select
                                        className="form-select invoice_type_dropdown"
                                        name="FilingWithHMRCRequired"
                                        onChange={HandleChange}
                                        value={jobData.FilingWithHMRCRequired}
                                      >
                                        <option value="">
                                          Please Select HMRC Required
                                        </option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                      </select>
                                      {errors["FilingWithHMRCRequired"] && (
                                        <div className="error-text">
                                          {errors["FilingWithHMRCRequired"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label className="form-label">
                                          HMRC Filing Date
                                        </label>
                                        <input
                                          type="date"
                                          className="form-control"
                                          name="HMRCFilingDate"
                                          onChange={HandleChange}
                                          value={jobData.HMRCFilingDate}
                                        />
                                        {errors["HMRCFilingDate"] && (
                                          <div className="error-text">
                                            {errors["HMRCFilingDate"]}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label className="form-label">
                                          Opening Balance Adjustment Required
                                        </label>
                                        <select
                                          className="form-select"
                                          name="OpeningBalanceAdjustmentRequired"
                                          onChange={HandleChange}
                                          value={
                                            jobData.OpeningBalanceAdjustmentRequired
                                          }
                                        >
                                          <option value="">
                                            Please Select Opening Balance
                                            Adjustment
                                          </option>
                                          <option value="1">Yes</option>
                                          <option value="0">No</option>
                                        </select>
                                        {errors[
                                          "OpeningBalanceAdjustmentRequired"
                                        ] && (
                                            <div className="error-text">
                                              {
                                                errors[
                                                "OpeningBalanceAdjustmentRequired"
                                                ]
                                              }
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label className="form-label">
                                          Opening Balance Adjustment Date
                                        </label>
                                        <input
                                          type="date"
                                          className="form-control"
                                          name="OpeningBalanceAdjustmentDate"
                                          onChange={HandleChange}
                                          value={
                                            jobData.OpeningBalanceAdjustmentDate
                                          }
                                        />
                                        {errors[
                                          "OpeningBalanceAdjustmentDate"
                                        ] && (
                                            <div className="error-text">
                                              {
                                                errors[
                                                "OpeningBalanceAdjustmentDate"
                                                ]
                                              }
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>



                          <div className="col-lg-12">
                            <div className="card card_shadow">
                              <div className="card-header align-items-center d-flex card-header-light-blue">
                                <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                  Notes
                                </h4>
                              </div>
                              <div className="card-body">
                                <div className="" style={{ marginTop: 15 }}>
                                  <div className="row">
                                    <div className="mb-3 col-lg-12">
                                      <textarea
                                        type="text"
                                        className={
                                          errors["notes"]
                                            ? "error-field form-control"
                                            : "form-control"
                                        }
                                        placeholder="Enter Notes"
                                        name="notes"
                                        id="notes"
                                        onChange={HandleChange}
                                        value={jobData.notes}
                                      />
                                      {errors["notes"] && (
                                        <div className="error-text">
                                          {errors["notes"]}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {jobModalStatus && (
                      <Modal
                        show={jobModalStatus}
                        onHide={(e) => {
                          jobModalSetStatus(false);
                          HandleReset1();
                          setAddTaskArr([]);
                        }}
                        centered
                        size="xl"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Tasks</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="tablelist-form">
                            <div className="">
                              <div className="row">
                                <div
                                  className="col-md-12"
                                  style={{ display: "flex" }}
                                >
                                  <div className="col-lg-6">

                                  </div>
                                  <div className="col-lg-6">
                                    <div className="col-sm-auto">
                                      <button
                                        className="btn btn-info float-end mb-3"
                                        // disabled={getChecklistId == ""}
                                        onClick={() => setShowAddJobModal(true)}
                                      >
                                        <i className="fa fa-plus pe-1" /> Add
                                        Task
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6 column" id="column1">
                                  <div className="card">
                                    <div className="card-body">
                                      <div id="customerList">
                                        <div className="table-responsive table-card mt-3 mb-1">
                                          <table
                                            className="table align-middle table-nowrap"
                                            id="customerTable"
                                          >
                                            <thead className="table-light">
                                              <tr>
                                                <th>Task Name</th>
                                                <th>Budgeted Hour</th>
                                                <th>Action</th>
                                              </tr>
                                            </thead>
                                            <tbody className="list form-check-all">
                                              {AllChecklistData?.data &&
                                                AllChecklistData?.data.map(
                                                  (checklist) => (
                                                    <tr className="">
                                                      <td>
                                                        {checklist?.task_name}{" "}
                                                      </td>

                                                      <td>
                                                        {checklist?.budgeted_hour
                                                          ? `${checklist.budgeted_hour.split(":")[0]}h ${checklist.budgeted_hour.split(":")[1]}m`
                                                          : ""}
                                                      </td>
                                                      <td>
                                                        <div className="add">
                                                          {AddTaskArr &&
                                                            AddTaskArr?.find(
                                                              (task) =>
                                                                task?.task_id ==
                                                                checklist?.task_id
                                                            ) ? (
                                                            ""
                                                          ) : (
                                                            <button
                                                              className=" btn-info text-white blue-btn"
                                                              onClick={() =>
                                                                AddTask(
                                                                  checklist?.task_id
                                                                )
                                                              }
                                                            >
                                                              +
                                                            </button>
                                                          )}
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  )
                                                )}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6 column" id="column2">
                                  <div className="card">
                                    <div className="card-body">
                                      <div id="customerList">
                                        <div className="table-responsive table-card mt-3 mb-1">
                                          <table
                                            className="table align-middle table-nowrap"
                                            id="customerTable"
                                          >
                                            <thead className="table-light">
                                              <tr>
                                                <th>Task Name</th>
                                                <th>Budgeted Hour</th>
                                                <th>Action</th>
                                              </tr>
                                            </thead>

                                            <tbody className="list form-check-all">
                                              {AddTaskArr &&
                                                AddTaskArr.map((checklist, index) => {
                                                  // split hours and minutes safely
                                                  const [hours, minutes] = (checklist?.budgeted_hour || "0:0").split(":");
                                                  const error = errorsBudgetTimeTask[checklist.task_id];

                                                  return (
                                                    <tr key={checklist.task_id || index}>
                                                      <td>{checklist.task_name} </td>

                                                      {/* Editable Budgeted Hour/Minutes */}
                                                      <td>
                                                        <div className="input-group">
                                                          {/* Hours */}
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            value={hours}
                                                            onChange={(e) => handleBudgetTime(e, index, checklist, "hour")}
                                                            style={{ width: "80px", marginRight: "5px" }}
                                                          />
                                                          <span className="input-group-text">h</span>

                                                          {/* Minutes */}
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            value={minutes}
                                                            onChange={(e) => handleBudgetTime(e, index, checklist, "minute")}
                                                            style={{ width: "80px", marginRight: "5px" }}


                                                          />
                                                          <span className="input-group-text">m</span>
                                                        </div>
                                                        {error && (
                                                          <div className="error-text text-danger">
                                                            {error}
                                                          </div>
                                                        )}
                                                      </td>

                                                      <td>
                                                        <div className="add">
                                                          <button className="delete-icon">
                                                            <i
                                                              className="ti-trash text-danger"
                                                              onClick={() => RemoveTask(checklist.task_id)}
                                                            ></i>
                                                          </button>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  );
                                                })}
                                            </tbody>

                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              jobModalSetStatus(false);
                              HandleReset1();
                              setAddTaskArr([]);
                            }}
                          >
                            <i className="fa fa-times pe-1"></i>
                            Close
                          </Button>
                          <Button
                            variant="btn btn-outline-success float-end "
                            onClick={handleAddCheckList}
                          >
                            <i className="far fa-save pe-1"></i>
                            Submit
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    )}

                    {showAddJobModal && (
                      <Modal
                        show={showAddJobModal}
                        onHide={() => {
                          setShowAddJobModal(false);
                          HandleReset();
                        }}
                        centered
                        size="sm"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Add Task</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="row">
                            <div className="col-lg-12">
                              <label className="form-label ">Task Name</label>
                              <div>
                                <input
                                  type="text"
                                  placeholder="Enter Task name"
                                  name="taskname"
                                  className={
                                    taskNameError
                                      ? "error-field form-control"
                                      : "form-control"
                                  }
                                  onChange={handleChange1}
                                  value={taskName}
                                />
                                {taskNameError && (
                                  <div className="error-text text-danger">
                                    {taskNameError}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-12 mt-2">
                              <div className="mb-3">
                                <label className="form-label">
                                  Budgeted Time
                                </label>
                                <div className="input-group">
                                  <div className="hours-div">
                                    <input
                                      type="text"
                                      className={
                                        BudgetedHoureError
                                          ? "error-field form-control"
                                          : "form-control"
                                      }
                                      placeholder="Hours"
                                      name="budgeted_hour"
                                      onChange={(e) => {
                                        handleChange1(e);
                                      }}
                                      value={BudgetedHoursAddTask.hours}
                                    />
                                    <span className="input-group-text">H</span>
                                  </div>
                                  <div className="hours-div ">
                                    <input
                                      type="text"
                                      className={
                                        BudgetedMinuteError
                                          ? "error-field form-control"
                                          : "form-control"
                                      }
                                      placeholder="Minutes"
                                      name="budgeted_minute"
                                      onChange={(e) => {
                                        handleChange1(e);
                                      }}
                                      value={BudgetedHoursAddTask.minutes}
                                    />
                                    <span className="input-group-text">M</span>
                                  </div>
                                </div>
                                {BudgetedHoureError ? (
                                  <div className="error-text text-danger">
                                    {BudgetedHoureError}
                                  </div>
                                ) : BudgetedMinuteError ? (
                                  <div className="error-text text-danger">
                                    {BudgetedMinuteError}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setShowAddJobModal(false);
                              HandleReset();
                            }}
                          >
                            <i className="fa fa-times pe-1"></i>
                            Close
                          </Button>
                          <Button
                            variant="btn btn-info text-white float-end blue-btn"
                            onClick={handleAddTask}
                          >
                            <i className="fa fa-plus pe-1"></i>
                            Add
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    )}

                    <div className="hstack gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-info text-white float-end blue-btn"
                        onClick={handleSubmit}
                      >
                        <i className="fa fa-plus pe-1"></i>Add Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;

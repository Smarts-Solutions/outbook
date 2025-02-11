import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GetAllJabData,
  AddAllJobType,
  GET_ALL_CHECKLIST,
} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import { JobType } from "../../../../ReduxStore/Slice/Settings/settingSlice";
import { Modal, Button } from "react-bootstrap";
import { ScrollToViewFirstError } from "../../../../Utils/Comman_function";
import { CreateJobErrorMessage } from "../../../../Utils/Common_Message";
import { use } from "react";

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
  const [jobData, setJobData] = useState({
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
    DateReceivedOn: "",
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
    Bookkeeping_Frequency_id_2:"Daily",

  });

  useEffect(() => {
    setJobData((prevState) => ({
      ...prevState,
      AccountManager: AllJobData?.data?.Manager?.[0]?.manager_name || "",
      Customer: AllJobData?.data?.customer?.customer_trading_name || "",
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
          }));
        } else {
          setAllJobData({
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
    GetJobData();
  }, []);

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
              const isIncluded = response.data[0].client_type_id
                .split(",")
                .includes(response.data[0].client_type);
              if (isIncluded == true) {
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

    const date = new Date();
    if (name == "Service" && [1, 3, 4, 5, 6, 7, 8].includes(Number(value))) {
      if (value == 1) {
        date.setDate(date.getDate() + 28);
        setJobData((prevState) => ({
          ...prevState,
          SLADeadlineDate: date.toISOString().split("T")[0],
        }));
      } else if (value == 4) {
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
  if (AddTaskArr.length > 0) {
    budgeted_hour_totalTime = AddTaskArr.reduce(
      (acc, task) => {
        const [hours, minutes] = task.budgeted_hour.split(":").map(Number);

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
    const req = {
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
            fte_dedicated_staffing: "Fte Dedicated Staffing",
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

  const handleAddCheckList = () => {
    jobModalSetStatus(false);
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
            "Monthly",
            "Quarterly",
            "Yearly",
          ],
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
            "Quarterly",
            "Yearly",
            "Weekly & Monthly",
          ],
        },
        {
          name: "Type of Payslip",
          key: "Type_of_Payslip_id_3",
          type: "dropdown",
          options: ["Wages Only", "Wages/Pension"],
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
      ],
    },
    {
      id: 7, // Company Secretarial
      fields: [],
    },
  ];

  useEffect(() => {
    setServiceFieldsData(
      serviceFields[jobData?.Service]?.fields || serviceFields[0]?.fields
    );


    if(jobData?.Service == 2 && jobData.Bookkeeping_Frequency_id_2 == "Daily"){
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
      Bookkeeping_Frequency_id_2: "Daily",
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
      Payroll_Frequency_id_3: "Weekly",
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


    }));
  }, []);

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

                                      <select
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
                                      </select>

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
                                    <select
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
                                    </select>
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
                                    <select
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
                                    </select>
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
                                    <select
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
                                    </select>

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
                                    <select
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
                                    </select>
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
                                    <select
                                      className={
                                        errors["AllocatedTo"]
                                          ? "error-field form-select"
                                          : "form-select"
                                      }
                                      name="AllocatedTo"
                                      onChange={HandleChange}
                                      value={jobData.AllocatedTo}
                                      // disabled={role === "ADMIN" || role === "SUPERADMIN" ? false : true}
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
                                    </select>
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
                                      value={jobData.DateReceivedOn}
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
                                </div>
                              </div>
                            </div>
                          </div>
                          {serviceFieldsData?.length > 0 && (
                            <div className="card card_shadow">
                              <div className="card-header card-header-light-blue align-items-center d-flex">
                                <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                  Other Data{" "}
                                </h4>
                              </div>
                              <div className="card-body">
                                <div className="" style={{ marginTop: 15 }}>
                                  <div className="row">
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
                                        value={jobData.DueOn}
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

                          {/* sssj  {jobData.EngagementModel !=
                            "fte_dedicated_staffing" && (
                              <div className="col-lg-12">
                                <div className="col-lg-12">
                                  <div className="card card_shadow">
                                    <div className="card-header card-header-light-blue align-items-center d-flex">
                                      <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                        Invoice
                                      </h4>
                                    </div>
                                    <div className="card-body">
                                      <div style={{ marginTop: 15 }}>
                                        <div className="row">
                                          <div className="col-lg-4 mb-3">
                                            <label className="form-label">
                                              Invoiced
                                            </label>
                                            <select
                                              className="invoiced_dropdown form-select"
                                              name="Invoiced"
                                              onChange={HandleChange}
                                              value={jobData.Invoiced}
                                            >
                                              <option value="">
                                                Please Select Invoiced
                                              </option>
                                              <option value="1">Yes</option>
                                              <option value="0">No</option>
                                            </select>
                                            {errors["Invoiced"] && (
                                              <div className="error-text">
                                                {errors["Invoiced"]}
                                              </div>
                                            )}
                                          </div>
                                          <div className="col-lg-4 mb-3">
                                            <label className="form-label">
                                              Currency
                                            </label>
                                            <select
                                              className="invoiced_dropdown form-select"
                                              name="Currency"
                                              onChange={HandleChange}
                                              value={jobData.Currency}
                                            >
                                              <option value="">
                                                Please Select Currency
                                              </option>
                                              {(
                                                AllJobData?.data?.currency || []
                                              ).map((currency) => (
                                                <option
                                                  value={currency.country_id}
                                                  key={currency.country_id}
                                                >
                                                  {currency.currency_name}
                                                </option>
                                              ))}
                                            </select>
                                            {errors["Currency"] && (
                                              <div className="error-text">
                                                {errors["Currency"]}
                                              </div>
                                            )}
                                          </div>
                                          <div className="col-lg-4 mb-3">
                                            <label className="form-label">
                                              Invoice Value
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Invoice Value"
                                              name="InvoiceValue"
                                              onChange={HandleChange}
                                              value={jobData.InvoiceValue}
                                            />
                                            {errors["InvoiceValue"] && (
                                              <div className="error-text">
                                                {errors["InvoiceValue"]}
                                              </div>
                                            )}
                                          </div>
                                          <div className="col-lg-4 mb-3">
                                            <label className="form-label">
                                              Invoice Date
                                            </label>
                                            <input
                                              type="date"
                                              className="form-control"
                                              placeholder="DD-MM-YYYY"
                                              name="InvoiceDate"
                                              onChange={HandleChange}
                                              value={jobData.InvoiceDate}
                                              max={
                                                new Date()
                                                  .toISOString()
                                                  .split("T")[0]
                                              }
                                            />
                                            {errors["InvoiceDate"] && (
                                              <div className="error-text">
                                                {errors["InvoiceDate"]}
                                              </div>
                                            )}
                                          </div>

                                          <div className="col-lg-4">
                                            <div className="mb-3">
                                              <label className="form-label">
                                                Invoice{" "}
                                              </label>
                                              <div className="input-group">
                                                <div className="hours-div">
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Hours"
                                                    onChange={(e) => {
                                                      const value =
                                                        e.target.value;
                                                      if (
                                                        value === "" ||
                                                        Number(value) >= 0
                                                      ) {
                                                        setInvoiceTime({
                                                          ...invoiceTime,
                                                          hours: value,
                                                        });
                                                      }
                                                    }}
                                                    value={invoiceTime.hours}
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
                                                      const value =
                                                        e.target.value;
                                                      if (
                                                        value === "" ||
                                                        (Number(value) >= 0 &&
                                                          Number(value) <= 59)
                                                      ) {
                                                        setInvoiceTime({
                                                          ...invoiceTime,
                                                          minutes: value,
                                                        });
                                                      }
                                                    }}
                                                    value={invoiceTime.minutes}
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

                                          <div
                                            id="invoicedremark"
                                            className="col-lg-4"
                                          >
                                            <label className="form-label">
                                              Invoice Remark
                                            </label>
                                            <textarea
                                              className="form-control"
                                              placeholder="Invoice Remark"
                                              name="InvoiceRemark"
                                              onChange={HandleChange}
                                              value={jobData.InvoiceRemark}
                                              maxLength={500}
                                            />

                                            {errors["InvoiceRemark"] && (
                                              <div className="error-text">
                                                {errors["InvoiceRemark"]}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )} */}

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
                        size="lg"
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
                                    {/* <select
                                      id="search-select"
                                      className="form-select mb-3"
                                      aria-label="Default select example"
                                      style={{ color: "#8a8c8e !important" }}
                                      onChange={(e) => {
                                        setChecklistId(e.target.value);
                                      }}
                                      value={getChecklistId}
                                    >
                                      <option value="">
                                        Select Checklist Name
                                      </option>
                                      {AllChecklist &&
                                        AllChecklist.data.map((checklist) => (
                                          <option
                                            value={checklist.checklists_id}
                                            key={checklist.checklists_id}
                                          >
                                            {checklist.check_list_name}
                                          </option>
                                        ))}
                                    </select> */}
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
                                              {AllChecklistData.data &&
                                                AllChecklistData.data.map(
                                                  (checklist) => (
                                                    <tr className="">
                                                      <td>
                                                        {checklist.task_name}{" "}
                                                      </td>

                                                      <td>
                                                        {" "}
                                                        {
                                                          checklist.budgeted_hour.split(
                                                            ":"
                                                          )[0]
                                                        }
                                                        h{" "}
                                                        {" " +
                                                          checklist.budgeted_hour.split(
                                                            ":"
                                                          )[1]}
                                                        m{" "}
                                                      </td>
                                                      <td>
                                                        <div className="add">
                                                          {AddTaskArr &&
                                                          AddTaskArr.find(
                                                            (task) =>
                                                              task.task_id ==
                                                              checklist.task_id
                                                          ) ? (
                                                            ""
                                                          ) : (
                                                            <button
                                                              className=" btn-info text-white blue-btn"
                                                              onClick={() =>
                                                                AddTask(
                                                                  checklist.task_id
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
                                <div className="col-lg-6 " id="column2">
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
                                                AddTaskArr.map((checklist) => (
                                                  <tr className="">
                                                    <td>
                                                      {checklist.task_name}{" "}
                                                    </td>
                                                    <td>
                                                      {
                                                        checklist.budgeted_hour.split(
                                                          ":"
                                                        )[0]
                                                      }
                                                      h{" "}
                                                      {
                                                        checklist.budgeted_hour.split(
                                                          ":"
                                                        )[1]
                                                      }
                                                      m
                                                    </td>

                                                    {/* <td>{checklist.budgeted_hour} hr</td> */}
                                                    <td>
                                                      <div className="add">
                                                        <button className="delete-icon">
                                                          <i
                                                            className="ti-trash text-danger"
                                                            onClick={() =>
                                                              RemoveTask(
                                                                checklist.task_id
                                                              )
                                                            }
                                                          ></i>
                                                        </button>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                ))}
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

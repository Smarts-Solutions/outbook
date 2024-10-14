import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GetAllJabData,
  UpdateJob,
  GET_ALL_CHECKLIST,
} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import { JobAction } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import { JobType } from "../../../../ReduxStore/Slice/Settings/settingSlice";
import { ScrollToViewFirstError } from "../../../../Utils/Comman_function";
import { Modal, Button } from "react-bootstrap";
import { CreateJobErrorMessage } from "../../../../Utils/Common_Message";

const EditJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffCreatedId = JSON.parse(localStorage.getItem("staffDetails")).id;
  const dispatch = useDispatch();
  const [AllJobData, setAllJobData] = useState({ loading: false, data: [] });
  const [getJobDetails, setGetJobDetails] = useState({ loading: false, data: {} });
  const [errors, setErrors] = useState({});
  const [jobModalStatus, jobModalSetStatus] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [getChecklistId, setChecklistId] = useState("");
  const [AllChecklist, setAllChecklist] = useState({ loading: false, data: [] });
  const [AllChecklistData, setAllChecklistData] = useState({ loading: false, data: [] });
  const [AddTaskArr, setAddTaskArr] = useState([]);
  const [taskNameError, setTaskNameError] = useState("");
  const [BudgetedHoureError, setBudgetedHourError] = useState("");
  const [taskName, setTaskName] = useState("");
  const [PreparationTimne, setPreparationTimne] = useState({ hours: "", minutes: "", });
  const [FeedbackIncorporationTime, setFeedbackIncorporationTime] = useState({ hours: "", minutes: "" });
  const [reviewTime, setReviewTime] = useState({ hours: "", minutes: "" });
  const [budgetedHours, setBudgetedHours] = useState({ hours: "", minutes: "" });
  const [invoiceTime, setInvoiceTime] = useState({ hours: "", minutes: "" });
  const [BudgetedHoursAddTask, setBudgetedHoursAddTask] = useState({ hours: "", minutes: "" });
  const [BudgetedMinuteError, setBudgetedMinuteError] = useState("");
  const [Totaltime, setTotalTime] = useState({ hours: "", minutes: "" });
  const [get_Job_Type, setJob_Type] = useState({ loading: false, data: [] });
  const [tempTaskArr, setTempTaskArr] = useState([]);
  const [tempChecklistId, setTempChecklistId] = useState("");

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
    Turnover: "0.00",
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
    status_type: null,
  });

  console.log("AllJobData", AllJobData);

  const JobDetails = async () => {
    const req = { action: "getByJobId", job_id: location.state.job_id };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          if (Object.keys(response.data).length > 0) {
            setChecklistId(response.data.tasks?.checklist_id ?? 0);
            setTempChecklistId(response.data.tasks?.checklist_id ?? 0);
            setTempTaskArr(response.data.tasks?.task ?? []);
            setAddTaskArr(response.data.tasks?.task ?? []);
            setBudgetedHours({
              hours: response.data.budgeted_hours?.split(":")[0] ?? "",
              minutes: response.data.budgeted_hours?.split(":")[1] ?? "",
            });
            setTotalTime({
              hours: response.data.total_time?.split(":")[0] ?? "",
              minutes: response.data.total_time?.split(":")[1] ?? "",
            });

            setReviewTime({
              hours: response.data.review_time?.split(":")[0] ?? "",
              minutes: response.data.review_time?.split(":")[1] ?? "",
            });

            setFeedbackIncorporationTime({
              hours:
                response.data.feedback_incorporation_time?.split(":")[0] ?? "",
              minutes:
                response.data.feedback_incorporation_time?.split(":")[1] ?? "",
            });

            setPreparationTimne({
              hours: response.data.total_preparation_time?.split(":")[0] ?? "",
              minutes:
                response.data.total_preparation_time?.split(":")[1] ?? "",
            });

            setInvoiceTime({
              hours: response.data.invoice_hours?.split(":")[0] ?? "",
              minutes: response.data.invoice_hours?.split(":")[1] ?? "",
            });

            setJobData((prevState) => ({
              ...prevState,
              AccountManager: `${response.data.outbooks_acount_manager_first_name ?? ""
                } ${response.data.outbooks_acount_manager_last_name ?? ""}`,
              Customer: response.data.customer_trading_name ?? "",
              Client:
                location.state.goto == "Customer"
                  ? response.data.client_id
                  : response.data.client_trading_name ?? "",
              ClientJobCode: response.data.client_job_code ?? "",
              CustomerAccountManager:
                response.data.account_manager_officer_id ?? "",
              Service: response.data.service_id ?? "",
              JobType: response.data.job_type_id ?? "",
              Reviewer: response.data.reviewer_id ?? "",
              AllocatedTo: response.data.allocated_id ?? "",
              AllocatedOn: response.data.allocated_on?.split("T")[0] ?? null,
              DateReceivedOn:
                response.data.date_received_on?.split("T")[0] ?? null,
              YearEnd: response.data.year_end ?? "",
              EngagementModel: response.data.engagement_model ?? "",
              ExpectedDeliveryDate:
                response.data.expected_delivery_date?.split("T")[0] ?? null,
              DueOn: response.data.due_on?.split("T")[0] ?? null,
              SubmissionDeadline:
                response.data.submission_deadline?.split("T")[0] ?? null,
              CustomerDeadlineDate:
                response.data.customer_deadline_date?.split("T")[0] ?? null,
              SLADeadlineDate:
                response.data.sla_deadline_date?.split("T")[0] ?? null,
              InternalDeadlineDate:
                response.data.internal_deadline_date?.split("T")[0] ?? null,
              FilingWithCompaniesHouseRequired:
                response.data.filing_Companies_required ?? false,
              CompaniesHouseFilingDate:
                response.data.filing_Companies_date?.split("T")[0] ?? null,
              FilingWithHMRCRequired:
                response.data.filing_hmrc_required ?? false,
              HMRCFilingDate:
                response.data.filing_hmrc_date?.split("T")[0] ?? null,
              OpeningBalanceAdjustmentRequired:
                response.data.opening_balance_required ?? false,
              OpeningBalanceAdjustmentDate:
                response.data.opening_balance_date?.split("T")[0] ?? null,
              NumberOfTransactions: response.data.number_of_transaction ?? 0,
              NumberOfTrialBalanceItems:
                response.data.number_of_balance_items ?? 0,
              Turnover: response.data.turnover ?? 0.0,
              NoOfEmployees: response.data.number_of_employees ?? 0,
              VATReconciliation: response.data.vat_reconciliation ?? "",
              Bookkeeping: response.data.bookkeeping ?? "",
              ProcessingType: response.data.processing_type ?? "",
              Invoiced: response.data.invoiced ?? false,
              Currency: response.data.currency_id ?? "0",
              InvoiceValue: response.data.invoice_value ?? 0,
              InvoiceDate: response.data.invoice_date?.split("T")[0] ?? null,
              InvoiceHours: response.data.invoice_hours ?? "",
              InvoiceRemark: response.data.invoice_remark ?? "",
              status_type: response.data.status_type ?? null,
            }));
          }

          setGetJobDetails({
            loading: true,
            data: response.data,
          });
        } else {
          setGetJobDetails({
            loading: true,
            data: {},
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    JobDetails();
  }, []);

  const getAllChecklist = async () => {
    const req = {
      action: "getByServiceWithJobType",
      service_id: jobData.Service,
      customer_id: getJobDetails?.data?.customer_id || 0,
      job_type_id: jobData.JobType,
      clientId: getJobDetails.data.client_id,
    };
    const data = { req: req, authToken: token };
    await dispatch(GET_ALL_CHECKLIST(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setAllChecklist({
            loading: true,
            data: response.data,
          });
        } else {
          setAllChecklist({
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
    getAllChecklist();
  }, [jobData.JobType]);

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

  const GetJobData = async () => {
    const req = { customer_id: getJobDetails?.data?.customer_id || 0 };
    const data = { req: req, authToken: token };
    await dispatch(GetAllJabData(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setAllJobData({
            loading: true,
            data: response.data,
          });
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
  }, [getJobDetails]);

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

  const HandleChange = (e) => {
    const { name, value } = e.target;
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

  function formatTime(hours, minutes) {
    const formattedHours =
      hours != "" || hours != null ? String(hours).padStart(2, "0") : "00";
    const formattedMinutes =
      minutes != "" || minutes != null
        ? String(minutes).padStart(2, "0")
        : "00";
    return `${formattedHours}:${formattedMinutes}`;
  }

  const handleSubmit = async () => {
    const req = {
      job_id: location.state.job_id,
      staffCreatedId: staffCreatedId,
      account_manager_id:
        getJobDetails.data && getJobDetails.data.outbooks_acount_manager_id,
      customer_id: getJobDetails.data && getJobDetails.data.customer_id,
      client_id: getJobDetails.data && getJobDetails.data.client_id,
      client_job_code: jobData.ClientJobCode,
      customer_contact_details_id: Number(jobData.CustomerAccountManager),
      service_id: Number(jobData.Service),
      job_type_id: Number(jobData.JobType),
      budgeted_hours: formatTime(
        budgeted_hour_totalTime.hours,
        budgeted_hour_totalTime.minutes
      ),
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
      sla_deadline_date: jobData.SLADeadlineDate,
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
      invoiced:
        jobData.EngagementModel == "fte_dedicated_staffing"
          ? ""
          : jobData.Invoiced,
      currency:
        jobData.EngagementModel == "fte_dedicated_staffing"
          ? ""
          : Number(jobData.Currency),
      invoice_value:
        jobData.EngagementModel == "fte_dedicated_staffing"
          ? ""
          : jobData.InvoiceValue,
      invoice_date:
        jobData.EngagementModel == "fte_dedicated_staffing"
          ? ""
          : jobData.InvoiceDate,
      invoice_hours: formatTime(invoiceTime.hours, invoiceTime.minutes),
      invoice_remark:
        jobData.EngagementModel == "fte_dedicated_staffing"
          ? ""
          : jobData.InvoiceRemark,
      status_type: jobData.status_type,
      tasks: {
        checklist_id: getChecklistId,
        task: AddTaskArr,
      },
    };

    const data = { req: req, authToken: token };
    if (validate()) {
      await dispatch(UpdateJob(data))
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
          "fte_dedicated_staffing": "Fte Dedicated Staffing",
          "percentage_model": "Percentage Model",
          "adhoc_payg_hourly": "Adhoc Payg Hourly",
          "customised_pricing": "Customised Pricing"
        };
        
        if (keyMapping[key]) {
          RearrangeEngagementOptionArr.push(keyMapping[key]);
        }
        
        obj[key] = AllJobData.data.engagement_model[0][key];
        return obj;
      }, {})
    : {};

 
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
    setAddTaskArr(tempTaskArr);
    setChecklistId(tempChecklistId);
  };

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

  const handleAddCheckList = () => {
    jobModalSetStatus(false);
    setTempTaskArr(AddTaskArr);
    setTempChecklistId(getChecklistId);
  };

  let budgeted_hour_totalTime = { hours: "", minutes: "" };
  if (AddTaskArr.length > 0) {
    budgeted_hour_totalTime = AddTaskArr.reduce(
      (acc, task) => {
        if (task.budgeted_hour != null) {
          const [hours, minutes] = task.budgeted_hour.split(":").map(Number);

          acc.hours += hours;
          acc.minutes += minutes;

          // Convert every 60 minutes into an hour
          if (acc.minutes >= 60) {
            acc.hours += Math.floor(acc.minutes / 60);
            acc.minutes = acc.minutes % 60;
          }
        }
        return acc;
      },
      { hours: 0, minutes: 0 }
    );
  }



  return (
    <div>
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header d-flex  step-header-blue">
                <button
                  type="button"
                  className="btn p-0"
                  onClick={() => window.history.back()}
                >
                  <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4" />
                </button>
                <h3 className="card-title mb-0">Update Job</h3>
              </div>

              <div className="card-body form-steps">
                <div>
                  <div className="tab-content">
                    <div className="tab-pane fade show active">
                      <div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="card card_shadow">
                              <div className="card-header align-items-center d-flex card-header-light-blue ">
                                <h4 className="card-title mb-0 flex-grow-1">
                                  Job Information
                                </h4>
                              </div>
                              <div className="card-body">
                                <div className="row">
                                  <div className="mb-3 col-lg-4">
                                    <label className="form-label">
                                      {" "}
                                      Outbook Account Manager
                                    </label>
                                    <input
                                      type="text"
                                      className={errors["AccountManager"] ? "error-field form-control" : "form-control"}
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
                                    </label>
                                    <input
                                      type="text"
                                      className={errors["Customer"] ? "error-field form-control" : "form-control"}
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
                                    <div className="col-lg-4">
                                      <label className="form-label">
                                        Client
                                      </label>
                                      <select
                                        className={errors["Client"] ? "error-field form-select" : "form-select"}
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
                                      </label>
                                      <input
                                        type="text"
                                        className={errors["Client"] ? "error-field form-control" : "form-control"}
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
                                      className={errors["ClientJobCode"] ? "error-field form-control" : "form-control"}
                                      placeholder="Client Job Code"
                                      name="ClientJobCode"
                                      id="ClientJobCode"
                                      onChange={HandleChange}
                                      value={jobData.ClientJobCode}
                                      maxLength={30}
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
                                    </label>
                                    <select
                                      className={errors["CustomerAccountManager"] ? "error-field form-select" : "form-select"}

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

                                  <div className="col-lg-4">
                                    <label className="form-label">
                                      Service
                                    </label>
                                    <select
                                      className={errors["Service"] ? "error-field form-select" : "form-select"}
                                      name="Service"
                                      id="Service"
                                      onChange={HandleChange}
                                      value={jobData.Service}
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
                                      Job Type
                                    </label>
                                    <select
                                      className={errors["JobType"] ? "error-field form-select  jobtype" : "form-select  jobtype"}
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
                                                setBudgetedHours({
                                                  ...budgetedHours,
                                                  hours: value,
                                                });
                                              }
                                            }}
                                            value={
                                              budgeted_hour_totalTime !=
                                                undefined
                                                ? budgeted_hour_totalTime.hours
                                                : "0"
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
                                                setBudgetedHours({
                                                  ...budgetedHours,
                                                  minutes: value,
                                                });
                                              }
                                            }}
                                            value={
                                              budgeted_hour_totalTime !=
                                                undefined
                                                ? budgeted_hour_totalTime.minutes
                                                : "0"
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
                                    </div>
                                  </div>

                                  <div className="col-lg-4">
                                    <label className="form-label">
                                      Reviewer
                                    </label>
                                    <select
                                      className="form-select"
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
                                            {reviewer.reviewer_name}
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

                                  <div className="col-lg-4">
                                    <label className="form-label">
                                      Allocated To
                                    </label>
                                    <select
                                      className="form-select"
                                      name="AllocatedTo"
                                      onChange={HandleChange}
                                      value={jobData.AllocatedTo}
                                    >
                                      <option value=""> Select Staff</option>
                                      {(AllJobData?.data?.allocated || []).map(
                                        (staff) => (
                                          <option
                                            value={staff.allocated_id}
                                            key={staff.allocated_id}
                                          >
                                            {staff.allocated_name}
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

                                  <div className="col-lg-4">
                                    <label className="form-label">
                                      {" "}
                                      Allocated On{" "}
                                    </label>
                                    <input
                                      type="date"
                                      className="form-control mb-3"
                                      placeholder="DD-MM-YYYY"
                                      name="AllocatedOn"
                                      onChange={HandleChange}
                                      value={jobData.AllocatedOn}
                                      max={
                                        new Date().toISOString().split("T")[0]
                                      }
                                    />
                                    {errors["AllocatedOn"] && (
                                      <div className="error-text">
                                        {errors["AllocatedOn"]}
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-lg-4">
                                    <label className="form-label">
                                      Date Received On
                                    </label>
                                    <input
                                      type="date"
                                      className="form-control mb-3"
                                      placeholder="DD-MM-YYYY"
                                      name="DateReceivedOn"
                                      onChange={HandleChange}
                                      value={jobData.DateReceivedOn}
                                      max={
                                        new Date().toISOString().split("T")[0]
                                      }
                                    />
                                    {errors["DateReceivedOn"] && (
                                      <div className="error-text">
                                        {errors["DateReceivedOn"]}
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-lg-4">
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
                                  </div>

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

                                  <div id="invoice_type" className="col-lg-4">
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
                                      {Object.keys(filteredData).map((key, index) => (
                                        <option key={key} value={key}>
                                          {RearrangeEngagementOptionArr[index]}
                                        </option>
                                      ))}
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

                          <div className="col-lg-12">
                            <div className="card card_shadow">
                              <div className="card-header align-items-center d-flex card-header-light-blue">
                                <h4 className="card-title mb-0 flex-grow-1">
                                  Deadline
                                </h4>
                              </div>
                              <div className="card-body">
                                <div className="" style={{ marginTop: 15 }}>
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <label className="form-label">
                                        Expected Delivery Date
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control mb-3"
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
                                    <div className="col-lg-4">
                                      <label className="form-label">
                                        Due On
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control mb-3"
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
                                    <div className="col-lg-4">
                                      <label className="form-label">
                                        Submission Deadline
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control mb-3"
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
                                    <div className="col-lg-4">
                                      <label className="form-label">
                                        Customer Deadline Date
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control mb-3"
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
                                    <div className="col-lg-4">
                                      <label className="form-label">
                                        SLA Deadline Date
                                      </label>
                                      <input
                                        type="date"
                                        className="form-control mb-3"
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
                                        className="form-control mb-3"
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
                              <div className="card-header align-items-center d-flex card-header-light-blue">
                                <h4 className="card-title mb-0 flex-grow-1">
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
                            <div className="card card_shadow">
                              <div className="card-header align-items-center d-flex card-header-light-blue">
                                <h4 className="card-title mb-0 flex-grow-1">
                                  {" "}
                                  Other Data{" "}
                                </h4>
                              </div>
                              <div className="card-body">
                                <div className="" style={{ marginTop: 15 }}>
                                  <div className="row">
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Number of Transactions{" "}
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Number of Transactions"
                                        name="NumberOfTransactions"
                                        onChange={HandleChange}
                                        value={jobData.NumberOfTransactions}
                                      />
                                      {errors["NumberOfTransactions"] && (
                                        <div className="error-text">
                                          {errors["NumberOfTransactions"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Number of Trial Balance Items
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Number of Trial Balance Items"
                                        name="NumberOfTrialBalanceItems"
                                        onChange={HandleChange}
                                        value={
                                          jobData.NumberOfTrialBalanceItems
                                        }
                                      />
                                      {errors["NumberOfTrialBalanceItems"] && (
                                        <div className="error-text">
                                          {errors["NumberOfTrialBalanceItems"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Turnover
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Turnover"
                                        name="Turnover"
                                        onChange={HandleChange}
                                        value={jobData.Turnover}
                                      />
                                      {errors["Turnover"] && (
                                        <div className="error-text">
                                          {errors["Turnover"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        {" "}
                                        No.Of Employees{" "}
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="No.Of Employees"
                                        name="NoOfEmployees"
                                        onChange={HandleChange}
                                        value={jobData.NoOfEmployees}
                                      />
                                      {errors["NoOfEmployees"] && (
                                        <div className="error-text">
                                          {errors["NoOfEmployees"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        VAT Reconciliation
                                      </label>
                                      <select
                                        className="form-select invoice_type_dropdown"
                                        name="VATReconciliation"
                                        onChange={HandleChange}
                                        value={jobData.VATReconciliation}
                                      >
                                        <option value="">
                                          Please Select VAT Reconciliation
                                        </option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                      </select>
                                      {errors["VATReconciliation"] && (
                                        <div className="error-text">
                                          {errors["VATReconciliation"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Bookkeeping?
                                      </label>
                                      <select
                                        className="form-select invoice_type_dropdown"
                                        name="Bookkeeping"
                                        onChange={HandleChange}
                                        value={jobData.Bookkeeping}
                                      >
                                        <option value="">
                                          Please Select Bookkeeping
                                        </option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                      </select>
                                      {errors["Bookkeeping"] && (
                                        <div className="error-text">
                                          {errors["Bookkeeping"]}
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                      <label className="form-label">
                                        Processing Type
                                      </label>
                                      <select
                                        className="form-select invoice_type_dropdown"
                                        name="ProcessingType"
                                        onChange={HandleChange}
                                        value={jobData.ProcessingType}
                                      >
                                        <option value="1"> Manual </option>
                                        <option value="2">Software</option>
                                      </select>
                                      {errors["ProcessingType"] && (
                                        <div className="error-text">
                                          {errors["ProcessingType"]}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {jobData.EngagementModel !=
                            "fte_dedicated_staffing" && (
                              <div className="col-lg-12">
                                <div className="card card_shadow">
                                  <div className="card-header align-items-center d-flex card-header-light-blue">
                                    <h4 className="card-title mb-0 flex-grow-1">
                                      Invoice
                                    </h4>
                                  </div>
                                  <div className="card-body">
                                    <div style={{ marginTop: 15 }}>
                                      <div className="row">
                                        <div className="col-lg-4">
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
                                        <div className="col-lg-4">
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
                                        <div className="col-lg-4">
                                          <label className="form-label">
                                            {" "}
                                            Invoice Value{" "}
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
                                        <div className="col-lg-4">
                                          <label className="form-label">
                                            {" "}
                                            Invoice Date{" "}
                                          </label>
                                          <input
                                            type="date"
                                            className="form-control mb-3"
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
                                                    const value = e.target.value;
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
                                                    const value = e.target.value;
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
                            )}

                          {jobModalStatus && (
                            <>
                              <Modal
                                show={jobModalStatus}
                                onHide={(e) => {
                                  jobModalSetStatus(false);
                                  HandleReset1();
                                }}
                                centered
                                size="lg"
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>Tasks</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="tablelist-form">
                                    <div className="modal-body">
                                      <div className="row">
                                        <div
                                          className="col-md-12"
                                          style={{ display: "flex" }}
                                        >
                                          <div className="col-lg-6">
                                            <select
                                              id="search-select"
                                              className="form-select"
                                              aria-label="Default select example"
                                              style={{
                                                color: "#8a8c8e !important",
                                              }}
                                              onChange={(e) => {
                                                setChecklistId(e.target.value);
                                                setAddTaskArr([]);
                                              }}
                                              value={getChecklistId}
                                            >
                                              <option value="">
                                                Select Checklist Name
                                              </option>
                                              {AllChecklist &&
                                                AllChecklist.data.map(
                                                  (checklist) => (
                                                    <option
                                                      value={
                                                        checklist.checklists_id
                                                      }
                                                      key={
                                                        checklist.checklists_id
                                                      }
                                                    >
                                                      {
                                                        checklist.check_list_name
                                                      }
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="">
                                              <button
                                                className="btn btn-info text-white float-end blue-btn"
                                                onClick={() =>
                                                  setShowAddJobModal(true)
                                                }
                                              >
                                                <i className="fa fa-plus"></i>
                                                Add Task
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          className="col-lg-6 column mt-3"
                                          id="column1"
                                        >
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
                                                                {
                                                                  checklist.task_name
                                                                }{" "}
                                                              </td>

                                                              <td>
                                                                {" "}
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
                                        <div
                                          className="col-lg-6 mt-3"
                                          id="column2"
                                        >
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
                                                        AddTaskArr.map(
                                                          (checklist) => (
                                                            <tr className="">
                                                              <td>
                                                                {
                                                                  checklist.task_name
                                                                }{" "}
                                                              </td>
                                                              <td>
                                                                {checklist.budgeted_hour !=
                                                                  null
                                                                  ? checklist.budgeted_hour.split(
                                                                    ":"
                                                                  )[0]
                                                                  : "0"}
                                                                h
                                                                {checklist.budgeted_hour !=
                                                                  null
                                                                  ? checklist.budgeted_hour.split(
                                                                    ":"
                                                                  )[1]
                                                                  : "0"}
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
                                                          )
                                                        )}
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
                                    }}
                                  >
                                    {" "}
                                    <i className="fa fa-times"></i> Close
                                  </Button>
                                  <Button
                                    variant="btn btn-outline-success float-end "
                                    onClick={handleAddCheckList}
                                  >
                                    {" "}
                                    <i className="far fa-save pe-1"></i>Submit
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </>
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
                                    <label className="form-label">
                                      Task Name
                                    </label>
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
                                        // className=' form-control'
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
                                            className="form-control"
                                            placeholder="Hours"
                                            name="budgeted_hour"
                                            onChange={(e) => {
                                              handleChange1(e);
                                            }}
                                            value={BudgetedHoursAddTask.hours}
                                          />
                                        </div>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Minutes"
                                          name="budgeted_minute"
                                          onChange={(e) => {
                                            handleChange1(e);
                                          }}
                                          value={BudgetedHoursAddTask.minutes}
                                        />
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
                                  <i className="fa fa-times"></i> Close
                                </Button>
                                <Button
                                  variant="btn btn-info text-white float-end blue-btn"
                                  onClick={handleAddTask}
                                >
                                  Add
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          )}

                          <div className="hstack gap-2 justify-content-end">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => window.history.back()}
                            >
                              <i className="fa fa-times"></i> Cancel
                            </button>
                            <button
                              type="button"
                              className="btn   float-end btn-outline-success"
                              onClick={handleSubmit}
                            >
                              <i className="fa fa-edit"></i> Update
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
        </div>
      </div>
    </div>
  );
};

export default EditJob;

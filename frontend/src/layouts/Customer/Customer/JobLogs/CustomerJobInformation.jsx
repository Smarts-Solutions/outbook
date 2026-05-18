import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GET_ALL_CHECKLIST,
  CustomerJobAction,
  updateCustomerJobStatus,
  GetAllJabData,
  JobType
} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import { getCustomerMasterStatus } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import Select from 'react-select';
import { Save, Plus, ArrowLeft, Pencil, X, ExternalLink, RotateCcw, Clock, AlertCircle, Info, CheckCircle2, PlayCircle, FileText, File, Mail, Phone } from "lucide-react";
import { useCustomerAccess } from "../../../../Utils/CustomerAccessContext";
import axios from "axios";
import * as XLSX from "xlsx";
import { base_url } from "../../../../Utils/Config";
import { Modal, Button, Table, Form } from "react-bootstrap";

const CustomerJobInformationPage = ({ job_id, getAccessDataJob, goto }) => {
  const { hasAccess } = useCustomerAccess();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const location = useLocation();
  const [AllJobData, setAllJobData] = useState({});
  const dispatch = useDispatch();
  const [budgetedhours, setBudgetedHours] = useState({
    hours: "",
    minutes: "",
  });
  const [PreparationTimne, setPreparationTimne] = useState({
    hours: "",
    minutes: "",
  });
  const [ReviewTime, setReviewTime] = useState({ hours: "", minutes: "" });
  const [Totaltime, setTotalTime] = useState({ hours: "", minutes: "" });
  const [FeedbackIncorporationTime, setFeedbackIncorporationTime] = useState({
    hours: "",
    minutes: "",
  });
  const [invoiceTime, setInvoiceTime] = useState({ hours: "", minutes: "" });
  const [statusDataAll, setStatusDataAll] = useState([]);
  const [selectStatusIs, setStatusId] = useState("");

  const [allStaffData, setAllStaffData] = useState([]);
  const [selectedStaffData, setSelectedStaffData] = useState([]);

  const [JobInformationData, setJobInformationData] = useState({
    AccountManager: "",
    Customer: "",
    Customer_id: 0,
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
    ExpectedDeliveryDate: "",
    DueOn: "",
    SubmissionDeadline: "",
    CustomerDeadlineDate: "",
    SLADeadlineDate: "",
    InternalDeadlineDate: "",
    FilingWithCompaniesHouseRequired: "",
    CompaniesHouseFilingDate: "",
    FilingWithHMRCRequired: "",
    HMRCFilingDate: "",
    OpeningBalanceAdjustmentRequired: "",
    OpeningBalanceAdjustmentDate: "",
    NumberOfTransactions: "",
    NumberOfTrialBalanceItems: "",
    Turnover: "",
    NoOfEmployees: "",
    VATReconciliation: "",
    Bookkeeping: "",
    ProcessingType: "",
    Invoiced: "",
    Currency: "",
    InvoiceValue: "",
    InvoiceDate: "",
    InvoiceTime: "",
    InvoiceRemark: "",
    notes: "",
  });

  //// Checklist Modal State
  const [checklistModal, setChecklistModal] = useState({
    show: false,
    data: [],
    title: "",
    loading: false,
    type: ""
  });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);
  const [showHistoryInline, setShowHistoryInline] = useState(false);

  const handleShowStatusHistory = () => {
    setShowHistoryInline(!showHistoryInline);
    setStatusHistory(AllJobData.data?.status_history || []);
  };

  const getDurationData = () => {
    const history = AllJobData.data?.status_history || [];
    if (history.length === 0) return { items: [], total: "" };

    let processed = [];
    let totalMs = 0;

    const formatPreciseDuration = (ms) => {
      if (isNaN(ms) || ms < 0) return "0 Day";
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      return `${days} Day${days > 1 ? 's' : ''}`;
    };

    const formatFullDuration = (ms) => {
      if (isNaN(ms) || ms < 0) return "0 Day";
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));
      return `${days} Day${days > 1 ? 's' : ''}`;
    }

    for (let i = 0; i < history.length; i++) {
      const current = history[i];
      const next = history[i + 1];

      const startDate = new Date(current.status_update_date);
      const endDate = next ? new Date(next.status_update_date) : new Date();

      const diffMs = endDate - startDate;
      totalMs += diffMs;

      processed.push({
        status: current.status_name,
        from: startDate,
        to: next ? endDate : null,
        duration: formatPreciseDuration(diffMs)
      });
    }

    return { items: processed, total: formatFullDuration(totalMs) };
  };

  const handleViewChecklist = async (checklistId, title, type) => {

    if (!checklistId) return;

    setChecklistModal(prev => ({ ...prev, show: true, loading: true, title, type: type }));

    // If we already have data for this type, use it instead of fetching and resetting
    if (checklistModal[type] && checklistModal[type].length > 0) {
      setChecklistModal(prev => ({
        ...prev,
        loading: false,
        data: [...prev[type]] // Backup current data
      }));
      return;
    }

    try {
      const response = await axios.get(`${base_url}customerDownloadChecklist/${checklistId}`, {
        responseType: 'arraybuffer',
        headers: { Authorization: token }
      });


      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const dataRows = json.slice(1);

      const formattedRows = dataRows
        .filter(row => row && row[1]) // Filter empty rows or rows without questions
        .map((row) => ({
          s_no: row[0],
          question: row[1],
          answer: '',
          comment: '',
          date: ""
        }));

      setChecklistModal(prev => ({
        ...prev,
        loading: false,
        [type]: formattedRows,  // Set the main data
        data: formattedRows // Backup for cancel action
      }));


    } catch (error) {
      console.error("Error loading checklist file:", error);
      sweatalert.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load checklist file'
      });
      setChecklistModal(prev => ({ ...prev, show: false, loading: false }));
    }
  };

  const handleCancelChecklist = () => {
    const type = checklistModal.type;
    const backup = checklistModal.data;
    setChecklistModal(prev => ({
      ...prev,
      [type]: backup,
      show: false
    }));
  };





  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (job_id || location.state?.job_id) {
      JobDetails();
      GetStatus();
    }
  }, [job_id, location.state?.job_id]);

  const JobDetails = async () => {
    const req = { action: "getByJobId", job_id: job_id || location.state?.job_id };
    const data = { req: req, authToken: token };
    await dispatch(CustomerJobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const staffList = response.data.selectedStaffData || [];
          // Note: labels will be populated after allStaffData is fetched
          setSelectedStaffData(staffList.map(id => ({ value: id, label: "" })));
          setBudgetedHours({
            hours: response.data.budgeted_hours ? response.data.budgeted_hours.split(":")[0] : "00",
            minutes: response.data.budgeted_hours ? response.data.budgeted_hours.split(":")[1] : "00",
          });
          setReviewTime({
            hours: response.data.review_time ? response.data.review_time.split(":")[0] : "00",
            minutes: response.data.review_time ? response.data.review_time.split(":")[1] : "00",
          });
          setPreparationTimne({
            hours: response.data.total_preparation_time ? response.data.total_preparation_time.split(":")[0] : "00",
            minutes: response.data.total_preparation_time ? response.data.total_preparation_time.split(":")[1] : "00",
          });
          setTotalTime({
            hours: response.data.total_time ? response.data.total_time.split(":")[0] : "00",
            minutes: response.data.total_time ? response.data.total_time.split(":")[1] : "00",
          });
          setFeedbackIncorporationTime({
            hours: response.data.feedback_incorporation_time ? response.data.feedback_incorporation_time.split(":")[0] : "00",
            minutes: response.data.feedback_incorporation_time ? response.data.feedback_incorporation_time.split(":")[1] : "00",
          });
          setInvoiceTime({
            hours: response.data.invoice_hours ? response.data.invoice_hours.split(":")[0] : "00",
            minutes: response.data.invoice_hours ? response.data.invoice_hours.split(":")[1] : "00",
          });


          let checklisModalData = response?.data?.checklist_modal_data ? JSON.parse(response.data.checklist_modal_data) : null;
          if (!checklisModalData) {
            checklisModalData = {
              show: false,
              data: [],
              title: "",
              loading: false,
              type: ""
            };
          }
          setChecklistModal(checklisModalData);
          setJobInformationData((prevState) => ({
            ...prevState,
            processing_checklist: response.data.processing_checklist ?? null,
            reviewing_checklist: response.data.reviewing_checklist ?? null,

            processing_checklist_status: response.data.processing_checklist_status ?? "0",
            reviewing_checklist_status: response.data.reviewing_checklist_status ?? "0",

            timesheet_job_id: response.data.timesheet_job_id ?? null,
            AccountManager: `${response.data.outbooks_acount_manager_first_name} ${response.data.outbooks_acount_manager_last_name}`,
            Customer: response.data.customer_trading_name,
            Customer_id: response.data.customer_id,
            Client: response.data.client_trading_name,
            ClientJobCode: response.data.client_job_code,
            CustomerAccountManager: response.data.account_manager_officer_id,
            Service: response.data.service_id,
            JobType: response.data.job_type_id,
            Reviewer: response.data.reviewer,
            AllocatedTo: response.data.allocated_to,
            AllocatedOn: formatDate(response.data.allocated_on),
            DateReceivedOn: formatDate(response.data.date_received_on),
            YearEnd: formatDate(response.data.year_end),
            TotalPreparationTime: response.data.total_preparation_time,
            ReviewTime: response.data.review_time,
            FeedbackIncorporationTime:
              response.data.feedback_incorporation_time,
            TotalTime: response.data.total_time,
            EngagementModel: response.data.engagement_model,
            ExpectedDeliveryDate: formatDate(response.data.expected_delivery_date),
            DueOn: formatDate(response.data.due_on),
            SubmissionDeadline: formatDate(response.data.submission_deadline),
            CustomerDeadlineDate: formatDate(response.data.customer_deadline_date),
            SLADeadlineDate: formatDate(response.data.sla_deadline_date),
            InternalDeadlineDate: formatDate(response.data.internal_deadline_date),
            FilingWithCompaniesHouseRequired:
              response.data.filing_Companies_required,
            CompaniesHouseFilingDate: formatDate(response.data.filing_Companies_date),
            FilingWithHMRCRequired: response.data.filing_hmrc_required,
            HMRCFilingDate: formatDate(response.data.filing_hmrc_date),
            OpeningBalanceAdjustmentRequired:
              response.data.opening_balance_required,
            OpeningBalanceAdjustmentDate: formatDate(response.data.opening_balance_date),
            NumberOfTransactions: response.data.number_of_transaction,
            NumberOfTrialBalanceItems: response.data.number_of_balance_items,
            Turnover: response.data.turnover,
            NoOfEmployees: response.data.number_of_employees,
            VATReconciliation: response.data.vat_reconciliation,
            Bookkeeping: response.data.bookkeeping,
            ProcessingType: response.data.processing_type,
            Invoiced: response.data.invoiced,
            Currency: response.data.currency,
            InvoiceValue: response.data.invoice_value,
            InvoiceDate: response.data.invoice_date,
            InvoiceTime: response.data.invoice_hours,
            InvoiceRemark: response.data.invoice_remark,
            notes: response.data.notes,
            Turnover_Period_id_0: response.data.Turnover_Period_id_0 ?? "",
            Turnover_Currency_id_0: response.data.Turnover_Currency_id_0 ?? "",
            Turnover_id_0: response.data.Turnover_id_0 ?? 0.0,
            VAT_Registered_id_0: response.data.VAT_Registered_id_0 ?? "",
            VAT_Frequency_id_0: response.data.VAT_Frequency_id_0 ?? "",
            Who_Did_The_Bookkeeping_id_1:
              response.data.Who_Did_The_Bookkeeping_id_1 ?? "",
            PAYE_Registered_id_1: response.data.PAYE_Registered_id_1 ?? "",
            Number_of_Trial_Balance_Items_id_1:
              response.data.Number_of_Trial_Balance_Items_id_1 ?? "",
            Bookkeeping_Frequency_id_2:
              response.data.Bookkeeping_Frequency_id_2 ?? "",
            Number_of_Total_Transactions_id_2:
              response.data.Number_of_Total_Transactions_id_2 ?? 0,
            Number_of_Bank_Transactions_id_2:
              response.data.Number_of_Bank_Transactions_id_2 ?? 0,
            Number_of_Purchase_Invoices_id_2:
              response.data.Number_of_Purchase_Invoices_id_2 ?? 0,
            Number_of_Sales_Invoices_id_2:
              response.data.Number_of_Sales_Invoices_id_2 ?? 0,
            Number_of_Petty_Cash_Transactions_id_2:
              response.data.Number_of_Petty_Cash_Transactions_id_2 ?? 0,
            Number_of_Journal_Entries_id_2:
              response.data.Number_of_Journal_Entries_id_2 ?? 0,
            Number_of_Other_Transactions_id_2:
              response.data.Number_of_Other_Transactions_id_2 ?? 0,
            Transactions_Posting_id_2:
              response.data.Transactions_Posting_id_2 ?? "",
            Quality_of_Paperwork_id_2:
              response.data.Quality_of_Paperwork_id_2 ?? "",
            Number_of_Integration_Software_Platforms_id_2:
              response.data.Number_of_Integration_Software_Platforms_id_2 ?? "",
            CIS_id_2: response.data.CIS_id_2 ?? "",
            Posting_Payroll_Journals_id_2:
              response.data.Posting_Payroll_Journals_id_2 ?? "",
            Department_Tracking_id_2:
              response.data.Department_Tracking_id_2 ?? "",
            Sales_Reconciliation_Required_id_2:
              response.data.Sales_Reconciliation_Required_id_2 ?? "",
            Factoring_Account_id_2: response.data.Factoring_Account_id_2 ?? "",
            Payment_Methods_id_2: response.data.Payment_Methods_id_2 ?? "",
            Payroll_Frequency_id_3: response.data.Payroll_Frequency_id_3 ?? "",
            Type_of_Payslip_id_3: response.data.Type_of_Payslip_id_3 ?? "",
            Percentage_of_Variable_Payslips_id_3:
              response.data.Percentage_of_Variable_Payslips_id_3 ?? "",
            Is_CIS_Required_id_3: response.data.Is_CIS_Required_id_3 ?? "",
            CIS_Frequency_id_3: response.data.CIS_Frequency_id_3 ?? "",
            Number_of_Sub_contractors_id_3:
              response.data.Number_of_Sub_contractors_id_3 ?? 0,
            Whose_Tax_Return_is_it_id_4:
              response.data.Whose_Tax_Return_is_it_id_4 ?? 0,
            Number_of_Income_Sources_id_4:
              response.data.Number_of_Income_Sources_id_4 ?? 0,
            If_Landlord_Number_of_Properties_id_4:
              response.data.If_Landlord_Number_of_Properties_id_4 ?? 0,
            If_Sole_Trader_Who_is_doing_Bookkeeping_id_4:
              response.data.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4 ?? "",
            Management_Accounts_Frequency_id_6:
              response.data.Management_Accounts_Frequency_id_6 ?? "",


            //////////////////////////
            Year_Ending_id_1: formatDate(response.data.Year_Ending_id_1),
            Day_Date_id_2: formatDate(response.data.Day_Date_id_2),
            Week_Year_id_2: response.data.Week_Year_id_2 ?? null,
            Week_Month_id_2: response.data.Week_Month_id_2 ?? null,
            Week_id_2: response.data.Week_id_2 ?? null,
            Fortnight_Year_id_2: response.data.Fortnight_Year_id_2 ?? null,
            Fortnight_Month_id_2: response.data.Fortnight_Month_id_2 ?? null,
            Fortnight_id_2: response.data.Fortnight_id_2 ?? null,
            Month_Year_id_2: response.data.Month_Year_id_2 ?? null,
            Month_id_2: response.data.Month_id_2 ?? null,
            Quarter_Year_id_2: response.data.Quarter_Year_id_2 ?? null,
            Quarter_id_2: response.data.Quarter_id_2 ?? null,
            Year_id_2: response.data.Year_id_2 ?? null,
            Other_FromDate_id_2: formatDate(response.data.Other_FromDate_id_2),
            Other_ToDate_id_2: formatDate(response.data.Other_ToDate_id_2),
            Payroll_Week_Year_id_3: response.data.Payroll_Week_Year_id_3 ?? null,
            Payroll_Week_Month_id_3: response.data.Payroll_Week_Month_id_3 ?? null,
            Payroll_Week_id_3: response.data.Payroll_Week_id_3 ?? null,
            Payroll_Fortnight_Year_id_3: response.data.Payroll_Fortnight_Year_id_3 ?? null,
            Payroll_Fortnight_Month_id_3: response.data.Payroll_Fortnight_Month_id_3 ?? null,
            Payroll_Fortnight_id_3: response.data.Payroll_Fortnight_id_3 ?? null,
            Payroll_Month_Year_id_3: response.data.Payroll_Month_Year_id_3 ?? null,
            Payroll_Month_id_3: response.data.Payroll_Month_id_3 ?? null,
            Payroll_Quarter_Year_id_3: response.data.Payroll_Quarter_Year_id_3 ?? null,
            Payroll_Quarter_id_3: response.data.Payroll_Quarter_id_3 ?? null,
            Payroll_Year_id_3: response.data.Payroll_Year_id_3 ?? null,
            Tax_Year_id_4: response.data.Tax_Year_id_4 ?? null,
            Management_Accounts_FromDate_id_6: formatDate(response.data.Management_Accounts_FromDate_id_6),
            Management_Accounts_ToDate_id_6: formatDate(response.data.Management_Accounts_ToDate_id_6),
            Year_id_33: response.data.Year_id_33 ?? null,
            Period_id_32: response.data.Period_id_32 ?? null,
            Day_Date_id_32: formatDate(response.data.Day_Date_id_32),
            Week_Year_id_32: response.data.Week_Year_id_32 ?? null,
            Week_Month_id_32: response.data.Week_Month_id_32 ?? null,
            Week_id_32: response.data.Week_id_32 ?? null,
            Fortnight_Year_id_32: response.data.Fortnight_Year_id_32 ?? null,
            Fortnight_Month_id_32: response.data.Fortnight_Month_id_32 ?? null,
            Fortnight_id_32: response.data.Fortnight_id_32 ?? null,
            Month_Year_id_32: response.data.Month_Year_id_32 ?? null,
            Month_id_32: response.data.Month_id_32 ?? null,
            Quarter_Year_id_32: response.data.Quarter_Year_id_32 ?? null,
            Quarter_id_32: response.data.Quarter_id_32 ?? null,
            Year_id_32: response.data.Year_id_32 ?? null,
            Other_FromDate_id_32: formatDate(response.data.Other_FromDate_id_32),
            Other_ToDate_id_32: formatDate(response.data.Other_ToDate_id_32),
            Payroll_Frequency_id_31: response.data.Payroll_Frequency_id_31 ?? null,
            Payroll_Week_Year_id_31: response.data.Payroll_Week_Year_id_31 ?? null,
            Payroll_Week_Month_id_31: response.data.Payroll_Week_Month_id_31 ?? null,
            Payroll_Week_id_31: response.data.Payroll_Week_id_31 ?? null,
            Payroll_Fortnight_Year_id_31: response.data.Payroll_Fortnight_Year_id_31 ?? null,
            Payroll_Fortnight_Month_id_31: response.data.Payroll_Fortnight_Month_id_31 ?? null,
            Payroll_Fortnight_id_31: response.data.Payroll_Fortnight_id_31 ?? null,
            Payroll_Month_Year_id_31: response.data.Payroll_Month_Year_id_31 ?? null,
            Payroll_Month_id_31: response.data.Payroll_Month_id_31 ?? null,
            Payroll_Quarter_Year_id_31: response.data.Payroll_Quarter_Year_id_31 ?? null,
            Payroll_Quarter_id_31: response.data.Payroll_Quarter_id_31 ?? null,
            Payroll_Year_id_31: response.data.Payroll_Year_id_31 ?? null,
            Audit_Year_Ending_id_27: formatDate(response.data.Audit_Year_Ending_id_27),
            Filing_Frequency_id_8: response.data.Filing_Frequency_id_8 ?? null,
            Period_Ending_Date_id_8: formatDate(response.data.Period_Ending_Date_id_8),
            Filing_Date_id_8: formatDate(response.data.Filing_Date_id_8),
            Year_id_28: response.data.Year_id_28 ?? null,
            job_priority: response.data.job_priority ?? null,
          }));
          setStatusId(response.data.status_type);
          setStatusHistory(response.data.status_history || []);

          // Fetch additional dropdown data (services, job types, staff)
          const dropdownReq = {
            customer_id: response.data.customer_id,
            client_id: response.data.client_id
          };
          const dropdownData = { req: dropdownReq, authToken: token };
          
          await dispatch(GetAllJabData(dropdownData))
            .unwrap()
            .then((dropdownResponse) => {
              if (dropdownResponse.status) {
                const allStaff = dropdownResponse.data?.allStaff || [];
                setAllStaffData(allStaff);

                // Update labels for already selected staff
                const staffIds = response.data.selectedStaffData || [];
                const formattedSelectedStaff = staffIds.map(id => {
                  const staffMember = allStaff.find(s => s.id === id);
                  return {
                    value: id,
                    label: staffMember ? staffMember.full_name : `Staff ID: ${id}`
                  };
                });
                setSelectedStaffData(formattedSelectedStaff);

                setAllJobData({
                  status: response.status,
                  data: {
                    ...response.data,
                    services: dropdownResponse.data?.services || [],
                    job_type: dropdownResponse.data?.job_type || [],
                    reviewer: dropdownResponse.data?.reviewer || [],
                    allocated: dropdownResponse.data?.allocated || [],
                    allStaff: dropdownResponse.data?.allStaff || [],
                    customer_account_manager: dropdownResponse.data?.customer_account_manager || [],
                    engagement_model: dropdownResponse.data?.engagement_model || [],
                    currency: dropdownResponse.data?.currency || [],
                    Manager: dropdownResponse.data?.Manager || [],
                    processing_checklist_data: dropdownResponse.data?.processing_checklist_data || [],
                    reviewing_checklist_data: dropdownResponse.data?.reviewing_checklist_data || []
                  },
                  message: response.message,
                });
              } else {
                setAllJobData({
                  status: response.status,
                  data: response.data,
                  message: response.message,
                });
              }
            })
            .catch(() => {
              setAllJobData({
                status: response.status,
                data: response.data,
                message: response.message,
              });
            });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetStatus = async () => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(getCustomerMasterStatus(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setStatusDataAll(response.data);
        } else {
          setStatusDataAll([]);
        }
      })
      .catch((error) => {
        return;
      });
  };


  const handleJobEdit = () => {
    navigate("/customer/job/edit", {
      state: {
        job_id: job_id || location.state?.job_id,
        activeTab: location.state?.activeTab,
        data: location?.state?.data,
        goto: goto
      },
    });
  };

  const handleStatusChange = (e) => {
    const Id = e.target.value;
    sweatalert
      .fire({
        title: "Are you sure?",
        text: "Do you want to change the status?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "No, cancel",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const req = { job_id: location.state.job_id, status_type: Id };
            const res = await dispatch(
              updateCustomerJobStatus({ req, authToken: token })
            ).unwrap();

            if (res.status) {
              sweatalert.fire({
                title: "Success",
                text: res.message,
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              });

              setStatusId(Id);
              JobDetails();
            } else if (res.data === "W") {
              sweatalert.fire({
                title: "Warning",
                text: res.message,
                icon: "warning",
                confirmButtonText: "Ok",
                timer: 3000,
                timerProgressBar: true,
              });
            } else {
              sweatalert.fire({
                title: "Error",
                text: res.message,
                icon: "error",
                confirmButtonText: "Ok",
                timer: 1000,
                timerProgressBar: true,
              });
            }
          } catch (error) {
            sweatalert.fire({
              title: "Error",
              text: "An error occurred while updating the status.",
              icon: "error",
              confirmButtonText: "Ok",
              timer: 1000,
              timerProgressBar: true,
            });
          }
        } else if (result.dismiss === sweatalert.DismissReason.cancel) {
          sweatalert.fire({
            title: "Cancelled",
            text: "Status change was not performed",
            icon: "error",
            confirmButtonText: "Ok",
            timer: 1000,
            timerProgressBar: true,
          });
        }
      });
  };

  let filteredData = {};
  const RearrangeEngagementOptionArr = [];

  try {
    let engagementModel = AllJobData.data?.engagement_model;

    // Handle JSON string if necessary
    if (typeof engagementModel === "string") {
      try {
        engagementModel = JSON.parse(engagementModel);
      } catch (e) {
        engagementModel = null;
      }
    }

    if (Array.isArray(engagementModel) && engagementModel[0]) {
      const modelObj = engagementModel[0];
      const keyMapping = {
        fte_dedicated_staffing: "Fte Dedicated Staffing",
        percentage_model: "Percentage Model",
        adhoc_payg_hourly: "Adhoc Payg Hourly",
        customised_pricing: "Customised Pricing",
      };

      Object.keys(modelObj).forEach((key) => {
        if (modelObj[key] === "1" || modelObj[key] === 1) {
          filteredData[key] = modelObj[key];
          if (keyMapping[key]) {
            RearrangeEngagementOptionArr.push(keyMapping[key]);
          }
        }
      });
    }
  } catch (error) {
    console.error("Error parsing engagement model:", error);
    filteredData = {};
  }





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

  const [serviceFieldsData, setServiceFieldsData] = useState([]);
  useEffect(() => {
    setServiceFieldsData(
      // serviceFields[JobInformationData?.Service]?.fields ||serviceFields[0]?.fields
      serviceFields?.find(item => item.id === JobInformationData?.Service)?.fields || serviceFields?.[0]?.fields
    );
  }, [JobInformationData?.Service]);

  return (
    <div>
      <div className="row mb-3">
        <div className="col-md-7">
          <div className="tab-title">
            <h3>Job Information </h3>
          </div>
        </div>
        <div className="col-md-5">
          <div className="d-flex w-100 justify-content-end">
            {goto !== "report" && (
              <>
                <div className="w-auto">
                  <select
                    className="form-select form-control"
                    onChange={handleStatusChange}
                    value={selectStatusIs}
                    disabled={!(hasAccess("job", "status_update") || role === "SUPERADMIN")}
                  >
                    {statusDataAll.map((status) => (
                      <option value={status.id} key={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectStatusIs && (
                  <span className="text-muted fs-12 d-flex align-items-center px-3 py-1 rounded-pill border bg-light ms-2" style={{ minWidth: 'fit-content', height: '38px' }}>
                    <Clock size={14} className="me-2 text-primary" />
                    <span className="fw-semibold" style={{ color: '#495057' }}>
                      {getDurationData().items[getDurationData().items.length - 1]?.duration || "0 Day"}
                    </span>
                  </span>
                )}

                {(hasAccess("job", "update") ||

                  role === "SUPERADMIN") && (
                    <button className="edit-icon" onClick={handleJobEdit}>
                      <i className="ti-pencil text-primary" />
                    </button>
                  )}

              </>
            )}
          </div>
        </div>
      </div>
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
                      className="form-control"
                      placeholder="Enter Account Manager Name"
                      disabled
                      name="AccountManager"
                      
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          AccountManager: e.target.value,
                        })
                      }
                      value={JobInformationData.AccountManager}
                    />
                  </div>

                  <div id="invoiceremark" className="mb-3 col-lg-4">
                    <label className="form-label">
                      Customer<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Customer"
                      disabled
                      name="Customer"
                      
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          Customer: e.target.value,
                        })
                      }
                      value={JobInformationData.Customer}
                    />
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label className="form-label">
                      Client<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Client Job Code"
                      name="Client"
                      
                      disabled
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          Client: e.target.value,
                        })
                      }
                      value={JobInformationData.Client}
                    />
                  </div>

                  <div className="mb-3 col-lg-4">
                    <label className="form-label">Client Job Code</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Client Job Code"
                      name="ClientJobCode"
                      
                      disabled
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          ClientJobCode: e.target.value,
                        })
                      }
                      value={JobInformationData.ClientJobCode}
                    />
                  </div>

                  <div className="col-lg-4 mb-3">
                    <label className="form-label">
                      Customer Account Manager(Officer)
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="CustomerAccountManager"
                      disabled
                      
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          CustomerAccountManager: e.target.value,
                        })
                      }
                      value={JobInformationData.CustomerAccountManager}
                    >
                      <option value="">Select Customer Account Manager</option>
                      {(AllJobData?.data?.customer_account_manager || []).map(
                        (customer_account_manager) => (
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
                        )
                      )}
                    </select>
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label">
                      Service<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mb-3"
                      name="Service"
                      
                      disabled
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          Service: e.target.value,
                        })
                      }
                      value={JobInformationData.Service}
                    >
                      <option value="">Select Service</option>
                      {(AllJobData?.data?.services || []).map((service) => (
                        <option
                          value={service.service_id}
                          key={service.service_id}
                        >
                          {service.service_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label">
                      Job Type<span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select mb-3 jobtype"
                      disabled
                      name="JobType"
                      
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          JobType: e.target.value,
                        })
                      }
                      value={JobInformationData.JobType}
                    >
                      <option value="">Select Job Type</option>
                      {(AllJobData?.data?.job_type || []).map((jobtype) => (
                        <option
                          value={jobtype.job_type_id}
                          key={jobtype.job_type_id}
                        >
                          {jobtype.job_type_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">Budgeted Time</label>
                      <div className="input-group">
                        <div className="hours-div">
                          <input
                            type="text"
                            
                            className="form-control"
                            placeholder="Hours"
                            name="BudgetedHours"
                            disabled
                            onChange={(e) =>
                              setBudgetedHours({
                                ...budgetedhours,
                                hours: e.target.value,
                              })
                            }
                            value={budgetedhours.hours}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            H
                          </span>
                        </div>
                        <div className="hours-div">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Minutes"
                            name="BudgetedHours"
                            
                            disabled
                            onChange={(e) =>
                              setBudgetedHours({
                                ...budgetedhours,
                                minutes: e.target.value,
                              })
                            }
                            value={budgetedhours.minutes}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            M
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <label className="form-label">Reviewer</label>
                    <select
                      className="form-select mb-3"
                      name="Reviewer"
                      
                      disabled
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          Reviewer: e.target.value,
                        })
                      }
                      value={JobInformationData.Reviewer}
                    >
                      <option value=""> Select Reviewer</option>
                      {(AllJobData?.data?.reviewer || []).map((reviewer) => (
                        <option
                          value={reviewer.reviewer_id}
                          key={reviewer.reviewer_id}
                        >
                          {reviewer.reviewer_name +
                            " (" +
                            reviewer.reviewer_email +
                            ")"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label">Allocated To</label>
                    <select
                      className="form-select mb-3"
                      name="AllocatedTo"
                      
                      disabled
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          AllocatedTo: e.target.value,
                        })
                      }
                      value={JobInformationData.AllocatedTo}
                    >
                      <option value=""> Select Staff</option>
                      {(AllJobData?.data?.allocated || []).map((staff) => (
                        <option
                          value={staff.allocated_id}
                          key={staff.allocated_id}
                        >
                          {staff.allocated_name +
                            "(" +
                            staff.allocated_email +
                            ")"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label"> Allocated On </label>
                    <input
                      type="date"
                      className="form-control mb-3"
                      placeholder="DD-MM-YYYY"
                      name="AllocatedOn"
                      disabled
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          AllocatedOn: e.target.value,
                        })
                      }
                      value={JobInformationData.AllocatedOn}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label">Date Received On</label>
                    <input
                      type="date"
                      className="form-control mb-3"
                      placeholder="DD-MM-YYYY"
                      name="DateReceivedOn"
                      
                      disabled
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          DateReceivedOn: e.target.value,
                        })
                      }
                      value={JobInformationData.DateReceivedOn}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">Year End</label>
                                            <input
                                                type="month"
                                                className="form-control"
                                                placeholder="MM/YYYY"
                                                name="YearEnd"
                                                
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, YearEnd: e.target.value })}
                                                value={JobInformationData.YearEnd}
                                            />
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
                            
                            disabled
                            onChange={(e) =>
                              setPreparationTimne({
                                ...PreparationTimne,
                                hours: e.target.value,
                              })
                            }
                            value={PreparationTimne.hours}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            H
                          </span>
                        </div>
                        <div className="hours-div">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Minutes"
                            
                            disabled
                            onChange={(e) =>
                              setPreparationTimne({
                                ...PreparationTimne,
                                minutes: e.target.value,
                              })
                            }
                            value={PreparationTimne.minutes}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            M
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">Review Time</label>
                      <div className="input-group">
                        <div className="hours-div">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Hours"
                            
                            disabled
                            onChange={(e) =>
                              setReviewTime({
                                ...ReviewTime,
                                hours: e.target.value,
                              })
                            }
                            value={ReviewTime.hours}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            H
                          </span>
                        </div>
                        <div className="hours-div">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Minutes"
                            
                            disabled
                            onChange={(e) =>
                              setReviewTime({
                                ...ReviewTime,
                                minutes: e.target.value,
                              })
                            }
                            value={ReviewTime.minutes}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            M
                          </span>
                        </div>
                      </div>
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
                            disabled
                            onChange={(e) =>
                              setFeedbackIncorporationTime({
                                ...FeedbackIncorporationTime,
                                hours: e.target.value,
                              })
                            }
                            value={FeedbackIncorporationTime.hours}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            H
                          </span>
                        </div>
                        <div className="hours-div">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Minutes"
                            
                            disabled
                            onChange={(e) =>
                              setFeedbackIncorporationTime({
                                ...FeedbackIncorporationTime,
                                minutes: e.target.value,
                              })
                            }
                            value={FeedbackIncorporationTime.minutes}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            M
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label"> Total Time</label>

                      <div className="input-group">
                        <div className="hours-div">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={10}
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            disabled
                            
                            onChange={(e) =>
                              setTotalTime({
                                ...Totaltime,
                                hours: e.target.value,
                              })
                            }
                            value={Totaltime.hours}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            H
                          </span>
                        </div>
                        <div className="hours-div">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={10}
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            
                            disabled
                            onChange={(e) =>
                              setTotalTime({
                                ...Totaltime,
                                minutes: e.target.value,
                              })
                            }
                            value={Totaltime.minutes}
                          />
                          <span className="input-group-text" id="basic-addon2">
                            M
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="invoice_type" className="col-lg-4">
                    <label htmlFor="firstNameinput" className="form-label">
                      Engagement Model
                    </label>
                    <select
                      className="form-select mb-3 invoice_type_dropdown"
                      disabled
                      
                      name="EngagementModel"
                      onChange={(e) =>
                        setJobInformationData({
                          ...JobInformationData,
                          EngagementModel: e.target.value,
                        })
                      }
                      value={JobInformationData.EngagementModel}
                    >
                      <option value="">Please Select Engagement Model</option>
                      {/* {Object.keys(filteredData).map(key => (
                                                <option key={key} value={key}>{key}</option>
                                            ))} */}

                      {Object.keys(filteredData).map((key, index) => (
                        <option key={key} value={key}>
                          {RearrangeEngagementOptionArr[index]}
                        </option>
                      ))}
                    </select>
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
                      isDisabled={true}
                      options={allStaffData?.map((data) => {
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
                        disabled
                        className="form-select"
                        name="job_priority"
                        //onChange={HandleChange}
                        value={JobInformationData?.job_priority}
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <div className="mt-2 text-start">
                        <ul className="nav nav-pills rounded-tabs" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${showHistoryInline ? "active" : ""}`}
                              id="status-history-tab"
                              type="button"
                              role="tab"
                              aria-selected={showHistoryInline}
                              onClick={handleShowStatusHistory}
                            >
                              <Clock size={16} className="me-1" />
                              Status Duration History
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Work */}
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Processing Type CheckList
                      </label>
                      <select
                        className="form-select"
                        name="processing_checklist"
                        // onChange={HandleChange}
                        disabled
                        value={
                          JobInformationData.processing_checklist
                        }
                      >
                        <option value={null}>-- Select --</option>
                        <option value={0}>Not Required</option>
                        {AllJobData?.data?.processing_checklist_data
                          ?.filter((item) => {

                            // Service Filter
                            let serviceMatch = true
                            if (item.service_id) {
                              const serviceIds = item.service_id.split(",").map(Number)
                              serviceMatch = serviceIds.includes(JobInformationData.Service)
                            }

                            // Job Type Filter
                            let jobTypeMatch = true
                            if (item.job_type_id) {
                              const jobTypeIds = item.job_type_id.split(",").map(Number)
                              jobTypeMatch = jobTypeIds.includes(JobInformationData.JobType)
                            }

                            return serviceMatch && jobTypeMatch
                          })
                          ?.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.check_list_name}
                            </option>
                          ))}
                      </select>
                      {JobInformationData.processing_checklist && JobInformationData.processing_checklist !== "0" && (
                        <div className="mt-1">
                          {(() => {
                            const selected = AllJobData?.data?.processing_checklist_data?.find(
                              (item) => Number(item.id) === Number(JobInformationData.processing_checklist)
                            );
                            return selected?.upload_checklist_name ? (
                              <button
                                type="button"
                                className="btn btn-link p-0 fs-12 text-primary d-flex align-items-center"
                                onClick={() => handleViewChecklist(selected.id, selected.check_list_name, "processing")}
                              >
                                <ExternalLink size={12} className="me-1" /> checklist_excel
                              </button>
                            ) : (
                              <span className="text-muted fs-12">PDF Not Available</span>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>



                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Reviewing Type CheckList
                      </label>
                      <select
                        className="form-select"
                        name="reviewing_checklist"
                        //onChange={HandleChange}
                        disabled
                        value={
                          JobInformationData.reviewing_checklist
                        }
                      >
                        <option value={null}>-- Select --</option>
                        <option value={0}>Not Required</option>
                        {AllJobData?.data?.reviewing_checklist_data
                          ?.filter((item) => {

                            // Service Filter
                            let serviceMatch = true
                            if (item.service_id) {
                              const serviceIds = item.service_id.split(",").map(Number)
                              serviceMatch = serviceIds.includes(JobInformationData.Service)
                            }

                            // Job Type Filter
                            let jobTypeMatch = true
                            if (item.job_type_id) {
                              const jobTypeIds = item.job_type_id.split(",").map(Number)
                              jobTypeMatch = jobTypeIds.includes(JobInformationData.JobType)
                            }

                            return serviceMatch && jobTypeMatch
                          })
                          ?.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.check_list_name}
                            </option>
                          ))}
                      </select>
                      {JobInformationData.reviewing_checklist && JobInformationData.reviewing_checklist !== "0" && (
                        <div className="mt-1">
                          {(() => {
                            const selected = AllJobData?.data?.reviewing_checklist_data?.find(
                              (item) => Number(item.id) === Number(JobInformationData.reviewing_checklist)
                            );
                            return selected?.upload_checklist_name ? (
                              <button
                                type="button"
                                className="btn btn-link p-0 fs-12 text-primary d-flex align-items-center"
                                onClick={() => handleViewChecklist(selected.id, selected.check_list_name, "reviewing")}
                              >
                                <ExternalLink size={12} className="me-1" /> checklist_excel
                              </button>
                            ) : (
                              <span className="text-muted fs-12">PDF Not Available</span>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  {showHistoryInline && (
                    <div className="col-lg-12 mt-4">
                      <div className="card shadow-sm border" style={{ borderRadius: '15px', overflow: 'hidden', background: '#ffffff', borderColor: '#e4eef7' }}>
                        <div className="card-header border-0 bg-white pt-4 px-4 pb-0">
                          <h5 className="fs-15 fw-bold mb-0 d-flex align-items-center" style={{ color: '#313949' }}>
                            <Clock size={18} className="me-2" style={{ color: '#00bcd4' }} />
                            Status Duration History
                          </h5>
                        </div>
                        <div className="card-body px-3 pt-2 pb-4">
                          <div className="timeline-wrapper position-relative ps-1">
                            {/* Vertical Line */}
                            {getDurationData().items.length > 1 && (
                              <div className="position-absolute border-start"
                                style={{ left: '15px', top: '22px', bottom: '22px', borderLeft: '2px solid #f1f4f8', zIndex: 1 }}></div>
                            )}

                            {getDurationData().items.length > 0 ? (
                              getDurationData().items.map((item, index) => {
                                const statusName = (item.status || "").toLowerCase();
                                let StatusIcon = Clock;
                                let color = "#00bcd4"; // Default Blue

                                if (statusName.includes("not") || statusName.includes("pending") || statusName.includes("started")) {
                                  StatusIcon = AlertCircle;
                                  color = "#ffa726"; // Orange
                                } else if (statusName.includes("progress") || statusName.includes("running") || statusName.includes("process")) {
                                  StatusIcon = PlayCircle;
                                  color = "#00bcd4";
                                } else if (statusName.includes("review") || statusName.includes("check")) {
                                  StatusIcon = Clock;
                                  color = "#00bcd4";
                                } else if (statusName.includes("complete") || statusName.includes("done")) {
                                  StatusIcon = CheckCircle2;
                                  color = "#27ae60";
                                }

                                return (
                                  <div className="mb-4 d-flex" key={index} style={{ zIndex: 2 }}>
                                    {/* Icon Column */}
                                    <div className="d-flex flex-column align-items-center" style={{ width: '22px' }}>
                                      <div className="d-flex align-items-center justify-content-center bg-white" style={{ width: '18px', height: '34px' }}>
                                        <StatusIcon size={22} color={color} strokeWidth={2} />
                                      </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="ms-3 flex-grow-1">
                                      <div className="d-flex justify-content-between align-items-center" style={{ height: '22px' }}>
                                        <h6 className="fs-14 fw-bold mb-0" style={{ color: '#313949' }}>{item.status || "Status Update"}</h6>
                                        <div className="px-2 py-0 rounded fs-11 fw-bold"
                                          style={{ background: '#e1f5fe', color: '#039be5', minWidth: '40px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          {item.duration}
                                        </div>
                                      </div>
                                      <p className="fs-12 mb-0 mt-1" style={{ color: '#99a1ac' }}>
                                        {item.from.toLocaleDateString('en-GB')} → {item.to ? item.to.toLocaleDateString('en-GB') : 'Present'}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center py-4">
                                <img
                                  src="/assets/images/No-data-amico.png"
                                  alt="No history found"
                                  style={{ maxWidth: "150px", height: "auto" }}
                                />
                                <p className="text-muted fs-13 mb-0 mt-2">No Status History Found</p>
                              </div>
                            )}
                          </div>

                          <div className="mt-2 pt-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: '#f1f3f5' }}>
                            <span className="fs-13 fw-semibold text-muted">Total Duration</span>
                            <span className="fs-16 fw-bold" style={{ color: '#313949' }}>{getDurationData().total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="card card_shadow">
              <div className="card-header align-items-center d-flex card-header-light-blue">
                <h4 className="card-title mb-0 flex-grow-1 fs-16">Deadline</h4>
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
                        
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            ExpectedDeliveryDate: e.target.value,
                          })
                        }
                        value={JobInformationData.ExpectedDeliveryDate || ""}
                      />
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label className="form-label">Due On</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="DD-MM-YYYY"
                        name="DueOn"
                        
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            DueOn: e.target.value,
                          })
                        }
                        value={JobInformationData.DueOn || ""}
                      />
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label className="form-label">Submission Deadline</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="DD-MM-YYYY"
                        name="SubmissionDeadline"
                        
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            SubmissionDeadline: e.target.value,
                          })
                        }
                        value={JobInformationData.SubmissionDeadline || ""}
                      />
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
                        
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            CustomerDeadlineDate: e.target.value,
                          })
                        }
                        value={JobInformationData.CustomerDeadlineDate || ""}
                      />
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label className="form-label">SLA Deadline Date</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="DD-MM-YYYY"
                        name="SLADeadlineDate"
                        
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            SLADeadlineDate: e.target.value,
                          })
                        }
                        value={JobInformationData.SLADeadlineDate || ""}
                      />
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
                        
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            InternalDeadlineDate: e.target.value,
                          })
                        }
                        value={JobInformationData.InternalDeadlineDate || ""}
                      />
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
                          className="form-select mb-3"
                          name="FilingWithCompaniesHouseRequired"
                          disabled
                          
                          onChange={(e) =>
                            setJobInformationData({
                              ...JobInformationData,
                              FilingWithCompaniesHouseRequired: e.target.value,
                            })
                          }
                          value={
                            JobInformationData.FilingWithCompaniesHouseRequired
                          }
                        >
                          <option value="">
                            Please Select Companies House Required
                          </option>
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>
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
                          
                          disabled
                          onChange={(e) =>
                            setJobInformationData({
                              ...JobInformationData,
                              CompaniesHouseFilingDate: e.target.value,
                            })
                          }
                          value={JobInformationData.CompaniesHouseFilingDate}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label className="form-label">
                        Filing with HMRC Required?
                      </label>
                      <select
                        className="form-select invoice_type_dropdown"
                        name="FilingWithHMRCRequired"
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            FilingWithHMRCRequired: e.target.value,
                          })
                        }
                        value={JobInformationData.FilingWithHMRCRequired}
                      >
                        <option value="">Please Select HMRC Required</option>
                        <option value={1}>Yes</option>
                        <option value={0}>No</option>
                      </select>
                    </div>
                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label className="form-label">HMRC Filing Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="HMRCFilingDate"
                          
                          disabled
                          onChange={(e) =>
                            setJobInformationData({
                              ...JobInformationData,
                              HMRCFilingDate: e.target.value,
                            })
                          }
                          value={JobInformationData.HMRCFilingDate}
                        />
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
                          disabled
                          onChange={(e) =>
                            setJobInformationData({
                              ...JobInformationData,
                              OpeningBalanceAdjustmentRequired: e.target.value,
                            })
                          }
                          value={
                            JobInformationData.OpeningBalanceAdjustmentRequired
                          }
                        >
                          <option value="">
                            Please Select Opening Balance Adjustment
                          </option>
                          <option value={1}>Yes</option>
                          <option value={0}>No</option>
                        </select>
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
                          
                          disabled
                          onChange={(e) =>
                            setJobInformationData({
                              ...JobInformationData,
                              OpeningBalanceAdjustmentDate: e.target.value,
                            })
                          }
                          value={
                            JobInformationData.OpeningBalanceAdjustmentDate
                          }
                        />
                      </div>
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
                    {/* <div className="row">
                      {serviceFieldsData?.length > 0 &&
                        serviceFieldsData?.map((field, index) => (
                          <div className="col-lg-4 mb-3" key={index}>
                            <label className="form-label">{field.name}</label>
                            {field.type === "dropdown" ? (
                              <select
                                className="form-control"
                                name={field.key}
                                disabled={true}
                                value={JobInformationData[field.key]}
                              >
                                <option value="">Select {field.name}</option>
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
                                placeholder={field.key}
                                name={field.name}
                                min={field.min}
                                max={field.max}
                                disabled={true}
                                value={JobInformationData[field.key]}
                              />
                            )}
                          </div>
                        ))}
                    </div> */}
                    <div className="row">
                      {serviceFieldsData?.length > 0 &&
                        serviceFieldsData?.map((field, index) => {
                          // 👇 check if field should be visible
                          const isVisible = shouldShowField(field, JobInformationData);
                          if (!isVisible) return null;

                          return (
                            <div className="col-lg-4 mb-3" key={index}>
                              <label className="form-label">{field.name}</label>
                              {field.type === "dropdown" ? (
                                <select
                                  className="form-control"
                                  name={field.key}
                                  disabled={true}
                                  value={JobInformationData[field.key] || ""}
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
                                  disabled={true}
                                  value={JobInformationData[field.key] || ""}
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
          </div>

          {JobInformationData.EngagementModel != "fte_dedicated_staffing" &&
            (selectStatusIs == 6 || selectStatusIs == 7) && (
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
                            <label className="form-label">Invoiced</label>
                            <select
                              className="invoiced_dropdown form-select"
                              name="Invoiced"
                              disabled
                              onChange={(e) =>
                                setJobInformationData({
                                  ...JobInformationData,
                                  Invoiced: e.target.value,
                                })
                              }
                              value={JobInformationData.Invoiced}
                            >
                              <option value="">Please Select Invoiced</option>
                              <option value={1}>Yes</option>
                              <option value={0}>No</option>
                            </select>
                          </div>
                          <div className="col-lg-4 mb-3">
                            <label className="form-label">Currency</label>
                            <select
                              className="invoiced_dropdown form-select"
                              name="Currency"
                              disabled
                              onChange={(e) =>
                                setJobInformationData({
                                  ...JobInformationData,
                                  Currency: e.target.value,
                                })
                              }
                              value={JobInformationData.Currency}
                            >
                              <option value="">Please Select Currency</option>
                              <option>Rupee</option>
                              <option>Dollar</option>
                            </select>
                          </div>
                          <div className="col-lg-4 mb-3">
                            <label className="form-label"> Invoice Value </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Invoice Value"
                              name="InvoiceValue"
                              
                              disabled
                              onChange={(e) =>
                                setJobInformationData({
                                  ...JobInformationData,
                                  InvoiceValue: e.target.value,
                                })
                              }
                              value={JobInformationData.InvoiceValue}
                            />
                          </div>
                          <div className="col-lg-4 mb-3">
                            <label className="form-label">Invoice Date</label>
                            <input
                              type="date"
                              className="form-control"
                              placeholder="DD-MM-YYYY"
                              name="InvoiceDate"
                              max="2024-08-27"
                              
                              disabled
                              onChange={(e) =>
                                setJobInformationData({
                                  ...JobInformationData,
                                  InvoiceDate: e.target.value,
                                })
                              }
                              value={JobInformationData.InvoiceDate}
                            />
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">Invoice </label>

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
                                        (Number(value) >= 0 &&
                                          Number(value) <= 23)
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
                                    
                                    disabled
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
                          <div id="invoicedremark" className="col-lg-4">
                            <label className="form-label">Invoice Remark</label>
                            <textarea
                              className="form-control"
                              placeholder="Invoice Remark"
                              name="InvoiceRemark"
                              
                              disabled
                              onChange={(e) =>
                                setJobInformationData({
                                  ...JobInformationData,
                                  InvoiceRemark: e.target.value,
                                })
                              }
                              value={JobInformationData.InvoiceRemark}
                              maxLength={500}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Checklist Preview Modal */}
          <Modal
            show={checklistModal.show}
            onHide={handleCancelChecklist}
            size="xl"
            centered
            scrollable
          >
            <Modal.Header closeButton className="bg-light">
              <Modal.Title className="fs-16">{checklistModal.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {checklistModal.loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading checklist data...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table bordered hover className="align-middle fs-13">
                    <thead className="table-light text-nowrap">
                      <tr>
                        <th style={{ width: '50px' }}>S.No</th>
                        <th>Question</th>
                        <th className="text-center" style={{ width: '250px' }}>Options</th>
                        <th style={{ width: '200px' }}>Comment</th>
                        <th style={{ width: '120px' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        checklistModal[checklistModal.type]?.length > 0 ? (
                          checklistModal[checklistModal.type]?.map((row, index) => (
                            <tr key={index}>
                              <td className="text-center">{row.s_no || index + 1}</td>
                              <td>{row.question}</td>
                              <td>
                                <div className="d-flex justify-content-around">
                                  <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name={`ans-${index}`}
                                    id={`yes-${index}`}
                                    className="fs-12"
                                    checked={row.answer === 'Yes'}
                                    readOnly
                                  />
                                  <Form.Check
                                    type="radio"
                                    label="No"
                                    name={`ans-${index}`}
                                    id={`no-${index}`}
                                    className="fs-12"
                                    checked={row.answer === 'No'}
                                    readOnly
                                  />
                                  <Form.Check
                                    type="radio"
                                    label="N/A"
                                    name={`ans-${index}`}
                                    id={`na-${index}`}
                                    className="fs-12"
                                    checked={row.answer === 'N/A'}
                                    readOnly
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-link p-0 text-danger ms-2"
                                    title="Clear selection"
                                  >
                                    <RotateCcw size={14} />
                                  </button>
                                </div>
                              </td>
                              <td>
                                <textarea
                                  className="form-control form-control-sm"
                                  rows="1"
                                  placeholder="Add comment"
                                  value={row.comment}
                                  readOnly
                                ></textarea>
                              </td>
                              <td>
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  value={row.date}
                                  readOnly
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4 text-muted">No questions found in this file.</td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Modal.Body>
          </Modal>

          <div className="col-lg-12">
            <div className="card card_shadow">
              <div className="card-header card-header-light-blue align-items-center d-flex">
                <h4 className="card-title mb-0 flex-grow-1 fs-16">Notes</h4>
              </div>
              <div className="card-body">
                <div className="" style={{ marginTop: 15 }}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <textarea
                          type="date"
                          className="form-control"
                          name="notes"
                          disabled
                          value={JobInformationData.notes}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-soft-info {
          background-color: rgba(53, 119, 241, 0.1);
        }
        .border-dashed {
          border-style: dashed !important;
        }
      `}</style>
    </div>
  );
};

export default CustomerJobInformationPage;

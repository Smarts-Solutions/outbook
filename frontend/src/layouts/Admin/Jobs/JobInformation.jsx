import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GetAllJabData,
  Update_Status,
  GET_ALL_CHECKLIST,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { JobAction } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";

const JobInformationPage = ({ job_id, getAccessDataJob, goto }) => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const location = useLocation();
  const [AllJobData, setAllJobData] = useState([]);
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

console.log("========", selectStatusIs);


  useEffect(() => {
    JobDetails();
    GetStatus();
  }, []);

  useEffect(() => {
    GetJobData();
  }, [JobInformationData]);

  const JobDetails = async () => {
    const req = { action: "getByJobId", job_id: location.state.job_id };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setBudgetedHours({
            hours: response.data.budgeted_hours.split(":")[0],
            minutes: response.data.budgeted_hours.split(":")[1],
          });
          setReviewTime({
            hours: response.data.review_time.split(":")[0],
            minutes: response.data.review_time.split(":")[1],
          });
          setPreparationTimne({
            hours: response.data.total_preparation_time.split(":")[0],
            minutes: response.data.total_preparation_time.split(":")[1],
          });
          setTotalTime({
            hours: response.data.total_time.split(":")[0],
            minutes: response.data.total_time.split(":")[1],
          });
          setFeedbackIncorporationTime({
            hours: response.data.feedback_incorporation_time.split(":")[0],
            minutes: response.data.feedback_incorporation_time.split(":")[1],
          });
          setInvoiceTime({
            hours: response.data.invoice_hours.split(":")[0],
            minutes: response.data.invoice_hours.split(":")[1],
          });
          setJobInformationData((prevState) => ({
            ...prevState,
            AccountManager: `${response.data.outbooks_acount_manager_first_name} ${response.data.outbooks_acount_manager_last_name}`,
            Customer: response.data.customer_trading_name,
            Customer_id: response.data.customer_id,
            Client: response.data.client_trading_name,
            ClientJobCode: response.data.client_job_code,
            CustomerAccountManager: response.data.account_manager_officer_id,
            Service: response.data.service_id,
            JobType: response.data.job_type_id,
            Reviewer: response.data.reviewer_id,
            AllocatedTo: response.data.allocated_id,
            AllocatedOn: response.data.allocated_on,
            DateReceivedOn: response.data.date_received_on,
            YearEnd: response.data.year_end,
            TotalPreparationTime: response.data.total_preparation_time,
            ReviewTime: response.data.review_time,
            FeedbackIncorporationTime:
              response.data.feedback_incorporation_time,
            TotalTime: response.data.total_time,
            EngagementModel: response.data.engagement_model,
            ExpectedDeliveryDate: response.data.expected_delivery_date,
            DueOn: response.data.due_on,
            SubmissionDeadline: response.data.submission_deadline,
            CustomerDeadlineDate: response.data.customer_deadline_date,
            SLADeadlineDate: response.data.sla_deadline_date,
            InternalDeadlineDate: response.data.internal_deadline_date,
            FilingWithCompaniesHouseRequired:
              response.data.filing_Companies_required,
            CompaniesHouseFilingDate: response.data.filing_Companies_date,
            FilingWithHMRCRequired: response.data.filing_hmrc_required,
            HMRCFilingDate: response.data.filing_hmrc_date,
            OpeningBalanceAdjustmentRequired:
              response.data.opening_balance_required,
            OpeningBalanceAdjustmentDate: response.data.opening_balance_date,
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
          }));
          setStatusId(response.data.status_type);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetStatus = async () => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(MasterStatusData(data))
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

  const GetJobData = async () => {
    const req = { customer_id: JobInformationData?.Customer_id };
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

  const handleJobEdit = () => {
    navigate("/admin/job/edit", {
      state: {
        job_id: location.state.job_id,
        activeTab: location.state.activeTab,
      },
    });
  };

  const handleDelete = async (row, type) => {
    const req = { action: "delete", job_id: location.state.job_id };
    const data = { req: req, authToken: token };

    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert.fire({
            title: "Deleted",
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            window.history.back();
          }, 1500);
        } else {
          sweatalert.fire({
            title: "Failed",
            icon: "error",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        return;
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
              Update_Status({ req, authToken: token })
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
              GetJobData();
            } else if (res.data === "W") {
              sweatalert.fire({
                title: "Warning",
                text: res.message,
                icon: "warning",
                confirmButtonText: "Ok",
                timer: 1000,
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
            "Fortnightly",
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

  const [serviceFieldsData, setServiceFieldsData] = useState([]);
  useEffect(() => {
    setServiceFieldsData(
      serviceFields[JobInformationData?.Service]?.fields ||
        serviceFields[0]?.fields
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
                {(getAccessDataJob.update === 1 ||
                  
                  role === "SUPERADMIN") && (
                  <div className="w-auto">
                    <select
                      className="form-select form-control"
                      onChange={handleStatusChange}
                      value={selectStatusIs}
                    >
                      {statusDataAll.map((status) => (
                        <option value={status.id} key={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(getAccessDataJob.update === 1 ||
                  
                  role === "SUPERADMIN") && (
                  <button className="edit-icon" onClick={handleJobEdit}>
                    <i className="ti-pencil text-primary" />
                  </button>
                )}

                {location.state.timesheet_job_id == null
                  ? (getAccessDataJob.delete === 1 ||
                      
                      role === "SUPERADMIN") && (
                      <button className="delete-icon" onClick={handleDelete}>
                        <i className="ti-trash text-danger" />
                      </button>
                    )
                  : ""}
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
                      defaultValue=""
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
                      defaultValue=""
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
                      defaultValue=""
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
                      defaultValue=""
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
                      defaultValue=""
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
                      defaultValue=""
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
                      defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                      defaultValue=""
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
                      defaultValue=""
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
                      defaultValue=""
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
                                                defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                      defaultValue=""
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
                        defaultValue=""
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            ExpectedDeliveryDate: e.target.value,
                          })
                        }
                        value={JobInformationData.ExpectedDeliveryDate}
                      />
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label className="form-label">Due On</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="DD-MM-YYYY"
                        name="DueOn"
                        defaultValue=""
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            DueOn: e.target.value,
                          })
                        }
                        value={JobInformationData.DueOn}
                      />
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label className="form-label">Submission Deadline</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="DD-MM-YYYY"
                        name="SubmissionDeadline"
                        defaultValue=""
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            SubmissionDeadline: e.target.value,
                          })
                        }
                        value={JobInformationData.SubmissionDeadline}
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
                        defaultValue=""
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            CustomerDeadlineDate: e.target.value,
                          })
                        }
                        value={JobInformationData.CustomerDeadlineDate}
                      />
                    </div>
                    <div className="col-lg-4 mb-3">
                      <label className="form-label">SLA Deadline Date</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="DD-MM-YYYY"
                        name="SLADeadlineDate"
                        defaultValue=""
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            SLADeadlineDate: e.target.value,
                          })
                        }
                        value={JobInformationData.SLADeadlineDate}
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
                        defaultValue=""
                        disabled
                        onChange={(e) =>
                          setJobInformationData({
                            ...JobInformationData,
                            InternalDeadlineDate: e.target.value,
                          })
                        }
                        value={JobInformationData.InternalDeadlineDate}
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
                          defaultValue=""
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
                          defaultValue=""
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
                          defaultValue=""
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
                          defaultValue=""
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
                    <div className="row">
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
                            defaultValue=""
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
                            defaultValue=""
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
                                  defaultValue=""
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
                                  defaultValue=""
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
                            defaultValue=""
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
    </div>
  );
};

export default JobInformationPage;

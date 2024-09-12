export const EMPTY_EMAIL_ERROR = "Please enter email.";
export const INVALID_EMAIL_ERROR = "Please enter a valid email.";
export const PASSWORD_ERROR = "Please enter password.";

// ADD CUSTOMER FORM VALIDATION MESSAGES
export const ADD_CUSTOMER = {
  ACCOUNT_MANAGER: "Please select an Account Manager",
  COMPANY_NAME: "Please enter Company Name",
  ENTITY_TYPE: "Please select Entity Type",
  COMPANY_STATUS: "Please select Company Status",
  COMPANY_NUMBER: "Please enter Company Number",
  REG_OFFICE_ADDRESS: "Please enter Registered Office Address",
  INCORPORATION_DATE: "Please select Incorporation Date",
  INCORPORATION_IN: "Please select Incorporation In",
  VAT_NUMBER: "Please enter VAT Number",
  WEBSITE: "Please enter Website",
  TRADING_NAME: "Please enter Trading Name",
  TRADING_ADDRESS: "Please enter Trading Address",

  VAT_NUMBER_VALIDATION: "VAT Number cannot exceed 9 Numbers",
  WEBSITE_VALIDATION: "Website cannot exceed 200 characters",


  ENTER_FIRST_NAME: "Please enter First Name",
  LAST_NAME: "Please enter Last Name",
  EMAIL: "Please enter Email",
  REQ_FIRST_NAME: "First Name is required",
  REQ_LAST_NAME: "Last Name is required",
  REQ_EMAIL: "Email is required",
  VALID_EMAIL: "Valid Email is required"
};

export const EDIT_CUSTOMER = {
  SELECT_CLIENT_INDUSTRIES: "Select Client Industry",
  ENTER_TRADING_NAME: "Please enter Trading Name",
  ENTER_FIRST_NAME: "Please enter First Name",
  LAST_NAME: "Please enter Last Name",
  EMAIL: "Please enter Email",
  RESIDENTIOAL_ADDRESS: "Please enter Residential Address",
  invalidEmail: "Please enter a valid Email",
  invalidPhone: "Phone Number must be between 9 to 12 digits",
  REQUIRED_FIRST_NAME: "First Name is required",
  REQUIRES_LAST_NAME: "Last Name is required",
  REQUIRE_EMAIL: "Email is required",
  VALID_EMAIL: "Please enter a valid Email",
  COMPANY_NAME: "Please enter Company Name",
  ENTITY_TYPE: "Please select Entity Type",
  COMPANY_STATUS: "Please select Company Status",
  COMPANY_NUMBER: "Please enter Company Number",
  REGISTRER_OFFICE_ADDRESS: "Please enter Registered Office Address",
  INCORPORATION_DATE: "Please select Incorporation Date",
  INCORPORATION_IN: "Please select Incorporation In",
  PHONE_VALIDATION: "Phone Number must be between 9 to 12 digits",
  AUTHORISED: "authorised_signatory_status",
  REQUIRED_FEILD: "This field is required",
  INVALID_EMAIL_ERROR: "Invalid email address",
};



export const FTEDedicatedErrorMessages = {
  'accountants': "Please Enter Number of Accountants",
  'feePerAccountant': "Please Enter Fee Per Accountant",
  'bookkeepers': "Please Enter Number of Bookkeepers",
  'feePerBookkeeper': "Please Enter Fee Per Bookkeeper",
  'payrollExperts': "Please Enter Number of Payroll Experts",
  'feePerPayrollExpert': "Please Enter Fee Per Payroll Expert",
  'taxExperts': "Please Enter Number of Tax Experts",
  'feePerTaxExpert': "Please Enter Fee Per Tax Expert",
  'numberOfAdmin': "Please Enter Number of Admin/Other Staff",
  'feePerAdmin': "Please Enter Fee Per Admin/Other Staff",
}

export const PercentageModelErrorMessages = {
  'total_outsourcing': "Please Enter Total Outsourcing Fee Percentage between 0 and 100",
  'accountants': "Please Enter Accountants Fee Percentage between 0 and 100",
  'bookkeepers': "Please Enter Bookkeepers Fee Percentage between 0 and 100",
  'payroll_experts': "Please Enter Payroll Experts Fee Percentage between 0 and 100",
  'tax_experts': "Please Enter Tax Experts Fee Percentage between 0 and 100",
  'admin_staff': "Please Enter Admin/Other Staff Fee Percentage between 0 and 100",
};

export const AdhocPAYGHourlyErrorMessages = {
  'adhoc_accountants': "Please Enter Accountants Fee Per Hour between 7 and 25",
  'adhoc_bookkeepers': 'Please Enter Bookkeepers Fee Per Hour between 7 and 25',
  'adhoc_payroll_experts': "Please Enter Payroll Experts Fee Per Hour between 7 and 25",
  'adhoc_tax_experts': "Please Enter Tax Experts Fee Per Hour between 7 and 25",
  'adhoc_admin_staff': "Please Enter Admin/Other Staff Fee Per Hour between 7 and 25",
}

export const AddMissionLogErros = {
  'missing_log': 'Missing Log is required',
  'missing_paperwork': 'Missing Paperwork is required',
  'missing_log_sent_on': 'Missing Log Sent On is required',
  'missing_log_prepared_date': 'Missing Log Prepared Date is required',
  'missing_log_title': 'Missing Log Title is required',
  'missing_log_reviewed_by': 'Missing Log Reviewed By is required',
  'missing_log_reviewed_date': 'Missing Log Reviewed Date is required',
  'missing_paperwork_received_on': 'Missing Paperwork Received On is required',
  'missing_log_document': 'Missing Log Document is required',
  'status': 'Status is required',
}

export const CreateJobErrorMessage = {
  'AccountManager': 'Please Enter Account Manager',
  'Customer': 'Please Enter Customer',
  'Client': 'Please Select Client',
  'CustomerAccountManager': 'Please Select Customer Account Manager',
  'Service': 'Please Select Service',
  'JobType': 'Please Select Job Type',
  'NumberOfTransactions': 'Please Enter Number Of Transactions less than 1000000',
  'NumberOfTrialBalanceItems': 'Please Enter Number Of Trial Balance Items less than 5000',
  'Turnover': 'Please Enter Turnover less than 200000000',
}
 
const fieldErrors = {
  AccountManager: "Please Enter Account Manager",
  Customer: "Please Enter Customer",
  Client: "Please Select Client",
  CustomerAccountManager: "Please Select Customer Account Manager",
  Service: "Please Select Service",
  JobType: "Please Select Job Type",
  NumberOfTransactions: "Please Enter Number Of Transactions less than 1000000",
  NumberOfTrialBalanceItems:
    "Please Enter Number Of Trial Balance Items less than 5000",
  Turnover: "Please Enter Turnover less than 200000000",
};



export default fieldErrors;

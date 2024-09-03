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
  WEBSITE_VALIDATION:  "Website cannot exceed 200 characters",


  ENTER_FIRST_NAME: "Please enter First Name",
  LAST_NAME: "Please enter Last Name",
  EMAIL: "Please enter Email",
  REQ_FIRST_NAME:"First Name is required",
  REQ_LAST_NAME:"Last Name is required",
  REQ_EMAIL:"Email is required",
  VALID_EMAIL:"Valid Email is required"
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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CUSTOMER_JOB_STATUS_REPORT,
  CUSTOMER_JOB_SUMMARY_REPORTS,
  CUSTOMER_JOB_PENDING_REPORT,
  CUSTOMER_JOB_RECEIVED_SEND_REPORT,
  CUSTOMER_DUE_BY_REPORT,
  CUSTOMER_TEAM_MONTHLY_REPORT,
  CUSTOMER_TAX_WEEKLY_REPORT,
  CUSTOMER_AVERAGE_TAT_REPORT,
  CUSTOMER_REPORT_COUNT_JOB,
  CUSTOMER_MISSING_TIMESHEET_REPORT,
  CUSTOMER_DISCREPANCY_REPORT,
} from "../../../Services/Report/customerReportService";

const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));

export const CustomerJobStatusReport = createAsyncThunk(
  "customerJobStatusReports",
  async (data) => {
    try {
      const { req, authToken } = data;
      const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        page: req?.page || 1,
        limit: req?.limit || 10,
        search: req?.search || "",
        ip: IP_Data,
        StaffUserId: staffDetails.id,
      };
      const res = await CUSTOMER_JOB_STATUS_REPORT(updatedReq, authToken);
      return res;
    } catch (err) {
      return err;
    }
  }
);

export const customerJobSummaryReports = createAsyncThunk(
  "customerJobSummaryReports",
  async (data) => {
    try {
      const { authToken } = data;
      const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ip: IP_Data,
        StaffUserId: staffDetails.id,
      };
      const res = await CUSTOMER_JOB_SUMMARY_REPORTS(updatedReq, authToken);
      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const customerJobPendingReports = createAsyncThunk(
  "customerJobPendingReports",
  async (data) => {
    try {
      const { authToken } = data;
      const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ip: IP_Data,
        StaffUserId: staffDetails.id,
      };
      const res = await CUSTOMER_JOB_PENDING_REPORT(updatedReq, authToken);
      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const CustomerReceivedSentReport = createAsyncThunk(
  "customerJobReceivedSentReports",
  async (data) => {
    try {
      const { authToken } = data;
      const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ip: IP_Data,
        StaffUserId: staffDetails.id,
      };
      const res = await CUSTOMER_JOB_RECEIVED_SEND_REPORT(updatedReq, authToken);
      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const CustomerDueByReport = createAsyncThunk(
  "CustomerDueByReport",
  async (data) => {
    try {
      const { authToken } = data;
      const res = await CUSTOMER_DUE_BY_REPORT({}, authToken);
      return res;
    } catch (err) {
      return err;
    }
  }
);

export const CustomerTeamMonthlyReport = createAsyncThunk(
  "CustomerTeamMonthlyReport",
  async (data) => {
    try {
      const { authToken } = data;
      const res = await CUSTOMER_TEAM_MONTHLY_REPORT({}, authToken);
      return res;
    } catch (err) {
      return err;
    }
  }
);

export const CustomerTaxWeeklyReport = createAsyncThunk(
  "CustomerTaxWeeklyReport",
  async (data) => {
    try {
      const { req, authToken } = data;
      const res = await CUSTOMER_TAX_WEEKLY_REPORT(req, authToken);
      return res;
    } catch (err) {
      return err;
    }
  }
);

export const CustomerAverageTatReport = createAsyncThunk(
  "CustomerAverageTatReport",
  async (data) => {
    try {
      const { authToken } = data;
      const res = await CUSTOMER_AVERAGE_TAT_REPORT({}, authToken);
      return res;
    } catch (err) {
      return err;
    }
  }
);

export const CustomerReportCountJob = createAsyncThunk(
  "CustomerReportCountJob",
  async (data) => {
    try {
      const { req, authToken } = data;
      const res = await CUSTOMER_REPORT_COUNT_JOB(req, authToken);
      return res;
    } catch (err) {
      return err;
    }
  }
);

export const CustomerMissingTimesheetReport = createAsyncThunk(
  "CustomerMissingTimesheetReport",
  async (data) => {
    try {
      const { authToken } = data;
      const res = await CUSTOMER_MISSING_TIMESHEET_REPORT({}, authToken);
      return res;
    } catch (err) {
      return err;
    }
  }
);

export const CustomerDiscrepancyReport = createAsyncThunk(
  "CustomerDiscrepancyReport",
  async (data) => {
    try {
      const { authToken } = data;
      const res = await CUSTOMER_DISCREPANCY_REPORT({}, authToken);
      return res;
    } catch (err) {
      return err;
    }
  }
);

const CustomerReportSlice = createSlice({
  name: "CustomerReportSlice",
  initialState: {
    isLoading: false,
    isError: false,
    jobstatusreport: [],
    jobsummaryreports: [],
    jobpendingreport: [],
    receivedsentreport: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CustomerJobStatusReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomerJobStatusReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobstatusreport = action.payload;
      })
      .addCase(CustomerJobStatusReport.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(customerJobSummaryReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(customerJobSummaryReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobsummaryreports = action.payload;
      })
      .addCase(customerJobSummaryReports.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(customerJobPendingReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(customerJobPendingReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobpendingreport = action.payload;
      })
      .addCase(customerJobPendingReports.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(CustomerReceivedSentReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CustomerReceivedSentReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.receivedsentreport = action.payload;
      })
      .addCase(CustomerReceivedSentReport.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default CustomerReportSlice;

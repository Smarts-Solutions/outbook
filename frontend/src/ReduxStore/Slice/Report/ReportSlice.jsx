import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  JOB_STATUS_REPORT,
  JOB_SUMMARY_REPORTS,
  TEAM_MONTHLY_REPORT,
  JOB_PENDING_REPORT,
  JOB_RECEIVED_SEND_REPORT,
  DUE_BY_REPORT,
  JOBS, 
  TextWeeklyStatusReport,
  AVERAGE_TAT_REPORT,
  WEEKLY_REPORT_FILTER

} from "../../../Services/Report/reportService";
const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));

// Get Role
export const JobStatusReport = createAsyncThunk("jobStatusReports", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await JOB_STATUS_REPORT(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const jobSummaryReports = createAsyncThunk("jobSummaryReports", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await JOB_SUMMARY_REPORTS(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const teamMonthlyReports = createAsyncThunk("teamMonthlyReports", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await TEAM_MONTHLY_REPORT(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const jobPendingReports = createAsyncThunk("jobPendingReports", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await JOB_PENDING_REPORT(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const ReceivedSentReport = createAsyncThunk("jobReceivedSentReports", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await JOB_RECEIVED_SEND_REPORT(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const dueByReport = createAsyncThunk("dueByReport", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await DUE_BY_REPORT(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const Jobs = createAsyncThunk("reportCountJob", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await JOBS(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const getWeeklyReport = createAsyncThunk("taxWeeklyStatusReport", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await TextWeeklyStatusReport(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const averageTatReport = createAsyncThunk("averageTatReport", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await AVERAGE_TAT_REPORT(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const weeklyReportFilter = createAsyncThunk("taxWeeklyStatusReportFilterKey", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await WEEKLY_REPORT_FILTER(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

//Setting Slice
const ReportSlice = createSlice({
  name: "ReportSlice",
  initialState: {
    isLoading: false,
    isError: false,
    jobstatusreport: [],
    jobsummaryreports: [],
    teammonthlyreport: [],
    jobpendingreport: [],
    receivedsentreport: [],
    duebyreport: [],
    job: [],
    textweeklystatusreport: [],
    averagetatreport : [],
    weeklyreportfilter : []
    

  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(JobStatusReport.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(JobStatusReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobstatusreport = action.payload;
      })
      .addCase(JobStatusReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(jobSummaryReports.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(jobSummaryReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobsummaryreports = action.payload;
      })
      .addCase(jobSummaryReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(teamMonthlyReports.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(teamMonthlyReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teammonthlyreport = action.payload;
      })
      .addCase(teamMonthlyReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(jobPendingReports.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(jobPendingReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobpendingreport = action.payload;
      })
      .addCase(jobPendingReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true
      })
      .addCase(ReceivedSentReport.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(ReceivedSentReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.receivedsentreport = action.payload;
      })
      .addCase(ReceivedSentReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true
      })
      .addCase(dueByReport.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(dueByReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.duebyreport = action.payload;
      })
      .addCase(dueByReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true
      })
      .addCase(Jobs.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(Jobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.job = action.payload;
      })
      .addCase(Jobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getWeeklyReport.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getWeeklyReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.textweeklystatusreport = action.payload;
      })
      .addCase(getWeeklyReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(averageTatReport.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(averageTatReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.averagetatreport = action.payload;
      })
      .addCase(averageTatReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(weeklyReportFilter.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(weeklyReportFilter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weeklyreportfilter = action.payload;
      })
      .addCase(weeklyReportFilter.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })



  },
});

export default ReportSlice;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    JOB_STATUS_REPORT,
    JOB_SUMMARY_REPORTS,
    TEAM_MONTHLY_REPORT,
    JOB_PENDING_REPORT
  
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

//Setting Slice
const ReportSlice = createSlice({
  name: "ReportSlice",
  initialState: {
    isLoading: false,
    isError: false,
    jobstatusreport: [],
    jobsummaryreports : [],
    teammonthlyreport : [],
    jobpendingreport : []
  
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
      }
      );
     
       
  },
});

export default ReportSlice;

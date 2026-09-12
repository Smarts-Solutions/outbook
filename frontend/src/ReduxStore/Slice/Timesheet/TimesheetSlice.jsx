import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_TIMESHEET_TASK_TYPE ,GET_TIMESHEET ,SAVE_TIMESHEET ,GET_STAFF_HOURSMINUTE, GET_TIMESHEET_LOGS, DELETE_TIMESHEET_ROW, GET_MANAGER_REVIEW_COUNT, GET_MANAGER_REVIEW_DATA, LOG_TIMESHEET_ACTIVITY } from "../../../Services/Timesheet/TimesheetService";
const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));

export const getTimesheetTaskTypedData = createAsyncThunk("getTimesheetTaskType", async (data) => {
    try {
        const { req, authToken } = data;
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
        const updatedReq = {
            ...req,
            ip: IP_Data,  
            StaffUserId: StaffUserId.id,
        };
        const res = await GET_TIMESHEET_TASK_TYPE(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const getTimesheetData = createAsyncThunk("getTimesheet", async (data) => {
    try {
        const { req, authToken } = data;
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
        const updatedReq = {
            ...req,
            ip: IP_Data,  
            StaffUserId: StaffUserId.id,
        };
        const res = await GET_TIMESHEET(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const saveTimesheetData = createAsyncThunk("saveTimesheet", async (data) => {
    try {
        const { req, authToken } = data;
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
        const updatedReq = {
            ...req,
            ip: IP_Data,  
            StaffUserId: StaffUserId.id,
        };
        const res = await SAVE_TIMESHEET(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const getStaffHourMinute = createAsyncThunk("getStaffHourMinute", async (data) => {
    try {
        const { req, authToken } = data;
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
        const updatedReq = {
            ...req,
            ip: IP_Data,  
            StaffUserId: StaffUserId.id,
        };
        const res = await GET_STAFF_HOURSMINUTE(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const getTimesheetLogsData = createAsyncThunk("getTimesheetLogs", async (data) => {
    try {
        const { req } = data;
        const res = await GET_TIMESHEET_LOGS(req);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const deleteTimesheetRowData = createAsyncThunk("deleteTimesheetRow", async (data) => {
    try {
        const { req } = data;
        const res = await DELETE_TIMESHEET_ROW(req);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const getManagerReviewCount = createAsyncThunk("getmanagerreviewcount", async (data) => {
    try {
        const { req, authToken } = data;
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
        const updatedReq = {
            ...req,
            StaffUserId: StaffUserId.id,
        };
        const res = await GET_MANAGER_REVIEW_COUNT(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const getManagerReviewData = createAsyncThunk("getManagerReviewData", async (data) => {
    try {
        const { req, authToken } = data;
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
        const updatedReq = {
            ...req,
            StaffUserId: StaffUserId.id,
        };
        const res = await GET_MANAGER_REVIEW_DATA(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const logTimesheetActivityData = createAsyncThunk("logTimesheetActivity", async (data) => {
    try {
        const res = await LOG_TIMESHEET_ACTIVITY(data);
        return res; 
    } catch (err) {
        throw err;
    }
});

const TimesheetSlice = createSlice({
    name: "TimesheetSlice",
    initialState: {
        isLoading: false,
        isError: false,
        dashboard: [],
        activity: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTimesheetTaskTypedData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTimesheetTaskTypedData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboard = action.payload;
            })
            .addCase(getTimesheetTaskTypedData.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(getTimesheetData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTimesheetData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activity = action.payload;
            })
            .addCase(getTimesheetData.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(saveTimesheetData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveTimesheetData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activity = action.payload;
            })
            .addCase(saveTimesheetData.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });       
    },
});

export default TimesheetSlice;

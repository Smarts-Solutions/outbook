import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DASHBOARD, ACTIVITYLOG , LINKDATA } from "../../../Services/Dashboard/DashboardService";
const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));

export const DashboardData = createAsyncThunk("getDashboardData", async (data) => {
    try {
        const { req, authToken } = data;
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
        const updatedReq = {
            ...req,
            ip: IP_Data,  
            StaffUserId: StaffUserId.id,
        };
        const res = await DASHBOARD(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const ActivityLog = createAsyncThunk("getDashboardActivityLog", async (data) => {
    try {
        const { req, authToken } = data;
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      
        const updatedReq = {
            ...req,
            ip: IP_Data,  
            StaffUserId: StaffUserId.id, 
        };

        const res = await ACTIVITYLOG(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const linkedData = createAsyncThunk("getCountLinkData", async (data) => {
    try {
        const { req, authToken } = data;
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));

        const updatedReq = {
            ...req,
            ip: IP_Data,  
            StaffUserId: StaffUserId.id, 
        };

        const res = await LINKDATA(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

const DashboardSlice = createSlice({
    name: "DashboardSlice",
    initialState: {
        isLoading: false,
        isError: false,
        dashboard: [],
        activity: [],
        linkeddata: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DashboardData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DashboardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.dashboard = action.payload;
            })
            .addCase(DashboardData.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(ActivityLog.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ActivityLog.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activity = action.payload;
            })
            .addCase(ActivityLog.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(linkedData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(linkedData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.linkeddata = action.payload;
            })
            .addCase(linkedData.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});

export default DashboardSlice;

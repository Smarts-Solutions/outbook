import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DASHBOARD, ACTIVITYLOG } from "../../../Services/Dashboard/DashboardService";
import axios from "axios";
import { GET_IP } from "../../../Utils/Comman_function";

const StaffUserId = JSON.parse(localStorage.getItem("staffDetails")) || {};

export const DashboardData = createAsyncThunk("getDashboardData", async (data) => {
    try {
        const { req, authToken } = data;
        let IP_Data = await GET_IP();
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
        
        const updatedReq = {
            ...req,
            ip: IP_Data.data.ip,  
            StaffUserId: StaffUserId.id,
        };

        console.log("updatedReq", updatedReq);

        const res = await DASHBOARD(updatedReq, authToken);
        return res; 
    } catch (err) {
        throw err;
    }
});

export const ActivityLog = createAsyncThunk("getDashboardActivityLog", async (data) => {
    try {
        const { req, authToken } = data;
        let IP_Data = await GET_IP();
        var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));

        const updatedReq = {
            ...req,
            ip: IP_Data.data.ip,  
            StaffUserId: StaffUserId.id, 
        };

        const res = await ACTIVITYLOG(updatedReq, authToken);
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
            });
    },
});

export default DashboardSlice;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DASHBOARD, ACTIVITYLOG } from "../../../Services/Dashboard/DashboardService";
import axios from "axios";

const StaffUserId = JSON.parse(localStorage.getItem("staffDetails")) || {};

export async function GET_IP() {
    try {
        const res = await axios.get(`https://api.ipify.org?format=json`);
        return res.data;  // Return only the IP data
    } catch (err) {
        console.error('Error fetching IP:', err);
        throw err;
    }
}

export const DashboardData = createAsyncThunk("getDashboardData", async (data) => {
    try {
        const { req, authToken } = data;
        let IP_Data = await GET_IP();
        
        const updatedReq = {
            ...req,
            ip: IP_Data.ip,  // Use the IP from IP_Data
            StaffUserId: StaffUserId.id,
        };

        console.log("updatedReq", updatedReq);

        const res = await DASHBOARD(updatedReq, authToken);
        return res;  // No need for `await` here
    } catch (err) {
        throw err;
    }
});

export const ActivityLog = createAsyncThunk("getDashboardActivityLog", async (data) => {
    try {
        const { req, authToken } = data;
        let IP_Data = await GET_IP();

        const updatedReq = {
            ...req,
            ip: IP_Data.ip,  // Use the IP from IP_Data
            StaffUserId: StaffUserId.id,  // Ensure StaffUserId is fetched properly
        };

        const res = await ACTIVITYLOG(updatedReq, authToken);
        return res;  // No need for `await` here
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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DASHBOARD } from "../../../Services/Dashboard/DashboardService";
import axios from "axios";
const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));

export async function GET_IP(data, token) {
    try {
        const res = await axios.get(`https://api.ipify.org?format=json`);
        return await res;
    } catch (err) { }
}
 
export const DashboardData = createAsyncThunk("getDashboardData", async (data) => {
    try {
      const { req, authToken } = data;
      let IP_Data = await GET_IP();
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await DASHBOARD(updatedReq, authToken);
      return await res;
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
    },
});

export default DashboardSlice;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CUSTOM_TIMESHEET } from "../../../Services/CustomTimesheet/CustomTimesheetService";

const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));

export const CustomTimesheetAction = createAsyncThunk("customTimesheet", async (data) => {
    try {
        const { req, authToken } = data;
        const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
        
        const updatedReq = {
            ...req,
            ip: IP_Data,
            StaffUserId: StaffUserId?.id,
            page: req.page || 1,
            limit: req.limit || 20,
            search: req.search ? req.search.trim() : (req.pagination?.search ? req.pagination.search.trim() : ""),
        };

        const res = await CUSTOM_TIMESHEET(updatedReq, authToken);
        return await res;
    } catch (err) {
        return err;
    }
});

const CustomTimesheetSlice = createSlice({
    name: "CustomTimesheetSlice",
    initialState: {
        isLoading: false,
        isError: false,
        CustomTimesheet: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(CustomTimesheetAction.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CustomTimesheetAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.CustomTimesheet = action.payload;
            })
            .addCase(CustomTimesheetAction.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            });
    },
});

export default CustomTimesheetSlice;

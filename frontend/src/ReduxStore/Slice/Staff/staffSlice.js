import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  STAFF,
  SERVICE,
  COMPETENCY,
  GETPROFILE,
} from "../../../Services/Staff/staff";
const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));

export const Staff = createAsyncThunk("staff", async (data) => {
  try {
    const { req, authToken } = data;

    const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));

    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
      page: req.page || 1,
      limit: req.limit || 10,
      search: req.search ? req.search.trim() : "",
    };

    const res = await STAFF(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

export const Service = createAsyncThunk("service", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...req, ip: IP_Data, StaffUserId: StaffUserId.id };
    const res = await SERVICE(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

export const Competency = createAsyncThunk("staffCompetency", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...req, ip: IP_Data, StaffUserId: StaffUserId.id };
    const res = await COMPETENCY(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

export const getProfile = createAsyncThunk("profile", async (data) => {
  try {
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data, StaffUserId: StaffUserId.id };
    const res = await GETPROFILE(updatedReq);

    return await res;
  } catch (err) {
    return err;
  }
});

const StaffSlice = createSlice({
  name: "StaffSlice",
  initialState: {
    isLoading: false,
    isError: false,
    Staff: [],
    Service: [],
    Competency: [],
    getprofile: [],
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Staff.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(Staff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Staff = action.payload;
      })
      .addCase(Staff.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(Service.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(Service.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Service = action.payload;
      })
      .addCase(Service.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(Competency.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(Competency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Competency = action.payload;
      })
      .addCase(Competency.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getProfile.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getprofile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default StaffSlice;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { STAFF ,SERVICE,COMPETENCY} from "../../../Services/Staff/staff";


export const Staff = createAsyncThunk("staff", async (data) => {
  try {
    const { req , authToken } = data
    const res = await STAFF( req , authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const Service = createAsyncThunk("service", async (data) => {
  try {
    const { req , authToken } = data
    const res = await SERVICE( req , authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const Competency = createAsyncThunk("staffCompetency", async (data) => {
  try {
    const { req , authToken } = data
    const res = await COMPETENCY( req , authToken);
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
    Staff : [],
    Service:[],
    Competency:[],

 
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
  },
   
});

export default StaffSlice;

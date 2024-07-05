import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { STAFF } from "../../../Services/Staff/staff";



export const Staff = createAsyncThunk("staff", async (data) => {
  try {
    const { req , authToken } = data
    const res = await STAFF( req , authToken);
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
      
  },
   
});

export default StaffSlice;

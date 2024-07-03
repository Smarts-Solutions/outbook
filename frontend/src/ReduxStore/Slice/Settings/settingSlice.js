import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ROLE , STATUS_TYPE , SERVICE} from "../../../Services/Settings/settingService";



export const Role = createAsyncThunk("role", async (data) => {
  try {
    const { req , authToken } = data
    const res = await ROLE( req , authToken);
    return await res;
  } catch (err) {
    return err;
  }
});


export const StatusType = createAsyncThunk("statusType", async (data) => {
  try {
    const { req , authToken } = data
    const res = await STATUS_TYPE( req , authToken);
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



const SettingSlice = createSlice({
  name: "SettingSlice",
  initialState: {
    isLoading: false,
    isError: false,
    Role : [],
    StatusType : [],
    Service : []
  },

  reducers: {},  
  extraReducers: (builder) => {
    builder
      .addCase(Role.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(Role.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Role = action.payload;
      })
      .addCase(Role.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(StatusType.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(StatusType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.StatusType = action.payload;
      })
      .addCase(StatusType.rejected, (state, action) => {
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

       
  },
   
});

export default SettingSlice;

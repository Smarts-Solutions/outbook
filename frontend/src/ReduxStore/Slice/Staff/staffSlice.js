import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STAFF ,SERVICE,COMPETENCY , GETPROFILE} from "../../../Services/Staff/staff";


import axios from "axios";


const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
export async function GET_IP(data, token) {
  try {
    const res = await axios.get(`https://api.ipify.org?format=json`)
    return await res;
  }
  catch (err) {
  }
}



export const Staff = createAsyncThunk("staff", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await STAFF(updatedReq, authToken);
     
    return await res;
  } catch (err) {
    return err;
  }
});

export const Service = createAsyncThunk("service", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await SERVICE(updatedReq, authToken);
  
    return await res;
  } catch (err) {
    return err;
  }
});

export const Competency = createAsyncThunk("staffCompetency", async (data) => {
  try {
    const { req , authToken } = data
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await COMPETENCY(updatedReq, authToken);
   
    return await res;
  } catch (err) {
    return err;
  }
});

export const getProfile = createAsyncThunk("profile", async (data) => {
  try {

    let IP_Data = await GET_IP();
    const updatedReq = { ...data, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
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
    Staff : [],
    Service:[],
    Competency:[],
    getprofile:[]

 
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
      })
  },
   
});

export default StaffSlice;

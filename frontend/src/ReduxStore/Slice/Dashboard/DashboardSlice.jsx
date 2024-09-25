import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GETALLCOMPANY,
 
} from "../../../Services/Customer/CustomerService";

import axios from "axios";
import { add } from "date-fns";
const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));

export async function GET_IP(data, token) {
  try {
    const res = await axios.get(`https://api.ipify.org?format=json`);
    return await res;
  } catch (err) {}
}

export const GetAllCompany = createAsyncThunk("seachCompany", async (data) => {
  try {
    const updatedReq = {
      search: data.search,
      StaffUserId: StaffUserId.id,
    };

    const res = await GETALLCOMPANY(updatedReq);

    return await res;
  } catch (err) {
    throw err;
  }
});


 


 

const CustomerSlice = createSlice({
  name: "CustomerSlice",
  initialState: {
    isLoading: false,
    isError: false,
    getallcompany: [],
    
    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAllCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getallcompany = action.payload;
      })
      .addCase(GetAllCompany.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      
      
  },
});

export default CustomerSlice;

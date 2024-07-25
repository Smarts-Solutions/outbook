import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GETALLCOMPANY } from "../../../Services/Customer/CustomerService";


export const GetAllCompany = createAsyncThunk("seachCompany", async (data) => {
  try {
    
   
    const res = await GETALLCOMPANY(data);
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

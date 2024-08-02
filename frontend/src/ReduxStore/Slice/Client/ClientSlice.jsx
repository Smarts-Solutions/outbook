import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_CLIENT_INDUSTRY } from "../../../Services/Client/ClientService";


export const GetClientIndustry = createAsyncThunk("seachCompany", async (data) => {
    const { req, authToken } = data
  try {
    const res = await GET_CLIENT_INDUSTRY(req , authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});



const ClientSlice = createSlice({
  name: "ClientSlice",
  initialState: {
    isLoading: false,
    isError: false,
    getallcompany: [],
    getclientindustry: [],
   
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetClientIndustry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetClientIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getclientindustry = action.payload;
      })
      .addCase(GetClientIndustry.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
  },
});

export default ClientSlice;

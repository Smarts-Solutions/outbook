import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_CLIENT_INDUSTRY, ADD_CLIENT, GET_ALL_CLIENT } from "../../../Services/Client/ClientService";


export const GetClientIndustry = createAsyncThunk("clientIndustry", async (data) => {
  const { req, authToken } = data
  try {
    const res = await GET_CLIENT_INDUSTRY(req, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});



export const Get_All_Client = createAsyncThunk("clientAction", async (data) => {
  const { req, authToken } = data
  try {
    const res = await GET_ALL_CLIENT(req, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const Add_Client = createAsyncThunk("addClient", async (req) => {

  try {
    const res = await ADD_CLIENT(req);
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
    addclient: [],
    getallclient: []


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
      .addCase(Add_Client.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Add_Client.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addclient = action.payload;
      })
      .addCase(Add_Client.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(Get_All_Client.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Get_All_Client.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getallclient = action.payload;
      })
      .addCase(Get_All_Client.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

  },
});

export default ClientSlice;

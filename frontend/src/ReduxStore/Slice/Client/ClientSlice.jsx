import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_CLIENT_INDUSTRY, ADD_CLIENT, CLIENT_ACTION, EDIT_CLIENT } from "../../../Services/Client/ClientService";

import axios from "axios";
const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
const token = localStorage.getItem("token");


export async function GET_IP(data, token) {
  try {
    const res = await axios.get(`https://api.ipify.org?format=json`)
    return await res;
  }
  catch (err) {
  }
}


export const GetClientIndustry = createAsyncThunk("clientIndustry", async (data) => {
  const { req, authToken } = data
  try {
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await GET_CLIENT_INDUSTRY(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const ClientAction = createAsyncThunk("clientAction", async (data) => {
  const { req, authToken } = data
  try {
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await CLIENT_ACTION(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const Add_Client = createAsyncThunk("addClient", async (req) => {
  const authToken = token;

  try {
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await ADD_CLIENT(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const Edit_Client = createAsyncThunk("clientUpdate", async (req) => {
  const authToken = token;
  try {
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await EDIT_CLIENT(updatedReq, authToken);

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
    clientaction: [],
    editclient: [],




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
      .addCase(ClientAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ClientAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientaction = action.payload;
      })
      .addCase(ClientAction.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(Edit_Client.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Edit_Client.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editclient = action.payload;
      })
      .addCase(Edit_Client.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });



  },
});

export default ClientSlice;

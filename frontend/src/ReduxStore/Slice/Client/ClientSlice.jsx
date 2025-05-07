import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_CLIENT_INDUSTRY, ADD_CLIENT, CLIENT_ACTION, EDIT_CLIENT ,add_Client_Document ,delete_Client_File } from "../../../Services/Client/ClientService";
const token = localStorage.getItem("token");
const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));



export const GetClientIndustry = createAsyncThunk("clientIndustry", async (data) => {
  const { req, authToken } = data
  try { 
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...req, ip: IP_Data, StaffUserId: StaffUserId.id };
    const res = await GET_CLIENT_INDUSTRY(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const ClientAction = createAsyncThunk("clientAction", async (data) => {
  const { req, authToken } = data
  try {
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails")); 
    const updatedReq = { ...req, ip: IP_Data, StaffUserId: StaffUserId.id };
    const res = await CLIENT_ACTION(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const Add_Client = createAsyncThunk("addClient", async (req) => {
  const authToken = token;

  try { 
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...req, ip: IP_Data, StaffUserId: StaffUserId.id };
    const res = await ADD_CLIENT(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});


export const addClientDocument = createAsyncThunk("addClientDocument", async (req) => {
  const authToken = token;
  try { 
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...req, ip: IP_Data, StaffUserId: StaffUserId.id };
    console.log("updatedReq", updatedReq)
    const res = await add_Client_Document(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const deleteClientFile = createAsyncThunk("deleteClientFile", async (req) => {
  const authToken = token;
  try { 
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...req, ip: IP_Data, StaffUserId: StaffUserId.id };
    const res = await delete_Client_File(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});



export const Edit_Client = createAsyncThunk("clientUpdate", async (req) => {
  const authToken = token;
  try { 
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...req, ip: IP_Data, StaffUserId: StaffUserId.id };
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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GETALLCOMPANY, ADD_CUSTOMER, GET_SERVICE, ADD_SERVICES, ADD_PEPPER_WORK, GET_ALL_CUSTOMER, GET_CUSTOMER, EDIT_CUSTOMER, Delete_Customer_File, GET_ALL_JOB_DATA, Add_Job_Type, GET_ALL_JOB_LIST, UPDATE_JOB , GETALLCHECKLIST } from "../../../Services/Customer/CustomerService";

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

export const GetAllCompany = createAsyncThunk("seachCompany", async (data) => {
  try {
    const { req } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await GETALLCOMPANY(updatedReq);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const AddCustomer = createAsyncThunk("addCustomer", async (data) => {
  try {

    const { req, authToken } = data
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await ADD_CUSTOMER(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const Get_Service = createAsyncThunk("service", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await GET_SERVICE(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const ADD_SERVICES_CUSTOMERS = createAsyncThunk("updateProcessCustomer", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await ADD_SERVICES(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const ADD_PEPPER_WORKS = createAsyncThunk("updateProcessCustomerFile", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip,customer_id:data.customer_id, StaffUserId: StaffUserId.id };
    const res = await ADD_PEPPER_WORK(updatedReq, authToken);


    return await res;
  } catch (err) {
    throw err;
  }
});

export const GET_ALL_CUSTOMERS = createAsyncThunk("customerAction", async (data) => {
  try {
    const { req, authToken } = data

    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await GET_ALL_CUSTOMER(updatedReq, authToken);


    return await res;
  } catch (err) {
    throw err;
  }
});

export const GET_CUSTOMER_DATA = createAsyncThunk("getSingleCustomer", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await GET_CUSTOMER(updatedReq, authToken);


    return await res;
  } catch (err) {
    throw err;
  }
});

export const Edit_Customer = createAsyncThunk("customerUpdate", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await EDIT_CUSTOMER(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const DELETE_CUSTOMER_FILE = createAsyncThunk("updateProcessCustomerFileAction", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await Delete_Customer_File(updatedReq, authToken);


    return await res;
  } catch (err) {
    throw err;
  }
});

export const GetAllJabData = createAsyncThunk("getAddJobData", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await GET_ALL_JOB_DATA(updatedReq, authToken);


    return await res;
  } catch (err) {
    throw err;
  }
});

export const AddAllJobType = createAsyncThunk("jobAdd", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await Add_Job_Type(updatedReq, authToken);


    return await res;
  } catch (err) {
    throw err;
  }
});

export const Get_All_Job_List = createAsyncThunk("jobAction", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await GET_ALL_JOB_LIST(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const UpdateJob = createAsyncThunk("jobUpdate", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await UPDATE_JOB(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const GET_ALL_CHECKLIST = createAsyncThunk("checklistAction", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await GETALLCHECKLIST(updatedReq, authToken);
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
    addcustomer: [],
    get_service: [],
    addcustomerservices: [],
    pepperwork: [],
    getallcustomers: [],
    getcustomer: [],
    editcustomer: [],
    deletecustomerfile: [],
    getalljobdata: [],
    addjobtype: [],
    getalljoblist: [],
    updatejob: [],
    getallchecklist: []

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
      .addCase(AddCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addcustomer = action.payload;
      })
      .addCase(AddCustomer.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(Get_Service.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Get_Service.fulfilled, (state, action) => {
        state.isLoading = false;
        state.get_service = action.payload;
      })
      .addCase(Get_Service.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(ADD_SERVICES_CUSTOMERS.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ADD_SERVICES_CUSTOMERS.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addcustomerservices = action.payload;
      })
      .addCase(ADD_SERVICES_CUSTOMERS.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(ADD_PEPPER_WORKS.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ADD_PEPPER_WORKS.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pepperwork = action.payload;
      })
      .addCase(ADD_PEPPER_WORKS.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(GET_ALL_CUSTOMERS.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GET_ALL_CUSTOMERS.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getallcustomers = action.payload;
      })
      .addCase(GET_ALL_CUSTOMERS.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(GET_CUSTOMER_DATA.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GET_CUSTOMER_DATA.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getcustomer = action.payload;
      })
      .addCase(GET_CUSTOMER_DATA.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(Edit_Customer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Edit_Customer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editcustomer = action.payload;
      })
      .addCase(Edit_Customer.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(DELETE_CUSTOMER_FILE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DELETE_CUSTOMER_FILE.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deletecustomerfile = action.payload;
      })
      .addCase(DELETE_CUSTOMER_FILE.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(GetAllJabData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAllJabData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getalljobdata = action.payload;
      })
      .addCase(GetAllJabData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(AddAllJobType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddAllJobType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addjobtype = action.payload;
      })
      .addCase(AddAllJobType.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(Get_All_Job_List.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Get_All_Job_List.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getalljoblist = action.payload;
      })
      .addCase(Get_All_Job_List.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(UpdateJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UpdateJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updatejob = action.payload;
      })
      .addCase(UpdateJob.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(GET_ALL_CHECKLIST.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GET_ALL_CHECKLIST.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getallchecklist = action.payload;
      })
      .addCase(GET_ALL_CHECKLIST.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
  },
});

export default CustomerSlice;

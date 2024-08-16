import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ROLE, STATUS_TYPE, SERVICE, PERSONROLE , CLIENTINDUSTRY ,COUNTRY , JOBTYPE,ADDTASK,GetServicesByCustomer,GETTASK } from "../../../Services/Settings/settingService";




//Get Role
export const Role = createAsyncThunk("role", async (data) => {
  try {
    const { req, authToken } = data
    const res = await ROLE(req, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

//Get StatusType
export const StatusType = createAsyncThunk("statusType", async (data) => {
  try {
    const { req, authToken } = data
    const res = await STATUS_TYPE(req, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

//Get Service
export const Service = createAsyncThunk("service", async (data) => {
  try {
    const { req, authToken } = data
    const res = await SERVICE(req, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});


//Get PersonRole
export const PersonRole = createAsyncThunk("customerContactPersonRole", async (data) => {
  try {
    const { req, authToken } = data
    const res = await PERSONROLE(req, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

//Get ClientIndustry
export const ClientIndustry = createAsyncThunk("clientIndustry", async (data) => {
  try {
    const { req, authToken } = data
    const res = await CLIENTINDUSTRY(req, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

//Get Country Data
export const Country = createAsyncThunk("country", async (data) => {
  try {
    const { req, authToken } = data
    const res = await COUNTRY(req, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

//Get Country Data
export const JobType = createAsyncThunk("jobType", async (data) => {
  try {
    const { req, authToken } = data
    const res = await JOBTYPE(req, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

export const AddTask = createAsyncThunk("addTask", async (data) => {
  try {
    const { req, authToken } = data
    const res = await ADDTASK(req, authToken);
    return await res;
  } catch
  (err) {
    return err;
  }
});

export const GetServicesByCustomers = createAsyncThunk("customerGetService", async (data) => {
  try {
    const { req, authToken } = data
    const res = await GetServicesByCustomer(req, authToken);
    return await res;
  } catch
  (err) {
    return err;
  }
});

export const GETTASKDATA = createAsyncThunk("getTask", async (data) => {
  try {
    const { req, authToken } = data
    const res = await GETTASK(req, authToken);
    return await res;
  } catch
  (err) {
    return err;
  }
});




//Setting Slice
const SettingSlice = createSlice({
  name: "SettingSlice",
  initialState: {
    isLoading: false,
    isError: false,
    role: [],
    statustype: [],
    Service: [],
    personrole: [],
    clientIndustry: [],
    country: [],
    jobtype:[],
    addtak:[],
    customergetervices:[],
    gettask:[]
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Role.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(Role.fulfilled, (state, action) => {
        state.isLoading = false;
        state.role = action.payload;
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
        state.statustype = action.payload;
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
      .addCase(PersonRole.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(PersonRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.personrole = action.payload;
      })
      .addCase(PersonRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(ClientIndustry.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(ClientIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientIndustry = action.payload;
      })
      .addCase(ClientIndustry.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(Country.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(Country.fulfilled, (state, action) => {
        state.isLoading = false;
        state.country = action.payload;
      })
      .addCase(Country.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(JobType.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(JobType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobtype = action.payload;
      })
      .addCase(JobType.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(AddTask.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(AddTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addtak = action.payload;
      })
      .addCase(AddTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(GetServicesByCustomers.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(GetServicesByCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customergetervices = action.payload;
      })
      .addCase(GetServicesByCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(GETTASKDATA.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(GETTASKDATA.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gettask = action.payload;
      })
      .addCase(GETTASKDATA.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },

});

export default SettingSlice;

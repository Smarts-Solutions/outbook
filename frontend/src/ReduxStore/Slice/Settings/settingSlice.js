import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  ROLE,
  STATUS_TYPE,
  SERVICE,
  PERSONROLE,
  CLIENTINDUSTRY,
  COUNTRY,
  JOBTYPE,
  ADDTASK,
  GetServicesByCustomer,
  GETTASK,
  getListAction,
  addChecklist,
  UpdateChecklist,
  MasterStatus,
  incorporationApi,
  customerSource,
  customerSubSource,
  INTERNALAPI,
  SUBINTERNALAPI,
  
  
} from "../../../Services/Settings/settingService";
import { GET_IP } from "../../../Utils/Comman_function";

var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));



// Get Role
export const Role = createAsyncThunk("role", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await ROLE(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

//Get StatusType
export const StatusType = createAsyncThunk("statusType", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await STATUS_TYPE(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

//Get Service
export const Service = createAsyncThunk("service", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await SERVICE(updatedReq, authToken);
    return await res;
  } catch (err) {
    return err;
  }
});

//Get PersonRole
export const PersonRole = createAsyncThunk(
  "customerContactPersonRole",
  async (data) => {
    try {
      const { req, authToken } = data;
      let IP_Data = await GET_IP();
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await PERSONROLE(updatedReq, authToken);

      return await res;
    } catch (err) {
      return err;
    }
  }
);

//Get ClientIndustry
export const ClientIndustry = createAsyncThunk(
  "clientIndustry",
  async (data) => {
    try {
      const { req, authToken } = data;

      let IP_Data = await GET_IP();
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await CLIENTINDUSTRY(updatedReq, authToken);

      return await res;
    } catch (err) {
      return err;
    }
  }
);

//Get Country Data
export const Country = createAsyncThunk("country", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await COUNTRY(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

//Get Country Data
export const JobType = createAsyncThunk("jobType", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await JOBTYPE(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

//Get Country Data
export const InternalApi = createAsyncThunk("internal", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await INTERNALAPI(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

export const AddTask = createAsyncThunk("addTask", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await ADDTASK(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

export const GetServicesByCustomers = createAsyncThunk(
  "customerGetService",
  async (data) => {
    try {
      const { req, authToken } = data;
      let IP_Data = await GET_IP();
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await GetServicesByCustomer(updatedReq, authToken);

      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const GETTASKDATA = createAsyncThunk("getTask", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await GETTASK(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

export const getList = createAsyncThunk("checklistAction", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await getListAction(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

export const addChecklists = createAsyncThunk("addChecklist", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data.data.ip,
      StaffUserId: StaffUserId.id,
    };
    const res = await addChecklist(updatedReq, authToken);

    return await res;
  } catch (err) {
    return err;
  }
});

export const UpdateChecklistData = createAsyncThunk(
  "updateChecklist",
  async (data) => {
    try {
      const { req, authToken } = data;
      let IP_Data = await GET_IP();
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await UpdateChecklist(updatedReq, authToken);

      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const MasterStatusData = createAsyncThunk(
  "masterStatus",
  async (data) => {
    try {
      const { req, authToken } = data;
      let IP_Data = await GET_IP();
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await MasterStatus(updatedReq, authToken);

      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const IncorporationApi = createAsyncThunk(
  "incorporation",
  async (data) => {
    try {
      const { req, authToken } = data;
      let IP_Data = await GET_IP();
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await incorporationApi(updatedReq, authToken);

      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const customerSourceApi = createAsyncThunk(
  "customerSource",
  async (data) => {
    try {
      const { req, authToken } = data;
      let IP_Data = await GET_IP();
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await customerSource(updatedReq, authToken);

      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const customerSubSourceApi = createAsyncThunk(
  "customerSubSource",
  async (data) => {
    try {
      const { req, authToken } = data;
      let IP_Data = await GET_IP();
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await customerSubSource(updatedReq, authToken);

      return await res;
    } catch (err) {
      return err;
    }
  }
);

export const customerSubInternalApi = createAsyncThunk(
  "subinternal",
  async (data) => {
    try {
      const { req, authToken } = data;
      let IP_Data = await GET_IP();
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data.data.ip,
        StaffUserId: StaffUserId.id,
      };
      const res = await SUBINTERNALAPI(updatedReq, authToken);

      return await res;
    } catch (err) {
      return err;
    }
  }
);

 

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
    jobtype: [],
    addtak: [],
    customergetervices: [],
    gettask: [],
    list: [],
    addChecklistData: [],
    updatecheckdata: [],
    masterStatusData: [],
    incorporationData: [],
    customerSource: [],
    customerSubSource: [],
    customersubinternal: [],
     
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
      })
      .addCase(getList.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(addChecklists.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addChecklists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addChecklistData = action.payload;
      })
      .addCase(addChecklists.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(UpdateChecklistData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(UpdateChecklistData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updatecheckdata = action.payload;
      })
      .addCase(UpdateChecklistData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(MasterStatusData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(MasterStatusData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.masterStatusData = action.payload;
      })
      .addCase(MasterStatusData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(IncorporationApi.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(IncorporationApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incorporationData = action.payload;
      })
      .addCase(IncorporationApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(customerSourceApi.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(customerSourceApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerSource = action.payload;
      })
      .addCase(customerSourceApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(customerSubSourceApi.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(customerSubSourceApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerSubSource = action.payload;
      })
      .addCase(customerSubSourceApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(customerSubInternalApi.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(customerSubInternalApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customersubinternal = action.payload;
      })
      .addCase(customerSubInternalApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
       
  },
});

export default SettingSlice;

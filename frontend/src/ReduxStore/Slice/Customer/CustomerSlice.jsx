import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GETALLCOMPANY,
  GETOFFICERDETAILS,
  ADD_CUSTOMER,
  GET_SERVICE,
  ADD_SERVICES,
  ADD_PEPPER_WORK,
  GET_ALL_CUSTOMER,
  GET_CUSTOMER,
  EDIT_CUSTOMER,
  Delete_Customer_File,
  GET_ALL_JOB_DATA,
  Add_Job_Type,
  JOB_ACTION,
  UPDATE_JOB,
  GETALLCHECKLIST,
  GET_ALL_TASK_TIME_SHEET,
  GET_JOB_TIME_SHEET,
  GET_MISSING_LOG,
  ADD_MISSION_LOG,
  QUERY_ACTION,
  ADD_QUERY,
  DRAFT_ACTION,
  ADD_DRAFT,
  JOBDOCUMENT_ACTION,
  EDIT_MISSION_LOG,
  EDIT_QUERY,
  EDIT_DRAFT,
  UPDATE_CUSTOMER_STATUS,
  GET_JOB_TIMELINE,
  UPDATE_STATUS,
  getcustomerschecklist,
  get_All_Customer_DropDown,
  delete_Customer,
  UPLOAD_DOCUMENT_MISSING_LOG_AND_QUERY
} from "../../../Services/Customer/CustomerService";
import { add } from "date-fns";
var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));

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

export const GetOfficerDetails = createAsyncThunk("seachCompany", async (data) => {
  try {
    const updatedReq = {
      company_number: data.company_number,
      StaffUserId: StaffUserId.id,
    };
    const res = await GETOFFICERDETAILS(updatedReq);
    return await res;
  } catch (err) {
    throw err;
  }
});



export const AddCustomer = createAsyncThunk("addCustomer", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await ADD_CUSTOMER(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const Get_Service = createAsyncThunk("service", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await GET_SERVICE(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const ADD_SERVICES_CUSTOMERS = createAsyncThunk(
  "updateProcessCustomer",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await ADD_SERVICES(updatedReq, authToken);

      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const ADD_PEPPER_WORKS = createAsyncThunk(
  "updateProcessCustomerFile",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        customer_id: req.customer_id,
        uploadedFiles: req.uploadedFiles,
        StaffUserId: StaffUserId.id,
      };
      const res = await ADD_PEPPER_WORK(updatedReq, req.authToken);

      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const GET_ALL_CUSTOMERS = createAsyncThunk(
  "customerAction",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await GET_ALL_CUSTOMER(updatedReq, authToken);

      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const getAllCustomerDropDown = createAsyncThunk(
  "customerAction",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await get_All_Customer_DropDown(updatedReq, authToken);

      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const GET_CUSTOMER_DATA = createAsyncThunk(
  "getSingleCustomer",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await GET_CUSTOMER(updatedReq, authToken);

      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const Edit_Customer = createAsyncThunk(
  "customerUpdate",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await EDIT_CUSTOMER(updatedReq, authToken);

      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const DELETE_CUSTOMER_FILE = createAsyncThunk(
  "updateProcessCustomerFileAction",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await Delete_Customer_File(updatedReq, authToken);

      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const GetAllJabData = createAsyncThunk("getAddJobData", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await GET_ALL_JOB_DATA(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const AddAllJobType = createAsyncThunk("jobAdd", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await Add_Job_Type(updatedReq, authToken);

    return await res;
  } catch (err) {
    throw err;
  }
});

export const JobAction = createAsyncThunk("jobAction", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await JOB_ACTION(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const UpdateJob = createAsyncThunk("jobUpdate", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await UPDATE_JOB(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const GET_ALL_CHECKLIST = createAsyncThunk(
  "checklistAction",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await GETALLCHECKLIST(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const getAllTaskTimeSheet = createAsyncThunk(
  "getTaskTimeSheet",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await GET_ALL_TASK_TIME_SHEET(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const JobTimeSheetAction = createAsyncThunk(
  "jobTimeSheet",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await GET_JOB_TIME_SHEET(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const GetMissingLog = createAsyncThunk("getMissingLog", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await GET_MISSING_LOG(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const AddMissionLog = createAsyncThunk("addMissingLog", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await ADD_MISSION_LOG(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const EditMissingLog = createAsyncThunk(
  "editMissingLog",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await EDIT_MISSION_LOG(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const UploadDocumentMissingLogAndQuery = createAsyncThunk(
  "uploadDocumentMissingLogAndQuery",
  async (data) => {
    try {
      const { req, authToken } = data;
      const res = await UPLOAD_DOCUMENT_MISSING_LOG_AND_QUERY(req, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const QueryAction = createAsyncThunk("getQuerie", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await QUERY_ACTION(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const AddQuery = createAsyncThunk("addQuerie", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await ADD_QUERY(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const EditQuery = createAsyncThunk("editQuerie", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await EDIT_QUERY(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const DraftAction = createAsyncThunk("getDraft", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await DRAFT_ACTION(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const AddDraft = createAsyncThunk("addDraft", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await ADD_DRAFT(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const EditDraft = createAsyncThunk("editDraft", async (data) => {
  try {
    const { req, authToken } = data;
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await EDIT_DRAFT(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

export const JobDocumentAction = createAsyncThunk(
  "jobDocumentAction",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await JOBDOCUMENT_ACTION(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const Update_Customer_Status = createAsyncThunk(
  "customerStatusUpdate",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await UPDATE_CUSTOMER_STATUS(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const getJobTimeline = createAsyncThunk(
  "getJobTimeLine",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await GET_JOB_TIMELINE(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const Update_Status = createAsyncThunk(
  "updateJobStatus",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await UPDATE_STATUS(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const getcustomerschecklistApi = createAsyncThunk(
  "getcustomerschecklist",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await getcustomerschecklist(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "deleteCustomer",
  async (data) => {
    try {
      const { req, authToken } = data;
      var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
      const updatedReq = {
        ...req,
        ip: IP_Data,
        StaffUserId: StaffUserId.id,
      };
      const res = await delete_Customer(updatedReq, authToken);
      return await res;
    } catch (err) {
      throw err;
    }
  }
);

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
    jobaction: [],
    updatejob: [],
    getallchecklist: [],
    getalltasktimesheet: [],
    jobtimesheetaction: [],
    getmissinglog: [],
    queryaction: [],
    addquery: [],
    getdraftlist: [],
    adddraft: [],
    jobdocumentaction: [],
    editmissinglog: [],
    editquery: [],
    getjobtimeline: [],
    updatestatus: [],
    customerchcklist: [],
  },
  reducers: {
    addCustomer: (state, action) => {
      state.addcustomer = action.payload;
    },

  },
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
      .addCase(JobAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(JobAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getalljoblist = action.payload;
      })
      .addCase(JobAction.rejected, (state) => {
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
      .addCase(getAllTaskTimeSheet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTaskTimeSheet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getalltasktimesheet = action.payload;
      })
      .addCase(getAllTaskTimeSheet.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(JobTimeSheetAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(JobTimeSheetAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobtimesheetaction = action.payload;
      })
      .addCase(JobTimeSheetAction.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(GetMissingLog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetMissingLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getmissinglog = action.payload;
      })
      .addCase(GetMissingLog.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(AddMissionLog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddMissionLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addmissinglog = action.payload;
      })
      .addCase(AddMissionLog.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(QueryAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(QueryAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.queryaction = action.payload;
      })
      .addCase(QueryAction.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(AddQuery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addquery = action.payload;
      })
      .addCase(AddQuery.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(DraftAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DraftAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getdraftlist = action.payload;
      })
      .addCase(DraftAction.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(AddDraft.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(AddDraft.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adddraft = action.payload;
      })
      .addCase(AddDraft.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(JobDocumentAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(JobDocumentAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobdocumentaction = action.payload;
      })
      .addCase(JobDocumentAction.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(EditMissingLog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(EditMissingLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editmissinglog = action.payload;
      })
      .addCase(EditMissingLog.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(EditQuery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(EditQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editquery = action.payload;
      })
      .addCase(EditQuery.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getJobTimeline.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobTimeline.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getjobtimeline = action.payload;
      })
      .addCase(getJobTimeline.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(Update_Customer_Status.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Update_Customer_Status.fulfilled, (state, action) => {
        state.isLoading = false;
        state.updatestatus = action.payload;
      })
      .addCase(Update_Customer_Status.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getcustomerschecklistApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getcustomerschecklistApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerchcklist = action.payload;
      })
      .addCase(getcustomerschecklistApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default CustomerSlice;

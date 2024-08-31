import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GETACCESS, ROLEACCESS } from "../../../Services/Access/Accessservices";
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






// Unique action type for GetAccess
export const GetAccess = createAsyncThunk("accessRolePermissions/getAccess", async (data) => {
  try {
    const { req, authToken } = data;
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: StaffUserId.id };
    const res = await GETACCESS(updatedReq, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

// Unique action type for RoleAccess
export const RoleAccess = createAsyncThunk("accessRolePermissions/roleAccess", async (data) => {
  try {
    const { req, authToken } = data;
    console.log("========", req.StaffUserId);
    let IP_Data = await GET_IP();
    const updatedReq = { ...req, ip: IP_Data.data.ip, StaffUserId: req.StaffUserId ?req.StaffUserId :StaffUserId.id };
    const res = await ROLEACCESS(updatedReq, authToken);
     
    return await res;
  } catch (err) {
    throw err;
  }
});

const AccessSlice = createSlice({
  name: "AccessSlice",
  initialState: {
    isLoading: false,
    isError: false,
    Access: [],
    RoleAccess: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAccess.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAccess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Access = action.payload;
      })
      .addCase(GetAccess.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(RoleAccess.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(RoleAccess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.RoleAccess = action.payload;
      })
      .addCase(RoleAccess.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default AccessSlice;

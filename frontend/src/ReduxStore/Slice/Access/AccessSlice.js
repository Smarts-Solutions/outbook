import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GETACCESS, ROLEACCESS } from "../../../Services/Access/Accessservices";

// Unique action type for GetAccess
export const GetAccess = createAsyncThunk("accessRolePermissions/getAccess", async (data) => {
  try {
    const { req, authToken } = data;
    const res = await GETACCESS(req, authToken);
    return await res;
  } catch (err) {
    throw err;
  }
});

// Unique action type for RoleAccess
export const RoleAccess = createAsyncThunk("accessRolePermissions/roleAccess", async (data) => {
  try {
    const { req, authToken } = data;
    const res = await ROLEACCESS(req, authToken);
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

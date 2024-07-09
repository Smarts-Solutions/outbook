import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { GETACCESS} from "../../../Services/Access/Accessservices";


export const GetAccess = createAsyncThunk("accessRolePermissions", async (data) => {
  try {
    const { req , authToken } = data
    const res = await GETACCESS( req , authToken);
    return await res;
  } catch (err) {
    return err;
  }
});






const AccessSlice = createSlice({
  name: "AccessSlice",
  initialState: {
    isLoading: false,
    isError: false,
    Access : []
 
  },

  reducers: {},  
  extraReducers: (builder) => {
    builder
      .addCase(GetAccess.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(GetAccess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Access = action.payload;
      })
      .addCase(GetAccess.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

   
      
  },
   
});

export default AccessSlice;

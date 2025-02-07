import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SIGN_IN_STAFF , SIGN_IN_AZURE_SSO,LOGIN_AUTH_TOKEN , IS_LOGIN_AUTH_TOKEN_CHECK ,IS_LOGOUT , STATUS ,GET_SHAREPOINT_TOKEN,GET_STAFF_BY_ROLE} from "../../../Services/Auth/authService";
const token = localStorage.getItem("token");
const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));


export const SignIn = createAsyncThunk("login", async (data) => {
  try {
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data };
    const res = await SIGN_IN_STAFF(updatedReq);
    return await res;
  } catch (err) {
    return err;
  }
});

export const SignInWithAzure = createAsyncThunk("loginWithAzure", async (data) => {
  try {
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data };
    const res = await SIGN_IN_AZURE_SSO(updatedReq);
    return await res;
  } catch (err) {
    return err;
  }
});

export const LoginAuthToken = createAsyncThunk("loginAuthToken", async (data) => {
  try {
    const res = await LOGIN_AUTH_TOKEN(data);
    return await res;
  } catch (err) {
    return err;
  }
});

export const isLoginAuthCheckToken = createAsyncThunk("isLoginAuthTokenCheck", async (data) => {
  try {

    const res = await IS_LOGIN_AUTH_TOKEN_CHECK(data);
    return await res;
  } catch (err) {
    return err;
  }
});

export const isLogOut = createAsyncThunk("isLogOut", async (data) => {
  try {
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data };
    const res = await IS_LOGOUT(updatedReq);
    return await res;
  } catch (err) {
    return err;
  }
});

export const Status = createAsyncThunk("status", async (data) => {
  try {
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data };
    const res = await STATUS(updatedReq);
    return await res;
  } catch (err) {
    return err;
  }
});
export const GetSharePointToken = ("getSharePointToken", async (data) => {
  try {
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data };
    const res = await GET_SHAREPOINT_TOKEN(updatedReq);
    return await res;
  } catch (err) {
    return err;
  }
});
export const GetStaffByRole = createAsyncThunk("getstaff/role", async (data) => {
  try {
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data };
    const res = await GET_STAFF_BY_ROLE(updatedReq);
    return await res;
  } catch (err) {
    return err;
  }
});


const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState: {
    isLoading: false,
    isError: false,
    signIn : [],
    signInWithAzure:[],
    status:[],
    staffroledata:[]
  },

  reducers: {},  
  extraReducers: (builder) => {
    builder
      .addCase(SignIn.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(SignIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.signIn = action.payload;
      })
      .addCase(SignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(SignInWithAzure.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(SignInWithAzure.fulfilled, (state, action) => {
        state.isLoading = false;
        state.signInWithAzure = action.payload;
      })
      .addCase(SignInWithAzure.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(Status.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      }
      )
      .addCase(Status.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(Status.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload;
      })
      .addCase(GetStaffByRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staffroledata = action.payload;
      })
       
  },
   
});

export default AuthSlice;

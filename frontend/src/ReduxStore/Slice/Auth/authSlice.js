import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { SIGN_IN_STAFF , SIGN_IN_AZURE_SSO,LOGIN_AUTH_TOKEN , IS_LOGIN_AUTH_TOKEN_CHECK ,IS_LOGOUT} from "../../../Services/Auth/authService";
import {GET_IP} from "../../../Utils/Comman_function";

var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
const token = localStorage.getItem("token");


export const SignIn = createAsyncThunk("login", async (data) => {
  try {
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data.data.ip };
    const res = await SIGN_IN_STAFF(updatedReq);
    return await res;
  } catch (err) {
    return err;
  }
});

export const SignInWithAzure = createAsyncThunk("loginWithAzure", async (data) => {
  try {
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data.data.ip };
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
    let IP_Data = await GET_IP();
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const updatedReq = { ...data, ip: IP_Data.data.ip };
    const res = await IS_LOGOUT(updatedReq);
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
    signInWithAzure:[]
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
       
  },
   
});

export default AuthSlice;

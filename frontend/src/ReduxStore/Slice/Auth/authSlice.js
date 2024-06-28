import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { SIGN_IN_STAFF , LOGIN_AUTH_TOKEN , IS_LOGIN_AUTH_TOKEN_CHECK } from "../../../Services/Auth/authService";



export const SignIn = createAsyncThunk("login", async (data) => {
  try {
    const res = await SIGN_IN_STAFF(data);
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






const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState: {
    isLoading: false,
    isError: false,
    signIn : [],
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
       
  },
   
});

export default AuthSlice;

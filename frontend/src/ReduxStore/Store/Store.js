import { configureStore } from "@reduxjs/toolkit";

//AUTH SLICE
import AuthSlice from "../Slice/Auth/authSlice";
 



const store = configureStore({
  reducer: {
    AuthSlice: AuthSlice.reducer,
 
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";

//AUTH SLICE
import AuthSlice from "../Slice/Auth/authSlice";
import SettingSlice from "../Slice/Settings/settingSlice";
import StaffSlice from "../Slice/Staff/staffSlice";
 



const store = configureStore({
  reducer: {
    AuthSlice: AuthSlice.reducer,
    SettingSlice: SettingSlice.reducer,
    StaffSlice: StaffSlice.reducer,
  },
});

export default store;

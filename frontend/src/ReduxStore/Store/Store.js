import { configureStore } from "@reduxjs/toolkit";

//AUTH SLICE
import AuthSlice from "../Slice/Auth/authSlice";
import SettingSlice from "../Slice/Settings/settingSlice";
import StaffSlice from "../Slice/Staff/staffSlice";
import AccessSlice from "../Slice/Access/AccessSlice";
import CustomerSlice from "../Slice/Customer/CustomerSlice";

 



const store = configureStore({
  reducer: {
    AuthSlice: AuthSlice.reducer,
    SettingSlice: SettingSlice.reducer,
    StaffSlice: StaffSlice.reducer,
    AccessSlice: AccessSlice.reducer,
    CustomerSlice: CustomerSlice.reducer

  },
});

export default store;

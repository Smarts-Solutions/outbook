import { configureStore } from "@reduxjs/toolkit";

//AUTH SLICE
import AuthSlice from "../Slice/Auth/authSlice";
import SettingSlice from "../Slice/Settings/settingSlice";
import StaffSlice from "../Slice/Staff/staffSlice";
import AccessSlice from "../Slice/Access/AccessSlice";
import CustomerSlice from "../Slice/Customer/CustomerSlice";
import ClientSlice from "../Slice/Client/ClientSlice";
import HierarchySlice from "../Slice/Hierarchy/HierarchySlice";

 
const store = configureStore({
  reducer: {
    AuthSlice: AuthSlice.reducer,
    SettingSlice: SettingSlice.reducer,
    StaffSlice: StaffSlice.reducer,
    AccessSlice: AccessSlice.reducer,
    CustomerSlice: CustomerSlice.reducer,
    ClientSlice: ClientSlice.reducer,
    HierarchySlice: HierarchySlice.reducer

  },
});

export default store;

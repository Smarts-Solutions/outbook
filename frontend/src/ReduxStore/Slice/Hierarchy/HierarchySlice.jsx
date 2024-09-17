import { createSlice } from "@reduxjs/toolkit";

const HierarchySlice = createSlice({
    name: "HierarchySlice",
    initialState: {
        isLoading: false,
        isError: false,
        CustomerId: null,
        ClientId: null,
        JobId: null
    },
    reducers: {
        setCustomerId: (state, action) => {
            state.CustomerId = action.payload; // Update the correct field
        },
        clearCustomerId: (state) => {
            state.CustomerId = null;
        },
        setClientId: (state, action) => {
            state.ClientId = action.payload; // Update the correct field
        },
        clearClientId: (state) => {
            state.ClientId = null;
        },
        setJobId: (state, action) => {
            state.JobId = action.payload; // Update the correct field
        },
        clearJobId: (state) => {
            state.JobId = null;
        }
    },
});

export const { setCustomerId, clearCustomerId, setClientId, clearClientId, setJobId, clearJobId } = HierarchySlice.actions;
export default HierarchySlice;

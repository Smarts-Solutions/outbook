import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GetCustomerAccessById } from '../ReduxStore/Slice/Settings/settingSlice';
import { GetCustomerDropdown } from '../ReduxStore/Slice/Customer/CustomerSlice';

const CustomerAccessContext = createContext();

export const useCustomerAccess = () => {
    const context = useContext(CustomerAccessContext);
    if (!context) {
        throw new Error('useCustomerAccess must be used within a CustomerAccessProvider');
    }
    return context;
};

export const CustomerAccessProvider = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [accessData, setAccessData] = useState([]);
    const [assignedCustomers, setAssignedCustomers] = useState([]);
    
    const [selectedCustomer, setSelectedCustomerState] = useState(() => {
        const saved = sessionStorage.getItem('selectedCustomer');
        return saved ? JSON.parse(saved) : { value: "All", label: "All" };
    });

    const setSelectedCustomer = (customer) => {
        setSelectedCustomerState(customer);
        sessionStorage.setItem('selectedCustomer', JSON.stringify(customer));
    };

    const fetchAccessData = useCallback(async () => {
        const staffDetails = JSON.parse(localStorage.getItem('staffDetails'));
        const token = JSON.parse(localStorage.getItem('token'));
        const role = JSON.parse(localStorage.getItem('role'));

        if (staffDetails?.id && role?.toString().toUpperCase() === "CUSTOMER") {
            const req = { customer_id: staffDetails.id };
            const data = { req, authToken: token };
            try {
                const response = await dispatch(GetCustomerAccessById(data)).unwrap();
                if (response.status && response.data) {
                    setAccessData(response.data);
                }
            } catch (error) {
                console.error("Error fetching customer access:", error);
            }
        }
    }, [dispatch]);

    const fetchAssignedCustomers = useCallback(async () => {
        const staffDetails = JSON.parse(localStorage.getItem('staffDetails'));
        const token = JSON.parse(localStorage.getItem('token'));
        const role = JSON.parse(localStorage.getItem('role'));

        if (staffDetails?.id && role?.toString().toUpperCase() === "CUSTOMER") {
            const req = { staff_id: staffDetails.id };
            const data = { req, authToken: token };
            try {
                const response = await dispatch(GetCustomerDropdown(data)).unwrap();
                if (response.status && response.data) {
                    const formattedOptions = response.data.map(item => ({
                        value: item.id,
                        label: item.trading_name
                    }));
                    setAssignedCustomers([{ value: "All", label: "All" }, ...formattedOptions]);
                }
            } catch (error) {
                console.error("Error fetching assigned customers:", error);
            }
        }
    }, [dispatch]);

    // Fetch on mount and on route change
    useEffect(() => {
        fetchAccessData();
        fetchAssignedCustomers();
    }, [location.pathname, fetchAccessData, fetchAssignedCustomers]);

    const hasAccess = (permission, type = "view") => {
        if (!accessData) return false;
        const module = accessData.find(item => item.permission_name === permission);
        if (!module) return false;
        const access = module.items.find(i => i.type === type);
        return access?.is_assigned === 1;
    };

    return (
        <CustomerAccessContext.Provider value={{ 
            accessData, 
            fetchAccessData, 
            hasAccess, 
            assignedCustomers, 
            selectedCustomer, 
            setSelectedCustomer 
        }}>
            {children}
        </CustomerAccessContext.Provider>
    );
};

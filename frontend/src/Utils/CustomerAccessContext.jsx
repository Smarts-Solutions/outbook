import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GetCustomerAccessById } from '../ReduxStore/Slice/Settings/settingSlice';

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
    const [accessData, setAccessData] = useState(() => {
        const saved = localStorage.getItem('customerAccessData');
        return saved ? JSON.parse(saved) : [];
    });

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
                    localStorage.setItem('customerAccessData', JSON.stringify(response.data));
                }
            } catch (error) {
                console.error("Error fetching customer access:", error);
            }
        }
    }, [dispatch]);

    // Fetch on mount and on route change
    useEffect(() => {
        fetchAccessData();
    }, [location.pathname, fetchAccessData]);

    const hasAccess = (permission, type = "view") => {
        if (!accessData) return false;
        const module = accessData.find(item => item.permission_name === permission);
        if (!module) return false;
        const access = module.items.find(i => i.type === type);
        return access?.is_assigned === 1;
    };

    return (
        <CustomerAccessContext.Provider value={{ accessData, fetchAccessData, hasAccess }}>
            {children}
        </CustomerAccessContext.Provider>
    );
};

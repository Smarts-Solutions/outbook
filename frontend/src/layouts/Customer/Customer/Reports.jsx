import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useCustomerAccess } from '../../../Utils/CustomerAccessContext';
import { useNavigate } from 'react-router-dom';

const CustomerReports = () => {
    const { hasAccess } = useCustomerAccess();
    const navigate = useNavigate();
    const role = JSON.parse(localStorage.getItem("role"));

    useEffect(() => {
        if (!hasAccess("report", "view") && role !== "SUPERADMIN") {
            navigate("/customer/dashboard");
        }
    }, [hasAccess, role, navigate]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">Reports</h4>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-12 text-center py-5">
                    <div className="card shadow-sm border-0 py-5">
                        <div className="card-body">
                            <FileText size={64} className="text-muted mb-3" />
                            <h3>Report Module</h3>
                            <p className="text-muted">You have access to view reports. Specific report content will be displayed here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerReports;

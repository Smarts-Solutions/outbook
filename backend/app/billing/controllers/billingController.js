const billingModel = require('../models/billingModel');

// 1. Get Active Customers Controller (Supports Admin vs Staff permissions & optional search)
const getActiveCustomers = async (req, res) => {
    try {
        const staffUserId = req.body?.StaffUserId || req.userId || null;
        const search = req.body?.search || req.query?.search || req.body?.searchValue || req.query?.searchValue || '';
        const page = req.body?.page || req.query?.page || req.body?.pageNo || req.query?.pageNo || null;
        const limit = req.body?.limit || req.query?.limit || 20;

        const result = await billingModel.getActiveCustomers(staffUserId, search, page, limit);
        if (!result.status) {
            return res.status(500).json({
                status: false,
                message: result.message || "Failed to fetch active customers"
            });
        }
        return res.status(200).json({
            status: true,
            message: "Active customers fetched successfully",
            data: result.data
        });
    } catch (error) {
        console.error("Error in getActiveCustomers controller:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// 2. Get Active Clients Controller
const getActiveClients = async (req, res) => {
    try {
        const customer_id = req.body?.customer_id || req.query?.customer_id || null;
        const result = await billingModel.getActiveClients(customer_id);

        if (!result.status) {
            return res.status(500).json({
                status: false,
                message: result.message || "Failed to fetch active clients"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Active clients fetched successfully",
            data: result.data
        });
    } catch (error) {
        console.error("Error in getActiveClients controller:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// 3. Get Customer Engagement Details Controller
const getCustomerEngagementDetails = async (req, res) => {
    try {
        const customerId = req.body?.customer_id || req.query?.customer_id || null;
        if (!customerId) {
            return res.status(400).json({
                status: false,
                message: "customer_id is required"
            });
        }

        const result = await billingModel.getCustomerEngagementDetails(customerId);
        if (!result.status) {
            return res.status(500).json({
                status: false,
                message: result.message || "Failed to fetch engagement details"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Customer engagement details fetched successfully",
            data: result.data
        });
    } catch (error) {
        console.error("Error in getCustomerEngagementDetails controller:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// 4. Get Clients for a Customer Controller
const getClientsByCustomer = async (req, res) => {
    try {
        const customerId = req.body?.customer_id || req.query?.customer_id || null;
        const staffUserId = req.body?.StaffUserId || req.userId || null;
        const search = req.body?.search || req.query?.search || req.body?.searchValue || req.query?.searchValue || '';
        const page = req.body?.page || req.query?.page || req.body?.pageNo || req.query?.pageNo || null;
        const limit = req.body?.limit || req.query?.limit || 20;

        const result = await billingModel.getClientsByCustomer(customerId, staffUserId, search, page, limit);
        if (!result.status) {
            return res.status(500).json({ status: false, message: result.message });
        }
        return res.status(200).json({
            status: true,
            message: "Clients fetched successfully",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 5. Get Jobs Controller
const getJobs = async (req, res) => {
    try {
        const customerId = req.body?.customer_id || req.query?.customer_id || null;
        const clientId = req.body?.client_id || req.query?.client_id || null;
        const result = await billingModel.getJobsByCustomerOrClient(customerId, clientId);
        if (!result.status) {
            return res.status(500).json({ status: false, message: result.message });
        }
        return res.status(200).json({
            status: true,
            message: "Jobs fetched successfully",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 6. Get Services Controller
const getServices = async (req, res) => {
    try {
        const result = await billingModel.getAllActiveServices();
        if (!result.status) {
            return res.status(500).json({ status: false, message: result.message });
        }
        return res.status(200).json({
            status: true,
            message: "Services fetched successfully",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 7. Get Job Types Controller
const getJobTypes = async (req, res) => {
    try {
        const serviceId = req.body?.service_id || req.query?.service_id || null;
        const result = await billingModel.getJobTypesByService(serviceId);
        if (!result.status) {
            return res.status(500).json({ status: false, message: result.message });
        }
        return res.status(200).json({
            status: true,
            message: "Job types fetched successfully",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 8. Get Services By Client Controller
const getServicesByClient = async (req, res) => {
    try {
        const clientId = req.body?.client_id || req.query?.client_id || null;
        const result = await billingModel.getServicesByClient(clientId);
        if (!result.status) {
            return res.status(500).json({ status: false, message: result.message });
        }
        return res.status(200).json({
            status: true,
            message: "Services fetched successfully",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 9. Submit Billing Controller
const submitBilling = async (req, res) => {
    try {
        const staffUserId = req.body?.StaffUserId || req.userId || req.user?.id || null;
        if (!staffUserId) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized: User session not found."
            });
        }

        const payload = req.body;
        const result = await billingModel.submitBilling(payload, staffUserId);

        if (!result.status) {
            if (result.isDuplicate) {
                return res.status(409).json({
                    status: false,
                    isDuplicate: true,
                    message: result.message
                });
            }
            return res.status(400).json({
                status: false,
                message: result.message || "Failed to submit billing"
            });
        }

        return res.status(201).json({
            status: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error("Error in submitBilling controller:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// 10. Get Submissions For Approvals Controller
const getSubmissionsForApprovals = async (req, res) => {
    try {
        const staffUserId = req.body?.StaffUserId || req.userId || req.user?.id || null;
        const status = req.body?.status || req.query?.status || 'Pending Manager Approval';

        const result = await billingModel.getSubmissionsForApprovals(staffUserId, status);
        if (!result.status) {
            return res.status(500).json({ status: false, message: result.message });
        }

        return res.status(200).json({
            status: true,
            message: "Submissions fetched successfully",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 11. Manager Approve Controller
const managerApproveSubmission = async (req, res) => {
    try {
        const staffUserId = req.body?.StaffUserId || req.userId || req.user?.id || null;
        const submissionId = req.body?.submission_id || req.params?.id || null;

        if (!submissionId) {
            return res.status(400).json({ status: false, message: "submission_id is required" });
        }

        const result = await billingModel.managerApproveSubmission(submissionId, staffUserId);
        if (!result.status) {
            return res.status(400).json({ status: false, message: result.message });
        }

        return res.status(200).json({
            status: true,
            message: result.message
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 12. Manager Return Controller
const managerReturnSubmission = async (req, res) => {
    try {
        const staffUserId = req.body?.StaffUserId || req.userId || req.user?.id || null;
        const submissionId = req.body?.submission_id || req.params?.id || null;
        const returnNote = req.body?.return_note || req.body?.note || '';

        if (!submissionId) {
            return res.status(400).json({ status: false, message: "submission_id is required" });
        }
        if (!returnNote.trim()) {
            return res.status(400).json({ status: false, message: "Reason (return_note) is required" });
        }

        const result = await billingModel.managerReturnSubmission(submissionId, staffUserId, returnNote);
        if (!result.status) {
            return res.status(400).json({ status: false, message: result.message });
        }

        return res.status(200).json({
            status: true,
            message: result.message
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 12.1 Manager Reject Controller
const managerRejectSubmission = async (req, res) => {
    try {
        const staffUserId = req.body?.StaffUserId || req.userId || req.user?.id || null;
        const submissionId = req.body?.submission_id || req.params?.id || null;
        const reason = req.body?.reason || req.body?.return_note || 'Rejected by Manager';

        if (!submissionId) {
            return res.status(400).json({ status: false, message: "submission_id is required" });
        }

        const result = await billingModel.managerRejectSubmission(submissionId, staffUserId, reason);
        if (!result.status) {
            return res.status(400).json({ status: false, message: result.message });
        }

        return res.status(200).json({
            status: true,
            message: result.message
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

// 13. Manager Edit Submission Controller
const managerEditSubmission = async (req, res) => {
    try {
        const staffUserId = req.body?.StaffUserId || req.userId || req.user?.id || null;
        const submissionId = req.body?.submission_id || req.params?.id || null;
        const editData = req.body?.editData || req.body || {};

        if (!submissionId) {
            return res.status(400).json({ status: false, message: "submission_id is required" });
        }

        const result = await billingModel.managerEditSubmission(submissionId, staffUserId, editData);
        if (!result.status) {
            return res.status(400).json({ status: false, message: result.message });
        }

        return res.status(200).json({
            status: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    getActiveCustomers,
    getActiveClients,
    getCustomerEngagementDetails,
    getClientsByCustomer,
    getJobs,
    getServices,
    getJobTypes,
    getServicesByClient,
    submitBilling,
    getSubmissionsForApprovals,
    managerApproveSubmission,
    managerReturnSubmission,
    managerRejectSubmission,
    managerEditSubmission
};
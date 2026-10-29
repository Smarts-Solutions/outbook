const billingModel = require('../models/billingModel');

// 1. Get Active Customers Controller
const getActiveCustomers = async (req, res) => {
    try {
        const result = await billingModel.getActiveCustomers();
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

module.exports = {
    getActiveCustomers,
    getActiveClients
};


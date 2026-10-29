const pool = require('../../config/database');

// 1. Get Active Customers
const getActiveCustomers = async () => {
    try {
        const query = `
            SELECT 
                id AS customer_id, 
                staff_id, 
                trading_name 
            FROM customers 
            WHERE status = '1' 
            ORDER BY trading_name ASC
        `;
        const [rows] = await pool.execute(query);
        return { status: true, data: rows };
    } catch (error) {
        console.error("Error fetching active customers for billing:", error);
        return { status: false, message: error.message };
    }
};

// 2. Get Active Clients
const getActiveClients = async (customerId = null) => {
    try {
        let query = `
            SELECT 
                id AS client_id, 
                customer_id, 
                staff_created_id, 
                trading_name 
            FROM clients 
            WHERE status = '1'
        `;
        const params = [];

        if (customerId) {
            query += ` AND customer_id = ?`;
            params.push(customerId);
        }

        query += ` ORDER BY trading_name ASC`;

        const [rows] = await pool.execute(query, params);
        return { status: true, data: rows };
    } catch (error) {
        console.error("Error fetching active clients for billing:", error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    getActiveCustomers,
    getActiveClients
};


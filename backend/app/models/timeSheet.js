const pool = require('../config/database');

const getTimesheet = async (Timesheet) => {
    console.log("staff_id", Timesheet)
    const { staff_id, tasktype, customerId, clientId } = Timesheet;

    if (staff_id > 0 && tasktype == 1) {
        const query = ` SELECT id, trading_name FROM customers WHERE staff_id = ? ORDER BY id DESC `;
        try {
            const [result] = await pool.execute(query, [staff_id]);
            return result;
        } catch (err) {
            console.error('Error selecting data:', err);
            throw err;
        }
    }
    else if (customerId > 0 && tasktype == 1) {
        let id = customerId;
        const query = ` SELECT id, trading_name FROM clients WHERE id = ? ORDER BY id DESC `;
        try {
            const [result] = await pool.execute(query, [id]);
            return result;
        } catch (err) {
            console.error('Error selecting data:', err);
            throw err;
        }
    }
    else if (clientId > 0 && tasktype == 1) {
        let id = clientId;

        const query = ` SELECT id, trading_name FROM jobs WHERE client_id = ? ORDER BY id DESC `;
        try {
            const [result] = await pool.execute(query, [id]);
            return result;
        } catch (err) {
            console.error('Error selecting data:', err);
            throw err;
        }

    }


};



module.exports = {
    getTimesheet,

};
const pool = require('../config/database');

const createCustomer = async (staff) => {
    // const { role_id, first_name, last_name, email, phone, password, status } = staff;

    // const query = `
    // INSERT INTO staffs (role_id, first_name, last_name, email, phone, password, status)
    // VALUES (?, ?, ?, ?, ?, ?, ?)
    // `;

    // try {
    //     const [result] = await pool.execute(query, [role_id, first_name, last_name, email, phone, password, status]);
    //     return result.insertId;
    // } catch (err) {
    //     console.error('Error inserting data:', err);
    //     throw err;
    // }
};



module.exports = {
    createCustomer,
};
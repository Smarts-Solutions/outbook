const pool = require('../config/database');


const createStaff = async (staff) => {
    console.log("staff ", staff);
    const { role_id, first_name, last_name, email, phone, password, status } = staff;

    const query = `
    INSERT INTO staffs (role_id, first_name, last_name, email, phone, password, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        // Execute the query with the actual values
        const [result] = await pool.execute(query, [role_id, first_name, last_name, email, phone, password, status]);
        // Return the insertId
        return result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getStaffByEmail = async (email) => {
    const [rows] = await pool.query('SELECT staffs.id , staffs.email , staffs.password , staffs.role_id ,roles.role_name ,roles.role FROM staffs JOIN roles ON staffs.role_id = roles.id  WHERE staffs.email = ?', [email]);
    return rows[0];
  };

module.exports = {
    createStaff,
    getStaffByEmail
};
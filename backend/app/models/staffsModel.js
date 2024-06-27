const pool = require('../config/database');

const createStaff = async (staff) => {
    const { role_id, first_name, last_name, email, phone, password, status } = staff;

    const query = `
    INSERT INTO staffs (role_id, first_name, last_name, email, phone, password, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await pool.execute(query, [role_id, first_name, last_name, email, phone, password, status]);
        return result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const deleteStaff = async (staffId) => {
    const query = `
    DELETE FROM staffs WHERE id = ?
    `;

    try {
        await pool.execute(query, [staffId]);
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};

const updateStaff = async (staff) => {
    const { id, role_id, first_name, last_name, email, phone, password, status } = staff;

    const query = `
    UPDATE staffs
    SET role_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?, password = ?, status = ?
    WHERE id = ?
    `;

    try {
        await pool.execute(query, [role_id, first_name, last_name, email, phone, password, status, id]);
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
};

const getStaffByEmail = async (email) => {
    const [rows] = await pool.query('SELECT staffs.id , staffs.email , staffs.password , staffs.role_id ,roles.role_name ,roles.role FROM staffs JOIN roles ON staffs.role_id = roles.id  WHERE staffs.email = ?', [email]);
    return rows[0];
  };

module.exports = {
    createStaff,
    deleteStaff,
    updateStaff,
    getStaffByEmail
};
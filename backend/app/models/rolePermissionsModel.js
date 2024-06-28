const pool = require('../config/database');

const createRole = async (Role) => {
    const { role_name } = Role;
    const role = role_name.trim().toUpperCase().replace(/[-\s]/g, '');
    const query = `
    INSERT INTO roles (role_name, role)
    VALUES (?, ?)
    `;

    try {
        const [result] = await pool.execute(query, [role_name, role]);
        return result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getRole = async () => {
    const query = `
    SELECT * FROM roles status = "1"
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
};

const deleteRole = async (roleId) => {
    const query = `
    DELETE FROM roles WHERE id = ?
    `;

    try {
        await pool.execute(query, [roleId]);
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};


const updateRole = async (Role) => {
    const { id, role_name, status } = Role;
    const role = role_name.trim().toUpperCase().replace(/[-\s]/g, '');
    const query = `
    UPDATE roles
    SET role_name = ?, role = ?, status = ? WHERE id = ?
    `;

    try {
        // Execute the query with the actual values
        const [result] = await pool.execute(query, [role_name, role,status, id]);
        // Return affectedRows
        return result.affectedRows;
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
};




module.exports = {
    createRole,
    deleteRole,
    updateRole,
    getRole

};
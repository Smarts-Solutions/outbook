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
    SELECT * FROM roles `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
};

const staffRole = async () => {
    const query = `SELECT * FROM roles WHERE role NOT IN ('ADMIN','SUPERADMIN');`;

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

const getRoleById = async (roleId) => {
    const query = `
    SELECT * FROM roles WHERE id = ?
    `;
    try {
        const [result] = await pool.execute(query, [roleId]);
        return result[0];
    } catch (err) {
        console.error('Error selecting data:', err);
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



const accessRolePermissions = async (data) => {
    const { role_id } = data;
    const query = `
    SELECT 
        permissions.permission_name, 
        permissions.type,
        CASE 
            WHEN role_permissions.permission_id IS NOT NULL THEN TRUE 
            ELSE FALSE 
        END AS is_assigned
    FROM 
        permissions
    LEFT JOIN 
        role_permissions ON permissions.id = role_permissions.permission_id AND role_permissions.role_id = ?
    LEFT JOIN 
        roles ON role_permissions.role_id = roles.id;
    `;
    
    try {
        const [rows] = await pool.execute(query, [role_id]);
        return rows;
    } catch (err) {
        console.error('Error fetching data:', err);
        throw err;
    }
};



module.exports = {
    createRole,
    deleteRole,
    getRoleById,
    updateRole,
    getRole,
    staffRole,
    accessRolePermissions
};
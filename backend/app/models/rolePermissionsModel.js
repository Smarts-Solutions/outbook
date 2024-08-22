const pool = require('../config/database');

const createRole = async (Role) => {
    const { role_name } = Role;
    const role = role_name.trim().toUpperCase().replace(/[-\s]/g, '');
    const checkQuery = `SELECT 1 FROM roles WHERE role_name = ?`;
    const query = `
    INSERT INTO roles (role_name, role)
    VALUES (?, ?)
    `;

    try {
        const [checkResult] = await pool.execute(checkQuery, [role_name]);
        if (checkResult.length > 0) {
          return  {status:false , message : "Role already exists"}
          }
        const [result] = await pool.execute(query, [role_name, role]);
        return {status:true , message : "Role created successfully" , data : result.insertId}
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getRole = async () => {
    const query = `
    SELECT * FROM roles ORDER BY id DESC `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
};

const getRoleAll = async () => {
    const query = `
    SELECT * FROM roles ORDER BY id DESC `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
};

const staffRole = async () => {
    const query = `SELECT * FROM roles WHERE status = '1' AND role NOT IN ('ADMIN','SUPERADMIN');`;

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

    const checkQuery = `SELECT 1 FROM roles WHERE role = ? AND id != ?`;

    const query = `
    UPDATE roles
    SET role_name = ?, role = ?, status = ? WHERE id = ?
    `;

    try {
        // Execute the query with the actual values
        const [check] = await pool.execute(checkQuery, [role, id]);
        if (check.length > 0) {
            return {status : false , message : 'Role already exists'}
         }
        const [result] = await pool.execute(query, [role_name, role,status, id]);
        return {status : true , message : 'Role updated successfully' , data : result.affectedRows}
        // Return affectedRows
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
};



const accessRolePermissions = async (data) => {
    const { role_id ,action ,permissions} = data;
    if(action==="get"){
        const query = `
        SELECT 
            permissions.permission_name, 
            permissions.type,
              permissions.id,
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
    }else if(action==="update"){
        
       const addQuery = `
       INSERT INTO role_permissions (role_id, permission_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
      `;
      
      const deleteQuery = `
       DELETE FROM role_permissions
       WHERE role_id = ? AND permission_id = ?
      `;
      
       try {
          if(permissions.length>0){
           for (const perm of permissions) {
               if (perm.is_assigned) {
                   // Insert permissions
                   await pool.execute(addQuery, [perm.role_id, perm.permission_id]);
               } else {
                   // Delete permissions
                   await pool.execute(deleteQuery, [perm.role_id, perm.permission_id]);
               }
           }
          }
       } catch (err) {
           console.error('Error updating data:', err);
           throw err;
       }
    }
};



module.exports = {
    createRole,
    deleteRole,
    getRoleById,
    updateRole,
    getRole,
    staffRole,
    accessRolePermissions,
    getRoleAll
};
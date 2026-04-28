const pool = require('../config/database');
const { SatffLogUpdateOperation } = require('../utils/helper');

const accessRolePermissions = async (data) => {
    const { role_id, action, permissions } = data;
    if (action === "get") {
        const query = `
        SELECT 
            permissions.permission_name, 
            permissions.type,
            permissions.id,
            CASE 
                WHEN customer_contact_person_role_permissions.permission_id IS NOT NULL THEN TRUE 
                ELSE FALSE 
            END AS is_assigned
        FROM 
            permissions
        LEFT JOIN 
            customer_contact_person_role_permissions ON permissions.id = customer_contact_person_role_permissions.permission_id AND customer_contact_person_role_permissions.role_id = ?
        WHERE permissions.permission_name IN ('dashboard', 'customer', 'client', 'job', 'document', 'report')
        AND NOT (permissions.permission_name = 'customer' AND permissions.type = 'insert')
        AND NOT (permissions.permission_name = 'report' AND permissions.type != 'view')
        ORDER BY FIELD(permissions.permission_name, 'dashboard', 'customer', 'client', 'job', 'document', 'report');
        `;

        try {
            const [rows] = await pool.execute(query, [role_id]);
            return rows;
        } catch (err) {
            console.error('Error fetching data:', err);
            throw err;
        }
    } else if (action === "update") {

        const addQuery = `
       INSERT INTO customer_contact_person_role_permissions (role_id, permission_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
      `;

        const deleteQuery = `
       DELETE FROM customer_contact_person_role_permissions
       WHERE role_id = ? AND permission_id = ?
      `;

        try {
            if (permissions.length > 0) {

                let addPermission = [];
                let deletePermission = [];
                const [[roleName]] = await pool.execute(`SELECT name FROM customer_contact_person_role WHERE id = ?`, [permissions[0].role_id]);

                for (const perm of permissions) {
                    if (perm.is_assigned) {
                        // Insert permissions
                        const checkQuery = `
                   SELECT COUNT(*) AS count 
                   FROM customer_contact_person_role_permissions 
                   WHERE role_id = ? AND permission_id = ?
                   `;
                        const [checkResult] = await pool.execute(checkQuery, [perm.role_id, perm.permission_id]);
                        if (checkResult[0].count === 0) {
                            const [[permissionName]] = await pool.execute(`SELECT id,permission_name,type FROM permissions WHERE id = ?`, [perm.permission_id]);
                            addPermission.push(permissionName.permission_name + '-' + permissionName.type)
                            await pool.execute(addQuery, [perm.role_id, perm.permission_id]);
                        }
                    } else {
                        // Delete permissions
                        const [[permissionName]] = await pool.execute(`SELECT id,permission_name,type FROM permissions WHERE id = ?`, [perm.permission_id]);
                        deletePermission.push(permissionName.permission_name + '-' + permissionName.type)

                        await pool.execute(deleteQuery, [perm.role_id, perm.permission_id]);
                    }
                }

                const AddPermissionString = addPermission.length > 0 ? 'Add Permission (' + addPermission.join(', ') + ')' : '';
                const DeletePermissionString = deletePermission.length > 0 ? 'Remove Permission (' + deletePermission.join(', ') + ')' : '';

                if (AddPermissionString || DeletePermissionString) {
                    const currentDate = new Date();
                    await SatffLogUpdateOperation(
                        {
                            staff_id: data.StaffUserId,
                            ip: data.ip,
                            date: currentDate.toISOString().split('T')[0],
                            module_name: "customer contact person permission",
                            log_message: ` updated the access for ${roleName.name}. Access Changes ${AddPermissionString} ${DeletePermissionString}`,
                            permission_type: "updated",
                            module_id: permissions[0].role_id
                        }
                    );
                }
            }
        } catch (err) {
            console.error('Error updating data:', err);
            throw err;
        }
    }
};

const getCustomerAccessByCustomerId = async (data) => {
    const { customer_id } = data;
    
    try {
        // Get the customer_contact_person_role_id from staffs table
        const [staffRows] = await pool.execute(
            `SELECT customer_contact_person_role_id FROM staffs WHERE id = ? AND role_id = 12`,
            [customer_id]
        );
        
        if (staffRows.length === 0) {
            return [];
        }
        
        const role_id = staffRows[0].customer_contact_person_role_id;
        
        if (!role_id) {
            return [];
        }
        
        // Get permissions for this role
        const query = `
        SELECT 
            permissions.permission_name, 
            permissions.type,
            permissions.id,
            CASE 
                WHEN customer_contact_person_role_permissions.permission_id IS NOT NULL THEN TRUE 
                ELSE FALSE 
            END AS is_assigned
        FROM 
            permissions
        LEFT JOIN 
            customer_contact_person_role_permissions ON permissions.id = customer_contact_person_role_permissions.permission_id AND customer_contact_person_role_permissions.role_id = ?
        WHERE permissions.permission_name IN ('dashboard', 'customer', 'client', 'job', 'document', 'report')
        AND NOT (permissions.permission_name = 'customer' AND permissions.type = 'insert')
        AND NOT (permissions.permission_name = 'report' AND permissions.type != 'view')
        ORDER BY FIELD(permissions.permission_name, 'dashboard', 'customer', 'client', 'job', 'document', 'report');
        `;
        
        const [rows] = await pool.execute(query, [role_id]);
        return rows;
    } catch (err) {
        console.error('Error fetching customer access by customer_id:', err);
        throw err;
    }
};

module.exports = {
    accessRolePermissions,
    getCustomerAccessByCustomerId
};

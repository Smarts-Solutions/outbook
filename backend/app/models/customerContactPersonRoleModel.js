const pool = require('../config/database'); 
const { SatffLogUpdateOperation } = require('../utils/helper'); 

const createCustomerContactPersonRole = async (CustomerContactPersonRole) => {
    const {name} = CustomerContactPersonRole;
    const checkQuery = `SELECT 1 FROM customer_contact_person_role WHERE name = ?`
    const query = `
    INSERT INTO customer_contact_person_role (name)
    VALUES (?)
    `;

    try {
        const [check] = await pool.query(checkQuery, [name]);
        if (check.length > 0) {
            return {status: false, message: 'Customer Contact Person Role already exists.'};
            }
        const [result] = await pool.execute(query, [name]);
        
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: CustomerContactPersonRole.StaffUserId,
                ip: CustomerContactPersonRole.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "customer contact person role",
                log_message: `created customer contact person role ${name}`,
                permission_type: "created",
                module_id:result.insertId
            }
        );

        // Auto-assign 'dashboard view' permission to the new role on creation
        try {
            const [[dashboardPerm]] = await pool.execute(
                `SELECT id FROM customer_permissions WHERE permission_name = 'dashboard' AND type = 'view' LIMIT 1`
            );
            if (dashboardPerm) {
                await pool.execute(
                    `INSERT INTO customer_contact_person_role_permissions (role_id, permission_id)
                     VALUES (?, ?)
                     ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP`,
                    [result.insertId, dashboardPerm.id]
                );
            }
        } catch (permErr) {
            console.error('Warning: Could not auto-assign dashboard view permission to new role:', permErr);
        }

        return {status: true, message: 'Customer Contact Person Role created successfully.' , data : result.insertId};
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getCustomerContactPersonRole = async () => { 
    const query = `
    SELECT * FROM customer_contact_person_role WHERE status = '1'
    ORDER BY id DESC 
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
}

const getCustomerContactPersonRoleAll = async () => { 
    const query = `
    SELECT * FROM customer_contact_person_role
    ORDER BY id DESC 
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
}

const deleteCustomerContactPersonRole = async (CustomerContactPersonRole) => {
    const [[existName]] = await pool.execute(`SELECT name FROM customer_contact_person_role WHERE id = ?`, [CustomerContactPersonRole.id]);
  
    try {
        if(parseInt(CustomerContactPersonRole.id) > 0){
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: CustomerContactPersonRole.StaffUserId,
                    ip: CustomerContactPersonRole.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: "customer contact person role",
                    log_message: `deleted customer contact person role ${existName.name}`,
                    permission_type: "deleted",
                    module_id:CustomerContactPersonRole.id
                }
            );
        }
    } catch (error) {
        console.log("error", error)
    }
   

   
    const query = `
    DELETE FROM customer_contact_person_role WHERE id = ?
    `;
    
    try {
        await pool.execute(query, [CustomerContactPersonRole.id]);

    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};


const updateCustomerContactPersonRole = async (CustomerContactPersonRole) => {
    const { id, ...fields } = CustomerContactPersonRole;
    const name  = CustomerContactPersonRole.name;
    // Create an array to hold the set clauses
    const setClauses = [];
    const values = [];
    // Iterate over the fields and construct the set clauses dynamically
    for (const [key, value] of Object.entries(fields)) {
        if (key != "ip" && key != "StaffUserId") {
            setClauses.push(`${key} = ?`);
            values.push(value);
          }
    }
    // Add the id to the values array for the WHERE clause
    values.push(id);
    // Construct the final SQL query
    const query = `
    UPDATE customer_contact_person_role
    SET ${setClauses.join(', ')}
    WHERE id = ?
    `;
     // Check if the record exists
    const checkQuery = `SELECT 1 FROM customer_contact_person_role WHERE name = ? AND id != ?`;
    try {
        const [check] = await pool.query(checkQuery, [name, id]);
        if (check.length > 0) {
            return {status: false, message: 'Customer Contact Person Role already exists.'};
         }

         const [[existStatus]] = await pool.execute(`SELECT status FROM customer_contact_person_role WHERE id = ?`, [id]);

         let status_change = "Deactivate"
        if(CustomerContactPersonRole.status == "1"){
         status_change = "Activate"
        }
        let log_message = existStatus.status === CustomerContactPersonRole.status ?
        `edited customer contact person role ${name}`:
        `changes the customer contact person role status ${status_change} ${name}`

        const [result] = await pool.execute(query, values);
        if(result.changedRows){
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: CustomerContactPersonRole.StaffUserId,
                    ip: CustomerContactPersonRole.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: "customer contact person role",
                    log_message: log_message,
                    permission_type: "updated",
                    module_id:CustomerContactPersonRole.id
                }
            );
        }
        return {status: true, message: 'Customer Contact Person Role updated successfully.' , data : result.affectedRows}
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
};


const checkCustomerContactPersonRoleAssignment = async (id) => {
    const query = `
        SELECT id, first_name, last_name, 'Customer User' as user_type
        FROM customer_users 
        WHERE customer_contact_person_role_id = ? AND status = '1'
        UNION ALL
        SELECT id, first_name, last_name, 'Staff' as user_type
        FROM staffs 
        WHERE customer_contact_person_role_id = ? AND status = '1'
    `;
    try {
        const [result] = await pool.execute(query, [id, id]);
        return result;
    } catch (err) {
        console.error('Error checking assignments:', err);
        throw err;
    }
};

const reassignAndDeleteCustomerContactPersonRole = async (data) => {
    const { id, replace_id, StaffUserId, ip } = data;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Reassign users in customer_users
        const updateCustomerUsersQuery = `
            UPDATE customer_users 
            SET customer_contact_person_role_id = ? 
            WHERE customer_contact_person_role_id = ?
        `;
        await connection.execute(updateCustomerUsersQuery, [replace_id, id]);

        // 2. Reassign users in staffs
        const updateStaffsQuery = `
            UPDATE staffs 
            SET customer_contact_person_role_id = ? 
            WHERE customer_contact_person_role_id = ?
        `;
        await connection.execute(updateStaffsQuery, [replace_id, id]);

        // 3. Get role name for logging
        const [[existName]] = await connection.execute(`SELECT name FROM customer_contact_person_role WHERE id = ?`, [id]);

        // 4. Delete the role
        const deleteQuery = `DELETE FROM customer_contact_person_role WHERE id = ?`;
        await connection.execute(deleteQuery, [id]);

        // 5. Log the deletion
        const currentDate = new Date();
        await SatffLogUpdateOperation({
            staff_id: StaffUserId,
            ip: ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: "customer contact person role",
            log_message: `deleted customer contact person role ${existName.name} after reassigning users`,
            permission_type: "deleted",
            module_id: id
        });

        await connection.commit();
        return { status: true, message: 'Users reassigned and role deleted successfully.' };
    } catch (err) {
        await connection.rollback();
        console.error('Error in reassignAndDelete:', err);
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = {
    createCustomerContactPersonRole,
    deleteCustomerContactPersonRole,
    updateCustomerContactPersonRole,
    getCustomerContactPersonRole,
    getCustomerContactPersonRoleAll,
    checkCustomerContactPersonRoleAssignment,
    reassignAndDeleteCustomerContactPersonRole
};
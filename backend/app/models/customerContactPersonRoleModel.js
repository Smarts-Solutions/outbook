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


module.exports = {
    createCustomerContactPersonRole,
    deleteCustomerContactPersonRole,
    updateCustomerContactPersonRole,
    getCustomerContactPersonRole,
    getCustomerContactPersonRoleAll
  
};
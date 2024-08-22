const pool = require('../config/database');

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

const deleteCustomerContactPersonRole = async (CustomerContactPersonRoleId) => {
    const query = `
    DELETE FROM customer_contact_person_role WHERE id = ?
    `;

    try {
        await pool.execute(query, [CustomerContactPersonRoleId]);
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
        setClauses.push(`${key} = ?`);
        values.push(value);
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
        const [result] = await pool.execute(query, values);
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
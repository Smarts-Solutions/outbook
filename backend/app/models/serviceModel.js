const pool = require('../config/database');

const createServices = async (Services) => {
    const {name} = Services;

    const query = `
    INSERT INTO services (name)
    VALUES (?)
    `;

    try {
        const [result] = await pool.execute(query, [name]);
        return result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getServices = async () => { 
    const query = `
    SELECT * FROM services 
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
}

const deleteServices = async (ServicesId) => {
    const query = `
    DELETE FROM services WHERE id = ?
    `;

    try {
        await pool.execute(query, [ServicesId]);
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};


const updateServices = async (Services) => {
    const { id, ...fields } = Services;
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
    UPDATE services
    SET ${setClauses.join(', ')}
    WHERE id = ?
    `;
    try {
        await pool.execute(query, values);
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
};


module.exports = {
    createServices,
    deleteServices,
    updateServices,
    getServices
  
};
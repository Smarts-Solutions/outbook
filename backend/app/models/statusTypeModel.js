const pool = require('../config/database');

const createStatusType = async (StatusType) => {
    const { type} = StatusType;

    const query = `
    INSERT INTO status_types (type)
    VALUES (?)
    `;

    try {
        const [result] = await pool.execute(query, [type]);
        return result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getStatusType = async () => { 
    const query = `
    SELECT * FROM status_types WHERE status = "1"
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
}

const deleteStatusType = async (StatusTypeId) => {
    const query = `
    DELETE FROM status_types WHERE id = ?
    `;

    try {
        await pool.execute(query, [StatusTypeId]);
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};


const updateStatusType = async (StatusType) => {
    const { id, ...fields } = StatusType;
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
    UPDATE status_types
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
    createStatusType,
    deleteStatusType,
    updateStatusType,
    getStatusType
  
};
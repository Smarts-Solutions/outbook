const pool = require('../config/database');

const createClientIndustry = async (ClientIndustry) => {
    const { business_type} = ClientIndustry;

    const query = `
    INSERT INTO client_industry_types (business_type)
    VALUES (?)
    `;

    try {
        const [result] = await pool.execute(query, [business_type]);
        return result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getClientIndustry = async () => { 
    const query = `
    SELECT * FROM client_industry_types
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
}

const deleteClientIndustry = async (ClientIndustryId) => {
    const query = `
    DELETE FROM client_industry_types WHERE id = ?
    `;

    try {
        await pool.execute(query, [ClientIndustryId]);
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};


const updateClientIndustry = async (ClientIndustry) => {
    const { id, ...fields } = ClientIndustry;
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
    UPDATE client_industry_types
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
    createClientIndustry,
    deleteClientIndustry,
    updateClientIndustry,
    getClientIndustry
  
};
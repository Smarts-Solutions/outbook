const pool = require('../config/database');

const createClientIndustry = async (ClientIndustry) => {
    const { business_type} = ClientIndustry;
    const checkQuery = `SELECT 1 FROM client_industry_types WHERE business_type = ?`
    const query = `
    INSERT INTO client_industry_types (business_type)
    VALUES (?)
    `;

    try {
        const [check] = await pool.query(checkQuery, [business_type]);
        if (check.length > 0) {
            return {status: false , message: 'Client Industry already exists.'};
        }
        const [result] = await pool.query(query, [business_type]);
        return {status: true ,message: 'Client Industry created successfully.' , data : result.insertId};
        
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getClientIndustry = async () => { 
    const query = `
    SELECT * FROM client_industry_types
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
    const  business_type = ClientIndustry.business_type;
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

    // Check if the record exists
    const checkQuery = `SELECT 1 FROM client_industry_types WHERE business_type = ? AND id != ?`;
    try {
        const [check] = await pool.execute(checkQuery, [business_type, id]);
        if (check.length > 0) {
            return {status: false , message: 'Client Industry already exists.'};
        }
        const[result]= await pool.execute(query, values);
        return {status: true , message: 'Client Industry updated successfully.' , data : result.affectedRows};
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
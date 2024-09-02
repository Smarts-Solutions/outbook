const pool = require('../config/database');

const createIncorporation = async (Incorporation) => {
    const {name} = Incorporation;
    const checkQuery = `SELECT 1 FROM incorporation_in WHERE name = ?`
    const query = `
    INSERT INTO incorporation_in (name)
    VALUES (?)
    `;
    
    try {
        const [check] = await pool.query(checkQuery, [name]);
        if (check.length > 0) {
            return {status: false , message: 'Incorporation In already exists.'};
        }
        const [result] = await pool.query(query, [name]);
        return {status: true ,message: 'Incorporation In created successfully.' , data : result.insertId};
        
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getIncorporation = async () => { 
    const query = `
    SELECT * FROM incorporation_in WHERE status = '1'
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

const getIncorporationAll = async () => { 
    const query = `
    SELECT * FROM incorporation_in
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

const deleteIncorporation = async (IncorporationId) => {
    const query = `
    DELETE FROM incorporation_in WHERE id = ?
    `;

    try {
        await pool.execute(query, [IncorporationId]);
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};


const updateIncorporation = async (Incorporation) => {
    const { id, ...fields } = Incorporation;
    const  name = Incorporation.name;
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
    UPDATE incorporation_in
    SET ${setClauses.join(', ')}
    WHERE id = ?
    `;

    // Check if the record exists
    const checkQuery = `SELECT 1 FROM incorporation_in WHERE name = ? AND id != ?`;
    try {
        const [check] = await pool.execute(checkQuery, [name, id]);
        if (check.length > 0) {
            return {status: false , message: 'Incorporation In already exists.'};
        }
        const[result]= await pool.execute(query, values);
        return {status: true , message: 'Incorporation In updated successfully.' , data : result.affectedRows};
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
};


module.exports = {
    createIncorporation,
    deleteIncorporation,
    updateIncorporation,
    getIncorporation,
    getIncorporationAll
  
};
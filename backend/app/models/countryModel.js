const pool = require('../config/database');

const createCountry = async (Country) => {
    const {name,code,currency} = Country;

    const query = `
    INSERT INTO countries (name,code,currency)
    VALUES (?,?,?)
    `;
    try {
        const [result] = await pool.execute(query, [name,code,currency]);
        return result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getCountry = async () => { 
    const query = `
    SELECT * FROM countries
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
}

const deleteCountry = async (CountryId) => {
    const query = `
    DELETE FROM countries WHERE id = ?
    `;

    try {
        await pool.execute(query, [CountryId]);
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};


const updateCountry = async (Country) => {
    const { id, ...fields } = Country;
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
    UPDATE countries
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
    createCountry,
    deleteCountry,
    updateCountry,
    getCountry
  
};
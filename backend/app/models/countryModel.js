const pool = require('../config/database');

const createCountry = async (Country) => {
    const {name,code,currency} = Country;
    const checkQuery = `SELECT 1 FROM countries WHERE name = ?`
    const query = `
    INSERT INTO countries (name,code,currency)
    VALUES (?,?,?)
    `;
    try {
        const [check] = await pool.query(checkQuery, [name]);
        if (check.length > 0) {
            return {status: false, message: 'Country already exists.'};
            }
        const [result] = await pool.execute(query, [name,code,currency]);
        return {status: true, message: 'Country created successfully.' , data : result.insertId};
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
    const name  = Country.name;
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
    const checkQuery = `SELECT 1 FROM countries WHERE name = ? AND id != ?`;
    try {
        const [check] = await pool.query(checkQuery, [name, id]);
        if (check.length > 0) {
            return {status: false, message: 'Country already exists.'};
            }
         const [result] = await pool.execute(query, values);
         return {status: true, message: 'Country updated successfully.' , data : result.affectedRows};
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
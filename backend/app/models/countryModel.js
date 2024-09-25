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
    SELECT * FROM countries WHERE status = '1'
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

const getCountryAll = async () => { 
    const query = `
    SELECT * FROM countries
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

    const setClauses = [];
    const values = [];
    

    for (const [key, value] of Object.entries(fields)) {
     if(key !== "ip" && key !=="StaffUserId"){
        setClauses.push(`${key} = ?`);
        values.push(value);
     }
    }
  
    values.push(id);

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
    getCountry,
    getCountryAll
  
};
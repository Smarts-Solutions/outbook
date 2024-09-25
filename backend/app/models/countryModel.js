const pool = require('../config/database');
const { SatffLogUpdateOperation } = require('../utils/helper');

const createCountry = async (Country) => {
    const { name, code, currency } = Country;
    const checkQuery = `SELECT 1 FROM countries WHERE name = ?`
    const query = `
    INSERT INTO countries (name,code,currency)
    VALUES (?,?,?)
    `;
    try {
        const [check] = await pool.query(checkQuery, [name]);
        if (check.length > 0) {
            return { status: false, message: 'Country already exists.' };
        }
        const [result] = await pool.execute(query, [name, code, currency]);
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: Country.StaffUserId,
                ip: Country.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "countries",
                log_message: `created countries ${name}`,
                permission_type: "created",
                module_id: result.insertId
            }
        );
        return { status: true, message: 'Country created successfully.', data: result.insertId };
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
    const [[existName]] = await pool.execute(`SELECT name FROM countries WHERE id = ?`, [CountryId.id]);
    try {
        await pool.execute(query, [CountryId.id]);
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: CountryId.StaffUserId,
                ip: CountryId.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "countries",
                log_message: `deleted countries ${existName.name}`,
                permission_type: "deleted",
                module_id: CountryId.id
            }
        );
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};


const updateCountry = async (Country) => {
    const { id, ...fields } = Country;
    const name = Country.name;
    const setClauses = [];
    const values = [];


    for (const [key, value] of Object.entries(fields)) {
        if (key !== "ip" && key !== "StaffUserId") {
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
            return { status: false, message: 'Country already exists.' };
        }

        const [[existStatus]] = await pool.execute(`SELECT status FROM countries WHERE id = ?`, [id]);
        let status_change = "Deactivate"
        if (Country.status == "1") {
            status_change = "Activate"
        }
        let log_message = existStatus.status === Country.status ?
            `edited countries ${name}` :
            `changes the countries status ${status_change} ${name}`
        const [result] = await pool.execute(query, values);
        if(result.changedRows > 0){
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: Country.StaffUserId,
                ip: Country.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "countries",
                log_message: log_message,
                permission_type: "updated",
                module_id: id
            }
        );
      }
        return { status: true, message: 'Country updated successfully.', data: result.affectedRows };
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
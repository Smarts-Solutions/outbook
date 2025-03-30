const pool = require('../config/database');
const { SatffLogUpdateOperation } = require('../utils/helper');

const createServices = async (Services) => {
    const {name} = Services;
    const checkQuery = `SELECT 1 FROM services WHERE name = ?`
    const query = `
    INSERT INTO services (name)
    VALUES (?)
    `;

    try {
        const [check] = await pool.query(checkQuery, [name]);
        if (check.length > 0) {
            return {status: false , message: 'Service already exists.'};
        }
        const [result] = await pool.execute(query, [name]);
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: Services.StaffUserId,
                ip: Services.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "services",
                log_message: `created services ${name}`,
                permission_type: "created",
                module_id:result.insertId
            }
        );

       if(result.insertId > 0){
            const service_id = result.insertId
            const type = name
            const queryJobType = `
            INSERT INTO job_types (service_id,type)
            VALUES (?,?)
            `;
            const [resultJobType] = await pool.execute(queryJobType, [service_id, type]);
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: Services.StaffUserId,
                    ip: Services.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: "job_types",
                    log_message: `created job type ${type}`,
                    permission_type: "created",
                    module_id:resultJobType.insertId
                }
            );
        }

        return {status: true ,message: 'Service created successfully.' , data : result.insertId};
    } catch (err) {
        console.log('Error inserting data:', err);
        throw err;
    }
};

const getServices = async () => { 
    const query = `
    SELECT * FROM services WHERE status = '1'
    ORDER BY id DESC 
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.log('Error selecting data:', err);
        throw err;
    }
}

const getServicesAll = async () => { 
    const query = `
    SELECT * FROM services
    ORDER BY id DESC 
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.log('Error selecting data:', err);
        throw err;
    }
}

const deleteServices = async (ServicesId) => {
    const [[existName]] = await pool.execute(`SELECT name FROM services WHERE id = ?`, [ServicesId.id]);
    
    if(parseInt(ServicesId.id) > 0){
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: ServicesId.StaffUserId,
                ip: ServicesId.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "services",
                log_message: `deleted services ${existName.name}`,
                permission_type: "deleted",
                module_id:ServicesId.id
            }
        );
    }
    const query = `
    DELETE FROM services WHERE id = ?
    `;
   

    try {
        await pool.execute(query, [ServicesId.id]);
        
    } catch (err) {
        console.log('Error deleting data:', err);
        throw err;
    }
};


const updateServices = async (Services) => {
    const { id, ...fields } = Services;
    const name = Services.name
    // Create an array to hold the set clauses
    const setClauses = [];
    const values = [];
    // Iterate over the fields and construct the set clauses dynamically
    for (const [key, value] of Object.entries(fields)) {
        if (key != "ip" && key != "StaffUserId") {
            setClauses.push(`${key} = ?`);
            values.push(value);
          }
    }
    // Add the id to the values array for the WHERE clause
    values.push(id);
    // Construct the final SQL query
    const query = `
    UPDATE services
    SET ${setClauses.join(', ')}
    WHERE id = ?
    `;

     // Check if the record exists
     const checkQuery = `SELECT 1 FROM services WHERE name = ? AND id != ?`;
    try {
        const [check] = await pool.execute(checkQuery, [name, id]);
        if (check.length > 0) {
            return {status: false , message: 'Service already exists.'};
        }
        const [[existStatus]] = await pool.execute(`SELECT status FROM services WHERE id = ?`, [id]);
        let status_change = "Deactivate"
        if(Services.status == "1"){
          status_change = "Activate"
        }
        let log_message = existStatus.status === Services.status ?
            // `edited services ${type}`:
            `edited services `:

            `changes the services status ${status_change} ${name}`

        const [result] = await pool.execute(query, values);
        if(result.changedRows){
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: Services.StaffUserId,
                    ip: Services.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: "services",
                    log_message: log_message,
                    permission_type: "updated",
                    module_id:Services.id
                }
            );
        }
        return {status: true ,message: 'Service updated successfully.' , data : result.affectedRows};
    } catch (err) {
        console.log('Error updating data:', err);
        throw err;
    }
};


module.exports = {
    createServices,
    deleteServices,
    updateServices,
    getServices,
    getServicesAll
  
};
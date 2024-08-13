const pool = require('../config/database');

const createJobType = async (JobType) => {
    const {service_id,type} = JobType;

    const query = `
    INSERT INTO job_types (service_id,type)
    VALUES (?,?)
    `;

    try {
        const [result] = await pool.execute(query, [service_id,type]);
        return result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getJobType = async () => { 
    const query = `
    SELECT job_types.id, job_types.type , job_types.status ,services.name as service_name FROM job_types JOIN services ON job_types.service_id = services.id
    ORDER BY job_types.id DESC
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        console.error('Error selecting data:', err);
        throw err;
    }
}

const deleteJobType = async (JobTypeId) => {
    const query = `
    DELETE FROM job_types WHERE id = ?
    `;

    try {
        await pool.execute(query, [JobTypeId]);
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
};


const updateJobType = async (JobType) => {
    const { id, ...fields } = JobType;
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
    UPDATE job_types
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

const addTask = async (task) => {
    // console.log("task -",task)
     const {name,service_id,job_type_id} = task;
   
     try {
   
     const query = `
     INSERT INTO task (name,service_id,job_type_id)
     VALUES (?, ?, ?)
     `;
     for (const valName of name) {
      const checkQuery = `
                SELECT id FROM task WHERE name = ? AND service_id = ? AND job_type_id = ?
            `;
      const [existing] = await pool.execute(checkQuery, [valName,service_id,job_type_id]);
      if (existing.length === 0) {
       const [result] = await pool.execute(query, [valName,service_id,job_type_id]);
       }
      }
     
      return { status: true, message: 'task add successfully.', data: [] };
     } catch (err) {
       console.log("Error:", err);
       return { status: false, message: 'Error adding task.' };
     }
     
   }

const getTask = async (task) => {
    const {service_id} = task;
    const query = `
    SELECT id,name,service_id,job_type_id FROM task WHERE service_id = ?
    ORDER BY id DESC
    `;
    try {
    const [result] = await pool.execute(query, [service_id]);
    return { status: true, message: 'task get successfully.', data: result };
    }
    catch (err) {
     return { status: false, message: 'Error get task.' };
    }
}



module.exports = {
    createJobType,
    deleteJobType,
    updateJobType,
    getJobType,
    addTask,
    getTask
  
};
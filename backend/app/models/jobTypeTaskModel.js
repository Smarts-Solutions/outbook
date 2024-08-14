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

// Task Module
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

const addChecklist = async (checklist) => {
    const {customer_id,service_id,job_type_id,client_type_id,check_list_name,status,task} = checklist;
     
    console.log("checklist ",checklist)
    try {
    const query = `
    INSERT INTO checklists (customer_id,service_id,job_type_id,client_type_id,check_list_name,status)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [customer_id,service_id,job_type_id,client_type_id,check_list_name,status]);
    const checklist_id = result.insertId;

    

    const checklistTasksQuery = `
    INSERT INTO checklist_tasks (checklist_id,task_id,task_name,budgeted_hour)
    VALUES (?, ?, ?, ?)
    `;
    for (const valTask of task) {
        const {task_id,task_name,budgeted_hour} = valTask;
    const [result] = await pool.execute(checklistTasksQuery, [checklist_id,task_id,task_name,budgeted_hour]);
    }

    return { status: true, message: 'checklist add successfully.', data: [] };
   
    }
    catch (err) {
     console.log("err ",err)
     return { status: false, message: 'Error added checklist.' };
    }
}

const getChecklist = async (checklist) => {
    const {customer_id} = checklist;
    const query = `
    SELECT
    checklists.id AS checklists_id,
    checklists.check_list_name AS check_list_name,
    checklists.status AS status,
    customers.id AS customer_id,
    services.id AS service_id,
    services.name AS service_name,
    job_types.id AS job_type_id,
    job_types.type AS job_type_type,
    client_types.id AS client_type_id,
    client_types.type AS client_type_type
    FROM checklists 
    JOIN 
         customers ON customers.id = checklists.customer_id
    JOIN 
         services ON services.id = checklists.service_id
    JOIN
         job_types ON job_types.id = checklists.job_type_id
    JOIN
         client_types ON client_types.id = checklists.client_type_id          
    WHERE customer_id = ?
    ORDER BY checklists.id DESC
    `;
    try {
    const [result] = await pool.execute(query, [customer_id]);
    return { status: true, message: 'checklist get successfully.', data: result };
    }
    catch (err) {
     return { status: false, message: 'Error get checklist.' };
    }
}

const getByIdChecklist = async(checklist) => {
    const {checklist_id} = checklist;
    const query = `
    SELECT
    checklists.id AS checklists_id,
    checklists.check_list_name AS check_list_name,
    checklists.status AS status,
    customers.id AS customer_id,
    services.id AS service_id,
    services.name AS service_name,
    job_types.id AS job_type_id,
    job_types.type AS job_type_type,
    client_types.id AS client_type_id,
    client_types.type AS client_type_type,
    checklist_tasks.id AS checklist_tasks_id,
    checklist_tasks.task_id AS task_id,
    checklist_tasks.task_name AS task_name,
    checklist_tasks.budgeted_hour AS budgeted_hour
    FROM checklists 
    JOIN 
         customers ON customers.id = checklists.customer_id
    JOIN 
         services ON services.id = checklists.service_id
    JOIN
         job_types ON job_types.id = checklists.job_type_id
    JOIN
         client_types ON client_types.id = checklists.client_type_id
    JOIN
         checklist_tasks ON checklist_tasks.checklist_id = checklists.id
    WHERE checklists.id = ?
    ORDER BY checklist_tasks.id DESC
    `;
    try {
    const [rows] = await pool.execute(query, [checklist_id]);
    let result = {}
    if(rows.length > 0){
        result = {
            checklists_id: rows[0].checklists_id,
            check_list_name: rows[0].check_list_name,
            status: rows[0].status,
            customer_id: rows[0].customer_id,
            service_id: rows[0].service_id,
            service_name: rows[0].service_name,
            job_type_id: rows[0].job_type_id,
            job_type_type: rows[0].job_type_type,
            client_type_id: rows[0].client_type_id,
            client_type_type: rows[0].client_type_type,
            task: rows.map(row => ({
                checklist_tasks_id: row.checklist_tasks_id,
                task_id: row.task_id,
                task_name: row.task_name,
                budgeted_hour: row.budgeted_hour
            }))
        };

    }
    return { status: true, message: 'checklist get successfully.', data: result };
    }
    catch (err) {
        console.log("err" , err)
     return { status: false, message: 'Error get checklist.' };
    }
}

const deleteChecklist = async (checklist) => {
 
    const {checklist_id} = checklist;
    try {
        await pool.execute('DELETE FROM checklists WHERE id = ?', [checklist_id]);
        await pool.execute('DELETE FROM checklist_tasks WHERE checklist_id = ?', [checklist_id]);
    return { status: true, message: 'checklist deleted successfully.' };
    }
    catch (err) {
     return { status: false, message: 'Error deleting checklist.' };
    }
}



module.exports = {
    createJobType,
    deleteJobType,
    updateJobType,
    getJobType,
    addTask,
    getTask,
    addChecklist,
    getChecklist,
    getByIdChecklist,
    deleteChecklist
  
};
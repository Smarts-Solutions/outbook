const pool = require('../config/database');

const getTaskTimeSheet = async (timeSheet) => {
  const { job_id } = timeSheet;
  console.log("job_id ", job_id)
  try {
    const query = `
     SELECT 
     client_job_task.id AS id,
     jobs.id AS job_id,
     task.id AS task_id,
     task.name AS task_name,
     services.id AS service_id,
     services.name AS service_name,
     job_types.id AS job_type_id,
     job_types.type AS job_type_type,
     client_job_task.task_status AS task_status,
     client_job_task.time AS time
     FROM 
     jobs
     JOIN
     client_job_task ON client_job_task.job_id = jobs.id
     JOIN
     clients ON clients.id = jobs.client_id
     JOIN
     task ON task.id = client_job_task.task_id
     JOIN
     services ON services.id = task.service_id
     JOIN
     job_types ON job_types.id = task.job_type_id
     WHERE 
     jobs.id = client_job_task.job_id AND
     client_job_task.job_id = ?
     ORDER BY
     client_job_task.id DESC;
     `;
    const [rows] = await pool.execute(query, [job_id]);
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
     console.log("error ",error)
    return { status: false, message: 'Error getTaskTimeSheet .' };
  }




}
const getjobTimeSheet = async (timeSheet) => {
  const { job_id } = timeSheet;
  console.log("job_id ", job_id)
  try {
    const query = `
     SELECT 
     jobs.id AS job_id,
     jobs.budgeted_hours AS budgeted_hours,
     jobs.job_id AS job_code_id
     FROM 
     jobs
     WHERE 
     jobs.id = ?
  
     `;
    const [rows] = await pool.execute(query, [job_id]);
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
     console.log("error ",error)
    return { status: false, message: 'Error getTaskTimeSheet .' };
  }
}
const updateTaskTimeSheetStatus = async (timeSheet) => {

  const { id, task_status , time } = timeSheet;
  try {
    const query = `
     UPDATE 
     client_job_task
     SET
     task_status = ? , time = ?
     WHERE 
     id = ?
     `;
    const [rows] = await pool.execute(query, [task_status, time, id]);
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
     console.log("error ",error)
    return { status: false, message: 'Error getTaskTimeSheet .' };
  }
}

module.exports = {
  getTaskTimeSheet,
  getjobTimeSheet,
  updateTaskTimeSheetStatus
};
const pool = require('../config/database');

const getTaskTimeSheet = async (job) => {
  const { job_id } = job;
  console.log("job_id ", job_id)
  try {
    const query = `
     SELECT 
     jobs.id AS job_id
     FROM 
     jobs
     JOIN
     client_job_task ON client_job_task.job_id = jobs.id
     JOIN
     clients ON clients.id = jobs.client_id
     JOIN
     ta

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

module.exports = {
  getTaskTimeSheet
};
const pool = require('../config/database');

const getTaskTimeSheet = async (job) => {
  const { client_id } = job;
  console.log("client_id ", client_id)
  try {
    const query = `
     SELECT 
     jobs.id AS job_id,
     jobs.job_id AS job_code_id,
     job_types.type AS job_type_name,
     customer_contact_details.id AS account_manager_officer_id,
     customer_contact_details.first_name AS account_manager_officer_first_name,
     customer_contact_details.last_name AS account_manager_officer_last_name,
     clients.trading_name AS client_trading_name,
     jobs.client_job_code AS client_job_code,
     jobs.invoiced AS invoiced,
     staffs.id AS allocated_id,
     staffs.first_name AS allocated_first_name,
     staffs.last_name AS allocated_last_name,

     staffs2.id AS reviewer_id,
     staffs2.first_name AS reviewer_first_name,
     staffs2.last_name AS reviewer_last_name,

     staffs3.id AS outbooks_acount_manager_id,
     staffs3.first_name AS outbooks_acount_manager_first_name,
     staffs3.last_name AS outbooks_acount_manager_last_name

     FROM 
     jobs
     LEFT JOIN 
     customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
     LEFT JOIN 
     clients ON jobs.client_id = clients.id
     LEFT JOIN 
     job_types ON jobs.job_type_id = job_types.id
     LEFT JOIN 
     services ON jobs.service_id = services.id
     LEFT JOIN 
     staffs ON jobs.allocated_to = staffs.id
     LEFT JOIN 
     staffs AS staffs2 ON jobs.reviewer = staffs2.id
     LEFT JOIN 
     staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
    
     WHERE 
     jobs.client_id = clients.id AND
     jobs.client_id = ?
      ORDER BY
      jobs.id DESC;
     `;
    const [rows] = await pool.execute(query, [client_id]);
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {

    return { status: false, message: 'Error getting job.' };
  }




}

module.exports = {
  getTaskTimeSheet
};
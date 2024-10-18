const pool = require("../config/database");
const deleteUploadFile = require("../middlewares/deleteUploadFile");
const { SatffLogUpdateOperation, generateNextUniqueCode } = require('../utils/helper');

const getDashboardData = async (dashboard) => {
  const { staff_id } = dashboard;

  try {
    const QueryRole = `
    SELECT
      staffs.id AS id,
      staffs.role_id AS role_id,
      roles.role AS role_name
    FROM
      staffs
    JOIN
      roles ON roles.id = staffs.role_id
    WHERE
      staffs.id = ${staff_id}
    LIMIT 1
    `
    const [rowRoles] = await pool.execute(QueryRole);
    if (rowRoles.length > 0 && (rowRoles[0].role_name == "SUPERADMIN" || rowRoles[0].role_name == "ADMIN")) {

      const QueryAllCount = `
    SELECT
    (SELECT COUNT(*) FROM customers) AS customer,
    (SELECT COUNT(*) FROM clients) AS client,
    (SELECT COUNT(*) FROM staffs) AS staff,
    (SELECT COUNT(*) FROM jobs) AS job,
    (SELECT COUNT(*) FROM jobs WHERE status_type != '6') AS pending_job,
    (SELECT COUNT(*) FROM jobs WHERE status_type = '6') AS completed_job
    `
    const [rowAllCounts] = await pool.execute(QueryAllCount);
      const result = {
        customer: rowAllCounts[0].customer,
        client: rowAllCounts[0].client,
        job: rowAllCounts[0].job,
        staff : rowAllCounts[0].staff,
        pending_job : rowAllCounts[0].pending_job,
        completed_job : rowAllCounts[0].completed_job
      };

      return { status: true, message: "success.", data: result };
    }
    else{
  const checkViewQuery = `
  SELECT table_name 
  FROM information_schema.views 
  WHERE table_name = 'dashboard_data_view'
`;
//   const createViewQuery = `
//   CREATE  VIEW dashboard_data_view AS
// SELECT  
//     customers.id AS customer_id,
//     customers.customer_type AS customer_type,
//     customers.staff_id AS staff_id,
//     customers.account_manager_id AS account_manager_id,
//     jobs.allocated_to AS allocated_to,
//     jobs.reviewer AS reviewer,
//     jobs.id AS job_id,
//     clients.id AS client_id
// FROM 
//     customers
// LEFT JOIN 
//     jobs ON jobs.customer_id = customers.id  
// LEFT JOIN 
//     clients ON clients.id = jobs.client_id     
// JOIN 
//     staffs AS staff1 ON customers.staff_id = staff1.id
// JOIN 
//     staffs AS staff2 ON customers.account_manager_id = staff2.id
// LEFT JOIN 
//     customer_company_information ON customers.id = customer_company_information.customer_id
//   ;
// `;


  const createViewQuery = `
  CREATE  VIEW dashboard_data_view AS
SELECT  
    customers.id AS customer_id,
    customers.customer_type AS customer_type,
    customers.staff_id AS staff_id,
    customers.account_manager_id AS account_manager_id,
    customer_service_account_managers.account_manager_id AS a_account_manager_id,
    jobs.allocated_to AS allocated_to,
    jobs.reviewer AS reviewer,
    jobs.id AS job_id,
    clients.id AS client_id
FROM 
    customers
LEFT JOIN 
    jobs ON jobs.customer_id = customers.id    
LEFT JOIN 
    clients ON clients.id = jobs.client_id     
JOIN 
    staffs AS staff1 ON customers.staff_id = staff1.id
JOIN 
    staffs AS staff2 ON customers.account_manager_id = staff2.id
LEFT JOIN 
    customer_services ON customer_services.customer_id = customers.id
LEFT JOIN 
    customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id    
LEFT JOIN 
    customer_company_information ON customers.id = customer_company_information.customer_id;
`;
    // Check if view exists
    const [checkViewResult] = await pool.execute(checkViewQuery);
    if (checkViewResult.length === 0) {
      await pool.execute(createViewQuery);
    }

    const [rows] = await pool.execute('SELECT id , role_id  FROM staffs WHERE id = "' + staff_id + '" LIMIT 1');

    if(rows.length === 0){
      return { status: false, message: "Staff not found." };
    }

    const [staffCount] = await pool.execute('SELECT COUNT(*) AS count FROM `staffs` WHERE `created_by` = '+staff_id);
    
    let query = `SELECT * FROM dashboard_data_view WHERE 1=1 `;
    let params = [];
     
    
    // Allocated Staff Role
    if (rows[0].role_id == 3) {
      query += ' AND allocated_to = ? ';
      params.push(staff_id);
    }
    // Account Manager Role
    else if (rows[0].role_id == 4) {
      console.log("staff_id  ",staff_id)
      query += ' AND account_manager_id = ? OR a_account_manager_id = ?';
      params.push(staff_id,staff_id);
    }
    // Reviewer Role
    else if (rows[0].role_id == 6) {
      query += ' AND reviewer = ? ';
      params.push(staff_id);
    }

  const [viewResult] = await pool.execute(query, params);
    const uniqueCustomers = [...new Set(viewResult.map(item => item.customer_id))].length;

    const uniqueClients = [...new Set(
      viewResult
        .filter(item => item.client_id !== null) 
        .map(item => item.client_id)
    )].length;


    const uniqueJobIds = [...new Set(
      viewResult
        .filter(item => item.job_id !== null)  
        .map(item => item.job_id)
    )].length;

    const uniqueJobIdss = [...new Set(
      viewResult
        .filter(item => item.job_id !== null)  
        .map(item => item.job_id)
    )]
   
    const [jobStatus] = await pool.execute(`SELECT 
    SUM(CASE WHEN status_type != 6 THEN 1 ELSE 0 END) AS pending_job,
    SUM(CASE WHEN status_type = 6 THEN 1 ELSE 0 END) AS completed_job
    FROM jobs
    WHERE id IN (${uniqueJobIdss})`);

    const result = {
      customer: uniqueCustomers,
      client: uniqueClients,
      job: uniqueJobIds,
      staff : staffCount[0].count,
      pending_job : jobStatus[0].pending_job,
      completed_job : jobStatus[0].completed_job
    };
    return { status: true, message: "success.", data: result };
  }

  } catch (err) {
    return { status: false, message: "Err Dashboard Data View Get", error: err.message };
  }

};

const getDashboardActivityLog = async (dashboard) => {
  const { staff_id } = dashboard;
  const QueryRole = `
  SELECT
    staffs.id AS id,
    staffs.role_id AS role_id,
    roles.role AS role_name
  FROM
    staffs
  JOIN
    roles ON roles.id = staffs.role_id
  WHERE
    staffs.id = ${staff_id}
  LIMIT 1
  `
  const [rows] = await pool.execute(QueryRole);
  // Condition with Admin And SuperAdmin
  let MatchCondition = `WHERE
    staff_logs.staff_id = ${staff_id}`
  if(rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")){
    MatchCondition = ''
  }

 try {
  const query = `
  SELECT
    staff_logs.id AS log_id,
    staff_logs.staff_id AS staff_id,
    DATE_FORMAT(staff_logs.date, '%Y-%m-%d') AS date,
    staff_logs.created_at AS created_at,
    staff_logs.log_message_all AS log_message
  FROM
    staff_logs
   ${MatchCondition}
  ORDER BY
    staff_logs.id DESC
`;

  const [result] = await pool.execute(query);
  return { status: true, message: "success.", data: result };
} catch (error) {
  console.log("error - ",error)
  return { status: false, message: "Err Dashboard Activity Log Get", error: error.message };
}
 

}



module.exports = {
  getDashboardData,
  getDashboardActivityLog
};

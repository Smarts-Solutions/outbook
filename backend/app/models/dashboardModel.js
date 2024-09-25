const pool = require("../config/database");
const deleteUploadFile = require("../middlewares/deleteUploadFile");
const { SatffLogUpdateOperation, generateNextUniqueCode } = require('../utils/helper');

const getDashboardData = async (dashboard) => {
  const { staff_id } = dashboard;

  const checkViewQuery = `
  SELECT table_name 
  FROM information_schema.views 
  WHERE table_name = 'dashboard_data_view'
`;

  const createViewQuery = `
  CREATE  VIEW dashboard_data_view AS
SELECT  
    customers.id AS customer_id,
    customers.customer_type AS customer_type,
    customers.staff_id AS staff_id,
    customers.account_manager_id AS account_manager_id,
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
    customer_company_information ON customers.id = customer_company_information.customer_id;
`;

  try {
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
      query += ' AND account_manager_id = ? ';
      params.push(staff_id);
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


    const result = {
      customer: uniqueCustomers,
      client: uniqueClients,
      job: uniqueJobIds,
      staff : staffCount[0].count
    };

    return { status: true, message: "success.", data: result };

  } catch (err) {
    return { status: false, message: "Err Dashboard Data View Get", error: err.message };
  }

};



module.exports = {
  getDashboardData
};

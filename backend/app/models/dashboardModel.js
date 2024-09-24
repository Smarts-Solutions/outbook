const pool = require("../config/database");
const deleteUploadFile = require("../middlewares/deleteUploadFile");
const { SatffLogUpdateOperation, generateNextUniqueCode } = require('../utils/helper');


const getDashboardData = async (dashboard) => {
  const { staff_id } = dashboard;
 

//   CREATE VIEW customer_role_view AS
// SELECT  
//     customers.id AS id,
//     customers.customer_type AS customer_type,
//     customers.staff_id AS staff_id,
//     customers.account_manager_id AS account_manager_id,
//     customers.trading_name AS trading_name,
//     customers.trading_address AS trading_address,
//     customers.vat_registered AS vat_registered,
//     customers.vat_number AS vat_number,
//     customers.website AS website,
//     customers.form_process AS form_process,
//     customers.created_at AS created_at,
//     customers.updated_at AS updated_at,
//     customers.status AS status,
//     staff1.first_name AS staff_firstname, 
//     staff1.last_name AS staff_lastname,
//     staff2.first_name AS account_manager_firstname, 
//     staff2.last_name AS account_manager_lastname,
//     customer_company_information.company_name AS company_name,
//     customer_company_information.company_number AS company_number,
//     jobs.allocated_to AS allocated_to,
//     jobs.reviewer AS reviewer,
//     CONCAT(
//         'cust_', 
//         SUBSTRING(customers.trading_name, 1, 3), '_',
//         SUBSTRING(customers.customer_code, 1, 15)
//     ) AS customer_code
// FROM 
//     customers
// JOIN 
//     jobs ON jobs.customer_id = customers.id   
// JOIN 
//     staffs AS staff1 ON customers.staff_id = staff1.id
// JOIN 
//     staffs AS staff2 ON customers.account_manager_id = staff2.id
// LEFT JOIN 
//     customer_company_information ON customers.id = customer_company_information.customer_id;




// CREATE VIEW customer_role_view AS
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
// JOIN 
//     jobs ON jobs.customer_id = customers.id  
// JOIN 
//     clients ON clients.id = jobs.client_id     
// JOIN 
//     staffs AS staff1 ON customers.staff_id = staff1.id
// JOIN 
//     staffs AS staff2 ON customers.account_manager_id = staff2.id
// LEFT JOIN 
//     customer_company_information ON customers.id = customer_company_information.customer_id;


  // Fetch the role and staff details
const [rows] = await pool.execute('SELECT id , role_id  FROM staffs WHERE id = "' + staff_id + '" LIMIT 1');

let query = `SELECT * FROM customer_role_view WHERE 1=1 `;
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

// Execute the dynamic query with the specific role-based condition
const [viewResult] = await pool.execute(query, params);


const uniqueCustomers = [...new Set(viewResult.map(item => item.customer_id))].length;

const uniqueClients = [...new Set(viewResult.map(item => item.client_id))].length;

const uniqueJobIds = new Set(viewResult.map(item => item.job_id)).size;

// Final result
const result = {
  customer: uniqueCustomers,
  client: uniqueClients,
  job: uniqueJobIds
};

console.log(result);






console.log(" result ",result)














  return
  const checkViewQuery = `
  SELECT table_name 
  FROM information_schema.views 
  WHERE table_name = 'dashboard_data'
`;

// const createViewQuery = `
//   CREATE VIEW clients_view AS 
//   SELECT 
//       clients.id AS client_id, 
//       clients.customer_id, 
//       clients.client_type 
//   FROM clients;
// `;

// const dataQuery = `
//   SELECT * FROM 
//       dashboard_data
//   JOIN 
//       customers ON customers.id = dashboard_data.customer_id    
//   JOIN 
//       client_types ON client_types.id = dashboard_data.client_type
//   LEFT JOIN 
//       client_contact_details ON client_contact_details.id = (
//           SELECT MIN(cd.id)
//           FROM client_contact_details cd
//           WHERE cd.client_id = dashboard_data.client_id
//       )
//   WHERE dashboard_data.customer_id = ?
//   ORDER BY 
//       dashboard_data.client_id DESC;
// `;

try {
  // Check if view exists
  const [viewResult] = await pool.execute(checkViewQuery);
  
  // If view doesn't exist, create it
  if (viewResult.length === 0) {
      await pool.execute(createViewQuery);
  }
  
  // Fetch data from the view
  const [result] = await pool.execute(dataQuery, [customer_id]);
  return { status: true, message: "success.", data: result };
  
} catch (err) {
  return { status: false, message: "Err Client Get", error: err.message };
}

};



module.exports = {
  getDashboardData
};

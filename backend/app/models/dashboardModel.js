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
    (SELECT GROUP_CONCAT(id) FROM customers) AS customer_ids,
    (SELECT COUNT(*) FROM clients) AS client,
    (SELECT GROUP_CONCAT(id) FROM clients) AS client_ids,
    (SELECT COUNT(*) FROM staffs) AS staff,
    (SELECT GROUP_CONCAT(id) FROM staffs) AS staff_ids,
    (SELECT COUNT(*) FROM jobs) AS job,
    (SELECT GROUP_CONCAT(id) FROM jobs) AS job_ids,
    (SELECT COUNT(*) FROM jobs WHERE status_type != '6') AS pending_job,
    (SELECT GROUP_CONCAT(id) FROM jobs WHERE status_type != '6') AS pending_job_ids,
    (SELECT COUNT(*) FROM jobs WHERE status_type = '6') AS completed_job,
    (SELECT GROUP_CONCAT(id) FROM jobs WHERE status_type = '6') AS completed_job_ids
    `
      const [rowAllCounts] = await pool.execute(QueryAllCount);
      // const result = {
      //   customer: rowAllCounts[0].customer,
      //   customer_ids: rowAllCounts[0].customer_ids,
      //   client: rowAllCounts[0].client,
      //   client_ids: rowAllCounts[0].client_ids,
      //   job: rowAllCounts[0].job,
      //   job_ids: rowAllCounts[0].job_ids,
      //   staff : rowAllCounts[0].staff,
      //   staff_ids: rowAllCounts[0].staff_ids,
      //   pending_job : rowAllCounts[0].pending_job,
      //   pending_job_ids: rowAllCounts[0].pending_job_ids,
      //   completed_job : rowAllCounts[0].completed_job,
      //   completed_job_ids: rowAllCounts[0].completed_job_ids
      // };

      const result = {
        customer: {
          count: rowAllCounts[0].customer,
          ids: rowAllCounts[0].customer_ids
        },
        client: {
          count: rowAllCounts[0].client,
          ids: rowAllCounts[0].client_ids
        },
        job: {
          count: rowAllCounts[0].job,
          ids: rowAllCounts[0].job_ids
        },
        staff: {
          count: rowAllCounts[0].staff,
          ids: rowAllCounts[0].staff_ids
        },
        pending_job: {
          count: rowAllCounts[0].pending_job,
          ids: rowAllCounts[0].pending_job_ids
        },
        completed_job: {
          count: rowAllCounts[0].completed_job,
          ids: rowAllCounts[0].completed_job_ids
        }
      };
      console.log("result ", result)
      return { status: true, message: "success.", data: result };
    }
    else {
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

      if (rows.length === 0) {
        return { status: false, message: "Staff not found." };
      }

      const [staffCount] = await pool.execute('SELECT COUNT(*) AS count FROM `staffs` WHERE `created_by` = ' + staff_id);

      let query = `SELECT * FROM dashboard_data_view WHERE 1=1 `;
      let params = [];


      // Allocated Staff Role
      if (rows[0].role_id == 3) {
        query += ' AND allocated_to = ? ';
        params.push(staff_id);
      }
      // Account Manager Role
      else if (rows[0].role_id == 4) {
        console.log("staff_id  ", staff_id)
        query += ' AND account_manager_id = ? OR a_account_manager_id = ?';
        params.push(staff_id, staff_id);
      }
      // Reviewer Role
      else if (rows[0].role_id == 6) {
        query += ' AND reviewer = ? ';
        params.push(staff_id);
      }

      const [viewResult] = await pool.execute(query, params);
      // const uniqueCustomers = [...new Set(viewResult.map(item => item.customer_id))].length;

      // const uniqueClients = [...new Set(
      //   viewResult
      //     .filter(item => item.client_id !== null) 
      //     .map(item => item.client_id)
      // )].length;


      // const uniqueJobIds = [...new Set(
      //   viewResult
      //     .filter(item => item.job_id !== null)  
      //     .map(item => item.job_id)
      // )].length;

      // const uniqueJobIdss = [...new Set(
      //   viewResult
      //     .filter(item => item.job_id !== null)  
      //     .map(item => item.job_id)
      // )]

      // const [jobStatus] = await pool.execute(`SELECT 
      // SUM(CASE WHEN status_type != 6 THEN 1 ELSE 0 END) AS pending_job,
      // SUM(CASE WHEN status_type = 6 THEN 1 ELSE 0 END) AS completed_job
      // FROM jobs
      // WHERE id IN (${uniqueJobIdss})`);

      // const result = {
      //   customer: uniqueCustomers,
      //   client: uniqueClients,
      //   job: uniqueJobIds,
      //   staff : staffCount[0].count,
      //   pending_job : jobStatus[0].pending_job,
      //   completed_job : jobStatus[0].completed_job
      // };
      // Collect unique customer, client, job IDs
      const uniqueCustomerIds = [...new Set(viewResult.map(item => item.customer_id))];
      const uniqueClientIds = [...new Set(viewResult.filter(item => item.client_id !== null).map(item => item.client_id))];
      const uniqueJobIds = [...new Set(viewResult.filter(item => item.job_id !== null).map(item => item.job_id))];
      const uniqueJobIdss = [...new Set(viewResult.filter(item => item.job_id !== null).map(item => item.job_id))];

      // Collect unique staff IDs (from allocated_to and reviewer)
      const uniqueStaffIds = [...new Set([
        ...viewResult.map(item => item.allocated_to),
        ...viewResult.map(item => item.reviewer)
      ])].filter(id => id !== null); // Exclude null values

      // Get job statuses for the unique jobs (pending/completed)
      const [jobStatus] = await pool.execute(`
     SELECT 
       SUM(CASE WHEN status_type != 6 THEN 1 ELSE 0 END) AS pending_job,
       SUM(CASE WHEN status_type = 6 THEN 1 ELSE 0 END) AS completed_job
     FROM jobs
     WHERE id IN (${uniqueJobIdss})
     `);

      // Return count and IDs for customers, clients, jobs, staff, pending/completed jobs
      const result = {
        customer: {
          count: uniqueCustomerIds.length,
          ids: uniqueCustomerIds
        },
        client: {
          count: uniqueClientIds.length,
          ids: uniqueClientIds
        },
        job: {
          count: uniqueJobIds.length,
          ids: uniqueJobIds
        },
        staff: {
          count: staffCount[0].count,
          ids: uniqueStaffIds
        },
        pending_job: {
          count: jobStatus[0].pending_job,
          ids: uniqueJobIdss.filter(jobId => viewResult.some(item => item.job_id === jobId && item.status_type !== '6'))
        },
        completed_job: {
          count: jobStatus[0].completed_job,
          ids: uniqueJobIdss.filter(jobId => viewResult.some(item => item.job_id === jobId && item.status_type === '6'))
        }
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
  if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {
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
    console.log("error - ", error)
    return { status: false, message: "Err Dashboard Activity Log Get", error: error.message };
  }


}

const getByAllClient = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, '');
    // const query = `SELECT id 
    //                FROM clients 
    //                WHERE id IN (`+ cleane_ids + `)`;
    const query = `
                   SELECT  
                       clients.id AS id,
                       clients.trading_name AS client_name,
                       clients.status AS status,
                       client_types.type AS client_type_name,
                       client_contact_details.email AS email,
                       client_contact_details.phone_code AS phone_code,
                       client_contact_details.phone AS phone,
                       CONCAT(
                           'cli_', 
                           SUBSTRING(customers.trading_name, 1, 3), '_',
                           SUBSTRING(clients.trading_name, 1, 3), '_',
                           SUBSTRING(clients.client_code, 1, 15)
                           ) AS client_code
                   FROM 
                       clients
                   JOIN 
                      customers ON customers.id = clients.customer_id    
                   JOIN 
                       client_types ON client_types.id = clients.client_type
                   LEFT JOIN 
                       client_contact_details ON client_contact_details.id = (
                           SELECT MIN(cd.id)
                           FROM client_contact_details cd
                           WHERE cd.client_id = clients.id
                       )
                   WHERE clients.id IN (`+ cleane_ids + `)
                   ORDER BY 
                   clients.id DESC;
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No client found.", data: [] }
    }
  } catch (error) {
    return { status: false, message: "Err Dashboard Data View Get", error: error.message };
  }
}

const getByAllCustomer = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, '');
    // const query = `SELECT id 
    //                FROM customers 
    //                WHERE id IN (`+ cleane_ids + `)`;
    const query = `
                   SELECT  
                   customers.id AS id,
                   customers.customer_type AS customer_type,
                   customers.staff_id AS staff_id,
                   customers.account_manager_id AS account_manager_id,
                   customers.trading_name AS trading_name,
                   customers.trading_address AS trading_address,
                   customers.vat_registered AS vat_registered,
                   customers.vat_number AS vat_number,
                   customers.website AS website,
                   customers.form_process AS form_process,
                   customers.created_at AS created_at,
                   customers.updated_at AS updated_at,
                   customers.status AS status,
                   staff1.first_name AS staff_firstname, 
                   staff1.last_name AS staff_lastname,
                   staff2.first_name AS account_manager_firstname, 
                   staff2.last_name AS account_manager_lastname,
                   customer_company_information.company_name AS company_name,
                   customer_company_information.company_number AS company_number,
                   CONCAT(
                   'cust_', 
                   SUBSTRING(customers.trading_name, 1, 3), '_',
                   SUBSTRING(customers.customer_code, 1, 15)
                   ) AS customer_code
               FROM 
                   customers
               JOIN 
                   staffs AS staff1 ON customers.staff_id = staff1.id
               JOIN 
                   staffs AS staff2 ON customers.account_manager_id = staff2.id
               LEFT JOIN 
                   customer_company_information ON customers.id = customer_company_information.customer_id
               WHERE customers.id IN (`+ cleane_ids + `)   
               ORDER BY 
                   customers.id DESC;
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] }
    }
  }
  catch (error) {
    return { status: false, message: "Err Dashboard Data View Get", error: error.message };
  }
}

const getByAllJob = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, '');
    const query = `
                   SELECT 
                   jobs.id AS job_id,
                   job_types.type AS job_type_name,
                   jobs.status_type AS status_type,
                   customer_contact_details.id AS account_manager_officer_id,
                   customer_contact_details.first_name AS account_manager_officer_first_name,
                   customer_contact_details.last_name AS account_manager_officer_last_name,
                   clients.trading_name AS client_trading_name,
                   jobs.client_job_code AS client_job_code,
                   jobs.invoiced AS invoiced,
                   jobs.total_hours AS total_hours,
                   jobs.total_hours_status AS total_hours_status,
                 
                   staffs.id AS allocated_id,
                   staffs.first_name AS allocated_first_name,
                   staffs.last_name AS allocated_last_name,
                 
                   staffs2.id AS reviewer_id,
                   staffs2.first_name AS reviewer_first_name,
                   staffs2.last_name AS reviewer_last_name,
                 
                   staffs3.id AS outbooks_acount_manager_id,
                   staffs3.first_name AS outbooks_acount_manager_first_name,
                   staffs3.last_name AS outbooks_acount_manager_last_name,
                 
                   master_status.name AS status,
                   CONCAT(
                             SUBSTRING(customers.trading_name, 1, 3), '_',
                             SUBSTRING(clients.trading_name, 1, 3), '_',
                              SUBSTRING(job_types.type, 1, 4), '_',
                             SUBSTRING(jobs.job_id, 1, 15)
                             ) AS job_code_id
                 
                   FROM 
                   jobs
                   LEFT JOIN 
                   customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
                   LEFT JOIN 
                   clients ON jobs.client_id = clients.id
                   LEFT JOIN 
                   customers ON jobs.customer_id = customers.id
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
                   LEFT JOIN 
                   staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
                   LEFT JOIN
                   master_status ON master_status.id = jobs.status_type
                   WHERE jobs.id IN (`+ cleane_ids + `) 
                   ORDER BY
                   jobs.id DESC
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] }
    }
  }
  catch (error) {
    return { status: false, message: "Err Dashboard Data View Get", error: error.message };
  }
}

const getByAllCompletedJob = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, '');
    const query = `
                   SELECT 
                   jobs.id AS job_id,
                   job_types.type AS job_type_name,
                   jobs.status_type AS status_type,
                   customer_contact_details.id AS account_manager_officer_id,
                   customer_contact_details.first_name AS account_manager_officer_first_name,
                   customer_contact_details.last_name AS account_manager_officer_last_name,
                   clients.trading_name AS client_trading_name,
                   jobs.client_job_code AS client_job_code,
                   jobs.invoiced AS invoiced,
                   jobs.total_hours AS total_hours,
                   jobs.total_hours_status AS total_hours_status,
                 
                   staffs.id AS allocated_id,
                   staffs.first_name AS allocated_first_name,
                   staffs.last_name AS allocated_last_name,
                 
                   staffs2.id AS reviewer_id,
                   staffs2.first_name AS reviewer_first_name,
                   staffs2.last_name AS reviewer_last_name,
                 
                   staffs3.id AS outbooks_acount_manager_id,
                   staffs3.first_name AS outbooks_acount_manager_first_name,
                   staffs3.last_name AS outbooks_acount_manager_last_name,
                 
                   master_status.name AS status,
                   CONCAT(
                             SUBSTRING(customers.trading_name, 1, 3), '_',
                             SUBSTRING(clients.trading_name, 1, 3), '_',
                              SUBSTRING(job_types.type, 1, 4), '_',
                             SUBSTRING(jobs.job_id, 1, 15)
                             ) AS job_code_id
                 
                   FROM 
                   jobs
                   LEFT JOIN 
                   customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
                   LEFT JOIN 
                   clients ON jobs.client_id = clients.id
                   LEFT JOIN 
                   customers ON jobs.customer_id = customers.id
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
                   LEFT JOIN 
                   staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
                   LEFT JOIN
                   master_status ON master_status.id = jobs.status_type
                   WHERE jobs.id IN (`+ cleane_ids + `) 
                   ORDER BY
                   jobs.id DESC
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] }
    }
  }
  catch (error) {
    return { status: false, message: "Err Dashboard Data View Get", error: error.message };
  }
}

const getByAllPendingJob = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, '');
    const query = `
                   SELECT 
                   jobs.id AS job_id,
                   job_types.type AS job_type_name,
                   jobs.status_type AS status_type,
                   customer_contact_details.id AS account_manager_officer_id,
                   customer_contact_details.first_name AS account_manager_officer_first_name,
                   customer_contact_details.last_name AS account_manager_officer_last_name,
                   clients.trading_name AS client_trading_name,
                   jobs.client_job_code AS client_job_code,
                   jobs.invoiced AS invoiced,
                   jobs.total_hours AS total_hours,
                   jobs.total_hours_status AS total_hours_status,
                 
                   staffs.id AS allocated_id,
                   staffs.first_name AS allocated_first_name,
                   staffs.last_name AS allocated_last_name,
                 
                   staffs2.id AS reviewer_id,
                   staffs2.first_name AS reviewer_first_name,
                   staffs2.last_name AS reviewer_last_name,
                 
                   staffs3.id AS outbooks_acount_manager_id,
                   staffs3.first_name AS outbooks_acount_manager_first_name,
                   staffs3.last_name AS outbooks_acount_manager_last_name,
                 
                   master_status.name AS status,
                   CONCAT(
                             SUBSTRING(customers.trading_name, 1, 3), '_',
                             SUBSTRING(clients.trading_name, 1, 3), '_',
                              SUBSTRING(job_types.type, 1, 4), '_',
                             SUBSTRING(jobs.job_id, 1, 15)
                             ) AS job_code_id
                 
                   FROM 
                   jobs
                   LEFT JOIN 
                   customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
                   LEFT JOIN 
                   clients ON jobs.client_id = clients.id
                   LEFT JOIN 
                   customers ON jobs.customer_id = customers.id
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
                   LEFT JOIN 
                   staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
                   LEFT JOIN
                   master_status ON master_status.id = jobs.status_type
                   WHERE jobs.id IN (`+ cleane_ids + `) 
                   ORDER BY
                   jobs.id DESC
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] }
    }
  }
  catch (error) {
    return { status: false, message: "Err Dashboard Data View Get", error: error.message };
  }
}

const getByAllStaff = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, '');
    const query = `
             SELECT 
             staffs.id, 
             staffs.role_id,
             staffs.first_name,
             staffs.last_name,
             staffs.email,
             staffs.phone_code,
             staffs.phone,
             staffs.status,
             staffs.created_at,
             staffs.hourminute,
             roles.role_name,
             roles.role 
             FROM staffs 
             JOIN roles ON staffs.role_id = roles.id
             WHERE staffs.id IN (`+ cleane_ids + `)
             ORDER BY staffs.id DESC
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] }
    }
  }
  catch (error) {
    return { status: false, message: "Err Dashboard Data View Get", error: error.message };
  }
}


module.exports = {
  getDashboardData,
  getDashboardActivityLog,
  getByAllClient,
  getByAllCustomer,
  getByAllJob,
  getByAllCompletedJob,
  getByAllPendingJob,
  getByAllStaff
};

const pool = require('../config/database');
const SatffLogUpdateOperation = async (logData) => {
  //console.log("logData ",logData)
  try {
    if (logData.staff_id != undefined) {
      let staff_id = logData.staff_id;
      let date = logData.date;
      let module_name = logData.module_name;
      let log_message = logData.log_message;
      let permission_type = logData.permission_type;
      let ip = logData.ip;
      let module_id = logData.module_id ? logData.module_id : 0;
      const query = `
        INSERT INTO staff_logs (staff_id,date,module_name,module_id,log_message,permission_type,ip)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
      const [result] = await pool.execute(query, [staff_id, date, module_name, module_id, log_message, permission_type, ip]);

      const queryUpdate = `
    UPDATE 
        staff_logs
    JOIN 
        staffs ON staffs.id = staff_logs.staff_id
    JOIN 
        roles ON roles.id = staffs.role_id
    LEFT JOIN 
        customers ON staff_logs.module_name = 'customer' AND staff_logs.module_id = customers.id
    LEFT JOIN 
        clients ON staff_logs.module_name = 'client' AND staff_logs.module_id = clients.id
    LEFT JOIN 
        jobs ON staff_logs.module_name = 'job' AND staff_logs.module_id = jobs.id
    SET 
        staff_logs.log_message_all = CONCAT(
          roles.role_name, ' ', 
          staffs.first_name, ' ', 
          staffs.last_name, ' ', 
          staff_logs.log_message, ' ',
          CASE 
          
            WHEN staff_logs.module_name = 'customer' THEN CONCAT('cust_', SUBSTRING(customers.trading_name, 1, 3), '_', customers.customer_code,'(',customers.trading_name ,')')
    
             WHEN staff_logs.module_name = 'client' THEN (
              SELECT CONCAT('cli_', SUBSTRING(c.trading_name, 1, 3),'_', SUBSTRING(clients.trading_name, 1, 3),'_',clients.client_code,'(',clients.trading_name,')')
              FROM customers c
              JOIN clients cl ON c.id = cl.customer_id
              WHERE cl.id = staff_logs.module_id
            )
    
             WHEN staff_logs.module_name = 'job' THEN (
              SELECT CONCAT(SUBSTRING(customers.trading_name, 1, 3),'_', SUBSTRING(clients.trading_name, 1, 3),'_',SUBSTRING(job_types.type, 1, 4), '_',jobs.job_id)
              FROM jobs
              JOIN clients ON jobs.client_id = clients.id
              JOIN customers ON clients.customer_id = customers.id
              LEFT JOIN job_types ON jobs.job_type_id = job_types.id
              WHERE jobs.id = staff_logs.module_id
            )
            ELSE ''
          END
        )
    WHERE staff_logs.id = ?;
`;
      await pool.execute(queryUpdate, [result.insertId]);
    }

  } catch (error) {
    console.log("error  - Logs create", error)
  }
}

async function generateNextUniqueCode(data) {
  let table = data.table;
  let field = data.field;
  const [rows] = await pool.execute('SELECT ' + field + ' FROM ' + table + ' ORDER BY id DESC LIMIT 1');
  let newCode = '00001'; // Default code if table is empty
  if (rows.length > 0 && rows[0][field] != null) {
    const inputString = rows[0][field];
    const parts = inputString.split('_');
    const lastPart = parts[parts.length - 1];
    const lastCode = lastPart;
    const nextCode = parseInt(lastCode, 10) + 1;

    newCode = "0000" + nextCode
    // newCode = nextCode.toString().padStart(5, '0');
  }

  return newCode;
}

async function generateNextUniqueCodeJobLogTitle(data) {
  let table = data.table;
  let field = data.field;
  let filter_id = data.filter_id;
  let prefix = data.prefix
  try {

    let newCode = '00001';
    const [rows] = await pool.execute('SELECT ' + field + ' FROM ' + table + ' WHERE ' + filter_id + ' ORDER BY id DESC LIMIT 1');

    if (rows.length > 0 && rows[0][field] != null) {
      const inputString = rows[0][field];
      const parts = inputString.split('_');
      const lastPart = parts[parts.length - 1];
      const lastCode = lastPart;
      const nextCode = parseInt(lastCode, 10) + 1;
      newCode = "0000" + nextCode
      // newCode = nextCode.toString().padStart(5, '0');
    }

    return prefix + '_' + newCode
  } catch (error) {
    console.log("error  - Logs create", error)
    return newCode
  }
}

const getDateRange = async (filter) => {
  const today = new Date();
  let startDate = '';
  let endDate = '';

  if (filter === 'this_week') {
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6));
    startDate = firstDayOfWeek.toISOString().split('T')[0];
    endDate = lastDayOfWeek.toISOString().split('T')[0];
  } else if (filter === 'last_week') {
    const lastWeekStart = new Date(today.setDate(today.getDate() - today.getDay() - 6));
    const lastWeekEnd = new Date(today.setDate(lastWeekStart.getDate() + 6));
    startDate = lastWeekStart.toISOString().split('T')[0];
    endDate = lastWeekEnd.toISOString().split('T')[0];
  }
  else if (filter === 'this_month') {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  } else if (filter === 'last_month') {
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1
    ).toISOString().split('T')[0];
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split
      ('T')[0];
    startDate = lastMonthStart;
    endDate = lastMonthEnd;
  }
  else if (filter === 'this_quarter') {
    const quarterStart = new Date(today.getFullYear(), today.getMonth() - (today.getMonth() %
      3), 1).toISOString().split('T')[0];
    const quarterEnd = new Date(today.getFullYear(), today.getMonth() + 3 - (today.getMonth() %
      3), 0).toISOString().split('T')[0];
    startDate = quarterStart;
    endDate = quarterEnd;
  }
  else if (filter === 'last_quarter') {
    const lastQuarterStart = new Date(today.getFullYear(), today.getMonth() - (today.getMonth() %
      3) - 3, 1).toISOString().split('T')[0];
    const lastQuarterEnd = new Date(today.getFullYear(), today.getMonth() - 3, 0
    ).toISOString().split('T')[0];
    startDate = lastQuarterStart;
    endDate = lastQuarterEnd;
  }
  else if (filter === 'this_six_month') {
    const sixMonthStart = new Date(today.getFullYear(), today.getMonth() - 6, 1
    ).toISOString().split('T')[0];
    const sixMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split
      ('T')[0];
    startDate = sixMonthStart;
    endDate = sixMonthEnd;
  }
  else if (filter === 'last_six_month') {
    const lastSixMonthStart = new Date(today.getFullYear(), today.getMonth() - 6 -
      6, 1).toISOString().split('T')[0];
    const lastSixMonthEnd = new Date(today.getFullYear(), today.getMonth() - 6,
      0).toISOString().split('T')[0];
    startDate = lastSixMonthStart;
    endDate = lastSixMonthEnd;
  }
  else if (filter === 'this_year') {
    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[
      0];
    endDate = new Date(today.getFullYear(), 12, 0).toISOString().split('T')[0];
  }
  else if (filter === 'last_year') {
    const lastYearStart = new Date(today.getFullYear() - 1, 0, 1
    ).toISOString().split('T')[0];
    const lastYearEnd = new Date(today.getFullYear(), 0, 0).toISOString().split('T')[0];
    startDate = lastYearStart;
    endDate = lastYearEnd;
  }
  else if (filter === 'all') {
    startDate = '1970-01-01';
    endDate = today.toISOString().split('T')[0];
  }


  return { startDate, endDate };
}

const JobTaskNameWithId = async (data) => {
  let job_id = data.job_id;
  let task_id = data.task_id;
  let TaskType = data.TaskType;

  if (TaskType === 1) {
    const query = `SELECT 
     sub_internal.name AS task_name,
     internal.name AS job_code_id
FROM 
     internal
JOIN 
     sub_internal ON sub_internal.internal_id = internal.id
WHERE
     internal.id = ? AND sub_internal.id = ?;`
    const [rows] = await pool.execute(query, [job_id, task_id]);
    return { job_name: rows[0].job_code_id, task_name: rows[0].task_name };

  } else if (TaskType === 2) {
    const query = `SELECT 
        jobs.id AS job_id,
        task.id AS task_id,
        task.name AS task_name,
        CONCAT(
               SUBSTRING(customers.trading_name, 1, 3), '_',
               SUBSTRING(clients.trading_name, 1, 3), '_',
               SUBSTRING(job_types.type, 1, 4), '_',
               SUBSTRING(jobs.job_id, 1, 15)
               ) AS job_code_id
   FROM 
        jobs
   JOIN 
        clients ON jobs.client_id = clients.id
   JOIN 
        customers ON jobs.customer_id = customers.id
   JOIN 
        job_types ON jobs.job_type_id = job_types.id
   CROSS JOIN 
        task  -- This will join all tasks with the jobs (cross product)
   WHERE
        jobs.id = ? AND task.id = ?`
    const [rows] = await pool.execute(query, [job_id, task_id]);
    return { job_name: rows[0].job_code_id, task_name: rows[0].task_name };
  } else {
    return { job_name: "", task_name: "" };
  }


}

const getAllCustomerIds = async (StaffUserId, module_type) => {
  // Line Manager
  let rolePermissionId = 34;
  if (module_type == "job") {
    rolePermissionId = 35;
  }
  const [LineManage] = await pool.execute('SELECT staff_to FROM line_managers WHERE staff_by = ?', [StaffUserId]);
  let LineManageStaffId = LineManage?.map(item => item.staff_to);

  if (LineManageStaffId.length == 0) {
    LineManageStaffId.push(StaffUserId);
  }

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
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
  const [rows] = await pool.execute(QueryRole);



  const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, rolePermissionId]);

  // Condition with Admin And SuperAdmin
  if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
    const query = `
    SELECT  
    customers.id AS id,
    customers.status AS status,
    customers.form_process AS form_process,
    customers.trading_name AS trading_name,
    CONCAT(
    'cust_', 
    SUBSTRING(customers.trading_name, 1, 3), '_',
    SUBSTRING(customers.customer_code, 1, 15)
    ) AS customer_code
FROM 
    customers 
ORDER BY 
id DESC;`;

    const [result] = await pool.execute(query);

    return { status: true, message: 'Success..', data: result };
  }

  // console.log("Line Manager Staff IDs:", LineManageStaffId);
  let query = `
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
        ) AS customer_code,
        CASE
            WHEN clients.id IS NOT NULL THEN 1
            ELSE 0
        END AS is_client
        FROM 
            customers  
        JOIN 
            staffs AS staff1 ON customers.staff_id = staff1.id
        JOIN 
            staffs AS staff2 ON customers.account_manager_id = staff2.id
        LEFT JOIN clients ON clients.customer_id = customers.id
        LEFT JOIN
            assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
        LEFT JOIN
            customer_company_information ON customers.id = customer_company_information.customer_id
        LEFT JOIN staff_portfolio ON staff_portfolio.customer_id = customers.id
         LEFT JOIN customer_services ON customer_services.customer_id = customers.id
        JOIN customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id
        WHERE
            (customers.staff_id = ?  OR customers.account_manager_id = ? OR assigned_jobs_staff_view.staff_id = ? OR staff_portfolio.staff_id = ? OR customer_service_account_managers.account_manager_id = ? 

            OR customers.staff_id IN (${LineManageStaffId}) OR customers.account_manager_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
            OR staff_portfolio.staff_id IN (${LineManageStaffId}) OR customer_service_account_managers.account_manager_id IN (${LineManageStaffId})
            )
           GROUP BY customers.id
           ORDER BY customers.id DESC

         `;
  try {
    const [result] = await pool.execute(query, [StaffUserId, StaffUserId, StaffUserId, StaffUserId, StaffUserId]);
    return { status: true, message: 'Success..', data: result };
  } catch (err) {
    console.error('Error executing query getCustomer_dropdown:', err);
    return { status: false, message: 'Error executing query', data: err };
  }

}




module.exports = { SatffLogUpdateOperation, generateNextUniqueCode, generateNextUniqueCodeJobLogTitle, getDateRange, JobTaskNameWithId, getAllCustomerIds };
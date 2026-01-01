const pool = require("../config/database");
const deleteUploadFile = require("../middlewares/deleteUploadFile");
const {
  SatffLogUpdateOperation,
  generateNextUniqueCode,
  getDateRange,
  LineManageStaffIdHelperFunction,
  QueryRoleHelperFunction,
} = require("../utils/helper");

/*
VIEW
CREATE VIEW assigned_jobs_staff_view AS
SELECT  
    customers.id AS customer_id,
    clients.id AS client_id,
    jobs.id AS job_id,
    staffs.id AS staff_id,
    'assign_customer_portfolio' AS source,
    NULL AS service_id_assign
FROM 
    customers
JOIN staff_portfolio ON staff_portfolio.customer_id = customers.id
JOIN staffs ON staffs.id = staff_portfolio.staff_id
LEFT JOIN clients ON clients.customer_id = customers.id
LEFT JOIN jobs ON jobs.client_id =clients.id

UNION ALL

SELECT  
    customers.id AS customer_id,
     clients.id AS client_id,
     jobs.id AS job_id,
     staffs.id AS staff_id,
    'assign_customer_service' AS source,
     customer_services.service_id AS service_id_assign
FROM 
    customers
JOIN customer_services ON customer_services.customer_id = customers.id
JOIN customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id
JOIN staffs ON staffs.id = customer_service_account_managers.account_manager_id
LEFT JOIN clients ON clients.customer_id = customers.id
LEFT JOIN jobs ON jobs.client_id =clients.id

UNION ALL

SELECT  
    customers.id AS customer_id,
     clients.id AS client_id,
    jobs.id AS job_id,
     staffs.id AS staff_id,
    'assign_customer_main_account_manager' AS source,
    NULL AS service_id_assign
FROM 
    customers
JOIN staffs ON staffs.id = customers.account_manager_id
LEFT JOIN clients ON clients.customer_id = customers.id
LEFT JOIN jobs ON jobs.client_id =clients.id

UNION ALL


SELECT  
    customers.id AS customer_id,
    clients.id AS client_id,
    jobs.id AS job_id,
    jobs.reviewer AS staff_id,
    'reviewer' AS source,
    NULL AS service_id_assign
FROM 
    jobs
JOIN clients ON clients.id = jobs.client_id
JOIN customers ON customers.id = clients.customer_id
JOIN staffs ON staffs.id = jobs.reviewer

UNION ALL

SELECT  
    customers.id AS customer_id,
    clients.id AS client_id,
    jobs.id AS job_id,
    jobs.allocated_to AS staff_id,
     'allocated_to' AS source,
     NULL AS service_id_assign

FROM 
    jobs
JOIN clients ON clients.id = jobs.client_id
JOIN customers ON customers.id = clients.customer_id
JOIN staffs ON staffs.id = jobs.allocated_to

UNION ALL

SELECT  
    customers.id AS customer_id,
    clients.id AS client_id,
    jobs.id AS job_id,
    job_allowed_staffs.staff_id AS staff_id,
    'job_allowed_staffs' AS source,
    NULL AS service_id_assign
FROM 
    jobs
JOIN clients ON clients.id = jobs.client_id
JOIN customers ON customers.id = clients.customer_id
LEFT JOIN job_allowed_staffs ON job_allowed_staffs.job_id = jobs.id
JOIN staffs ON staffs.id = job_allowed_staffs.staff_id;

*/

const getDashboardData = async (dashboard) => {
  const { staff_id, date_filter } = dashboard;
  let { startDate, endDate } = await getDateRange(date_filter);

  // Line Manager
  const LineManageStaffId = await LineManageStaffIdHelperFunction(staff_id);
  // Get Role
  const rowRoles = await QueryRoleHelperFunction(staff_id);

  try {
    const [RoleAccessCustomer] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rowRoles[0].role_id, 33]
    );

    const [RoleAccessClient] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rowRoles[0].role_id, 34]
    );

    const [RoleAccessJob] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rowRoles[0].role_id, 35]
    );

    // console.log("rows startDate ", startDate);
    // console.log("rows endDate ", endDate);

    // For Cutomer Data
    let CustomerResult = [];
    if (
      rowRoles.length > 0 &&
      (rowRoles[0].role_name == "SUPERADMIN" || RoleAccessCustomer.length > 0)
    ) {
      const CustomerQuery = `
      SELECT  
          customers.id AS id
      FROM 
          customers
      WHERE
          customers.created_at BETWEEN ? AND ?
      ORDER BY 
      id DESC;`;

      const [CustomerData] = await pool.execute(CustomerQuery, [
        startDate,
        endDate,
      ]);
      CustomerResult = CustomerData;
    } else {
      const CustomerQuery = `
        SELECT  
            customers.id AS id
        FROM customers  
        JOIN staffs AS staff1 ON customers.staff_id = staff1.id
        JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
        LEFT JOIN clients ON clients.customer_id = customers.id
        LEFT JOIN assigned_jobs_staff_view 
              ON assigned_jobs_staff_view.customer_id = customers.id
        LEFT JOIN customer_company_information 
              ON customers.id = customer_company_information.customer_id
        WHERE
            (customers.staff_id = ${staff_id}  
            OR assigned_jobs_staff_view.staff_id = ${staff_id}
            OR customers.staff_id IN (${LineManageStaffId}) 
            OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
            )
            AND customers.created_at BETWEEN ? AND ?
        GROUP BY customers.id
        ORDER BY customers.id DESC;
    `;
      const [CustomerData] = await pool.execute(CustomerQuery, [
        startDate,
        endDate,
      ]);
      CustomerResult = CustomerData;
    }

    // For Client Data
    let ClientResult = [];
    if (
      rowRoles.length > 0 &&
      (rowRoles[0].role_name == "SUPERADMIN" || RoleAccessClient.length > 0)
    ) {
      const ClientQuery = `
   SELECT  
    clients.id AS id
    FROM 
        clients
    JOIN 
        customers ON customers.id = clients.customer_id    
    JOIN 
        client_types ON client_types.id = clients.client_type
    LEFT JOIN 
        jobs ON clients.id = jobs.client_id  -- Corrected LEFT JOIN condition
    LEFT JOIN 
        client_contact_details ON client_contact_details.id = (
            SELECT MIN(cd.id)
            FROM client_contact_details cd
            WHERE cd.client_id = clients.id
        )
    WHERE 
        clients.created_at BETWEEN ? AND ?
    GROUP BY
        clients.id    
    ORDER BY 
        clients.id DESC;
    `;
      const [ClientData] = await pool.execute(ClientQuery, [
        startDate,
        endDate,
      ]);
      ClientResult = ClientData;
    } else {
      const ClientQuery = `
    SELECT  
      clients.id AS id
      FROM 
          clients
      LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.client_id = clients.id
      JOIN 
          customers ON customers.id = clients.customer_id    
      JOIN 
          client_types ON client_types.id = clients.client_type
      LEFT JOIN 
          jobs ON clients.id = jobs.client_id
      LEFT JOIN 
          client_contact_details ON client_contact_details.id = (
              SELECT MIN(cd.id)
              FROM client_contact_details cd
              WHERE cd.client_id = clients.id
          )
      WHERE 
      (clients.staff_created_id = ${staff_id} 
      OR assigned_jobs_staff_view.staff_id = ${staff_id}
      OR clients.staff_created_id IN (${LineManageStaffId}) 
      OR  assigned_jobs_staff_view.staff_id IN (${LineManageStaffId}))
      AND clients.created_at BETWEEN ? AND ?
      GROUP BY
          clients.id    
      ORDER BY 
          clients.id DESC;
    `;
      const [ClientData] = await pool.execute(ClientQuery, [
        startDate,
        endDate,
      ]);
      ClientResult = ClientData;
    }

    // For Staff Data
    let StaffResult = [];
    if (rowRoles.length > 0 && rowRoles[0].role_name == "SUPERADMIN") {
      const StaffQuery = `
        SELECT  
            id
        FROM staffs
        WHERE created_at BETWEEN ? AND ?
        ORDER BY id DESC;
        `;
      const [StaffData] = await pool.execute(StaffQuery, [startDate, endDate]);
      StaffResult = StaffData;
    } else {
      const StaffQuery = `
        SELECT  
            id
        FROM staffs
        WHERE created_by = ${staff_id}
          AND created_at BETWEEN ? AND ?
        ORDER BY id DESC;
        `;
      const [StaffData] = await pool.execute(StaffQuery, [startDate, endDate]);
      StaffResult = StaffData;
    }

    // For Jobs Data
    let JobResult = [];
    if (
      rowRoles.length > 0 &&
      (rowRoles[0].role_name == "SUPERADMIN" || RoleAccessJob.length > 0)
    ) {
      const JobQuery = `
        SELECT 
        jobs.id AS id,
        jobs.status_type AS status_type
        FROM 
        jobs
        LEFT JOIN 
        customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id AND customers.status = '1'
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
        master_status ON master_status.id = jobs.status_type
        LEFT JOIN
        timesheet ON timesheet.job_id = jobs.id AND timesheet.task_type = '2'
        WHERE
        jobs.created_at BETWEEN ? AND ?
        GROUP BY jobs.id
        ORDER BY 
         jobs.id DESC;
        `;
      const [JobData] = await pool.execute(JobQuery, [startDate, endDate]);
      JobResult = JobData;
    } else {
      // const JobQuery = `
      //   SELECT 
      //   jobs.id AS id,
      //   jobs.status_type AS status_type,

      //   assigned_jobs_staff_view.source AS assigned_source,
      //   assigned_jobs_staff_view.service_id_assign AS service_id_assign,
      //   jobs.service_id AS job_service_id

      //   FROM 
      //   jobs
      //   LEFT JOIN 
      //     assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
      //   JOIN 
      //   services ON jobs.service_id = services.id
      //   JOIN
      //   customer_services ON customer_services.service_id = jobs.service_id
      //   JOIN
      //   customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id
      //   LEFT JOIN 
      //   customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
      //   LEFT JOIN 
      //   clients ON jobs.client_id = clients.id
      //   LEFT JOIN 
      //   customers ON jobs.customer_id = customers.id AND customers.status = '1'
      //   LEFT JOIN 
      //   staff_portfolio ON staff_portfolio.customer_id = customers.id
      //   LEFT JOIN 
      //   job_types ON jobs.job_type_id = job_types.id
      //   LEFT JOIN 
      //   staffs ON jobs.allocated_to = staffs.id
      //   LEFT JOIN 
      //   staffs AS staffs2 ON jobs.reviewer = staffs2.id
      //   LEFT JOIN 
      //   staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
      //   LEFT JOIN 
      //   master_status ON master_status.id = jobs.status_type
      //    LEFT JOIN
      //    timesheet ON timesheet.job_id = jobs.id AND timesheet.task_type = '2'
      //   WHERE
      //   (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) 
      //   OR jobs.staff_created_id IN(${LineManageStaffId}) 
      //   OR clients.staff_created_id IN(${LineManageStaffId}))
      //   AND jobs.created_at BETWEEN ? AND ?
      //   GROUP BY 
      //   jobs.id 
      //   ORDER BY 
      //   jobs.id DESC;
      //   `;

      startDate = startDate + " 00:00:00"
      endDate = endDate + " 00:00:00"

      const JobQuery = `
        SELECT 
        jobs.id AS id,
        jobs.status_type AS status_type,
        
        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id
        FROM
        jobs
        JOIN staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
        LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN clients ON jobs.client_id = clients.id
        LEFT JOIN customers ON jobs.customer_id = customers.id
        LEFT JOIN job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN master_status ON master_status.id = jobs.status_type
        LEFT JOIN timesheet ON timesheet.job_id = jobs.id AND timesheet.task_type = '2'
        WHERE
        ((assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) 
        OR jobs.staff_created_id IN(${LineManageStaffId}) 
        OR clients.staff_created_id IN(${LineManageStaffId}))
        AND DATE(jobs.created_at) BETWEEN ? AND ?)
        AND (
            assigned_jobs_staff_view.source != 'assign_customer_service'
            OR jobs.service_id = assigned_jobs_staff_view.service_id_assign
          )
        AND customers.status = '1'    
        GROUP BY 
        jobs.id 
        ORDER BY 
        jobs.id DESC;
        `;
      const [JobData] = await pool.execute(JobQuery, [startDate, endDate]);

      //////-----START Assign Customer Service Data START----////////
      let isExistAssignCustomer = JobData?.find(
        (item) => item?.assigned_source === "assign_customer_service"
      );
      if (isExistAssignCustomer != undefined) {
        let matched = JobData?.filter(
          (item) =>
            item?.assigned_source === "assign_customer_service" &&
            Number(item?.service_id_assign) === Number(item?.job_service_id)
        );
        let matched2 = JobData?.filter(
          (item) => item?.assigned_source !== "assign_customer_service"
        );
        const resultAssignCustomer = [...matched, ...matched2];
        JobResult = resultAssignCustomer;
      }
      //////-----END Assign Customer Service Data END----////////
      else {
        JobResult = JobData;
      }
    }

    const result = {
      customer: {
        count: CustomerResult.length,
        ids: CustomerResult.map((row) => row.id).join(","),
      },
      client: {
        count: ClientResult.length,
        ids: ClientResult.map((row) => row.id).join(","),
      },
      staff: {
        count: StaffResult.length,
        ids: StaffResult.map((row) => row.id).join(","),
      },
      job: {
        count: JobResult.length,
        ids: JobResult.map((row) => row.id).join(","),
      },
      pending_job: {
        count: JobResult?.filter((row) => Number(row.status_type) != 6).length,
        ids: JobResult?.filter((row) => Number(row.status_type) != 6)
          .map((row) => row.id)
          .join(","),
      },
      completed_job: {
        count: JobResult?.filter((row) => Number(row.status_type) === 6).length,
        ids: JobResult?.filter((row) => Number(row.status_type) === 6)
          .map((row) => row.id)
          .join(","),
      },
    };
    return { status: true, message: "success.", data: result };
  } catch (err) {
    console.error("eeee", err);
    return {
      status: false,
      message: "Err Dashboard Data View Get",
      error: err.message,
    };
  }
};

const getDashboardActivityLog = async (dashboard) => {
  const {
    staff_id,
    type,
    filter_type,
    filter_staff_id,
    from_date,
    to_date,
    page = 1,
  } = dashboard;

  const limit = 50;
  const offset = (page - 1) * limit;

  try {
    const QueryRole = `
      SELECT
        staffs.id AS id,
        roles.role AS role_name
      FROM staffs
      JOIN roles ON roles.id = staffs.role_id
      WHERE staffs.id = ?
      LIMIT 1
    `;
    const [rows] = await pool.execute(QueryRole, [staff_id]);

    const isSuperAdmin = rows.length > 0 && rows[0].role_name === "SUPERADMIN";

    const getDateRangeByFilter = () => {
      const today = new Date();
      let startDate = null;
      let endDate = null;

      switch (filter_type) {
        // ✅ This Week (Monday → Today)
        case "this_week": {
          const day = today.getDay() || 7;
          startDate = new Date(today);
          startDate.setDate(today.getDate() - day + 1);
          endDate = today;
          break;
        }

        // ✅ Last Week (Monday → Sunday)
        case "last_week": {
          const day = today.getDay() || 7;
          endDate = new Date(today);
          endDate.setDate(today.getDate() - day);
          startDate = new Date(endDate);
          startDate.setDate(endDate.getDate() - 6);
          break;
        }

        // ✅ This Month (1st → Today)
        case "this_month": {
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = today;
          break;
        }

        // ✅ Last Month (1st → Last Day)
        case "last_month": {
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          endDate = new Date(today.getFullYear(), today.getMonth(), 0);
          break;
        }

        // ✅ Last 6 Months
        case "last_six_month": {
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 6);
          endDate = today;
          break;
        }

        // ✅ Last Year (1 Jan → 31 Dec)
        case "last_year": {
          startDate = new Date(today.getFullYear() - 1, 0, 1);
          endDate = new Date(today.getFullYear() - 1, 11, 31);
          break;
        }

        // ✅ Custom Range
        case "custom": {
          if (from_date && to_date) {
            startDate = new Date(from_date);
            endDate = new Date(to_date);
          }
          break;
        }
      }

      const format = (d) => d.toISOString().slice(0, 10);

      return {
        startDate: startDate ? format(startDate) : null,
        endDate: endDate ? format(endDate) : null,
      };
    };

    // ================= BUILD QUERY WITH PREPARED STATEMENTS =================
    const { startDate, endDate } = getDateRangeByFilter();

    // Prepare query parts and parameters
    let whereConditions = [];
    let queryParams = [];

    // Add staff filter for non-superadmin
    if (!isSuperAdmin) {
      whereConditions.push('staff_logs.staff_id = ?');
      queryParams.push(staff_id);
    }

    // Add staff filter if specified
    if (filter_staff_id) {
      whereConditions.push('staff_logs.staff_id = ?');
      queryParams.push(filter_staff_id);
    }

    // Add date range filter
    if (startDate && endDate) {
      whereConditions.push('staff_logs.date BETWEEN ? AND ?');
      queryParams.push(startDate, endDate);
    }

    // Build WHERE clause
    const whereClause = whereConditions.length > 0
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Add limit and offset to params
    queryParams.push(limit, offset);

    // ================= MAIN QUERY (Fixed SQL Injection) =================
    const query = `
      SELECT
        staff_logs.id AS log_id,
        staff_logs.staff_id AS staff_id,
        DATE_FORMAT(staff_logs.date, '%Y-%m-%d') AS date,
        staff_logs.created_at AS created_at,
        staff_logs.log_message_all AS log_message,
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS staff_name
      FROM staff_logs
      LEFT JOIN staffs ON staffs.id = staff_logs.staff_id
      ${whereClause}
      ORDER BY staff_logs.id DESC
      LIMIT ? OFFSET ?
    `;

    const [result] = await pool.execute(query, queryParams);

    // ================= GROUP BY DATE (STAFF VIEW) =================
    let finalResult = result;

    if (type === "staff" && result.length > 0) {
      finalResult = result.reduce((acc, log) => {
        const found = acc.find((item) => item.date === log.date);
        if (found) {
          found.allContain.push({
            created_at: log.created_at,
            log_message: log.log_message,
          });
        } else {
          acc.push({
            date: log.date,
            allContain: [
              {
                created_at: log.created_at,
                log_message: log.log_message,
              },
            ],
          });
        }
        return acc;
      }, []);
    }

    return {
      status: true,
      message: result.length ? "success." : "No Activity Log found.",
      page,
      limit,
      data: finalResult,
    };
  } catch (error) {
    console.error("Dashboard Activity Log Error:", error);
    return {
      status: false,
      message: "Error fetching activity logs. Please try again.",
      error: error.message,
    };
  }
};

const getByAllClient = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, "");
    // const query = `SELECT id
    //                FROM clients
    //                WHERE id IN (`+ cleane_ids + `)`;
    const query =
      `
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
                   WHERE clients.id IN (` +
      cleane_ids +
      `)
                   ORDER BY 
                   clients.id DESC;
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No client found.", data: [] };
    }
  } catch (error) {
    return {
      status: false,
      message: "Err Dashboard Data View Get",
      error: error.message,
    };
  }
};

const getByAllCustomer = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, "");
    // const query = `SELECT id
    //                FROM customers
    //                WHERE id IN (`+ cleane_ids + `)`;
    const query =
      `
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
               WHERE customers.id IN (` +
      cleane_ids +
      `)   
               ORDER BY 
                   customers.id DESC;
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] };
    }
  } catch (error) {
    return {
      status: false,
      message: "Err Dashboard Data View Get",
      error: error.message,
    };
  }
};

const getByAllJob = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, "");
    const query =
      `
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
                   WHERE jobs.id IN (` +
      cleane_ids +
      `) 
                   ORDER BY
                   jobs.id DESC
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] };
    }
  } catch (error) {
    return {
      status: false,
      message: "Err Dashboard Data View Get",
      error: error.message,
    };
  }
};

const getByAllCompletedJob = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, "");
    const query =
      `
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
                   WHERE jobs.id IN (` +
      cleane_ids +
      `) 
                   ORDER BY
                   jobs.id DESC
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] };
    }
  } catch (error) {
    return {
      status: false,
      message: "Err Dashboard Data View Get",
      error: error.message,
    };
  }
};

const getByAllPendingJob = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, "");
    const query =
      `
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
                   WHERE jobs.id IN (` +
      cleane_ids +
      `) 
                   ORDER BY
                   jobs.id DESC
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] };
    }
  } catch (error) {
    return {
      status: false,
      message: "Err Dashboard Data View Get",
      error: error.message,
    };
  }
};

const getByAllStaff = async (dashboard) => {
  try {
    const { staff_id, ids } = dashboard;
    const cleane_ids = ids.replace(/^,+|,+$/g, "");
    const query =
      `
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
             WHERE staffs.id IN (` +
      cleane_ids +
      `)
             ORDER BY staffs.id DESC
                   `;
    const [result] = await pool.execute(query);
    if (result.length > 0) {
      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found.", data: [] };
    }
  } catch (error) {
    return {
      status: false,
      message: "Err Dashboard Data View Get",
      error: error.message,
    };
  }
};

module.exports = {
  getDashboardData,
  getDashboardActivityLog,
  getByAllClient,
  getByAllCustomer,
  getByAllJob,
  getByAllCompletedJob,
  getByAllPendingJob,
  getByAllStaff,
};

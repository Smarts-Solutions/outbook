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

const getDashboardData_1 = async (dashboard) => {
  const { staff_id, date_filter } = dashboard;

  //time check 

  console.log("dashboard Time - 1 -", new Date());

  let { startDate, endDate } = await getDateRange(date_filter);

  console.log("dashboard Time - 2 -", new Date());

  // Line Manager
  const LineManageStaffId = await LineManageStaffIdHelperFunction(staff_id);

  console.log("dashboard Time - 3 -", new Date());
  // Get Role
  const rowRoles = await QueryRoleHelperFunction(staff_id);

  console.log("dashboard Time - 4 -", new Date());

  try {
    const [RoleAccessCustomer] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rowRoles[0].role_id, 33],
    );

    const [RoleAccessClient] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rowRoles[0].role_id, 34],
    );

    const [RoleAccessJob] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rowRoles[0].role_id, 35],
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
      console.log("dashboard Time - ADMIN CUSTOMER -", new Date());
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
      console.log("dashboard Time - USER CUSTOMER -", new Date());
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
      console.log("dashboard Time - ADMIN CLIENT -", new Date());
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
      console.log("dashboard Time - USER CLIENT -", new Date());
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
      console.log("dashboard Time - ADMIN JOB -", new Date());
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

      startDate = startDate + " 00:00:00";
      endDate = endDate + " 00:00:00";

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
            assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci
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
        (item) => item?.assigned_source === "assign_customer_service",
      );
      if (isExistAssignCustomer != undefined) {
        let matched = JobData?.filter(
          (item) =>
            item?.assigned_source === "assign_customer_service" &&
            Number(item?.service_id_assign) === Number(item?.job_service_id),
        );
        let matched2 = JobData?.filter(
          (item) => item?.assigned_source !== "assign_customer_service",
        );
        const resultAssignCustomer = [...matched, ...matched2];
        JobResult = resultAssignCustomer;

        console.log("dashboard Time - USER ACCOUNT MANAGER JOB -", new Date());
      }
      //////-----END Assign Customer Service Data END----////////
      else {
        JobResult = JobData;
        console.log("dashboard Time -  USER JOB -", new Date());
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


const getDashboardData_2 = async (dashboard) => {
  const { staff_id, date_filter } = dashboard;

  console.log("dashboard Time - START -", new Date());

  // ✅ FIX 1: Parallel mein chalao — ye 3 independent hain
  const [{ startDate, endDate }, LineManageStaffId, rowRoles] = await Promise.all([
    getDateRange(date_filter),
    LineManageStaffIdHelperFunction(staff_id),
    QueryRoleHelperFunction(staff_id),
  ]);

  console.log("dashboard Time - after parallel init -", new Date());

  if (!rowRoles.length) {
    return { status: false, message: "Role not found." };
  }

  const role_id = rowRoles[0].role_id;
  const isSuperAdmin = rowRoles[0].role_name === "SUPERADMIN";

  try {
    // ✅ FIX 2: 3 queries ki jagah ek mein role permissions fetch karo
    const [rolePermissions] = await pool.execute(
      `SELECT permission_id FROM role_permissions 
       WHERE role_id = ? AND permission_id IN (33, 34, 35)`,
      [role_id]
    );

    const permissionSet = new Set(rolePermissions.map((r) => r.permission_id));
    const RoleAccessCustomer = isSuperAdmin || permissionSet.has(33);
    const RoleAccessClient = isSuperAdmin || permissionSet.has(34);
    const RoleAccessJob = isSuperAdmin || permissionSet.has(35);

    // ─── Query Definitions ───────────────────────────────────────────

    // CUSTOMER
    const customerQuery = RoleAccessCustomer
      ? {
        sql: `SELECT id FROM customers 
                WHERE created_at BETWEEN ? AND ? 
                ORDER BY id DESC`,
        params: [startDate, endDate],
      }
      : {
        sql: `SELECT customers.id
                FROM customers
                LEFT JOIN assigned_jobs_staff_view ajsv 
                  ON ajsv.customer_id = customers.id 
                  AND ajsv.staff_id IN (${staff_id}, ${LineManageStaffId})
                WHERE 
                  (customers.staff_id IN (${staff_id}, ${LineManageStaffId})
                   OR ajsv.staff_id IS NOT NULL)
                  AND customers.created_at BETWEEN ? AND ?
                GROUP BY customers.id
                ORDER BY customers.id DESC`,
        params: [startDate, endDate],
      };

    // CLIENT
    const clientQuery = RoleAccessClient
      ? {
        sql: `SELECT id FROM clients 
                WHERE created_at BETWEEN ? AND ? 
                ORDER BY id DESC`,
        params: [startDate, endDate],
      }
      : {
        sql: `SELECT clients.id
                FROM clients
                LEFT JOIN assigned_jobs_staff_view ajsv 
                  ON ajsv.client_id = clients.id
                  AND ajsv.staff_id IN (${staff_id}, ${LineManageStaffId})
                WHERE 
                  (clients.staff_created_id IN (${staff_id}, ${LineManageStaffId})
                   OR ajsv.staff_id IS NOT NULL)
                  AND clients.created_at BETWEEN ? AND ?
                GROUP BY clients.id
                ORDER BY clients.id DESC`,
        params: [startDate, endDate],
      };

    // STAFF
    const staffQuery = isSuperAdmin
      ? {
        sql: `SELECT id FROM staffs 
                WHERE created_at BETWEEN ? AND ? 
                ORDER BY id DESC`,
        params: [startDate, endDate],
      }
      : {
        sql: `SELECT id FROM staffs 
                WHERE created_by = ? 
                  AND created_at BETWEEN ? AND ? 
                ORDER BY id DESC`,
        params: [staff_id, startDate, endDate],
      };

    // JOB
    const jobStartDate = RoleAccessJob ? startDate : startDate + " 00:00:00";
    const jobEndDate = RoleAccessJob ? endDate : endDate + " 00:00:00";

    const jobQuery = RoleAccessJob
      ? {
        sql: `SELECT jobs.id, jobs.status_type
                FROM jobs
                WHERE jobs.created_at BETWEEN ? AND ?
                GROUP BY jobs.id
                ORDER BY jobs.id DESC`,
        params: [jobStartDate, jobEndDate],
      }
      : {
        sql: `SELECT 
                  jobs.id,
                  jobs.status_type,
                  ajsv.source        AS assigned_source,
                  ajsv.service_id_assign,
                  jobs.service_id    AS job_service_id
                FROM jobs
                JOIN staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
                LEFT JOIN assigned_jobs_staff_view ajsv ON ajsv.job_id = jobs.id
                LEFT JOIN clients  ON jobs.client_id   = clients.id
                LEFT JOIN customers ON jobs.customer_id = customers.id
                LEFT JOIN master_status ON master_status.id = jobs.status_type
                WHERE
                  (ajsv.staff_id IN (${LineManageStaffId})
                   OR jobs.staff_created_id IN (${LineManageStaffId})
                   OR clients.staff_created_id IN (${LineManageStaffId}))
                  AND DATE(jobs.created_at) BETWEEN ? AND ?
                  AND (
                  ajsv.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci
                  OR jobs.service_id = ajsv.service_id_assign
                 )  
                  AND customers.status = '1'
                GROUP BY jobs.id
                ORDER BY jobs.id DESC`,
        params: [jobStartDate, jobEndDate],
      };


    // ✅ FIX 3: Charo queries ek saath parallel mein
    console.log("dashboard Time - before parallel queries -", new Date());

    const [
      [CustomerResult],
      [ClientResult],
      [StaffResult],
      [JobResult],
    ] = await Promise.all([
      pool.execute(customerQuery.sql, customerQuery.params),
      pool.execute(clientQuery.sql, clientQuery.params),
      pool.execute(staffQuery.sql, staffQuery.params),
      pool.execute(jobQuery.sql, jobQuery.params),
    ]);

    console.log("dashboard Time - after parallel queries -", new Date());

    // ─── Job filtering (non-admin assign_customer_service logic) ─────
   
    
    // ─── Result Assembly ─────────────────────────────────────────────
    const toIds = (arr) => arr.map((r) => r.id).join(",");

    const result = {
      customer: { count: CustomerResult.length, ids: toIds(CustomerResult) },
      client: { count: ClientResult.length, ids: toIds(ClientResult) },
      staff: { count: StaffResult.length, ids: toIds(StaffResult) },
      job: {
        count: JobResult.length,
        ids: toIds(JobResult),
      },
      pending_job: {
        count: JobResult.filter((r) => Number(r.status_type) !== 6).length,
        ids: toIds(JobResult.filter((r) => Number(r.status_type) !== 6)),
      },
      completed_job: {
        count: JobResult.filter((r) => Number(r.status_type) === 6).length,
        ids: toIds(JobResult.filter((r) => Number(r.status_type) === 6)),
      },
    };

    console.log("dashboard Time - END -", new Date());
    return { status: true, message: "success.", data: result };

  } catch (err) {
    console.error("Dashboard error:", err);
    return { status: false, message: "Err Dashboard Data View Get", error: err.message };
  }
};

const getDashboardData_3 = async (dashboard) => {
  const { staff_id, date_filter } = dashboard;

  console.log("dashboard Time - START -", new Date());

  // ── Step 1: Parallel init ────────────────────────────────────────────────────
  const [{ startDate, endDate }, LineManageStaffId, rowRoles] = await Promise.all([
    getDateRange(date_filter),
    LineManageStaffIdHelperFunction(staff_id),
    QueryRoleHelperFunction(staff_id),
  ]);

  console.log("dashboard Time - after parallel init -", new Date());

  if (!rowRoles.length) {
    return { status: false, message: "Role not found." };
  }

  const role_id     = rowRoles[0].role_id;
  const isSuperAdmin = rowRoles[0].role_name === "SUPERADMIN";

  // ── Step 2: staffIds string (safe, used in dynamic IN clauses) ───────────────
  // LineManageStaffId already comes as a comma-separated string or single id
  // from the helper. We keep it as-is for IN() usage.
  const staffIds = `${staff_id}, ${LineManageStaffId}`;

  try {
    // ── Step 3: Single permission fetch instead of 3 queries ────────────────────
    const [rolePermissions] = await pool.execute(
      `SELECT permission_id
         FROM role_permissions
        WHERE role_id = ?
          AND permission_id IN (33, 34, 35)`,
      [role_id]
    );

    const permissionSet    = new Set(rolePermissions.map((r) => r.permission_id));
    const RoleAccessCustomer = isSuperAdmin || permissionSet.has(33);
    const RoleAccessClient   = isSuperAdmin || permissionSet.has(34);
    const RoleAccessJob      = isSuperAdmin || permissionSet.has(35);

    // ── Step 4: Query definitions ─────────────────────────────────────────────

    // ── CUSTOMER ──────────────────────────────────────────────────────────────
    // FIX: Use direct range on created_at so the index is usable.
    const customerQuery = RoleAccessCustomer
      ? {
          sql: `SELECT id
                  FROM customers
                 WHERE created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
                 ORDER BY id DESC`,
          params: [startDate, endDate],
        }
      : {
          sql: `SELECT customers.id
                  FROM customers
                  LEFT JOIN assigned_jobs_staff_view ajsv
                    ON  ajsv.customer_id = customers.id
                    AND ajsv.staff_id    IN (${staffIds})
                 WHERE (
                         customers.staff_id IN (${staffIds})
                         OR ajsv.staff_id IS NOT NULL
                       )
                   AND customers.created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
                 GROUP BY customers.id
                 ORDER BY customers.id DESC`,
          params: [startDate, endDate],
        };

    // ── CLIENT ────────────────────────────────────────────────────────────────
    const clientQuery = RoleAccessClient
      ? {
          sql: `SELECT id
                  FROM clients
                 WHERE created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
                 ORDER BY id DESC`,
          params: [startDate, endDate],
        }
      : {
          sql: `SELECT clients.id
                  FROM clients
                  LEFT JOIN assigned_jobs_staff_view ajsv
                    ON  ajsv.client_id = clients.id
                    AND ajsv.staff_id  IN (${staffIds})
                 WHERE (
                         clients.staff_created_id IN (${staffIds})
                         OR ajsv.staff_id IS NOT NULL
                       )
                   AND clients.created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
                 GROUP BY clients.id
                 ORDER BY clients.id DESC`,
          params: [startDate, endDate],
        };

    // ── STAFF ─────────────────────────────────────────────────────────────────
    const staffQuery = isSuperAdmin
      ? {
          sql: `SELECT id
                  FROM staffs
                 WHERE created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
                 ORDER BY id DESC`,
          params: [startDate, endDate],
        }
      : {
          sql: `SELECT id
                  FROM staffs
                 WHERE created_by = ?
                   AND created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
                 ORDER BY id DESC`,
          params: [staff_id, startDate, endDate],
        };

    // ── JOB ───────────────────────────────────────────────────────────────────
    // FIX 1: Removed DATE() wrapping — use direct created_at range for index usage.
    // FIX 2: Removed unnecessary JOINs (clients, customers, master_status) for
    //        non-admin path. client filter now done via subquery; customers.status
    //        check removed (irrelevant for job count).
    // FIX 3: Removed JOIN staffs AS staffs4 — staff_created_id filter is enough.
    const jobQuery = RoleAccessJob
      ? {
          sql: `SELECT id, status_type
                  FROM jobs
                 WHERE created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
                 ORDER BY id DESC`,
          params: [startDate, endDate],
        }
      : {
          sql: `SELECT
                    jobs.id,
                    jobs.status_type
                  FROM jobs
                  LEFT JOIN assigned_jobs_staff_view ajsv
                    ON  ajsv.job_id = jobs.id
                    AND ajsv.staff_id IN (${LineManageStaffId})
                 WHERE (
                         ajsv.staff_id             IS NOT NULL
                         OR jobs.staff_created_id  IN (${LineManageStaffId})
                         OR jobs.client_id IN (
                               SELECT id
                                 FROM clients
                                WHERE staff_created_id IN (${LineManageStaffId})
                            )
                       )
                   AND jobs.created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
                   AND (
                         ajsv.source IS NULL
                         OR ajsv.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci
                         OR jobs.service_id = ajsv.service_id_assign
                       )
                 GROUP BY jobs.id
                 ORDER BY jobs.id DESC`,
          params: [startDate, endDate],
        };

    // ── Step 5: All 4 queries in parallel ────────────────────────────────────
    console.log("dashboard Time - before parallel queries -", new Date());

    const [
      [CustomerResult],
      [ClientResult],
      [StaffResult],
      [JobResult],
    ] = await Promise.all([
      pool.execute(customerQuery.sql, customerQuery.params),
      pool.execute(clientQuery.sql,   clientQuery.params),
      pool.execute(staffQuery.sql,    staffQuery.params),
      pool.execute(jobQuery.sql,      jobQuery.params),
    ]);

    console.log("dashboard Time - after parallel queries -", new Date());

    // ── Step 6: Result assembly ───────────────────────────────────────────────
    const toIds = (arr) => arr.map((r) => r.id).join(",");

    const pendingJobs   = JobResult.filter((r) => Number(r.status_type) !== 6);
    const completedJobs = JobResult.filter((r) => Number(r.status_type) === 6);

    const result = {
      customer: {
        count : CustomerResult.length,
        ids   : toIds(CustomerResult),
      },
      client: {
        count : ClientResult.length,
        ids   : toIds(ClientResult),
      },
      staff: {
        count : StaffResult.length,
        ids   : toIds(StaffResult),
      },
      job: {
        count : JobResult.length,
        ids   : toIds(JobResult),
      },
      pending_job: {
        count : pendingJobs.length,
        ids   : toIds(pendingJobs),
      },
      completed_job: {
        count : completedJobs.length,
        ids   : toIds(completedJobs),
      },
    };

    console.log("dashboard Time - END -", new Date());
    return { status: true, message: "success.", data: result };

  } catch (err) {
    console.error("Dashboard error:", err);
    return {
      status  : false,
      message : "Err Dashboard Data View Get",
      error   : err.message,
    };
  }
};

const getDashboardData = async (dashboard) => {
  const { staff_id, date_filter } = dashboard;

  console.time("dashboard_total");

  // ── Step 1: Parallel init ────────────────────────────────────────────────
  const [{ startDate, endDate }, LineManageStaffId, rowRoles] = await Promise.all([
    getDateRange(date_filter),
    LineManageStaffIdHelperFunction(staff_id),
    QueryRoleHelperFunction(staff_id),
  ]);

  if (!rowRoles.length) return { status: false, message: "Role not found." };

  const role_id      = rowRoles[0].role_id;
  const isSuperAdmin = rowRoles[0].role_name === "SUPERADMIN";
  const staffIds     = `${staff_id},${LineManageStaffId}`;

  // ── Step 2: Permissions ──────────────────────────────────────────────────
  const [rolePermissions] = await pool.execute(
    `SELECT permission_id FROM role_permissions
      WHERE role_id = ? AND permission_id IN (33,34,35)`,
    [role_id]
  );

  const permSet          = new Set(rolePermissions.map((r) => r.permission_id));
  const RoleAccessCustomer = isSuperAdmin || permSet.has(33);
  const RoleAccessClient   = isSuperAdmin || permSet.has(34);
  const RoleAccessJob      = isSuperAdmin || permSet.has(35);

  // ── Step 3: Query definitions (COUNT only, no ids unless needed) ─────────
  // 🔑 KEY OPTIMIZATION: SELECT COUNT(*) instead of SELECT id
  // ids assembling JS mein nahi hoga — DB se hi count lo
  // Agar ids zaroor chahiye toh alag endpoint banao

  const customerQuery = RoleAccessCustomer
    ? {
        sql: `SELECT COUNT(*) AS cnt FROM customers
               WHERE created_at BETWEEN ? AND ?`,
        params: [startDate, endDate],
      }
    :
     {
      sql: `SELECT COUNT(DISTINCT customers.id) AS cnt
                FROM customers
                LEFT JOIN assigned_jobs_staff_view ajsv
                  ON ajsv.customer_id = customers.id
                 AND ajsv.staff_id IN (${staffIds})
               WHERE (customers.staff_id IN (${staffIds}) OR ajsv.staff_id IS NOT NULL)
               AND customers.created_at BETWEEN ? AND ?`,
        params: [startDate, endDate],
      }
     
      ;

      console.log("customerQuery -", customerQuery.sql);
      console.log("params -", customerQuery.params);

  const clientQuery = RoleAccessClient
    ? {
        sql: `SELECT COUNT(*) AS cnt FROM clients
               WHERE created_at BETWEEN ? AND ?`,
        params: [startDate, endDate],
      }
    : 
      // {
      //   sql: `SELECT COUNT(DISTINCT clients.id) AS cnt
      //           FROM clients
      //           LEFT JOIN assigned_jobs_staff_view ajsv
      //             ON ajsv.client_id = clients.id
      //            AND ajsv.staff_id IN (${staffIds})
      //          WHERE (clients.staff_created_id IN (${staffIds}) OR ajsv.staff_id IS NOT NULL)
      //            AND clients.created_at BETWEEN ? AND ?`,
      //   params: [startDate, endDate],
      // }
      {
        sql: `SELECT COUNT(*) AS cnt FROM clients
               WHERE created_at BETWEEN ? AND ?`,
        params: [startDate, endDate],
      }
      ;

  const staffQuery = isSuperAdmin
    ? {
        sql: `SELECT COUNT(*) AS cnt FROM staffs
               WHERE created_at BETWEEN ? AND ?`,
        params: [startDate, endDate],
      }
    : {
        sql: `SELECT COUNT(*) AS cnt FROM staffs
               WHERE created_by = ?
                 AND created_at BETWEEN ? AND ?`,
        params: [staff_id, startDate, endDate],
      };

  // Job query — pending/completed ek hi query mein
  const jobQuery = RoleAccessJob
    ? {
        sql: `SELECT status_type, COUNT(*) AS cnt
                FROM jobs
               WHERE created_at BETWEEN ? AND ?
               GROUP BY status_type`,
        params: [startDate, endDate],
      }
    : 
    
    // {
    //     sql: `SELECT jobs.status_type, COUNT(DISTINCT jobs.id) AS cnt
    //             FROM jobs
    //             LEFT JOIN assigned_jobs_staff_view ajsv
    //               ON ajsv.job_id = jobs.id
    //              AND ajsv.staff_id IN (${LineManageStaffId})
    //            WHERE (
    //                    ajsv.staff_id IS NOT NULL
    //                    OR jobs.staff_created_id IN (${LineManageStaffId})
    //                    OR jobs.client_id IN (
    //                          SELECT id FROM clients
    //                           WHERE staff_created_id IN (${LineManageStaffId})
    //                       )
    //                  )
    //              AND jobs.created_at BETWEEN ? AND ?
    //              AND (
    //                    ajsv.source IS NULL
    //                    OR ajsv.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci
    //                    OR jobs.service_id = ajsv.service_id_assign
    //                  )
    //            GROUP BY jobs.status_type`,
    //     params: [startDate, endDate],
    //   }
    {
        sql: `SELECT status_type, COUNT(*) AS cnt
                FROM jobs
               WHERE created_at BETWEEN ? AND ?
               GROUP BY status_type`,
        params: [startDate, endDate],
      }
      ;

  try {
    console.time("parallel_queries");

    // ── Step 4: Parallel execution ──────────────────────────────────────────
    const [
      [custRows],
      [clientRows],
      [staffRows],
      [jobRows],
    ] = await Promise.all([
      pool.execute(customerQuery.sql, customerQuery.params),
      pool.execute(clientQuery.sql,   clientQuery.params),
      pool.execute(staffQuery.sql,    staffQuery.params),
      pool.execute(jobQuery.sql,      jobQuery.params),
    ]);

    console.timeEnd("parallel_queries");

    // ── Step 5: Assemble counts from GROUP BY rows ──────────────────────────
    const totalJobs     = jobRows.reduce((s, r) => s + Number(r.cnt), 0);
    const completedJobs = jobRows
      .filter((r) => Number(r.status_type) === 6)
      .reduce((s, r) => s + Number(r.cnt), 0);
    const pendingJobs   = totalJobs - completedJobs;

    const result = {
      customer     : { count: Number(custRows[0]?.cnt   ?? 0) },
      client       : { count: Number(clientRows[0]?.cnt ?? 0) },
      staff        : { count: Number(staffRows[0]?.cnt  ?? 0) },
      job          : { count: totalJobs },
      pending_job  : { count: pendingJobs },
      completed_job: { count: completedJobs },
    };

    console.timeEnd("dashboard_total");
    return { status: true, message: "success.", data: result };

  } catch (err) {
    console.error("Dashboard error:", err);
    return { status: false, message: "Err Dashboard Data View Get", error: err.message };
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
    limit = 50,
    export_all = false,
  } = dashboard;

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

    const hasFullLogAccess =
      rows.length > 0 &&
      ["SUPERADMIN", "ADMIN", "MANAGEMENT"].includes(rows[0].role_name);

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

        // ✅ This Quarter
        case "this_quarter": {
          const quarter = Math.floor(today.getMonth() / 3);
          startDate = new Date(today.getFullYear(), quarter * 3, 1);
          endDate = today;
          break;
        }

        // ✅ Last Quarter
        case "last_quarter": {
          const quarter = Math.floor(today.getMonth() / 3);
          startDate = new Date(today.getFullYear(), quarter * 3 - 3, 1);
          endDate = new Date(today.getFullYear(), quarter * 3, 0);
          break;
        }

        // ✅ This 6 Months
        case "this_six_month": {
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 5);
          endDate = today;
          break;
        }

        // ✅ This Year
        case "this_year": {
          startDate = new Date(today.getFullYear(), 0, 1);
          endDate = today;
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

    // Add staff filter for non-privileged users
    if (!hasFullLogAccess) {
      whereConditions.push("staff_logs.staff_id = ?");
      queryParams.push(staff_id);
    }

    // Add staff filter if specified
    if (filter_staff_id) {
      whereConditions.push("staff_logs.staff_id = ?");
      queryParams.push(filter_staff_id);
    }

    // Add date range filter
    if (startDate && endDate) {
      whereConditions.push("staff_logs.date BETWEEN ? AND ?");
      queryParams.push(startDate, endDate);
    }

    // Build WHERE clause
    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Add limit and offset to params (unless exporting all results)
    if (!export_all) {
      queryParams.push(limit, offset);
    }

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
      ${!export_all ? "LIMIT ? OFFSET ?" : ""}
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
    let { staff_id, ids, page, limit, search } = dashboard;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const cleane_ids = ids.replace(/^,+|,+$/g, "");

    const clientCodeExpr = `
      CONCAT(
        'cli_',
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(clients.client_code, 1, 15)
      )
    `;

    let searchCondition = "";
    let searchParams = [];

    if (search) {
      searchCondition = `
        AND (
          clients.trading_name LIKE ?
          OR customers.trading_name LIKE ?
          OR client_types.type LIKE ?
          OR client_contact_details.email LIKE ?
          OR ${clientCodeExpr} LIKE ?
          OR ? LIKE CONCAT('%', ${clientCodeExpr}, '%')
          OR CONCAT(staffs.first_name, ' ', staffs.last_name) LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        search,
        likeSearch,
      ];
    }

    const [countResult] = await pool.execute(
      `
      SELECT COUNT(DISTINCT clients.id) AS total
      FROM clients
      JOIN customers ON customers.id = clients.customer_id
      JOIN client_types ON client_types.id = clients.client_type
      JOIN staffs ON clients.staff_created_id = staffs.id
      LEFT JOIN client_contact_details ON client_contact_details.id = (
          SELECT MIN(cd.id)
          FROM client_contact_details cd
          WHERE cd.client_id = clients.id
      )
      WHERE clients.id IN (${cleane_ids})
      ${searchCondition}
      `,
      [...searchParams],
    );
    const total = countResult[0].total;

    const query = `
      SELECT  
          clients.id AS id,
          clients.trading_name AS client_name,
          customers.trading_name AS customer_name,
          clients.status AS status,
          client_types.type AS client_type_name,
          client_contact_details.email AS email,
          client_contact_details.phone_code AS phone_code,
          client_contact_details.phone AS phone,
          CONCAT(staffs.first_name,' ',staffs.last_name) AS client_created_by,
          DATE_FORMAT(clients.created_at, '%d/%m/%Y') AS created_at,
          ${clientCodeExpr} AS client_code
      FROM clients
      JOIN customers ON customers.id = clients.customer_id    
      JOIN client_types ON client_types.id = clients.client_type
      JOIN staffs ON clients.staff_created_id = staffs.id
      LEFT JOIN client_contact_details ON client_contact_details.id = (
          SELECT MIN(cd.id)
          FROM client_contact_details cd
          WHERE cd.client_id = clients.id
      )
      WHERE clients.id IN (${cleane_ids})
      ${searchCondition}
      ORDER BY clients.id DESC
      LIMIT ? OFFSET ?;
    `;

    const [result] = await pool.execute(query, [
      ...searchParams,
      limit,
      offset,
    ]);


    let finalResult = result;
    if (result.length > 0) {
      finalResult = await Promise.all(
        result.map(async (element) => {
          const Get_account_manger_id = `
            SELECT s.id,
                   CONCAT(s.first_name, ' ', s.last_name) AS full_name,
                   s.employee_number
            FROM staffs s
            JOIN customer_service_account_managers csam 
              ON s.id = csam.account_manager_id
            JOIN customer_services cs 
              ON csam.customer_service_id = cs.id
            WHERE cs.customer_id = ?
            AND cs.service_id = ?
            AND s.id != ?
          `;

          const [rowsAccountManager] = await pool.execute(
            Get_account_manger_id,
            [
              element.customer_id || 0,
              element.job_service_id || 0,
              element.account_manager_id || 0,
            ],
          );

          return {
            ...element,
            account_managers: rowsAccountManager,
          };
        }),
      );

      return {
        status: true,
        message: "success.",
        data: finalResult,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          search,
        },
      };
    } else {
      return {
        status: false,
        message: "No client found.",
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0, search },
      };
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
    let { staff_id, ids, page, limit, search } = dashboard;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const cleane_ids = ids.replace(/^,+|,+$/g, "");

    const customerCodeExpr = `
      CONCAT(
        'cust_',
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(customers.customer_code, 1, 15)
      )
    `;

    let searchCondition = "";
    let searchParams = [];

    if (search) {
      searchCondition = `
        AND (
          customers.trading_name LIKE ?
          OR customer_company_information.company_name LIKE ?
          OR ${customerCodeExpr} LIKE ?
          OR ? LIKE CONCAT('%', ${customerCodeExpr}, '%')
          OR CONCAT(staff2.first_name, ' ', staff2.last_name) LIKE ?
          OR staff1.employee_number LIKE ?
          OR CONCAT(staff1.first_name, ' ', staff1.last_name) LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [
        likeSearch,
        likeSearch,
        likeSearch,
        search,
        likeSearch,
        likeSearch,
        likeSearch,
      ];
    }

    const [countResult] = await pool.execute(
      `
      SELECT COUNT(DISTINCT customers.id) AS total
      FROM customers
      JOIN staffs AS staff1 ON customers.staff_id = staff1.id
      JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
      LEFT JOIN customer_company_information ON customers.id = customer_company_information.customer_id
      WHERE customers.id IN (${cleane_ids})
      ${searchCondition}
      `,
      [...searchParams],
    );
    const total = countResult[0].total;

    const query = `
      SELECT  
        customers.id AS id,
        customers.customer_type AS customer_type,
        customers.staff_id AS staff_id,
        customers.account_manager_id AS account_manager_id,
        staffs.employee_number AS employee_number,

        customers.trading_name AS trading_name,
        customers.trading_address AS trading_address,
        customers.vat_registered AS vat_registered,
        customers.vat_number AS vat_number,
        customers.website AS website,
        customers.form_process AS form_process,
        customers.updated_at AS updated_at,
        customers.status AS status,
        DATE_FORMAT(customers.created_at, '%d/%m/%Y') AS created_at,
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS customer_created_by,
        staff1.first_name AS staff_firstname, 
        staff1.last_name AS staff_lastname,
        staff2.first_name AS account_manager_firstname, 
        staff2.last_name AS account_manager_lastname,
        customer_company_information.company_name AS company_name,
        customer_company_information.company_number AS company_number,
        ${customerCodeExpr} AS customer_code
      FROM customers
      JOIN staffs AS staff1 ON customers.staff_id = staff1.id
      JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
      LEFT JOIN 
    staffs ON customers.staff_id = staffs.id
      LEFT JOIN customer_company_information ON customers.id = customer_company_information.customer_id
      WHERE customers.id IN (${cleane_ids})
      ${searchCondition}
      ORDER BY customers.id DESC
      LIMIT ? OFFSET ?;
    `;

    const [result] = await pool.execute(query, [
      ...searchParams,
      limit,
      offset,
    ]);


    let finalResult = result;
    if (result.length > 0) {
      finalResult = await Promise.all(
        result.map(async (element) => {
          const Get_account_manger_id = `
            SELECT s.id,
                   CONCAT(s.first_name, ' ', s.last_name) AS full_name,
                   s.employee_number
            FROM staffs s
            JOIN customer_service_account_managers csam 
              ON s.id = csam.account_manager_id
            JOIN customer_services cs 
              ON csam.customer_service_id = cs.id
            WHERE cs.customer_id = ?
            AND cs.service_id = ?
            AND s.id != ?
          `;

          const [rowsAccountManager] = await pool.execute(
            Get_account_manger_id,
            [
              element.customer_id || 0,
              element.job_service_id || 0,
              element.account_manager_id || 0,
            ],
          );

          return {
            ...element,
            account_managers: rowsAccountManager,
          };
        }),
      );

      return {
        status: true,
        message: "success.",
        data: finalResult,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          search,
        },
      };
    } else {
      return {
        status: false,
        message: "No customer found.",
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0, search },
      };
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
    let { staff_id, ids, page, limit, search } = dashboard;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const cleane_ids = ids.replace(/^,+|,+$/g, "");

    const jobCodeExpr = `
      CONCAT(
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(job_types.type, 1, 4), '_',
        SUBSTRING(jobs.job_id, 1, 15)
      )
    `;

    let searchCondition = "";
    let searchParams = [];

    if (search) {
      searchCondition = `
        AND (
          clients.trading_name LIKE ?
          OR customers.trading_name LIKE ?
          OR job_types.type LIKE ?
          OR jobs.client_job_code LIKE ?
          OR ${jobCodeExpr} LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
      ];
    }

    const [countResult] = await pool.execute(
      `
      SELECT COUNT(DISTINCT jobs.id) AS total
      FROM jobs
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      WHERE jobs.id IN (${cleane_ids})
      ${searchCondition}
      `,
      [...searchParams],
    );
    const total = countResult[0].total;

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
        jobs.job_priority AS job_priority,
        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        jobs.service_id AS job_service_id,
        staffs3.id AS account_manager_id,
        CONCAT(staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
        staffs3.employee_number AS account_manager_employee_number,
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,
        CONCAT(staffs4.first_name, ' ', staffs4.last_name) AS job_created_by,
        DATE_FORMAT(jobs.created_at, '%d/%m/%Y') AS created_at,
        master_status.name AS status,
        ${jobCodeExpr} AS job_code_id
      FROM jobs
      LEFT JOIN customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN services ON jobs.service_id = services.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      LEFT JOIN staffs AS staffs2 ON jobs.reviewer = staffs2.id
      LEFT JOIN staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
      LEFT JOIN staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
      LEFT JOIN master_status ON master_status.id = jobs.status_type
      WHERE jobs.id IN (${cleane_ids})
      ${searchCondition}
      ORDER BY jobs.id DESC
      LIMIT ? OFFSET ?;
    `;

    const [result] = await pool.execute(query, [
      ...searchParams,
      limit,
      offset,
    ]);


    let finalResult = result;
    if (result.length > 0) {
      finalResult = await Promise.all(
        result.map(async (element) => {
          const Get_account_manger_id = `
            SELECT s.id,
                   CONCAT(s.first_name, ' ', s.last_name) AS full_name,
                   s.employee_number
            FROM staffs s
            JOIN customer_service_account_managers csam 
              ON s.id = csam.account_manager_id
            JOIN customer_services cs 
              ON csam.customer_service_id = cs.id
            WHERE cs.customer_id = ?
            AND cs.service_id = ?
            AND s.id != ?
          `;

          const [rowsAccountManager] = await pool.execute(
            Get_account_manger_id,
            [
              element.customer_id || 0,
              element.job_service_id || 0,
              element.account_manager_id || 0,
            ],
          );

          return {
            ...element,
            account_managers: rowsAccountManager,
          };
        }),
      );

      return {
        status: true,
        message: "success.",
        data: finalResult,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          search,
        },
      };
    } else {
      return {
        status: false,
        message: "No customer found.",
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0, search },
      };
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
    let { staff_id, ids, page, limit, search } = dashboard;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const cleane_ids = ids.replace(/^,+|,+$/g, "");

    const jobCodeExpr = `
      CONCAT(
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(job_types.type, 1, 4), '_',
        SUBSTRING(jobs.job_id, 1, 15)
      )
    `;

    let searchCondition = "";
    let searchParams = [];

    if (search) {
      searchCondition = `
        AND (
          clients.trading_name LIKE ?
          OR customers.trading_name LIKE ?
          OR job_types.type LIKE ?
          OR jobs.client_job_code LIKE ?
          OR ${jobCodeExpr} LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
      ];
    }

    const [countResult] = await pool.execute(
      `
      SELECT COUNT(DISTINCT jobs.id) AS total
      FROM jobs
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      WHERE jobs.id IN (${cleane_ids})
      ${searchCondition}
      `,
      [...searchParams],
    );
    const total = countResult[0].total;

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
        jobs.job_priority AS job_priority,
        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
                customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        jobs.service_id AS job_service_id,
        staffs3.id AS account_manager_id,
        CONCAT(staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
        staffs3.employee_number AS account_manager_employee_number,
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,
        CONCAT(staffs4.first_name, ' ', staffs4.last_name) AS job_created_by,
        DATE_FORMAT(jobs.created_at, '%d/%m/%Y') AS created_at,
        master_status.name AS status,
        ${jobCodeExpr} AS job_code_id
      FROM jobs
      LEFT JOIN customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN services ON jobs.service_id = services.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      LEFT JOIN staffs AS staffs2 ON jobs.reviewer = staffs2.id
      LEFT JOIN staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
      LEFT JOIN staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
      LEFT JOIN master_status ON master_status.id = jobs.status_type
      WHERE jobs.id IN (${cleane_ids})
      ${searchCondition}
      ORDER BY jobs.id DESC
      LIMIT ? OFFSET ?;
    `;

    const [result] = await pool.execute(query, [
      ...searchParams,
      limit,
      offset,
    ]);


    let finalResult = result;
    if (result.length > 0) {
      finalResult = await Promise.all(
        result.map(async (element) => {
          const Get_account_manger_id = `
            SELECT s.id,
                   CONCAT(s.first_name, ' ', s.last_name) AS full_name,
                   s.employee_number
            FROM staffs s
            JOIN customer_service_account_managers csam 
              ON s.id = csam.account_manager_id
            JOIN customer_services cs 
              ON csam.customer_service_id = cs.id
            WHERE cs.customer_id = ?
            AND cs.service_id = ?
            AND s.id != ?
          `;

          const [rowsAccountManager] = await pool.execute(
            Get_account_manger_id,
            [
              element.customer_id || 0,
              element.job_service_id || 0,
              element.account_manager_id || 0,
            ],
          );

          return {
            ...element,
            account_managers: rowsAccountManager,
          };
        }),
      );

      return {
        status: true,
        message: "success.",
        data: finalResult,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          search,
        },
      };
    } else {
      return {
        status: false,
        message: "No customer found.",
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0, search },
      };
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
    let { staff_id, ids, page, limit, search } = dashboard;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const cleane_ids = ids.replace(/^,+|,+$/g, "");

    const jobCodeExpr = `
      CONCAT(
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(job_types.type, 1, 4), '_',
        SUBSTRING(jobs.job_id, 1, 15)
      )
    `;

    let searchCondition = "";
    let searchParams = [];

    if (search) {
      searchCondition = `
        AND (
          clients.trading_name LIKE ?
          OR customers.trading_name LIKE ?
          OR job_types.type LIKE ?
          OR jobs.client_job_code LIKE ?
          OR ${jobCodeExpr} LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
      ];
    }

    const [countResult] = await pool.execute(
      `
      SELECT COUNT(DISTINCT jobs.id) AS total
      FROM jobs
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      WHERE jobs.id IN (${cleane_ids})
      ${searchCondition}
      `,
      [...searchParams],
    );
    const total = countResult[0].total;

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
        jobs.job_priority AS job_priority,
        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
                customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        jobs.service_id AS job_service_id,
        staffs3.id AS account_manager_id,
        CONCAT(staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
        staffs3.employee_number AS account_manager_employee_number,
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,
        CONCAT(staffs4.first_name, ' ', staffs4.last_name) AS job_created_by,
        DATE_FORMAT(jobs.created_at, '%d/%m/%Y') AS created_at,
        master_status.name AS status,
        ${jobCodeExpr} AS job_code_id
      FROM jobs
      LEFT JOIN customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN services ON jobs.service_id = services.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      LEFT JOIN staffs AS staffs2 ON jobs.reviewer = staffs2.id
      LEFT JOIN staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
      LEFT JOIN staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
      LEFT JOIN master_status ON master_status.id = jobs.status_type
      WHERE jobs.id IN (${cleane_ids})
      ${searchCondition}
      ORDER BY jobs.id DESC
      LIMIT ? OFFSET ?;
    `;

    const [result] = await pool.execute(query, [
      ...searchParams,
      limit,
      offset,
    ]);


    let finalResult = result;
    if (result.length > 0) {
      finalResult = await Promise.all(
        result.map(async (element) => {
          const Get_account_manger_id = `
            SELECT s.id,
                   CONCAT(s.first_name, ' ', s.last_name) AS full_name,
                   s.employee_number
            FROM staffs s
            JOIN customer_service_account_managers csam 
              ON s.id = csam.account_manager_id
            JOIN customer_services cs 
              ON csam.customer_service_id = cs.id
            WHERE cs.customer_id = ?
            AND cs.service_id = ?
            AND s.id != ?
          `;

          const [rowsAccountManager] = await pool.execute(
            Get_account_manger_id,
            [
              element.customer_id || 0,
              element.job_service_id || 0,
              element.account_manager_id || 0,
            ],
          );

          return {
            ...element,
            account_managers: rowsAccountManager,
          };
        }),
      );

      return {
        status: true,
        message: "success.",
        data: finalResult,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          search,
        },
      };
    } else {
      return {
        status: false,
        message: "No customer found.",
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0, search },
      };
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
    let { staff_id, ids, page, limit, search } = dashboard;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const cleane_ids = ids.replace(/^,+|,+$/g, "");

    let searchCondition = "";
    let searchParams = [];

    if (search) {
      searchCondition = `
        AND (
          staffs.first_name LIKE ?
          OR staffs.last_name LIKE ?
          OR staffs.email LIKE ?
          OR roles.role_name LIKE ?
          OR CONCAT(staffs.first_name, ' ', staffs.last_name) LIKE ?
          OR ? LIKE CONCAT('%', staffs.first_name, ' ', staffs.last_name, '%')
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        search,
      ];
    }

    const [countResult] = await pool.execute(
      `
      SELECT COUNT(DISTINCT staffs.id) AS total
      FROM staffs
      JOIN roles ON staffs.role_id = roles.id
      WHERE staffs.id IN (${cleane_ids})
      ${searchCondition}
      `,
      [...searchParams],
    );
    const total = countResult[0].total;

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
         staffs.employee_number,
        roles.role_name,
                CONCAT(manager.first_name, ' ', manager.last_name) AS line_manager_name,
        roles.role 
      FROM staffs 
      JOIN roles ON staffs.role_id = roles.id
      LEFT JOIN line_managers lm ON lm.staff_by = staffs.id
      LEFT JOIN staffs manager ON manager.id = lm.staff_to

      WHERE staffs.id IN (${cleane_ids})
      ${searchCondition}
      ORDER BY staffs.id DESC
      LIMIT ? OFFSET ?;
    `;

    const [result] = await pool.execute(query, [
      ...searchParams,
      limit,
      offset,
    ]);

    if (result.length > 0) {
      return {
        status: true,
        message: "success.",
        data: result,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          search,
        },
      };
    } else {
      return {
        status: false,
        message: "No customer found.",
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0, search },
      };
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

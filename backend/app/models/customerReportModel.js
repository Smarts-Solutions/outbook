const pool = require("../config/database");
const {
  LineManageStaffIdHelperFunction,
  QueryRoleHelperFunction,
  getStaffAccessFilters,
} = require("../utils/helper");

const jobStatusReports = async (Report) => {
  const { StaffUserId, page = 1, limit = 10, search = "" } = Report;
  const offset = (page - 1) * limit;

  const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);

  const rows = await QueryRoleHelperFunction(StaffUserId);

  const jobCodeExpr = `
    CONCAT(
      SUBSTRING(customers.trading_name, 1, 3), '_',
      SUBSTRING(clients.trading_name, 1, 3), '_',
      SUBSTRING(job_types.type, 1, 4), '_',
      SUBSTRING(jobs.job_id, 1, 15)
    )
  `;

  let searchQuery = "";
  let searchValues = [];

  if (search) {
    searchQuery = `
      AND (
        customers.trading_name LIKE ?
        OR clients.trading_name LIKE ?
        OR job_types.type LIKE ?
        OR services.name LIKE ?
        OR staffs.first_name LIKE ?
        OR staffs.last_name LIKE ?
        OR jobs.job_id LIKE ?
        OR ${jobCodeExpr} LIKE ?
      )
    `;
    const s = `%${search}%`;
    searchValues = Array(8).fill(s);
  }

  try {
    const [RoleAccess] = await pool.execute(
      "SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 35],
    );

    const isSuperAdmin =
      rows.length > 0 &&
      (rows[0].role_name === "SUPERADMIN" || RoleAccess.length > 0);

    const baseSelect = `
      SELECT 
        jobs.id AS id,
        jobs.service_id AS job_service_id,
        jobs.job_priority AS job_priority,

        jobs.Year_Ending_id_1 AS Year_Ending_id_1,
        jobs.Tax_Year_id_4 AS Tax_Year_id_4,
        jobs.Payroll_Frequency_id_3 AS Payroll_Frequency_id_3,
        jobs.Payroll_Week_Year_id_3 AS Payroll_Week_Year_id_3,
        jobs.Payroll_Week_Month_id_3 AS Payroll_Week_Month_id_3,
        jobs.Payroll_Week_id_3 AS Payroll_Week_id_3,
        jobs.Payroll_Month_Year_id_3 AS Payroll_Month_Year_id_3,
        jobs.Payroll_Month_id_3 AS Payroll_Month_id_3,
        jobs.Payroll_Fortnight_Year_id_3 AS Payroll_Fortnight_Year_id_3,
        jobs.Payroll_Fortnight_Month_id_3 AS Payroll_Fortnight_Month_id_3,
        jobs.Payroll_Fortnight_id_3 AS Payroll_Fortnight_id_3,
        jobs.Payroll_Quarter_Year_id_3 AS Payroll_Quarter_Year_id_3,
        jobs.Payroll_Quarter_id_3 AS Payroll_Quarter_id_3,
        jobs.Payroll_Year_id_3 AS Payroll_Year_id_3,
       
        jobs.Bookkeeping_Frequency_id_2 AS Bookkeeping_Frequency_id_2,
        jobs.Day_Date_id_2 AS Day_Date_id_2,
        jobs.Week_Year_id_2 AS Week_Year_id_2,
        jobs.Week_Month_id_2 AS Week_Month_id_2,
        jobs.Week_id_2 AS Week_id_2,
        jobs.Fortnight_Year_id_2 AS Fortnight_Year_id_2,
        jobs.Fortnight_Month_id_2 AS Fortnight_Month_id_2,
        jobs.Fortnight_id_2 AS Fortnight_id_2,
        jobs.Month_Year_id_2 AS Month_Year_id_2,
        jobs.Month_id_2 AS Month_id_2,
        jobs.Quarter_Year_id_2 AS Quarter_Year_id_2,
        jobs.Quarter_id_2 AS Quarter_id_2,
        jobs.Year_id_2 AS Year_id_2,
        jobs.Other_FromDate_id_2 AS Other_FromDate_id_2,
        jobs.Other_ToDate_id_2 AS Other_ToDate_id_2,
        



        ${jobCodeExpr} AS job_code_id,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        clients.id AS client_id,
        clients.trading_name AS client_trading_name,
        staffs3.id AS account_manager_id,
        CONCAT(staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
          staffs3.employee_number AS account_manager_employee_number,
        services.id AS service_id,
        services.name AS service_name,
        job_types.id AS job_type_id,
        job_types.type AS job_type_name,
        master_status.name AS status,
        staffs2.id AS reviewer_id,
        CONCAT(staffs2.first_name, ' ', staffs2.last_name) AS reviewer_name,
        staffs.id AS allocated_id,
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS allocated_name,
        DATE_FORMAT(jobs.filing_Companies_date, '%Y-%m-%d') AS filing_Companies_date,
        DATE_FORMAT(jobs.internal_deadline_date, '%Y-%m-%d') AS internal_deadline_date,
        DATE_FORMAT(jobs.customer_deadline_date, '%Y-%m-%d') AS customer_deadline_date,
        DATE_FORMAT(queries.query_sent_date, '%Y-%m-%d') AS query_sent_date,
        DATE_FORMAT(queries.final_query_response_received_date, '%Y-%m-%d') AS final_query_response_received_date,
        DATE_FORMAT(drafts.draft_sent_on, '%Y-%m-%d') AS draft_sent_on,
        DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on,
        DATE_FORMAT(jobs.created_at, '%Y-%m-%d') AS job_received_on,
        staff_list.multiple_staff_names
      FROM jobs
      LEFT JOIN (
            SELECT 
                jas.job_id,
                GROUP_CONCAT(
                    DISTINCT CONCAT(s.first_name, ' ', s.last_name)
                    SEPARATOR ', '
                ) AS multiple_staff_names
            FROM job_allowed_staffs jas
            JOIN staffs s ON s.id = jas.staff_id
            GROUP BY jas.job_id
        ) staff_list ON staff_list.job_id = jobs.id
      LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN services ON jobs.service_id = services.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      LEFT JOIN staffs AS staffs2 ON jobs.reviewer = staffs2.id
      LEFT JOIN staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
      LEFT JOIN master_status ON master_status.id = jobs.status_type
      LEFT JOIN queries ON queries.job_id = jobs.id
      LEFT JOIN drafts ON drafts.job_id = jobs.id
    `;

    if (isSuperAdmin) {
      const dataQuery = `
        ${baseSelect}
        WHERE 1=1
        ${searchQuery}
        GROUP BY jobs.id
        ORDER BY jobs.id DESC
        LIMIT ? OFFSET ?
      `;

      let [rowsData] = await pool.execute(dataQuery, [
        ...searchValues,
        Number(limit),
        Number(offset),
      ]);

      // console.log("rowsData", rowsData[0])

      const countQuery = `
        SELECT COUNT(DISTINCT jobs.id) AS total
        FROM jobs
        LEFT JOIN customers ON jobs.customer_id = customers.id
        LEFT JOIN clients ON jobs.client_id = clients.id
        LEFT JOIN job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN services ON jobs.service_id = services.id
        LEFT JOIN staffs ON jobs.allocated_to = staffs.id
        WHERE 1=1
        ${searchQuery}
      `;

      const [[{ total }]] = await pool.execute(countQuery, searchValues);

      if (rowsData && rowsData.length > 0) {
        rowsData = await Promise.all(
          rowsData.map(async (element, index) => {
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
                element.customer_id,
                element.service_id,
                element.account_manager_id,
              ],
            );

            return {
              ...element,
              account_managers: rowsAccountManager,
            };
          }),
        );
      }

      return {
        status: true,
        message: "Success.",
        data: { rows: rowsData, total },
      };
    }

    const dataQuery = `
      ${baseSelect}
      WHERE(
        (
          (assigned_jobs_staff_view.staff_id IN (${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId}))
          AND (assigned_jobs_staff_view.source IS NULL OR assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci OR jobs.service_id = assigned_jobs_staff_view.service_id_assign)
        )
        OR customers.staff_id IN (${LineManageStaffId})
        OR customers.account_manager_id IN (${LineManageStaffId})
        OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
        OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
       )
      AND customers.status = '1'    
      ${searchQuery}
      GROUP BY jobs.id
      ORDER BY jobs.id DESC
      LIMIT ? OFFSET ?
    `;

        let [rowsData] = await pool.execute(dataQuery, [
            ...searchValues,
            Number(limit),
            Number(offset),
        ]);

    const countQuery = `
      SELECT COUNT(DISTINCT jobs.id) AS total
      FROM jobs
      LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN services ON jobs.service_id = services.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      WHERE(
        (
          (assigned_jobs_staff_view.staff_id IN (${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId}))
          AND (assigned_jobs_staff_view.source IS NULL OR assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci OR jobs.service_id = assigned_jobs_staff_view.service_id_assign)
        )
        OR customers.staff_id IN (${LineManageStaffId})
        OR customers.account_manager_id IN (${LineManageStaffId})
        OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
        OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
       )
      AND customers.status = '1' 
      ${searchQuery}
    `;

    const [[{ total }]] = await pool.execute(countQuery, searchValues);

        if (rowsData && rowsData.length > 0) {

            rowsData = await Promise.all(
                rowsData.map(async (element, index) => {


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
                        [element.customer_id, element.service_id, element.account_manager_id]
                    );

                    return {
                        ...element,
                        account_managers: rowsAccountManager
                    };

                })
            );

        }


        return {
            status: true,
            message: "Success.",
            data: { rows: rowsData, total },
        };


    } catch (error) {
        console.log("error ", error);
        return { status: false, message: "Error getting job status report." };
    }
};

const jobSummaryReports = async (Report) => {
  const { StaffUserId } = Report;

  // Line Manager
  const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);

  // Get Role
  const rows = await QueryRoleHelperFunction(StaffUserId);

  try {
    const [RoleAccess] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 35],
    );
    if (
      rows.length > 0 &&
      (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)
    ) {
      const query = `
        SELECT 
        master_status.name AS job_status,
        master_status.name AS job_status,
        COUNT(jobs.status_type) AS number_of_job,
        GROUP_CONCAT(jobs.id) AS job_ids
        FROM 
            jobs
        LEFT JOIN 
            master_status ON master_status.id = jobs.status_type
        GROUP BY 
            master_status.name, jobs.status_type
         `;
      const [result] = await pool.execute(query);
      return { status: true, message: "Success.", data: result };
    }

    const query = `
        SELECT 
        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id,

        master_status.name AS job_status,
        jobs.id AS job_id
        FROM 
            jobs
        LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
          customers ON jobs.customer_id = customers.id
        LEFT JOIN 
          clients ON jobs.client_id = clients.id
        LEFT JOIN 
            master_status ON master_status.id = jobs.status_type
        WHERE (
            (
             (assigned_jobs_staff_view.staff_id IN (${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId}))
             AND (assigned_jobs_staff_view.source IS NULL OR assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci OR jobs.service_id = assigned_jobs_staff_view.service_id_assign)
            )
            OR customers.staff_id IN (${LineManageStaffId})
            OR customers.account_manager_id IN (${LineManageStaffId})
            OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
            OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
        )
        GROUP BY jobs.id;
         `;

    const [result] = await pool.execute(query);

    const filtered = result?.filter((item) => {
      if (item.assigned_source === "assign_customer_service") {
        return item.service_id_assign === item.job_service_id;
      }
      return true;
    });

    const grouped = Object.values(
      filtered.reduce((acc, item) => {
        const key = item.job_status;
        if (!acc[key]) {
          acc[key] = {
            job_status: key,
            number_of_job: 0,
            job_ids: [],
          };
        }
        acc[key].number_of_job += 1;
        acc[key].job_ids.push(item.job_id);
        return acc;
      }, {}),
    );

    grouped.forEach((obj) => {
      obj.job_ids = obj.job_ids.join(",");
    });

    return { status: true, message: "Success.", data: grouped };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job status report." };
  }
};

const jobPendingReports = async (Report) => {
  const { StaffUserId } = Report;

  // Line Manager
  const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);

  // Get Role
  const rows = await QueryRoleHelperFunction(StaffUserId);

  try {
    const [RoleAccess] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 35],
    );

    if (
      rows.length > 0 &&
      (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)
    ) {
      const query = `
       SELECT 
        master_status.name AS job_status,
        job_types.type AS job_type_name,
        COUNT(jobs.status_type) AS number_of_job,
        GROUP_CONCAT(jobs.id) AS job_ids
        FROM 
            jobs
        LEFT JOIN 
            master_status ON master_status.id = jobs.status_type
        JOIN 
            job_types ON jobs.job_type_id = job_types.id
        WHERE 
        jobs.status_type != 6 
        GROUP BY 
            master_status.name, jobs.status_type
         `;
      const [result] = await pool.execute(query);
      return { status: true, message: "Success.", data: result };
    }

    const query = `
        SELECT 
        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id,

        master_status.name AS job_status,
        jobs.id AS job_id
        FROM 
            jobs
        LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
          customers ON jobs.customer_id = customers.id
        LEFT JOIN 
          clients ON jobs.client_id = clients.id
        LEFT JOIN 
            master_status ON master_status.id = jobs.status_type
        WHERE (
            (
             (assigned_jobs_staff_view.staff_id IN (${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId}))
             AND (assigned_jobs_staff_view.source IS NULL OR assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci OR jobs.service_id = assigned_jobs_staff_view.service_id_assign)
            )
            OR customers.staff_id IN (${LineManageStaffId})
            OR customers.account_manager_id IN (${LineManageStaffId})
            OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
            OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
        )
        AND jobs.status_type != 6
        GROUP BY jobs.id;
         `;

    const [result] = await pool.execute(query);

    const filtered = result?.filter((item) => {
      if (item.assigned_source === "assign_customer_service") {
        return item.service_id_assign === item.job_service_id;
      }
      return true;
    });

    const grouped = Object.values(
      filtered.reduce((acc, item) => {
        const key = item.job_status;
        if (!acc[key]) {
          acc[key] = {
            job_status: key,
            number_of_job: 0,
            job_ids: [],
          };
        }
        acc[key].number_of_job += 1;
        acc[key].job_ids.push(item.job_id);
        return acc;
      }, {}),
    );

    grouped.forEach((obj) => {
      obj.job_ids = obj.job_ids.join(",");
    });

    return { status: true, message: "Success.", data: grouped };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job status report." };
  }
};

const getCustomWeekNumber = (day) => {
  if (day >= 1 && day <= 7) return 1;
  if (day >= 8 && day <= 14) return 2;
  if (day >= 15 && day <= 21) return 3;
  if (day >= 22) return 4;
  return 0;
};

const jobReceivedSentReports = async (Report) => {
  const { StaffUserId } = Report;

  // Line Manager
  const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);

  // Get Role
  const rows = await QueryRoleHelperFunction(StaffUserId);

  try {
    const [RoleAccess] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 35],
    );

    let weeklyRows = [];
    if (
      rows.length > 0 &&
      (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)
    ) {
      const weeklyQuery = `
            SELECT 
            DATE_FORMAT(jobs.created_at, '%M') AS month_name,
            DAY(jobs.created_at) AS day,
            COUNT(DISTINCT jobs.id) AS job_received,
            COUNT(drafts.job_id) AS draft_count,
            GROUP_CONCAT(DISTINCT jobs.id ORDER BY jobs.id) AS job_ids
        FROM 
            jobs
        LEFT JOIN 
            drafts ON drafts.job_id = jobs.id    
        WHERE 
            YEAR(jobs.created_at) = YEAR(CURDATE())
        GROUP BY 
            month_name, DAY(jobs.created_at)
        ORDER BY 
            MONTH(jobs.created_at), DAY(jobs.created_at);;
                `;
      const [weeklyData] = await pool.execute(weeklyQuery);
      weeklyRows = weeklyData;
    } else {
      const weeklyQuery = `
            SELECT
            assigned_jobs_staff_view.source AS assigned_source,
            assigned_jobs_staff_view.service_id_assign AS service_id_assign,
            jobs.service_id AS job_service_id,

            DATE_FORMAT(jobs.created_at, '%M') AS month_name,
            DAY(jobs.created_at) AS day,
            COUNT(DISTINCT jobs.id) AS job_received,
            COUNT(drafts.job_id) AS draft_count,
            GROUP_CONCAT(DISTINCT jobs.id ORDER BY jobs.id) AS job_ids
        FROM 
            jobs
        LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
          customers ON jobs.customer_id = customers.id
        LEFT JOIN 
          clients ON jobs.client_id = clients.id      
        LEFT JOIN 
            drafts ON drafts.job_id = jobs.id    
        WHERE (
            (
             (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId}))
             AND (assigned_jobs_staff_view.source IS NULL OR assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci OR jobs.service_id = assigned_jobs_staff_view.service_id_assign)
            )
            OR customers.staff_id IN (${LineManageStaffId})
            OR customers.account_manager_id IN (${LineManageStaffId})
            OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
            OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
        )
        AND YEAR(jobs.created_at) = YEAR(CURDATE())
        GROUP BY 
            month_name, DAY(jobs.created_at)
        ORDER BY 
            MONTH(jobs.created_at), DAY(jobs.created_at);;
                `;
      const [weeklyData] = await pool.execute(weeklyQuery);

      let isExistAssignCustomer = weeklyData?.find(
        (item) => item?.assigned_source === "assign_customer_service",
      );
      if (isExistAssignCustomer != undefined) {
        let matched = weeklyData?.filter(
          (item) =>
            item?.assigned_source === "assign_customer_service" &&
            Number(item?.service_id_assign) === Number(item?.job_service_id),
        );
        let matched2 = weeklyData?.filter(
          (item) => item?.assigned_source !== "assign_customer_service",
        );
        const resultAssignCustomer = [...matched, ...matched2];
        weeklyRows = resultAssignCustomer;
      } else {
        weeklyRows = weeklyData;
      }
    }

    const monthlyData = {};
    weeklyRows?.forEach((entry) => {
      const { month_name, day, job_received, draft_count, job_ids } = entry;
      const week_number = getCustomWeekNumber(day);

      if (!monthlyData[month_name]) {
        monthlyData[month_name] = {
          month_name,
          job_received: 0,
          draft_count: 0,
          job_ids: [],
          weeks: Array.from({ length: 4 }, (_, i) => ({
            week_number: i + 1,
            job_received: 0,
            draft_count: 0,
            job_ids: "",
          })),
        };
      }

      monthlyData[month_name].job_received += job_received;
      monthlyData[month_name].draft_count += draft_count;
      monthlyData[month_name].job_ids.push(...job_ids.split(","));

      const weekEntry = monthlyData[month_name].weeks[week_number - 1];
      weekEntry.job_received += job_received;
      weekEntry.draft_count += draft_count;
      weekEntry.job_ids += weekEntry.job_ids ? "," + job_ids : job_ids;
    });

    const result = Object.values(monthlyData).map((month) => {
      return {
        month_name: month.month_name,
        job_received: month.job_received,
        draft_count: month.draft_count,
        job_ids: [...new Set(month.job_ids)].join(","),
        week: month.weeks.map((week) => ({
          week_number: week.week_number,
          job_received: week.job_received,
          draft_count: week.draft_count,
          job_ids: week.job_ids,
        })),
      };
    });

    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return {
      status: false,
      message: "Error getting monthly and weekly job count.",
    };
  }
};

const dueByReport = async (Report) => {
  const { StaffUserId } = Report;

  // Line Manager
  const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);

  // Get Role
  const rows = await QueryRoleHelperFunction(StaffUserId);

  try {
    const [RoleAccess] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 33],
    );

    const monthsRange = 12;

    let query = `
        SELECT
        customers.id AS customer_id,
        customers.trading_name AS customer_name,
        `;

    let dueConditions = [];
    for (let i = 1; i <= monthsRange; i++) {
      dueConditions.push(`
        JSON_OBJECT(
            'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL ${i - 1} MONTH) AND DATE_ADD(CURDATE(), INTERVAL ${i} MONTH) THEN 1 END),
            'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL ${i - 1} MONTH) AND DATE_ADD(CURDATE(), INTERVAL ${i} MONTH) THEN jobs.id END)
        ) AS due_within_${i}_months
    `);
    }

    dueConditions.push(`
            JSON_OBJECT(
                'count', COUNT(CASE WHEN jobs.due_on < CURDATE() THEN 1 END),
                'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on < CURDATE() THEN jobs.id END)
            ) AS due_passed
        `);

    query += dueConditions.join(",\n");

    if (
      rows.length > 0 &&
      (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)
    ) {
      query += `
            FROM customers
            LEFT JOIN jobs ON jobs.customer_id = customers.id
          `;
    } else {
      query += `
        FROM 
            customers
        LEFT JOIN 
            jobs ON jobs.customer_id = customers.id
        LEFT JOIN 
            assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
        WHERE 
            (assigned_jobs_staff_view.staff_id IN (${LineManageStaffId}) 
             OR jobs.staff_created_id IN(${LineManageStaffId}) 
             OR customers.staff_id IN (${LineManageStaffId}) 
             OR customers.account_manager_id IN (${LineManageStaffId})
             OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
             OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
            )
            AND customers.status = '1' 
         `;
    }

    query += `
            GROUP BY customers.id
            ORDER BY customers.id ASC;
        `;
    const [result] = await pool.execute(query);

    const formattedResult = result.map((row) => {
      const weeksData = {};
      for (let i = 1; i <= monthsRange; i++) {
        weeksData[`due_within_${i}_months`] =
          row[`due_within_${i}_months`] || 0;
      }

      return {
        customer_id: row.customer_id,
        customer_name: row.customer_name,
        ...weeksData,
        due_passed: {
          count: row.due_passed ? row.due_passed.count : 0,
          job_ids: row.due_passed ? row.due_passed.job_ids : "",
        },
      };
    });

    return { status: true, message: "Success.", data: formattedResult };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job dueByReport." };
  }
};

const teamMonthlyReports = async (Report) => {
  const { StaffUserId } = Report;

  // Line Manager
  const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);

  // Get Role
  const rows = await QueryRoleHelperFunction(StaffUserId);

  try {
    const [RoleAccess] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 35],
    );

    if (
      rows.length > 0 &&
      (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)
    ) {
      const query = `
       SELECT 
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS staff_name,
        COALESCE(SUM(CASE WHEN jobs.status_type = 6 THEN 1 ELSE 0 END), 0) AS number_of_job_completed,
        GROUP_CONCAT(jobs.id) AS job_ids
        FROM 
            staffs
        INNER JOIN 
            jobs ON jobs.staff_created_id = staffs.id
        WHERE 
        MONTH(jobs.created_at) = MONTH(CURRENT_DATE)
        GROUP BY 
            staffs.id
         `;
      const [result] = await pool.execute(query);
      return { status: true, message: "Success.", data: result };
    }

    // Other Role Data
    const query = `
       SELECT 
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS staff_name,
        COALESCE(SUM(CASE WHEN jobs.status_type = 6 THEN 1 ELSE 0 END), 0) AS number_of_job_completed,
        GROUP_CONCAT(jobs.id) AS job_ids
        FROM 
            staffs
        INNER JOIN 
            jobs ON jobs.staff_created_id = staffs.id
        LEFT JOIN 
            customers ON jobs.customer_id = customers.id
        LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id    
        WHERE
        (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) 
         OR jobs.staff_created_id IN(${LineManageStaffId}) 
         OR clients.staff_created_id IN(${LineManageStaffId})
         OR customers.staff_id IN (${LineManageStaffId})
         OR customers.account_manager_id IN (${LineManageStaffId})
         OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
         OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
        ) AND
        MONTH(jobs.created_at) = MONTH(CURRENT_DATE)
        GROUP BY 
            staffs.id
         `;

    const [result] = await pool.execute(query);

    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job status report." };
  }
};

const taxWeeklyStatusReport = async (Report) => {
  try {
    const {
      StaffUserId,
      customer_id,
      job_status_type_id,
      processor_id,
      reviewer_id,
    } = Report;

    // Helpers
    const LineManageStaffId =
      await LineManageStaffIdHelperFunction(StaffUserId);
    const rows = await QueryRoleHelperFunction(StaffUserId);
    const { customerCondition, clientCondition, jobCondition } = await getStaffAccessFilters(StaffUserId);

    const currentYear = new Date().getFullYear();

    const [RoleAccess] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 33],
    );

    let query = `
      SELECT
        master_status.name AS job_status,
        customers.trading_name AS customer_name,
        YEARWEEK(jobs.created_at, 1) AS year_week,
        COUNT(jobs.id) AS job_count,
        GROUP_CONCAT(jobs.id) AS job_ids
      FROM jobs
      INNER JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN master_status ON master_status.id = jobs.status_type
      WHERE YEAR(jobs.created_at) = ?
    `;

    const params = [currentYear];

    // ✅ Apply access filters for non-admins
    if (!(rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
        query += ` AND ${customerCondition.replace(/customer_id/g, "customers.id")} `;
        query += ` AND ${clientCondition.replace(/id/g, "clients.id")} `;
        query += ` AND ${jobCondition.replace(/id/g, "jobs.id")} `;
    }

    // 🔍 Dynamic filters
    if (customer_id) {
      query += ` AND customers.id = ?`;
      params.push(customer_id);
    }
    if (job_status_type_id) {
      query += ` AND jobs.status_type = ?`;
      params.push(job_status_type_id);
    } else {
      query += ` AND jobs.status_type = 6`; // default
    }
    if (processor_id) {
      query += ` AND jobs.allocated_to = ?`;
      params.push(processor_id);
    }
    if (reviewer_id) {
      query += ` AND jobs.reviewer = ?`;
      params.push(reviewer_id);
    }

    query += `
      GROUP BY customers.id, master_status.id, year_week
      ORDER BY customers.id, year_week
    `;

    const [rowsData] = await pool.execute(query, params);

    // 🧾 Format Result (same as old structure)
    const formattedResult = [];
    const grouped = {};

    for (const row of rowsData) {
      const weekNum = parseInt(row.year_week.toString().slice(-2));
      const key = `${row.customer_name}_${row.job_status}`;

      if (!grouped[key]) {
        grouped[key] = {
          job_status: row.job_status,
          job_type_name: "", // compatibility
          customer_name: row.customer_name,
          weeks: [{}],
          Grand_Total: { count: 0, job_ids: "" },
        };

        // Initialize 53 weeks
        const weeksData = {};
        for (let i = 1; i <= 53; i++) {
          weeksData[`WE_${i}_${currentYear}`] = { count: 0, job_ids: "" };
        }
        grouped[key].weeks[0] = weeksData;
      }

      // --- Parse and merge unique job IDs ---
      const existingWeek =
        grouped[key].weeks[0][`WE_${weekNum}_${currentYear}`];
      const existingIds = existingWeek.job_ids
        ? existingWeek.job_ids
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id)
        : [];

      const newIds = row.job_ids
        ? row.job_ids
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id)
        : [];

      // Combine and keep unique job IDs
      const uniqueIds = [...new Set([...existingIds, ...newIds])];

      // Update week data
      grouped[key].weeks[0][`WE_${weekNum}_${currentYear}`] = {
        count: uniqueIds.length, // ✅ count based on unique IDs
        job_ids: uniqueIds.join(","),
      };

      // --- Update Grand Total (unique across all weeks) ---
      const existingTotalIds = grouped[key].Grand_Total.job_ids
        ? grouped[key].Grand_Total.job_ids
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id)
        : [];

      const totalUniqueIds = [...new Set([...existingTotalIds, ...newIds])];

      grouped[key].Grand_Total = {
        count: totalUniqueIds.length,
        job_ids: totalUniqueIds.join(","),
      };
    }

    // push to final array
    for (const key in grouped) {
      formattedResult.push(grouped[key]);
    }

    return { status: true, message: "Success.", data: formattedResult };
  } catch (error) {
    console.error("error ", error);
    return {
      status: false,
      message: "Error getting tax status weekly report.",
    };
  }
};

const taxWeeklyStatusReportFilterKey = async (Report) => {
  const { StaffUserId } = Report;
  try {
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);
    const rows = await QueryRoleHelperFunction(StaffUserId);

    const [RoleAccess] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 33],
    );

    let customer = [];
    let custumerData = [];

    const { assignedCustomerIds } = await getStaffAccessFilters(StaffUserId);

    if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
      const queryCustomer = `
        SELECT customers.id AS customer_id, customers.trading_name AS customer_name
        FROM customers   
        ORDER BY customers.trading_name ASC;
       `;
      const [data] = await pool.execute(queryCustomer);
      custumerData = data;
    } else {
        if (assignedCustomerIds.length > 0) {
            const queryCustomer = `
                SELECT id AS customer_id, trading_name AS customer_name
                FROM customers
                WHERE id IN (${assignedCustomerIds.join(',')})
                ORDER BY trading_name ASC;
            `;
            const [data] = await pool.execute(queryCustomer);
            custumerData = data;
        } else {
            custumerData = [];
        }
    }

    if (custumerData.length > 0) {
      customer = custumerData.map((row) => ({
        customer_id: row.customer_id,
        customer_name: row.customer_name,
      }));
    }

    const queryReviewer = `
         SELECT staffs.id AS reviewer_id, staffs.first_name AS reviewer_first_name, staffs.last_name AS reviewer_last_name
        FROM staffs
        JOIN roles ON staffs.role_id = roles.id
        WHERE (staffs.role_id = 6 || staffs.role_id = 4) AND staffs.status = '1'  
        ORDER BY staffs.first_name ASC;
       `;
    const [rows1] = await pool.execute(queryReviewer);
    let reviewer = [];
    if (rows1.length > 0) {
      reviewer = rows1.map((row) => ({
        reviewer_id: row.reviewer_id,
        reviewer_name: row.reviewer_first_name + " " + row.reviewer_last_name,
      }));
    }

    const queryProcessor = `
         SELECT staffs.id AS staff_id, staffs.first_name AS staff_first_name, staffs.last_name AS staff_last_name
        FROM staffs
        JOIN roles ON staffs.role_id = roles.id
        WHERE (staffs.role_id = 3 || staffs.role_id = 4) AND staffs.status = '1'   
        ORDER BY staffs.first_name ASC;
       `;
    const [rows2] = await pool.execute(queryProcessor);
    let processor = [];
    if (rows2.length > 0) {
      processor = rows2.map((row) => ({
        processor_id: row.staff_id,
        processor_name: row.staff_first_name + " " + row.staff_last_name,
      }));
    }

    const queryJobStatusType = `
       SELECT master_status.id AS job_status_type_id, master_status.name AS job_status_type_name
      FROM master_status
      ORDER BY master_status.name ASC;
     `;
    const [rows3] = await pool.execute(queryJobStatusType);
    let job_status_type = [];
    if (rows3.length > 0) {
      job_status_type = rows3.map((row) => ({
        job_status_type_id: row.job_status_type_id,
        job_status_type_name: row.job_status_type_name,
      }));
    }

    return {
      status: true,
      message: "success.",
      data: {
        customer: customer,
        reviewer: reviewer,
        processor: processor,
        job_status_type: job_status_type,
      },
    };
  } catch (err) {
    return { status: false, message: "Err Customer Get" };
  }
};

const averageTatReport = async (Report) => {
  const { StaffUserId } = Report;
  // Line Manager
  const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);
  // Get Role
  const rows = await QueryRoleHelperFunction(StaffUserId);

  try {
    const [RoleAccess] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 35],
    );

    let where = [];

    if (
      rows.length > 0 &&
      (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)
    ) {
      where.push(`jobs.status_type = 6`);
    } else {
      where.push(`(assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) 
            OR jobs.staff_created_id IN(${LineManageStaffId}) 
            OR clients.staff_created_id IN(${LineManageStaffId})
            OR customers.staff_id IN (${LineManageStaffId})
            OR customers.account_manager_id IN (${LineManageStaffId})
            OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
            OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
            ) AND
            jobs.status_type = 6`);
    }
    where = `WHERE ${where.join(" AND ")}`;

    const query = `
        SELECT
            CASE 
                WHEN MONTH(jobs.created_at) = MONTH(CURDATE()) AND YEAR(jobs.created_at) = YEAR(CURDATE()) THEN 'Current'
                ELSE DATE_FORMAT(jobs.created_at, '%b %Y')
            END AS month,
            AVG(DATEDIFF(jobs.updated_at, jobs.created_at)) / DAY(LAST_DAY(jobs.created_at)) AS average_tat_per_day,
            GROUP_CONCAT(jobs.id ORDER BY jobs.created_at) AS job_ids
        FROM
            jobs
        LEFT JOIN 
            customers ON jobs.customer_id = customers.id
        LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id    
        ${where}
        GROUP BY
            YEAR(jobs.created_at),
            MONTH(jobs.created_at)
            ORDER BY
            jobs.created_at DESC
       `;

    const [result] = await pool.execute(query);
    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job status report." };
  }
};

const reportCountJob = async (Report) => {
  const { StaffUserId, job_ids, page = 1, limit = 10, search = "" } = Report;
  const offset = (page - 1) * (Number(limit) || 10);

  const cleaneJob_ids = job_ids ? job_ids.replace(/^,+|,+$/g, "") : "";

  if (!cleaneJob_ids) {
    return {
      status: true,
      message: "No jobs found.",
      data: {
        data: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          limit: limit,
        },
      },
    };
  }

  // Line Manager
  const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);

  // Get Role
  const rows = await QueryRoleHelperFunction(StaffUserId);

  const jobCodeExpr = `
    CONCAT(
      SUBSTRING(customers.trading_name, 1, 3), '_',
      SUBSTRING(clients.trading_name, 1, 3), '_',
      SUBSTRING(job_types.type, 1, 4), '_',
      SUBSTRING(jobs.job_id, 1, 15)
    )
  `;

  let searchQuery = "";
  let searchValues = [];

  if (search) {
    searchQuery = `
      AND (
        customers.trading_name LIKE ?
        OR clients.trading_name LIKE ?
        OR job_types.type LIKE ?
        OR services.name LIKE ?
        OR staffs.first_name LIKE ?
        OR staffs.last_name LIKE ?
        OR jobs.job_id LIKE ?
        OR ${jobCodeExpr} LIKE ?
      )
    `;
    const s = `%${search}%`;
    searchValues = Array(8).fill(s);
  }

  try {
    const [RoleAccess] = await pool.execute(
      "SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?",
      [rows[0].role_id, 35],
    );

    const isSuperAdmin =
      rows.length > 0 &&
      (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0);

    const baseSelect = `
        SELECT 
        jobs.id AS job_id,
        jobs.service_id AS job_service_id,
        job_types.type AS job_type_name,
        jobs.status_type AS status_type,
        jobs.job_priority AS job_priority,
        jobs.client_job_code AS client_job_code,

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

        CONCAT(staffs.first_name, ' ', staffs.last_name) AS allocated_name,

        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,

        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
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
        master_status ON master_status.id = jobs.status_type    
        LEFT JOIN staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
      `;

    if (isSuperAdmin) {
      const dataQuery = `
        ${baseSelect}
        WHERE jobs.id IN (${cleaneJob_ids})
        ${searchQuery}
        GROUP BY jobs.id
        ORDER BY jobs.id DESC
        LIMIT ? OFFSET ?
      `;

      let [rowsData] = await pool.execute(dataQuery, [
        ...searchValues,
        Number(limit),
        Number(offset),
      ]);

      const countQuery = `
        SELECT COUNT(DISTINCT jobs.id) AS total
        FROM jobs
        LEFT JOIN clients ON jobs.client_id = clients.id
        LEFT JOIN customers ON jobs.customer_id = customers.id
        LEFT JOIN job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN services ON jobs.service_id = services.id
        LEFT JOIN staffs ON jobs.allocated_to = staffs.id
        WHERE jobs.id IN (${cleaneJob_ids})
        ${searchQuery}
      `;

      const [[{ total }]] = await pool.execute(countQuery, searchValues);

      let finalRowsData = rowsData;
      if (rowsData && rowsData.length > 0) {
        finalRowsData = await Promise.all(
          rowsData.map(async (element) => {
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
      }

      return {
        status: true,
        message: "Success.",
        data: {
          data: finalRowsData,
          pagination: {
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit: limit,
          },
        },
      };
    }

    // Other Role Data
    const dataQuery = `
      ${baseSelect}
      LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
      WHERE jobs.id IN (${cleaneJob_ids})
      AND (
        (
          (assigned_jobs_staff_view.staff_id IN (${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId}))
          AND (assigned_jobs_staff_view.source IS NULL OR assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci OR jobs.service_id = assigned_jobs_staff_view.service_id_assign)
        )
        OR customers.staff_id IN (${LineManageStaffId})
        OR customers.account_manager_id IN (${LineManageStaffId})
        OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
        OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
       )
      AND customers.status = '1'    
      ${searchQuery}
      GROUP BY jobs.id
      ORDER BY jobs.id DESC
      LIMIT ? OFFSET ?
    `;

    const [rowsData] = await pool.execute(dataQuery, [
      ...searchValues,
      Number(limit),
      Number(offset),
    ]);

    const countQuery = `
      SELECT COUNT(DISTINCT jobs.id) AS total
      FROM jobs
      LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN services ON jobs.service_id = services.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      WHERE jobs.id IN (${cleaneJob_ids})
      AND (
        (
          (assigned_jobs_staff_view.staff_id IN (${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId}))
          AND (assigned_jobs_staff_view.source IS NULL OR assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci OR jobs.service_id = assigned_jobs_staff_view.service_id_assign)
        )
        OR customers.staff_id IN (${LineManageStaffId})
        OR customers.account_manager_id IN (${LineManageStaffId})
        OR customers.id IN (SELECT customer_id FROM customer_access WHERE staff_id IN (${LineManageStaffId}))
        OR customers.id IN (SELECT customer_id FROM staff_portfolio WHERE staff_id IN (${LineManageStaffId}))
       )
      AND customers.status = '1' 
      ${searchQuery}
    `;

    const [[{ total }]] = await pool.execute(countQuery, searchValues);

    let finalRowsData = rowsData;
    if (rowsData && rowsData.length > 0) {
      finalRowsData = await Promise.all(
        rowsData.map(async (element) => {
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
    }

    return {
      status: true,
      message: "Success.",
      data: {
        data: finalRowsData,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit: limit,
        },
      },
    };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting report count job." };
  }
};

const missingTimesheetReport = async (Report) => {
  const { StaffUserId } = Report;
  const rows = await QueryRoleHelperFunction(StaffUserId);

  async function getAllLineManageStaffIds(staff_id) {
    const allStaffIds = new Set();
    const queue = [staff_id];
    while (queue.length > 0) {
      const currentId = queue.shift();
      if (!allStaffIds.has(currentId)) {
        allStaffIds.add(currentId);
        const [rows] = await pool.execute(
          `SELECT staff_to FROM line_managers WHERE staff_by = ?`,
          [currentId],
        );
        const subordinates = rows.map((row) => row.staff_to);
        queue.push(...subordinates);
      }
    }
    return Array.from(allStaffIds);
  }

  const LineManageStaffId = await getAllLineManageStaffIds(StaffUserId);

  let where = [];
  if (rows.length > 0 && rows[0].role_name == "SUPERADMIN") {
    where.push(`ts.submit_status = '0' OR ts.submit_status IS NULL`);
  } else {
    where.push(
      `(ts.submit_status = '0' OR ts.submit_status IS NULL) AND st.id IN (${LineManageStaffId})`,
    );
  }

  const whereClause = `WHERE ${where.join(" AND ")}`;
  const query = `
            SELECT 
            CONCAT(st.first_name, ' ', st.last_name) AS staff_fullname,
            st.email AS staff_email,
            st.id AS staff_id,
            COALESCE(ts.submit_status, 0) AS submit_status,
            COALESCE(
            DATE_FORMAT(ts.monday_date, '%Y-%m-%d'),
            DATE_FORMAT(ts.tuesday_date, '%Y-%m-%d'),
            DATE_FORMAT(ts.wednesday_date, '%Y-%m-%d'),
            DATE_FORMAT(ts.thursday_date, '%Y-%m-%d'),
            DATE_FORMAT(ts.friday_date, '%Y-%m-%d'),
            DATE_FORMAT(ts.saturday_date, '%Y-%m-%d'),
            DATE_FORMAT(ts.sunday_date, '%Y-%m-%d')
            ) AS week_date
        FROM staffs st
        LEFT JOIN timesheet ts 
            ON st.id = ts.staff_id
        AND YEARWEEK(
                COALESCE(
                ts.monday_date,
                ts.tuesday_date,
                ts.wednesday_date,
                ts.thursday_date,
                ts.friday_date,
                ts.saturday_date,
                ts.sunday_date
                ), 1
            ) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
        ${whereClause} 
        GROUP BY st.id
        ORDER BY st.first_name ASC
    `;

  try {
    const [result] = await pool.execute(query);
    return { status: true, message: "Success.", data: { result } };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting missing timesheet report." };
  }
};

const discrepancyReport = async (Report) => {
  let { StaffUserId } = Report;
  const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);
  const rows = await QueryRoleHelperFunction(StaffUserId);

  let query = `
        SELECT 
            jobs.id AS job_id,
            CONCAT(
                SUBSTRING(customers.trading_name, 1, 3), '_',
                SUBSTRING(clients.trading_name, 1, 3), '_',
                SUBSTRING(job_types.type, 1, 4), '_',
                SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id,
            jobs.total_time AS job_total_time,
            SUM(
                COALESCE(CAST(REPLACE(timesheet.monday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
                COALESCE(CAST(REPLACE(timesheet.tuesday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
                COALESCE(CAST(REPLACE(timesheet.wednesday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
                COALESCE(CAST(REPLACE(timesheet.thursday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
                COALESCE(CAST(REPLACE(timesheet.friday_hours, ':', '.') AS DECIMAL(10,2)), 0)
            ) AS total_spent_hours
        FROM timesheet
        JOIN jobs ON (timesheet.task_type = '2' AND timesheet.job_id = jobs.id)
        JOIN staffs ON staffs.id = timesheet.staff_id
        JOIN roles ON roles.id = staffs.role_id
        JOIN customers ON customers.id = jobs.customer_id
        JOIN clients ON clients.id = jobs.client_id
        JOIN job_types ON jobs.job_type_id = job_types.id
    `;

  if (rows.length > 0 && rows[0].role_name == "SUPERADMIN") {
    // Allow access to all data
  } else {
    query += ` WHERE timesheet.staff_id IN (${LineManageStaffId})`;
  }

  query += ` GROUP BY jobs.id, job_code_id, jobs.total_time`;

  try {
    const [result] = await pool.execute(query);
    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting discrepancy report." };
  }
};

module.exports = {
  jobStatusReports,
  jobSummaryReports,
  jobPendingReports,
  jobReceivedSentReports,
  dueByReport,
  teamMonthlyReports,
  taxWeeklyStatusReport,
  taxWeeklyStatusReportFilterKey,
  averageTatReport,
  reportCountJob,
  missingTimesheetReport,
  discrepancyReport
};

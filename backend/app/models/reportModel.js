const { response } = require('express');
const pool = require('../config/database');
const { SatffLogUpdateOperation, LineManageStaffIdHelperFunction,
    QueryRoleHelperFunction } = require('../utils/helper');

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
      [rows[0].role_id, 35]
    );

    const isSuperAdmin =
      rows.length > 0 &&
      (rows[0].role_name === "SUPERADMIN" || RoleAccess.length > 0);

    const baseSelect = `
      SELECT 
        jobs.id AS id,
        jobs.service_id AS job_service_id,
        jobs.job_priority AS job_priority,
        ${jobCodeExpr} AS job_code_id,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        clients.id AS client_id,
        clients.trading_name AS client_trading_name,
        staffs3.id AS account_manager_id,
        CONCAT(staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
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

      const [rowsData] = await pool.execute(dataQuery, [
        ...searchValues,
        Number(limit),
        Number(offset),
      ]);

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
         assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
         OR jobs.staff_created_id IN(${LineManageStaffId})
         OR clients.staff_created_id IN(${LineManageStaffId}))
         AND (
            assigned_jobs_staff_view.source != 'assign_customer_service'
            OR jobs.service_id = assigned_jobs_staff_view.service_id_assign
          )
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
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN services ON jobs.service_id = services.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      WHERE(
        (   
         assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
         OR jobs.staff_created_id IN(${LineManageStaffId})
         OR clients.staff_created_id IN(${LineManageStaffId}))
         AND (
            assigned_jobs_staff_view.source != 'assign_customer_service'
            OR jobs.service_id = assigned_jobs_staff_view.service_id_assign
          )
       )
      AND customers.status = '1' 
      ${searchQuery}
    `;

    const [[{ total }]] = await pool.execute(countQuery, searchValues);

    return {
      status: true,
      message: "Success.",
      data: { rows: rowsData, total },
    };

    // const query = `
    //     SELECT 
    //         jobs.id AS id,
    //         jobs.service_id AS job_service_id,
    //         jobs.job_priority AS job_priority,

    //         CONCAT(
    //             SUBSTRING(customers.trading_name, 1, 3), '_',
    //             SUBSTRING(clients.trading_name, 1, 3), '_',
    //             SUBSTRING(job_types.type, 1, 4), '_',
    //             SUBSTRING(jobs.job_id, 1, 15)
    //         ) AS job_code_id,

    //         customers.id AS customer_id,
    //         customers.trading_name AS customer_trading_name,

    //         clients.id AS client_id,
    //         clients.trading_name AS client_trading_name,

    //         staffs3.id AS account_manager_id,
    //         CONCAT(staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,

    //         services.id AS service_id,
    //         services.name AS service_name,

    //         job_types.id AS job_type_id,
    //         job_types.type AS job_type_name,

    //         master_status.name AS status,

    //         staffs2.id AS reviewer_id,
    //         CONCAT(staffs2.first_name, ' ', staffs2.last_name) AS reviewer_name,

    //         staffs.id AS allocated_id,
    //         CONCAT(staffs.first_name, ' ', staffs.last_name) AS allocated_name,

    //         DATE_FORMAT(jobs.filing_Companies_date, '%Y-%m-%d') AS filing_Companies_date,
    //         DATE_FORMAT(jobs.internal_deadline_date, '%Y-%m-%d') AS internal_deadline_date,
    //         DATE_FORMAT(jobs.customer_deadline_date, '%Y-%m-%d') AS customer_deadline_date,
    //         DATE_FORMAT(queries.query_sent_date, '%Y-%m-%d') AS query_sent_date,
    //         DATE_FORMAT(queries.final_query_response_received_date, '%Y-%m-%d') AS final_query_response_received_date,
    //         DATE_FORMAT(drafts.draft_sent_on, '%Y-%m-%d') AS draft_sent_on,
    //         DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on,
    //         DATE_FORMAT(jobs.created_at, '%Y-%m-%d') AS job_received_on,

    //         staff_list.multiple_staff_names

    //     FROM jobs

    //     /* ✅ Staff list subquery (UNIQUE + FAST) */
    //     LEFT JOIN (
    //         SELECT 
    //             jas.job_id,
    //             GROUP_CONCAT(
    //                 DISTINCT CONCAT(s.first_name, ' ', s.last_name)
    //                 SEPARATOR ', '
    //             ) AS multiple_staff_names
    //         FROM job_allowed_staffs jas
    //         JOIN staffs s ON s.id = jas.staff_id
    //         GROUP BY jas.job_id
    //     ) staff_list ON staff_list.job_id = jobs.id

    //     LEFT JOIN assigned_jobs_staff_view 
    //         ON assigned_jobs_staff_view.job_id = jobs.id

    //     LEFT JOIN clients 
    //         ON jobs.client_id = clients.id

    //     LEFT JOIN customers 
    //         ON jobs.customer_id = customers.id

    //     LEFT JOIN job_types 
    //         ON jobs.job_type_id = job_types.id

    //     LEFT JOIN services 
    //         ON jobs.service_id = services.id

    //     LEFT JOIN staffs 
    //         ON jobs.allocated_to = staffs.id

    //     LEFT JOIN staffs AS staffs2 
    //         ON jobs.reviewer = staffs2.id

    //     LEFT JOIN staffs AS staffs3 
    //         ON jobs.account_manager_id = staffs3.id

    //     LEFT JOIN master_status 
    //         ON master_status.id = jobs.status_type

    //     LEFT JOIN queries 
    //         ON queries.job_id = jobs.id

    //     LEFT JOIN drafts 
    //         ON drafts.job_id = jobs.id

    //     WHERE
    //     (
    //         assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
    //         OR jobs.staff_created_id IN (${LineManageStaffId})
    //         OR clients.staff_created_id IN (${LineManageStaffId})
    //     )
    //     AND (
    //         assigned_jobs_staff_view.source != 'assign_customer_service'
    //         OR jobs.service_id = assigned_jobs_staff_view.service_id_assign
    //     )
    //     AND customers.status = '1'

    //     GROUP BY jobs.id
    //     ORDER BY jobs.id DESC;
    //             `

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
}

const jobReceivedSentReports = async (Report) => {
    const { StaffUserId } = Report;

    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    try {

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 35]);

        let weeklyRows = [];
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
            const weeklyQuery = `
            SELECT 
            DATE_FORMAT(jobs.created_at, '%M') AS month_name,
            DAY(jobs.created_at) AS day,
            COUNT(DISTINCT jobs.id) AS job_received,  -- Count distinct jobs
            COUNT(drafts.job_id) AS draft_count,
            GROUP_CONCAT(DISTINCT jobs.id ORDER BY jobs.id) AS job_ids  -- Concatenate distinct job IDs
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
            COUNT(DISTINCT jobs.id) AS job_received,  -- Count distinct jobs
            COUNT(drafts.job_id) AS draft_count,
            GROUP_CONCAT(DISTINCT jobs.id ORDER BY jobs.id) AS job_ids  -- Concatenate distinct job IDs
        FROM 
            jobs
        LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id      
        LEFT JOIN 
            drafts ON drafts.job_id = jobs.id    
        WHERE
            (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId}))
            AND YEAR(jobs.created_at) = YEAR(CURDATE())
        GROUP BY 
            month_name, DAY(jobs.created_at)
        ORDER BY 
            MONTH(jobs.created_at), DAY(jobs.created_at);;
                `;
            const [weeklyData] = await pool.execute(weeklyQuery);

            // console.log("weeklyData", weeklyData);

            //////-----START Assign Customer Service Data START----////////
            let isExistAssignCustomer = weeklyData?.find(item => item?.assigned_source === 'assign_customer_service');
            if (isExistAssignCustomer != undefined) {
                let matched = weeklyData?.filter(item =>
                    item?.assigned_source === 'assign_customer_service' &&
                    Number(item?.service_id_assign) === Number(item?.job_service_id)
                )
                let matched2 = weeklyData?.filter(item =>
                    item?.assigned_source !== 'assign_customer_service'
                )
                const resultAssignCustomer = [...matched, ...matched2]
                weeklyRows = resultAssignCustomer;

            }
            //////-----END Assign Customer Service Data END----////////
            else {
                weeklyRows = weeklyData;
            }

        }




        // Create a mapping for each month
        const monthlyData = {};
        // Populate the monthlyData object with weekly data
        weeklyRows?.forEach(entry => {
            const { month_name, day, job_received, draft_count, job_ids } = entry;
            const week_number = getCustomWeekNumber(day);

            // Initialize month entry if it doesn't exist
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
                        job_ids: ""
                    }))
                };
            }

            // Accumulate monthly counts
            monthlyData[month_name].job_received += job_received;
            monthlyData[month_name].draft_count += draft_count;
            monthlyData[month_name].job_ids.push(...job_ids.split(','));

            // Add job counts to the corresponding week
            const weekEntry = monthlyData[month_name].weeks[week_number - 1]; // week_number is 1-based
            weekEntry.job_received += job_received;
            weekEntry.draft_count += draft_count;
            weekEntry.job_ids += weekEntry.job_ids ? ',' + job_ids : job_ids; // Concatenate job IDs
        });
        // Create the final result with unique job IDs
        const result = Object.values(monthlyData).map(month => {
            return {
                month_name: month.month_name,
                job_received: month.job_received,
                draft_count: month.draft_count,
                job_ids: [...new Set(month.job_ids)].join(','), // Unique job IDs
                week: month.weeks.map(week => ({
                    week_number: week.week_number,
                    job_received: week.job_received,
                    draft_count: week.draft_count,
                    job_ids: week.job_ids
                }))
            };
        });

        //console.log("result", result);
        return { status: true, message: 'Success.', data: result };

    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting monthly and weekly job count.' };
    }


}

const jobSummaryReports = async (Report) => {
    const { StaffUserId } = Report;

    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    try {
        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 35]);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
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
            return { status: true, message: 'Success.', data: result };
        }

        // Other Role Data
        // const query = `
        // SELECT 

        // assigned_jobs_staff_view.source AS assigned_source,
        // assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        // jobs.service_id AS job_service_id,

        // master_status.name AS job_status,

        // -- COUNT(jobs.status_type) AS number_of_job 
        // COUNT(DISTINCT jobs.id) AS number_of_job,
        // GROUP_CONCAT(DISTINCT jobs.id) AS job_ids
        // FROM 
        //     jobs
        //  JOIN 
        //   assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id 
        //    AND COALESCE(assigned_jobs_staff_view.service_id_assign, 0) = COALESCE(jobs.service_id, 0)
        //  JOIN 
        // clients ON jobs.client_id = clients.id    
        //  JOIN 
        //     master_status ON master_status.id = jobs.status_type
        // WHERE 
        //     assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})
        // GROUP BY 
        //     master_status.name, jobs.status_type
        //  `;

        //  const [result] = await pool.execute(query);

        //////-----START Assign Customer Service Data START----////////
        // let isExistAssignCustomer = result?.find(item => item?.assigned_source === 'assign_customer_service');
        // if (isExistAssignCustomer != undefined) {
        //     let matched = result?.filter(item =>
        //         item?.assigned_source === 'assign_customer_service' &&
        //         Number(item?.service_id_assign) === Number(item?.job_service_id)
        //     )
        //     let matched2 = result?.filter(item =>
        //         item?.assigned_source !== 'assign_customer_service'
        //     )
        //     const resultAssignCustomer = [...matched, ...matched2]
        //     return { status: true, message: "Success.", data: resultAssignCustomer };
        // }
        // //////-----END Assign Customer Service Data END----////////

        // return { status: true, message: 'Success.', data: result };



        const query = `
        SELECT 
        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id,

        master_status.name AS job_status,
        jobs.id AS job_id
        FROM
            jobs
         JOIN
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
         JOIN
        clients ON jobs.client_id = clients.id
         JOIN
            master_status ON master_status.id = jobs.status_type
        WHERE 
            assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})
        GROUP BY jobs.id;
         `;

        // console.log("query", query);
        const [result] = await pool.execute(query);

        const filtered = result?.filter(item => {
            if (item.assigned_source === "assign_customer_service") {
                return item.service_id_assign === item.job_service_id;
            }
            return true;
        });

        // Step 2: Group only by job_status
        const grouped = Object.values(
            filtered.reduce((acc, item) => {
                const key = item.job_status; // only job_status as key
                if (!acc[key]) {
                    acc[key] = {
                        job_status: key,
                        number_of_job: 0,
                        job_ids: []
                    };
                }
                acc[key].number_of_job += 1;
                acc[key].job_ids.push(item.job_id);
                return acc;
            }, {})
        );

        grouped.forEach(obj => {
            obj.job_ids = obj.job_ids.join(",");
        });

        return { status: true, message: 'Success.', data: grouped };


    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}

const jobPendingReports = async (Report) => {
    const { StaffUserId } = Report;

    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    try {

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 35]);

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {

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
            return { status: true, message: 'Success.', data: result };
        }

        // Other Role Data

        //     const query = `
        //    SELECT 
        //     master_status.name AS job_status,
        //     job_types.type AS job_type_name,
        //     COUNT(jobs.status_type) AS number_of_job,
        //     GROUP_CONCAT(jobs.id) AS job_ids
        //     FROM 
        //         jobs
        //     LEFT JOIN 
        //       assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        //     LEFT JOIN 
        //     clients ON jobs.client_id = clients.id    
        //     LEFT JOIN 
        //         master_status ON master_status.id = jobs.status_type
        //     JOIN 
        //         job_types ON jobs.job_type_id = job_types.id
        //     WHERE
        // (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})) 
        // AND jobs.status_type != 6 
        //     GROUP BY 
        //         master_status.name, jobs.status_type
        //      `;
        //     const [result] = await pool.execute(query);
        //     return { status: true, message: 'Success.', data: result };

        const query = `
        SELECT 
        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id,

        master_status.name AS job_status,
        jobs.id AS job_id
        FROM
            jobs
         JOIN
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
         JOIN
        clients ON jobs.client_id = clients.id
         JOIN
            master_status ON master_status.id = jobs.status_type
        WHERE 
        (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})) 
        AND jobs.status_type != 6
        GROUP BY jobs.id;
         `;

        // console.log("query", query);
        const [result] = await pool.execute(query);

        const filtered = result?.filter(item => {
            if (item.assigned_source === "assign_customer_service") {
                return item.service_id_assign === item.job_service_id;
            }
            return true;
        });

        // Step 2: Group only by job_status
        const grouped = Object.values(
            filtered.reduce((acc, item) => {
                const key = item.job_status; // only job_status as key
                if (!acc[key]) {
                    acc[key] = {
                        job_status: key,
                        number_of_job: 0,
                        job_ids: []
                    };
                }
                acc[key].number_of_job += 1;
                acc[key].job_ids.push(item.job_id);
                return acc;
            }, {})
        );

        grouped.forEach(obj => {
            obj.job_ids = obj.job_ids.join(",");
        });

        return { status: true, message: 'Success.', data: grouped };



    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}

const teamMonthlyReports = async (Report) => {
    const { StaffUserId } = Report;

    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    try {
        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 35]);

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
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
            return { status: true, message: 'Success.', data: result };
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
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id    
        WHERE
        (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})) AND
        MONTH(jobs.created_at) = MONTH(CURRENT_DATE)
        GROUP BY 
            staffs.id
         `;

        const [result] = await pool.execute(query);

        // console.log("result -- ", result);

        return { status: true, message: 'Success.', data: result };

    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}

const dueByReport = async (Report) => {
    const { StaffUserId } = Report;

    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    try {

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

        const monthsRange = 12;

        // Start building the query
        let query = `
        SELECT
        customers.id AS customer_id,
        customers.trading_name AS customer_name,
        `;

        // Dynamically create the time period logic for due dates
        let dueConditions = [];
        for (let i = 1; i <= monthsRange; i++) {
            dueConditions.push(`
        JSON_OBJECT(
            'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL ${i - 1} MONTH) AND DATE_ADD(CURDATE(), INTERVAL ${i} MONTH) THEN 1 END),
            'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL ${i - 1} MONTH) AND DATE_ADD(CURDATE(), INTERVAL ${i} MONTH) THEN jobs.id END)
        ) AS due_within_${i}_months
    `);
        }

        // Add the "due passed" condition for jobs that are past due
        dueConditions.push(`
            JSON_OBJECT(
                'count', COUNT(CASE WHEN jobs.due_on < CURDATE() THEN 1 END),
                'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on < CURDATE() THEN jobs.id END)
            ) AS due_passed
        `);

        // Add the dynamically generated due conditions to the query
        query += dueConditions.join(",\n");

        // Continue the query with the FROM and JOIN clauses

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
            query += `
            FROM customers
            LEFT JOIN jobs ON jobs.customer_id = customers.id
          `;

        } else {
            query += `
            FROM customers
            LEFT JOIN jobs ON jobs.customer_id = customers.id
            LEFT JOIN
            assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
            WHERE 
              customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
           `;
        }


        // Final GROUP BY and ORDER BY clauses
        query += `
            GROUP BY customers.id
            ORDER BY customers.id ASC;
        `;
        // Now you can execute the query using your database connection
        const [result] = await pool.execute(query);

        const formattedResult = result.map(row => {
            const weeksData = {};
            for (let i = 1; i <= monthsRange; i++) {
                weeksData[`due_within_${i}_months`] =
                    row[`due_within_${i}_months`] || 0
            }

            return {
                customer_id: row.customer_id,
                customer_name: row.customer_name,
                ...weeksData,
                due_passed: {
                    count: row.due_passed ? row.due_passed.count : 0,
                    job_ids: row.due_passed ? row.due_passed.job_ids : ""
                }
            };
        });

        return { status: true, message: 'Success.', data: formattedResult };

    } catch (error) {

        console.log("error ", error);
        return { status: false, message: 'Error getting job dueByReport.' };
    }
}

const reportCountJob = async (Report) => {
    const { StaffUserId, job_ids } = Report;
    const cleaneJob_ids = job_ids.replace(/^,+|,+$/g, '');

    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    try {

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 35]);

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
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

        CONCAT(staffs.first_name, ' ', staffs.last_name) AS allocated_name,

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
        master_status ON master_status.id = jobs.status_type    
        WHERE jobs.id IN (`+ cleaneJob_ids + `) 
        GROUP BY jobs.id
        ORDER BY
        jobs.id DESC;
        `;
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };

        }

        // Other Role Data

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

        CONCAT(staffs.first_name, ' ', staffs.last_name) AS allocated_name,

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
        assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
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
        WHERE 
        (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId}))
        AND jobs.id IN (`+ cleaneJob_ids + `)
        GROUP BY jobs.id
        ORDER BY
        jobs.id DESC;
        `;
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success.', data: result };


    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job dueByReport.' };
    }
}

function getWeekNumber(date) {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.ceil((dayOfYear + 1) / 7);
}

// const taxWeeklyStatusReport = async (Report) => {
//     try {
//         const { StaffUserId, customer_id, job_status_type_id, processor_id, reviewer_id } = Report;

//         // Line Manager
//         const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

//         // Get Role
//         const rows = await QueryRoleHelperFunction(StaffUserId)


//         const currentYear = new Date().getFullYear();
//         const startDate = new Date(currentYear, 0, 1);
//         const endDate = new Date(currentYear, 11, 31);
//         let weeks = [];
//         let currentDate = new Date(startDate);
//         while (currentDate <= endDate) {
//             const weekNum = getWeekNumber(currentDate);
//             const yearWeek = `${currentDate.getFullYear()}${String(weekNum).padStart(2, '0')}`;
//             weeks.push(`COUNT(CASE WHEN YEARWEEK(jobs.created_at, 1) = ${yearWeek} THEN jobs.id END) AS WE_${weekNum}_${currentDate.getFullYear()}`);
//             weeks.push(`GROUP_CONCAT(CASE WHEN YEARWEEK(jobs.created_at, 1) = ${yearWeek} THEN jobs.id END) AS job_ids_${weekNum}_${currentDate.getFullYear()}`);
//             currentDate.setDate(currentDate.getDate() + 7);
//         }
//         const weeks_sql = weeks.join(",\n    ");



//         const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

//         let query = `
//             SELECT
//                 master_status.name AS job_status,
//                 customers.trading_name AS customer_name,
//                 ${weeks_sql},
//                 GROUP_CONCAT(jobs.id) AS job_ids,
//                 COUNT(jobs.id) AS Grand_Total
//             FROM 
//                 customers
//             LEFT JOIN 
//                 assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
//              `;


//         if (job_status_type_id != undefined && job_status_type_id != "") {
//             query += `
//                 LEFT JOIN 
//                 jobs ON jobs.customer_id = customers.id AND jobs.status_type = ${job_status_type_id}
//                 LEFT JOIN 
//                 master_status ON master_status.id = jobs.status_type`;
//         } else {
//             query += `
//                 LEFT JOIN 
//                 jobs ON jobs.customer_id = customers.id AND jobs.status_type = 6
//                 LEFT JOIN 
//                 master_status ON master_status.id = jobs.status_type`;
//         }

//         let conditions = [];

//         if (customer_id != undefined && customer_id != "") {
//             conditions.push(`customers.id = ${customer_id}`);
//         }

//         if (processor_id != undefined && processor_id != "") {
//             conditions.push(`jobs.allocated_to = ${processor_id}`);
//         }

//         if (reviewer_id != undefined && reviewer_id != "") {
//             conditions.push(`jobs.reviewer = ${reviewer_id}`);
//         }


//         if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
//             if (conditions.length > 0) {
//                 query += ` WHERE ${conditions.join(" AND ")}`;
//             }
//         } else {
//             if (conditions.length > 0) {
//                 query += ` WHERE (customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})) AND
//              ${conditions.join(" AND ")}`;
//             } else {
//                 query += ` WHERE customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})`;
//             }

//         }


//         // if (conditions.length > 0) {
//         //     query += ` WHERE ${conditions.join(" AND ")}`;
//         // }

//         query += `
//             GROUP BY 
//                 master_status.name, 
//                 customers.trading_name
//             ORDER BY 
//                 customers.id ASC
//             `;

//             console.log("query", query);

//         const [result] = await pool.execute(query);
//         let weekArray = [];
//         const formattedResult = result.map(row => {
//             const weeksData = {};
//             for (let i = 1; i <= 53; i++) {
//                 weeksData[`WE_${i}_${currentYear}`] = {
//                     count: row[`WE_${i}_${currentYear}`] || 0,
//                     job_ids: row[`job_ids_${i}_${currentYear}`] ? row[`job_ids_${i}_${currentYear}`] : ""
//                 };
//             }
//             weekArray.push(weeksData);
//             return {
//                 job_status: row.job_status,
//                 job_type_name: row.job_type_name,
//                 customer_name: row.customer_name,
//                 weeks: weekArray,
//                 Grand_Total: {
//                     count: row.Grand_Total,
//                     job_ids: row.job_ids
//                 }

//             };
//         });

//         return { status: true, message: 'Success.', data: formattedResult };

//     } catch (error) {
//         console.log("error ", error);
//         return { status: false, message: 'Error getting tax status weekly report.' };
//     }
// }

const taxWeeklyStatusReport = async (Report) => {
    try {
        const { StaffUserId, customer_id, job_status_type_id, processor_id, reviewer_id } = Report;

        // Helpers
        const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);
        const rows = await QueryRoleHelperFunction(StaffUserId);

        const currentYear = new Date().getFullYear();

        const [RoleAccess] = await pool.execute(
            'SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?',
            [rows[0].role_id, 33]
        );

        // ✅ Lightweight optimized query
        let query = `
      SELECT
        master_status.name AS job_status,
        customers.trading_name AS customer_name,
        YEARWEEK(jobs.created_at, 1) AS year_week,
        COUNT(jobs.id) AS job_count,
        GROUP_CONCAT(jobs.id) AS job_ids
      FROM jobs
      INNER JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN master_status ON master_status.id = jobs.status_type
      LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
      WHERE YEAR(jobs.created_at) = ?
    `;

        const params = [currentYear];

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

        if (!(rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
            query += ` AND (customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId}))`;
        }

        query += `
      GROUP BY customers.id, master_status.id, year_week
      ORDER BY customers.id, year_week
    `;

        //   console.log("Optimized Query:", query);

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
            const existingWeek = grouped[key].weeks[0][`WE_${weekNum}_${currentYear}`];
            const existingIds = existingWeek.job_ids
                ? existingWeek.job_ids.split(',').map(id => id.trim()).filter(id => id)
                : [];

            const newIds = row.job_ids
                ? row.job_ids.split(',').map(id => id.trim()).filter(id => id)
                : [];

            // Combine and keep unique job IDs
            const uniqueIds = [...new Set([...existingIds, ...newIds])];

            // Update week data
            grouped[key].weeks[0][`WE_${weekNum}_${currentYear}`] = {
                count: uniqueIds.length, // ✅ count based on unique IDs
                job_ids: uniqueIds.join(','),
            };

            // --- Update Grand Total (unique across all weeks) ---
            const existingTotalIds = grouped[key].Grand_Total.job_ids
                ? grouped[key].Grand_Total.job_ids.split(',').map(id => id.trim()).filter(id => id)
                : [];

            const totalUniqueIds = [...new Set([...existingTotalIds, ...newIds])];

            grouped[key].Grand_Total = {
                count: totalUniqueIds.length,
                job_ids: totalUniqueIds.join(','),
            };
        }

        // push to final array
        for (const key in grouped) {
            formattedResult.push(grouped[key]);
        }

        return { status: true, message: "Success.", data: formattedResult };
    } catch (error) {
        console.error("error ", error);
        return { status: false, message: "Error getting tax status weekly report." };
    }
};

const taxWeeklyStatusReportFilterKey = async (Report) => {
    const { StaffUserId } = Report;
    try {

        // Line Manager
        const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

        // Get Role
        const rows = await QueryRoleHelperFunction(StaffUserId)

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);


        let customer = []
        let custumerData = [];

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
            const queryCustomer = `
        SELECT  
            customers.id AS customer_id,
            customers.trading_name AS customer_name
        FROM 
            customers   
        ORDER BY 
        customers.trading_name ASC;
       `;
            const [data] = await pool.execute(queryCustomer);
            custumerData = data;
        } else {
            const queryCustomer = `
        SELECT  
            customers.id AS customer_id,
            customers.trading_name AS customer_name
        FROM 
            customers
        LEFT JOIN
            assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
        WHERE 
          customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})           
        ORDER BY 
        customers.trading_name ASC;
       `;
            const [data] = await pool.execute(queryCustomer);
            custumerData = data;
        }

        if (custumerData.length > 0) {
            customer = custumerData.map(row => ({
                customer_id: row.customer_id,
                customer_name: row.customer_name
            }));
        }



        // job Reviewer
        const queryReviewer = `
         SELECT  
             staffs.id AS reviewer_id,
             staffs.first_name AS reviewer_first_name,
             staffs.last_name AS reviewer_last_name
        FROM 
             staffs
        JOIN 
             roles ON staffs.role_id = roles.id
        WHERE  
          (staffs.role_id = 6 || staffs.role_id = 4) AND staffs.status = '1'  
        ORDER BY 
         staffs.first_name ASC;
       `;

        const [rows1] = await pool.execute(queryReviewer);
        let reviewer = []
        if (rows1.length > 0) {
            reviewer = rows1.map(row => ({
                reviewer_id: row.reviewer_id,
                reviewer_name: row.reviewer_first_name + " " + row.reviewer_last_name
            }));
        }


        // Allocated
        const queryProcessor = `
         SELECT  
             staffs.id AS staff_id,
             staffs.first_name AS staff_first_name,
             staffs.last_name AS staff_last_name
        FROM 
             staffs
        JOIN 
             roles ON staffs.role_id = roles.id
        WHERE  
         (staffs.role_id = 3 || staffs.role_id = 4) AND staffs.status = '1'   
        ORDER BY 
         staffs.first_name ASC;
       `;
        const [rows2] = await pool.execute(queryProcessor);
        let processor = []
        if (rows2.length > 0) {
            processor = rows2.map(row => ({
                processor_id: row.staff_id,
                processor_name: row.staff_first_name + " " + row.staff_last_name
            }));
        }



        // JobStatusType
        const queryJobStatusType = `
       SELECT  
           master_status.id AS job_status_type_id,
           master_status.name AS job_status_type_name
      FROM 
          master_status
      ORDER BY 
       master_status.name ASC;
     `;
        const [rows3] = await pool.execute(queryJobStatusType);
        let job_status_type = []
        if (rows3.length > 0) {
            job_status_type = rows3.map(row => ({
                job_status_type_id: row.job_status_type_id,
                job_status_type_name: row.job_status_type_name
            }));
        }


        return { status: true, message: 'success.', data: { customer: customer, reviewer: reviewer, processor: processor, job_status_type: job_status_type } };

    } catch (err) {
        return { status: false, message: 'Err Customer Get' };
    }

}

const averageTatReport = async (Report) => {
    const { StaffUserId } = Report;
    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)
    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    try {

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 35]);

        let where = []

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
            where.push(`jobs.status_type = 6`);
        } else {
            where.push(`(assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})) AND
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
        return { status: true, message: 'Success.', data: result };


    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}

const getAllTaskByStaff = async (Report) => {
    const { StaffUserId } = Report;
    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)
    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)
    const allJobsSidebarData = await getAllJobsSidebar(StaffUserId, LineManageStaffId, rows)

    //console.log("StaffUserId get Task", StaffUserId);
    //   console.log("jobids get allJobsSidebarData", allJobsSidebarData);
    let filterJobIds = allJobsSidebarData.map(m => m.job_id);
    let jobIds = filterJobIds.join(",");
    // console.log("jobIds", jobIds);
    if (jobIds == "") {
        jobIds = "0";
    }

    const query = `
    SELECT 
    task.id AS task_id,
    task.name AS task_name
    FROM 
    client_job_task 
    JOIN task ON task.id = client_job_task.task_id
    WHERE job_id IN (${jobIds})
    GROUP BY task.id
    ORDER BY task.name ASC;
    `;
    const [result] = await pool.execute(query);
    // console.log("Task data retrieved:", result);
    return { status: true, message: 'Success.', data: result };
}

async function getAllJobsSidebar(StaffUserId, LineManageStaffId, rows) {

    try {

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 35]);

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {

            const query = `
        SELECT 
        jobs.id AS job_id
        FROM 
        jobs
        GROUP BY jobs.id
        ORDER BY 
         jobs.id DESC;
        `;
            const [rows] = await pool.execute(query);
            return rows;
        }



        // Other Roles Data
        const query = `
        SELECT 
        jobs.id AS job_id,
        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id
        FROM 
        jobs
        LEFT JOIN 
        assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        WHERE
         assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})
        GROUP BY jobs.id 
        ORDER BY 
        jobs.id DESC;
     `;

        const [result] = await pool.execute(query);

        //////-----START Assign Customer Service Data START----////////
        let isExistAssignCustomer = result?.find(item => item?.assigned_source === 'assign_customer_service');
        if (isExistAssignCustomer != undefined) {
            let matched = result?.filter(item =>
                item?.assigned_source === 'assign_customer_service' &&
                Number(item?.service_id_assign) === Number(item?.job_service_id)
            )
            let matched2 = result?.filter(item =>
                item?.assigned_source !== 'assign_customer_service'
            )
            const resultAssignCustomer = [...matched, ...matched2]


            return resultAssignCustomer
        }
        //////-----END Assign Customer Service Data END----////////


        return result
    } catch (error) {
        console.log("err -", error);
        return { status: false, message: "Error getting job. All Jobs" };
    }

}

const getInternalJobs = async (Report) => {
    const query = `SELECT * FROM internal ORDER BY name ASC`;
    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}

const getInternalTasks = async (Report) => {
    const query = `SELECT * FROM sub_internal ORDER BY name ASC`;
    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}





/////////////------  START Timesheet Report START-------//////////////////////

/** get date range for timePeriod */
async function getDateRange(timePeriod, fromDateParam, toDateParam) {

    const today = new Date();
    // normalize to local date start
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const copy = (d) => new Date(d.getTime());

    let start, end;

    switch ((timePeriod || '').toLowerCase()) {
        case 'this_week': {
            // week start Monday
            const cur = copy(today);
            const day = (cur.getDay() + 6) % 7; // Monday=0
            start = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() - day);
            end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
            break;
        }
        case 'last_week': {
            const cur = copy(today);
            const day = (cur.getDay() + 6) % 7;
            const startThisWeek = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() - day);
            start = new Date(startThisWeek.getFullYear(), startThisWeek.getMonth(), startThisWeek.getDate() - 7);
            end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
            break;
        }
        case 'this_month': {
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        }
        case 'last_month': {
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        }
        case 'this_year': {
            start = new Date(today.getFullYear(), 0, 1);
            end = new Date(today.getFullYear(), 11, 31);
            break;
        }
        case 'last_year': {
            start = new Date(today.getFullYear() - 1, 0, 1);
            end = new Date(today.getFullYear() - 1, 11, 31);
            break;
        }
        case 'custom': {
            if (!fromDateParam || !toDateParam) throw new Error('custom requires fromDate and toDate');
            return { fromDate: fromDateParam, toDate: toDateParam };
        }
        case 'all':
        case '':
        case undefined:
            // default last 30 days
            end = startOfDay(today);
            start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 29);
            break;
        default:
            // fallback last 30 days
            end = startOfDay(today);
            start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 29);
    }
    console.log("start", start);
    console.log("end", end);
    return { fromDate: toYMD(start), toDate: toYMD(end) };
}
/** Helper: format Date -> YYYY-MM-DD */
function toYMD(date) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
/** get period key label for a date string (YYYY-MM-DD) */
function getPeriodKey(displayBy, dateStr) {
    if (!dateStr) return null;
    // ensure dateStr is YYYY-MM-DD
    const d = new Date(dateStr + 'T00:00:00'); // safe parsing
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');


    switch ((displayBy || 'daily').toLowerCase()) {
        // case 'daily':
        //     return `${y}-${mm}-${dd}`;  // 2025-09-08
        case "daily": {
            const weekday = d.toLocaleString("default", { weekday: "short" }); // Mon
            const day = String(d.getDate()).padStart(2, "0"); // 08
            const monthName = d.toLocaleString("default", { month: "short" }); // Sep
            const yearShort = String(d.getFullYear()).slice(-2); // 25
            return `${weekday} ${day} ${monthName} ${yearShort}`; // Mon 08 Sep 25
        }

        case 'monthly': {
            const monthName = d.toLocaleString('default', { month: 'short' }); // Jan, Feb, Mar...
            return `${monthName} ${y}`; // Sept 2025
        }

        case 'quarterly': {
            const quarter = Math.floor((d.getMonth()) / 3) + 1; // Q1..Q4
            return `${y}-Q${quarter}`;   // 2025-Q3
        }

        case 'yearly':
            return `${y}`;
        // 2025
        case 'weekly': {
            // Week ending = Sunday date
            const jsDay = d.getDay(); // Sunday = 0
            const sunday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (7 - jsDay) % 7);
            const day = sunday.getDate();
            const month = sunday.toLocaleString('default', { month: 'short' }); // Sep
            const year = sunday.getFullYear();
            return `week ending ${day} ${month.toLowerCase()} ${year}`;
        }

        case 'fortnightly': {
            const day = d.getDate();
            const monthName = d.toLocaleString('default', { month: 'short' }); // Sep
            const year = d.getFullYear();
            const half = (day <= 15) ? "H1" : "H2";
            return `${monthName} ${year} ${half}`;
        }

        default:
            return `${y}-${mm}-${dd}`;
    }
}

function normalizeRows(columns, outRows) {
    return outRows.map(row => {
        const newRow = { ...row };
        for (const col of columns) {
            if (!(col in newRow) && col !== "staff_id" && col !== "total_hours") {
                // केवल missing होने पर ही add करो
                newRow[col] = 0;
            }
        }
        return newRow;
    });
}

function getWeekEndings(fromDate, toDate, displayBy = "daily") {
    const result = [];
    let current = new Date(fromDate);

    // date return current date
    // const today = new Date();
    // if (toDate > today) {
    //     toDate = today;
    // }

    while (current <= toDate) {
        const d = new Date(current);
        const y = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");

        switch ((displayBy || "daily").toLowerCase()) {
            // case "daily": {
            //     result.push(`${y}-${mm}-${dd}`); // 2025-09-08
            //     current.setDate(current.getDate() + 1);
            //     break;
            // }
            case "daily": {
                const weekday = d.toLocaleString("default", { weekday: "short" });
                const day = String(d.getDate()).padStart(2, "0");
                const monthName = d.toLocaleString("default", { month: "short" });
                const yearShort = String(d.getFullYear()).slice(-2);
                result.push(`${weekday} ${day} ${monthName} ${yearShort}`); 
                current.setDate(current.getDate() + 1);
                break;
            }

            case "monthly": {
                const monthName = d.toLocaleString("default", { month: "short" });
                result.push(`${monthName} ${y}`); // Sep 2025
                current.setMonth(current.getMonth() + 1);
                break;
            }

            case "quarterly": {
                const quarter = Math.floor(d.getMonth() / 3) + 1;
                result.push(`${y}-Q${quarter}`); // 2025-Q3
                current.setMonth(current.getMonth() + 3);
                break;
            }

            case "yearly": {
                result.push(`${y}`); // 2025
                current.setFullYear(current.getFullYear() + 1);
                break;
            }

            case "weekly": {
                // sunday ko week ending
                const jsDay = d.getDay();
                const sunday = new Date(d);
                sunday.setDate(sunday.getDate() + ((7 - jsDay) % 7));
                const day = sunday.getDate();
                const month = sunday.toLocaleString("default", { month: "short" }).toLowerCase();
                const year = sunday.getFullYear();
                result.push(`week ending ${day} ${month} ${year}`);
                current.setDate(current.getDate() + 7);
                break;
            }

            case "fortnightly": {
                const day = d.getDate();
                const monthName = d.toLocaleString("default", { month: "short" });
                const year = d.getFullYear();
                const half = day <= 15 ? "H1" : "H2";
                result.push(`${monthName} ${year} ${half}`); // Sep 2025 H1/H2

                // अगली fortnight पर ले जाओ
                if (day <= 15) {
                    current.setDate(16);
                } else {
                    current.setMonth(current.getMonth() + 1, 1);
                }
                break;
            }

            default: {
                result.push(`${y}-${mm}-${dd}`);
                current.setDate(current.getDate() + 1);
            }
        }
    }

    return [...new Set(result)]; // duplicate Remove
}

// const getTimesheetReportData = async (Report) => {
//     const { StaffUserId, data } = Report;
//     var {
//         groupBy = ['staff_id'],
//         internal_external,
//         fieldsToDisplay,
//         fieldsToDisplayId,
//         timePeriod,
//         displayBy,
//         fromDate,
//         toDate
//     } = data.filters;
//     if (groupBy.length == 0 || ["", null, undefined].includes(timePeriod) || ["", null, undefined].includes(displayBy)) {
//         return { status: false, message: `empty groupBy field`, data: [] };
//     }
//     const ALLOWED_GROUP_FIELDS = ['staff_id', 'customer_id', 'client_id', 'job_id', 'task_id'];

//     if (!Array.isArray(groupBy)) groupBy = [groupBy];
//     for (const g of groupBy) {
//         if (!ALLOWED_GROUP_FIELDS.includes(g)) {
//             return { status: false, message: `Invalid groupBy field: ${g}`, data: [] };
//         }
//     }

//     try {
//         let range;
//         try {
//             range = await getDateRange(timePeriod, fromDate, toDate);
//         } catch (err) {
//             return { status: false, message: err.message || 'Invalid date range', data: [] };
//         }

//         var { fromDate, toDate } = range;

//         let where = [`work_date BETWEEN ? AND ?`];
//         if (internal_external) {
//             where.push(`raw.task_type = '${internal_external}'`);
//         }

//         let lastIndexValue = groupBy[groupBy.length - 1];
//         if (!["", null, undefined].includes(fieldsToDisplayId)) {

//             if (lastIndexValue == "staff_id") {
//                 where.push(`raw.staff_id = ${fieldsToDisplayId}`);
//             } else if (lastIndexValue == "customer_id") {
//                 where.push(`raw.customer_id = ${fieldsToDisplayId}`);
//             } else if (lastIndexValue == "client_id") {
//                 where.push(`raw.client_id = ${fieldsToDisplayId}`);
//             } else if (lastIndexValue == "job_id") {
//                 where.push(`raw.job_id = ${fieldsToDisplayId}`);
//             } else if (lastIndexValue == "task_id") {
//                 where.push(`raw.task_id = ${fieldsToDisplayId}`);
//             }
//         }
//         where = where.length ? `WHERE ${where.join(" AND ")}` : '';
//         const groupValueSQL = `CONCAT_WS('::', ${groupBy.join(", ")}) AS group_value`;
//         const groupLabelSQL = groupBy.map(f => {
//             if (f === 'staff_id') return "CONCAT(s.first_name,' ',s.last_name)";
//             if (f === 'customer_id') return "c.id";
//             if (f === 'client_id') return "cl.id";
//             if (f === 'job_id') {
//                 return `CASE 
//                     WHEN raw.task_type = '1' THEN internal.name
//                     WHEN raw.task_type = '2' THEN j.job_id
//                 END`;
//             }

//             if (f === 'task_id') {
//                 return `CASE 
//                     WHEN raw.task_type = '1' THEN sub_internal.name
//                     WHEN raw.task_type = '2' THEN t.name
//                 END`;
//             }
//             return f;
//         }).join(", ' - ', ");

//         const groupLabelFinal = `CONCAT(${groupLabelSQL}) AS group_label`;
//         const staffName = `CONCAT(s.first_name,' ',s.last_name) AS staff_name`;
//         const customerName = `c.trading_name AS customer_name`;
//         const clientName = `CONCAT(
//                             'cli_', 
//                             SUBSTRING(c.trading_name, 1, 3), '_',
//                             SUBSTRING(cl.trading_name, 1, 3), '_',
//                             SUBSTRING(cl.client_code, 1, 15)
//                         ) AS client_name`;
//         const jobName = `
//                  CASE 
//                     WHEN raw.task_type = '1' THEN internal.name
//                     WHEN raw.task_type = '2' THEN 

//                     CONCAT(
//                         SUBSTRING(c.trading_name, 1, 3), '_',
//                         SUBSTRING(cl.trading_name, 1, 3), '_',
//                         SUBSTRING(job_types.type, 1, 4), '_',
//                         SUBSTRING(j.job_id, 1, 15)
//                         )


//                 END AS job_name`;
//         const taskName = `
//                  CASE 
//                     WHEN raw.task_type = '1' THEN sub_internal.name
//                     WHEN raw.task_type = '2' THEN t.name
//                 END AS task_name`;


//         const unpivotSQL = `
//         SELECT
//             timesheet_id,
//             group_value,
//             work_date,
//             work_hours,
//             group_value,
//             task_type,
//             ${groupLabelFinal},
//             ${staffName},
//             ${customerName},
//             ${clientName},
//             ${jobName},
//             ${taskName}
//         FROM (
//             SELECT id AS timesheet_id,
//                    staff_id,
//                    customer_id,
//                    client_id,
//                    job_id,
//                    task_id,
//                    ${groupValueSQL},
//                    monday_date AS work_date,
//                    monday_hours AS work_hours,
//                    task_type
//             FROM timesheet WHERE monday_date IS NOT NULL
//             UNION ALL
//             SELECT id, staff_id, customer_id, client_id,job_id,task_id,
//                    ${groupValueSQL},
//                    tuesday_date, tuesday_hours, task_type
//             FROM timesheet WHERE tuesday_date IS NOT NULL
//             UNION ALL
//             SELECT id, staff_id, customer_id, client_id,job_id,task_id,
//                    ${groupValueSQL},
//                    wednesday_date, wednesday_hours, task_type
//             FROM timesheet WHERE wednesday_date IS NOT NULL
//             UNION ALL
//             SELECT id, staff_id, customer_id, client_id,job_id,task_id,
//                    ${groupValueSQL},
//                    thursday_date, thursday_hours, task_type
//             FROM timesheet WHERE thursday_date IS NOT NULL
//             UNION ALL
//             SELECT id, staff_id, customer_id, client_id,job_id,task_id,
//                    ${groupValueSQL},
//                    friday_date, friday_hours, task_type
//             FROM timesheet WHERE friday_date IS NOT NULL
//             UNION ALL
//             SELECT id, staff_id, customer_id, client_id,job_id,task_id,
//                    ${groupValueSQL},
//                    saturday_date, saturday_hours, task_type
//             FROM timesheet WHERE saturday_date IS NOT NULL
//             UNION ALL
//             SELECT id, staff_id, customer_id, client_id,job_id,task_id,
//                    ${groupValueSQL},
//                    sunday_date, sunday_hours, task_type
//             FROM timesheet WHERE sunday_date IS NOT NULL
//         ) AS raw
//         LEFT JOIN staffs s ON raw.staff_id = s.id
//         LEFT JOIN customers c ON raw.customer_id = c.id
//         LEFT JOIN clients cl ON raw.client_id = cl.id

//         LEFT JOIN internal ON (task_type = '1' AND raw.job_id = internal.id)
//         LEFT JOIN jobs j ON (task_type = '2' AND raw.job_id = j.id)
//         LEFT JOIN job_types ON j.job_type_id = job_types.id 

//         LEFT JOIN sub_internal ON (task_type = '1' AND raw.task_id = sub_internal.id)
//         LEFT JOIN task t ON (task_type = '2' AND raw.task_id = t.id)
//         ${where}
//         ORDER BY group_value, work_date
//         `;


//         const conn = await pool.getConnection();
//         const [rows] = await conn.execute(unpivotSQL, [fromDate, toDate]);
//         conn.release();


//         const groups = {};
//         const periodSet = new Set();

//         for (const r of rows) {
//             let workDateStr = r.work_date instanceof Date ? toYMD(r.work_date) : String(r.work_date).slice(0, 10);
//             if (!workDateStr) continue;

//             const gid = r.group_value || 'NULL';
//             const label = r.group_label;
//             const staffName = r.staff_name;
//             const customerName = r.customer_name;
//             const clientName = r.client_name;
//             const jobName = r.job_name;
//             const taskName = r.task_name;

//             const secs = r.work_hours;
//             const periodKey = getPeriodKey(displayBy, workDateStr);
//             if (!periodKey) continue;

//             periodSet.add(periodKey);

//             if (!groups[gid]) {
//                 groups[gid] = {
//                     group_value: gid,
//                     group_label: label,
//                     staff_name: staffName,
//                     customer_name: customerName,
//                     client_name: clientName,
//                     job_name: jobName,
//                     task_name: taskName,
//                     totalSeconds: 0,
//                     timesheetIds: new Set(),
//                     periodSeconds: {}
//                 };
//             }

//             const g = groups[gid];
//             g.totalSeconds += parseFloat(secs?.replace(':', '.'));
//             g.timesheetIds.add(r.timesheet_id);
//             g.periodSeconds[periodKey] = (g.periodSeconds[periodKey] || 0) + parseFloat(secs?.replace(':', '.'));
//         }

//         const periods = Array.from(periodSet).sort((a, b) => a.localeCompare(b));
//         const outRows = [];
//         const groupKeys = Object.keys(groups).sort((a, b) => {
//             const na = Number(a), nb = Number(b);
//             if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
//             return a.localeCompare(b);
//         });

//         for (const gid of groupKeys) {
//             const g = groups[gid];
//             const row = {};
//             console.log("g", g);

//             row['staff_id'] = g.staff_name;  // final readable label
//             row['customer_id'] = g.customer_name;
//             row['client_id'] = g.client_name;
//             row['job_id'] = g.job_name;
//             row['task_id'] = g.task_name;

//             for (const p of periods) {
//                 row[p] = ((g.periodSeconds[p])?.toFixed(2) || 0);
//             }

//             row.total_hours = parseFloat(g.totalSeconds)?.toFixed(2);
//             outRows.push(row);
//         }


//         const weeks = getWeekEndings(new Date(fromDate), new Date(toDate), displayBy);

//         const columnsWeeks = [...groupBy, ...weeks, 'total_hours'];
//         const finalRows = normalizeRows(columnsWeeks, outRows);

//         const fixed = [...groupBy, 'total_hours'];
//         const dynamic = columnsWeeks.filter(col => !fixed.includes(col));
//         const columnsWeeksDecOrder = [...fixed, ...dynamic?.reverse()];

//         return {
//             status: true,
//             message: 'Success.',
//             data: {
//                 meta: { fromDate, toDate, groupBy, displayBy, timePeriod },
//                 //columns: columnsWeeks,
//                 columns: columnsWeeksDecOrder,
//                 rows: finalRows
//             }
//         };

//     } catch (err) {
//         console.error(err);
//         return { status: false, message: err.message || 'server error', data: [] };
//     }
// };



const getTimesheetReportData = async (Report) => {
    const { StaffUserId, data } = Report;
    // console.log("Call Timesheet Report");
    var {
        groupBy = ['staff_id'],
        internal_external,
        fieldsToDisplay,
        fieldsToDisplayId,
        staff_id,
        employee_number,
        customer_id,
        client_id,
        job_id,
        task_id,
        internal_job_id,
        internal_task_id,
        timePeriod,
        displayBy,
        fromDate,
        toDate
    } = data.filters;

    let role_user = data?.role?.toUpperCase() || '';

    //console.log("groupBy", groupBy);
    // console.log("fieldsToDisplayId", fieldsToDisplayId);
    if (groupBy.length == 0 || ["", null, undefined].includes(timePeriod) || ["", null, undefined].includes(displayBy)) {
        return { status: false, message: `empty groupBy field`, data: [] };
    }
    //    groupBy = ['staff_id','customer_id','client_id'];
    // allowed fields
    const ALLOWED_GROUP_FIELDS = ['staff_id', 'customer_id', 'client_id', 'job_id', 'task_id', 'employee_number'];

    // validate groupBy
    if (!Array.isArray(groupBy)) groupBy = [groupBy];
    for (const g of groupBy) {
        if (!ALLOWED_GROUP_FIELDS.includes(g)) {
            return { status: false, message: `Invalid groupBy field: ${g}`, data: [] };
        }
    }

    try {
        
        // compute date range
        let range;
        try {
            range = await getDateRange(timePeriod, fromDate, toDate);
        } catch (err) {
            return { status: false, message: err.message || 'Invalid date range', data: [] };
        }

        var { fromDate, toDate } = range;

        let where = [`work_date BETWEEN ? AND ?`];


        // let lastIndexValue = groupBy[groupBy.length - 1];
        // if (!["", null, undefined].includes(fieldsToDisplayId)) {
        //     if (lastIndexValue == "staff_id") {
        //         where.push(`raw.staff_id = ${fieldsToDisplayId}`);
        //     } else if (lastIndexValue == "customer_id") {
        //         where.push(`raw.customer_id = ${fieldsToDisplayId}`);
        //     } else if (lastIndexValue == "client_id") {
        //         where.push(`raw.client_id = ${fieldsToDisplayId}`);
        //     } else if (lastIndexValue == "job_id") {
        //         where.push(`raw.job_id = ${fieldsToDisplayId}`);
        //     } else if (lastIndexValue == "task_id") {
        //         where.push(`raw.task_id = ${fieldsToDisplayId}`);
        //     }
        // }

        if (!["", null, undefined].includes(staff_id)) {
            where.push(`raw.staff_id = ${staff_id}`);
        }
        if (!["", null, undefined].includes(customer_id)) {
            where.push(`raw.customer_id = ${customer_id}`);
        }
        if (!["", null, undefined].includes(client_id)) {
            where.push(`raw.client_id = ${client_id}`);
        }

        if (internal_external == '1' || internal_external == '2') {
            where.push(`raw.task_type = '${internal_external}'`);
        }


        if (!["", null, undefined].includes(job_id)) {
            where.push(`raw.job_id = ${job_id}`);
        }
        if (!["", null, undefined].includes(task_id)) {
            where.push(`raw.task_id = ${task_id}`);
        }

        if (!["", null, undefined].includes(internal_job_id)) {
            where.push(`(raw.task_type = '1' AND raw.job_id = ${internal_job_id})`);
        }
        if (!["", null, undefined].includes(internal_task_id)) {
            where.push(`(raw.task_type = '1' AND raw.task_id = ${internal_task_id})`);
        }
        if (!["", null, undefined].includes(employee_number)) {
            where.push(`s.employee_number = '${employee_number}'`);
        }

        if(!['SUPERADMIN','ADMIN'].includes(role_user) && !["", null, undefined].includes(StaffUserId)) {
            where.push(`raw.staff_id = ${StaffUserId}`);
        }


        where = where.length ? `WHERE ${where.join(" AND ")}` : '';

        // Build group_value for SQL
        // const groupValueSQL = `CONCAT_WS('::', ${groupBy.join(", ")}) AS group_value`;
        const groupValueSQL = `CONCAT_WS('::', ${groupBy
            .map(f => (f === 'employee_number' ? 's.employee_number' : `${f}`))
            .join(', ')}) AS group_value`;

        // Build readable group_label
        const groupLabelSQL = groupBy.map(f => {
            if (f === 'staff_id') return "CONCAT(s.first_name,' ',s.last_name)";
            if (f === 'customer_id') return "c.id";
            if (f === 'client_id') return "cl.id";
            if (f === 'job_id') {
                return `CASE 
                    WHEN raw.task_type = '1' THEN internal.name
                    WHEN raw.task_type = '2' THEN j.job_id
                END`;
            }

            if (f === 'task_id') {
                return `CASE 
                    WHEN raw.task_type = '1' THEN sub_internal.name
                    WHEN raw.task_type = '2' THEN t.name
                END`;
            }
            if (f === 'employee_number') return "s.employee_number";
            return f;
        }).join(", ' - ', ");

        const groupLabelFinal = `CONCAT(${groupLabelSQL}) AS group_label`;
        const staffName = `CONCAT(s.first_name,' ',s.last_name) AS staff_name`;
        const customerName = `c.trading_name AS customer_name`;
        const clientName = `CONCAT(
                            'cli_', 
                            SUBSTRING(c.trading_name, 1, 3), '_',
                            SUBSTRING(cl.trading_name, 1, 3), '_',
                            SUBSTRING(cl.client_code, 1, 15)
                        ) AS client_name`;
        const jobName = `
                 CASE 
                    WHEN raw.task_type = '1' THEN internal.name
                    WHEN raw.task_type = '2' THEN 

                    CONCAT(
                        SUBSTRING(c.trading_name, 1, 3), '_',
                        SUBSTRING(cl.trading_name, 1, 3), '_',
                        SUBSTRING(job_types.type, 1, 4), '_',
                        SUBSTRING(j.job_id, 1, 15)
                        )


                END AS job_name`;
        const taskName = `
                 CASE 
                    WHEN raw.task_type = '1' THEN sub_internal.name
                    WHEN raw.task_type = '2' THEN t.name
                END AS task_name`;
        const taskType = `CASE
                            WHEN raw.task_type = '1' THEN 'Internal'
                            WHEN raw.task_type = '2' THEN 'External'
                            ELSE 'Unknown'
                          END AS task_type_label`;
        const employeeNumber = `s.employee_number AS employee_number`;

        // Unpivot query
        const unpivotSQL = `
        SELECT
            timesheet_id,
            group_value,
            work_date,
            work_hours,
            group_value,
            task_type,
            ${groupLabelFinal},
            ${staffName},
            ${customerName},
            ${clientName},
            ${jobName},
            ${taskName},
            ${taskType},
            ${employeeNumber}
        FROM (
           SELECT 
            timesheet.id AS timesheet_id,
            timesheet.staff_id,
            timesheet.customer_id,
            timesheet.client_id,
            timesheet.job_id,
            timesheet.task_id,
            ${groupValueSQL},
            timesheet.monday_date AS work_date,
            timesheet.monday_hours AS work_hours,
            timesheet.task_type
            FROM timesheet
            LEFT JOIN staffs s ON timesheet.staff_id = s.id
            WHERE timesheet.monday_date IS NOT NULL

            UNION ALL
            SELECT 
            timesheet.id,
            timesheet.staff_id,
            timesheet.customer_id,
            timesheet.client_id,
            timesheet.job_id,
            timesheet.task_id,
            ${groupValueSQL},
            timesheet.tuesday_date AS work_date,
            timesheet.tuesday_hours AS work_hours, 
            timesheet.task_type
            FROM timesheet
            LEFT JOIN staffs s ON timesheet.staff_id = s.id
            WHERE timesheet.tuesday_date IS NOT NULL
            UNION ALL
            SELECT 
            timesheet.id,
            timesheet.staff_id,
            timesheet.customer_id,
            timesheet.client_id,
            timesheet.job_id,
            timesheet.task_id,
            ${groupValueSQL},
            timesheet.wednesday_date AS work_date, 
            timesheet.wednesday_hours AS work_hours, 
            timesheet.task_type
            FROM timesheet
            LEFT JOIN staffs s ON timesheet.staff_id = s.id
            WHERE
                timesheet.wednesday_date IS NOT NULL
            UNION ALL
            SELECT 
            timesheet.id,
            timesheet.staff_id,
            timesheet.customer_id,
            timesheet.client_id,
            timesheet.job_id,
            timesheet.task_id,
            ${groupValueSQL},
            timesheet.thursday_date AS work_date, 
            timesheet.thursday_hours AS work_hours, 
            timesheet.task_type
            FROM timesheet
            LEFT JOIN staffs s ON timesheet.staff_id = s.id
            WHERE   
                timesheet.thursday_date IS NOT NULL
            UNION ALL
            SELECT 
            timesheet.id,
            timesheet.staff_id,
            timesheet.customer_id,
            timesheet.client_id,
            timesheet.job_id,
            timesheet.task_id,
            ${groupValueSQL},
            timesheet.friday_date AS work_date, 
            timesheet.friday_hours AS work_hours, 
            timesheet.task_type
            FROM timesheet
            LEFT JOIN staffs s ON timesheet.staff_id = s.id
            WHERE
                timesheet.friday_date IS NOT NULL
            UNION ALL
            SELECT 
            timesheet.id,
            timesheet.staff_id,
            timesheet.customer_id,
            timesheet.client_id,
            timesheet.job_id,   
            timesheet.task_id,
            ${groupValueSQL},
            timesheet.saturday_date AS work_date, 
            timesheet.saturday_hours AS work_hours, 
            timesheet.task_type
            FROM timesheet
            LEFT JOIN staffs s ON timesheet.staff_id = s.id
            WHERE
                timesheet.saturday_date IS NOT NULL
            UNION ALL
            SELECT
            timesheet.id,
            timesheet.staff_id,
            timesheet.customer_id,
            timesheet.client_id,
            timesheet.job_id,
            timesheet.task_id,
            ${groupValueSQL},
            timesheet.sunday_date AS work_date,
            timesheet.sunday_hours AS work_hours,
            timesheet.task_type
            FROM timesheet
            LEFT JOIN staffs s ON timesheet.staff_id = s.id
            WHERE
                timesheet.sunday_date IS NOT NULL
                
        ) AS raw
        LEFT JOIN staffs s ON raw.staff_id = s.id
        LEFT JOIN customers c ON raw.customer_id = c.id
        LEFT JOIN clients cl ON raw.client_id = cl.id

        LEFT JOIN internal ON (task_type = '1' AND raw.job_id = internal.id)
        LEFT JOIN jobs j ON (task_type = '2' AND raw.job_id = j.id)
        LEFT JOIN job_types ON j.job_type_id = job_types.id 

        LEFT JOIN sub_internal ON (task_type = '1' AND raw.task_id = sub_internal.id)
        LEFT JOIN task t ON (task_type = '2' AND raw.task_id = t.id)
        ${where}
        ORDER BY group_value, work_date
        `;

        //   console.log("fromDate ,", fromDate , 'toDate ', toDate);
        //   console.log("unpivotSQL", unpivotSQL);

        const conn = await pool.getConnection();
        const [rows] = await conn.execute(unpivotSQL, [fromDate, toDate]);
        conn.release();

        // Aggregate JS
        const groups = {};
        const periodSet = new Set();

        for (const r of rows) {
            let workDateStr = r.work_date instanceof Date ? toYMD(r.work_date) : String(r.work_date).slice(0, 10);
            if (!workDateStr) continue;

           // console.log("r.work_hours --------> ", r.work_hours);

            //  const gid = r.group_value || 'NULL';
            const gid = r.group_value + '_' + r.task_type || 'NULL';
            const label = r.group_label;
            const staffName = r.staff_name;
            const customerName = r.customer_name;
            const clientName = r.client_name;
            const jobName = r.job_name;
            const taskName = r.task_name;
            const taskType = r.task_type_label;
            const employeeNumber = r.employee_number;

            //const secs = r?.work_hours;
            const secs = ['', null, undefined].includes(r.work_hours) ? '0' : r.work_hours;
            // console.log("displayBy", displayBy, "workDateStr", workDateStr);
            const periodKey = getPeriodKey(displayBy, workDateStr);
            if (!periodKey) continue;

            periodSet.add(periodKey);

            if (!groups[gid]) {
                groups[gid] = {
                    group_value: gid,
                    group_label: label,
                    staff_name: staffName,
                    customer_name: customerName,
                    client_name: clientName,
                    job_name: jobName,
                    task_name: taskName,
                    task_type: taskType,
                    employee_number: employeeNumber,
                    totalSeconds: 0,
                    timesheetIds: new Set(),
                    periodSeconds: {}
                };
            }

            const g = groups[gid];
            g.totalSeconds += parseFloat(secs?.replace(':', '.'));
            g.timesheetIds.add(r.timesheet_id);
            g.periodSeconds[periodKey] = (g.periodSeconds[periodKey] || 0) + parseFloat(secs?.replace(':', '.'));
        }

        const periods = Array.from(periodSet).sort((a, b) => a.localeCompare(b));
        const outRows = [];
        const groupKeys = Object.keys(groups).sort((a, b) => {
            const na = Number(a), nb = Number(b);
            if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
            return a.localeCompare(b);
        });

        for (const gid of groupKeys) {
            const g = groups[gid];
            const row = {};
            // console.log("g", g);

            row['staff_id'] = g.staff_name;  // final readable label
            row['customer_id'] = g.customer_name;
            row['client_id'] = g.client_name;
            row['job_id'] = g.job_name;
            row['task_id'] = g.task_name;
            row['employee_number'] = g.employee_number;

            for (const p of periods) {
                row[p] = ((g.periodSeconds[p])?.toFixed(2) || 0);
            }

            row.total_hours = parseFloat(g.totalSeconds)?.toFixed(2);
            row.task_type = g.task_type;
            // row.total_records = g.timesheetIds.size;
            outRows.push(row);
        }


        // const columns = ['group', ...periods, 'total_hours', 'total_records'];
        // console.log("fromDate ,", fromDate, 'toDate ', toDate);

        const weeks = getWeekEndings(new Date(fromDate), new Date(toDate), displayBy);

        const columnsWeeks = [...groupBy, ...weeks, 'total_hours'];
        // const columns = [...groupBy, ...periods, 'total_hours'];
        // console.log("columnsWeeks", columnsWeeks);



        // console.log("Time Period", timePeriod, "fromDate, ", fromDate, " toDate ", toDate);
        // console.log("displayBy, ", displayBy);
        const finalRows = normalizeRows(columnsWeeks, outRows);

        const fixed = [...groupBy, 'task_type', 'total_hours'];
        const dynamic = columnsWeeks.filter(col => !fixed.includes(col));
        const columnsWeeksDecOrder = [...fixed, ...dynamic?.reverse()];


        return {
            status: true,
            message: 'Success.',
            data: {
                meta: { fromDate, toDate, groupBy, displayBy, timePeriod },
                //columns: columnsWeeks,
                columns: columnsWeeksDecOrder,
                rows: finalRows
            }
        };

    } catch (err) {
        console.error(err);
        return { status: false, message: err.message || 'server error', data: [] };
    }
};


/////////////------  END Timesheet Report END-------//////////////////////





const missingTimesheetReport = async (Report) => {
    //    console.log("Missing Timesheet Report:", Report);
    const { data, StaffUserId } = Report;
    // Line Manager
    //const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)
    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    async function getAllLineManageStaffIds(staff_id) {
        const allStaffIds = new Set(); // To avoid duplicates
        const queue = [staff_id];

        while (queue.length > 0) {
            const currentId = queue.shift();
            if (!allStaffIds.has(currentId)) {
                allStaffIds.add(currentId);

                const [rows] = await pool.execute(
                    `SELECT staff_to FROM line_managers WHERE staff_by = ?`,
                    [currentId]
                );

                const subordinates = rows.map(row => row.staff_to);
                queue.push(...subordinates);
            }
        }

        return Array.from(allStaffIds);
    }

    const LineManageStaffId = await getAllLineManageStaffIds(StaffUserId);


    let where = [];
    if (rows.length > 0 && rows[0].role_name == "SUPERADMIN") {
        // Allow access to all data
        where.push(`ts.submit_status = '0' OR ts.submit_status IS NULL`);
    } else {
        where.push(`(ts.submit_status = '0' OR ts.submit_status IS NULL) AND st.id IN (${LineManageStaffId})`);
    }

    where = `WHERE ${where.join(" AND ")}`;
    let query_last_week_filter = `
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
            ) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)  -- Only last week
        ${where} 
        GROUP BY st.id, st.first_name, st.last_name, st.email, ts.submit_status, week_date
        ORDER BY st.first_name ASC;
        
    `



    const [result] = await pool.execute(query_last_week_filter);
    // console.log("result", result);

    return {
        status: true,
        message: 'Success.',
        data: {
            result: result
        }
    };
};

const discrepancyReport = async (Report) => {
    // console.log("Discrepancy Report:", Report);
    let { StaffUserId } = Report;
    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)
    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)


    // let query = `
    //     SELECT 
    //     timesheet.id AS timsheet_id,
    //     timesheet.staff_id,
    //     timesheet.monday_hours,
    //     timesheet.tuesday_hours,
    //     timesheet.wednesday_hours,
    //     timesheet.thursday_hours,
    //     timesheet.friday_hours,
    //     (
    //     COALESCE(CAST(REPLACE(timesheet.monday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
    //     COALESCE(CAST(REPLACE(timesheet.tuesday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
    //     COALESCE(CAST(REPLACE(timesheet.wednesday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
    //     COALESCE(CAST(REPLACE(timesheet.thursday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
    //     COALESCE(CAST(REPLACE(timesheet.friday_hours, ':', '.') AS DECIMAL(10,2)), 0)
    //     ) AS timesheet_total_hours,

    //     CONCAT(staffs.first_name, ' ', staffs.last_name) AS staff_fullname,
    //     staffs.email AS staff_email,

    //     roles.role AS role_name,

    //     jobs.id AS job_id,
    //     jobs.total_time AS job_total_time,

    //     CONCAT(
    //         SUBSTRING(customers.trading_name, 1, 3), '_',
    //         SUBSTRING(clients.trading_name, 1, 3), '_',
    //         SUBSTRING(job_types.type, 1, 4), '_',
    //         SUBSTRING(jobs.job_id, 1, 15)
    //         ) AS job_code_id

    // FROM timesheet
    // JOIN jobs ON (timesheet.task_type = '2' AND timesheet.job_id = jobs.id)
    // JOIN staffs ON staffs.id = timesheet.staff_id
    // JOIN roles ON roles.id = staffs.role_id
    // JOIN customers ON customers.id = jobs.customer_id
    // JOIN clients ON clients.id = jobs.client_id
    // JOIN job_types ON jobs.job_type_id = job_types.id
    // `;


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

        GROUP BY jobs.id, job_code_id, jobs.total_time
    `;


    if (rows.length > 0 && rows[0].role_name == "SUPERADMIN") {
        // Allow access to all data
    } else {
        // Restrict access to specific data
        query += ` WHERE timesheet.staff_id IN (${LineManageStaffId})`;
    }


    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}

const discrepancyReportProcessor = async (Report) => {
    // console.log("Discrepancy Report:", Report);
    let { StaffUserId } = Report;
    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)
    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)


    let query = `
    SELECT 
        jobs.id AS job_id,
        CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(job_types.type, 1, 4), '_',
            SUBSTRING(jobs.job_id, 1, 15)
        ) AS job_code_id,

        jobs.total_preparation_time AS total_preparation_time,
        jobs.feedback_incorporation_time AS feedback_incorporation_time,

        SEC_TO_TIME(
            COALESCE(TIME_TO_SEC(jobs.total_preparation_time), 0) + 
            COALESCE(TIME_TO_SEC(jobs.feedback_incorporation_time), 0)
        ) AS job_total_time_processor,


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

    WHERE staffs.role_id = 3 -- Only Processors
    GROUP BY jobs.id, job_code_id, jobs.total_time
`;



    if (rows.length > 0 && rows[0].role_name == "SUPERADMIN") {
        // Allow access to all data
    } else {
        // Restrict access to specific data
        query += ` WHERE timesheet.staff_id IN (${LineManageStaffId})`;
    }


    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}

const capacityReport = async (Report) => {



    return { status: true, message: 'no make Api', data: [] };
}


//////// ---------- Save Filters Start --------- ////////////
const saveFilters = async (Report) => {

    const { data, StaffUserId } = Report;
    const { id, type, filters } = data;
    // console.log("Save Filters Report id:", id);
    // console.log("Save Filters Report type:", type);
    // console.log("Save Filters Report filters:", filters);
    //   Save Filters Report filters: {
    //   groupBy: [ 'staff_id' ],
    //   internal_external: '0',
    //   fieldsToDisplay: null,
    //   fieldsToDisplayId: null,
    //   staff_id: null,
    //   customer_id: null,
    //   client_id: null,
    //   job_id: null,
    //   task_id: null,
    //   internal_job_id: null,
    //   internal_task_id: null,
    //   timePeriod: 'this_month',
    //   displayBy: 'Weekly',
    //   fromDate: null,
    //   toDate: null
    // }

    if (!['', null, undefined].includes(id)) {
        const query = `
        UPDATE timesheet_filter 
        SET type = ?, staff_id = ?, filter_record = ?
        WHERE id = ?
        `;
        const [result] = await pool.execute(query, [type, StaffUserId, JSON.stringify(filters), id]);
        return { status: true, message: 'Record updated successfully.', data: result };

    } else {
        const query = `
        INSERT INTO timesheet_filter (type,staff_id,filter_record)
        VALUES (?, ?, ?)
        `;
        const [result] = await pool.execute(query, [type, StaffUserId, JSON.stringify(filters)]);
        return { status: true, message: 'Record added successfully', data: result };
    }




}

const getAllFilters = async (Report) => {


    const { data, StaffUserId } = Report;
    const { type } = data;


    if (['', null, undefined].includes(type)) {
        return { status: false, message: 'Filter type is required.', data: [] };
    }

    if (type === 'timesheet_report') {

        let where = [`timesheet_filter.staff_id = ?`];
        if (!['', null, undefined].includes(type)) {
            where.push(`timesheet_filter.type = '${type}'`);
        }
        where = where.length ? `WHERE ${where.join(" AND ")}` : '';
        const query = `
        SELECT 
        timesheet_filter.*,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.groupBy')) AS groupBy,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.timePeriod')) AS timePeriod,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.displayBy')) AS displayBy,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.fromDate')) AS fromDate,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.toDate')) AS toDate,
        staffs.id AS filter_staff_id,
        CONCAT(staffs.first_name,' ',staffs.last_name) AS staff_fullname,
        customers.id AS filter_customer_id,
        customers.trading_name AS customer_name,
        clients.id AS filter_client_id,
        CONCAT(
          'cli_', 
          SUBSTRING(customers.trading_name, 1, 3), '_',
          SUBSTRING(clients.trading_name, 1, 3), '_',
          SUBSTRING(clients.client_code, 1, 15)
          ) AS client_name,

        jobs.id AS filter_job_id,
        CONCAT(
          SUBSTRING(customers.trading_name, 1, 3), '_',
          SUBSTRING(clients.trading_name, 1, 3), '_',
          SUBSTRING(job_types.type, 1, 4), '_',
          SUBSTRING(jobs.job_id, 1, 15)
          ) AS job_name,

        task.id AS filter_task_id,
        task.name AS task_name,  
        
        internal.id AS filter_internal_job_id,
        internal.name AS internal_job_name,
       
        sub_internal.id AS filter_internal_task_id,
        sub_internal.name AS internal_task_name

        FROM 
        timesheet_filter
        LEFT JOIN staffs ON staffs.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.staff_id'))
        LEFT JOIN customers ON customers.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.customer_id'))
        LEFT JOIN clients ON clients.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.client_id'))
        LEFT JOIN jobs ON jobs.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.job_id'))
        LEFT JOIN job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN task ON task.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.task_id'))
        LEFT JOIN internal ON internal.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.internal_job_id'))
        LEFT JOIN sub_internal ON sub_internal.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.internal_task_id'))
        ${where}
        ORDER BY timesheet_filter.id DESC
        `;
        const [result] = await pool.execute(query, [StaffUserId]);
        return { status: true, message: 'Success.', data: result };

    }

    else if (type === 'job_custom_report') {
        let where = [`timesheet_filter.staff_id = ?`];
        if (!['', null, undefined].includes(type)) {
            where.push(`timesheet_filter.type = '${type}'`);
        }
        where = where.length ? `WHERE ${where.join(" AND ")}` : '';


        //    {"groupBy":["job_id","customer_id","client_id","account_manager_id","allocated_to_id","reviewer_id","allocated_to_other_id","service_id","job_type_id","status_type_id","line_manager_id"],"internal_external":"0","fieldsToDisplay":null,"fieldsToDisplayId":null,"staff_id":null,"customer_id":null,"client_id":null,"job_id":null,"task_id":null,"internal_job_id":null,"internal_task_id":null,"timePeriod":"this_month","displayBy":"Weekly","fromDate":null,"toDate":null}


        const query = `
        SELECT 
        timesheet_filter.*,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.groupBy')) AS groupBy,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.timePeriod')) AS timePeriod,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.displayBy')) AS displayBy,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.fromDate')) AS fromDate,
        JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.toDate')) AS toDate,

        jobs.id AS filter_job_id,
        CONCAT(
          SUBSTRING(job_customer.trading_name, 1, 3), '_',
          SUBSTRING(job_client.trading_name, 1, 3), '_',
          SUBSTRING(job_type_job.type, 1, 4), '_',
          SUBSTRING(jobs.job_id, 1, 15)
          ) AS job_name,

        customers.id AS filter_customer_id,
        customers.trading_name AS customer_name,

        clients.id AS filter_client_id,
        CONCAT(
          'cli_', 
          SUBSTRING(client_customer.trading_name, 1, 3), '_',
          SUBSTRING(clients.trading_name, 1, 3), '_',
          SUBSTRING(clients.client_code, 1, 15)
          ) AS client_name,


        account_manager.id AS filter_account_manager_id,
        CONCAT(account_manager.first_name,' ',account_manager.last_name) AS account_manager_name,

        allocated_to.id AS filter_allocated_to_id,
        CONCAT(allocated_to.first_name,' ',allocated_to.last_name) AS allocated_to_name,
         
        reviewer.id AS filter_reviewer_id,
        CONCAT(reviewer.first_name,' ',reviewer.last_name) AS reviewer_name,

        allocated_to_other.id AS filter_allocated_to_other_id,
        CONCAT(allocated_to_other.first_name,' ',allocated_to_other.last_name) AS allocated_to_other_name,

        services.id AS filter_service_id,
        services.name AS service_name,

        job_types.id AS filter_job_type_id,
        job_types.type AS job_type_name,

        master_status.id AS filter_status_type_id,
        master_status.name AS status_type_name



        FROM
        timesheet_filter
        LEFT JOIN jobs ON jobs.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.job_id'))
        LEFT JOIN customers AS job_customer ON job_customer.id = jobs.customer_id
        LEFT JOIN clients AS job_client ON job_client.id = jobs.client_id
        LEFT JOIN job_types AS job_type_job ON  job_type_job.id = jobs.job_type_id




        LEFT JOIN customers ON customers.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.customer_id'))


        LEFT JOIN clients ON clients.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.client_id'))
        LEFT JOIN customers AS client_customer ON client_customer.id = clients.customer_id

        LEFT JOIN 
        staffs AS account_manager ON account_manager.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.account_manager_id'))

        LEFT JOIN 
        staffs AS allocated_to ON allocated_to.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.allocated_to_id'))

        LEFT JOIN 
        staffs AS reviewer ON reviewer.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.reviewer_id'))

        LEFT JOIN 
        staffs AS allocated_to_other ON allocated_to_other.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.allocated_to_other_id'))

         LEFT JOIN 
         services ON services.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.service_id'))

         LEFT JOIN 
         job_types ON job_types.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.job_type_id'))

         LEFT JOIN 
         master_status ON master_status.id = JSON_UNQUOTE(JSON_EXTRACT(timesheet_filter.filter_record, '$.status_type_id'))


        

        

        ${where}
        ORDER BY timesheet_filter.id DESC
        `;

        // console.log("Get All Filters Query:", query);



        const [result] = await pool.execute(query, [StaffUserId]);
        return { status: true, message: 'Success.', data: result };
    }
    else {
        return { status: false, message: 'Invalid filter type.', data: [] };
    }




}

const deleteFilterId = async (Report) => {


    const { data, StaffUserId } = Report;
    const { type, filterId } = data;

    if (['', null, undefined].includes(filterId)) {
        return { status: false, message: 'Filter ID is required.', data: [] };
    }
    const query = `
        DELETE FROM timesheet_filter 
        WHERE id = ? AND staff_id = ?
        `;
    const [result] = await pool.execute(query, [filterId, StaffUserId]);
    return { status: true, message: 'Record deleted successfully.', data: result };

}

//////// ---------- Save Filters End --------- ////////////

// Staff Work
const getChangedRoleStaff = async (Report) => {
    const { data } = Report;
    const { staffData } = data;

    // console.log("Get Changed Role Staff:", staffData);
    // console.log("Get Changed Role Staff:", staffData.role_id);
    const query = `
        SELECT 
            staffs.id AS staff_id,
            CONCAT(staffs.first_name, ' ', staffs.last_name) AS staff_fullname
        FROM staffs
        WHERE staffs.id != ? AND staffs.role_id = ? AND staffs.status = '1'
    `;
    const [result] = await pool.execute(query, [staffData.id, staffData.role_id]);
    return { status: true, message: 'Success.', data: result };
}

const staffRoleChangeUpdate = async (Report) => {
    const { data } = Report;
    const { editStaffData, updateData, selectedStaff } = data;
    // console.log("Staff Role Change Update:", editStaffData);
    // console.log("Staff Role Change updateData:", updateData);
    // console.log("Staff Role Change selectedStaff:", selectedStaff);

    let role_id = Number(editStaffData?.role_id);
    let update_role_id = Number(updateData?.role);
    let to_staff_id = editStaffData?.id;
    let update_staff_id = selectedStaff?.staff_id;

    let query = [];
    if (role_id !== update_role_id) {
        query.push(`UPDATE staffs SET role_id = ${update_role_id} WHERE id = ${to_staff_id}`);
    }



    if (role_id == 3) {
        query.push(`UPDATE jobs SET allocated_to = ${update_staff_id} WHERE allocated_to = ${to_staff_id}`);
    }
    else if (role_id == 6) {
        query.push(`UPDATE jobs SET reviewer = ${update_staff_id} WHERE reviewer = ${to_staff_id}`);
    }
    else if (role_id == 4) {
        query.push(`UPDATE jobs SET reviewer = ${update_staff_id} WHERE reviewer = ${to_staff_id}`);

        query.push(`UPDATE jobs SET allocated_to = ${update_staff_id} WHERE allocated_to = ${to_staff_id}`);

        query.push(`UPDATE jobs SET account_manager_id = ${update_staff_id} WHERE account_manager_id = ${to_staff_id}`);

        query.push(`UPDATE customers SET account_manager_id = ${update_staff_id} WHERE account_manager_id = ${to_staff_id}`);

        query.push(`UPDATE IGNORE customer_service_account_managers SET account_manager_id = ${update_staff_id} WHERE account_manager_id = ${to_staff_id}`);

    }


    /// query = query.join(";");

    // console.log("Staff Role Change Update Query:", query);
    try {

        await Promise.all(query.map(q => pool.execute(q)));

        return { status: true, message: 'Success.', data: [] };
    } catch (error) {
        console.error("Staff Role Change Update Error:", error);
        return { status: false, message: 'Error occurred while updating staff role.', data: [] };
    }



}

/////////////---- START JOB CUSTOM REPORTS ----//////////////////////
const getStaffWithRole = async (Report) => {


    const { data } = Report;
    const { role_id } = data;
    let job_id = data?.filters?.job_id;

    console.log("Get Staff With Role ID: ===>", role_id);
    console.log("Get Staff With Role ID: ===>", job_id);
    if (['', null, undefined].includes(job_id)) {
        if (role_id == "other") {
            const query = `
        SELECT 
        staffs.id,
        staffs.first_name,
        staffs.last_name,
        staffs.email 
        FROM
        job_allowed_staffs 
        JOIN staffs ON staffs.id = job_allowed_staffs.staff_id
        GROUP BY job_allowed_staffs.staff_id
        ORDER BY staffs.first_name ASC;
        `
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };

        }
        if (role_id == "employee_number") {
            const query = `
        SELECT 
        staffs.id,
        staffs.first_name,
        staffs.last_name,
        staffs.email,
        staffs.employee_number
        FROM
        staffs
        GROUP BY staffs.employee_number
        ORDER BY staffs.employee_number ASC;
        `
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };

        }
        else {
            let where = `role_id = ${role_id} AND staffs.status = '1'`;
            if ([3, 6].includes(Number(role_id))) {
                where = `(role_id = ${role_id} || role_id = 4) AND staffs.status = '1'`;
            }
            const query = `
        SELECT
        id,
        first_name,
        last_name,
        email
        FROM 
        staffs 
        WHERE ${where}
        ORDER BY first_name ASC;
    `
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };

        }
    } else {
        if (role_id == "other") {
            const query = `
        SELECT 
        staffs.id,
        staffs.first_name,
        staffs.last_name,
        staffs.email 
        FROM
        job_allowed_staffs
        JOIN staffs ON staffs.id = job_allowed_staffs.staff_id
        WHERE job_allowed_staffs.job_id = ${job_id}
        GROUP BY job_allowed_staffs.staff_id
        ORDER BY staffs.first_name ASC;
        `
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };
        }

        if (role_id == "employee_number") {
            const query = `
        SELECT 
        staffs.id,
        staffs.first_name,
        staffs.last_name,
        staffs.email,
        staffs.employee_number
        FROM
        staffs
        JOIN jobs ON jobs.allocated_to = staffs.id OR jobs.reviewer = staffs.id
        WHERE jobs.id = ${job_id}
        GROUP BY staffs.employee_number
        ORDER BY staffs.employee_number ASC;
        `
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };
        }
        else {
            let where = `staffs.role_id = ${role_id} AND staffs.status = '1'`;
            if ([3, 6].includes(Number(role_id))) {
                where = `(staffs.role_id = ${role_id} || staffs.role_id = 4) AND staffs.status = '1'`;
            }
            let condition = `JOIN jobs ON jobs.account_manager_id = staffs.id
        WHERE ${where} AND jobs.id = ${job_id}`;
            if (role_id == 3) {
                condition = `JOIN jobs ON jobs.allocated_to = staffs.id
        WHERE ${where} AND jobs.id = ${job_id}`;
            }
            else if (role_id == 6) {
                condition = `JOIN jobs ON jobs.reviewer = staffs.id
        WHERE ${where} AND jobs.id = ${job_id}`;
            }

            const query = `
        SELECT
        DISTINCT staffs.id,
        staffs.first_name,
        staffs.last_name,
        staffs.email
        FROM 
        staffs
        ${condition}
        ORDER BY staffs.first_name ASC;
       `
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };
        }



    }
}

const getAllService = async (Report) => {
    let { data } = Report;
    let job_id = data?.filters?.job_id;

    if (['', null, undefined].includes(job_id)) {
        const query = `
    SELECT  
    id,
    name 
    FROM
    services
    WHERE status = '1'
    ORDER BY name ASC;
    `
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success.', data: result };
    }


    const query = `
    SELECT  
    services.id,
    services.name 
    FROM
    services
    JOIN
    jobs ON jobs.service_id = services.id
    WHERE services.status = '1' AND jobs.id = ${job_id}
    ORDER BY services.name ASC;
    `
    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };




}

const getAllJobType = async (Report) => {

    let { data } = Report;
    let job_id = data?.filters?.job_id;
    if (['', null, undefined].includes(job_id)) {
        const query = `
    SELECT  
    id,
    type
    FROM
    job_types
    WHERE status = '1'
    ORDER BY type ASC;
    `
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success.', data: result };
    }

    const query = `
    SELECT
    job_types.id,
    job_types.type
    FROM
    job_types
    JOIN
    jobs ON jobs.job_type_id = job_types.id
    WHERE job_types.status = '1' AND jobs.id = ${job_id}
    ORDER BY job_types.type ASC;
    `
    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}

const getAllStatus = async (Report) => {
    let { data } = Report;
    let job_id = data?.filters?.job_id;
    if (['', null, undefined].includes(job_id)) {
        const query = `
    SELECT  
    id,
    name
    FROM
    master_status
    WHERE status = '1'
    ORDER BY name ASC;
    `
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success.', data: result };
    }

    const query = `
    SELECT
    master_status.id,
    master_status.name
    FROM
    master_status
    JOIN
    jobs ON jobs.status_type = master_status.id
    WHERE master_status.status = '1' AND jobs.id = ${job_id}
    ORDER BY master_status.name ASC;
    `
    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}

////////////////////-----START getJobCustomReports -----//////////////////////
const getJobCustomReport = async (Report) => {
    const { StaffUserId, data } = Report;
     console.log("Call Custome Job Report",data);
    var {
        groupBy = ['job_id'],
        additionalField = [],
        job_id,
        customer_id,
        client_id,
        account_manager_id,
        allocated_to_id,
        reviewer_id,
        allocated_to_other_id,
        service_id,
        job_type_id,
        status_type_id,
        employee_number,


        date_received_on,
        allocated_on,
        job_priority,
        engagement_model,
        customer_account_manager_officer,
        status_updation_date,
        Transactions_Posting_id_2,
        Number_of_Bank_Transactions_id_2,
        Number_of_Journal_Entries_id_2,
        Number_of_Other_Transactions_id_2,
        Number_of_Petty_Cash_Transactions_id_2,
        Number_of_Purchase_Invoices_id_2,
        Number_of_Sales_Invoices_id_2,
        Number_of_Total_Transactions_id_2,
        submission_deadline,
        Tax_Year_id_4,
        If_Sole_Trader_Who_is_doing_Bookkeeping_id_4,
        Whose_Tax_Return_is_it_id_4,
        Type_of_Payslip_id_3,
        Year_Ending_id_1,
        Bookkeeping_Frequency_id_2,
        CIS_Frequency_id_3,
        Filing_Frequency_id_8,
        Management_Accounts_Frequency_id_6,
        Payroll_Frequency_id_3,
        budgeted_hours,
        feedback_incorporation_time,
        review_time,
        total_preparation_time,
        total_time,
        due_on,
        customer_deadline_date,
        expected_delivery_date,
        internal_deadline_date,
        sla_deadline_date,
        Management_Accounts_FromDate_id_6,
        Management_Accounts_ToDate_id_6,

        // Staff Fields
        staff_full_name,
        role,
        staff_email,
        line_manager,
        staff_status,


        line_manager_id,
        timePeriod,
        displayBy,
        fromDate,
        toDate

    } = data.filters;

    let role_user = data?.role?.toUpperCase() || '';



    // console.log("additionalField --- ", additionalField);

    // if (groupBy.length == 0 || ["", null, undefined].includes(timePeriod) || ["", null, undefined].includes(displayBy)) {
    //     return { status: false, message: `empty groupBy field`, data: [] };
    // }

    if (groupBy.length == 0 || ["", null, undefined].includes(timePeriod)) {
        return { status: false, message: `empty groupBy field`, data: [] };
    }
      let GROUPBY = ""
    //    groupBy = ['staff_id','customer_id','client_id'];
    // allowed fields
    const ALLOWED_GROUP_FIELDS = [
        'job_id',
        'customer_id',
        'client_id',
        'account_manager_id',
        'allocated_to_id',
        'reviewer_id',
        'allocated_to_other_id',
        'service_id',
        'job_type_id',
        'status_type_id',
        'employee_number',


        'date_received_on',
        'allocated_on',
        'job_priority',
        'engagement_model',
        'customer_account_manager_officer',
        'status_updation_date',
        'Transactions_Posting_id_2',
        'Number_of_Bank_Transactions_id_2',
        'Number_of_Journal_Entries_id_2',
        'Number_of_Other_Transactions_id_2',
        'Number_of_Petty_Cash_Transactions_id_2',
        'Number_of_Purchase_Invoices_id_2',
        'Number_of_Sales_Invoices_id_2',
        'Number_of_Total_Transactions_id_2',
        'submission_deadline',
        'Tax_Year_id_4',
        'If_Sole_Trader_Who_is_doing_Bookkeeping_id_4',
        'Whose_Tax_Return_is_it_id_4',
        'Type_of_Payslip_id_3',
        'Year_Ending_id_1',
        'Bookkeeping_Frequency_id_2',
        'CIS_Frequency_id_3',
        'Filing_Frequency_id_8',
        'Management_Accounts_Frequency_id_6',
        'Payroll_Frequency_id_3',
        'budgeted_hours',
        'feedback_incorporation_time',
        'review_time',
        'total_preparation_time',
        'total_time',
        'due_on',
        'customer_deadline_date',
        'expected_delivery_date',
        'internal_deadline_date',
        'sla_deadline_date',
        'Management_Accounts_FromDate_id_6',
        'Management_Accounts_ToDate_id_6',
        // Staff Fields
        'staff_full_name',
        'role',
        'staff_email',
        'line_manager',
        'staff_status',



        //'line_manager_id'
    ]
    
    // validate groupBy
    if (!Array.isArray(groupBy)) groupBy = [groupBy];
    for (const g of groupBy) {
        if (!ALLOWED_GROUP_FIELDS.includes(g)) {
            return { status: false, message: `Invalid groupBy field: ${g}`, data: [] };
        }else{
            if (g === 'job_id') {
             GROUPBY = GROUPBY !=""? GROUPBY += " , raw.job_id" :`GROUP BY raw.job_id`;
            }
            else if (g === 'customer_id'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.customer_id" :`GROUP BY raw.customer_id`;
            }
            else if (g === 'client_id'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.client_id" :`GROUP BY raw.client_id`;
            }
            else if (g === 'account_manager_id'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.account_manager_id" :`GROUP BY raw.account_manager_id`;
            }
            else if (g === 'allocated_to_id'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.allocated_to_id" :`GROUP BY raw.allocated_to_id`;
            }
            else if (g === 'reviewer_id'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.reviewer_id" :`GROUP BY raw.reviewer_id`;
            }
            else if (g === 'service_id'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.service_id" :`GROUP BY raw.service_id`;
            }
            else if (g === 'job_type_id'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.job_type_id" :`GROUP BY raw.job_type_id`;
            }
            else if (g === 'status_type_id'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.status_type_id" :`GROUP BY raw.status_type_id`;
            }
            else if (g === 'employee_number'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , sf.employee_number" :`GROUP BY sf.employee_number`;
            }
            else if (g === 'date_received_on'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.date_received_on" :`GROUP BY raw.date_received_on`;
            }
            else if (g === 'allocated_on'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.allocated_on" :`GROUP BY raw.allocated_on`;
            }
            else if (g === 'job_priority'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.job_priority" :`GROUP BY raw.job_priority`;
            }
            else if (g === 'engagement_model'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.engagement_model" :`GROUP BY raw.engagement_model`;
            }
            else if (g === 'customer_account_manager_officer'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , ccd.id" :`GROUP BY ccd.id`;
            }
            else if (g === 'status_updation_date'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.status_updation_date" :`GROUP BY raw.status_updation_date`;
            }
            else if (g === 'Transactions_Posting_id_2'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Transactions_Posting_id_2" :`GROUP BY raw.Transactions_Posting_id_2`;
            }
            else if (g === 'Number_of_Bank_Transactions_id_2'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Number_of_Bank_Transactions_id_2" :`GROUP BY raw.Number_of_Bank_Transactions_id_2`;
            }
            else if (g === 'Number_of_Journal_Entries_id_2'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Number_of_Journal_Entries_id_2" :`GROUP BY raw.Number_of_Journal_Entries_id_2`;
            }
            else if (g === 'Number_of_Other_Transactions_id_2'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Number_of_Other_Transactions_id_2" :`GROUP BY raw.Number_of_Other_Transactions_id_2`;
            }
            else if (g === 'Number_of_Petty_Cash_Transactions_id_2'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Number_of_Petty_Cash_Transactions_id_2" :`GROUP BY raw.Number_of_Petty_Cash_Transactions_id_2`;
            }
            else if (g === 'Number_of_Purchase_Invoices_id_2'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Number_of_Purchase_Invoices_id_2" :`GROUP BY raw.Number_of_Purchase_Invoices_id_2`;
            }
            else if (g === 'Number_of_Sales_Invoices_id_2'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Number_of_Sales_Invoices_id_2" :`GROUP BY raw.Number_of_Sales_Invoices_id_2`;
            }
            else if (g === 'Number_of_Total_Transactions_id_2'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Number_of_Total_Transactions_id_2" :`GROUP BY raw.Number_of_Total_Transactions_id_2`;
            }
            else if (g === 'submission_deadline'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.submission_deadline" :`GROUP BY raw.submission_deadline`;
            }
            else if (g === 'Tax_Year_id_4'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Tax_Year_id_4" :`GROUP BY raw.Tax_Year_id_4`;
            }
            else if (g === 'If_Sole_Trader_Who_is_doing_Bookkeeping_id_4'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4" :`GROUP BY raw.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4`;
            }
            else if (g === 'Whose_Tax_Return_is_it_id_4'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Whose_Tax_Return_is_it_id_4" :`GROUP BY raw.Whose_Tax_Return_is_it_id_4`;
            }
            else if (g === 'Type_of_Payslip_id_3'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Type_of_Payslip_id_3" :`GROUP BY raw.Type_of_Payslip_id_3`;
            }
            else if (g === 'Year_Ending_id_1'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Year_Ending_id_1" :`GROUP BY raw.Year_Ending_id_1`;
            }
            else if (g === 'Bookkeeping_Frequency_id_2'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Bookkeeping_Frequency_id_2" :`GROUP BY raw.Bookkeeping_Frequency_id_2`;
            }
            else if (g === 'CIS_Frequency_id_3'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.CIS_Frequency_id_3" :`GROUP BY raw.CIS_Frequency_id_3`;
            }
            else if (g === 'Filing_Frequency_id_8'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Filing_Frequency_id_8" :`GROUP BY raw.Filing_Frequency_id_8`;
            }
            else if (g === 'Management_Accounts_Frequency_id_6'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Management_Accounts_Frequency_id_6" :`GROUP BY raw.Management_Accounts_Frequency_id_6`;
            }
            else if (g === 'Payroll_Frequency_id_3'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Payroll_Frequency_id_3" :`GROUP BY raw.Payroll_Frequency_id_3`;
            }
            else if (g === 'budgeted_hours'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.budgeted_hours" :`GROUP BY raw.budgeted_hours`;
            }
            else if (g === 'feedback_incorporation_time'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.feedback_incorporation_time" :`GROUP BY raw.feedback_incorporation_time`;
            }
            else if (g === 'review_time'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.review_time" :`GROUP BY raw.review_time`;
            }
            else if (g === 'total_preparation_time'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.total_preparation_time" :`GROUP BY raw.total_preparation_time`;
            }
            else if (g === 'total_time'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.total_time" :`GROUP BY raw.total_time`;
            }
            else if (g === 'due_on'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.due_on" :`GROUP BY raw.due_on`;
            }
            else if (g === 'customer_deadline_date'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.customer_deadline_date" :`GROUP BY raw.customer_deadline_date`;
            }
            else if (g === 'expected_delivery_date'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.expected_delivery_date" :`GROUP BY raw.expected_delivery_date`;
            }
            else if (g === 'internal_deadline_date'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.internal_deadline_date" :`GROUP BY raw.internal_deadline_date`;
            }
            else if (g === 'sla_deadline_date'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.sla_deadline_date" :`GROUP BY raw.sla_deadline_date`;
            }
            else if (g === 'Management_Accounts_FromDate_id_6'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Management_Accounts_FromDate_id_6" :`GROUP BY raw.Management_Accounts_FromDate_id_6`;
            }
            else if (g === 'Management_Accounts_ToDate_id_6'){
            GROUPBY = GROUPBY !=""? GROUPBY += " , raw.Management_Accounts_ToDate_id_6" :`GROUP BY raw.Management_Accounts_ToDate_id_6`;
            }
            
        }
    }

    try {
        // compute date range
        let range;
        try {
            range = await getDateRange(timePeriod, fromDate, toDate);
        } catch (err) {
            return { status: false, message: err.message || 'Invalid date range', data: [] };
        }

        var { fromDate, toDate } = range;

        let where = [`work_date BETWEEN ? AND ?`];



        if (!["", null, undefined].includes(job_id)) {
            where.push(`raw.job_id = ${job_id}`);
        }
        if (!["", null, undefined].includes(customer_id)) {
            where.push(`raw.customer_id = ${customer_id}`);
        }
        if (!["", null, undefined].includes(client_id)) {
            where.push(`raw.client_id = ${client_id}`);
        }
        if (!["", null, undefined].includes(account_manager_id)) {
            where.push(`raw.account_manager_id = ${account_manager_id}`);
        }
        if (!["", null, undefined].includes(allocated_to_id)) {
            where.push(`raw.allocated_to_id = ${allocated_to_id}`);
        }
        if (!["", null, undefined].includes(reviewer_id)) {
            where.push(`raw.reviewer_id = ${reviewer_id}`);
        }
        if (!["", null, undefined].includes(allocated_to_other_id)) {
            where.push(`ato.id = ${allocated_to_other_id}`);
        }
        if (!["", null, undefined].includes(service_id)) {
            where.push(`raw.service_id = ${service_id}`);
        }
        if (!["", null, undefined].includes(job_type_id)) {
            where.push(`raw.job_type_id = ${job_type_id}`);
        }
        if (!["", null, undefined].includes(status_type_id)) {
            where.push(`raw.status_type_id = ${status_type_id}`);
        }
        if (!["", null, undefined].includes(employee_number)) {
            where.push(`sf.employee_number = '${employee_number}'`);
        }




        if (!["", null, undefined].includes(date_received_on)) {
            where.push(`raw.date_received_on = '${date_received_on}'`);
        }
        if (!["", null, undefined].includes(allocated_on)) {
            where.push(`raw.allocated_on = '${allocated_on}'`);
        }
        if (!["", null, undefined].includes(job_priority)) {
            where.push(`raw.job_priority = '${job_priority}'`);
        }
        if (!["", null, undefined].includes(engagement_model)) {
            where.push(`raw.engagement_model = '${engagement_model}'`);
        }
        if (!["", null, undefined].includes(customer_account_manager_officer)) {
            where.push(`ccd.id = ${customer_account_manager_officer}`);
        }
        if (!["", null, undefined].includes(status_updation_date)) {
            where.push(`raw.status_updation_date = '${status_updation_date}'`);
        }
        if (!["", null, undefined].includes(Transactions_Posting_id_2)) {
            where.push(`raw.Transactions_Posting_id_2 = ${Transactions_Posting_id_2}`);
        }
        if (!["", null, undefined].includes(Number_of_Bank_Transactions_id_2)) {
            where.push(`raw.Number_of_Bank_Transactions_id_2 = ${Number_of_Bank_Transactions_id_2}`);
        }
        if (!["", null, undefined].includes(Number_of_Journal_Entries_id_2)) {
            where.push(`raw.Number_of_Journal_Entries_id_2 = ${Number_of_Journal_Entries_id_2}`);
        }
        if (!["", null, undefined].includes(Number_of_Other_Transactions_id_2)) {
            where.push(`raw.Number_of_Other_Transactions_id_2 = ${Number_of_Other_Transactions_id_2}`);
        }
        if (!["", null, undefined].includes(Number_of_Petty_Cash_Transactions_id_2)) {
            where.push(`raw.Number_of_Petty_Cash_Transactions_id_2 = ${Number_of_Petty_Cash_Transactions_id_2}`);
        }
        if (!["", null, undefined].includes(Number_of_Purchase_Invoices_id_2)) {
            where.push(`raw.Number_of_Purchase_Invoices_id_2 = ${Number_of_Purchase_Invoices_id_2}`);
        }
        if (!["", null, undefined].includes(Number_of_Sales_Invoices_id_2)) {
            where.push(`raw.Number_of_Sales_Invoices_id_2 = ${Number_of_Sales_Invoices_id_2}`);
        }
        if (!["", null, undefined].includes(Number_of_Total_Transactions_id_2)) {
            where.push(`raw.Number_of_Total_Transactions_id_2 = ${Number_of_Total_Transactions_id_2}`);
        }
        if (!["", null, undefined].includes(submission_deadline)) {
            where.push(`raw.submission_deadline = '${submission_deadline}'`);
        }
        if (!["", null, undefined].includes(Tax_Year_id_4)) {
            where.push(`raw.Tax_Year_id_4 = ${Tax_Year_id_4}`);
        }
        if (!["", null, undefined].includes(If_Sole_Trader_Who_is_doing_Bookkeeping_id_4)) {
            where.push(`raw.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4 = ${If_Sole_Trader_Who_is_doing_Bookkeeping_id_4}`);
        }
        if (!["", null, undefined].includes(Whose_Tax_Return_is_it_id_4)) {
            where.push(`raw.Whose_Tax_Return_is_it_id_4 = ${Whose_Tax_Return_is_it_id_4}`);
        }
        if (!["", null, undefined].includes(Type_of_Payslip_id_3)) {
            where.push(`raw.Type_of_Payslip_id_3 = ${Type_of_Payslip_id_3}`);
        }
        if (!["", null, undefined].includes(Year_Ending_id_1)) {
            where.push(`raw.Year_Ending_id_1 = ${Year_Ending_id_1}`);
        }
        if (!["", null, undefined].includes(Bookkeeping_Frequency_id_2)) {
            where.push(`raw.Bookkeeping_Frequency_id_2 = ${Bookkeeping_Frequency_id_2}`);
        }
        if (!["", null, undefined].includes(CIS_Frequency_id_3)) {
            where.push(`raw.CIS_Frequency_id_3 = ${CIS_Frequency_id_3}`);
        }
        if (!["", null, undefined].includes(Filing_Frequency_id_8)) {
            where.push(`raw.Filing_Frequency_id_8 = ${Filing_Frequency_id_8}`);
        }
        if (!["", null, undefined].includes(Management_Accounts_Frequency_id_6)) {
            where.push(`raw.Management_Accounts_Frequency_id_6 = ${Management_Accounts_Frequency_id_6}`);
        }
        if (!["", null, undefined].includes(Payroll_Frequency_id_3)) {
            where.push(`raw.Payroll_Frequency_id_3 = ${Payroll_Frequency_id_3}`);
        }
        if (!["", null, undefined].includes(budgeted_hours)) {
            where.push(`raw.budgeted_hours = ${budgeted_hours}`);
        }
        if (!["", null, undefined].includes(feedback_incorporation_time)) {
            where.push(`raw.feedback_incorporation_time = '${feedback_incorporation_time}'`);
        }
        if (!["", null, undefined].includes(review_time)) {
            where.push(`raw.review_time = '${review_time}'`);
        }
        if (!["", null, undefined].includes(total_preparation_time)) {
            where.push(`raw.total_preparation_time = '${total_preparation_time}'`);
        }
        if (!["", null, undefined].includes(total_time)) {
            where.push(`raw.total_time = '${total_time}'`);
        }
        if (!["", null, undefined].includes(due_on)) {
            where.push(`raw.due_on = '${due_on}'`);
        }
        if (!["", null, undefined].includes(customer_deadline_date)) {
            where.push(`raw.customer_deadline_date = '${customer_deadline_date}'`);
        }
        if (!["", null, undefined].includes(expected_delivery_date)) {
            where.push(`raw.expected_delivery_date = '${expected_delivery_date}'`);
        }
        if (!["", null, undefined].includes(internal_deadline_date)) {
            where.push(`raw.internal_deadline_date = '${internal_deadline_date}'`);
        }
        if (!["", null, undefined].includes(sla_deadline_date)) {
            where.push(`raw.sla_deadline_date = '${sla_deadline_date}'`);
        }
        if (!["", null, undefined].includes(Management_Accounts_FromDate_id_6)) {
            where.push(`raw.Management_Accounts_FromDate_id_6 = '${Management_Accounts_FromDate_id_6}'`);
        }
        if (!["", null, undefined].includes(Management_Accounts_ToDate_id_6)) {
            where.push(`raw.Management_Accounts_ToDate_id_6 = '${Management_Accounts_ToDate_id_6}'`);
        }

        // // Staff Fields
        if (!["", null, undefined].includes(staff_full_name)) {
            where.push(`CONCAT(jobcreatestaff.first_name, ' ', jobcreatestaff.last_name) LIKE '%${staff_full_name}%'`);
        }
        if (!["", null, undefined].includes(role)) {
            where.push(`staffrole.role = '${role}'`);
        }
        if (!["", null, undefined].includes(staff_email)) {
            where.push(`jobcreatestaff.email = '${staff_email}'`);
        }
        if (!["", null, undefined].includes(line_manager)) {
            where.push(`CONCAT(managerstaff.first_name, ' ', managerstaff.last_name) LIKE '%${line_manager}%'`);
        }
        if (!["", null, undefined].includes(staff_status)) {
            where.push(`jobcreatestaff.status = '${staff_status}'`);
        }
       

        if(!['SUPERADMIN','ADMIN'].includes(role_user) && !["", null, undefined].includes(StaffUserId)) {
            //where.push(`assigned_jobs_staff_view.staff_id = ${StaffUserId}`);
            where.push(`
                (
                    assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
                    OR raw.staff_created_id IN (${LineManageStaffId})
                    OR cl.staff_created_id IN (${LineManageStaffId})
                )
                `);
        }




       where.push(`(
            assigned_jobs_staff_view.source != 'assign_customer_service'
            OR raw.service_id = assigned_jobs_staff_view.service_id_assign
          )`)


        where = where.length ? `WHERE ${where.join(" AND ")}` : "";

        // console.log("where", where);


        // ===== Final Query =====
        const unpivotSQL = `
            SELECT
                raw.job_id,

                DATE_FORMAT(raw.date_received_on, '%d/%m/%Y') AS date_received_on,
                DATE_FORMAT(raw.allocated_on, '%d/%m/%Y') AS allocated_on,
                DATE_FORMAT(raw.status_updation_date, '%d/%m/%Y') AS status_updation_date,
                raw.job_priority,
                raw.engagement_model,
                raw.Transactions_Posting_id_2,
                raw.Number_of_Bank_Transactions_id_2,
                raw.Number_of_Journal_Entries_id_2,
                raw.Number_of_Other_Transactions_id_2,
                raw.Number_of_Petty_Cash_Transactions_id_2,
                raw.Number_of_Purchase_Invoices_id_2,
                raw.Number_of_Sales_Invoices_id_2,
                raw.Number_of_Total_Transactions_id_2,
                raw.submission_deadline,
                raw.Tax_Year_id_4,
                raw.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4,
                raw.Whose_Tax_Return_is_it_id_4,
                raw.Type_of_Payslip_id_3,
                DATE_FORMAT(raw.Year_Ending_id_1, '%d/%m/%Y') AS Year_Ending_id_1,
                raw.Bookkeeping_Frequency_id_2,
                raw.CIS_Frequency_id_3,
                raw.Filing_Frequency_id_8,
                raw.Management_Accounts_Frequency_id_6,
                raw.Payroll_Frequency_id_3,
                raw.budgeted_hours,
                raw.feedback_incorporation_time,
                raw.review_time,
                raw.total_preparation_time,
                raw.total_time,
                DATE_FORMAT(raw.due_on, '%d/%m/%Y') AS due_on,
                DATE_FORMAT(raw.customer_deadline_date, '%d/%m/%Y') AS customer_deadline_date,
                DATE_FORMAT(raw.expected_delivery_date, '%d/%m/%Y') AS expected_delivery_date,
                DATE_FORMAT(raw.internal_deadline_date, '%d/%m/%Y') AS internal_deadline_date,
                DATE_FORMAT(raw.sla_deadline_date, '%d/%m/%Y') AS sla_deadline_date,
                DATE_FORMAT(raw.Management_Accounts_FromDate_id_6, '%d/%m/%Y') AS Management_Accounts_FromDate_id_6,
                DATE_FORMAT(raw.Management_Accounts_ToDate_id_6, '%d/%m/%Y') AS Management_Accounts_ToDate_id_6,






                CONCAT(jobcreatestaff.first_name, ' ', jobcreatestaff.last_name) AS staff_full_name,
                jobcreatestaff.email AS staff_email,
                staffrole.role AS role,
                jobcreatestaff.status AS staff_status,
                CONCAT(managerstaff.first_name, ' ', managerstaff.last_name) AS line_manager,

                

                CONCAT_WS('::', raw.job_id) AS group_value,
                raw.work_date,
                
                CONCAT(
                    SUBSTRING(c.trading_name, 1, 3), '_',
                    SUBSTRING(cl.trading_name, 1, 3), '_',
                    SUBSTRING(jt.type, 1, 4), '_',
                    SUBSTRING(raw.job_code_id, 1, 15)
                ) AS job_name,
                CONCAT(raw.job_id) AS group_label,
                c.trading_name AS customer_name,
                CONCAT(
                    'cli_', 
                    SUBSTRING(c.trading_name, 1, 3), '_',
                    SUBSTRING(cl.trading_name, 1, 3), '_',
                    SUBSTRING(cl.client_code, 1, 15)
                ) AS client_name,
                CONCAT(am.first_name, ' ', am.last_name) AS account_manager_name,
                CONCAT(at.first_name, ' ', at.last_name) AS allocated_to_name,
                CONCAT(rv.first_name, ' ', rv.last_name) AS reviewer_name,
                CONCAT(ato.first_name, ' ', ato.last_name) AS allocated_to_other_name,
                CONCAT(ccd.first_name, ' ', ccd.last_name) AS customer_account_manager_officer,
                sv.name AS service_name,
                jt.type AS job_type_name,
                st.name AS status_type_name,
                sf.employee_number AS employee_number
            FROM (
                SELECT 
                    j.id AS job_id,
                    j.job_id AS job_code_id,

                    j.date_received_on AS date_received_on,
                    j.allocated_on AS allocated_on,
                    j.job_priority AS job_priority,
                    j.engagement_model AS engagement_model,
                    j.customer_contact_details_id,
                    j.status_updation_date,
                    j.Transactions_Posting_id_2,
                    j.Number_of_Bank_Transactions_id_2,
                    j.Number_of_Journal_Entries_id_2,
                    j.Number_of_Other_Transactions_id_2,
                    j.Number_of_Petty_Cash_Transactions_id_2,
                    j.Number_of_Purchase_Invoices_id_2,
                    j.Number_of_Sales_Invoices_id_2,
                    j.Number_of_Total_Transactions_id_2,
                    j.submission_deadline,
                    j.Tax_Year_id_4,
                    j.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4,
                    j.Whose_Tax_Return_is_it_id_4,
                    j.Type_of_Payslip_id_3,
                    j.Year_Ending_id_1,
                    j.Bookkeeping_Frequency_id_2,
                    j.CIS_Frequency_id_3,
                    j.Filing_Frequency_id_8,
                    j.Management_Accounts_Frequency_id_6,
                    j.Payroll_Frequency_id_3,
                    j.budgeted_hours,
                    j.feedback_incorporation_time,
                    j.review_time,
                    j.total_preparation_time,
                    j.total_time,
                    j.due_on,
                    j.customer_deadline_date,
                    j.expected_delivery_date,
                    j.internal_deadline_date,
                    j.sla_deadline_date,
                    j.Management_Accounts_FromDate_id_6,
                    j.Management_Accounts_ToDate_id_6,



                    j.customer_id,
                    j.client_id,
                    j.job_type_id,
                    j.account_manager_id,
                    j.allocated_to AS allocated_to_id,
                    j.reviewer AS reviewer_id,
                    j.service_id,
                    j.status_type AS status_type_id,
                    j.staff_created_id,
                    j.created_at AS work_date
                FROM jobs AS j
            ) AS raw
            LEFT JOIN customer_contact_details AS ccd ON raw.customer_contact_details_id = ccd.id
            LEFT JOIN customers AS c ON raw.customer_id = c.id
            LEFT JOIN clients AS cl ON raw.client_id = cl.id
            LEFT JOIN job_types AS jt ON raw.job_type_id = jt.id
            LEFT JOIN staffs AS am ON raw.account_manager_id = am.id
            LEFT JOIN staffs AS at ON raw.allocated_to_id = at.id
            LEFT JOIN staffs AS rv ON raw.reviewer_id = rv.id
            LEFT JOIN services AS sv ON raw.service_id = sv.id
            LEFT JOIN master_status AS st ON raw.status_type_id = st.id
            LEFT JOIN staffs AS sf ON raw.staff_created_id = sf.id
            LEFT JOIN job_allowed_staffs AS jas ON jas.job_id = raw.job_id
            LEFT JOIN staffs AS ato ON jas.staff_id = ato.id
            LEFT JOIN staffs AS jobcreatestaff ON raw.staff_created_id = jobcreatestaff.id
            LEFT JOIN roles AS staffrole ON jobcreatestaff.role_id = staffrole.id
            LEFT JOIN line_managers AS lm ON lm.staff_by = jobcreatestaff.id
            LEFT JOIN staffs AS managerstaff ON lm.staff_to = managerstaff.id
            LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = raw.job_id
            ${where}
            ${GROUPBY}
            ORDER BY raw.job_id
        `;

        // console.log("fromDate ---> ", fromDate, "toDate ", toDate);
        // console.log("unpivotSQL", unpivotSQL);

        const conn = await pool.getConnection();
        const [rows] = await conn.execute(unpivotSQL, [fromDate, toDate]);
        conn.release();

        //   console.log("rows.length", rows.length);
        // console.log("rows", rows);


        // Aggregate JS
        // console.log("----groupBy ", groupBy);
        const groups = {};
        const periodSet = new Set();

        for (const r of rows) {
            let workDateStr = r.work_date instanceof Date ? toYMD(r.work_date) : String(r.work_date).slice(0, 10);
            if (!workDateStr) continue;

            // Generate dynamic group key based on multiple groupBy fields
            // Example: customer_name|client_name|account_manager_name|...


            // Map of id → name field relation
            const idToNameMap = {
                id:"job_id",
                job_id: "job_name",
                customer_id: "customer_name",
                client_id: "client_name",
                account_manager_id: "account_manager_name",
                allocated_to_id: "allocated_to_name",
                reviewer_id: "reviewer_name",
                allocated_to_other_id: "allocated_to_other_name",
                service_id: "service_name",
                job_type_id: "job_type_name",
                status_type_id: "status_type_name",
                employee_number: "employee_number",


                date_received_on: "date_received_on",
                allocated_on: "allocated_on",
                job_priority: "job_priority",
                engagement_model: "engagement_model",
                customer_account_manager_officer: "customer_account_manager_officer",
                status_updation_date: "status_updation_date",
                Transactions_Posting_id_2: "Transactions_Posting_id_2",
                Number_of_Bank_Transactions_id_2: "Number_of_Bank_Transactions_id_2",
                Number_of_Journal_Entries_id_2: "Number_of_Journal_Entries_id_2",
                Number_of_Other_Transactions_id_2: "Number_of_Other_Transactions_id_2",
                Number_of_Petty_Cash_Transactions_id_2: "Number_of_Petty_Cash_Transactions_id_2",
                Number_of_Purchase_Invoices_id_2: "Number_of_Purchase_Invoices_id_2",
                Number_of_Sales_Invoices_id_2: "Number_of_Sales_Invoices_id_2",
                Number_of_Total_Transactions_id_2: "Number_of_Total_Transactions_id_2",
                submission_deadline: "submission_deadline",
                Tax_Year_id_4: "Tax_Year_id_4",
                If_Sole_Trader_Who_is_doing_Bookkeeping_id_4: "If_Sole_Trader_Who_is_doing_Bookkeeping_id_4",
                Whose_Tax_Return_is_it_id_4: "Whose_Tax_Return_is_it_id_4",
                Type_of_Payslip_id_3: "Type_of_Payslip_id_3",
                Year_Ending_id_1: "Year_Ending_id_1",
                Bookkeeping_Frequency_id_2: "Bookkeeping_Frequency_id_2",
                CIS_Frequency_id_3: "CIS_Frequency_id_3",
                Filing_Frequency_id_8: "Filing_Frequency_id_8",
                Management_Accounts_Frequency_id_6: "Management_Accounts_Frequency_id_6",
                Payroll_Frequency_id_3: "Payroll_Frequency_id_3",
                budgeted_hours: "budgeted_hours",
                feedback_incorporation_time: "feedback_incorporation_time",
                review_time: "review_time",
                total_preparation_time: "total_preparation_time",
                total_time: "total_time",
                due_on: "due_on",
                customer_deadline_date: "customer_deadline_date",
                expected_delivery_date: "expected_delivery_date",
                internal_deadline_date: "internal_deadline_date",
                sla_deadline_date: "sla_deadline_date",
                Management_Accounts_FromDate_id_6: "Management_Accounts_FromDate_id_6",
                Management_Accounts_ToDate_id_6: "Management_Accounts_ToDate_id_6",

                // staff fields
                staff_full_name: "staff_full_name",
                role: "role",
                staff_email: "staff_email",
                line_manager: "line_manager",
                staff_status: "staff_status",


            };

            // Now dynamically build groupKeyParts
            const groupKeyParts = groupBy.map(idKey => {
                const nameKey = idToNameMap[idKey];
                return r[nameKey] || 'NULL';
            });


            // const groupKeyParts = [
            //     r.group_value || 'NULL',
            //     r.job_name || 'NULL',
            //     r.customer_name || 'NULL',
            //     r.client_name || 'NULL',
            //     r.account_manager_name || 'NULL',
            //     r.allocated_to_name || 'NULL',
            //     r.reviewer_name || 'NULL',
            //     r.allocated_to_other_name || 'NULL',
            //     r.service_name || 'NULL',
            //     r.job_type_name || 'NULL',
            //     r.status_type_name || 'NULL'
            // ];

            const gid = groupKeyParts.join('|'); // unique key for this combination

            const periodKey = getPeriodKey(displayBy, workDateStr);
            if (!periodKey) continue;
            periodSet.add(periodKey);
            if (!groups[gid]) {
                groups[gid] = {
                    //  group_value: gid,
                   
                    id:r.job_id,
                    job_name: r.job_name,
                    customer_name: r.customer_name,
                    client_name: r.client_name,
                    account_manager_name: r.account_manager_name,
                    allocated_to_name: r.allocated_to_name,
                    reviewer_name: r.reviewer_name,
                    allocated_to_other_name: r.allocated_to_other_name,
                    service_name: r.service_name,
                    job_type_name: r.job_type_name,
                    status_type_name: r.status_type_name,
                    employee_number: r.employee_number,



                    // Additional Fields
                    date_received_on: r.date_received_on,
                    allocated_on: r.allocated_on,
                    job_priority: r.job_priority,
                    engagement_model: r.engagement_model,
                    customer_account_manager_officer: r.customer_account_manager_officer,
                    status_updation_date: r.status_updation_date,
                    Transactions_Posting_id_2: r.Transactions_Posting_id_2,
                    Number_of_Bank_Transactions_id_2: r.Number_of_Bank_Transactions_id_2,
                    Number_of_Journal_Entries_id_2: r.Number_of_Journal_Entries_id_2,
                    Number_of_Other_Transactions_id_2: r.Number_of_Other_Transactions_id_2,
                    Number_of_Petty_Cash_Transactions_id_2: r.Number_of_Petty_Cash_Transactions_id_2,
                    Number_of_Purchase_Invoices_id_2: r.Number_of_Purchase_Invoices_id_2,
                    Number_of_Sales_Invoices_id_2: r.Number_of_Sales_Invoices_id_2,
                    Number_of_Total_Transactions_id_2: r.Number_of_Total_Transactions_id_2,
                    submission_deadline: r.submission_deadline,
                    Tax_Year_id_4: r.Tax_Year_id_4,
                    If_Sole_Trader_Who_is_doing_Bookkeeping_id_4: r.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4,
                    Whose_Tax_Return_is_it_id_4: r.Whose_Tax_Return_is_it_id_4,
                    Type_of_Payslip_id_3: r.Type_of_Payslip_id_3,
                    Year_Ending_id_1: r.Year_Ending_id_1,
                    Bookkeeping_Frequency_id_2: r.Bookkeeping_Frequency_id_2,
                    CIS_Frequency_id_3: r.CIS_Frequency_id_3,
                    Filing_Frequency_id_8: r.Filing_Frequency_id_8,
                    Management_Accounts_Frequency_id_6: r.Management_Accounts_Frequency_id_6,
                    Payroll_Frequency_id_3: r.Payroll_Frequency_id_3,
                    budgeted_hours: r.budgeted_hours,
                    feedback_incorporation_time: r.feedback_incorporation_time,
                    review_time: r.review_time,
                    total_preparation_time: r.total_preparation_time,
                    total_time: r.total_time,
                    due_on: r.due_on,
                    customer_deadline_date: r.customer_deadline_date,
                    expected_delivery_date: r.expected_delivery_date,
                    internal_deadline_date: r.internal_deadline_date,
                    sla_deadline_date: r.sla_deadline_date,
                    Management_Accounts_FromDate_id_6: r.Management_Accounts_FromDate_id_6,
                    Management_Accounts_ToDate_id_6: r.Management_Accounts_ToDate_id_6,


                    // Staff Fields
                    staff_full_name: r.staff_full_name,
                    staff_email: r.staff_email,
                    role: r.role,
                    staff_status: r.staff_status,
                    line_manager: r.line_manager,
                    //date: workDateStr,
                    jobIds: new Set(),
                    periodSeconds: {}
                };
            }

            const g = groups[gid];
            // Add job to set to prevent duplicate IDs
            g.jobIds.add(r.job_id);
            // Increment count for that period
            g.periodSeconds[periodKey] = (g.periodSeconds[periodKey] || 0) + 1;
        }

        const periods = Array.from(periodSet).sort((a, b) => a.localeCompare(b));
        const outRows = [];

        for (const gid of Object.keys(groups)) {
            const g = groups[gid];
            const row = {};
            // fill group fields
           
            row['id'] = g.id;
            row['job_id'] = g.job_name;
            row['customer_id'] = g.customer_name;
            row['client_id'] = g.client_name;
            row['account_manager_id'] = g.account_manager_name;
            row['allocated_to_id'] = g.allocated_to_name;
            row['reviewer_id'] = g.reviewer_name;
            row['allocated_to_other_id'] = g.allocated_to_other_name;
            row['service_id'] = g.service_name;
            row['job_type_id'] = g.job_type_name;
            row['status_type_id'] = g.status_type_name;
            row['employee_number'] = g.employee_number;


            // Additional fields
            row['date_received_on'] = g.date_received_on;
            row['allocated_on'] = g.allocated_on;
            row['job_priority'] = g.job_priority;
            row['engagement_model'] = g?.engagement_model?.replace(/_/g, " ")?.replace(/\b\w/g, (c) => c?.toUpperCase());
            row['customer_account_manager_officer'] = g.customer_account_manager_officer;
            row['status_updation_date'] = g.status_updation_date;
            row['Transactions_Posting_id_2'] = g.Transactions_Posting_id_2;
            row['Number_of_Bank_Transactions_id_2'] = g.Number_of_Bank_Transactions_id_2;
            row['Number_of_Journal_Entries_id_2'] = g.Number_of_Journal_Entries_id_2;
            row['Number_of_Other_Transactions_id_2'] = g.Number_of_Other_Transactions_id_2;
            row['Number_of_Petty_Cash_Transactions_id_2'] = g.Number_of_Petty_Cash_Transactions_id_2;
            row['Number_of_Purchase_Invoices_id_2'] = g.Number_of_Purchase_Invoices_id_2;
            row['Number_of_Sales_Invoices_id_2'] = g.Number_of_Sales_Invoices_id_2;
            row['Number_of_Total_Transactions_id_2'] = g.Number_of_Total_Transactions_id_2;
            row['submission_deadline'] = g.submission_deadline;
            row['Tax_Year_id_4'] = g.Tax_Year_id_4;
            row['If_Sole_Trader_Who_is_doing_Bookkeeping_id_4'] = g.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4;
            row['Whose_Tax_Return_is_it_id_4'] = g.Whose_Tax_Return_is_it_id_4;
            row['Type_of_Payslip_id_3'] = g.Type_of_Payslip_id_3;
            row['Year_Ending_id_1'] = g.Year_Ending_id_1;
            row['Bookkeeping_Frequency_id_2'] = g.Bookkeeping_Frequency_id_2;
            row['CIS_Frequency_id_3'] = g.CIS_Frequency_id_3;
            row['Filing_Frequency_id_8'] = g.Filing_Frequency_id_8;
            row['Management_Accounts_Frequency_id_6'] = g.Management_Accounts_Frequency_id_6;
            row['Payroll_Frequency_id_3'] = g.Payroll_Frequency_id_3;
            row['budgeted_hours'] = g.budgeted_hours;
            row['feedback_incorporation_time'] = g.feedback_incorporation_time;
            row['review_time'] = g.review_time;
            row['total_preparation_time'] = g.total_preparation_time;
            row['total_time'] = g.total_time;
            row['due_on'] = g.due_on;
            row['customer_deadline_date'] = g.customer_deadline_date;
            row['expected_delivery_date'] = g.expected_delivery_date;
            row['internal_deadline_date'] = g.internal_deadline_date;
            row['sla_deadline_date'] = g.sla_deadline_date;
            row['Management_Accounts_FromDate_id_6'] = g.Management_Accounts_FromDate_id_6;
            row['Management_Accounts_ToDate_id_6'] = g.Management_Accounts_ToDate_id_6;






            row['staff_full_name'] = g.staff_full_name;
            row['staff_email'] = g.staff_email;
            row['role'] = g.role;
            row['staff_status'] = g.staff_status == '1' ? 'Active' : 'Inactive';
            row['line_manager'] = g.line_manager;

            // fill counts for each period

            if (!['', null, undefined].includes(displayBy)) {
                let totalCount = 0;
                for (const p of periods) {
                    const count = g.periodSeconds[p] || 0;
                    row[p] = count;
                    totalCount += count;
                }
                // total_count = total number of jobs in all periods
                row['total_count'] = totalCount;
            }


            //row.date = g.date;
            outRows.push(row);
        }

         console.log("outRows --->>>", outRows);
        // console.log("displayBy --->>>", displayBy);
        let total_count = [];
        let weeks = [];
        if (!['', null, undefined].includes(displayBy)) {
            total_count.push('total_count');
            weeks = getWeekEndings(new Date(fromDate), new Date(toDate), displayBy);
        }


        // const columnsWeeks = [
        //     ...groupBy,
        //     ...weeks,
        //     //'date',
        //     ...additionalField,
        //    'total_count'
        // ];
        const columnsWeeks = [
            ...groupBy,
            ...weeks,
            ...total_count
        ];
        const finalRows = normalizeRows(columnsWeeks, outRows);


        const fixed = [...groupBy];
        const dynamic = columnsWeeks.filter(col => !fixed.includes(col));
        const columnsWeeksDecOrder = [...fixed, ...dynamic?.reverse()];

        return {
            status: true,
            message: 'Success.',
            data: {
                meta: { fromDate, toDate, groupBy, displayBy, timePeriod },
                //columns: columnsWeeks,
                columns: columnsWeeksDecOrder,
                rows: finalRows
            }
        };

    } catch (err) {
        console.error(err);
        return { status: false, message: err.message || 'server error', data: [] };
    }
};
/////////////------- END getJobCustomReports END-------//////////////////////


///////////// ---- END JOB CUSTOM REPORTS ----//////////////////////



module.exports = {
    jobStatusReports,
    jobReceivedSentReports,
    jobSummaryReports,
    jobPendingReports,
    teamMonthlyReports,
    dueByReport,
    reportCountJob,
    taxWeeklyStatusReport,
    taxWeeklyStatusReportFilterKey,
    averageTatReport,
    getAllTaskByStaff,
    getTimesheetReportData,
    getAllJobsSidebar,
    getInternalJobs,
    getInternalTasks,
    missingTimesheetReport,
    discrepancyReport,
    discrepancyReportProcessor,
    capacityReport,
    getChangedRoleStaff,
    staffRoleChangeUpdate,
    saveFilters,
    getAllFilters,
    deleteFilterId,
    getStaffWithRole,
    getAllService,
    getAllJobType,
    getAllStatus,
    getJobCustomReport
};










// MISSING TIMESHEET REPORT STORED PROCEDURE

// DELIMITER $$

// CREATE PROCEDURE GetLastWeekMissingTimesheetReport(IN p_StaffUserId INT)
// BEGIN
//     DECLARE v_role_name VARCHAR(50);
//     DECLARE done INT DEFAULT 0;
//     DECLARE current_staff INT;

//     -- 1. Get role
//     SELECT r.role INTO v_role_name
//     FROM staffs s
//     JOIN roles r ON s.role_id = r.id
//     WHERE s.id = p_StaffUserId
//     LIMIT 1;

//     -- 2. Temporary table for queue (simulate JS queue)
//     CREATE TEMPORARY TABLE tmp_queue (
//         staff_id INT PRIMARY KEY
//     );
//     TRUNCATE TABLE tmp_queue;

//     -- 3. Temporary table for all collected staff IDs
//     CREATE TEMPORARY TABLE tmp_all_staffs (
//         staff_id INT PRIMARY KEY
//     );
//     TRUNCATE TABLE tmp_all_staffs;

//     -- Insert initial staff into both tables
//     INSERT INTO tmp_queue(staff_id) VALUES (p_StaffUserId);
//     INSERT INTO tmp_all_staffs(staff_id) VALUES (p_StaffUserId);

//     -- 4. Iterative loop simulating JS queue
//     WHILE EXISTS (SELECT 1 FROM tmp_queue) DO
//         -- Take one staff from queue
//         SELECT staff_id INTO current_staff FROM tmp_queue LIMIT 1;

//         -- Delete it from queue
//         DELETE FROM tmp_queue WHERE staff_id = current_staff;

//         -- Insert subordinates who are not already in all_staffs
//         INSERT IGNORE INTO tmp_queue(staff_id)
//         SELECT staff_to
//         FROM line_managers
//         WHERE staff_by = current_staff
//         AND staff_to NOT IN (SELECT staff_id FROM tmp_all_staffs);

//         -- Insert the same new staff into all_staffs
//         INSERT IGNORE INTO tmp_all_staffs(staff_id)
//         SELECT staff_to
//         FROM line_managers
//         WHERE staff_by = current_staff;
//     END WHILE;

//     -- 5. Build WHERE clause
//     SET @where_clause = '';
//     IF v_role_name IN ('SUPERADMIN', 'ADMIN', 'MANAGEMENT') THEN
//         SET @where_clause = "ts.submit_status = '0' OR ts.submit_status IS NULL";
//     ELSE
//         SET @where_clause = "(ts.submit_status = '0' OR ts.submit_status IS NULL) AND st.id IN (SELECT staff_id FROM tmp_all_staffs)";
//     END IF;

//     -- 6. Final dynamic SQL
//     SET @sql = CONCAT("
//         SELECT
//             CONCAT(st.first_name, ' ', st.last_name) AS staff_fullname,
//             st.email AS staff_email,
//             st.id AS staff_id,
//             COALESCE(ts.submit_status, 0) AS submit_status,
//             COALESCE(
//                 DATE_FORMAT(ts.monday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.tuesday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.wednesday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.thursday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.friday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.saturday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.sunday_date, '%Y-%m-%d')
//             ) AS week_date
//         FROM staffs st
//         LEFT JOIN timesheet ts
//             ON st.id = ts.staff_id
//             AND YEARWEEK(
//                 COALESCE(
//                     ts.monday_date,
//                     ts.tuesday_date,
//                     ts.wednesday_date,
//                     ts.thursday_date,
//                     ts.friday_date,
//                     ts.saturday_date,
//                     ts.sunday_date
//                 ), 1
//             ) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
//         WHERE ", @where_clause, "
//         GROUP BY st.id, st.first_name, st.last_name, st.email, ts.submit_status, week_date
//         ORDER BY st.first_name ASC
//     ");

//     -- 7. Execute
//     PREPARE stmt FROM @sql;
//     EXECUTE stmt;
//     DEALLOCATE PREPARE stmt;

//     -- 8. Cleanup
//     DROP TEMPORARY TABLE IF EXISTS tmp_queue;
//     DROP TEMPORARY TABLE IF EXISTS tmp_all_staffs;

// END $$

// DELIMITER ;






/////////// ///------  Submit TimeSheet Report store procedure------//////////////////////

// DELIMITER $$

// CREATE PROCEDURE GetLastWeekSubmitTimesheetReport(IN p_StaffUserId INT)
// BEGIN
//     DECLARE v_role_name VARCHAR(50);
//     DECLARE done INT DEFAULT 0;
//     DECLARE current_staff INT;

//     -- 1. Get role
//     SELECT r.role INTO v_role_name
//     FROM staffs s
//     JOIN roles r ON s.role_id = r.id
//     WHERE s.id = p_StaffUserId
//     LIMIT 1;

//     -- 2. Temporary table for queue (simulate JS queue)
//     CREATE TEMPORARY TABLE tmp_queue (
//         staff_id INT PRIMARY KEY
//     );
//     TRUNCATE TABLE tmp_queue;

//     -- 3. Temporary table for all collected staff IDs
//     CREATE TEMPORARY TABLE tmp_all_staffs (
//         staff_id INT PRIMARY KEY
//     );
//     TRUNCATE TABLE tmp_all_staffs;

//     -- Insert initial staff into both tables
//     INSERT INTO tmp_queue(staff_id) VALUES (p_StaffUserId);
//     INSERT INTO tmp_all_staffs(staff_id) VALUES (p_StaffUserId);

//     -- 4. Iterative loop simulating JS queue
//     WHILE EXISTS (SELECT 1 FROM tmp_queue) DO
//         -- Take one staff from queue
//         SELECT staff_id INTO current_staff FROM tmp_queue LIMIT 1;

//         -- Delete it from queue
//         DELETE FROM tmp_queue WHERE staff_id = current_staff;

//         -- Insert subordinates who are not already in all_staffs
//         INSERT IGNORE INTO tmp_queue(staff_id)
//         SELECT staff_to
//         FROM line_managers
//         WHERE staff_by = current_staff
//         AND staff_to NOT IN (SELECT staff_id FROM tmp_all_staffs);

//         -- Insert the same new staff into all_staffs
//         INSERT IGNORE INTO tmp_all_staffs(staff_id)
//         SELECT staff_to
//         FROM line_managers
//         WHERE staff_by = current_staff;
//     END WHILE;

//     -- 5. Build WHERE clause
//     SET @where_clause = '';
//     IF v_role_name IN ('SUPERADMIN', 'ADMIN', 'MANAGEMENT') THEN
//         SET @where_clause = "ts.submit_status = '1'";
//     ELSE
//         SET @where_clause = "(ts.submit_status = '1') AND st.id IN (SELECT staff_id FROM tmp_all_staffs)";
//     END IF;

//     -- 6. Final dynamic SQL
//     SET @sql = CONCAT("
//         SELECT
//             CONCAT(st.first_name, ' ', st.last_name) AS staff_fullname,
//             st.email AS staff_email,
//             st.id AS staff_id,
//             COALESCE(ts.submit_status, 0) AS submit_status,
//             COALESCE(
//                 DATE_FORMAT(ts.monday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.tuesday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.wednesday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.thursday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.friday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.saturday_date, '%Y-%m-%d'),
//                 DATE_FORMAT(ts.sunday_date, '%Y-%m-%d')
//             ) AS week_date
//         FROM staffs st
//         LEFT JOIN timesheet ts
//             ON st.id = ts.staff_id
//             AND YEARWEEK(
//                 COALESCE(
//                     ts.monday_date,
//                     ts.tuesday_date,
//                     ts.wednesday_date,
//                     ts.thursday_date,
//                     ts.friday_date,
//                     ts.saturday_date,
//                     ts.sunday_date
//                 ), 1
//             ) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
//         WHERE ", @where_clause, "
//         GROUP BY st.id, st.first_name, st.last_name, st.email, ts.submit_status, week_date
//         ORDER BY st.first_name ASC
//     ");

//     -- 7. Execute
//     PREPARE stmt FROM @sql;
//     EXECUTE stmt;
//     DEALLOCATE PREPARE stmt;

//     -- 8. Cleanup
//     DROP TEMPORARY TABLE IF EXISTS tmp_queue;
//     DROP TEMPORARY TABLE IF EXISTS tmp_all_staffs;

// END $$

// DELIMITER ;





















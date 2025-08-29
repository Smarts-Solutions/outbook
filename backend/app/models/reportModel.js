const { response } = require('express');
const pool = require('../config/database');
const { SatffLogUpdateOperation, LineManageStaffIdHelperFunction,
    QueryRoleHelperFunction } = require('../utils/helper');

const jobStatusReports = async (Report) => {
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
         jobs.id AS id,
         CONCAT(
                SUBSTRING(customers.trading_name, 1, 3), '_',
                SUBSTRING(clients.trading_name, 1, 3), '_',
                SUBSTRING(job_types.type, 1, 4), '_',
                SUBSTRING(jobs.job_id, 1, 15)
                ) AS job_code_id,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        clients.id AS client_id,
        clients.trading_name AS client_trading_name,
        staffs3.id AS account_manager_id,
        CONCAT(
         staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
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
         DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on
         FROM 
         jobs
         JOIN 
         clients ON jobs.client_id = clients.id
         JOIN 
         customers ON jobs.customer_id = customers.id
         JOIN 
         job_types ON jobs.job_type_id = job_types.id
         JOIN 
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
         queries ON queries.job_id = jobs.id
         LEFT JOIN
         drafts ON drafts.job_id = jobs.id
         ORDER BY jobs.id DESC
         `;
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };
        }

        // Other Role Data
        const query = `
        SELECT 
         jobs.id AS id,

        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id,


         CONCAT(
                SUBSTRING(customers.trading_name, 1, 3), '_',
                SUBSTRING(clients.trading_name, 1, 3), '_',
                SUBSTRING(job_types.type, 1, 4), '_',
                SUBSTRING(jobs.job_id, 1, 15)
                ) AS job_code_id,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        clients.id AS client_id,
        clients.trading_name AS client_trading_name,
        staffs3.id AS account_manager_id,
        CONCAT(
         staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
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
         DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on
         FROM 
         jobs
         LEFT JOIN 
         assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
         JOIN 
         clients ON jobs.client_id = clients.id
         JOIN 
         customers ON jobs.customer_id = customers.id
         JOIN 
         job_types ON jobs.job_type_id = job_types.id
         JOIN 
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
         queries ON queries.job_id = jobs.id
         LEFT JOIN
         drafts ON drafts.job_id = jobs.id
         WHERE
         assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})
         GROUP BY jobs.id
         ORDER BY jobs.id DESC
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
            return { status: true, message: "Success.", data: resultAssignCustomer };
        }
        //////-----END Assign Customer Service Data END----////////


        return { status: true, message: 'Success.', data: result };




    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }

}

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


        // console.log("result", result);
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
        const query = `
        SELECT 

        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id,

        master_status.name AS job_status,
        master_status.name AS job_status,
        COUNT(jobs.status_type) AS number_of_job,
        GROUP_CONCAT(jobs.id) AS job_ids
        FROM 
            jobs
        LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id    
        LEFT JOIN 
            master_status ON master_status.id = jobs.status_type
        WHERE 
            assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})
        GROUP BY 
             master_status.name, jobs.status_type
         `;
        const [result] = await pool.execute(query);


        console.log("result", result);

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
            return { status: true, message: "Success.", data: resultAssignCustomer };
        }
        //////-----END Assign Customer Service Data END----////////

        return { status: true, message: 'Success.', data: result };


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

        const query = `
       SELECT 
        master_status.name AS job_status,
        job_types.type AS job_type_name,
        COUNT(jobs.status_type) AS number_of_job,
        GROUP_CONCAT(jobs.id) AS job_ids
        FROM 
            jobs
        LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id    
        LEFT JOIN 
            master_status ON master_status.id = jobs.status_type
        JOIN 
            job_types ON jobs.job_type_id = job_types.id
        WHERE
        (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})) 
        AND jobs.status_type != 6 
        GROUP BY 
            master_status.name, jobs.status_type
         `;
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success.', data: result };



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

const taxWeeklyStatusReport = async (Report) => {
    try {
        const { StaffUserId, customer_id, job_status_type_id, processor_id, reviewer_id } = Report;

        // Line Manager
        const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

        // Get Role
        const rows = await QueryRoleHelperFunction(StaffUserId)


        const currentYear = new Date().getFullYear();
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31);
        let weeks = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const weekNum = getWeekNumber(currentDate);
            const yearWeek = `${currentDate.getFullYear()}${String(weekNum).padStart(2, '0')}`;
            weeks.push(`COUNT(CASE WHEN YEARWEEK(jobs.created_at, 1) = ${yearWeek} THEN jobs.id END) AS WE_${weekNum}_${currentDate.getFullYear()}`);
            weeks.push(`GROUP_CONCAT(CASE WHEN YEARWEEK(jobs.created_at, 1) = ${yearWeek} THEN jobs.id END) AS job_ids_${weekNum}_${currentDate.getFullYear()}`);
            currentDate.setDate(currentDate.getDate() + 7);
        }
        const weeks_sql = weeks.join(",\n    ");



        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

        let query = `
            SELECT
                master_status.name AS job_status,
                customers.trading_name AS customer_name,
                ${weeks_sql},
                GROUP_CONCAT(jobs.id) AS job_ids,
                COUNT(jobs.id) AS Grand_Total
            FROM 
                customers
            LEFT JOIN 
                assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
             `;


        if (job_status_type_id != undefined && job_status_type_id != "") {
            query += `
                LEFT JOIN 
                jobs ON jobs.customer_id = customers.id AND jobs.status_type = ${job_status_type_id}
                LEFT JOIN 
                master_status ON master_status.id = jobs.status_type`;
        } else {
            query += `
                LEFT JOIN 
                jobs ON jobs.customer_id = customers.id AND jobs.status_type = 6
                LEFT JOIN 
                master_status ON master_status.id = jobs.status_type`;
        }

        let conditions = [];

        if (customer_id != undefined && customer_id != "") {
            conditions.push(`customers.id = ${customer_id}`);
        }

        if (processor_id != undefined && processor_id != "") {
            conditions.push(`jobs.allocated_to = ${processor_id}`);
        }

        if (reviewer_id != undefined && reviewer_id != "") {
            conditions.push(`jobs.reviewer = ${reviewer_id}`);
        }


        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
            if (conditions.length > 0) {
                query += ` WHERE ${conditions.join(" AND ")}`;
            }
        } else {
            if (conditions.length > 0) {
                query += ` WHERE (customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})) AND
             ${conditions.join(" AND ")}`;
            } else {
                query += ` WHERE customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})`;
            }

        }


        // if (conditions.length > 0) {
        //     query += ` WHERE ${conditions.join(" AND ")}`;
        // }

        query += `
            GROUP BY 
                master_status.name, 
                customers.trading_name
            ORDER BY 
                customers.id ASC
            `;

        const [result] = await pool.execute(query);
        let weekArray = [];
        const formattedResult = result.map(row => {
            const weeksData = {};
            for (let i = 1; i <= 53; i++) {
                weeksData[`WE_${i}_${currentYear}`] = {
                    count: row[`WE_${i}_${currentYear}`] || 0,
                    job_ids: row[`job_ids_${i}_${currentYear}`] ? row[`job_ids_${i}_${currentYear}`] : ""
                };
            }
            weekArray.push(weeksData);
            return {
                job_status: row.job_status,
                job_type_name: row.job_type_name,
                customer_name: row.customer_name,
                weeks: weekArray,
                Grand_Total: {
                    count: row.Grand_Total,
                    job_ids: row.job_ids
                }

            };
        });

        return { status: true, message: 'Success.', data: formattedResult };

    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting tax status weekly report.' };
    }
}

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
        customers.id DESC;
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
        customers.id DESC;
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
         staffs.role_id = 6   
        ORDER BY 
         staffs.id DESC;
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
         staffs.role_id = 3   
        ORDER BY 
         staffs.id DESC;
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
       master_status.id DESC;
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

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
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
        WHERE
            jobs.status_type = 6
        GROUP BY
            YEAR(jobs.created_at),
            MONTH(jobs.created_at)
            ORDER BY
            jobs.created_at DESC
       `;
            //      const query = `
            //      SELECT
            //      CASE 
            //          WHEN MONTH(jobs.created_at) = MONTH(CURDATE()) AND YEAR(jobs.created_at) = YEAR(CURDATE()) THEN 'Current'
            //          ELSE DATE_FORMAT(jobs.created_at, '%b %Y')
            //      END AS month,

            //      -- Calculate the total count of jobs for the month
            //      COUNT(jobs.id) AS job_count,

            //      -- Calculate the number of days in the current month (for averaging)
            //      DAY(LAST_DAY(jobs.created_at)) AS days_in_month,

            //      -- Calculate the average turnaround time (TAT) per day
            //      AVG(DATEDIFF(jobs.updated_at, jobs.created_at)) / DAY(LAST_DAY(jobs.created_at)) AS average_tat_per_day,

            //      -- Concatenate job IDs for each month
            //      GROUP_CONCAT(jobs.id ORDER BY jobs.created_at) AS job_ids

            //  FROM
            //      jobs
            //  WHERE
            //      jobs.status_type = 6
            //  GROUP BY
            //      YEAR(jobs.created_at),
            //      MONTH(jobs.created_at)
            //      ORDER BY
            //      jobs.created_at DESC
            //       `;
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };
        }

        // Other Data Role
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
        WHERE
            (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})) AND
            jobs.status_type = 6
        GROUP BY
            YEAR(jobs.created_at),
            MONTH(jobs.created_at)
            ORDER BY
            jobs.created_at DESC
       `;
        //      const query = `
        //      SELECT
        //      CASE 
        //          WHEN MONTH(jobs.created_at) = MONTH(CURDATE()) AND YEAR(jobs.created_at) = YEAR(CURDATE()) THEN 'Current'
        //          ELSE DATE_FORMAT(jobs.created_at, '%b %Y')
        //      END AS month,

        //      -- Calculate the total count of jobs for the month
        //      COUNT(jobs.id) AS job_count,

        //      -- Calculate the number of days in the current month (for averaging)
        //      DAY(LAST_DAY(jobs.created_at)) AS days_in_month,

        //      -- Calculate the average turnaround time (TAT) per day
        //      AVG(DATEDIFF(jobs.updated_at, jobs.created_at)) / DAY(LAST_DAY(jobs.created_at)) AS average_tat_per_day,

        //      -- Concatenate job IDs for each month
        //      GROUP_CONCAT(jobs.id ORDER BY jobs.created_at) AS job_ids

        //  FROM
        //      jobs
        //  WHERE
        //      jobs.status_type = 6
        //  GROUP BY
        //      YEAR(jobs.created_at),
        //      MONTH(jobs.created_at)
        //      ORDER BY
        //      jobs.created_at DESC
        //       `;
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



const getTimesheetReportData = async (Report) => {
    const { StaffUserId, data } = Report;
    console.log("Report in getTimesheetReportData", data.filters);
    let {
        groupBy,
        fieldsToDisplay,
        fieldsToDisplayId,
        timePeriod,
        displayBy,
        fromDate,
        toDate
    } = data.filters;

    let where = [];


    // group by employee condition
    if (groupBy == "employee") {
        // Get Role
        const rows = await QueryRoleHelperFunction(StaffUserId)
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN")) {
            if(fieldsToDisplayId !== null){
                where.push(`timesheet.staff_id = ${fieldsToDisplayId}`);  
            }

        } else {
            where.push(`timesheet.staff_id = ${StaffUserId}`);
        }
    }






    // time timePeriod
    if (timePeriod) {
        const currentDate = new Date();
        let startDate, endDate;

        switch (timePeriod) {
            case 'this_week':
                const firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // Sunday as the first day
                startDate = new Date(currentDate.setDate(firstDayOfWeek));
                endDate = new Date(currentDate.setDate(firstDayOfWeek + 6));
                break;
            case 'last_week':
                const firstDayOfLastWeek = currentDate.getDate() - currentDate.getDay() - 7;
                startDate = new Date(currentDate.setDate(firstDayOfLastWeek));
                endDate = new Date(currentDate.setDate(firstDayOfLastWeek + 6));
                break;
            case 'this_month':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                break;
            case 'last_month':
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                break;
            case 'this_year':
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                endDate = new Date(currentDate.getFullYear(), 11, 31);
                break;
            case 'last_year':
                startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
                endDate = new Date(currentDate.getFullYear() - 1, 11, 31);
                break;
            default:
                startDate = null;
                endDate = null;
        }

        if (startDate && endDate) {
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];
            where.push(`timesheet.created_at BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`);
        }
    }




    // fromDate and toDate
    if (timePeriod == "custom" || fromDate) {
        where.push(`timesheet.created_at >= '${fromDate}'`);
    }

    // toDate condition
    if (timePeriod == "custom" || toDate) {
        where.push(`timesheet.created_at <= '${toDate}'`);
    }


    if (where.length > 0) {
        where = `WHERE ${where.join(" AND ")}`;
    } else {
        where = "";
    }

    console.log("where", where);

    const query = `
    SELECT 
    staffs.email AS employee_email,
    timesheet.*
    FROM 
    timesheet
    JOIN staffs ON timesheet.staff_id = staffs.id
    ${where}
    `;
    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}

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
    getTimesheetReportData
};
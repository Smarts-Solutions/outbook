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
    const query = `SELECT * FROM internal ORDER BY id DESC`;
    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}

const getInternalTasks = async (Report) => {
    const query = `SELECT * FROM sub_internal ORDER BY id DESC`;
    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}

// const getTimesheetReportData = async (Report) => {
//     const { StaffUserId, data } = Report;
//     // console.log("Report in getTimesheetReportData", data.filters);
//     let {
//         groupBy,
//         internal_external,
//         fieldsToDisplay,
//         fieldsToDisplayId,
//         timePeriod,
//         displayBy,
//         fromDate,
//         toDate
//     } = data.filters;

//     console.log("groupBy", data.filters);

//     let where = [];

//     const baseQuery = `
//   SELECT staff_id, monday_date AS work_date, monday_hours AS work_hours FROM timesheet WHERE monday_date IS NOT NULL
//   UNION ALL
//   SELECT staff_id, tuesday_date, tuesday_hours FROM timesheet WHERE tuesday_date IS NOT NULL
//   UNION ALL
//   SELECT staff_id, wednesday_date, wednesday_hours FROM timesheet WHERE wednesday_date IS NOT NULL
//   UNION ALL
//   SELECT staff_id, thursday_date, thursday_hours FROM timesheet WHERE thursday_date IS NOT NULL
//   UNION ALL
//   SELECT staff_id, friday_date, friday_hours FROM timesheet WHERE friday_date IS NOT NULL
//   UNION ALL
//   SELECT staff_id, saturday_date, saturday_hours FROM timesheet WHERE saturday_date IS NOT NULL
//   UNION ALL
//   SELECT staff_id, sunday_date, sunday_hours FROM timesheet WHERE sunday_date IS NOT NULL
// `;

//     function getDateRange(timePeriod) {
//         const today = new Date();
//         let start, end;

//         switch (timePeriod) {
//             case "this_week": {
//                 const day = today.getDay();
//                 const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday start
//                 start = new Date(today.getFullYear(), today.getMonth(), diff);
//                 end = new Date(start);
//                 end.setDate(start.getDate() + 6);
//                 break;
//             }
//             case 'last_week': {
//                 const day = today.getDay();
//                 const diff = today.getDate() - day - 6;
//                 start = new Date(today.getFullYear(), today.getMonth(), diff);
//                 end = new Date(start);
//                 end.setDate(start.getDate() + 6);
//                 break;
//             }
//             case "this_month": {
//                 start = new Date(today.getFullYear(), today.getMonth(), 1);
//                 end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//                 break;
//             }
//             case "last_month": {
//                 start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//                 end = new Date(today.getFullYear(), today.getMonth(), 0);
//                 break;
//             }
//             case 'this_quarter': {
//                 const currentMonth = today.getMonth();
//                 const quarterStartMonth = currentMonth - (currentMonth % 3);
//                 start = new Date(today.getFullYear(), quarterStartMonth, 1);
//                 end = new Date(today.getFullYear(), quarterStartMonth + 3, 0);
//                 break;
//             }
//             case 'last_quarter': {
//                 const currentMonth = today.getMonth();
//                 const quarterStartMonth = currentMonth - (currentMonth % 3) - 3;
//                 start = new Date(today.getFullYear(), quarterStartMonth, 1);
//                 end = new Date(today.getFullYear(), quarterStartMonth + 3, 0);
//                 break;
//             }
//             case "this_year": {
//                 start = new Date(today.getFullYear(), 0, 1);
//                 end = new Date(today);
//                 break;
//             }
//             case "last_year": {
//                 start = new Date(today.getFullYear() - 1, 0, 1);
//                 end = new Date(today.getFullYear() - 1, 11, 31);
//                 break;
//             }
//             default:
//                 start = new Date(today.getFullYear(), today.getMonth(), 1);
//                 end = today;
//         }
//         start.setHours(0, 0, 0, 0);
//         end.setHours(23, 59, 59, 999);
//         return { start, end };
//     }

//     // generate series of keys based on displayBy
//     function generatePeriods(displayBy, start, end) {
//         const periods = [];
//         let cursor = new Date(start);

//         if (displayBy === "daily") {
//             while (cursor <= end) {
//                 periods.push(cursor.toISOString().split("T")[0]);
//                 cursor.setDate(cursor.getDate() + 1);
//             }
//         }
//         else if (displayBy === "monthly") {
//             while (cursor <= end) {
//                 periods.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`);
//                 cursor.setMonth(cursor.getMonth() + 1);
//             }
//         } else if (displayBy === "yearly") {
//             while (cursor <= end) {
//                 periods.push(cursor.getFullYear().toString());
//                 cursor.setFullYear(cursor.getFullYear() + 1);
//             }
//         }
//         return periods;
//     }

//     async function getPivotReport(options) {
//         const {
//             displayBy = "daily",
//             timePeriod = "this_week",
//             fromDate = null,
//             toDate = null,
//         } = options;

//         const conn = await pool.getConnection();
//         try {
//             const { start, end } = fromDate && toDate
//                 ? { start: new Date(fromDate), end: new Date(toDate) }
//                 : getDateRange(timePeriod);

//             // dynamic period expression
//             let periodExpr;
//             switch (displayBy.toLowerCase()) {
//                 case "daily": periodExpr = "DATE(work_date)"; break;
//                 case "monthly": periodExpr = "DATE_FORMAT(work_date, '%Y-%m')"; break;
//                 case "yearly": periodExpr = "YEAR(work_date)"; break;
//                 default: periodExpr = "DATE(work_date)";
//             }

//             // const query = `
//             //   SELECT 
//             //     staff_id,
//             //     ${periodExpr} AS period_key,
//             //     SUM(TIME_TO_SEC(STR_TO_DATE(work_hours, '%H:%i'))) AS total_secs
//             //   FROM (${baseQuery}) x
//             //   WHERE work_date BETWEEN ? AND ?
//             //   GROUP BY staff_id, period_key
//             //   ORDER BY staff_id, period_key
//             // `;
//             const query = `
//                     SELECT 
//                         staff_id,
//                         ${periodExpr} AS period_key,
//                         SUM(
//                         TIME_TO_SEC(
//                             MAKETIME(
//                             SUBSTRING_INDEX(work_hours, ':', 1),
//                             SUBSTRING_INDEX(work_hours, ':', -1),
//                             0
//                             )
//                         )
//                         ) AS total_secs
//                     FROM (${baseQuery}) x
//                     WHERE work_date BETWEEN ? AND ?
//                     GROUP BY staff_id, period_key
//                     ORDER BY staff_id, period_key
//                     `;
//             const [rows] = await conn.query(query, [start, end]);

//             console.log("SQL Query:", query);
//             console.log("Query Params:", [start, end]);
//             console.log("Query Result Rows:", rows);
//             // make staff -> periods map
//             const groups = {};
//             for (const r of rows) {
//                 const gid = r.staff_id;
//                 const key = r.period_key;
//                 const secs = r.total_secs || 0;
//                 if (!groups[gid]) {
//                     groups[gid] = { staff_id: gid, total: 0, periods: {} };
//                 }
//                 groups[gid].periods[key] = secs;
//                 groups[gid].total += secs;
//             }

//             // generate complete list of periods
//             const periodList = generatePeriods(displayBy.toLowerCase(), start, end);

//             // formatting helper
//             function formatHours(secs) {
//                 const h = Math.floor(secs / 3600);
//                 const m = Math.floor((secs % 3600) / 60);
//                 return `${h}:${m.toString().padStart(2, "0")}`;
//             }

//             // build final result
//             const result = [];
//             for (const gid in groups) {
//                 const g = groups[gid];
//                 const row = { staff_id: gid };

//                 for (const p of periodList) {
//                     row[p] = formatHours(g.periods[p] || 0);
//                 }
//                 row.total_hours = formatHours(g.total);
//                 result.push(row);
//             }

//             return result;
//         } finally {
//             conn.release();
//         }
//     }

//     console.log("displayBy", displayBy);
//     console.log("timePeriod", timePeriod);
//     console.log("fromDate", fromDate);
//     console.log("toDate", toDate);

//     const report = await getPivotReport({
//         displayBy,
//         timePeriod,
//         fromDate,
//         toDate
//     });



//     console.log("report", report);

//     return { status: true, message: 'Success.', data: report };

















//     /////////////////



//     // group by employee condition
//     if (groupBy == "employee") {
//         // Get Role
//         const rows = await QueryRoleHelperFunction(StaffUserId)
//         if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN")) {
//             if (fieldsToDisplayId !== null) {
//                 where.push(`timesheet.staff_id = ${fieldsToDisplayId}`);
//             }
//         } else {
//             where.push(`timesheet.staff_id = ${StaffUserId}`);
//         }
//     }

//     if (groupBy != "employee") {
//         // Get Role
//         const rows = await QueryRoleHelperFunction(StaffUserId)
//         if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN")) {

//         } else {
//             where.push(`timesheet.staff_id = ${StaffUserId}`);
//         }
//     }

//     // group by customer condition
//     if (groupBy == "customer") {
//         if (fieldsToDisplayId !== null) {
//             where.push(`timesheet.customer_id = ${fieldsToDisplayId}`);
//         }
//     }

//     // group by client condition
//     if (groupBy == "client") {
//         if (fieldsToDisplayId !== null) {
//             where.push(`timesheet.client_id = ${fieldsToDisplayId}`);
//         }
//     }
//     // group by job condition
//     if (groupBy == "job") {
//         if (fieldsToDisplayId !== null) {
//             where.push(`task_type = '${internal_external}' AND timesheet.job_id = ${fieldsToDisplayId}`);
//         }
//     }
//     // group by task condition
//     if (groupBy == "task") {
//         if (fieldsToDisplayId !== null) {
//             where.push(`task_type = '${internal_external}' AND timesheet.task_id = ${fieldsToDisplayId}`);
//         }
//     }



//     console.log("timePeriod", timePeriod);
//     // time timePeriod
//     if (timePeriod) {
//         const currentDate = new Date();
//         let startDate, endDate;

//         switch (timePeriod) {
//             case 'this_week':

//                 const today = new Date();
//                 // Sunday as first day of the week
//                 const firstDayOfWeek = today.getDate() - today.getDay();
//                 startDate = new Date(today);
//                 startDate.setDate(firstDayOfWeek);

//                 endDate = new Date(today);
//                 endDate.setDate(firstDayOfWeek + 6);
//                 break;
//             case 'last_week':
//                 const today2 = new Date();
//                 const firstDayOfLastWeek = today2.getDate() - today2.getDay() - 7;
//                 startDate = new Date(today2);
//                 startDate.setDate(firstDayOfLastWeek);

//                 endDate = new Date(today2);
//                 endDate.setDate(firstDayOfLastWeek + 6);

//                 break;
//             case 'this_month':
//                 startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//                 endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
//                 break;
//             case 'last_month':
//                 startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
//                 endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
//                 break;
//             case 'this_quarter':
//                 var currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1;
//                 startDate = new Date(currentDate.getFullYear(), (currentQuarter - 1) * 3, 1);
//                 endDate = new Date(currentDate.getFullYear(), currentQuarter * 3, 0);
//                 break;
//             case 'last_quarter':
//                 var currentQuarter = Math.floor(currentDate.getMonth() / 3) + 1
//                 const lastQuarter = currentQuarter - 1;
//                 startDate = new Date(currentDate.getFullYear(), (lastQuarter - 1) * 3, 1);
//                 endDate = new Date(currentDate.getFullYear(), lastQuarter * 3, 0);
//                 break;
//             case 'this_year':
//                 startDate = new Date(currentDate.getFullYear(), 0, 1);
//                 endDate = new Date(currentDate.getFullYear(), 11, 31);
//                 break;
//             case 'last_year':
//                 startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
//                 endDate = new Date(currentDate.getFullYear() - 1, 11, 31);
//                 break;
//             default:
//                 startDate = null;
//                 endDate = null;
//         }

//         if (startDate && endDate) {
//             const formattedStartDate = startDate.toISOString().split('T')[0];
//             const formattedEndDate = endDate.toISOString().split('T')[0];
//             where.push(`timesheet.created_at BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`);
//         }
//     }

//     // fromDate and toDate
//     if (timePeriod == "custom" || fromDate) {
//         where.push(`timesheet.created_at >= '${fromDate}'`);
//     }

//     // toDate condition
//     if (timePeriod == "custom" || toDate) {
//         where.push(`timesheet.created_at <= '${toDate}'`);
//     }

//     if (internal_external == "1" || internal_external == "2") {
//         where.push(`timesheet.task_type = '${internal_external}'`);
//     }


//     if (where.length > 0) {
//         where = `WHERE ${where.join(" AND ")}`;
//     } else {
//         where = "";
//     }

//     // console.log("where", where);

//     const query = `
//     SELECT 
//     staffs.email AS staff_email,
//     CONCAT(staffs.first_name,' ',staffs.last_name) AS staff_fullname,
//     customers.trading_name AS customer_name,
//     clients.trading_name AS client_name,
//     CONCAT(
//         'cli_', 
//         SUBSTRING(customers.trading_name, 1, 3), '_',
//         SUBSTRING(clients.trading_name, 1, 3), '_',
//         SUBSTRING(clients.client_code, 1, 15)
//     ) AS client_code,


//      CASE 
//         WHEN timesheet.task_type = '1' THEN internal.name
//         WHEN timesheet.task_type = '2' THEN 

//         CONCAT(
//             SUBSTRING(customers.trading_name, 1, 3), '_',
//             SUBSTRING(clients.trading_name, 1, 3), '_',
//             SUBSTRING(job_types.type, 1, 4), '_',
//             SUBSTRING(jobs.job_id, 1, 15)
//             )


//     END AS job_name,


//     CASE 
//         WHEN timesheet.task_type = '1' THEN sub_internal.name
//         WHEN timesheet.task_type = '2' THEN task.name
//     END AS task_name,

//     CASE
//         WHEN timesheet.task_type = '1' THEN 'Internal'
//         WHEN timesheet.task_type = '2' THEN 'External'
//     END AS internal_external,



//     timesheet.monday_date,
//     timesheet.monday_hours,
//     timesheet.tuesday_date,
//     timesheet.tuesday_hours,
//     timesheet.wednesday_date,
//     timesheet.wednesday_hours,
//     timesheet.thursday_date,
//     timesheet.thursday_hours,
//     timesheet.friday_date,
//     timesheet.friday_hours,
//     timesheet.saturday_date,
//     timesheet.saturday_hours,
//     timesheet.sunday_date,
//     timesheet.sunday_hours,


//     timesheet.created_at AS created_at

//     FROM 
//     timesheet
//     JOIN staffs ON timesheet.staff_id = staffs.id
//     LEFT JOIN customers ON timesheet.customer_id = customers.id
//     LEFT JOIN clients ON timesheet.client_id = clients.id

//     LEFT JOIN internal ON (timesheet.task_type = '1' AND timesheet.job_id = internal.id)
//     LEFT JOIN jobs ON (timesheet.task_type = '2' AND timesheet.job_id = jobs.id)
//     LEFT JOIN job_types ON jobs.job_type_id = job_types.id 


//     LEFT JOIN sub_internal ON (timesheet.task_type = '1' AND timesheet.task_id = sub_internal.id)
//     LEFT JOIN task ON (timesheet.task_type = '2' AND timesheet.task_id = task.id)

//     ${where}
//     `;
//     const [result] = await pool.execute(query);
//     return { status: true, message: 'Success.', data: result };
// }

const getTimesheetReportData = async (Report) => {
    const { StaffUserId, data } = Report;
    // console.log("Report in getTimesheetReportData", data.filters);
    var {
        groupBy,
        internal_external,
        fieldsToDisplay,
        fieldsToDisplayId,
        timePeriod,
        displayBy,
        fromDate,
        toDate
    } = data.filters;
    console.log("groupBy", data.filters);
    const ALLOWED_GROUP_FIELDS = ['staff_id', 'customer_id', 'client_id', 'job_id', 'task_id'];

  

    try {
        groupBy = 'staff_id';
        const groupField = String(groupBy);

        if (!ALLOWED_GROUP_FIELDS.includes(groupField)) {
            return { status: false, message: 'Invalid groupBy field', data: [] };
            
        }

        // compute date range
        let range;
        try {
            console.log("timePeriod --", timePeriod);
            console.log("timePeriod --", timePeriod);
            console.log("timePeriod --", timePeriod);
            range = await getDateRange(timePeriod, fromDate, toDate);
            console.log("range -- ", range);
        } catch (err) {

            return { status: false, message: err.message || 'Invalid date range', data: [] };
        }

        var { fromDate, toDate } = range;

        console.log("fromDate -- ", fromDate);
        console.log("toDate - -- ", toDate);

        // UNPIVOT query (get each day as a separate row)
        // Note: groupField is validated above thus safe to interpolate
        const unpivotSQL = `
      SELECT timesheet_id, group_value, work_date, work_hours
      FROM (
        SELECT id AS timesheet_id, ${groupField} AS group_value, monday_date AS work_date, monday_hours AS work_hours FROM timesheet WHERE monday_date IS NOT NULL
        UNION ALL
        SELECT id, ${groupField}, tuesday_date, tuesday_hours FROM timesheet WHERE tuesday_date IS NOT NULL
        UNION ALL
        SELECT id, ${groupField}, wednesday_date, wednesday_hours FROM timesheet WHERE wednesday_date IS NOT NULL
        UNION ALL
        SELECT id, ${groupField}, thursday_date, thursday_hours FROM timesheet WHERE thursday_date IS NOT NULL
        UNION ALL
        SELECT id, ${groupField}, friday_date, friday_hours FROM timesheet WHERE friday_date IS NOT NULL
        UNION ALL
        SELECT id, ${groupField}, saturday_date, saturday_hours FROM timesheet WHERE saturday_date IS NOT NULL
        UNION ALL
        SELECT id, ${groupField}, sunday_date, sunday_hours FROM timesheet WHERE sunday_date IS NOT NULL
      ) AS raw
      WHERE work_date BETWEEN ? AND ?
      ORDER BY group_value, work_date;
    `;

        const conn = await pool.getConnection();
        const [rows] = await conn.execute(unpivotSQL, [fromDate, toDate]);
        conn.release();
        console.log("unpivotSQL", unpivotSQL);
        console.log("Query Params:", [fromDate, toDate]);
        console.log("Unpivot Rows:", rows.length);
        // console.log("Unpivot Rows Data:", rows);

        // rows: { timesheet_id, group_value, work_date, work_hours }
        // Aggregate in JS to build dynamic pivot
        const groups = {};         // group_value -> { timesheetIds:Set, totalSeconds, periodSeconds: {period:secs} }
        const periodSet = new Set();

        for (const r of rows) {
            // normalize work_date to YYYY-MM-DD string
            let workDateStr = null;
            if (r.work_date instanceof Date) {
                workDateStr = toYMD(r.work_date);
            } else if (r.work_date) {
                // sometimes mysql2 returns string
                workDateStr = String(r.work_date).slice(0, 10);
            } else {
                continue;
            }

            const gid = r.group_value == null ? 'NULL' : String(r.group_value);
            const secs = parseHoursToSeconds(r.work_hours);

            const periodKey = getPeriodKey(displayBy, workDateStr);
            if (!periodKey) continue;

            periodSet.add(periodKey);

            if (!groups[gid]) {
                groups[gid] = {
                    group_value: gid,
                    totalSeconds: 0,
                    timesheetIds: new Set(),
                    periodSeconds: {}
                };
            }

            const g = groups[gid];
            g.totalSeconds += secs;
            g.timesheetIds.add(r.timesheet_id);
            g.periodSeconds[periodKey] = (g.periodSeconds[periodKey] || 0) + secs;
        }

        // sort periods
        const periods = Array.from(periodSet).sort((a, b) => a.localeCompare(b));

        // build rows
        const outRows = [];
        // sort group keys numerically if they look numeric
        const groupKeys = Object.keys(groups).sort((a, b) => {
            const na = Number(a), nb = Number(b);
            if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
            return a.localeCompare(b);
        });

        for (const gid of groupKeys) {
            const g = groups[gid];
            const row = {};
            // group value typed similarly as DB: number if numeric else null/string
            row[groupField] = (gid === 'NULL') ? null : (!Number.isNaN(Number(gid)) ? Number(gid) : gid);

            for (const p of periods) {
                row[p] = formatSecondsToHMM(g.periodSeconds[p] || 0);
            }

            row.total_hours = formatSecondsToHMM(g.totalSeconds);
            row.total_records = g.timesheetIds.size;

            outRows.push(row);
        }

        

       //columns: groupField, ...periods, total_hours, total_records
        const columns = [groupField, ...periods, 'total_hours', 'total_records'];
        

        
       
        console.log("columns", columns);
        console.log("outRows", outRows);
        
        return { status: true, message: 'Success.', data: [] };
        return res.json({
            meta: { fromDate, toDate, groupField, displayBy, timePeriod },
            columns,
            rows: outRows
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'server error' });
    }













    return { status: true, message: 'Success.', data: "" };

}
   
/** Pivot rows into columns and fill missing dates with "0:00" */

 /** get date range for timePeriod */
    async function getDateRange(timePeriod, fromDateParam, toDateParam) {
        console.log("timePeriod -- lllllllllll", timePeriod);
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
    /** parse "H:MM" or "HH:MM" into seconds (accepts minute >= 60) */
    function parseHoursToSeconds(str) {
        if (!str && str !== 0) return 0;
        const s = String(str).trim();
        // match "H:MM" or "H.MM" or "H" or "H.MM.SS" not expected but keep simple
        const m = s.match(/^(\d+)\s*[:.]\s*(\d+)$/);
        if (m) {
            const h = parseInt(m[1], 10) || 0;
            const mm = parseInt(m[2], 10) || 0;
            return h * 3600 + mm * 60;
        }
        // if just number treat as hours (e.g., "2")
        const n = parseFloat(s);
        if (!Number.isNaN(n)) {
            const h = Math.floor(n);
            const frac = n - h;
            return Math.round(h * 3600 + frac * 3600);
        }
        return 0;
    }

    /** format seconds -> H:MM (no seconds, more compact) */
    function formatSecondsToHMM(sec) {
        const total = Math.max(0, Math.floor(sec || 0));
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        return `${h}:${String(m).padStart(2, '0')}`;
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
            case 'daily': return `${y}-${mm}-${dd}`;           // 2025-09-08
            case 'monthly': return `${y}-${mm}`;               // 2025-09
            case 'yearly': return `${y}`;                      // 2025
            case 'weekly': {
                // week label = week-start (Monday) date
                const jsDay = (d.getDay() + 6) % 7; // Monday=0
                const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - jsDay);
                const my = monday.getFullYear();
                const mmm = String(monday.getMonth() + 1).padStart(2, '0');
                const mdd = String(monday.getDate()).padStart(2, '0');
                return `${my}-${mmm}-${mdd}`;
            }
            default: return `${y}-${mm}-${dd}`;
        }
    }

const missingTimesheetReport = async (Report) => {
    //   console.log("Missing Timesheet Report:", Report);
    const { data, StaffUserId } = Report;
    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)
    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    let where = [];
    if (rows.length > 0 && rows[0].role_name == "SUPERADMIN") {
        // Allow access to all data
        where.push(`ts.submit_status = '0'`);
    } else {
        where.push(`ts.submit_status = '0' AND ts.staff_id IN (${LineManageStaffId})`);
    }

    where = `WHERE ${where.join(" AND ")}`;

    //  Main staff query (already grouped by staff)
    let query = `
    SELECT 
       CONCAT(st.first_name,' ',st.last_name) AS staff_fullname,
       st.email AS staff_email,
       st.id AS staff_id
    FROM timesheet ts
    JOIN staffs st ON st.id = ts.staff_id
    ${where}
    GROUP BY ts.staff_id
  `;

    //  Optimized week filter query
    let query_week_filter = `
    SELECT  
      ts.id,
      ts.staff_id,
      COALESCE(
        DATE_FORMAT(ts.monday_date, '%Y-%m-%d'),
        DATE_FORMAT(ts.tuesday_date, '%Y-%m-%d'),
        DATE_FORMAT(ts.wednesday_date, '%Y-%m-%d'),
        DATE_FORMAT(ts.thursday_date, '%Y-%m-%d'),
        DATE_FORMAT(ts.friday_date, '%Y-%m-%d'),
        DATE_FORMAT(ts.saturday_date, '%Y-%m-%d'),
        DATE_FORMAT(ts.sunday_date, '%Y-%m-%d')
      ) AS month_date,
      CONCAT(
        TIMESTAMPDIFF(WEEK, CURDATE(), 
          COALESCE(ts.monday_date, ts.tuesday_date, ts.wednesday_date, ts.thursday_date, ts.friday_date, ts.saturday_date, ts.sunday_date)
        ), ' '
      ) AS valid_weekOffsets
    FROM timesheet ts
    ${where}
    GROUP BY ts.staff_id, valid_weekOffsets, month_date
    ORDER BY valid_weekOffsets ASC
  `;




    // run queries in parallel
    const [[filterDataWeekRows], [staffRows]] = await Promise.all([
        pool.query(query_week_filter),
        pool.query(query)
    ]);

    // filter out "0" offsets at once
    const groupedWeekData = filterDataWeekRows
        .filter(item => item.valid_weekOffsets.trim() !== '0')
        .reduce((acc, item) => {
            const key = item.valid_weekOffsets + '_' + item.month_date;
            if (!acc[key]) {
                acc[key] = {
                    valid_weekOffsets: item.valid_weekOffsets,
                    month_date: item.month_date
                };
            }
            return acc;
        }, {});

    let staffsCurrentWeek;
    if (data.filterStaffIds === "") {
        staffsCurrentWeek = filterDataWeekRows
            .filter(item => item.valid_weekOffsets.includes('0'))
            .map(i => i.staff_id);
    } else {
        staffsCurrentWeek = filterDataWeekRows
            .filter(item => item.valid_weekOffsets.includes(data.filterStaffIds))
            .map(i => i.staff_id);
    }

    // only keep staff in current week
    const filteredStaff = staffRows.filter(s => staffsCurrentWeek.includes(s.staff_id));

    return {
        status: true,
        message: 'Success.',
        data: {
            result: filteredStaff,
            filterDataWeek: Object.values(groupedWeekData)
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


    let query = `
        SELECT 
        timesheet.id AS timsheet_id,
        timesheet.staff_id,
        timesheet.monday_hours,
        timesheet.tuesday_hours,
        timesheet.wednesday_hours,
        timesheet.thursday_hours,
        timesheet.friday_hours,
        (
        COALESCE(CAST(REPLACE(timesheet.monday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
        COALESCE(CAST(REPLACE(timesheet.tuesday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
        COALESCE(CAST(REPLACE(timesheet.wednesday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
        COALESCE(CAST(REPLACE(timesheet.thursday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
        COALESCE(CAST(REPLACE(timesheet.friday_hours, ':', '.') AS DECIMAL(10,2)), 0)
        ) AS timesheet_total_hours,

        CONCAT(staffs.first_name, ' ', staffs.last_name) AS staff_fullname,
        staffs.email AS staff_email,

        roles.role AS role_name,

        jobs.id AS job_id,
        jobs.budgeted_hours AS job_budgeted_hours,

        CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(job_types.type, 1, 4), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id
        
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
        // Restrict access to specific data
        query += ` WHERE timesheet.staff_id IN (${LineManageStaffId})`;
    }


    const [result] = await pool.execute(query);
    return { status: true, message: 'Success.', data: result };
}

const capacityReport = async (Report) => {
    console.log("Capacity Report:", Report);


    return { status: true, message: 'no make Api', data: [] };
}
















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
    capacityReport,
    getChangedRoleStaff,
    staffRoleChangeUpdate
};
















function pivotWithZeros(unpivotRows, fromDate, toDate, displayBy = "daily") {
    // 1. Date range generate करो
    const dates = [];
    let cur = new Date(fromDate);
    const end = new Date(toDate);

    while (cur <= end) {
        dates.push(getPeriodKey(displayBy, toYMD(cur))); // daily, weekly, monthly, yearly
        // increment सही तरीके से करो
        switch (displayBy.toLowerCase()) {
            case "monthly":
                cur.setMonth(cur.getMonth() + 1);
                break;
            case "yearly":
                cur.setFullYear(cur.getFullYear() + 1);
                break;
            case "weekly":
                cur.setDate(cur.getDate() + 7);
                break;
            default: // daily
                cur.setDate(cur.getDate() + 1);
        }
    }

    // 2. Staff-wise group बनाओ
    const groups = {};
    for (const r of unpivotRows) {
        const secs = parseHoursToSeconds(r.work_hours);
        if (!groups[r.group_value]) {
            groups[r.group_value] = { staff_id: r.group_value, total_secs: 0, total_records: 0, data: {} };
        }

        const periodKey = getPeriodKey(displayBy, r.work_date);
        groups[r.group_value].data[periodKey] = formatSecondsToHMM(secs);

        groups[r.group_value].total_secs += secs;
        groups[r.group_value].total_records += 1;
    }

    // 3. Final rows (missing dates → "0:00")
    const result = [];
    for (const staffId in groups) {
        const g = groups[staffId];
        const row = { staff_id: staffId };

        for (const d of dates) {
            row[d] = g.data[d] || "0:00";
        }

        row.total_hours = formatSecondsToHMM(g.total_secs);
        row.total_records = g.total_records;
        result.push(row);
    }

    return { columns: ["staff_id", ...dates, "total_hours", "total_records"], outRows: result };
}

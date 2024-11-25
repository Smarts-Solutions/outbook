const { response } = require('express');
const pool = require('../config/database');
const { SatffLogUpdateOperation } = require('../utils/helper');

const jobStatusReports = async (Report) => {
    const { StaffUserId } = Report;
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
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
        const [rows] = await pool.execute(QueryRole);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {
            // const page = Report.page || 1; 
            // const pageSize = Report.pageSize || 10; 
            // const offset = (page - 1) * pageSize; 

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
            //  drafts ON drafts.job_id = jobs.id
            //  LIMIT ? OFFSET ?
            // const [rows] = await pool.execute(query, [pageSize, offset]);
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };
        } else {
            return { status: true, message: 'Success.', data: [] };
        }
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
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
        const [rows] = await pool.execute(QueryRole);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {

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

            const [weeklyRows] = await pool.execute(weeklyQuery);
            // Create a mapping for each month
            const monthlyData = {};

            // Populate the monthlyData object with weekly data
            weeklyRows.forEach(entry => {
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

            return { status: true, message: 'Success.', data: result };
        } else {
            return { status: true, message: 'Success.', data: [] };
        }
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting monthly and weekly job count.' };
    }


}

const jobSummaryReports = async (Report) => {
    const { StaffUserId } = Report;
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
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
        const [rows] = await pool.execute(QueryRole);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {
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
        } else {
            return { status: true, message: 'Success.', data: [] };
        }
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}

const jobPendingReports = async (Report) => {
    const { StaffUserId } = Report;
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
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
        const [rows] = await pool.execute(QueryRole);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {

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
        } else {
            return { status: true, message: 'Success.', data: [] };
        }
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}

const teamMonthlyReports = async (Report) => {
    const { StaffUserId } = Report;
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
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
        const [rows] = await pool.execute(QueryRole);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {

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

            //      WHERE 
            // MONTH(jobs.created_at) = MONTH(CURRENT_DATE) AND 
            // YEAR(jobs.created_at) = YEAR(CURRENT_DATE)
            const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };
        } else {
            return { status: true, message: 'Success.', data: [] };
        }
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}

const dueByReport = async (Report) => {
    const { StaffUserId } = Report;

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
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
        const [rows] = await pool.execute(QueryRole);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {

//             const query = `SELECT
//         customers.id AS customer_id,
//         customers.trading_name AS customer_name,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 MONTH) THEN jobs.id END)
//         ) AS due_within_1_month,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 2 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 2 MONTH) THEN jobs.id END)
//         ) AS due_within_2_months,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 2 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 3 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 2 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 3 MONTH) THEN jobs.id END)
//         ) AS due_within_3_months,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 3 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 4 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 3 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 4 MONTH) THEN jobs.id END)
//         ) AS due_within_4_months,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 4 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 5 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 4 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 5 MONTH) THEN jobs.id END)
//         ) AS due_within_5_months,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 5 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 6 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 5 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 6 MONTH) THEN jobs.id END)
//         ) AS due_within_6_months,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 6 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 7 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 6 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 7 MONTH) THEN jobs.id END)
//         ) AS due_within_7_months,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 7 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 8 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 7 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 8 MONTH) THEN jobs.id END)
//         ) AS due_within_8_months,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 8 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 9 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 8 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 9 MONTH) THEN jobs.id END)
//         ) AS due_within_9_months,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 9 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 10 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 9 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 10 MONTH) THEN jobs.id END)
//         ) AS due_within_10_months,

//         -- Due within 1 month
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 10 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 11 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 10 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 11 MONTH) THEN jobs.id END)
//         ) AS due_within_11_months,

//         -- Due within 12 months
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 11 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 12 MONTH) THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL 11 MONTH) AND DATE_ADD(CURDATE(), INTERVAL 12 MONTH) THEN jobs.id END)
//         ) AS due_within_12_months,

//         -- Due passed (combined count and job_ids as JSON object)
//         JSON_OBJECT(
//             'count', COUNT(CASE WHEN jobs.due_on < CURDATE() THEN 1 END),
//             'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on < CURDATE() THEN jobs.id END)
//         ) AS due_passed

//     FROM customers
//     LEFT JOIN jobs ON jobs.customer_id = customers.id
//     GROUP BY customers.id;
// `;

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
query += `
    FROM customers
    LEFT JOIN jobs ON jobs.customer_id = customers.id
`;


// Final GROUP BY and ORDER BY clauses
query += `
    GROUP BY customers.id
    ORDER BY customers.id ASC;
`;

// Now you can execute the query using your database connection
const [result] = await pool.execute(query);

// Format the result into a structured format
const formattedResult = result.map(row => {
    const weeksData = {};
    for (let i = 1; i <= monthsRange; i++) {
        weeksData[`due_within_${i}_months`] = 
        row[`due_within_${i}_months`] || 0
        // {
        //     count: row[`due_within_${i}_months`] || 0,
        //     job_ids: row[`job_ids_${i}_months`] ? row[`job_ids_${i}_months`] : ""
        // };
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
           

            //const [result] = await pool.execute(query);
            return { status: true, message: 'Success.', data: result };
        } else {
            return { status: true, message: 'Success.', data: [] };
        }

    } catch (error) {
     
        console.log("error ", error);
        return { status: false, message: 'Error getting job dueByReport.' };
    }
}

const reportCountJob = async (Report) => {
    const { StaffUserId, job_ids } = Report;
    const cleaneJob_ids = job_ids.replace(/^,+|,+$/g, '');
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
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
        const [rows] = await pool.execute(QueryRole);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {
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
        else {
            return { status: true, message: 'Success.', data: [] };
        }
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
        const { StaffUserId, customer_id , job_status_type_id , processor_id , reviewer_id} = Report;
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

        const QueryRole = `
    SELECT
        staffs.id AS id,
        staffs.role_id AS role_id,
        roles.role AS role_name
    FROM staffs
    LEFT JOIN roles ON staffs.role_id = roles.id
    WHERE staffs.id = ${StaffUserId}
    LIMIT 1
    `;
        const [rows] = await pool.execute(QueryRole);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {

            let query = `
            SELECT
                master_status.name AS job_status,
                customers.trading_name AS customer_name,
                ${weeks_sql},
                GROUP_CONCAT(jobs.id) AS job_ids,
                COUNT(jobs.id) AS Grand_Total
            FROM 
                customers
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

            if (conditions.length > 0) {
                query += ` WHERE ${conditions.join(" AND ")}`;
            }

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
        } else {
            return { status: true, message: 'Success.', data: [] };
        }
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting tax status weekly report.' };
    }
}

const taxWeeklyStatusReportFilterKey = async (Report) => {
    try {
        
       // job Reviewer
       const queryCustomer = `
        SELECT  
            customers.id AS customer_id,
            customers.trading_name AS customer_name
        FROM 
            customers   
        ORDER BY 
        customers.id DESC;
     `;
      const [rows] = await pool.execute(queryCustomer);
      let customer = []
      if (rows.length > 0) {
        customer = rows.map(row => ({
          customer_id: row.customer_id,
          customer_name: row.customer_name}));
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
    
    
        return { status: true, message: 'success.', data: { customer: customer, reviewer: reviewer, processor: processor ,job_status_type:job_status_type} };
    
      } catch (err) {
        return { status: false, message: 'Err Customer Get' };
      }

}

const averageTatReport = async (Report) => {
    const { StaffUserId } = Report;
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
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
        const [rows] = await pool.execute(QueryRole);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {

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
        } else {
            return { status: true, message: 'Success.', data: [] };
        }
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
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
    averageTatReport
};
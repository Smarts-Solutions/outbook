const { response } = require('express');
const pool = require('../config/database');
const { SatffLogUpdateOperation } = require('../utils/helper');

const jobStatusReports = async (Report) => {

    try {
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
        const [rows] = await pool.execute(query);
        return { status: true, message: 'Success.', data: rows };
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
    return 0; // This shouldn't happen if the day is valid
};
const JobReceivedSentReports = async (Report) => {
    try {
        // Query for monthly data
        const monthlyQuery = `
            SELECT 
                DATE_FORMAT(jobs.created_at, '%M') AS month_name,
                COUNT(jobs.id) AS job_received,
                COUNT(drafts.job_id) AS draft_count,
                GROUP_CONCAT(DISTINCT jobs.id) AS job_ids
            FROM 
                jobs
            LEFT JOIN 
                drafts ON drafts.job_id = jobs.id    
            WHERE 
                YEAR(jobs.created_at) = YEAR(CURDATE())
            GROUP BY 
                MONTH(jobs.created_at)
            ORDER BY 
                MONTH(jobs.created_at);
        `;
        
        const [monthlyRows] = await pool.execute(monthlyQuery);

        // Query for weekly data
        const weeklyQuery = `
            SELECT 
                DATE_FORMAT(jobs.created_at, '%M') AS month_name,
                DAY(jobs.created_at) AS day,
                COUNT(jobs.id) AS job_received,
                COUNT(drafts.job_id) AS draft_count,
                GROUP_CONCAT(DISTINCT jobs.id) AS job_ids
            FROM 
                jobs
            LEFT JOIN 
                drafts ON drafts.job_id = jobs.id    
            WHERE 
                YEAR(jobs.created_at) = YEAR(CURDATE())
            GROUP BY 
                month_name, DAY(jobs.created_at)
            ORDER BY 
                MONTH(jobs.created_at), DAY(jobs.created_at);
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
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting monthly and weekly job count.' };
    }


}

const jobSummaryReports = async (Report) => {
    try {

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
        const [rows] = await pool.execute(query);
        return { status: true, message: 'Success.', data: rows };
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}

const jobPendingReports = async (Report) => {
    try {

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
        const [rows] = await pool.execute(query);
        return { status: true, message: 'Success.', data: rows };
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}

const teamMonthlyReports = async (Report) => {
    try {

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
        const [rows] = await pool.execute(query);
        return { status: true, message: 'Success.', data: rows };
    } catch (error) {
        console.log("error ", error);
        return { status: false, message: 'Error getting job status report.' };
    }
}


module.exports = {
    jobStatusReports,
    JobReceivedSentReports,
    jobSummaryReports,
    jobPendingReports,
    teamMonthlyReports
};
const pool = require('../config/database');
const { Worker } = require('worker_threads');
const { join } = require('path');

// 1. Worker for Missing Timesheet Report
function sendEmailInWorkerMissingTimeSheet(rows) {
  const worker = new Worker(join(__dirname, 'missingTimesheetReportEmail.js'), {
    type: 'module',
  });
  worker.postMessage(rows);
  worker.on('message', (msg) => {
    console.log('RECEIVED MSG EMAIL SENT missingTimesheetReportEmail--', msg);
  });
  worker.on('error', (err) => console.log('Worker error --:', err));
  worker.on('exit', (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  });
}

// 2. Worker for Jobs Not Delivered Missing Paperwork 7 Days
function JobsNotDeliveredMissingPaperwork7Days(rows) {
  const worker = new Worker(join(__dirname, 'jobsNotDeliveredMissingPaperwork7Days.js'), {
    type: 'module',
  });
  worker.postMessage(rows);
  worker.on('message', (msg) => {
    console.log('RECEIVED MSG EMAIL SENT JobsNotDeliveredMissingPaperwork7Days -- ', msg);
  });
  worker.on('error', (err) => console.log('Worker error --:', err));
  worker.on('exit', (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  });
}

async function runManualCron() {
  try {
    console.log("Starting manual cron execution...");

    // Run Missing Timesheet Report
    console.log("Fetching data for Missing Timesheet Report...");
    const [staffResult] = await pool.execute(`
      SELECT 
      id,
      CONCAT(first_name, ' ', last_name) AS staff_fullname,
      email AS staff_email
      FROM staffs 
      WHERE status = '1'
    `);
    console.log(`Found ${staffResult.length} records. Sending to worker...`);
    sendEmailInWorkerMissingTimeSheet(staffResult || []);

    // Run Jobs Not Delivered Missing Paperwork 7 Days
    console.log("Fetching data for Jobs Not Delivered Missing Paperwork 7 Days...");
    const JobsNotDeliveredMissingPaperwork7Days_query = `
        SELECT DISTINCT
        staffs.id AS id,
        CONCAT(first_name,' ',last_name) AS staff_fullname,
        staffs.email AS staff_email,
        roles.role AS staff_role,
        roles.id AS role_id
        FROM staffs
        JOIN roles ON roles.id = staffs.role_id
        LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.staff_id = staffs.id
        LEFT JOIN jobs ON jobs.id = assigned_jobs_staff_view.job_id
        LEFT JOIN missing_logs ON jobs.id = missing_logs.job_id
        WHERE
        (
         jobs.status_type NOT IN (6,7,17,18,19,20)
         AND EXISTS (
          SELECT 1
          FROM missing_logs 
          WHERE missing_logs.job_id = jobs.id
            AND missing_logs.status = '1'
            AND missing_logs.missing_log_reviewed_date <= NOW() - INTERVAL 7 DAY
        )
        ) 
        OR roles.id IN (1, 2, 8)
        GROUP BY staffs.id
        ORDER BY staffs.id DESC;
    `;
    const [jobsResult] = await pool.execute(JobsNotDeliveredMissingPaperwork7Days_query);
    console.log(`Found ${jobsResult.length} records. Sending to worker...`);
    JobsNotDeliveredMissingPaperwork7Days(jobsResult || []);

  } catch (error) {
    console.error("Error executing manual cron:", error);
  }
}

runManualCron();

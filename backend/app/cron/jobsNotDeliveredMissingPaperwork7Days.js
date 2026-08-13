// Jobs Not Delivered After Missing Paperwork 7 Days Report Email Worker
const pool = require('../config/database');
const { parentPort } = require("worker_threads");
const { commonEmail } = require("../utils/commonEmail");
const xlsx = require('xlsx');
const { logEmail } = require("../utils/emailLogger");

const convertDate = (date) => {
  if ([null, undefined, ''].includes(date)) {
    return "-";
  }
  if (date) {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return "-";
}

const formatCSV = (value) => {
  if (!value) return ' - ';
  let cleanStr = value.toString();

  if (cleanStr.includes(',') || cleanStr.includes('"') || cleanStr.includes('\n')) {
    cleanStr = cleanStr.replace(/"/g, '""');
    return `"${cleanStr}"`;
  }
  return cleanStr;
};

const generateExcelDataAndBuffer = (result) => {
    let jobsData = [];
    let reviewCountMap = {};

    if (result && result.length > 0) {
      result.forEach(val => {
        let job_received_on = convertDate(val.job_received_on);
        let customer_trading_name = val.customer_trading_name || ' - ';
        let account_manager_name = val.account_manager_name || ' - ';
        let client_trading_name = val.client_trading_name || ' - ';
        let service_name = val.service_name || ' - ';
        let job_type_name = val.job_type_name || ' - ';
        let status = val.status || ' - ';
        let allocated_name = val.allocated_name || ' - ';
        let multiple_staff_names = val.multiple_staff_names || ' - ';
        let reviewer_name = val.reviewer_name || ' - ';
        let filing_Companies_date = convertDate(val.filing_Companies_date) || ' - ';
        let internal_deadline_date = convertDate(val.internal_deadline_date) || ' - ';
        let customer_deadline_date = convertDate(val.customer_deadline_date) || ' - ';
        let query_sent_date = convertDate(val.query_sent_date) || ' - ';
        let final_query_response_received_date = convertDate(val.final_query_response_received_date) || ' - ';
        let draft_sent_on = convertDate(val.draft_sent_on) || ' - ';
        let final_draft_sent_on = convertDate(val.final_draft_sent_on) || ' - ';
        let created_by = val.created_by || ' - ';
        
        let missing_log_reviewed_by_name = val.missing_log_reviewed_by_name || ' - ';

        jobsData.push({
          'Job Id': val.job_code_id,
          'Job Received On': job_received_on,
          'Customer Name': customer_trading_name,
          'Account Manager': account_manager_name,
          'Clients': client_trading_name,
          'Service Type': service_name,
          'Job Type': job_type_name,
          'Status': status,
          'Allocated To': allocated_name,
          'Allocated to (Other)': multiple_staff_names,
          'Reviewer Name': reviewer_name,
          'Companies House Due Date': filing_Companies_date,
          'Internal Deadline': internal_deadline_date,
          'Customer Deadline': customer_deadline_date,
          'Initial Query Sent Date': query_sent_date,
          'Final Query Response Received Date': final_query_response_received_date,
          'First Draft Sent': draft_sent_on,
          'Final Draft Sent': final_draft_sent_on,
          'Created By': created_by
        });

        if (missing_log_reviewed_by_name !== ' - ') {
           reviewCountMap[missing_log_reviewed_by_name] = (reviewCountMap[missing_log_reviewed_by_name] || 0) + 1;
        }
      });
    }

    let summaryData = [
      { "Summary": "Total Jobs Not Delivered After Missing Paperwork 7 Days", "Total Count": jobsData.length }
    ];

    const currentDate = new Date();
    const weekNum = Math.ceil(currentDate.getDate() / 7);
    const monthNum = currentDate.getMonth() + 1;
    const yearNum = currentDate.getFullYear();
    const shortDateStr = `Week ${weekNum} Month ${monthNum} Year ${yearNum}`;

    const wb = xlsx.utils.book_new();

    // Add Summary tab FIRST
    const wsSummary = xlsx.utils.json_to_sheet(summaryData.length ? summaryData : [{"Message": "No missing logs found"}]);
    xlsx.utils.book_append_sheet(wb, wsSummary, `Summary ${shortDateStr}`.substring(0, 31));
    
    // Add Jobs tab SECOND
    const wsJobs = xlsx.utils.json_to_sheet(jobsData.length ? jobsData : [{"Message": "No jobs found"}]);
    xlsx.utils.book_append_sheet(wb, wsJobs, "Missing Paperwork 7 Days");

    const excelBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return { jobsData, summaryData, excelBuffer };
};

/* 🔥 LIMIT PARALLEL EXECUTION */
async function processWithLimit(items, limit, handler) {
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      await handler(items[currentIndex]);
    }
  }

  const workers = Array(limit).fill(null).map(worker);
  await Promise.all(workers);
}

/* ---------------- MAIN WORKER ---------------- */

parentPort.on("message", async (rows) => {
  try {
    /* ✅ STEP 1: REMOVE DUPLICATES */
    const uniqueUsers = [];
    const seen = new Set();

    for (const r of rows) {
      if (!seen.has(r.staff_email)) {
        seen.add(r.staff_email);
        uniqueUsers.push(r);
      }
    }

    parentPort.postMessage(`Total unique users: ${uniqueUsers.length}`);

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
        DATE_FORMAT(jobs.date_received_on, '%Y-%m-%d') AS job_received_on,
        CONCAT(staffs5.first_name, ' ', staffs5.last_name) AS created_by,
        GROUP_CONCAT(CONCAT(staffs4.first_name, ' ', staffs4.last_name) SEPARATOR '| ') AS multiple_staff_names,
        CONCAT(staffs6.first_name, ' ', staffs6.last_name) AS missing_log_reviewed_by_name
      FROM jobs
        JOIN staffs AS staffs5 ON jobs.staff_created_id = staffs5.id
        LEFT JOIN job_allowed_staffs ON job_allowed_staffs.job_id = jobs.id
        LEFT JOIN staffs AS staffs4 ON job_allowed_staffs.staff_id = staffs4.id
        LEFT JOIN customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
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
        LEFT JOIN missing_logs ON missing_logs.id = (SELECT MAX(id) FROM missing_logs WHERE job_id = jobs.id)
        LEFT JOIN staffs AS staffs6 ON missing_logs.missing_log_reviewed_by = staffs6.id

      WHERE customers.status = '1'
        AND jobs.status_updation_date < CURDATE() - INTERVAL 7 DAY
        AND jobs.status_type = 2

      GROUP BY jobs.id
      ORDER BY jobs.id DESC;
        `;
    const [result] = await pool.execute(query);

    if (!result.length) {
      parentPort.postMessage("No jobs found");
      return;
    }

    let adminReport = generateExcelDataAndBuffer(result);

    /* ✅ STEP 4: SEND EMAILS WITH LIMIT */
    await processWithLimit(uniqueUsers, 5, async (user) => {
      try {


        let finalReport = adminReport;

        /* 👉 NON ADMIN USER */
        if (![1, 2, 8].includes(user.role_id)) {
          const res = await otherUserDataGet(user);
          if (!res.status) return;
          finalReport = res.report;
        }

        // TODO: REVERT THIS AFTER TESTING
        // Override email for testing purposes
        // let toEmail = user.staff_email;
        let toEmail = "shaktijatpnp09@gmail.com"; // user.staff_email;
        let subjectEmail = "Alert: Jobs Not Delivered Within 7 Days of Receiving the Missing Paperwork";
        let htmlEmail = `
        <h3>Alert: Jobs Not Delivered Within 7 Days of Receiving the Missing Paperwork</h3>
        <p>Hello,</p>
        <p>
          This is to inform you that some jobs have not been delivered within 
          <strong>7 days of receiving the missing paperwork</strong>.
        </p>
        <p>
          Please review the attached report and take the necessary action to 
          ensure timely processing and avoid further delays.
        </p>
        <br>
        <p>
          Regards,<br>
          Team Outbooks
        </p>
      `;

        const filename = `Jobs that haven’t been delivered within 7 days of receiving the missing paperwork - ${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;
        const dynamic_attachment = finalReport.excelBuffer;

        const sent = await commonEmail(toEmail, subjectEmail, htmlEmail, "", "", dynamic_attachment, filename);

        logEmail({
          toEmail: toEmail,
          filename: filename,
          attachment: finalReport,
          logFileName: "jobsNotDeliveredMissingPaperwork7Days.json",
        });


        parentPort.postMessage(
          sent ? `✅ ${user.staff_email}` : `❌ ${user.staff_email}`
        );

      } catch (err) {
        parentPort.postMessage(`❌ ${user.staff_email}: ${err.message}`);
      }
    });


    parentPort.postMessage("All emails processed ✅");
  } catch (err) {
    parentPort.postMessage("Worker failed: " + err.message);
  }
});


async function otherUserDataGet(row) {
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
        DATE_FORMAT(jobs.date_received_on, '%Y-%m-%d') AS job_received_on,
        CONCAT(staffs5.first_name, ' ', staffs5.last_name) AS created_by,
        GROUP_CONCAT(CONCAT(staffs4.first_name, ' ', staffs4.last_name) SEPARATOR '| ') AS multiple_staff_names,
        CONCAT(staffs6.first_name, ' ', staffs6.last_name) AS missing_log_reviewed_by_name,
        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id,
        assigned_jobs_staff_view.staff_id AS assigned_jobs_staff_view_staff_id
      FROM jobs
        JOIN staffs AS staffs5 ON jobs.staff_created_id = staffs5.id
        LEFT JOIN job_allowed_staffs ON job_allowed_staffs.job_id = jobs.id
        LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN staffs AS staffs4 ON job_allowed_staffs.staff_id = staffs4.id
        LEFT JOIN customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
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
        LEFT JOIN missing_logs ON missing_logs.id = (SELECT MAX(id) FROM missing_logs WHERE job_id = jobs.id)
        LEFT JOIN staffs AS staffs6 ON missing_logs.missing_log_reviewed_by = staffs6.id

      WHERE customers.status = '1'
        AND (
        jobs.status_updation_date < CURDATE() - INTERVAL 7 DAY
        AND jobs.status_type = 2
        )
        AND assigned_jobs_staff_view.staff_id = ${row?.id}  AND (
        assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci
        OR jobs.service_id = assigned_jobs_staff_view.service_id_assign
      )

      GROUP BY jobs.id
      ORDER BY jobs.id DESC;
        `;

  const [result] = await pool.execute(query);

  if (result && result.length > 0) {
    let report = generateExcelDataAndBuffer(result);
    return { status: true, report };
  } else {
    return { status: false };
  }


}



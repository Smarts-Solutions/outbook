// Jobs Not Delivered After Missing Paperwork 7 Days Report Email Worker
const pool = require('../config/database');
const { parentPort } = require("worker_threads");
const { commonEmail } = require("../utils/commonEmail");
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



// Missing Timesheet Report Email Worker
parentPort.on("message", async (rows) => {

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
        DATE_FORMAT(jobs.created_at, '%Y-%m-%d') AS job_received_on,
        GROUP_CONCAT(CONCAT(staffs4.first_name, ' ', staffs4.last_name) SEPARATOR '| ') AS multiple_staff_names

      FROM jobs
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

      WHERE 
        jobs.status_type != 6
        AND EXISTS (
          SELECT 1
          FROM missing_logs 
          WHERE missing_logs.job_id = jobs.id
            AND missing_logs.status = '1'
            AND missing_logs.missing_log_reviewed_date <= NOW() - INTERVAL 7 DAY
        )

      GROUP BY jobs.id
      ORDER BY jobs.id DESC;
        `;
  const [result] = await pool.execute(query);

  let csvContent = "Job Id,Job Received On,Customer Name,Account Manager,Clients,Service Type,Job Type,Status,Allocated To,Allocated to (Other),Reviewer Name,Companies House Due Date,Internal Deadline,Customer Deadline,Initial Query Sent Date,Final Query Response Received Date,First Draft Sent,Final Draft Sent\n";
  result?.forEach(val => {

    let job_received_on = convertDate(val.job_received_on);
    customer_trading_name = val.customer_trading_name || ' - ';
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



    csvContent += `${val.job_code_id},${job_received_on},${customer_trading_name},${account_manager_name},${client_trading_name},${service_name},${job_type_name},${status},${allocated_name},${multiple_staff_names},${reviewer_name},${filing_Companies_date},${internal_deadline_date},${customer_deadline_date},${query_sent_date},${final_query_response_received_date},${draft_sent_on},${final_draft_sent_on}\n`;
  });

  for (const row of rows) {
    try {

      if (result && result.length > 0) {

        // console.log("CSV Content -->>>:\n", csvContent);
        let toEmail = row.staff_email;
       
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
          Your Automation System
        </p>
      `;


        const filename = `Jobs_Not_Delivered_Within_7_Days_Of_Missing_Paperwork_${new Date()
          .toISOString()
          .slice(0, 10)}.csv`;

       // parentPort.postMessage(`CSV Content for ${row.id}:\n ${csvContent}`);

        const emailSent = await commonEmail(toEmail, subjectEmail, htmlEmail, "", "", dynamic_attachment, filename);
        if (emailSent) {
          //console.log("Missing Timesheet Report email sent successfully.");
          parentPort.postMessage(`✅ Email sent to: ${row.staff_email}`);
        } else {
          // console.log("Failed to send Missing Timesheet Report email.");
          parentPort.postMessage(`❌ Failed to send email to: ${row.staff_email}`);
        }
      } else {
        parentPort.postMessage(`ℹ️ No missing timesheet report for ${row.staff_email}`);
      }


    } catch (err) {
      parentPort.postMessage(`❌ Failed for ${row.id}: ${err.message}`);
    }
  }
});
// missingTimesheetReportEmail.js
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
  for (const row of rows) {
    try {

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
        clients.trading_name AS client_trading_name
        FROM 
        jobs
        LEFT JOIN 
        missing_logs 
        ON jobs.id = missing_logs.job_id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id
        LEFT JOIN 
        job_types ON jobs.job_type_id = job_types.id
        WHERE 
        jobs.created_at <= NOW() - INTERVAL 2 DAY
        AND missing_logs.job_id IS NULL
        GROUP BY jobs.id
        ORDER BY 
          jobs.id DESC;
        `;

      // const [result] = await pool.execute(`SELECT * FROM jobs WHERE status_type = 1 AND created_at <= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`);
      const [result] = await pool.execute(query);



      if (result && result.length > 0) {
        let csvContent = "Job Id,Customer Name,Client Name,Expected Delivery Date ,Expected Delivery Date Old \n";
        result?.forEach(val => {


          let customer_trading_name = val.customer_trading_name || ' - ';
          let client_trading_name = val.client_trading_name || ' - ';
          let expected_delivery_date = val.expected_delivery_date || ' - ';
          let expected_delivery_date_old = val.expected_delivery_date_old || ' - ';



          csvContent += `${val.job_code_id},${customer_trading_name},${client_trading_name},${expected_delivery_date},${expected_delivery_date_old}\n`;
        });

        // console.log("CSV Content Generated Expected Delevery:\n", csvContent);

        let toEmail = row.staff_email;
        let subjectEmail = "Alert: Jobs with Missing Paperwork Due in the Next 2 Days";
        let htmlEmail = `
          <h3>Alert: Jobs with Missing Paperwork Due in the Next 2 Days</h3>
          <p>Hello,</p>
          <p>This is to inform you that some jobs are missing required paperwork and are due within the next 2 days.</p>
          <p>Please review the attached report to take necessary actions.</p>
          <br>
          <p>Regards,<br>Your Automation System</p>
        `;
        const dynamic_attachment = csvContent;
        const filename = `Jobs_Missing_Paperwork_Max2Days_Report_${new Date().toISOString().slice(0, 10)}.csv`;


        //parentPort.postMessage(`CSV Content for ${row.id}:\n ${csvContent}`);

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
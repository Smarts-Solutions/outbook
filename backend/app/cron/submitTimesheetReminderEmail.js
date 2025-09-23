// submitTimesheetReminderEmail.js
const { parentPort } = require("worker_threads");
const pool = require('../config/database');
const { commonEmail } = require("../utils/commonEmail");



// Submit Timesheet Report Email Worker
parentPort.on("message", async (rows) => {
  for (const row of rows) {
    try {
            const [[getStaffNameMissingReport]] = await pool.query(`CALL GetLastWeekSubmitTimesheetReport(${row.id})`);
            //console.log("getStaffNameMissingReport , ",getStaffNameMissingReport); 
            
            let csvContent = "Staff Name,Staff Email\n";
            getStaffNameMissingReport?.forEach(val => {
                csvContent += `${val.staff_fullname},${val.staff_email}\n`;
            });

           
            let toEmail = row.staff_email;
            let subjectEmail = "Submit Timesheet Reminder Report"
            let htmlEmail = "<h3>Please find the attached Submit Timesheet Report.</h3>"
            const dynamic_attachment = csvContent;
            const filename = "SubmitTimesheetReport.csv";

           // parentPort.postMessage(`CSV Content for ${row.id}:\n ${csvContent}`);

            const emailSent = await commonEmail(toEmail, subjectEmail, htmlEmail, "", "", dynamic_attachment , filename);
            if (emailSent) {
                //console.log("Submit Timesheet Report email sent successfully.");
                parentPort.postMessage(`✅ Email sent to: ${row.staff_email}`);
            } else {
               // console.log("Failed to send Submit Timesheet Report email.");
                parentPort.postMessage(`❌ Failed to send email to: ${row.staff_email}`);
            }
    } catch (err) {
      parentPort.postMessage(`❌ Failed for ${row.id}: ${err.message}`);
    }
  }
});
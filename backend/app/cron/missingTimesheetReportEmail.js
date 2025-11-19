// missingTimesheetReportEmail.js
const pool = require('../config/database');
const { parentPort } = require("worker_threads");
const { missingTimesheetReport } = require("../models/reportModel");
const { commonEmail } = require("../utils/commonEmail");

// Missing Timesheet Report Email Worker
parentPort.on("message", async (rows) => {
  for (const row of rows) {
    try {
      const [[getStaffNameMissingReport]] = await pool.execute(`CALL GetLastWeekMissingTimesheetReport(${row.id})`);
      // console.log("getStaffNameMissingReport , ", getStaffNameMissingReport);
      if (getStaffNameMissingReport && getStaffNameMissingReport.length > 0) {
        let csvContent = "Staff Name,Staff Email\n";
        // getStaffNameMissingReport?.forEach(val => {
        //     csvContent += `${val.staff_fullname},${val.staff_email}\n`;
        // });
        let processedStaff = new Set();
        getStaffNameMissingReport?.forEach(val => {
          // Agar staff_id pehle aa chuka hai → skip
          if (processedStaff.has(val?.staff_id)) {
            return;
          }

          // Staff ko mark kar do as processed
          processedStaff.add(val?.staff_id);
          csvContent += `${val?.staff_fullname},${val?.staff_email}\n`;
        });


        let toEmail = row.staff_email;
        let subjectEmail = "Missing Timesheet Report"
        let htmlEmail = "<h3>Please find the attached Missing Timesheet Report.</h3>"
        const dynamic_attachment = csvContent;
        const filename = "MissingTimesheetReport.csv";

       // parentPort.postMessage(`CSV Content for ${row.id}:\n ${csvContent}`);

        const emailSent = await commonEmail(toEmail, subjectEmail, htmlEmail, "", "", dynamic_attachment , filename);
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
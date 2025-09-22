// missingTimesheetReportEmail.js
const { parentPort } = require("worker_threads");

const { missingTimesheetReport } = require("../models/reportModel");
const { commonEmail } = require("../utils/commonEmail");

// parentPort.on("message", async (row) => {
 
//     // let csvContent = `Staff Name,Staff Email\n${row.staff_fullname},${row.staff_email}\n`;
//     // console.log("CSV Content:\n", csvContent);
//     // await commonEmail(row.staff_email, "Missing Timesheet Report", "<h3>Please find your Missing Timesheet Report.</h3>", "", "", csvContent, "MissingTimesheetReport.csv");
//     //  parentPort.postMessage(`✅ Email sent to: ${row.staff_email}`);

//      try {
//       const reportData = await missingTimesheetReport({ StaffUserId: 1, data: { action: 'missingTimesheetReport' } });
//        // console.log("Missing Timesheet Report Data:", reportData);
       
//         if (reportData.status == true && reportData.data.result.length > 0) {
//             let csvContent = "Staff Name,Staff Email\n";
//             reportData?.data?.result?.forEach(row => {
//                 csvContent += `${row.staff_fullname},${row.staff_email}\n`;
//             }
//             );

//             let toEmail = "vikaspnpinfotech@gmail.com"
//             let subjectEmail = "Missing Timesheet Report"
//             let htmlEmail = "<h3>Please find the attached Missing Timesheet Report.</h3>"
//             const dynamic_attachment = csvContent;
//             const filename = "MissingTimesheetReport.csv";


//           const emailSent = true;
//            // const emailSent = await commonEmail(toEmail, subjectEmail, htmlEmail, "", "", dynamic_attachment , filename);
//             if (emailSent) {
//                 console.log("Missing Timesheet Report email sent successfully.");
//                 parentPort.postMessage(`✅ Email sent to: ${toEmail}`);
//                 return true;
//             } else {
//                 console.log("Failed to send Missing Timesheet Report email.");
//                 parentPort.postMessage(`❌ Failed to send email to: ${toEmail}`);
//                 return false;
//             }
//         } else {
//             console.log("No missing timesheet data to report.");
//             parentPort.postMessage("No missing timesheet data to report.");
//             return true;
//         }
//     } catch (error) {
//       console.error("Error generating or sending Missing Timesheet Report:", error);
//        parentPort.postMessage(`❌ Failed for ${row.staff_email}: ${error.message}`);
//         return false;
//     }


// });





parentPort.on("message", async (rows) => {
  for (const row of rows) {
    try {
      let csvContent = `Staff Name,Staff Email\n${row.staff_fullname},${row.staff_email}\n`;

    //   await commonEmail(
    //     row.staff_email,
    //     "Missing Timesheet Report",
    //     "<h3>Please find your Missing Timesheet Report.</h3>",
    //     "",
    //     csvContent,
    //     "MissingTimesheetReport.csv"
    //   );

      parentPort.postMessage(`✅ Email sent to: ${row.staff_email}`);
    } catch (err) {
      parentPort.postMessage(`❌ Failed for ${row.staff_email}: ${err.message}`);
    }
  }
});
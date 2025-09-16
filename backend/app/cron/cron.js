console.log("Cron Job Initialized");

const cron = require("node-cron");
const { missingTimesheetReport } = require("../models/reportModel");
const { commonEmail } = require("../utils/commonEmail");
module.exports = (app) => {
  // Schedule tasks to be run on the server.
  cron.schedule("03 15 * * *", async () => {
    console.log("Running a task every minute");
    try {
      const reportData = await missingTimesheetReport({ StaffUserId: 1, data: { action: 'missingTimesheetReport' } });
       // console.log("Missing Timesheet Report Data:", reportData);
       
        if (reportData.status == true && reportData.data.result.length > 0) {
            let csvContent = "Staff Name,Staff Email\n";
            reportData?.data?.result?.forEach(row => {
                csvContent += `${row.staff_fullname},${row.staff_email}\n`;
            }
            );

            let toEmail = "vikaspnpinfotech@gmail.com"
            let subjectEmail = "Missing Timesheet Report"
            let htmlEmail = "<h3>Please find the attached Missing Timesheet Report.</h3>"
            const dynamic_attachment = csvContent;
            const filename = "MissingTimesheetReport.csv";

            const emailSent = await commonEmail(toEmail, subjectEmail, htmlEmail, "", "", dynamic_attachment , filename);
            if (emailSent) {
                console.log("Missing Timesheet Report email sent successfully.");
                return true;
            } else {
                console.log("Failed to send Missing Timesheet Report email.");
                return false;
            }
        } else {
            console.log("No missing timesheet data to report.");
            return true;
        }
    } catch (error) {
      console.error("Error generating or sending Missing Timesheet Report:", error);
        return false;
    }
    });
};



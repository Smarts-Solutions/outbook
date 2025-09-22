// emailWorker.js
const { parentPort } = require("worker_threads");

parentPort.on("message", async (row) => {
  try {
    let csvContent = `Staff Name,Staff Email\n${row.staff_fullname},${row.staff_email}\n`;
    console.log("CSV Content:\n", csvContent);
   await commonEmail(row.staff_email, "Missing Timesheet Report", "<h3>Please find your Missing Timesheet Report.</h3>", "", "", csvContent, "MissingTimesheetReport.csv");
    parentPort.postMessage(`✅ Email sent to: ${row.staff_email}`);
  } catch (err) {
    parentPort.postMessage(`❌ Failed for ${row.staff_email}: ${err.message}`);
  }
});

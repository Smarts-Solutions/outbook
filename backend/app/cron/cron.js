console.log("Cron Job Initialized");
const pool = require('../config/database');
const cron = require("node-cron");
const { Worker } = require("worker_threads");
const { join } = require("path");
const { missingTimesheetReport } = require("../models/reportModel");
const { commonEmail } = require("../utils/commonEmail");
module.exports = (app) => {
  // Schedule tasks to be run on the server.

// Missing Timesheet Report Email to Individual Staff on every Monday at 09:00 AM
  cron.schedule("0 9 * * 1", async () => {
    //console.log("Running a task every Monday at 09:00 AM to send individual emails");
  //cron.schedule("38 12 * * *", async () => {
   const [staffResult] = await pool.execute(`
    SELECT 
    id,
    CONCAT(first_name, ' ', last_name) AS staff_fullname,
    email AS staff_email
    FROM 
    staffs 
    WHERE status = '1'
    `);
  // console.log("staffResult , ",staffResult); 
    sendEmailInWorkerMissingTimeSheet(staffResult || []);


    ////////-----------Submit Timesheet Reminder Email --------------------//////

   const [staffResultSubmitTimeSheet] = await pool.execute(`
    SELECT 
        staffs.id AS id,
        CONCAT(first_name,' ',last_name) AS staff_fullname,
        staffs.email AS staff_email
    FROM staffs
    JOIN roles ON roles.id = staffs.role_id
    LEFT JOIN timesheet 
        ON staffs.id = timesheet.staff_id 
      AND (timesheet.submit_status = '1' OR (roles.id = 1 OR roles.id = 2 OR roles.id = 8)) 
    WHERE ((roles.id = 1 OR roles.id = 2 OR roles.id = 8) OR timesheet.submit_status = '1') AND staffs.status = '1'
    GROUP BY staffs.id
    `);

  sendEmailInWorkerSubmitTimesheet(staffResultSubmitTimeSheet  || []);


  }, 
  {
  timezone: "Europe/London"
 }
)

};



 // function to send email in worker thread for Missing Timesheet Report
function sendEmailInWorkerMissingTimeSheet(rows) {
  const worker = new Worker(join(__dirname, "missingTimesheetReportEmail.js"), { type: "module" });
  worker.postMessage(rows); 
  worker.on("message", (msg) => {
    console.log("RECEIVED MSG EMAIL SENT--",msg)
  });
  worker.on("error", (err) => console.log("Worker error --:", err));
  worker.on("exit", (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  });
}



// function to send email in worker thread for Submit Timesheet Reminder Email
function sendEmailInWorkerSubmitTimesheet(rows) {
  const worker = new Worker(join(__dirname, "submitTimesheetReminderEmail.js"), { type: "module" });
  worker.postMessage(rows);
  worker.on("message", (msg) => {
    console.log("RECEIVED MSG EMAIL SENT--",msg)
  });
  worker.on("error", (err) => console.log("Worker error --:", err));
  worker.on("exit", (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  });
}

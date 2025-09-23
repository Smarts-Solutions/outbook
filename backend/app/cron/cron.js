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
  //cron.schedule("20 11 * * *", async () => {
   const [staffResult] = await pool.query(`
    SELECT 
    id,
    CONCAT(first_name, ' ', last_name) AS staff_fullname,
    email AS staff_email
    FROM 
    staffs 
    WHERE status = '1'
    `);
  // console.log("staffResult , ",staffResult); 
    sendEmailInWorker(staffResult || []);
    console.log("Running a task every Monday at 09:00 AM to send individual emails");
  })

};




function sendEmailInWorker(rows) {
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


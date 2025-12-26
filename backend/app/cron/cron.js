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
    ////////-----------Missing Timesheet Report Email --------------------//////
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
    sendEmailInWorkerSubmitTimesheet(staffResultSubmitTimeSheet || []);
  },

    {
      timezone: "Europe/London"
    });

  // cron.schedule("0 9 * * *", async () => {
  //   ////////-----------Trigger Report Email --------------------//////
  //   const [superAdminAdminManagementRole] = await pool.execute(`
  //   SELECT 
  //       staffs.id AS id,
  //       CONCAT(first_name,' ',last_name) AS staff_fullname,
  //       staffs.email AS staff_email
  //   FROM staffs
  //   JOIN roles ON roles.id = staffs.role_id
  //   LEFT JOIN timesheet 
  //       ON staffs.id = timesheet.staff_id 
  //     AND (timesheet.submit_status = '1' OR (roles.id = 1 OR roles.id = 2 OR roles.id = 8)) 
  //   WHERE ((roles.id = 1 OR roles.id = 2 OR roles.id = 8) OR timesheet.submit_status = '1') AND staffs.status = '1'
  //   GROUP BY staffs.id
  //   `);
  //   wipAndToBeStartedMoreThan_7(superAdminAdminManagementRole || []);

  //   expectedDeliveryDateChanged(superAdminAdminManagementRole || []);

  //   missingPaperworkInMax2Days(superAdminAdminManagementRole || []);

  //   jobsSittingWithForOverMonth(superAdminAdminManagementRole || []);

  //   JobsNotDeliveredWithin14Days(superAdminAdminManagementRole || []);

  //   JobsNotDeliveredMissingPaperwork7Days(superAdminAdminManagementRole || []);

  // }
  //   , {
  //     timezone: "Europe/London"
  //   }
  // );

};

cron.schedule("* * * * *", async () => {
  console.log("Cron Job for WIP and To Be Started More Than 7 Days Initialized");
  // const [superAdminAdminManagementRole] = await pool.execute(`
  //   SELECT 
  //       staffs.id AS id,
  //       CONCAT(first_name,' ',last_name) AS staff_fullname,
  //       staffs.email AS staff_email,
  //       roles.role AS staff_role
  //   FROM staffs
  //   JOIN roles ON roles.id = staffs.role_id
  //   LEFT JOIN timesheet 
  //       ON staffs.id = timesheet.staff_id
  //     AND (timesheet.submit_status = '1' OR (roles.id = 1 OR roles.id = 2 OR roles.id = 8))
  //   WHERE ((roles.id = 1 OR roles.id = 2 OR roles.id = 8) OR timesheet.submit_status = '1') AND staffs.status = '1'
  //   GROUP BY staffs.id
  //   `);

  const query_access = `
       SELECT 
        staffs.id AS id,
        CONCAT(first_name,' ',last_name) AS staff_fullname,
        staffs.email AS staff_email,
        roles.role AS staff_role
        FROM staffs
        JOIN roles ON roles.id = staffs.role_id 
        WHERE roles.id = 1 OR roles.id = 2 OR roles.id = 8
        GROUP BY staffs.id
      `
    ;
  const [staffs] = await pool.execute(query_access);

  console.log("Staffs with Access for WIP and To Be Started More Than 7 Days Cron Job:", staffs);


  // const query = `
  //       SELECT 
  //       staffs.id AS id,
  //       CONCAT(first_name,' ',last_name) AS staff_fullname,
  //       staffs.email AS staff_email,
  //       roles.role AS staff_role
  //       FROM staffs
  //       JOIN roles ON roles.id = staffs.role_id
  //       LEFT JOIN jobs
  //         ON staffs.id = jobs.staff_created_id
  //       LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.staff_id = staffs.id  
  //       WHERE (jobs.status_type = 1 AND jobs.created_at <= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) OR (roles.id != 1 OR roles.id != 2 OR roles.id != 8)
  //       GROUP BY staffs.id
  //       ORDER BY 
  //         jobs.id DESC;
  //       `;

     const query = `
         SELECT 
        jobs.id AS id,
        jobs.staff_created_id AS staff_created_id,
        assigned_jobs_staff_view.staff_id AS assigned_jobs_staff_view_staff_id
        FROM 
        jobs
        JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        WHERE jobs.status_type = 1 AND jobs.created_at <= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY assigned_jobs_staff_view.staff_id
        ORDER BY 
          jobs.id DESC;
        `;    

    

  const [result] = await pool.execute(query);

  console.log("Result for WIP and To Be Started More Than 7 Days Cron Job:", result);

  wipAndToBeStartedMoreThan_7(result || []);

}, {
  timezone: "Europe/London"
});



// function to send email in worker thread for Missing Timesheet Report
function sendEmailInWorkerMissingTimeSheet(rows) {
  const worker = new Worker(join(__dirname, "missingTimesheetReportEmail.js"), { type: "module" });
  worker.postMessage(rows);
  worker.on("message", (msg) => {
    console.log("RECEIVED MSG EMAIL SENT--", msg)
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
    console.log("RECEIVED MSG EMAIL SENT--", msg)
  });
  worker.on("error", (err) => console.log("Worker error --:", err));
  worker.on("exit", (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  });
}


///////////////////----DAILY REORT EMAIL FUNCTIONS ----/////////////////////
// Trigger Report Email
function wipAndToBeStartedMoreThan_7(rows) {
  const worker = new Worker(join(__dirname, "wipAndToBeStartedMoreThanSevenDays.js"), { type: "module" });
  worker.postMessage(rows);
  worker.on("message", (msg) => {
    console.log("RECEIVED MSG EMAIL SENT--", msg)
  }
  );
  worker.on("error", (err) => console.log("Worker error --:", err));
  worker.on("exit", (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  }
  );
}

// Trigger Expected Delivery Date Changed Report Email
function expectedDeliveryDateChanged(rows) {
  const worker = new Worker(join(__dirname, "expectedDeliveryDateChanged.js"), { type: "module" });
  worker.postMessage(rows);
  worker.on("message", (msg) => {
    console.log("RECEIVED MSG EMAIL SENT--", msg)
  }
  );
  worker.on("error", (err) => console.log("Worker error --:", err));
  worker.on("exit", (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  }
  );
}

// Trigger Missing Paperwork in Max 2 Days Report Email
function missingPaperworkInMax2Days(rows) {
  const worker = new Worker(join(__dirname, "missingPaperworkInMax2Days.js"), { type: "module" });
  worker.postMessage(rows);
  worker.on("message", (msg) => {
    console.log("RECEIVED MSG EMAIL SENT--", msg)
  }
  );
  worker.on("error", (err) => console.log("Worker error --:", err));
  worker.on("exit", (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  }
  );
}

// Trigger Jobs Sitting With Staff For Over Month Report Email
function jobsSittingWithForOverMonth(rows) {
  const worker = new Worker(join(__dirname, "jobsSittingWithForOverMonth.js"), { type: "module" });
  worker.postMessage(rows);
  worker.on("message", (msg) => {
    console.log("RECEIVED MSG EMAIL SENT--", msg)
  }
  );
  worker.on("error", (err) => console.log("Worker error --:", err));
  worker.on("exit", (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  }
  );
}

// Trigger Jobs Not Delivered Within 14 Days Report Email
function JobsNotDeliveredWithin14Days(rows) {
  const worker = new Worker(join(__dirname, "jobsNotDeliveredWithin14Days.js"), { type: "module" });
  worker.postMessage(rows);
  worker.on("message", (msg) => {
    console.log("RECEIVED MSG EMAIL SENT--", msg)
  }
  );
  worker.on("error", (err) => console.log("Worker error --:", err));
  worker.on("exit", (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  }
  );
}

// Trigger Jobs Not Delivered After Missing Paperwork 7 Days Report Email

function JobsNotDeliveredMissingPaperwork7Days(rows) {
  const worker = new Worker(join(__dirname, "jobsNotDeliveredMissingPaperwork7Days.js"), { type: "module" });
  worker.postMessage(rows);
  worker.on("message", (msg) => {
    console.log("RECEIVED MSG EMAIL SENT--", msg)
  }
  );
  worker.on("error", (err) => console.log("Worker error --:", err));
  worker.on("exit", (code) => {
    if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
  }
  );
}



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

  cron.schedule("0 9 * * *", async () => {
    ////////-----------Trigger Report Email --------------------//////


    // 1 . WIP and To Be Started More Than 7 Days Report Email to Super Admin and Admin and Management Role Staffs  
    const wipAndToBeStartedMoreThan_7_query = `
        SELECT 
        staffs.id AS id,
        CONCAT(first_name,' ',last_name) AS staff_fullname,
        staffs.email AS staff_email,
        roles.role AS staff_role,
        roles.id AS role_id
        FROM 
        staffs
        JOIN roles ON roles.id = staffs.role_id
        LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.staff_id = staffs.id
        LEFT JOIN jobs ON jobs.id = assigned_jobs_staff_view.job_id
        WHERE
        (jobs.status_type = 1 AND jobs.created_at <= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) 
        OR roles.id IN (1, 2, 8)
        GROUP BY staffs.id
        ORDER BY 
          staffs.id DESC;
        `;

    const [wipAndToBeStartedMoreThan_7_result] = await pool.execute(wipAndToBeStartedMoreThan_7_query);

    console.log("Result for WIP and To Be Started More Than 7 Days Cron Job:", wipAndToBeStartedMoreThan_7_result);
    wipAndToBeStartedMoreThan_7(wipAndToBeStartedMoreThan_7_result || []);




    // 2. Expected Delivery Date Changed Report Email to Super Admin and Admin and Management Role Staffs
      const expectedDeliveryDateChanged_query = `
        SELECT 
        staffs.id AS id,
        CONCAT(first_name,' ',last_name) AS staff_fullname,
        staffs.email AS staff_email,
        roles.role AS staff_role,
        roles.id AS role_id
        FROM 
        staffs
        JOIN roles ON roles.id = staffs.role_id
        LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.staff_id = staffs.id
        LEFT JOIN jobs ON jobs.id = assigned_jobs_staff_view.job_id
        WHERE
        (jobs.expected_delivery_date <> jobs.expected_delivery_date_old) 
        OR roles.id IN (1, 2, 8)
        GROUP BY staffs.id
        ORDER BY 
          staffs.id DESC;
        `;

  const [expectedDeliveryDateChanged_result] = await pool.execute(expectedDeliveryDateChanged_query);
  expectedDeliveryDateChanged(expectedDeliveryDateChanged_result || []);


  // 3. Missing Paperwork in Max 2 Days Report Email to Super Admin and Admin and Management Role Staffs
  const missingPaperworkInMax2Days_query = `
        SELECT 
        staffs.id AS id,
        CONCAT(first_name,' ',last_name) AS staff_fullname,
        staffs.email AS staff_email,
        roles.role AS staff_role,
        roles.id AS role_id
        FROM 
        staffs
        JOIN roles ON roles.id = staffs.role_id
        LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.staff_id = staffs.id
        LEFT JOIN jobs ON jobs.id = assigned_jobs_staff_view.job_id
        LEFT JOIN missing_logs ON jobs.id = missing_logs.job_id
        WHERE 
        ((jobs.created_at <= NOW() - INTERVAL 2 DAY) AND jobs.status_type NOT IN (2,6,7,17,18,19,20)
        AND missing_logs.job_id IS NULL)  OR roles.id IN (1, 2, 8)
        GROUP BY staffs.id
        ORDER BY 
          staffs.id DESC;
        `;

     const [missingPaperworkInMax2Days_result] = await pool.execute(missingPaperworkInMax2Days_query);   
  missingPaperworkInMax2Days(missingPaperworkInMax2Days_result || []);


  // 4. Jobs Sitting With Staff For Over Month Report Email to Super Admin and Admin and Management Role Staffs
  const jobsSittingWithForOverMonth_query = `
        SELECT 
        staffs.id AS id,
        CONCAT(first_name,' ',last_name) AS staff_fullname,
        staffs.email AS staff_email,
        roles.role AS staff_role,
        roles.id AS role_id
        FROM 
        staffs
        JOIN roles ON roles.id = staffs.role_id
        LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.staff_id = staffs.id
        LEFT JOIN jobs ON jobs.id = assigned_jobs_staff_view.job_id
        LEFT JOIN missing_logs ON jobs.id = missing_logs.job_id
        WHERE
        (
        jobs.created_at >= NOW() - INTERVAL 30 DAY
        AND jobs.created_at <= NOW()
        AND jobs.status_type NOT IN (6,7,17,18,19,20)
        ) 
        OR roles.id IN (1, 2, 8)
        GROUP BY staffs.id
        ORDER BY 
          staffs.id DESC;
        `;

     const [jobsSittingWithForOverMonth_result] = await pool.execute(jobsSittingWithForOverMonth_query);   
  jobsSittingWithForOverMonth(jobsSittingWithForOverMonth_result || []);

  // 5. Jobs Not Delivered Within 14 Days Report Email to Super Admin and Admin and Management Role Staffs







    const [superAdminAdminManagementRole] = await pool.execute(`
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

    


    

    // JobsNotDeliveredWithin14Days(superAdminAdminManagementRole || []);

    // JobsNotDeliveredMissingPaperwork7Days(superAdminAdminManagementRole || []);

  }
    , {
      timezone: "Europe/London"
    }
  );

};

cron.schedule("* * * * *", async () => {
  

const JobsNotDeliveredWithin14Days_query = `
        SELECT 
        staffs.id AS id,
        CONCAT(first_name,' ',last_name) AS staff_fullname,
        staffs.email AS staff_email,
        roles.role AS staff_role,
        roles.id AS role_id
        FROM 
        staffs
        JOIN roles ON roles.id = staffs.role_id
        LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.staff_id = staffs.id
        LEFT JOIN jobs ON jobs.id = assigned_jobs_staff_view.job_id
        LEFT JOIN missing_logs ON jobs.id = missing_logs.job_id
        WHERE
        (
        jobs.created_at >= NOW() - INTERVAL 30 DAY
        AND jobs.created_at <= NOW()
        AND jobs.status_type NOT IN (6,7,17,18,19,20)
        ) 
        OR roles.id IN (1, 2, 8)
        GROUP BY staffs.id
        ORDER BY 
          staffs.id DESC;
        `;

     const [JobsNotDeliveredWithin14Days_result] = await pool.execute(JobsNotDeliveredWithin14Days_query);   
  JobsNotDeliveredWithin14Days(JobsNotDeliveredWithin14Days_result || []);

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



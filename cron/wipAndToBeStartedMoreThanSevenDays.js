const pool = require("../config/database");
const { parentPort } = require("worker_threads");
const { commonEmail } = require("../utils/commonEmail");
const { logEmail } = require("../utils/emailLogger");
const xlsx = require('xlsx');

/* ---------------- HELPERS ---------------- */

const convertDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};



/* 🔥 LIMIT PARALLEL EXECUTION */
async function processWithLimit(items, limit, handler) {
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      await handler(items[currentIndex]);
    }
  }

  const workers = Array(limit).fill(null).map(worker);
  await Promise.all(workers);
}

/* ---------------- MAIN WORKER ---------------- */

parentPort.on("message", async (rows) => {
  try {
    /* ✅ STEP 1: REMOVE DUPLICATES */
    const uniqueUsers = [];
    const seen = new Set();

    for (const r of rows) {
      if (!seen.has(r.staff_email)) {
        seen.add(r.staff_email);
        uniqueUsers.push(r);
      }
    }

    parentPort.postMessage(`Total unique users: ${uniqueUsers.length}`);

    /* ✅ STEP 2: FETCH JOBS (ONLY ONCE) */
    const query = `
        SELECT 
        jobs.id AS id,
        (SELECT MAX(status_update_date) FROM job_status_updation WHERE job_id = jobs.id) AS current_status_date,
        job_allowed_staffs.staff_id AS job_allowed_staff_id,
        jobs.staff_created_id AS staff_created_id,
          CONCAT(
                SUBSTRING(customers.trading_name, 1, 3), '_',
                SUBSTRING(clients.trading_name, 1, 3), '_',
                SUBSTRING(job_types.type, 1, 4), '_',
                SUBSTRING(jobs.job_id, 1, 15)
                ) AS job_code_id,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        clients.id AS client_id,
        clients.trading_name AS client_trading_name,
        staffs3.id AS account_manager_id,
        CONCAT(
          staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
          services.id AS service_id,
          services.name AS service_name,
          job_types.id AS job_type_id,
          job_types.type AS job_type_name,
          master_status.name AS status,
          staffs2.id AS reviewer_id,
          CONCAT(staffs2.first_name, ' ', staffs2.last_name) AS reviewer_name,
          staffs.id AS allocated_id,
          CONCAT(staffs.first_name, ' ', staffs.last_name) AS allocated_name,
          CONCAT(staffs5.first_name, ' ', staffs5.last_name) AS created_by, 
          DATE_FORMAT(jobs.filing_Companies_date, '%Y-%m-%d') AS filing_Companies_date,
          DATE_FORMAT(jobs.internal_deadline_date, '%Y-%m-%d') AS internal_deadline_date,
          DATE_FORMAT(jobs.customer_deadline_date, '%Y-%m-%d') AS customer_deadline_date,  
          DATE_FORMAT(queries.query_sent_date, '%Y-%m-%d') AS query_sent_date,
          DATE_FORMAT(queries.final_query_response_received_date, '%Y-%m-%d') AS final_query_response_received_date,
          DATE_FORMAT(drafts.draft_sent_on, '%Y-%m-%d') AS draft_sent_on,
          DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on,
          DATE_FORMAT(jobs.date_received_on, '%Y-%m-%d') AS job_received_on,
        GROUP_CONCAT(CONCAT(staffs4.first_name, ' ', staffs4.last_name) SEPARATOR ', ') AS multiple_staff_names
        FROM 
        jobs
        JOIN staffs AS staffs5 ON jobs.staff_created_id = staffs5.id
        LEFT JOIN 
        job_allowed_staffs ON job_allowed_staffs.job_id = jobs.id
        LEFT JOIN staffs AS staffs4 ON job_allowed_staffs.staff_id = staffs4.id
        LEFT JOIN 
        customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id
        LEFT JOIN 
        job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN 
        services ON jobs.service_id = services.id
        LEFT JOIN 
        staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN 
        staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN 
        staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN 
        master_status ON master_status.id = jobs.status_type
        LEFT JOIN
        queries ON queries.job_id = jobs.id
        LEFT JOIN
        drafts ON drafts.job_id = jobs.id
        WHERE customers.status = '1' AND jobs.status_type = 1 AND DATE(jobs.date_received_on) <= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY jobs.id
        ORDER BY 
          jobs.id DESC;
        `;
    const [result] = await pool.execute(query);

    if (!result.length) {
      parentPort.postMessage("No jobs found");
      return;
    }

    /* ✅ STEP 3: GENERATE CSV ONCE */

    let jobDataList = [];
    if (result && result.length > 0) {
      result?.forEach((val) => {
        jobDataList.push({
          "Job Id": val.job_code_id || ' - ',
          "Job Received On": convertDate(val.job_received_on),
          "Customer Name": val.customer_trading_name || " - ",
          "Account Manager": val.account_manager_name || " - ",
          "Clients": val.client_trading_name || " - ",
          "Service Type": val.service_name || " - ",
          "Job Type": val.job_type_name || " - ",
          "Status": val.status || " - ",
        "Days in Current Status": (() => {
            if (!val.current_status_date) return "0 Day";
            const ms = new Date() - new Date(val.current_status_date);
            if (isNaN(ms) || ms < 0) return "0 Day";
            const days = Math.floor(ms / (1000 * 60 * 60 * 24));
            return `${days} Day${days > 1 ? 's' : ''}`;
        })(),
          "Allocated To": val.allocated_name || " - ",
          "Allocated to (Other)": val.multiple_staff_names || " - ",
          "Reviewer Name": val.reviewer_name || " - ",
          "Companies House Due Date": convertDate(val.filing_Companies_date),
          "Internal Deadline": convertDate(val.internal_deadline_date),
          "Customer Deadline": convertDate(val.customer_deadline_date),
          "Initial Query Sent Date": convertDate(val.query_sent_date),
          "Final Query Response Received Date": convertDate(val.final_query_response_received_date),
          "First Draft Sent": convertDate(val.draft_sent_on),
          "Final Draft Sent": convertDate(val.final_draft_sent_on),
          "Created By": val.created_by || " - "
        });
      });
    }

    
    const [allStatusRecords] = await pool.execute("SELECT name FROM master_status");
    const allStatuses = allStatusRecords.map(s => s.name);
    
    /* ✅ STEP 4: SEND EMAILS WITH LIMIT */
    await processWithLimit(uniqueUsers, 5, async (user) => {
      try {

        
        let finalJobData = jobDataList;

        /* 👉 NON ADMIN USER */
        if (![1, 2, 8].includes(user.role_id)) {
          const res = await otherUserDataGet(user);
          if (!res.status) return;
          finalJobData = res.jobDataList;
        }

        let toEmail = user?.staff_email;
        let subjectEmail = "Jobs (WIP / To Be Started) Not Updated in the Last 7 Days"
        let htmlEmail = "<h3>Alert: Jobs (WIP / To Be Started) Not Updated in the Last 7 Days.</h3>"
        
        const statusCounts = {};
        if (typeof allStatuses !== 'undefined') {
            allStatuses.forEach(s => { statusCounts[s] = 0; });
        }
        finalJobData.forEach(job => {
          const status = job.Status || ' - ';
          if (statusCounts[status] !== undefined) {
             statusCounts[status]++;
          } else {
             statusCounts[status] = 1;
          }
        });
        const summaryData = Object.keys(statusCounts).filter(status => statusCounts[status] > 0).map(status => ({
          "Summary": status,
          "Total Count": statusCounts[status]
        }));
        summaryData.push({ "Summary": "Total Jobs (WIP / To Be Started) Not Updated in 7 Days", "Total Count": finalJobData.length });

        const currentDate = new Date();
        const weekNum = Math.ceil(currentDate.getDate() / 7);
        const monthNum = currentDate.getMonth() + 1;
        const yearNum = currentDate.getFullYear();
        const shortDateStr = `Week ${weekNum} Month ${monthNum} Year ${yearNum}`;

        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(summaryData), "Summary");
        xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(finalJobData), "WIP Not Updated 7 Days");

        const excelBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        const filename = `Jobs (with status WIP and To Be Started) that haven’t been modified for more than 7 days consecutively -${new Date().toISOString().slice(0, 10)}.xlsx`;

        const sent = await commonEmail(toEmail, subjectEmail, htmlEmail, "", "", excelBuffer, filename);

          const attachmentJson = finalJobData;
          logEmail({
            toEmail: toEmail,
            filename: filename,
            attachment: attachmentJson,
            logFileName: "wipAndToBeStartedMoreThanSevenDays.json",
          });

        parentPort.postMessage(
          sent ? `✅ ${user.staff_email}` : `❌ ${user.staff_email}`
        );

      } catch (err) {
        parentPort.postMessage(`❌ ${user.staff_email}: ${err.message}`);
      }
    });

   
    parentPort.postMessage("All emails processed ✅");
  } catch (err) {
    parentPort.postMessage("Worker failed: " + err.message);
  }
});

async function otherUserDataGet(row) {
  const query = `
        SELECT 
        jobs.id AS id,
        (SELECT MAX(status_update_date) FROM job_status_updation WHERE job_id = jobs.id) AS current_status_date,
        jobs.staff_created_id AS staff_created_id,
          CONCAT(
                SUBSTRING(customers.trading_name, 1, 3), '_',
                SUBSTRING(clients.trading_name, 1, 3), '_',
                SUBSTRING(job_types.type, 1, 4), '_',
                SUBSTRING(jobs.job_id, 1, 15)
                ) AS job_code_id,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        clients.id AS client_id,
        clients.trading_name AS client_trading_name,
        staffs3.id AS account_manager_id,
        CONCAT(
          staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
          services.id AS service_id,
          services.name AS service_name,
          job_types.id AS job_type_id,
          job_types.type AS job_type_name,
          master_status.name AS status,
          staffs2.id AS reviewer_id,
          CONCAT(staffs2.first_name, ' ', staffs2.last_name) AS reviewer_name,
          staffs.id AS allocated_id,
          CONCAT(staffs.first_name, ' ', staffs.last_name) AS allocated_name,
          CONCAT(staffs5.first_name, ' ', staffs5.last_name) AS created_by,    
          DATE_FORMAT(jobs.filing_Companies_date, '%Y-%m-%d') AS filing_Companies_date,
          DATE_FORMAT(jobs.internal_deadline_date, '%Y-%m-%d') AS internal_deadline_date,
          DATE_FORMAT(jobs.customer_deadline_date, '%Y-%m-%d') AS customer_deadline_date,  
          DATE_FORMAT(queries.query_sent_date, '%Y-%m-%d') AS query_sent_date,
          DATE_FORMAT(queries.final_query_response_received_date, '%Y-%m-%d') AS final_query_response_received_date,
          DATE_FORMAT(drafts.draft_sent_on, '%Y-%m-%d') AS draft_sent_on,
          DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on,
          DATE_FORMAT(jobs.date_received_on, '%Y-%m-%d') AS job_received_on,
        GROUP_CONCAT(CONCAT(staffs4.first_name, ' ', staffs4.last_name) SEPARATOR ', ') AS multiple_staff_names,
        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id,
        assigned_jobs_staff_view.staff_id AS assigned_jobs_staff_view_staff_id 
        FROM 
        jobs
        JOIN staffs AS staffs5 ON jobs.staff_created_id = staffs5.id
        LEFT JOIN 
        job_allowed_staffs ON job_allowed_staffs.job_id = jobs.id
        LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        LEFT JOIN staffs AS staffs4 ON job_allowed_staffs.staff_id = staffs4.id
        LEFT JOIN 
        customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id
        LEFT JOIN 
        job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN 
        services ON jobs.service_id = services.id
        LEFT JOIN 
        staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN 
        staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN 
        staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN 
        master_status ON master_status.id = jobs.status_type
        LEFT JOIN
        queries ON queries.job_id = jobs.id
        LEFT JOIN
        drafts ON drafts.job_id = jobs.id
        WHERE 
        customers.status = '1' AND jobs.status_type = 1 AND DATE(jobs.date_received_on) <= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        AND assigned_jobs_staff_view.staff_id = ${row?.id}  AND (
    assigned_jobs_staff_view.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci
    OR jobs.service_id = assigned_jobs_staff_view.service_id_assign
  )
        GROUP BY jobs.id
        ORDER BY jobs.id DESC;
        `;

  const [result] = await pool.execute(query);
  // console.log("Generating CSV for other user: Length --- ", result.length);
  let jobDataList = [];
  if (result && result.length > 0) {
    result?.forEach((val) => {
      jobDataList.push({
        "Job Id": val.job_code_id || ' - ',
        "Job Received On": convertDate(val.job_received_on),
        "Customer Name": val.customer_trading_name || " - ",
        "Account Manager": val.account_manager_name || " - ",
        "Clients": val.client_trading_name || " - ",
        "Service Type": val.service_name || " - ",
        "Job Type": val.job_type_name || " - ",
        "Status": val.status || " - ",
        "Days in Current Status": (() => {
            if (!val.current_status_date) return "0 Day";
            const ms = new Date() - new Date(val.current_status_date);
            if (isNaN(ms) || ms < 0) return "0 Day";
            const days = Math.floor(ms / (1000 * 60 * 60 * 24));
            return `${days} Day${days > 1 ? 's' : ''}`;
        })(),
        "Allocated To": val.allocated_name || " - ",
        "Allocated to (Other)": val.multiple_staff_names || " - ",
        "Reviewer Name": val.reviewer_name || " - ",
        "Companies House Due Date": convertDate(val.filing_Companies_date),
        "Internal Deadline": convertDate(val.internal_deadline_date),
        "Customer Deadline": convertDate(val.customer_deadline_date),
        "Initial Query Sent Date": convertDate(val.query_sent_date),
        "Final Query Response Received Date": convertDate(val.final_query_response_received_date),
        "First Draft Sent": convertDate(val.draft_sent_on),
        "Final Draft Sent": convertDate(val.final_draft_sent_on),
        "Created By": val.created_by || " - "
      });
    });

    return { status: true, jobDataList };
  } else {
    return { status: false };
  }
}

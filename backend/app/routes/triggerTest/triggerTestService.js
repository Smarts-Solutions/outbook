const { Worker } = require("worker_threads");
const { join } = require("path");

const REPORT_CONFIG = {
  wip_7_days: {
    name: "Jobs in WIP or to be started - Status not updated in 7 days",
    file: "wipAndToBeStartedMoreThanSevenDays.js"
  },
  sitting_over_month: {
    name: "Jobs Sitting With Staff For Over Month",
    file: "jobsSittingWithForOverMonth.js"
  },
  not_delivered_14_days: {
    name: "Jobs Not Delivered Within 14 Days",
    file: "jobsNotDeliveredWithin14Days.js"
  },
  missing_paperwork_7_days: {
    name: "Jobs Not Delivered Missing Paperwork 7 Days",
    file: "jobsNotDeliveredMissingPaperwork7Days.js"
  },
  missing_paperwork_2_days: {
    name: "Missing Paperwork In Max 2 Days",
    file: "missingPaperworkInMax2Days.js"
  },
  expected_delivery_date_changed: {
    name: "Expected Delivery Date Changed Report",
    file: "expectedDeliveryDateChanged.js"
  },
  missing_timesheet: {
    name: "Missing Timesheet Report",
    file: "missingTimesheetReportEmail.js"
  }
};

function triggerWorker(workerFile, targetEmail) {
  try {
    const workerPath = join(__dirname, "..", "..", "cron", workerFile);
    const worker = new Worker(workerPath, {
      type: "module",
      env: process.env
    });

    const payload = [
      {
        id: 1,
        staff_fullname: "Testing Admin",
        staff_email: targetEmail,
        staff_role: "Super Admin",
        role_id: 1
      }
    ];

    worker.postMessage(payload);

    // Auto-terminate after execution or max 2 minutes
    worker.on("message", (msg) => {
      console.log(`[TriggerTest] Worker (${workerFile}) msg:`, msg);
      if (
        typeof msg === "string" &&
        (msg.includes("All emails processed") ||
          msg.includes("✅") ||
          msg.includes("Worker failed") ||
          msg.includes("No jobs found"))
      ) {
        setTimeout(() => {
          try { worker.terminate(); } catch (e) {}
        }, 1000);
      }
    });

    worker.on("error", (err) => {
      console.error(`[TriggerTest] Worker (${workerFile}) error:`, err);
      try { worker.terminate(); } catch (e) {}
    });

    setTimeout(() => {
      try { worker.terminate(); } catch (e) {}
    }, 120000);
  } catch (err) {
    console.error(`[TriggerTest] Failed to spawn worker ${workerFile}:`, err);
  }
}

const dispatchReports = async ({ email, reportType }) => {
  const targetEmail = (email || "").trim();
  if (!targetEmail) {
    return { status: false, message: "Valid email is required" };
  }

  if (reportType === "all") {
    const reportKeys = Object.keys(REPORT_CONFIG);
    // Background dispatch
    setTimeout(async () => {
      for (const key of reportKeys) {
        triggerWorker(REPORT_CONFIG[key].file, targetEmail);
      }
    }, 100);

    return {
      status: true,
      message: `Trigger started for all 7 reports! Email(s) will be delivered to ${targetEmail} shortly.`,
      data: reportKeys.map((k) => ({
        key: k,
        name: REPORT_CONFIG[k].name,
        status: "Initiated"
      }))
    };
  }

  const report = REPORT_CONFIG[reportType];
  if (!report) {
    return { status: false, message: "Invalid report type selected." };
  }

  // Background dispatch
  setTimeout(() => {
    triggerWorker(report.file, targetEmail);
  }, 100);

  return {
    status: true,
    message: `'${report.name}' triggered successfully! Excel report will be sent to ${targetEmail}.`,
    data: [
      {
        key: reportType,
        name: report.name,
        status: "Initiated"
      }
    ]
  };
};

module.exports = {
  REPORT_CONFIG,
  dispatchReports
};

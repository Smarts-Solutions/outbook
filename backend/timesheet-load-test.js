// Bulk/load test for POST /saveTimesheet.
// Loops the same payload shape used in test.js N times, cycling staff_id (and StaffUserId
// to match) through the given staff list, and fires them at the real running backend.
//
// Usage:
//   node timesheet-load-test.js [totalIterations] [concurrency]
//   node timesheet-load-test.js 1000 10

require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const pLimit = require("p-limit");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 2222;
const BASE_URL = `http://localhost:${PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const TOTAL_ITERATIONS = Number(process.argv[2]) || 1000;
const CONCURRENCY = Number(process.argv[3]) || 10;

const staffList = [
  411, 225, 279, 408, 340, 437, 390, 459, 528, 256,
  309, 470, 207, 150, 486, 302, 446, 22, 181, 559,
];

// Same row template used in test.js's manual payload (task_type "1" = Internal,
// job_id/task_id here map to internal.id / sub_internal.id, which are not staff-scoped,
// so the same ids are valid for every staff in the list).
const rowTemplate = {
  id: null,
  task_type: "1",
  customer_id: null,
  client_id: null,
  job_id: 12,
  task_id: 38,
  job_total_time: null,
  monday_date: "2026-09-07",
  monday_hours: "1",
  monday_note: null,
  tuesday_date: "2026-09-08",
  tuesday_hours: "2",
  tuesday_note: null,
  wednesday_date: "2026-09-09",
  wednesday_hours: "3",
  wednesday_note: null,
  thursday_date: "2026-09-10",
  thursday_hours: "4",
  thursday_note: null,
  friday_date: "2026-09-11",
  friday_hours: "5",
  friday_note: null,
  saturday_date: null,
  saturday_hours: null,
  saturday_note: null,
  sunday_date: null,
  sunday_hours: null,
  sunday_note: null,
  remark: null,
  newRow: 1,
  editRow: 0,
  submit_status: "0",
  staffs_hourminute: "42:30",
  total_hours: 15,
};

function buildPayload(staffId) {
  return {
    staff_id: staffId,
    data: Array.from({ length: 8 }, () => ({ ...rowTemplate })),
    deleteRows: [],
    weekOffset: 0,
    ip: "122.168.114.106",
    StaffUserId: staffId,
  };
}

async function ensureAuthTokens(pool, staffIds) {
  const tokenMap = {};
  for (const id of staffIds) {
    const token = jwt.sign({ userId: id }, JWT_SECRET);
    await pool.query("UPDATE staffs SET login_auth_token = ? WHERE id = ?", [token, id]);
    tokenMap[id] = token;
  }
  return tokenMap;
}

async function run() {
  console.log(`Target: ${BASE_URL}/saveTimesheet`);
  console.log(`Iterations: ${TOTAL_ITERATIONS} | Concurrency: ${CONCURRENCY} | Staff pool: ${staffList.length}`);

  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("Refreshing login_auth_token for staff pool so requests pass verifyToken...");
  const tokenMap = await ensureAuthTokens(pool, staffList);

  const limit = pLimit(CONCURRENCY);
  const results = [];
  let done = 0;

  const tasks = Array.from({ length: TOTAL_ITERATIONS }, (_, i) => {
    const staffId = staffList[i % staffList.length];
    return limit(async () => {
      const payload = buildPayload(staffId);
      const startedAt = Date.now();
      try {
        const res = await axios.post(`${BASE_URL}/saveTimesheet`, payload, {
          headers: { Authorization: tokenMap[staffId] },
          timeout: 20000,
        });
        results.push({
          iteration: i,
          staffId,
          durationMs: Date.now() - startedAt,
          httpStatus: res.status,
          status: res.data?.status,
          message: res.data?.message,
          queued: res.data?.queued || false,
        });
      } catch (err) {
        results.push({
          iteration: i,
          staffId,
          durationMs: Date.now() - startedAt,
          httpStatus: err.response?.status ?? null,
          status: false,
          message: err.response?.data?.message ?? err.message,
          error: err.response?.data?.error ?? err.message,
        });
      } finally {
        done++;
        if (done % 50 === 0 || done === TOTAL_ITERATIONS) {
          console.log(`Progress: ${done}/${TOTAL_ITERATIONS}`);
        }
      }
    });
  });

  await Promise.all(tasks);
  await pool.end();

  const succeeded = results.filter((r) => r.status === true && !r.queued);
  const queued = results.filter((r) => r.queued);
  const failed = results.filter((r) => r.status !== true && !r.queued);

  const durations = results.map((r) => r.durationMs);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / (durations.length || 1);
  const maxDuration = Math.max(...durations, 0);

  const byStaff = {};
  for (const r of results) {
    byStaff[r.staffId] = byStaff[r.staffId] || { total: 0, succeeded: 0, failed: 0, queued: 0 };
    byStaff[r.staffId].total++;
    if (r.queued) byStaff[r.staffId].queued++;
    else if (r.status === true) byStaff[r.staffId].succeeded++;
    else byStaff[r.staffId].failed++;
  }

  const failureBreakdown = {};
  for (const r of failed) {
    const key = r.message || "Unknown error";
    failureBreakdown[key] = (failureBreakdown[key] || 0) + 1;
  }

  const summary = {
    target: `${BASE_URL}/saveTimesheet`,
    totalIterations: TOTAL_ITERATIONS,
    concurrency: CONCURRENCY,
    staffPool: staffList,
    totals: {
      total: results.length,
      succeeded: succeeded.length,
      queued: queued.length,
      failed: failed.length,
    },
    timingMs: { avg: Math.round(avgDuration), max: maxDuration },
    byStaff,
    failureBreakdown,
    failedSamples: failed.slice(0, 20),
  };

  const outFile = path.join(__dirname, `timesheet-load-test-result-${Date.now()}.json`);
  fs.writeFileSync(outFile, JSON.stringify({ summary, results }, null, 2));

  console.log("\n===== SUMMARY =====");
  console.log(`Total requests : ${summary.totals.total}`);
  console.log(`Succeeded      : ${summary.totals.succeeded}`);
  console.log(`Queued (async) : ${summary.totals.queued}`);
  console.log(`Failed         : ${summary.totals.failed}`);
  console.log(`Avg time (ms)  : ${summary.timingMs.avg}`);
  console.log(`Max time (ms)  : ${summary.timingMs.max}`);
  if (Object.keys(failureBreakdown).length) {
    console.log("\nFailure reasons:");
    for (const [msg, count] of Object.entries(failureBreakdown)) {
      console.log(`  [${count}x] ${msg}`);
    }
  }
  console.log(`\nFull report written to: ${outFile}`);
}

run().catch((err) => {
  console.error("Load test crashed:", err);
  process.exit(1);
});

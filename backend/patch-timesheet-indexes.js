// One-off, idempotent index patch for the `timesheet` table.
// Run with: node patch-timesheet-indexes.js
// Checks what's already there first (information_schema) so it's safe to
// re-run against local/staging/production without erroring on duplicates.
require("dotenv").config();
const mysql = require("mysql2/promise");

async function indexExists(pool, table, indexName) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?",
    [process.env.DB_NAME, table, indexName]
  );
  return rows[0].cnt > 0;
}

async function hasPrimaryKey(pool, table) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = 'PRIMARY'",
    [process.env.DB_NAME, table]
  );
  return rows[0].cnt > 0;
}

async function run() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log(`Checking indexes on database: ${process.env.DB_NAME}`);

  const [[{ cnt: rowCount }]] = await pool.query("SELECT COUNT(*) AS cnt FROM timesheet");
  console.log(`timesheet row count: ${rowCount}`);

  if (!(await hasPrimaryKey(pool, "timesheet"))) {
    console.log("No PRIMARY KEY on timesheet.id — adding one ...");
    await pool.query("ALTER TABLE timesheet ADD PRIMARY KEY (id)");
  } else {
    console.log("PRIMARY KEY already present, skipping.");
  }

  const indexesToAdd = [
    { name: "idx_staff_deleted", ddl: "ADD INDEX idx_staff_deleted (staff_id, is_deleted)" },
    { name: "idx_submit_status", ddl: "ADD INDEX idx_submit_status (submit_status)" },
    { name: "idx_task_type", ddl: "ADD INDEX idx_task_type (task_type)" },
    { name: "idx_job_id", ddl: "ADD INDEX idx_job_id (job_id)" },
  ];

  for (const idx of indexesToAdd) {
    if (!(await indexExists(pool, "timesheet", idx.name))) {
      console.log(`Adding index ${idx.name} ...`);
      await pool.query(`ALTER TABLE timesheet ${idx.ddl}`);
    } else {
      console.log(`${idx.name} already exists, skipping.`);
    }
  }

  console.log("Index patch complete.");
  await pool.end();
}

run().catch((err) => {
  console.error("Index patch failed:", err);
  process.exit(1);
});

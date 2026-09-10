// One-off, idempotent schema patch for the local dev DB.
// The `timeSheetModel.js` code (saveTimesheet/getTimesheet/deleteTimesheetRow) reads/writes
// columns and a table that don't exist in this local `outbooks` copy (monday_filled_at..
// sunday_filled_at, timesheet.is_deleted, timesheet_logs) - they must have been added directly
// to a staging/production DB and never synced down. This adds only what's missing; existing
// data/rows are untouched.
require("dotenv").config();
const mysql = require("mysql2/promise");

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

async function columnExists(pool, table, column) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?",
    [process.env.DB_NAME, table, column]
  );
  return rows[0].cnt > 0;
}

async function tableExists(pool, table) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
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

  console.log(`Patching schema on database: ${process.env.DB_NAME}`);

  if (!(await columnExists(pool, "timesheet", "is_deleted"))) {
    console.log("Adding timesheet.is_deleted ...");
    await pool.query("ALTER TABLE timesheet ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0");
  } else {
    console.log("timesheet.is_deleted already exists, skipping.");
  }

  for (const day of DAYS) {
    const col = `${day}_filled_at`;
    if (!(await columnExists(pool, "timesheet", col))) {
      console.log(`Adding timesheet.${col} ...`);
      await pool.query(`ALTER TABLE timesheet ADD COLUMN ${col} DATETIME DEFAULT NULL`);
    } else {
      console.log(`timesheet.${col} already exists, skipping.`);
    }
  }

  if (!(await tableExists(pool, "timesheet_logs"))) {
    console.log("Creating timesheet_logs table ...");
    await pool.query(`
      CREATE TABLE timesheet_logs (
        id INT NOT NULL AUTO_INCREMENT,
        timesheet_row_id INT NOT NULL,
        staff_id INT NOT NULL,
        action_type VARCHAR(20) NOT NULL,
        internal_external TINYINT(1) NOT NULL,
        customer_id INT DEFAULT NULL,
        client_id INT DEFAULT NULL,
        job_id INT DEFAULT NULL,
        task_id INT DEFAULT NULL,
        entry_day VARCHAR(20) DEFAULT NULL,
        hours_entered VARCHAR(20) DEFAULT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY timesheet_row_id (timesheet_row_id),
        KEY staff_id (staff_id)
      ) ENGINE=MyISAM DEFAULT CHARSET=latin1
    `);
  } else {
    console.log("timesheet_logs already exists, skipping.");
  }

  console.log("Schema patch complete.");
  await pool.end();
}

run().catch((err) => {
  console.error("Schema patch failed:", err);
  process.exit(1);
});

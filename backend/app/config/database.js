const mysql = require('mysql2');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: "",
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();

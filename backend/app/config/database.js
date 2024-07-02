const mysql = require('mysql2');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

console.log('DB_HOST', DB_HOST);  
console.log('DB_USER', DB_USER);
console.log('DB_PASSWORD', DB_PASSWORD);
console.log('DB_NAME', DB_NAME);
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();
// Check connection
promisePool.getConnection()
  .then(connection => {
    console.log('Connected to the database successfully!');
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });


 module.exports = promisePool

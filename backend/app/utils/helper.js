const pool = require('../config/database');
const SatffLogUpdateOperation = async (logData) => {

    console.log("logData adsadfsffd",logData)
    try {
        let staff_id = logData.staff_id;
        let date = logData.date;
        let module_name = logData.module_name;
        let log_message = logData.log_message;
        let permission_type = logData.permission_type;
        let ip = logData.ip;

        const query = `
        INSERT INTO staff_logs (staff_id,date,module_name,log_message,permission_type,ip)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result2] = await pool.execute(query, [staff_id,date,module_name,log_message,permission_type,ip]);
    } catch (error) {
       console.log("Error in SatffLogUpdateOperation",error) 
    }
    // const logQuery = `INSERT INTO log_files SET ?`;
    // await pool.execute(logQuery, logData);
  };
  
  module.exports = { SatffLogUpdateOperation };
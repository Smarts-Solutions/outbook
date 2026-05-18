const pool = require('../config/database');

const CustomerLogUpdateOperation = async (logData) => {
  try {
    if (logData.staff_id != undefined) {
      let staff_id = logData.staff_id;
      let date = logData.date;
      let module_name = logData.module_name;
      let log_message = logData.log_message;
      let permission_type = logData.permission_type;
      let ip = logData.ip;
      let module_id = logData.module_id ? logData.module_id : 0;
      const query = `
        INSERT INTO staff_logs (staff_id,date,module_name,module_id,log_message,permission_type,ip)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
      const [result] = await pool.execute(query, [staff_id, date, module_name, module_id, log_message, permission_type, ip]);

      const queryUpdate = `
    UPDATE 
        staff_logs
    JOIN 
        staffs ON staffs.id = staff_logs.staff_id
    LEFT JOIN 
        roles ON roles.id = staffs.role_id
    LEFT JOIN 
        customers ON staff_logs.module_name = 'customer' AND staff_logs.module_id = customers.id
    LEFT JOIN 
        clients ON staff_logs.module_name = 'client' AND staff_logs.module_id = clients.id
    LEFT JOIN 
        jobs ON staff_logs.module_name = 'job' AND staff_logs.module_id = jobs.id
    SET 
        staff_logs.log_message_all = CONCAT(
          CASE 
            WHEN staffs.role_id = 12 THEN 'Customer User'
            ELSE IFNULL(COALESCE(roles.role, roles.role_name), 'STAFF')
          END, ' ', 
          IFNULL(staffs.first_name, ''), ' ', 
          IFNULL(staffs.last_name, ''), ' ', 
          IFNULL(staff_logs.log_message, ''), ' ',
          CASE 
            WHEN staff_logs.module_name = 'customer' THEN IFNULL(CONCAT('cust_', SUBSTRING(customers.trading_name, 1, 3), '_', customers.customer_code,'(',customers.trading_name ,')'), '')
    
            WHEN staff_logs.module_name = 'client' THEN (
              SELECT IFNULL(CONCAT('cli_', SUBSTRING(c.trading_name, 1, 3),'_', SUBSTRING(cl.trading_name, 1, 3),'_',cl.client_code,'(',cl.trading_name,')'), '')
              FROM customers c
              JOIN clients cl ON c.id = cl.customer_id
              WHERE cl.id = staff_logs.module_id
            )
    
            WHEN staff_logs.module_name = 'job' THEN (
              SELECT IFNULL(CONCAT(SUBSTRING(cu.trading_name, 1, 3),'_', SUBSTRING(cl.trading_name, 1, 3),'_',SUBSTRING(jt.type, 1, 4), '_',j.job_id), '')
              FROM jobs j
              JOIN clients cl ON j.client_id = cl.id
              JOIN customers cu ON cl.customer_id = cu.id
              LEFT JOIN job_types jt ON j.job_type_id = jt.id
              WHERE j.id = staff_logs.module_id
            )
            ELSE ''
          END
        )
    WHERE staff_logs.id = ?;
`;
      await pool.execute(queryUpdate, [result.insertId]);
    }

  } catch (error) {
    console.log("error  - Customer Logs create", error)
  }
}

module.exports = {
  CustomerLogUpdateOperation
};

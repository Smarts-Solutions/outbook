const pool = require('../config/database');
  const SatffLogUpdateOperation = async (logData) => {
    console.log("logData ",logData)
    try {
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
        const [result2] = await pool.execute(query, [staff_id,date,module_name,module_id,log_message,permission_type,ip]);
    } catch (error) {
        console.log("error  - Logs create", error)
    }
  };

  async function generateNextUniqueCode(data) {
    let table = data.table;
    let field = data.field;
    const [rows] = await pool.execute('SELECT '+field+' FROM '+table+' ORDER BY id DESC LIMIT 1');
    let newCode = '00001'; // Default code if table is empty
    if (rows.length > 0 && rows[0][field] != null) {
      const inputString = rows[0][field];
      const parts = inputString.split('_');
      const lastPart = parts[parts.length - 1];
      const lastCode = lastPart;
      const nextCode = parseInt(lastCode, 10) + 1;
  
      newCode = "0000" + nextCode
      // newCode = nextCode.toString().padStart(5, '0');
    }
  
    return newCode;
  }

  async function generateNextUniqueCodeJobLogTitle(data) {
    let table = data.table;
    let field = data.field;
    let filter_id = data.filter_id; 
    let prefix = data.prefix
    try {

        let newCode = '00001';
        const [rows] = await pool.execute('SELECT ' + field + ' FROM ' + table + ' WHERE ' + filter_id + ' ORDER BY id DESC LIMIT 1');
    
        if (rows.length > 0 && rows[0][field] != null) {
          const inputString = rows[0][field];
          const parts = inputString.split('_');
          const lastPart = parts[parts.length - 1];
          const lastCode = lastPart;
          const nextCode = parseInt(lastCode, 10) + 1;
          newCode = "0000" + nextCode
          // newCode = nextCode.toString().padStart(5, '0');
        }
    
        return prefix + '_' + newCode
      } catch (error) {
        console.log("error  - Logs create", error)
        return newCode
      }
  }
  
  module.exports = { SatffLogUpdateOperation ,generateNextUniqueCode ,generateNextUniqueCodeJobLogTitle };
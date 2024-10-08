const pool = require("../config/database");

const getTimesheet = async (Timesheet) => {
  const { staff_id } = Timesheet;

  try {
    // const [rows] = await pool.query(
    //   "SELECT * FROM timesheet WHERE staff_id = ?",
    //   [staff_id]
    // );
    const [internal] = await pool.execute(`SELECT id,name FROM internal`);
    const [sub_internal] = await pool.execute(`SELECT id , internal_id , name  FROM sub_internal`);

 const query =   `SELECT 
    timesheet.*,
    internal.name as internal_name,
    internal.id as internal_id,
    sub_internal.name as sub_internal_name,
    sub_internal.id as sub_internal_id,
    customers.trading_name as customer_name,
    customers.id as customer_id,
    clients.trading_name as client_name,
    clients.id as client_id,
    CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(job_types.type, 1, 4), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_name,
    jobs.id as job_id,
    task.name as task_name,
    task.id as task_id
  FROM 
    timesheet 
   LEFT JOIN internal  ON timesheet.job_id = internal.id AND timesheet.task_type = 1
   LEFT JOIN sub_internal  ON timesheet.task_id = sub_internal.id AND timesheet.task_type = 1
   LEFT JOIN customers  ON customers.id = timesheet.customer_id AND timesheet.task_type = 2
   LEFT JOIN clients  ON clients.id = timesheet.client_id AND timesheet.task_type = 2
   LEFT JOIN jobs  ON jobs.id = timesheet.job_id AND timesheet.task_type = 2
   LEFT JOIN job_types ON jobs.job_type_id = job_types.id AND timesheet.task_type = 2
   LEFT JOIN task  ON task.id = timesheet.task_id AND timesheet.task_type = 2
  WHERE 
    timesheet.staff_id = ?`

    const [rows] = await pool.query(
      query,
      [staff_id]
    );

    return { status: true, message: "success.", data: rows };
  } catch (err) {
    console.log(err);
    return { status: false, message: "Err getTimesheet Data View Get", error: err.message };
  }
}

const getTimesheetTaskType = async (Timesheet) => {
 const  { staff_id , task_type} = Timesheet
 console.log("staff_id ",staff_id)
  try {
     if(task_type === "1"){
       const [rows] = await pool.query("SELECT id , name FROM internal");
       return { status: true, message: "success.", data: rows };
     }
     else if(task_type === "2"){
      
      return { status: true, message: "success.", data: [] };
     }

   return { status: false, message: "Invalid Task Type." };

  } catch (err) {
    return { status: false, message: "Err Dashboard Data View Get", error: err.message };
  }

};



module.exports = {
  getTimesheet,
  getTimesheetTaskType
};

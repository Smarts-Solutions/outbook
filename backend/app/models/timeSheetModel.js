const pool = require("../config/database");

const getTimesheet = async (Timesheet) => {
  const { staff_id } = Timesheet;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM timesheet WHERE staff_id = ?",
      [staff_id]
    );
    return { status: true, message: "success.", data: rows };
  } catch (err) {
    return { status: false, message: "Err Dashboard Data View Get", error: err.message };
  }
}

const getTimesheetTaskType = async (Timesheet) => {
 const  { staff_id , task_type} = Timesheet

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

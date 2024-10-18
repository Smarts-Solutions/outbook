const pool = require("../config/database");

const getTimesheet = async (Timesheet) => {
const { staff_id , weekOffset } = Timesheet; 
const currentDate = new Date();
const currentWeekday = currentDate.getUTCDay(); 
const startOfWeek = new Date(currentDate);
startOfWeek.setUTCDate(currentDate.getUTCDate() - currentWeekday + (weekOffset * 7)); 
const endOfWeek = new Date(startOfWeek);
endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6); 

const startOfWeekFormatted = startOfWeek.toISOString().slice(0, 10);
const endOfWeekFormatted = endOfWeek.toISOString().slice(0, 10);

try {
  const query = `
    SELECT 
      timesheet.id AS id,
      timesheet.staff_id AS staff_id,
      timesheet.task_type AS task_type,
      timesheet.customer_id AS customer_id,
      timesheet.client_id AS client_id,
      timesheet.job_id AS job_id,
      timesheet.task_id AS task_id,
      DATE_FORMAT(timesheet.monday_date, '%Y-%m-%d') AS monday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.monday_hours, ':', 2), ':', '.') AS monday_hours,
      DATE_FORMAT(timesheet.tuesday_date, '%Y-%m-%d') AS tuesday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.tuesday_hours, ':', 2), ':', '.') AS tuesday_hours,
      DATE_FORMAT(timesheet.wednesday_date, '%Y-%m-%d') AS wednesday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.wednesday_hours, ':', 2), ':', '.') AS wednesday_hours,
      DATE_FORMAT(timesheet.thursday_date, '%Y-%m-%d') AS thursday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.thursday_hours, ':', 2), ':', '.') AS thursday_hours,
      DATE_FORMAT(timesheet.friday_date, '%Y-%m-%d') AS friday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.friday_hours, ':', 2), ':', '.') AS friday_hours,
      DATE_FORMAT(timesheet.saturday_date, '%Y-%m-%d') AS saturday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.saturday_hours, ':', 2), ':', '.') AS saturday_hours,
      timesheet.remark AS remark,
      timesheet.status AS status,
      timesheet.submit_status AS submit_status,
      timesheet.created_at AS created_at,
      timesheet.updated_at AS updated_at,
      internal.name AS internal_name,
      internal.id AS internal_id,
      sub_internal.name AS sub_internal_name,
      sub_internal.id AS sub_internal_id,
      customers.trading_name AS customer_name,
      customers.id AS customer_id,
      clients.trading_name AS client_name,
      clients.id AS client_id,
      CONCAT(
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(job_types.type, 1, 4), '_',
        SUBSTRING(jobs.job_id, 1, 15)
      ) AS job_name,
      task.name AS task_name,
      jobs.total_time AS job_total_time,
      staffs.hourminute AS staffs_hourminute
    FROM 
      timesheet 
      JOIN staffs ON staffs.id = timesheet.staff_id
      LEFT JOIN internal ON timesheet.job_id = internal.id AND timesheet.task_type = 1
      LEFT JOIN sub_internal ON timesheet.task_id = sub_internal.id AND timesheet.task_type = 1
      LEFT JOIN customers ON customers.id = timesheet.customer_id AND timesheet.task_type = 2
      LEFT JOIN clients ON clients.id = timesheet.client_id AND timesheet.task_type = 2
      LEFT JOIN jobs ON jobs.id = timesheet.job_id AND timesheet.task_type = 2
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id AND timesheet.task_type = 2
      LEFT JOIN task ON task.id = timesheet.task_id AND timesheet.task_type = 2
    WHERE 
      timesheet.staff_id = ? AND
      (timesheet.monday_date BETWEEN ? AND ?) OR
      (timesheet.tuesday_date BETWEEN ? AND ?) OR
      (timesheet.wednesday_date BETWEEN ? AND ?) OR
      (timesheet.thursday_date BETWEEN ? AND ?) OR
      (timesheet.friday_date BETWEEN ? AND ?) OR
      (timesheet.saturday_date BETWEEN ? AND ?)
    ORDER BY
      timesheet.id ASC;
  `;

  const [rows] = await pool.query(query, [
    staff_id,
    startOfWeekFormatted,
    endOfWeekFormatted,
    startOfWeekFormatted,
    endOfWeekFormatted,
    startOfWeekFormatted,
    endOfWeekFormatted,
    startOfWeekFormatted,
    endOfWeekFormatted,
    startOfWeekFormatted,
    endOfWeekFormatted,
    startOfWeekFormatted,
    endOfWeekFormatted
  ]);
 
  console.log("rows ",rows)
  return { status: true, message: "success.", data: rows };
} catch (err) {
  console.log(err);
  return { status: false, message: "Err getTimesheet Data View Get", error: err.message };
}

}

const getTimesheetTaskType = async (Timesheet) => {
  const { staff_id, task_type } = Timesheet
  console.log("Timesheet ", Timesheet)

  try {
    //get internal Data
    if (task_type === "1") {
      const [rows] = await pool.query("SELECT id , name FROM internal");
      return { status: true, message: "success.", data: rows };
    }


    //get Sub internal Data by Internal
    else if (task_type === "5") {
      const internal_id = Timesheet.internal_id
      const [rows] = await pool.query(`SELECT id , name FROM sub_internal WHERE status = '1' AND internal_id=${internal_id} ORDER BY id DESC`);
      return { status: true, message: "success.", data: rows };
    }

    // get Customer by Staff
    else if (task_type === "2") {


      const [rows] = await pool.execute('SELECT id , role_id  FROM staffs WHERE id = "' + staff_id + '" LIMIT 1');
      let result = []
      const Query_Select = ` SELECT  
    customers.id AS id,
    customers.trading_name AS trading_name,
    CONCAT(
        'cust_', 
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(customers.customer_code, 1, 15)
    ) AS customer_code
FROM 
    customers
LEFT JOIN
    jobs ON jobs.customer_id = customers.id   
JOIN 
    staffs AS staff1 ON customers.staff_id = staff1.id
JOIN 
    staffs AS staff2 ON customers.account_manager_id = staff2.id
LEFT JOIN
    customer_company_information ON customers.id = customer_company_information.customer_id`

      if (rows.length > 0) {
        // Allocated to
        if (rows[0].role_id == 3) {
          const query = `${Query_Select} 
            WHERE 
            jobs.allocated_to = ? OR customers.staff_id = ?
        GROUP BY 
            CASE 
                WHEN jobs.allocated_to = ? THEN jobs.customer_id
                ELSE customers.id
            END
        ORDER BY 
        customers.id DESC
            `;
          const [resultAllocated] = await pool.execute(query, [staff_id, staff_id, staff_id]);
          result = resultAllocated

        }
        // Account Manger
        else if (rows[0].role_id == 4) {

          const query = `${Query_Select} 
            WHERE jobs.account_manager_id = ? OR customers.staff_id = ?
            GROUP BY 
        CASE 
            WHEN jobs.account_manager_id = ? THEN jobs.customer_id
            ELSE customers.id
        END
            ORDER BY 
            customers.id DESC;
            `;
          const [resultAllocated] = await pool.execute(query, [staff_id, staff_id, staff_id]);
          result = resultAllocated;

          if (resultAllocated.length === 0) {
            const query = `
            SELECT  
            customers.id AS id,
            customers.trading_name AS trading_name
        FROM 
            customers
        JOIN 
            customer_services ON customer_services.customer_id = customers.id
        JOIN 
            customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id   
        JOIN 
            staffs AS staff1 ON customers.staff_id = staff1.id
        JOIN 
            staffs AS staff2 ON customers.account_manager_id = staff2.id
        LEFT JOIN 
            customer_company_information ON customers.id = customer_company_information.customer_id
        WHERE customer_service_account_managers.account_manager_id = ? OR customers.staff_id= ?
        GROUP BY 
        customers.id
        ORDER BY 
        customers.id DESC;
            `;
            const [resultAllocated] = await pool.execute(query, [staff_id, staff_id]);
            result = resultAllocated;
          }

        }
        // Reviewer
        else if (rows[0].role_id == 6) {

          const query = `${Query_Select} 
            WHERE jobs.reviewer = ? OR customers.staff_id = ?  
            GROUP BY 
        CASE 
            WHEN jobs.reviewer = ? THEN jobs.customer_id
            ELSE customers.id
        END
            ORDER BY 
            customers.id DESC;
            `;
          const [resultAllocated] = await pool.execute(query, [staff_id, staff_id, staff_id]);
          result = resultAllocated

        }
        else {
          const query = `
            SELECT  
            customers.id AS id,
            customers.trading_name AS trading_name,
            CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
            ) AS customer_code
        FROM 
            customers
        JOIN 
            staffs AS staff1 ON customers.staff_id = staff1.id
        JOIN 
            staffs AS staff2 ON customers.account_manager_id = staff2.id
        LEFT JOIN 
            customer_company_information ON customers.id = customer_company_information.customer_id
        WHERE staff1.id = ?   
        ORDER BY 
            customers.id DESC;
            `;
          const [result1] = await pool.execute(query, [staff_id]);
          result = result1
        }
      }


      return { status: true, message: "success.", data: result };
    }

    // get Client by Customer
    else if (task_type === "3") {
      const customer_id = Timesheet.customer_id
      const [rows] = await pool.query(`SELECT id , trading_name FROM clients WHERE status = '1' AND customer_id=${customer_id} ORDER BY id DESC`);
      return { status: true, message: "success.", data: rows };
    }

    // get job by Client
    else if (task_type === "4") {
      const client_id = Timesheet.client_id

      const query = `
     SELECT 
     jobs.id AS id,
     jobs.total_time AS job_total_time,
     CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(job_types.type, 1, 4), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS name

     FROM 
     jobs
     LEFT JOIN 
     customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
     LEFT JOIN 
     clients ON jobs.client_id = clients.id
      LEFT JOIN
      customers ON jobs.customer_id = customers.id
     LEFT JOIN 
     job_types ON jobs.job_type_id = job_types.id 
     WHERE 
     jobs.client_id = clients.id AND
     jobs.client_id = ?
      ORDER BY
      jobs.id DESC;
     `;
      const [rows] = await pool.execute(query, [client_id]);
      return { status: true, message: "success.", data: rows };
    }

    //get Task Data by job
    else if (task_type === "6") {
      const job_id = Timesheet.job_id
      const query = `
     SELECT 
     task.id AS id,
     task.name AS name
     FROM 
     client_job_task
     LEFT JOIN 
     task ON task.id = client_job_task.task_id
     WHERE 
     client_job_task.job_id = ?
      ORDER BY
      client_job_task.id DESC;
     `;
      const [rows] = await pool.execute(query, [job_id]);
      console.log("rows job", rows)
      if (rows.length > 0) {
        return { status: true, message: "success.", data: rows };
      } else {

        const query = `
     SELECT task.id AS id, task.name AS name
     FROM task
     INNER JOIN jobs 
        ON task.service_id = jobs.service_id 
        AND task.job_type_id = jobs.job_type_id
     WHERE 
     jobs.id = ?
     `;
        const [rows] = await pool.execute(query, [job_id]);
        console.log("rows job", rows)

        return { status: true, message: "success.", data: rows };
      }
    }

    return { status: false, message: "Invalid Task Type." };

  } catch (err) {
    console.log(err);
    return { status: false, message: "Err Dashboard Data View Get", error: err.message };
  }

};



 const saveTimesheet = async (Timesheet) => {
  try {
    const {staff_id , data} = Timesheet;
    const formatTime = input => {
      if(input == null){
        return null 
      }
      const [hours, minutes = '00'] = input.toString().split('.');
      return `${hours}:${(minutes + '00').slice(0, 2)}`;
    };

    for (const row of data) {
      const customer_id = row.customer_id == null ? 0 :row.customer_id;
      const client_id = row.client_id == null ? 0 :row.client_id;
      const remark = row.remark == "" ? null :row.remark;

      const monday_hours =  formatTime(row.monday_hours);
      const tuesday_hours =  formatTime(row.tuesday_hours);
      const wednesday_hours =  formatTime(row.wednesday_hours);
      const thursday_hours =  formatTime(row.thursday_hours);
      const friday_hours =  formatTime(row.friday_hours);
      const saturday_hours =  formatTime(row.saturday_hours);
      const sunday_hours =  formatTime(row.sunday_hours);

  
      if (row.id === null) {
        const insertQuery = `
          INSERT INTO timesheet (
            staff_id, task_type, customer_id, client_id, job_id, task_id, monday_date, monday_hours,
            tuesday_date, tuesday_hours, wednesday_date, wednesday_hours, thursday_date, thursday_hours,
            friday_date, friday_hours, saturday_date, saturday_hours, sunday_date, sunday_hours,remark
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?)`;

        const insertValues = [
          staff_id , row.task_type, customer_id, client_id, row.job_id, row.task_id,
          row.monday_date, monday_hours, row.tuesday_date, tuesday_hours, row.wednesday_date,
          wednesday_hours, row.thursday_date, thursday_hours, row.friday_date, friday_hours,
          row.saturday_date, saturday_hours, row.sunday_date,sunday_hours , remark
        ];

        await pool.query(insertQuery, insertValues);

      } else {
        const updateQuery = `
          UPDATE timesheet
          SET
            task_type = ?, customer_id = ?, client_id = ?, job_id = ?, task_id = ?,
            monday_date = ?, monday_hours = ?, tuesday_date = ?, tuesday_hours = ?, wednesday_date = ?,
            wednesday_hours = ?, thursday_date = ?, thursday_hours = ?, friday_date = ?, friday_hours = ?,
            saturday_date = ?, saturday_hours = ?, sunday_date = ?, sunday_hours = ?, remark = ? ,submit_status = ?
          WHERE id = ?`;

        const updateValues = [
          row.task_type, customer_id, client_id, row.job_id, row.task_id,
          row.monday_date, monday_hours, row.tuesday_date, tuesday_hours, row.wednesday_date,
          wednesday_hours, row.thursday_date, thursday_hours, row.friday_date, friday_hours,
          row.saturday_date, saturday_hours, row.sunday_date, sunday_hours, remark ,row.submit_status , row.id
        ];

        await pool.query(updateQuery, updateValues);
      }
    }

    return { status: true, message: "Timesheet data saved successfully." };
  } catch (err) {
    console.error(err);
    return { status: false, message: "Error saving timesheet data.", error: err.message };
  }
}




module.exports = {
  getTimesheet,
  getTimesheetTaskType,
  saveTimesheet
};

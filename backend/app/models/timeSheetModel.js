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

    const query = `SELECT 
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
  const { staff_id, task_type } = Timesheet

  try {
    if (task_type === "1") {
      const [rows] = await pool.query("SELECT id , name FROM internal");
      return { status: true, message: "success.", data: rows };
    }
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

    return { status: false, message: "Invalid Task Type." };

  } catch (err) {
    console.log(err);
    return { status: false, message: "Err Dashboard Data View Get", error: err.message };
  }

};



module.exports = {
  getTimesheet,
  getTimesheetTaskType
};

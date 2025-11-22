const pool = require("../config/database");
const { SatffLogUpdateOperation, JobTaskNameWithId, getAllCustomerIds, LineManageStaffIdHelperFunction, QueryRoleHelperFunction } = require('../utils/helper');


// SELECT 
// timesheet.*,
// CONCAT(staffs.first_name,' ',staffs.last_name) AS staff_fullname,
// CONCAT(customers.trading_name) AS customer_name,
// CONCAT(clients.trading_name) AS client_name,
// COALESCE(jobs.job_id, internal.name) AS job_name,
// COALESCE(task.name, sub_internal.name) AS task_name

// FROM `timesheet`
// JOIN staffs ON staffs.id = timesheet.staff_id
// LEFT JOIN customers ON customers.id = timesheet.customer_id
// LEFT JOIN clients ON clients.id = timesheet.client_id

// LEFT JOIN jobs ON jobs.id = timesheet.job_id AND timesheet.task_type = 2
// LEFT JOIN internal ON internal.id = timesheet.job_id AND timesheet.task_type = 1

// LEFT JOIN task ON task.id = timesheet.task_id AND timesheet.task_type = 2
// LEFT JOIN sub_internal ON sub_internal.id = timesheet.task_id AND timesheet.task_type = 1;





// DELIMITER $$

// CREATE PROCEDURE GetTimesheetReportsNormalized(
//     IN p_time_period VARCHAR(50),
//     IN p_from_date DATE,
//     IN p_to_date DATE,
//     IN p_group_by VARCHAR(50),
//     IN p_display_by VARCHAR(50)
// )
// BEGIN
//     DECLARE v_start_date DATE;
//     DECLARE v_end_date DATE;

//     
    // IF p_time_period = 'this_week' THEN
    //     SET v_start_date = DATE_SUB(CURDATE(), INTERVAL (WEEKDAY(CURDATE())) DAY);
    //     SET v_end_date   = DATE_ADD(v_start_date, INTERVAL 6 DAY);

    // ELSEIF p_time_period = 'last_week' THEN
    //     SET v_start_date = DATE_SUB(CURDATE(), INTERVAL (WEEKDAY(CURDATE())+7) DAY);
    //     SET v_end_date   = DATE_ADD(v_start_date, INTERVAL 6 DAY);

    // ELSEIF p_time_period = 'this_month' THEN
    //     SET v_start_date = DATE_SUB(CURDATE(), INTERVAL (DAY(CURDATE())-1) DAY);
    //     SET v_end_date   = LAST_DAY(CURDATE());

    // ELSEIF p_time_period = 'last_month' THEN
    //     SET v_start_date = DATE_SUB(DATE_SUB(CURDATE(), INTERVAL DAY(CURDATE())-1 DAY), INTERVAL 1 MONTH);
    //     SET v_end_date   = LAST_DAY(v_start_date);

    // ELSEIF p_time_period = 'this_quarter' THEN
    //     SET v_start_date = MAKEDATE(YEAR(CURDATE()), 1) + INTERVAL QUARTER(CURDATE())*3-3 MONTH;
    //     SET v_end_date   = LAST_DAY(v_start_date + INTERVAL 2 MONTH);

    // ELSEIF p_time_period = 'last_quarter' THEN
    //     SET v_start_date = MAKEDATE(YEAR(CURDATE()), 1) + INTERVAL (QUARTER(CURDATE())-2)*3 MONTH;
    //     SET v_end_date   = LAST_DAY(v_start_date + INTERVAL 2 MONTH);

    // ELSEIF p_time_period = 'this_year' THEN
    //     SET v_start_date = MAKEDATE(YEAR(CURDATE()), 1);
    //     SET v_end_date   = MAKEDATE(YEAR(CURDATE()), 365);

    // ELSEIF p_time_period = 'last_year' THEN
    //     SET v_start_date = MAKEDATE(YEAR(CURDATE())-1, 1);
    //     SET v_end_date   = MAKEDATE(YEAR(CURDATE())-1, 365);

    // ELSEIF p_time_period = 'custom' THEN
    //     SET v_start_date = p_from_date;
    //     SET v_end_date   = p_to_date;
    // END IF;

//    
//     SELECT 
//         t.staff_id,
//         CONCAT(s.first_name,' ',s.last_name) AS staff_fullname,
//         c.trading_name AS customer_name,
//         cl.trading_name AS client_name,
//         COALESCE(j.job_id, i.name) AS job_name,
//         COALESCE(tsk.name, si.name) AS task_name,
//         CASE WHEN t.task_type = 1 THEN 'Internal' ELSE 'External' END AS internal_external,
//         t.work_date,
//         t.work_hours,
//         -- Display By
//         CASE 
//             WHEN p_display_by = 'Daily' THEN DATE(t.work_date)
//             WHEN p_display_by = 'Weekly' THEN YEARWEEK(t.work_date, 1)
//             WHEN p_display_by = 'Monthly' THEN DATE_FORMAT(t.work_date, '%Y-%m')
//             WHEN p_display_by = 'Yearly' THEN YEAR(t.work_date)
//         END AS display_period
//     FROM (
//         -- Normalized dataset
//         SELECT id, staff_id, task_type, customer_id, client_id, job_id, task_id,
//                monday_date AS work_date, monday_hours AS work_hours
//         FROM timesheet WHERE monday_date IS NOT NULL
//         UNION ALL
//         SELECT id, staff_id, task_type, customer_id, client_id, job_id, task_id,
//                tuesday_date, tuesday_hours
//         FROM timesheet WHERE tuesday_date IS NOT NULL
//         UNION ALL
//         SELECT id, staff_id, task_type, customer_id, client_id, job_id, task_id,
//                wednesday_date, wednesday_hours
//         FROM timesheet WHERE wednesday_date IS NOT NULL
//         UNION ALL
//         SELECT id, staff_id, task_type, customer_id, client_id, job_id, task_id,
//                thursday_date, thursday_hours
//         FROM timesheet WHERE thursday_date IS NOT NULL
//         UNION ALL
//         SELECT id, staff_id, task_type, customer_id, client_id, job_id, task_id,
//                friday_date, friday_hours
//         FROM timesheet WHERE friday_date IS NOT NULL
//         UNION ALL
//         SELECT id, staff_id, task_type, customer_id, client_id, job_id, task_id,
//                saturday_date, saturday_hours
//         FROM timesheet WHERE saturday_date IS NOT NULL
//         UNION ALL
//         SELECT id, staff_id, task_type, customer_id, client_id, job_id, task_id,
//                sunday_date, sunday_hours
//         FROM timesheet WHERE sunday_date IS NOT NULL
//     ) t
//     JOIN staffs s ON s.id = t.staff_id
//     LEFT JOIN customers c ON c.id = t.customer_id
//     LEFT JOIN clients cl ON cl.id = t.client_id
//     LEFT JOIN jobs j ON j.id = t.job_id AND t.task_type = 2
//     LEFT JOIN internal i ON i.id = t.job_id AND t.task_type = 1
//     LEFT JOIN task tsk ON tsk.id = t.task_id AND t.task_type = 2
//     LEFT JOIN sub_internal si ON si.id = t.task_id AND t.task_type = 1
//     WHERE t.work_date BETWEEN v_start_date AND v_end_date
//     ORDER BY t.work_date;

// END$$

// DELIMITER ;


// -- This Month Weekly Report
// CALL GetTimesheetReportsNormalized('last_month', NULL, NULL, 'Employee', 'Weekly');

// -- Custom Range Daily Report
// CALL GetTimesheetReportsNormalized('custom', '2025-08-01', '2025-08-31', 'Client', 'Daily');




const getTimesheet = async (Timesheet) => {

  const { staff_id, weekOffset } = Timesheet;
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
      timesheet.monday_note AS monday_note,
      DATE_FORMAT(timesheet.tuesday_date, '%Y-%m-%d') AS tuesday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.tuesday_hours, ':', 2), ':', '.') AS tuesday_hours,
      timesheet.tuesday_note AS tuesday_note,
      DATE_FORMAT(timesheet.wednesday_date, '%Y-%m-%d') AS wednesday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.wednesday_hours, ':', 2), ':', '.') AS wednesday_hours,
      timesheet.wednesday_note AS wednesday_note,
      DATE_FORMAT(timesheet.thursday_date, '%Y-%m-%d') AS thursday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.thursday_hours, ':', 2), ':', '.') AS thursday_hours,
      timesheet.thursday_note AS thursday_note,
      DATE_FORMAT(timesheet.friday_date, '%Y-%m-%d') AS friday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.friday_hours, ':', 2), ':', '.') AS friday_hours,
      timesheet.friday_note AS friday_note,
      DATE_FORMAT(timesheet.saturday_date, '%Y-%m-%d') AS saturday_date,
      REPLACE(SUBSTRING_INDEX(timesheet.saturday_hours, ':', 2), ':', '.') AS saturday_hours,
      timesheet.saturday_note AS saturday_note,
      timesheet.remark AS remark,
      timesheet.final_remark AS final_remark,
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
      job_types.type AS job_type_name,
      job_types.id AS job_type_id,
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
      timesheet.staff_id = ? AND (
        timesheet.monday_date BETWEEN ? AND ? OR
        timesheet.tuesday_date BETWEEN ? AND ? OR
        timesheet.wednesday_date BETWEEN ? AND ? OR
        timesheet.thursday_date BETWEEN ? AND ? OR
        timesheet.friday_date BETWEEN ? AND ? OR
        timesheet.saturday_date BETWEEN ? AND ?
    )
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



    // get week filter data
    const query_week_filter = `SELECT  
    id,
    staff_id,
    submit_status,
    DATE_FORMAT(monday_date, '%Y-%m-%d') AS monday_date,
    DATE_FORMAT(tuesday_date, '%Y-%m-%d') AS tuesday_date,
    DATE_FORMAT(wednesday_date, '%Y-%m-%d') AS wednesday_date,
    DATE_FORMAT(thursday_date, '%Y-%m-%d') AS thursday_date,
    DATE_FORMAT(monday_date, '%Y-%m-%d') AS friday_date,
    DATE_FORMAT(monday_date, '%Y-%m-%d') AS saturday_date,
    DATE_FORMAT(monday_date, '%Y-%m-%d') AS sunday_date,
    CONCAT(
        CASE 
            WHEN monday_date IS NOT NULL THEN CONCAT(TIMESTAMPDIFF(WEEK, CURDATE(), monday_date), ' ') 
            ELSE '' 
        END,
        CASE 
            WHEN monday_date IS NOT NULL AND tuesday_date IS NOT NULL THEN ''
            WHEN tuesday_date IS NOT NULL THEN CONCAT(TIMESTAMPDIFF(WEEK, CURDATE(), tuesday_date), ' ') 
            ELSE '' 
        END,
        CASE 
            WHEN (monday_date IS NOT NULL OR tuesday_date IS NOT NULL) AND wednesday_date IS NOT NULL THEN ''
            WHEN wednesday_date IS NOT NULL THEN CONCAT(TIMESTAMPDIFF(WEEK, CURDATE(), wednesday_date), ' ') 
            ELSE '' 
        END,
        CASE 
            WHEN (monday_date IS NOT NULL OR tuesday_date IS NOT NULL OR wednesday_date IS NOT NULL) AND thursday_date IS NOT NULL THEN ''
            WHEN thursday_date IS NOT NULL THEN CONCAT(TIMESTAMPDIFF(WEEK, CURDATE(), thursday_date), ' ') 
            ELSE '' 
        END,
        CASE 
            WHEN (monday_date IS NOT NULL OR tuesday_date IS NOT NULL OR wednesday_date IS NOT NULL OR thursday_date IS NOT NULL) AND friday_date IS NOT NULL THEN ''
            WHEN friday_date IS NOT NULL THEN CONCAT(TIMESTAMPDIFF(WEEK, CURDATE(), friday_date), ' ') 
            ELSE '' 
        END,
        CASE 
            WHEN (monday_date IS NOT NULL OR tuesday_date IS NOT NULL OR wednesday_date IS NOT NULL OR thursday_date IS NOT NULL OR friday_date IS NOT NULL) AND saturday_date IS NOT NULL THEN ''
            WHEN saturday_date IS NOT NULL THEN CONCAT(TIMESTAMPDIFF(WEEK, CURDATE(), saturday_date), ' ') 
            ELSE '' 
        END,
        CASE 
            WHEN (monday_date IS NOT NULL OR tuesday_date IS NOT NULL OR wednesday_date IS NOT NULL OR thursday_date IS NOT NULL OR friday_date IS NOT NULL OR saturday_date IS NOT NULL) AND sunday_date IS NOT NULL THEN ''
            WHEN sunday_date IS NOT NULL THEN CONCAT(TIMESTAMPDIFF(WEEK, CURDATE(), sunday_date), ' ') 
            ELSE '' 
        END
    ) AS valid_weekOffsets
FROM 
timesheet 
WHERE 
    staff_id = ? AND submit_status = '1'
GROUP BY valid_weekOffsets  
ORDER BY
    valid_weekOffsets ASC
    `
    const [rows1] = await pool.query(query_week_filter, [staff_id]);
    // const filterDataWeek = rows1.map(item => {
    //   const firstDate = 
    //     item.monday_date || item.tuesday_date || item.wednesday_date || 
    //     item.thursday_date || item.friday_date || item.saturday_date || item.sunday_date;

    //   const result = { 
    //     id: item.id,
    //     staff_id: item.staff_id,
    //     valid_weekOffsets: item.valid_weekOffsets
    //   };
    //   if (firstDate) {
    //     result.month_date = firstDate;
    //   }

    //   return result;
    // });


    // const filterDataWeek = rows1
    //   .map(item => {
    //     if (
    //       item.valid_weekOffsets != null &&
    //       item.valid_weekOffsets != '' &&
    //       item.valid_weekOffsets != undefined
    //     ) {
    //       const firstDate =
    //         item.monday_date ||
    //         item.tuesday_date ||
    //         item.wednesday_date ||
    //         item.thursday_date ||
    //         item.friday_date ||
    //         item.saturday_date ||
    //         item.sunday_date;

    //       const result = {
    //         id: item.id,
    //         staff_id: item.staff_id,
    //         valid_weekOffsets: item.valid_weekOffsets,
    //       };
    //       if (firstDate) {
    //         result.month_date = firstDate;
    //       }
    //       return result;
    //     }
    //   })
    //   .filter(Boolean);

      
 
     const filterDataWeek = rows1
      .map(item => {
        if (
          item.valid_weekOffsets != null &&
          item.valid_weekOffsets != '' &&
          item.valid_weekOffsets != undefined
        ) {
          const firstDate =
            item.monday_date ||
            item.tuesday_date ||
            item.wednesday_date ||
            item.thursday_date ||
            item.friday_date ||
            item.saturday_date;

          if (!firstDate) return null;

          return {
            id: item.id,
            staff_id: item.staff_id,
            valid_weekOffsets: item.valid_weekOffsets,
            month_date: firstDate,
          };
        }
        return null;
      })
      .filter(Boolean);

      // Submitted Timesheet Week Filter Data
      const filterDataWeekSubmitTimeSheet = rows1
      .map(item => {
        if (
          item.valid_weekOffsets != null &&
          item.valid_weekOffsets != '' &&
          item.valid_weekOffsets != undefined && 
          item.submit_status === '1'
        ) {
          const firstDate =
            item.monday_date ||
            item.tuesday_date ||
            item.wednesday_date ||
            item.thursday_date ||
            item.friday_date ||
            item.saturday_date;

          if (!firstDate) return null;

          return {
            id: item.id,
            staff_id: item.staff_id,
            valid_weekOffsets: item.valid_weekOffsets,
            month_date: firstDate,
          };
        }
        return null;
      })
      .filter(Boolean);

    return { status: true, message: "success.", data: rows, filterDataWeek: filterDataWeek , filterDataWeekSubmitTimeSheet: filterDataWeekSubmitTimeSheet };
  } catch (err) {
    console.log(err);
    return { status: false, message: "Err getTimesheet Data View Get", error: err.message };
  }

}

const getTimesheetTaskType = async (Timesheet) => {
  const { staff_id, task_type, StaffUserId } = Timesheet
  // console.log("Timesheet ", Timesheet)

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

      try {
        // Line Manager
        const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

        // Get Role
        const rows = await QueryRoleHelperFunction(StaffUserId)
        // Condition with  SuperAdmin

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
          const query = `
              SELECT  
              customers.id AS id,
              customers.status AS status,
              customers.form_process AS form_process,
              customers.trading_name AS trading_name,
              CONCAT(
              'cust_', 
              SUBSTRING(customers.trading_name, 1, 3), '_',
              SUBSTRING(customers.customer_code, 1, 15)
              ) AS customer_code
          FROM 
              customers 
          ORDER BY 
          id DESC;`;

          const [result] = await pool.execute(query);
          return { status: true, message: 'Success..', data: result };
        }

        // Other Role Data
      //   let query = `
      //  SELECT  
      //   customers.id AS id,
      //   customers.status AS status,
      //   customers.form_process AS form_process,
      //   customers.trading_name AS trading_name,
      //   CONCAT(
      //   'cust_', 
      //   SUBSTRING(customers.trading_name, 1, 3), '_',
      //   SUBSTRING(customers.customer_code, 1, 15)
      //   ) AS customer_code
      //   FROM 
      //       customers  
      //   JOIN 
      //       staffs AS staff1 ON customers.staff_id = staff1.id
      //   JOIN 
      //       staffs AS staff2 ON customers.account_manager_id = staff2.id
      //   LEFT JOIN clients ON clients.customer_id = customers.id
      //   LEFT JOIN
      //       assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
      //   LEFT JOIN
      //       customer_company_information ON customers.id = customer_company_information.customer_id
      //   WHERE
      //       (customers.staff_id = ?  OR assigned_jobs_staff_view.staff_id = ?
      //       OR customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
      //       )
      //      GROUP BY customers.id
      //      ORDER BY customers.id DESC
      //    `;
      //   const [result] = await pool.execute(query, [staff_id, staff_id]);
      let query = `
       SELECT  
        customers.id AS id,
        customers.status AS status,
        customers.form_process AS form_process,
        customers.trading_name AS trading_name,
        CONCAT(
        'cust_', 
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(customers.customer_code, 1, 15)
        ) AS customer_code
        FROM 
            customers
        LEFT JOIN
            assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
        WHERE
           customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
           GROUP BY customers.id
           ORDER BY customers.id DESC
         `;
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success..', data: result };

      } catch (err) {
        return { status: true, message: 'Error get Customer data in Timesheet', data: err };
      }
    }

    // get Client by Customer
    else if (task_type === "3") {
      let customer_id = Timesheet.customer_id

      try {
        // Line Manager
        const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

        // Get Role
        const rows = await QueryRoleHelperFunction(StaffUserId)

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 34]);

        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
          try {
            const query = `
                SELECT  
                  clients.id AS id,
                  clients.trading_name AS trading_name,
                  CONCAT(
                      'cli_', 
                      SUBSTRING(customers.trading_name, 1, 3), '_',
                      SUBSTRING(clients.trading_name, 1, 3), '_',
                      SUBSTRING(clients.client_code, 1, 15)
                  ) AS client_code
              FROM 
                  clients
              JOIN 
                  customers ON customers.id = clients.customer_id    
              JOIN 
                  client_types ON client_types.id = clients.client_type
              LEFT JOIN 
                  jobs ON clients.id = jobs.client_id  -- Corrected LEFT JOIN condition
              LEFT JOIN 
                  client_contact_details ON client_contact_details.id = (
                      SELECT MIN(cd.id)
                      FROM client_contact_details cd
                      WHERE cd.client_id = clients.id
                  )
              WHERE 
                  clients.customer_id = ${customer_id}
              GROUP BY
                  clients.id    
              ORDER BY 
                  clients.id DESC;
                  `;
            const [result] = await pool.execute(query);
            return { status: true, message: "success.", data: result };
          } catch (error) {
            console.error("Error executing query: ", error);
            return { status: false, message: "Error executing query", error: error.message };
          }

        }


        // Other role Get data
        // const query = `
        //       SELECT  
        //         clients.id AS id,
        //         clients.trading_name AS trading_name,
        //         CONCAT(
        //             'cli_', 
        //             SUBSTRING(customers.trading_name, 1, 3), '_',
        //             SUBSTRING(clients.trading_name, 1, 3), '_',
        //             SUBSTRING(clients.client_code, 1, 15)
        //         ) AS client_code
        //           FROM 
        //               clients
        //           JOIN 
        //               assigned_jobs_staff_view ON assigned_jobs_staff_view.client_id = clients.id    
        //           JOIN 
        //               customers ON customers.id = clients.customer_id    
        //           JOIN 
        //               client_types ON client_types.id = clients.client_type
        //           LEFT JOIN 
        //               jobs ON clients.id = jobs.client_id
        //           LEFT JOIN 
        //               client_contact_details ON client_contact_details.id = (
        //                   SELECT MIN(cd.id)
        //                   FROM client_contact_details cd
        //                   WHERE cd.client_id = clients.id
        //               ) 
        //           WHERE 
        //           (clients.staff_created_id = ? OR assigned_jobs_staff_view.staff_id = ?
        //           OR clients.staff_created_id IN (${LineManageStaffId}) OR  assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})) AND assigned_jobs_staff_view.customer_id = ${customer_id}
        //           GROUP BY
        //               clients.id
        //           ORDER BY 
        //               clients.id DESC;
        // `;
        // const [result] = await pool.execute(query, [StaffUserId, StaffUserId]);
        const query = `
              SELECT  
                clients.id AS id,
                clients.trading_name AS trading_name,
                CONCAT(
                    'cli_', 
                    SUBSTRING(customers.trading_name, 1, 3), '_',
                    SUBSTRING(clients.trading_name, 1, 3), '_',
                    SUBSTRING(clients.client_code, 1, 15)
                ) AS client_code
                  FROM 
                      clients
                  JOIN 
                      assigned_jobs_staff_view ON assigned_jobs_staff_view.client_id = clients.id    
                  JOIN 
                      customers ON customers.id = clients.customer_id 
                  WHERE 
                  (clients.staff_created_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})) AND assigned_jobs_staff_view.customer_id = ${customer_id}
                  GROUP BY
                      clients.id
                  ORDER BY 
                      clients.id DESC;
        `;
        const [result] = await pool.execute(query);
        return { status: true, message: "success.", data: result };

      } catch (err) {
        return { status: false, message: "Err Client Get" };
      }


    }

    // get job by Client
    else if (task_type === "4") {
      const client_id = Timesheet.client_id

      try {
        // Line Manager
        const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

        // Get Role
        const rows = await QueryRoleHelperFunction(StaffUserId)

        // console.log("LineManageStaffId", LineManageStaffId);

        const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 35]);
        if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {

          const query = `
        SELECT 
         job_types.id AS job_type_id,
         job_types.type AS job_type_name,
         jobs.id AS id,
         jobs.total_time AS job_total_time,
         jobs.staff_created_id AS staff_created_id,
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
        LEFT JOIN 
        services ON jobs.service_id = services.id
        LEFT JOIN 
        staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN 
        staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN 
        staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN 
        master_status ON master_status.id = jobs.status_type
        LEFT JOIN
        timesheet ON timesheet.job_id = jobs.id AND timesheet.task_type = '2'
        WHERE
        jobs.client_id = ${client_id}
        GROUP BY jobs.id
        ORDER BY 
         jobs.id DESC;
        `;
          const [rows] = await pool.execute(query);
          return { status: true, message: "Success.", data: rows };
        }

        // Other Role Data
        const query = `
        SELECT 
         job_types.id AS job_type_id,
         job_types.type AS job_type_name,
         jobs.id AS id,
         jobs.total_time AS job_total_time,
         jobs.staff_created_id AS staff_created_id,

        assigned_jobs_staff_view.source AS assigned_source,
        assigned_jobs_staff_view.service_id_assign AS service_id_assign,
        jobs.service_id AS job_service_id,

         CONCAT(
                SUBSTRING(customers.trading_name, 1, 3), '_',
                SUBSTRING(clients.trading_name, 1, 3), '_',
                SUBSTRING(job_types.type, 1, 4), '_',
                SUBSTRING(jobs.job_id, 1, 15)
                ) AS name
   
        FROM 
        jobs
        LEFT JOIN 
          assigned_jobs_staff_view ON assigned_jobs_staff_view.job_id = jobs.id
        JOIN 
        services ON jobs.service_id = services.id
        JOIN
        customer_services ON customer_services.service_id = jobs.service_id
        JOIN
        customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id
        LEFT JOIN 
        customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id
        LEFT JOIN 
        staff_portfolio ON staff_portfolio.customer_id = customers.id
        LEFT JOIN 
        job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN 
        staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN 
        staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN 
        staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN 
        master_status ON master_status.id = jobs.status_type
         LEFT JOIN
         timesheet ON timesheet.job_id = jobs.id AND timesheet.task_type = '2'
        WHERE
        (assigned_jobs_staff_view.staff_id IN(${LineManageStaffId}) OR jobs.staff_created_id IN(${LineManageStaffId}) OR clients.staff_created_id IN(${LineManageStaffId})) AND jobs.client_id = ${client_id}
        GROUP BY 
        jobs.id 
        ORDER BY 
        jobs.id DESC;
        `;
        const [result] = await pool.execute(query);

        //////-----START Assign Customer Service Data START----////////
        let isExistAssignCustomer = result?.find(item => item?.assigned_source === 'assign_customer_service');
        if (isExistAssignCustomer != undefined) {
          let matched = result?.filter(item =>
            item?.assigned_source === 'assign_customer_service' &&
            Number(item?.service_id_assign) === Number(item?.job_service_id)
          )
          let matched2 = result?.filter(item =>
            item?.assigned_source !== 'assign_customer_service'
          )
          const resultAssignCustomer = [...matched, ...matched2]
          return { status: true, message: "Success.", data: resultAssignCustomer };
        }
        //////-----END Assign Customer Service Data END----////////


        return { status: true, message: "Success.", data: result };
      } catch (error) {
        console.log("err -", error)
        return { status: false, message: 'Error getting job.' };
      }


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
     GROUP BY
      task.id
      ORDER BY
      client_job_task.id DESC;
     `;
      const [rows] = await pool.execute(query, [job_id]);
      return { status: true, message: "success.", data: rows };
    //   if (rows.length > 0) {
    //     return { status: true, message: "success.", data: rows };
    //   } else {

    //     const query = `
    //  SELECT task.id AS id, task.name AS name
    //  FROM task
    //  INNER JOIN jobs 
    //     ON task.service_id = jobs.service_id 
    //     AND task.job_type_id = jobs.job_type_id
    //  WHERE 
    //  jobs.id = ?
    //   GROUP BY task.id
    //  `;
    //     const [rows] = await pool.execute(query, [job_id]);
    //     return { status: true, message: "success.", data: rows };
    //   }
    }

    return { status: false, message: "Invalid Task Type." };

  } catch (err) {
    console.log(err);
    return { status: false, message: "Err Dashboard Data View Get", error: err.message };
  }

};

const saveTimesheet = async (Timesheet) => {
  try {
    const { staff_id, data, deleteRows } = Timesheet;

    //  for (let index = 0; index < data.length; index++) {
    //   const element = data[index];
    //   console.log("element", element)
    //  }
    //   return

    const timesheet_log_msg = [];
    let checkStringEvent = [];

    if (data.length > 0) {
      const formatTime = input => {
        if (input == null) {
          return null;
        }
        const [hours, minutes = '0'] = input.toString().split('.');
        const formattedMinutes = minutes.length === 1 ? `${minutes}0` : minutes == "" ? `00` : minutes;

        return `${hours}:${formattedMinutes}`;
      };
      for (const row of data) {

        let task_type_name = 'Internal';
        if (parseInt(row.task_type) === 2) {
          task_type_name = 'External';
        }
        const customer_id = row.customer_id == null ? 0 : row.customer_id;
        const client_id = row.client_id == null ? 0 : row.client_id;
        const remark = ['', null, undefined].includes(row.remark) ? null : row.remark;
        const final_remark = ['', null, undefined].includes(row.final_remark) ? null : row.final_remark;
        const monday_note = ['', null, undefined].includes(row.monday_note) ? null : row.monday_note;
        const tuesday_note = ['', null, undefined].includes(row.tuesday_note) ? null : row.tuesday_note;
        const wednesday_note = ['', null, undefined].includes(row.wednesday_note) ? null : row.wednesday_note;
        const thursday_note = ['', null, undefined].includes(row.thursday_note) ? null : row.thursday_note;
        const friday_note = ['', null, undefined].includes(row.friday_note) ? null : row.friday_note;
        const saturday_note = ['', null, undefined].includes(row.saturday_note) ? null : row.saturday_note;
        const sunday_note = ['', null, undefined].includes(row.sunday_note) ? null : row.sunday_note;

        const monday_hours = formatTime(row.monday_hours);
        const tuesday_hours = formatTime(row.tuesday_hours);
        const wednesday_hours = formatTime(row.wednesday_hours);
        const thursday_hours = formatTime(row.thursday_hours);
        const friday_hours = formatTime(row.friday_hours);
        const saturday_hours = formatTime(row.saturday_hours);
        const sunday_hours = formatTime(row.sunday_hours);
        if (row.id === null) {
          let DateTimeString = "";
          const days = [
            { day: 'monday', date: row.monday_date, hours: monday_hours },
            { day: 'tuesday', date: row.tuesday_date, hours: tuesday_hours },
            { day: 'wednesday', date: row.wednesday_date, hours: wednesday_hours },
            { day: 'thursday', date: row.thursday_date, hours: thursday_hours },
            { day: 'friday', date: row.friday_date, hours: friday_hours },
            { day: 'saturday', date: row.saturday_date, hours: saturday_hours },
            { day: 'sunday', date: row.sunday_date, hours: sunday_hours }
          ];

          days.forEach(day => {
            if (day?.date !== null) {
              DateTimeString += ` Date: ${day?.date}, Hours : ${day?.hours?.replace('.', ':')}`;
            }
          });

          const insertQuery = `
          INSERT INTO timesheet (
            staff_id, task_type, customer_id, client_id, job_id, task_id, monday_date, monday_hours,
            tuesday_date, tuesday_hours, wednesday_date, wednesday_hours, thursday_date, thursday_hours,
            friday_date, friday_hours, saturday_date, saturday_hours, sunday_date, sunday_hours,remark,final_remark,submit_status,monday_note, tuesday_note, wednesday_note, thursday_note, friday_note, saturday_note, sunday_note
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? , ?, ? ,?, ?, ? , ? , ? , ?, ?)`;

          const insertValues = [
            staff_id, row.task_type, customer_id, client_id, row.job_id, row.task_id,
            row.monday_date, monday_hours, row.tuesday_date, tuesday_hours, row.wednesday_date,
            wednesday_hours, row.thursday_date, thursday_hours, row.friday_date, friday_hours,
            row.saturday_date, saturday_hours, row.sunday_date, sunday_hours, remark, final_remark, row.submit_status ,monday_note, tuesday_note, wednesday_note, thursday_note, friday_note, saturday_note, sunday_note
          ];
          await pool.query(insertQuery, insertValues);

          let JobTaskName = await JobTaskNameWithId({
            job_id: row.job_id,
            task_id: row.task_id,
            TaskType: parseInt(row.task_type)
          })




          if (DateTimeString !== "") {

            if (parseInt(row.submit_status) === 1) {
              if (!checkStringEvent.includes('submit')) {
                checkStringEvent.push('submit')
                timesheet_log_msg.push(`submitted a timesheet entry. Task type:${task_type_name}, ${DateTimeString} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
              } else {
                timesheet_log_msg.push(`Task type:${task_type_name}, ${DateTimeString} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
              }

            } else {
              if (!checkStringEvent.includes('insert')) {
                checkStringEvent.push('insert')
                timesheet_log_msg.push(`created a timesheet entry. Task type:${task_type_name}, ${DateTimeString} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
              } else {
                timesheet_log_msg.push(`Task type:${task_type_name}, ${DateTimeString} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
              }
            }


          }

        } else {


          let DateTimeString = "";
          let DateTimeStringSubmit = "";
          const [[existData]] = await pool.execute(
            "SELECT id ,monday_hours , tuesday_hours, wednesday_hours, thursday_hours, friday_hours, saturday_hours, sunday_hours FROM timesheet WHERE id = ? "
            , [row.id]);

          const days = [
            { day: 'monday', date: row.monday_date, hours: monday_hours },
            { day: 'tuesday', date: row.tuesday_date, hours: tuesday_hours },
            { day: 'wednesday', date: row.wednesday_date, hours: wednesday_hours },
            { day: 'thursday', date: row.thursday_date, hours: thursday_hours },
            { day: 'friday', date: row.friday_date, hours: friday_hours },
            { day: 'saturday', date: row.saturday_date, hours: saturday_hours },
            { day: 'sunday', date: row.sunday_date, hours: sunday_hours }
          ];

          // Loop through each day and compare hours
          for (let i = 0; i < days.length; i++) {
            const { day, date, hours } = days[i];
            let hoursSumit = hours == null ? "" : hours?.replace(':', '.');
            DateTimeStringSubmit += ` Date: ${date}, hours : ${hoursSumit}`;
            if (hours !== existData[`${day}_hours`]) {
              DateTimeString += ` Date: ${date}, Updated hours : ${hours?.replace('.', ':')}`;
            }
          }


          const updateQuery = `
          UPDATE timesheet
          SET
            task_type = ?, customer_id = ?, client_id = ?, job_id = ?, task_id = ?,
            monday_date = ?, monday_hours = ?, tuesday_date = ?, tuesday_hours = ?, wednesday_date = ?,
            wednesday_hours = ?, thursday_date = ?, thursday_hours = ?, friday_date = ?, friday_hours = ?,
            saturday_date = ?, saturday_hours = ?, sunday_date = ?, sunday_hours = ?, remark = ? , final_remark = ? ,submit_status = ? ,monday_note = ?, tuesday_note = ?, wednesday_note = ?, thursday_note = ?, friday_note = ?, saturday_note = ?, sunday_note = ?
          WHERE id = ?`;

          const updateValues = [
            row.task_type, customer_id, client_id, row.job_id, row.task_id,
            row.monday_date, monday_hours, row.tuesday_date, tuesday_hours, row.wednesday_date,
            wednesday_hours, row.thursday_date, thursday_hours, row.friday_date, friday_hours,
            row.saturday_date, saturday_hours, row.sunday_date, sunday_hours, remark, final_remark, row.submit_status, monday_note, tuesday_note, wednesday_note, thursday_note, friday_note, saturday_note, sunday_note,
            row.id
          ];


          let JobTaskName = await JobTaskNameWithId({
            job_id: row.job_id,
            task_id: row.task_id,
            TaskType: parseInt(row.task_type)
          })

          if (parseInt(row.submit_status) === 1) {
            if (!checkStringEvent.includes('submit')) {
              checkStringEvent.push('submit')
              timesheet_log_msg.push(`submitted a timesheet entry. Task type:${task_type_name}, ${DateTimeString} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
            } else {
              timesheet_log_msg.push(`Task type:${task_type_name}, ${DateTimeString} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
            }

          } else {
            if (DateTimeString !== "") {
              if (!checkStringEvent.includes('update')) {
                checkStringEvent.push('update')
                timesheet_log_msg.push(`edited a timesheet entry. Task type:${task_type_name}, ${DateTimeString} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
              } else {
                timesheet_log_msg.push(`Task type:${task_type_name}, ${DateTimeString} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
              }
            }
          }






          await pool.query(updateQuery, updateValues);
        }
      }
    }

    if (deleteRows.length > 0) {
      for (const id of deleteRows) {

        const [[existData]] = await pool.execute(
          `SELECT id,job_id,task_id,task_type FROM timesheet WHERE id = ?`, [id]
        );

        let JobTaskName = await JobTaskNameWithId({
          job_id: existData.job_id,
          task_id: existData.task_id,
          TaskType: parseInt(existData.task_type)
        })

        let task_type_name = 'Internal';
        if (parseInt(existData.task_type) === 2) {
          task_type_name = 'External';
        }

        if (!checkStringEvent.includes('delete')) {
          checkStringEvent.push('delete')
          timesheet_log_msg.push(`deleted a timesheet entry. Task type:${task_type_name} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
        } else {
          timesheet_log_msg.push(`Task type:${task_type_name} ,Job code:${JobTaskName.job_name}, Task name:${JobTaskName.task_name}`)
        }

        const deleteQuery = `DELETE FROM timesheet WHERE id = ?`;
        await pool.query(deleteQuery, [id]);
      }
    }

    if (timesheet_log_msg.length > 0) {
      const msgLog = timesheet_log_msg.length > 1
        ? timesheet_log_msg.slice(0, -1).join(', ') + ' and ' + timesheet_log_msg.slice(-1)
        : timesheet_log_msg[0];
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: staff_id,
          ip: "0.0.0.0",
          date: currentDate.toISOString().split('T')[0],
          module_name: 'timesheet',
          log_message: `${msgLog}`,
          permission_type: 'updated',
          module_id: 0,
        }
      );

    }


    return { status: true, message: "Timesheet data saved successfully." };
  } catch (err) {
    console.error(err);
    return { status: false, message: "Error saving timesheet data.", error: err.message };
  }
}

const getStaffHourMinute = async (Timesheet) => {
  const { staff_id } = Timesheet;
  try {
    const query = `
    SELECT hourminute FROM staffs WHERE id = ?;
   `;
    const [rows] = await pool.query(query, [staff_id]);
    return { status: true, message: "success.", data: rows };
  } catch (err) {
    console.log(err);
    return { status: false, message: "Err getStaffHourMinute Data View Get", error: err.message };
  }
}

module.exports = {
  getTimesheet,
  getTimesheetTaskType,
  saveTimesheet,
  getStaffHourMinute

};

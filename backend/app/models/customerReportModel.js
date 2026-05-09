const pool = require("../config/database");
const { getStaffAccessFilters } = require("../utils/helper");

const jobStatusReports = async (Report) => {
  const { StaffUserId, page = 1, limit = 10, search = "" } = Report;
  const offset = (page - 1) * limit;

  const access = await getStaffAccessFilters(StaffUserId);
  const { customerCondition, clientCondition, jobClientCondition, jobCondition } = access;

  const jobCodeExpr = `
    CONCAT(
      SUBSTRING(customers.trading_name, 1, 3), '_',
      SUBSTRING(clients.trading_name, 1, 3), '_',
      SUBSTRING(job_types.type, 1, 4), '_',
      SUBSTRING(jobs.job_id, 1, 15)
    )
  `;

  let searchQuery = "";
  let searchValues = [];

  if (search) {
    searchQuery = `
      AND (
        customers.trading_name LIKE ?
        OR clients.trading_name LIKE ?
        OR job_types.type LIKE ?
        OR services.name LIKE ?
        OR staffs.first_name LIKE ?
        OR staffs.last_name LIKE ?
        OR jobs.job_id LIKE ?
        OR ${jobCodeExpr} LIKE ?
      )
    `;
    const s = `%${search}%`;
    searchValues = Array(8).fill(s);
  }

  try {
    const baseSelect = `
      SELECT 
        jobs.id AS id,
        jobs.service_id AS job_service_id,
        jobs.job_priority AS job_priority,
        jobs.Year_Ending_id_1 AS Year_Ending_id_1,
        jobs.Tax_Year_id_4 AS Tax_Year_id_4,
        jobs.Payroll_Frequency_id_3 AS Payroll_Frequency_id_3,
        jobs.Payroll_Week_Year_id_3 AS Payroll_Week_Year_id_3,
        jobs.Payroll_Week_Month_id_3 AS Payroll_Week_Month_id_3,
        jobs.Payroll_Week_id_3 AS Payroll_Week_id_3,
        jobs.Payroll_Month_Year_id_3 AS Payroll_Month_Year_id_3,
        jobs.Payroll_Month_id_3 AS Payroll_Month_id_3,
        jobs.Payroll_Fortnight_Year_id_3 AS Payroll_Fortnight_Year_id_3,
        jobs.Payroll_Fortnight_Month_id_3 AS Payroll_Fortnight_Month_id_3,
        jobs.Payroll_Fortnight_id_3 AS Payroll_Fortnight_id_3,
        jobs.Payroll_Quarter_Year_id_3 AS Payroll_Quarter_Year_id_3,
        jobs.Payroll_Quarter_id_3 AS Payroll_Quarter_id_3,
        jobs.Payroll_Year_id_3 AS Payroll_Year_id_3,
        jobs.Bookkeeping_Frequency_id_2 AS Bookkeeping_Frequency_id_2,
        jobs.Day_Date_id_2 AS Day_Date_id_2,
        jobs.Week_Year_id_2 AS Week_Year_id_2,
        jobs.Week_Month_id_2 AS Week_Month_id_2,
        jobs.Week_id_2 AS Week_id_2,
        jobs.Fortnight_Year_id_2 AS Fortnight_Year_id_2,
        jobs.Fortnight_Month_id_2 AS Fortnight_Month_id_2,
        jobs.Fortnight_id_2 AS Fortnight_id_2,
        jobs.Month_Year_id_2 AS Month_Year_id_2,
        jobs.Month_id_2 AS Month_id_2,
        jobs.Quarter_Year_id_2 AS Quarter_Year_id_2,
        jobs.Quarter_id_2 AS Quarter_id_2,
        jobs.Year_id_2 AS Year_id_2,
        jobs.Other_FromDate_id_2 AS Other_FromDate_id_2,
        jobs.Other_ToDate_id_2 AS Other_ToDate_id_2,
        ${jobCodeExpr} AS job_code_id,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        clients.id AS client_id,
        clients.trading_name AS client_trading_name,
        staffs3.id AS account_manager_id,
        CONCAT(staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
        staffs3.employee_number AS account_manager_employee_number,
        services.id AS service_id,
        services.name AS service_name,
        job_types.id AS job_type_id,
        job_types.type AS job_type_name,
        master_status.name AS status,
        staffs2.id AS reviewer_id,
        CONCAT(staffs2.first_name, ' ', staffs2.last_name) AS reviewer_name,
        staffs.id AS allocated_id,
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS allocated_name,
        DATE_FORMAT(jobs.filing_Companies_date, '%Y-%m-%d') AS filing_Companies_date,
        DATE_FORMAT(jobs.internal_deadline_date, '%Y-%m-%d') AS internal_deadline_date,
        DATE_FORMAT(jobs.customer_deadline_date, '%Y-%m-%d') AS customer_deadline_date,
        DATE_FORMAT(queries.query_sent_date, '%Y-%m-%d') AS query_sent_date,
        DATE_FORMAT(queries.final_query_response_received_date, '%Y-%m-%d') AS final_query_response_received_date,
        DATE_FORMAT(drafts.draft_sent_on, '%Y-%m-%d') AS draft_sent_on,
        DATE_FORMAT(drafts.final_draft_sent_on, '%Y-%m-%d') AS final_draft_sent_on,
        DATE_FORMAT(jobs.created_at, '%Y-%m-%d') AS job_received_on,
        staff_list.multiple_staff_names
      FROM jobs
      LEFT JOIN (
            SELECT 
                jas.job_id,
                GROUP_CONCAT(
                    DISTINCT CONCAT(s.first_name, ' ', s.last_name)
                    SEPARATOR ', '
                ) AS multiple_staff_names
            FROM job_allowed_staffs jas
            JOIN staffs s ON s.id = jas.staff_id
            GROUP BY jas.job_id
        ) staff_list ON staff_list.job_id = jobs.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN services ON jobs.service_id = services.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      LEFT JOIN staffs AS staffs2 ON jobs.reviewer = staffs2.id
      LEFT JOIN staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
      LEFT JOIN master_status ON master_status.id = jobs.status_type
      LEFT JOIN queries ON queries.job_id = jobs.id
      LEFT JOIN drafts ON drafts.job_id = jobs.id
      WHERE jobs.${customerCondition} AND jobs.${jobClientCondition} AND jobs.${jobCondition}
      ${searchQuery}
      GROUP BY jobs.id
      ORDER BY jobs.id DESC
      LIMIT ? OFFSET ?
    `;

    const [rowsData] = await pool.execute(baseSelect, [
      ...searchValues,
      Number(limit),
      Number(offset),
    ]);

    const countQuery = `
      SELECT COUNT(DISTINCT jobs.id) AS total
      FROM jobs
      JOIN customers ON jobs.customer_id = customers.id
      JOIN clients ON jobs.client_id = clients.id
      WHERE jobs.${customerCondition} AND jobs.${jobClientCondition} AND jobs.${jobCondition}
      ${searchQuery}
    `;

    const [[{ total }]] = await pool.execute(countQuery, searchValues);

    return {
      status: true,
      message: "Success.",
      data: { rows: rowsData, total },
    };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job status report." };
  }
};

const jobSummaryReports = async (Report) => {
  const { StaffUserId } = Report;
  const access = await getStaffAccessFilters(StaffUserId);
  const { customerCondition, jobClientCondition, jobCondition } = access;

  try {
    const query = `
      SELECT 
        master_status.name AS job_status,
        COUNT(DISTINCT jobs.id) AS number_of_job,
        GROUP_CONCAT(DISTINCT jobs.id) AS job_ids
      FROM jobs
      JOIN master_status ON master_status.id = jobs.status_type
      JOIN customers ON jobs.customer_id = customers.id
      WHERE jobs.${customerCondition} AND jobs.${jobClientCondition} AND jobs.${jobCondition}
      GROUP BY master_status.name, jobs.status_type
    `;
    const [result] = await pool.execute(query);
    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job summary report." };
  }
};

const jobPendingReports = async (Report) => {
  const { StaffUserId } = Report;
  const access = await getStaffAccessFilters(StaffUserId);
  const { customerCondition, jobClientCondition, jobCondition } = access;

  try {
    const query = `
      SELECT 
        master_status.name AS job_status,
        COUNT(DISTINCT jobs.id) AS number_of_job,
        GROUP_CONCAT(DISTINCT jobs.id) AS job_ids
      FROM jobs
      JOIN master_status ON master_status.id = jobs.status_type
      JOIN customers ON jobs.customer_id = customers.id
      WHERE jobs.status_type != 6 
      AND jobs.${customerCondition} AND jobs.${jobClientCondition} AND jobs.${jobCondition}
      GROUP BY master_status.name, jobs.status_type
    `;
    const [result] = await pool.execute(query);
    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job pending report." };
  }
};

const getCustomWeekNumber = (day) => {
  if (day >= 1 && day <= 7) return 1;
  if (day >= 8 && day <= 14) return 2;
  if (day >= 15 && day <= 21) return 3;
  if (day >= 22) return 4;
  return 0;
};

const jobReceivedSentReports = async (Report) => {
  const { StaffUserId } = Report;
  const access = await getStaffAccessFilters(StaffUserId);
  const { customerCondition, jobClientCondition, jobCondition } = access;

  try {
    const weeklyQuery = `
      SELECT 
        DATE_FORMAT(jobs.created_at, '%M') AS month_name,
        DAY(jobs.created_at) AS day,
        COUNT(DISTINCT jobs.id) AS job_received,
        COUNT(drafts.job_id) AS draft_count,
        GROUP_CONCAT(DISTINCT jobs.id ORDER BY jobs.id) AS job_ids
      FROM jobs
      LEFT JOIN drafts ON drafts.job_id = jobs.id
      JOIN customers ON jobs.customer_id = customers.id
      WHERE YEAR(jobs.created_at) = YEAR(CURDATE())
      AND jobs.${customerCondition} AND jobs.${jobClientCondition} AND jobs.${jobCondition}
      GROUP BY month_name, day
      ORDER BY MONTH(jobs.created_at), day
    `;
    const [weeklyRows] = await pool.execute(weeklyQuery);

    const monthlyData = {};
    weeklyRows.forEach((entry) => {
      const { month_name, day, job_received, draft_count, job_ids } = entry;
      const week_number = getCustomWeekNumber(day);

      if (!monthlyData[month_name]) {
        monthlyData[month_name] = {
          month_name,
          job_received: 0,
          draft_count: 0,
          job_ids: [],
          weeks: Array.from({ length: 4 }, (_, i) => ({
            week_number: i + 1,
            job_received: 0,
            draft_count: 0,
            job_ids: "",
          })),
        };
      }

      monthlyData[month_name].job_received += job_received;
      monthlyData[month_name].draft_count += draft_count;
      monthlyData[month_name].job_ids.push(...job_ids.split(","));

      const weekEntry = monthlyData[month_name].weeks[week_number - 1];
      weekEntry.job_received += job_received;
      weekEntry.draft_count += draft_count;
      weekEntry.job_ids += weekEntry.job_ids ? "," + job_ids : job_ids;
    });

    const result = Object.values(monthlyData).map((month) => {
      return {
        month_name: month.month_name,
        job_received: month.job_received,
        draft_count: month.draft_count,
        job_ids: [...new Set(month.job_ids)].join(","),
        week: month.weeks.map((week) => ({
          week_number: week.week_number,
          job_received: week.job_received,
          draft_count: week.draft_count,
          job_ids: week.job_ids,
        })),
      };
    });

    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job received/sent report." };
  }
};

const dueByReport = async (Report) => {
  const { StaffUserId } = Report;
  const access = await getStaffAccessFilters(StaffUserId);
  const { customerCondition, jobClientCondition, jobCondition } = access;

  try {
    const monthsRange = 12;
    let query = `
      SELECT
        customers.id AS customer_id,
        customers.trading_name AS customer_name,
    `;

    let dueConditions = [];
    for (let i = 1; i <= monthsRange; i++) {
      dueConditions.push(`
        JSON_OBJECT(
            'count', COUNT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL ${i - 1} MONTH) AND DATE_ADD(CURDATE(), INTERVAL ${i} MONTH) THEN 1 END),
            'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on BETWEEN DATE_ADD(CURDATE(), INTERVAL ${i - 1} MONTH) AND DATE_ADD(CURDATE(), INTERVAL ${i} MONTH) THEN jobs.id END)
        ) AS due_within_${i}_months
      `);
    }

    dueConditions.push(`
      JSON_OBJECT(
          'count', COUNT(CASE WHEN jobs.due_on < CURDATE() THEN 1 END),
          'job_ids', GROUP_CONCAT(CASE WHEN jobs.due_on < CURDATE() THEN jobs.id END)
      ) AS due_passed
    `);

    query += dueConditions.join(",\n");
    query += `
      FROM customers
      LEFT JOIN jobs ON jobs.customer_id = customers.id
      WHERE jobs.${customerCondition}
      GROUP BY customers.id
      ORDER BY customers.id ASC;
    `;

    const [result] = await pool.execute(query);

    const formattedResult = result.map((row) => {
      const weeksData = {};
      for (let i = 1; i <= monthsRange; i++) {
        weeksData[`due_within_${i}_months`] = row[`due_within_${i}_months`];
      }

      return {
        customer_id: row.customer_id,
        customer_name: row.customer_name,
        ...weeksData,
        due_passed: row.due_passed
      };
    });

    return { status: true, message: "Success.", data: formattedResult };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting job dueByReport." };
  }
};

const teamMonthlyReports = async (Report) => {
  const { StaffUserId } = Report;
  const access = await getStaffAccessFilters(StaffUserId);
  const { customerCondition, jobClientCondition, jobCondition } = access;

  try {
    const query = `
       SELECT 
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS staff_name,
        COALESCE(SUM(CASE WHEN jobs.status_type = 6 THEN 1 ELSE 0 END), 0) AS number_of_job_completed,
        GROUP_CONCAT(jobs.id) AS job_ids
        FROM staffs
        INNER JOIN jobs ON jobs.staff_created_id = staffs.id
        JOIN customers ON jobs.customer_id = customers.id
        WHERE MONTH(jobs.created_at) = MONTH(CURRENT_DATE)
        AND jobs.${customerCondition} AND jobs.${jobClientCondition} AND jobs.${jobCondition}
        GROUP BY staffs.id
    `;
    const [result] = await pool.execute(query);
    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting team monthly report." };
  }
};

const taxWeeklyStatusReport = async (Report) => {
  try {
    const { StaffUserId, customer_id, job_status_type_id, processor_id, reviewer_id } = Report;
    const access = await getStaffAccessFilters(StaffUserId);
    const { customerCondition } = access;

    const currentYear = new Date().getFullYear();

    let query = `
      SELECT
        master_status.name AS job_status,
        customers.trading_name AS customer_name,
        YEARWEEK(jobs.created_at, 1) AS year_week,
        COUNT(jobs.id) AS job_count,
        GROUP_CONCAT(jobs.id) AS job_ids
      FROM jobs
      INNER JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN master_status ON master_status.id = jobs.status_type
      WHERE YEAR(jobs.created_at) = ?
      AND jobs.${customerCondition}
    `;

    const params = [currentYear];

    if (customer_id) {
      query += ` AND customers.id = ?`;
      params.push(customer_id);
    }
    if (job_status_type_id) {
      query += ` AND jobs.status_type = ?`;
      params.push(job_status_type_id);
    } else {
      query += ` AND jobs.status_type = 6`;
    }
    if (processor_id) {
      query += ` AND jobs.allocated_to = ?`;
      params.push(processor_id);
    }
    if (reviewer_id) {
      query += ` AND jobs.reviewer = ?`;
      params.push(reviewer_id);
    }

    query += `
      GROUP BY customers.id, master_status.id, year_week
      ORDER BY customers.id, year_week
    `;

    const [rowsData] = await pool.execute(query, params);

    const formattedResult = [];
    const grouped = {};

    for (const row of rowsData) {
      const weekNum = parseInt(row.year_week.toString().slice(-2));
      const key = `${row.customer_name}_${row.job_status}`;

      if (!grouped[key]) {
        grouped[key] = {
          job_status: row.job_status,
          customer_name: row.customer_name,
          weeks: [{}],
          Grand_Total: { count: 0, job_ids: "" },
        };
        const weeksData = {};
        for (let i = 1; i <= 53; i++) {
          weeksData[`WE_${i}_${currentYear}`] = { count: 0, job_ids: "" };
        }
        grouped[key].weeks[0] = weeksData;
      }

      grouped[key].weeks[0][`WE_${weekNum}_${currentYear}`] = {
        count: row.job_count,
        job_ids: row.job_ids,
      };

      const existingIds = grouped[key].Grand_Total.job_ids ? grouped[key].Grand_Total.job_ids.split(",") : [];
      const newIds = row.job_ids.split(",");
      const uniqueIds = [...new Set([...existingIds, ...newIds])];
      grouped[key].Grand_Total = {
        count: uniqueIds.length,
        job_ids: uniqueIds.join(","),
      };
    }

    for (const key in grouped) {
      formattedResult.push(grouped[key]);
    }

    return { status: true, message: "Success.", data: formattedResult };
  } catch (error) {
    console.error("error ", error);
    return { status: false, message: "Error getting tax status weekly report." };
  }
};

const averageTatReport = async (Report) => {
  const { StaffUserId } = Report;
  const access = await getStaffAccessFilters(StaffUserId);
  const { customerCondition, jobClientCondition, jobCondition } = access;

  try {
    const query = `
        SELECT
            CASE 
                WHEN MONTH(jobs.created_at) = MONTH(CURDATE()) AND YEAR(jobs.created_at) = YEAR(CURDATE()) THEN 'Current'
                ELSE DATE_FORMAT(jobs.created_at, '%b %Y')
            END AS month,
            AVG(DATEDIFF(jobs.updated_at, jobs.created_at)) / DAY(LAST_DAY(jobs.created_at)) AS average_tat_per_day,
            GROUP_CONCAT(jobs.id ORDER BY jobs.created_at) AS job_ids
        FROM jobs
        JOIN customers ON jobs.customer_id = customers.id
        WHERE jobs.status_type = 6
        AND jobs.${customerCondition} AND jobs.${jobClientCondition} AND jobs.${jobCondition}
        GROUP BY YEAR(jobs.created_at), MONTH(jobs.created_at)
        ORDER BY jobs.created_at DESC
    `;

    const [result] = await pool.execute(query);
    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting average TAT report." };
  }
};

const reportCountJob = async (Report) => {
  const { StaffUserId, job_ids, page = 1, limit = 10, search = "" } = Report;
  const offset = (page - 1) * Number(limit);
  const cleanJob_ids = job_ids ? job_ids.replace(/^,+|,+$/g, "") : "";

  if (!cleanJob_ids) {
    return { status: true, message: "No jobs found.", data: { data: [], pagination: { totalItems: 0 } } };
  }

  const access = await getStaffAccessFilters(StaffUserId);
  const { customerCondition, jobClientCondition, jobCondition } = access;

  const jobCodeExpr = `
    CONCAT(
      SUBSTRING(customers.trading_name, 1, 3), '_',
      SUBSTRING(clients.trading_name, 1, 3), '_',
      SUBSTRING(job_types.type, 1, 4), '_',
      SUBSTRING(jobs.job_id, 1, 15)
    )
  `;

  let searchQuery = "";
  let searchValues = [];
  if (search) {
    searchQuery = `
      AND (
        customers.trading_name LIKE ?
        OR clients.trading_name LIKE ?
        OR job_types.type LIKE ?
        OR services.name LIKE ?
        OR jobs.job_id LIKE ?
        OR ${jobCodeExpr} LIKE ?
      )
    `;
    const s = `%${search}%`;
    searchValues = Array(6).fill(s);
  }

  try {
    const baseSelect = `
        SELECT 
        jobs.id AS job_id,
        jobs.service_id AS job_service_id,
        job_types.type AS job_type_name,
        jobs.status_type AS status_type,
        jobs.job_priority AS job_priority,
        clients.trading_name AS client_trading_name,
        jobs.invoiced AS invoiced,
        staffs.id AS allocated_id,
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS allocated_name,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        CONCAT(staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
        staffs3.employee_number AS account_manager_employee_number,
        DATE_FORMAT(jobs.created_at, '%d/%m/%Y') AS created_at,
        master_status.name AS status,
        ${jobCodeExpr} AS job_code_id
        FROM jobs
        LEFT JOIN clients ON jobs.client_id = clients.id
        LEFT JOIN customers ON jobs.customer_id = customers.id
        LEFT JOIN job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN services ON jobs.service_id = services.id
        LEFT JOIN staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN master_status ON master_status.id = jobs.status_type
        WHERE jobs.id IN (${cleanJob_ids})
        AND jobs.${customerCondition} AND jobs.${jobClientCondition} AND jobs.${jobCondition}
        ${searchQuery}
        GROUP BY jobs.id
        ORDER BY jobs.id DESC
        LIMIT ? OFFSET ?
    `;

    const [rowsData] = await pool.execute(baseSelect, [...searchValues, Number(limit), Number(offset)]);

    const countQuery = `
      SELECT COUNT(DISTINCT jobs.id) AS total
      FROM jobs
      JOIN customers ON jobs.customer_id = customers.id
      JOIN clients ON jobs.client_id = clients.id
      WHERE jobs.id IN (${cleanJob_ids})
      AND jobs.${customerCondition} AND jobs.${jobClientCondition} AND jobs.${jobCondition}
      ${searchQuery}
    `;

    const [[{ total }]] = await pool.execute(countQuery, searchValues);

    return {
      status: true,
      message: "Success.",
      data: {
        data: rowsData,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit: limit,
        },
      },
    };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting report count job." };
  }
};

const missingTimesheetReport = async (Report) => {
  try {
    const { StaffUserId } = Report;
    const filters = await getStaffAccessFilters(StaffUserId);

    let where = `WHERE (ts.submit_status = '0' OR ts.submit_status IS NULL)`;
    if (filters.customer_id) where += ` AND ts.customer_id = ${filters.customer_id}`;
    if (filters.client_id) where += ` AND ts.client_id = ${filters.client_id}`;
    if (filters.job_id) where += ` AND ts.job_id = ${filters.job_id}`;

    const query = `
            SELECT 
                CONCAT(st.first_name, ' ', st.last_name) AS staff_fullname,
                st.email AS staff_email,
                st.id AS staff_id,
                COALESCE(ts.submit_status, 0) AS submit_status,
                DATE_FORMAT(COALESCE(ts.monday_date, ts.tuesday_date, ts.wednesday_date, ts.thursday_date, ts.friday_date, ts.saturday_date, ts.sunday_date), '%Y-%m-%d') AS week_date
            FROM staffs st
            LEFT JOIN timesheet ts ON st.id = ts.staff_id
            AND YEARWEEK(COALESCE(ts.monday_date, ts.tuesday_date, ts.wednesday_date, ts.thursday_date, ts.friday_date, ts.saturday_date, ts.sunday_date), 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
            ${where}
            GROUP BY st.id
            ORDER BY st.first_name ASC
        `;

    const [result] = await pool.execute(query);
    return { status: true, message: "Success.", data: { result } };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting missing timesheet report." };
  }
};

const discrepancyReport = async (Report) => {
  try {
    const { StaffUserId } = Report;
    const filters = await getStaffAccessFilters(StaffUserId);

    let where = [];
    if (filters.customer_id) where.push(`jobs.customer_id = ${filters.customer_id}`);
    if (filters.client_id) where.push(`jobs.client_id = ${filters.client_id}`);
    if (filters.job_id) where.push(`jobs.id = ${filters.job_id}`);

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : "";

    const query = `
            SELECT 
                jobs.id AS job_id,
                CONCAT(SUBSTRING(customers.trading_name, 1, 3), '_', SUBSTRING(clients.trading_name, 1, 3), '_', SUBSTRING(job_types.type, 1, 4), '_', jobs.job_id) AS job_code_id,
                jobs.total_time AS job_total_time,
                SUM(
                    COALESCE(CAST(REPLACE(timesheet.monday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
                    COALESCE(CAST(REPLACE(timesheet.tuesday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
                    COALESCE(CAST(REPLACE(timesheet.wednesday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
                    COALESCE(CAST(REPLACE(timesheet.thursday_hours, ':', '.') AS DECIMAL(10,2)), 0) +
                    COALESCE(CAST(REPLACE(timesheet.friday_hours, ':', '.') AS DECIMAL(10,2)), 0)
                ) AS total_spent_hours
            FROM timesheet
            JOIN jobs ON (timesheet.task_type = '2' AND timesheet.job_id = jobs.id)
            JOIN customers ON customers.id = jobs.customer_id
            JOIN clients ON clients.id = jobs.client_id
            JOIN job_types ON jobs.job_type_id = job_types.id
            ${whereClause}
            GROUP BY jobs.id, job_code_id, jobs.total_time
        `;

    const [result] = await pool.execute(query);
    return { status: true, message: "Success.", data: result };
  } catch (error) {
    console.log("error ", error);
    return { status: false, message: "Error getting discrepancy report." };
  }
};

module.exports = {
  jobStatusReports,
  jobSummaryReports,
  jobPendingReports,
  jobReceivedSentReports,
  dueByReport,
  teamMonthlyReports,
  taxWeeklyStatusReport,
  averageTatReport,
  reportCountJob,
  missingTimesheetReport,
  discrepancyReport
};

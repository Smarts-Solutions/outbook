const pool = require('../config/database');
const { getDateRange, SatffLogUpdateOperation, generateNextUniqueCode, JobStatusUpdate, getStaffAccessFilters, grantStaffAccess, QueryRoleHelperFunction } = require('../utils/helper');
const { CustomerLogUpdateOperation } = require('../utils/customerHelper');
const { getCompanyOfficerDetailsFun } = require('../controllers/companies/companyController');

const getCustomerDashboardData = async (dashboard) => {
  const { staff_id, date_filter, customer_id, StaffUserId } = dashboard;
  const effectiveStaffId = staff_id || StaffUserId;
  let { startDate, endDate } = await getDateRange(date_filter);

  try {
    const access = await getStaffAccessFilters(effectiveStaffId);
    const assignedCustomerIds = access.assignedCustomerIds;

    if (assignedCustomerIds.length === 0) {
      return {
        status: true,
        message: "No assigned customers found.",
        data: {
          customer: { count: 0, ids: "" },
          client: { count: 0, ids: "" },
          job: { count: 0, ids: "" },
          pending_job: { count: 0, ids: "" },
          completed_job: { count: 0, ids: "" },
        }
      };
    }

    const idsStr = assignedCustomerIds.join(',');

    // 1. Get Customers within date range
    let customerFilter = "";
    if (customer_id) {
      customerFilter = ` AND id = ${pool.escape(customer_id)}`;
    }
    const CustomerQuery = `
        SELECT id FROM customers 
        WHERE id IN (${idsStr})
        ${customerFilter}
        AND DATE(created_at) BETWEEN ? AND ?
        ORDER BY id DESC
    `;
    const [CustomerData] = await pool.execute(CustomerQuery, [startDate, endDate]);

    // 2. Get Clients for these Customers
    let clientCondition = access.clientCondition;
    if (customer_id) {
      clientCondition += ` AND customer_id = ${pool.escape(customer_id)}`;
    }

    const ClientQuery = `
        SELECT id FROM clients 
        WHERE customer_id IN (${idsStr})
        AND ${clientCondition}
        AND DATE(created_at) BETWEEN ? AND ?
        ORDER BY id DESC
    `;
    const [ClientData] = await pool.execute(ClientQuery, [startDate, endDate]);

    // 3. Get Jobs for these Customers
    let jobCondition = access.jobCondition;
    if (customer_id) {
      jobCondition += ` AND customer_id = ${pool.escape(customer_id)}`;
    }

    const JobQuery = `
        SELECT id, status_type FROM jobs 
        WHERE customer_id IN (${idsStr})
        AND ${jobCondition}
        AND DATE(created_at) BETWEEN ? AND ?
        ORDER BY id DESC
    `;
    const [JobData] = await pool.execute(JobQuery, [startDate, endDate]);

    const result = {
      customer: {
        count: CustomerData.length,
        ids: CustomerData.map((row) => row.id).join(","),
      },
      client: {
        count: ClientData.length,
        ids: ClientData.map((row) => row.id).join(","),
      },
      job: {
        count: JobData.length,
        ids: JobData.map((row) => row.id).join(","),
      },
      pending_job: {
        count: JobData?.filter((row) => Number(row.status_type) != 6).length,
        ids: JobData?.filter((row) => Number(row.status_type) != 6)
          .map((row) => row.id)
          .join(","),
      },
      completed_job: {
        count: JobData?.filter((row) => Number(row.status_type) === 6).length,
        ids: JobData?.filter((row) => Number(row.status_type) === 6)
          .map((row) => row.id)
          .join(","),
      },
    };
    return { status: true, message: "success.", data: result };
  } catch (err) {
    console.error("getCustomerDashboardData error", err);
    return {
      status: false,
      message: "Err Customer Dashboard Data View Get",
      error: err.message,
    };
  }
};

const getCustomerDashboardActivityLog = async (dashboard) => {
  const {
    staff_id,
    filter_type,
    from_date,
    to_date,
    page,
    filter_staff_id,
    export_all,
  } = dashboard;

  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  try {
    let whereConditions = [];
    let queryParams = [];

    // Filter by staff_id (Customer User)
    whereConditions.push("staff_logs.staff_id = ?");
    queryParams.push(staff_id);

    if (filter_staff_id) {
      whereConditions.push("staff_logs.staff_id = ?");
      queryParams.push(filter_staff_id);
    }

    if (filter_type === "custom" && from_date && to_date) {
      whereConditions.push("DATE(staff_logs.created_at) BETWEEN ? AND ?");
      queryParams.push(from_date, to_date);
    } else {
      const { startDate, endDate } = await getDateRange(filter_type);
      whereConditions.push("DATE(staff_logs.created_at) BETWEEN ? AND ?");
      queryParams.push(startDate, endDate);
    }

    const whereClause =
      whereConditions.length > 0
        ? "WHERE " + whereConditions.join(" AND ")
        : "";

    const query = `
      SELECT 
        staff_logs.id,
        staff_logs.staff_id,
        staff_logs.date,
        staff_logs.module_name,
        staff_logs.module_id,
        staff_logs.log_message,
        REPLACE(REPLACE(staff_logs.log_message_all, 'CUSTOMERUSER ', ''), 'Customer User ', '') AS log_message_all,
        staff_logs.permission_type,
        staff_logs.ip,
        staff_logs.created_at,
        staff_logs.updated_at,
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS staff_name
      FROM 
        staff_logs
      JOIN 
        staffs ON staffs.id = staff_logs.staff_id
      ${whereClause}
      ORDER BY 
        staff_logs.created_at DESC
      ${export_all ? "" : `LIMIT ${pageSize} OFFSET ${offset}`}
    `;

    const [rows] = await pool.execute(query, queryParams);
    return { status: true, message: "Success..", data: rows };
  } catch (err) {
    console.error("getCustomerDashboardActivityLog error", err);
    return { status: false, message: "Error fetching activity log", error: err.message };
  }
};

const getMasterStatus = async () => {
  try {
    const query = `
      SELECT
        master_status.id AS id,
        master_status.name AS name,
        master_status.status_type_id AS status_type_id,
        master_status.is_disable AS is_disable,
        master_status.x_days AS x_days,
        status_types.type AS status_type,
        master_status.created_at AS created_at,
        master_status.updated_at AS updated_at
      FROM 
        master_status
      JOIN 
        status_types ON status_types.id = master_status.status_type_id
      WHERE 
        master_status.status = '1'
      ORDER BY 
        master_status.id DESC
    `;
    const [rows] = await pool.execute(query);
    return { status: true, data: rows };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const updateJobStatus = async (data) => {
  const { job_id, status_type, StaffUserId, ip } = data;

  try {
    const access = await getStaffAccessFilters(StaffUserId);
    if (!access.assignedCustomerIds.length) {
      return { status: false, message: "No assigned customers found." };
    }

    const checkQuery = `
      SELECT j.id, j.status_type, j.customer_id 
      FROM jobs j
      WHERE j.id = ? AND j.customer_id IN (${access.assignedCustomerIds.join(',')})
      AND j.${access.jobCondition}
    `;
    const [jobRows] = await pool.execute(checkQuery, [job_id]);

    if (jobRows.length === 0) {
      return { status: false, message: "Job not found or access denied." };
    }

    const ExistJobData = jobRows;
    const oldStatusType = ExistJobData[0].status_type;

    // 2. Validation logic (copied from jobModel.js)

    // Check if Processor is assigned
    if ([4, 5, 7, 3].includes(parseInt(status_type))) {
      const [[ExistAllocatedTo]] = await pool.execute(
        `SELECT allocated_to FROM jobs WHERE id = ?`,
        [job_id]
      );

      if (["", null, undefined, 0, "0"].includes(ExistAllocatedTo?.allocated_to)) {
        return {
          status: false,
          message: "Please assign the job to the Processor.",
          data: "W",
        };
      }
    }

    // Check if Reviewer is assigned
    if ([5, 7, 17, 18, 19, 20].includes(parseInt(status_type))) {
      const [[ExistReviewer]] = await pool.execute(
        `SELECT reviewer FROM jobs WHERE id = ?`,
        [job_id]
      );

      if (["", null, undefined, 0, "0"].includes(ExistReviewer?.reviewer)) {
        return {
          status: false,
          message: "Please assign the job to the reviewer.",
          data: "W",
        };
      }
    }

    // Check if First Draft is sent
    if ([7, 18, 19, 20].includes(parseInt(status_type))) {
      const [ExistDraft] = await pool.execute(
        `SELECT job_id FROM drafts WHERE job_id = ?`,
        [job_id]
      );
      if (ExistDraft.length === 0) {
        return {
          status: false,
          message: "Please send the first draft.",
          data: "W",
        };
      }
    }

    // Check Draft Feedback Received
    if ([17].includes(parseInt(status_type))) {
      const [ExistDraftFeedbackYes] = await pool.execute(
        `SELECT 
          CASE 
            WHEN COUNT(*) > 0 THEN TRUE 
            ELSE FALSE 
          END AS is_condition_true
      FROM drafts
      WHERE job_id = ?
        AND feedback_received = '1'
        AND was_it_complete = '0'`,
        [job_id]
      );

      const isCondition = ExistDraftFeedbackYes[0]?.is_condition_true;
      if (isCondition == 0) {
        return {
          status: false,
          message: "Please sent the draft feedback first.",
          data: "W",
        };
      }
    }

    // Check if Queries are sent
    if ([4].includes(parseInt(status_type))) {
      const [ExistQueries] = await pool.execute(
        `SELECT job_id FROM queries WHERE job_id = ?`,
        [job_id]
      );
      if (ExistQueries.length === 0) {
        return {
          status: false,
          message: "Please send the Queries.",
          data: "W",
        };
      }
    }

    // Check if Missing Logs are sent
    if ([2].includes(parseInt(status_type))) {
      const [ExistMissingLogs] = await pool.execute(
        `SELECT job_id FROM missing_logs WHERE job_id = ?`,
        [job_id]
      );
      if (ExistMissingLogs.length === 0) {
        return {
          status: false,
          message: "Please send Missing Paper Logs.",
          data: "W",
        };
      }
    }

    // Check for Status 6 (Completed)
    if ([6].includes(parseInt(status_type))) {
      const [ExistDraft] = await pool.execute(
        `SELECT job_id FROM drafts WHERE job_id = ?`,
        [job_id]
      );
      if (ExistDraft.length === 0) {
        return {
          status: false,
          message: "Please sent first draft.",
          data: "W",
        };
      }

      const [[rowsDraftProcess]] = await pool.execute(
        `SELECT 
          CASE
              WHEN NOT EXISTS (
                  SELECT 1 
                  FROM drafts 
                  WHERE job_id = ? 
                    AND was_it_complete <> '1'
              )
              THEN 1
              ELSE 0
          END AS status_check;`,
        [job_id]
      );

      if (rowsDraftProcess.status_check === 0) {
        return {
          status: false,
          message: "Please complete the draft.",
          data: "W",
        };
      }
    } else {
      // Missing Log Review Check
      const [ExistMissingLog] = await pool.execute(
        `SELECT job_id FROM missing_logs WHERE missing_log_reviewed_date IS NULL AND job_id = ? LIMIT 1`,
        [job_id]
      );

      if (ExistMissingLog.length > 0) {
        return {
          status: false,
          message: "Please review the missing log.",
          data: "W",
        };
      }

      // Query Review Check
      const [ExistQuery] = await pool.execute(
        `SELECT job_id FROM queries WHERE final_query_response_received_date IS NULL AND job_id = ? LIMIT 1`,
        [job_id]
      );

      if (ExistQuery.length > 0) {
        return {
          status: false,
          message: "Please review the query.",
          data: "W",
        };
      }
    }

    // 3. Status-Specific Update Queries
    let query = `
         UPDATE jobs 
         SET status_type = ? , status_updation_date = NOW()
         WHERE id = ?
       `;

    if (parseInt(status_type) == 20) {
      query = `
        UPDATE jobs 
        SET status_type = ?, status_updation_date = NOW(), filing_hmrc_required = '1' , filing_hmrc_date = CURDATE()
        WHERE id = ?
      `;
    } else if (parseInt(status_type) == 19) {
      query = `
        UPDATE jobs 
        SET status_type = ?, status_updation_date = NOW(), filing_Companies_required = '1' , filing_Companies_date = CURDATE()
        WHERE id = ?
      `;
    } else if (parseInt(status_type) == 18) {
      query = `
        UPDATE jobs 
        SET status_type = ?, status_updation_date = NOW(), filing_hmrc_required = '1', filing_hmrc_date = CURDATE() , filing_Companies_required = '1' , filing_Companies_date = CURDATE()
        WHERE id = ?
      `;
    }

    // 4. Update Status and History
    const status_update_date = new Date().toLocaleString('sv-SE');
    await JobStatusUpdate(job_id, status_type, status_update_date);

    const [result] = await pool.execute(query, [status_type, job_id]);

    if (result.affectedRows > 0) {
      // 5. Logging
      const [[StatusName]] = await pool.execute(
        `SELECT 
          MAX(CASE WHEN id = ? THEN name END) AS from_status, 
          MAX(CASE WHEN id = ? THEN name END) AS to_status 
         FROM master_status 
         WHERE id IN (?, ?)`
        , [oldStatusType, status_type, oldStatusType, status_type]);

      const currentDate = new Date();
      await CustomerLogUpdateOperation({
        staff_id: StaffUserId,
        ip: ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "job",
        log_message: `updated the job status from ${StatusName.from_status} to ${StatusName.to_status}. job code:`,
        permission_type: "updated",
        module_id: job_id,
      });

      return { status: true, message: "Job status updated successfully." };
    } else {
      return { status: false, message: "No job found or no changes made." };
    }
  } catch (error) {
    console.error("updateJobStatus error", error);
    return { status: false, message: error.message };
  }
};

const getByCustomerClient = async (dashboard) => {
  try {
    let { staff_id, StaffUserId, ids, customer_id, page, limit, search } = dashboard;

    // Support both staff_id and StaffUserId
    const effectiveStaffId = staff_id || StaffUserId;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const access = await getStaffAccessFilters(effectiveStaffId);
    let filterCondition = "";
    if (ids) {
      const cleane_ids = ids.replace(/^,+|,+$/g, "");
      if (cleane_ids) {
        filterCondition = `AND clients.id IN (${cleane_ids}) AND clients.${access.clientCondition}`;
      }
    } else if (customer_id) {
      filterCondition = `AND clients.customer_id = ${customer_id} AND clients.${access.clientCondition}`;
    } else {
      filterCondition = `AND clients.${access.clientCondition}`;
    }

    if (!access.assignedCustomerIds.length) return { status: true, message: "No filters provided.", data: [], pagination: { total: 0 } };

    const clientCodeExpr = `
      CONCAT(
        'cli_',
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(clients.client_code, 1, 15)
      )
    `;

    let searchCondition = "";
    let searchParams = [];

    if (search) {
      searchCondition = `
        AND (
          clients.trading_name LIKE ?
          OR customers.trading_name LIKE ?
          OR client_types.type LIKE ?
          OR client_contact_details.email LIKE ?
          OR client_contact_details.phone LIKE ?
          OR ${clientCodeExpr} LIKE ?
          OR ? LIKE CONCAT('%', ${clientCodeExpr}, '%')
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        search,
      ];
    }

    const idsStr = access.assignedCustomerIds.length > 0 ? access.assignedCustomerIds.join(',') : '0';

    const [countResult] = await pool.execute(
      `
      SELECT COUNT(DISTINCT clients.id) AS total
      FROM clients
      JOIN customers ON customers.id = clients.customer_id
      JOIN client_types ON client_types.id = clients.client_type
      JOIN staffs ON clients.staff_created_id = staffs.id
      LEFT JOIN client_contact_details ON client_contact_details.id = (
          SELECT MIN(cd.id)
          FROM client_contact_details cd
          WHERE cd.client_id = clients.id
      )
      WHERE customers.id IN (${idsStr})
      ${filterCondition}
      ${searchCondition}
      `,
      [...searchParams],
    );
    const total = countResult[0].total;

    const query = `
      SELECT  
          clients.id AS id,
          clients.trading_name AS client_name,
          customers.trading_name AS customer_name,
          clients.status AS status,
          client_types.type AS client_type_name,
          client_contact_details.email AS email,
          client_contact_details.phone_code AS phone_code,
          client_contact_details.phone AS phone,
          CONCAT(staffs.first_name,' ',staffs.last_name) AS client_created_by,
          DATE_FORMAT(clients.created_at, '%d/%m/%Y') AS created_at,
          ${clientCodeExpr} AS client_code,
          customers.id AS customer_id
      FROM clients
      JOIN customers ON customers.id = clients.customer_id    
      JOIN client_types ON client_types.id = clients.client_type
      JOIN staffs ON clients.staff_created_id = staffs.id
      LEFT JOIN client_contact_details ON client_contact_details.id = (
          SELECT MIN(cd.id)
          FROM client_contact_details cd
          WHERE cd.client_id = clients.id
      )
      WHERE customers.id IN (${idsStr})
      ${filterCondition}
      ${searchCondition}
      ORDER BY clients.id DESC
      LIMIT ? OFFSET ?;
    `;

    const [result] = await pool.execute(query, [
      ...searchParams,
      limit,
      offset,
    ]);

    let finalResult = result;
    if (result.length > 0) {
      finalResult = await Promise.all(
        result.map(async (element) => {
          const Get_account_manger_id = `
            SELECT s.id,
                   CONCAT(s.first_name, ' ', s.last_name) AS full_name,
                   s.employee_number
            FROM staffs s
            JOIN customer_service_account_managers csam 
              ON s.id = csam.account_manager_id
            JOIN customer_services cs 
              ON csam.customer_service_id = cs.id
            WHERE cs.customer_id = ?
            AND cs.service_id = ?
            AND s.id != ?
          `;

          const [rowsAccountManager] = await pool.execute(
            Get_account_manger_id,
            [
              element.customer_id || 0,
              element.job_service_id || 0,
              element.account_manager_id || 0,
            ],
          );

          return {
            ...element,
            account_managers: rowsAccountManager,
          };
        }),
      );
    }

    return {
      status: true,
      message: "success.",
      data: finalResult,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        search,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: "Err Customer Dashboard Client View Get",
      error: error.message,
    };
  }
};

const getByCustomerJob = async (dashboard) => {
  try {
    let { staff_id, StaffUserId, ids, customer_id, page, limit, search } = dashboard;

    // Support both staff_id and StaffUserId
    const effectiveStaffId = staff_id || StaffUserId;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const access = await getStaffAccessFilters(effectiveStaffId);
    let filterCondition = "";
    if (ids) {
      const cleane_ids = ids.replace(/^,+|,+$/g, "");
      if (cleane_ids) {
        filterCondition = `AND jobs.id IN (${cleane_ids}) AND jobs.${access.jobCondition}`;
      }
    } else if (customer_id) {
      filterCondition = `AND jobs.customer_id = ${customer_id} AND jobs.${access.jobCondition}`;
    } else {
      filterCondition = `AND jobs.${access.jobCondition}`;
    }

    if (!access.assignedCustomerIds.length) return { status: true, message: "No filters provided.", data: [], pagination: { total: 0 } };

    const jobCodeExpr = `
      CONCAT(
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(job_types.type, 1, 4), '_',
        SUBSTRING(jobs.job_id, 1, 15)
      )
    `;

    let searchCondition = "";
    let searchParams = [];

    if (search) {
      searchCondition = `
        AND (
          clients.trading_name LIKE ?
          OR customers.trading_name LIKE ?
          OR job_types.type LIKE ?
          OR jobs.client_job_code LIKE ?
          OR ${jobCodeExpr} LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
        likeSearch,
      ];
    }

    const idsStr = access.assignedCustomerIds.length > 0 ? access.assignedCustomerIds.join(',') : '0';

    const [countResult] = await pool.execute(
      `
      SELECT COUNT(DISTINCT jobs.id) AS total
      FROM jobs
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      WHERE customers.id IN (${idsStr})
      ${filterCondition}
      ${searchCondition}
      `,
      [...searchParams],
    );
    const total = countResult[0].total;

    const query = `
      SELECT 
        jobs.id AS id,
        jobs.id AS job_id,
        job_types.type AS job_type_name,
        jobs.status_type AS status_type,
        customer_contact_details.id AS account_manager_officer_id,
        customer_contact_details.first_name AS account_manager_officer_first_name,
        customer_contact_details.last_name AS account_manager_officer_last_name,
        clients.trading_name AS client_trading_name,
        jobs.client_job_code AS client_job_code,
        jobs.invoiced AS invoiced,
        jobs.total_hours AS total_hours,
        jobs.total_hours_status AS total_hours_status,
        jobs.job_priority AS job_priority,
        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        jobs.service_id AS job_service_id,
        staffs3.id AS account_manager_id,
        CONCAT(staffs3.first_name, ' ', staffs3.last_name) AS account_manager_name,
        staffs3.employee_number AS account_manager_employee_number,
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,
        CONCAT(staffs4.first_name, ' ', staffs4.last_name) AS job_created_by,
        DATE_FORMAT(jobs.created_at, '%d/%m/%Y') AS created_at,
        master_status.name AS status,
        ${jobCodeExpr} AS job_code_id
      FROM jobs
      LEFT JOIN customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN services ON jobs.service_id = services.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      LEFT JOIN staffs AS staffs2 ON jobs.reviewer = staffs2.id
      LEFT JOIN staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
      LEFT JOIN staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
      LEFT JOIN master_status ON master_status.id = jobs.status_type
      WHERE customers.id IN (${idsStr})
      ${filterCondition}
      ${searchCondition}
      ORDER BY job_code_id ASC
      LIMIT ? OFFSET ?;
    `;

    const [result] = await pool.execute(query, [
      ...searchParams,
      limit,
      offset,
    ]);

    let finalResult = result;
    if (result.length > 0) {
      finalResult = await Promise.all(
        result.map(async (element) => {
          const Get_account_manger_id = `
            SELECT s.id,
                   CONCAT(s.first_name, ' ', s.last_name) AS full_name,
                   s.employee_number
            FROM staffs s
            JOIN customer_service_account_managers csam 
              ON s.id = csam.account_manager_id
            JOIN customer_services cs 
              ON csam.customer_service_id = cs.id
            WHERE cs.customer_id = ?
            AND cs.service_id = ?
            AND s.id != ?
          `;

          const [rowsAccountManager] = await pool.execute(
            Get_account_manger_id,
            [
              element.customer_id || 0,
              element.job_service_id || 0,
              element.account_manager_id || 0,
            ],
          );

          return {
            ...element,
            account_managers: rowsAccountManager,
          };
        }),
      );
    }

    return {
      status: true,
      message: "success.",
      data: finalResult,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        search,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: "Err Customer Dashboard Job View Get",
      error: error.message,
    };
  }
};

const getCustomerCountLinkData = async (dashboard) => {
  const { key } = dashboard;
  if (key === "client") {
    return getByCustomerClient(dashboard);
  } else if (key === "job" || key === "pending_job" || key === "completed_job") {
    return getByCustomerJob(dashboard);
  } else if (key === "customer") {
    const res = await getCustomerList(dashboard);
    if (res.status) {
      return {
        status: true,
        message: res.message,
        data: res.data.data,
        pagination: {
          total: res.data.pagination.totalItems,
          page: res.data.pagination.currentPage,
          limit: res.data.pagination.limit,
          totalPages: res.data.pagination.totalPages
        }
      };
    }
    return res;
  } else {
    return { status: false, message: "Error getting customer dashboard data." };
  }
};

const getCustomerDropdown = async (dashboard) => {
  try {
    const { staff_id, StaffUserId, action } = dashboard;
    const effectiveStaffId = staff_id || StaffUserId;

    if (action === "get") {
      const access = await getStaffAccessFilters(effectiveStaffId);
      const assignedIds = access.assignedCustomerIds;
      if (assignedIds.length === 0) return { status: true, message: "Success..", data: [] };
      
      const query = `
          SELECT 
            id, 
            status, 
            form_process, 
            trading_name, 
            CONCAT('cust_', SUBSTRING(trading_name,1,3),'_',SUBSTRING(customer_code,1,15)) AS customer_code
          FROM customers 
          WHERE id IN (${assignedIds.join(',')}) AND status = '1' AND form_process = '4'
          ORDER BY trading_name ASC
      `;
      const [rows] = await pool.execute(query);

      return {
        status: true,
        message: "Success..",
        data: rows
      };
    }

    return { status: false, message: "Invalid action." };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const getCustomerList = async (dashboard) => {
  try {
    let { staff_id, StaffUserId, page, limit, search, action, customer_id, date_filter, ids } = dashboard;

    // Support both staff_id and StaffUserId
    const effectiveStaffId = staff_id || StaffUserId;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const access = await getStaffAccessFilters(effectiveStaffId);
    const assignedIds = access.assignedCustomerIds;

    let filterCondition = "";

    if (ids) {
      const clean_ids = ids.replace(/^,+|,+$/g, "");
      if (clean_ids) {
        filterCondition = `AND customers.id IN (${clean_ids})`;
      }
    } else if (customer_id) {
      filterCondition = `AND customers.id = ${pool.escape(customer_id)}`;
      if (date_filter) {
        let { startDate, endDate } = await getDateRange(date_filter);
        filterCondition += ` AND DATE(customers.created_at) BETWEEN ${pool.escape(startDate)} AND ${pool.escape(endDate)}`;
      }
    } else if (date_filter) {
      let { startDate, endDate } = await getDateRange(date_filter);
      filterCondition = `AND DATE(customers.created_at) BETWEEN ${pool.escape(startDate)} AND ${pool.escape(endDate)}`;
    }

    if (assignedIds.length === 0) {
      return {
        status: true,
        message: "success.",
        data: {
          data: [],
          pagination: { totalItems: 0, totalPages: 0, currentPage: page, limit }
        }
      };
    }
    const idsStr = assignedIds.join(',');

    let searchCondition = "";
    let searchParams = [];
    if (search) {
      searchCondition = `
        AND (
          customers.trading_name LIKE ?
          OR CONCAT(staff2.first_name, ' ', staff2.last_name) LIKE ?
          OR staffs.employee_number LIKE ?
          OR CONCAT(staffs.first_name, ' ', staffs.last_name) LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [likeSearch, likeSearch, likeSearch, likeSearch];
    }

    const [countResult] = await pool.execute(
      `SELECT COUNT(DISTINCT customers.id) AS total 
       FROM customers 
       LEFT JOIN staffs ON customers.staff_id = staffs.id
       LEFT JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
       WHERE customers.id IN (${idsStr}) ${filterCondition} ${searchCondition}`,
      [...searchParams]
    );
    const total = countResult[0].total;

    const query = `
      SELECT 
        customers.id,
        customers.customer_type,
        customers.staff_id,
        CONCAT(staffs.first_name,' ',staffs.last_name) AS customer_created_by,
        customers.account_manager_id,
        customers.trading_name,
        customers.trading_address,
        customers.vat_registered,
        customers.vat_number,
        customers.status,
        customers.form_process,
        DATE_FORMAT(customers.created_at, '%d/%m/%Y') AS created_at,
        staff2.first_name AS account_manager_firstname,
        staff2.last_name AS account_manager_lastname,
        staffs.employee_number AS creator_employee_number,
        CONCAT('cust_', SUBSTRING(customers.trading_name,1,3),'_',SUBSTRING(customers.customer_code,1,15)) AS customer_code
      FROM customers
      LEFT JOIN staffs ON customers.staff_id = staffs.id
      LEFT JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
      WHERE customers.id IN (${idsStr}) ${filterCondition} ${searchCondition}
      ORDER BY customers.id DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(query, [...searchParams, limit, offset]);

    return {
      status: true,
      message: "Success..",
      data: {
        data: rows,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit
        }
      }
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const getCustomerClientList = async (dashboard) => {
  try {
    let { staff_id, StaffUserId, customer_id, client_id, page, limit, search, action } = dashboard;

    // Support both staff_id and StaffUserId
    const effectiveStaffId = staff_id || StaffUserId;

    const clientCodeExpr = `
      CONCAT(
        'cli_',
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(clients.client_code, 1, 15)
      )
    `;

    if (action === "getByid" && client_id) {
      const query = `
        SELECT 
          clients.*, 
          client_types.type AS client_type_name,
          ${clientCodeExpr} AS client_code
        FROM clients 
        LEFT JOIN client_types ON clients.client_type = client_types.id
        LEFT JOIN customers ON clients.customer_id = customers.id
        WHERE clients.id = ?`;
      const [clientRows] = await pool.execute(query, [client_id]);

      if (clientRows.length === 0) return { status: false, message: "Client not found." };

      const [contactDetails] = await pool.execute(`SELECT * FROM client_contact_details WHERE client_id = ?`, [client_id]);
      const [companyDetails] = await pool.execute(`SELECT * FROM client_company_information WHERE client_id = ?`, [client_id]);
      const [clientDocuments] = await pool.execute(`SELECT * FROM client_documents WHERE client_id = ?`, [client_id]);

      return {
        status: true,
        message: "success.",
        data: {
          client: clientRows[0],
          contact_details: contactDetails,
          company_details: companyDetails[0] || {},
          client_documents: clientDocuments || []
        }
      };
    }

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const access = await getStaffAccessFilters(effectiveStaffId);
    const assignedIds = access.assignedCustomerIds;
    
    if (customer_id && customer_id !== "") {
      assignedCondition = `AND customers.id = ${customer_id} AND clients.${access.clientCondition}`;
    } else {
      if (assignedIds.length === 0) return { status: true, message: "No assigned customers.", data: [], pagination: { total: 0 } };
      assignedCondition = `AND customers.id IN (${assignedIds.join(',')}) AND clients.${access.clientCondition}`;
    }

    let searchCondition = "";
    let searchParams = [];
    if (search) {
      searchCondition = `
        AND (
          clients.trading_name LIKE ? 
          OR clients.client_code LIKE ?
          OR ${clientCodeExpr} LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [likeSearch, likeSearch, likeSearch];
    }

    const [countResult] = await pool.execute(
      `SELECT COUNT(clients.id) AS total FROM clients 
       JOIN customers ON clients.customer_id = customers.id
       WHERE 1=1 ${assignedCondition} ${searchCondition}`,
      [...searchParams]
    );
    const total = countResult[0].total;

    const query = `
      SELECT 
        clients.id, 
        clients.trading_name AS client_name, 
        customers.trading_name AS customer_name,
        clients.status AS status,
        client_types.type AS client_type_name,
        jobs.id AS Delete_Status,
        CONCAT(staffs.first_name,' ',staffs.last_name) AS client_created_by,
        DATE_FORMAT(clients.created_at, '%d/%m/%Y') AS created_at,
        ${clientCodeExpr} AS client_code
      FROM clients
      JOIN customers ON clients.customer_id = customers.id
      LEFT JOIN client_types ON clients.client_type = client_types.id
      LEFT JOIN staffs ON clients.staff_created_id = staffs.id
      LEFT JOIN jobs ON clients.id = jobs.client_id
      WHERE 1=1 ${assignedCondition} ${searchCondition}
      GROUP BY clients.id
      ORDER BY clients.trading_name ASC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(query, [...searchParams, limit, offset]);

    return {
      status: true,
      message: "success",
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        search,
      },
      data: rows,
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const getCustomerJobList = async (dashboard) => {
  try {
    let { staff_id, StaffUserId, customer_id, client_id, page, limit, search, action } = dashboard;

    // Support both staff_id and StaffUserId
    const effectiveStaffId = staff_id || StaffUserId;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const jobCodeExpr = `
      CONCAT(
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(job_types.type, 1, 4), '_',
        SUBSTRING(jobs.job_id, 1, 15)
      )
    `;

    const access = await getStaffAccessFilters(effectiveStaffId);
    const assignedIds = access.assignedCustomerIds;

    if (action === "getByClient" && client_id) {
      assignedCondition = `AND jobs.client_id = ${client_id} AND jobs.${access.jobCondition}`;
    } else if (action === "getByCustomer" && customer_id) {
      assignedCondition = `AND jobs.customer_id = ${customer_id} AND jobs.${access.jobCondition}`;
    } else {
      if (assignedIds.length === 0) return { status: true, message: "No assigned jobs.", data: [], pagination: { total: 0 } };
      assignedCondition = `AND jobs.customer_id IN (${assignedIds.join(',')}) AND jobs.${access.jobCondition}`;
    }

    let searchCondition = "";
    let searchParams = [];
    if (search) {
      searchCondition = `
        AND (
          customers.trading_name LIKE ?
          OR clients.trading_name LIKE ?
          OR job_types.type LIKE ?
          OR jobs.job_id LIKE ?
          OR ${jobCodeExpr} LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [likeSearch, likeSearch, likeSearch, likeSearch, likeSearch];
    }

    const [countResult] = await pool.execute(
      `SELECT COUNT(DISTINCT jobs.id) AS total FROM jobs 
       JOIN customers ON jobs.customer_id = customers.id
       JOIN clients ON jobs.client_id = clients.id
       LEFT JOIN job_types ON jobs.job_type_id = job_types.id
       WHERE 1=1 ${assignedCondition} ${searchCondition}`,
      [...searchParams]
    );
    const total = countResult[0].total;

    const query = `
      SELECT 
        customers.trading_name AS customers_trading_name,
        clients.trading_name AS client_trading_name,
        job_types.type AS job_type_name,
        jobs.job_id AS jobs_job_id,
        ${jobCodeExpr} AS job_code_id,
        jobs.id AS job_id,
        timesheet.job_id AS timesheet_job_id,
        jobs.status_type AS status_type,
        jobs.job_priority AS job_priority,
        customer_contact_details.id AS account_manager_officer_id,
        customer_contact_details.first_name AS account_manager_officer_first_name,
        customer_contact_details.last_name AS account_manager_officer_last_name,
        jobs.client_job_code AS client_job_code,
        jobs.invoiced AS invoiced,
        jobs.total_hours AS total_hours,
        jobs.total_hours_status AS total_hours_status,
        DATE_FORMAT(jobs.date_received_on, '%Y-%m-%d') AS date_received_on,

        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,
        staffs3.employee_number AS account_manager_employee_number,

        master_status.name AS status,
        CONCAT(staffs4.first_name, ' ', staffs4.last_name) AS job_created_by,
        DATE_FORMAT(jobs.created_at, '%d/%m/%Y') AS created_at,
        DATE_FORMAT(jobs.updated_at, '%d/%m/%Y') AS updated_at,
        CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM client_job_task 
                WHERE client_job_task.job_id = jobs.id
            ) THEN true 
            ELSE false 
        END AS has_client_job_task 
      FROM jobs
      JOIN staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
      LEFT JOIN customers ON jobs.customer_id = customers.id
      LEFT JOIN clients ON jobs.client_id = clients.id
      LEFT JOIN job_types ON jobs.job_type_id = job_types.id
      LEFT JOIN master_status ON jobs.status_type = master_status.id
      LEFT JOIN customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
      LEFT JOIN staffs ON jobs.allocated_to = staffs.id
      LEFT JOIN staffs AS staffs2 ON jobs.reviewer = staffs2.id
      LEFT JOIN staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
      LEFT JOIN timesheet ON timesheet.job_id = jobs.id AND timesheet.task_type = '2'
      WHERE 1=1 ${assignedCondition} ${searchCondition}
      GROUP BY jobs.id
      ORDER BY job_code_id ASC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(query, [...searchParams, limit, offset]);

    // Sort keys of each row alphabetically
    const sortedRows = rows.map(row => {
      const sortedRow = {};
      Object.keys(row).sort().forEach(key => {
        sortedRow[key] = row[key];
      });
      return sortedRow;
    });

    return {
      status: true,
      message: "Success.",
      data: sortedRows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit), search }
    };
  } catch (error) {
    console.error("getCustomerJobList error:", error);
    return { status: false, message: error.message };
  }
};

const customerClientAction = async (dashboard) => {
  const { action, id, client_id, StaffUserId, ip } = dashboard;
  const effectiveClientId = id || client_id;

  if (action === "delete") {
    if (parseInt(effectiveClientId) > 0) {
      const currentDate = new Date();
      await CustomerLogUpdateOperation({
        staff_id: StaffUserId,
        ip: ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "client",
        log_message: `deleted client profile. client code:`,
        permission_type: "deleted",
        module_id: effectiveClientId,
      });
    }

    try {
      await pool.execute("DELETE FROM clients WHERE id = ?", [effectiveClientId]);
      await pool.execute("DELETE FROM client_company_information WHERE client_id = ?", [effectiveClientId]);
      await pool.execute("DELETE FROM client_contact_details WHERE client_id = ?", [effectiveClientId]);
      await pool.execute("DELETE FROM client_documents WHERE client_id = ?", [effectiveClientId]);
      return { status: true, message: "Client deleted successfully." };
    } catch (err) {
      return { status: false, message: "Error deleting client." };
    }
  }

  if (action === "addClientDocument") {
    const { uploadedFiles } = dashboard;
    try {
      if (uploadedFiles && uploadedFiles.length > 0) {
        for (let file of uploadedFiles) {
          const file_name = file.filename;
          const original_name = file.originalname;
          const file_type = file.mimetype;
          const file_size = file.size;
          const web_url = file.web_url;

          const checkQuery = `SELECT id FROM client_documents WHERE client_id = ? AND original_name = ?`;
          const [rows] = await pool.execute(checkQuery, [effectiveClientId, original_name]);
          if (rows.length > 0) continue;

          const insertQuery = `
                INSERT INTO client_documents (
                    client_id, file_name, original_name, file_type, file_size , web_url
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;
          await pool.execute(insertQuery, [effectiveClientId, file_name, original_name, file_type, file_size, web_url]);
        }
        // Log document upload
        await CustomerLogUpdateOperation({
          staff_id: StaffUserId,
          ip: dashboard.ip,
          date: new Date().toISOString().split("T")[0],
          module_name: "client",
          log_message: `uploaded ${uploadedFiles.length} document(s) to client profile. client code:`,
          permission_type: "updated",
          module_id: effectiveClientId,
        });

        return { status: true, message: "Client document uploaded successfully.", data: effectiveClientId };
      }
      return { status: true, message: "No files uploaded.", data: effectiveClientId };
    } catch (error) {
      return { status: false, message: "Error uploading document." };
    }
  }

  if (action === "deleteClientFile") {
    const { doc_id } = dashboard;
    try {
      await pool.execute("DELETE FROM client_documents WHERE id = ?", [doc_id]);
      return { status: true, message: "File deleted successfully." };
    } catch (err) {
      return { status: false, message: "Error deleting file." };
    }
  }

  if (action === "getByid") {
    try {
      const [ExistClient] = await pool.execute(
        "SELECT client_type, customer_id FROM `clients` WHERE id = ?", [effectiveClientId]
      );

      if (!ExistClient || ExistClient.length === 0) {
        return { status: false, message: "No client found with the given ID." };
      }

      const client_type = ExistClient[0].client_type;
      const customer_id = ExistClient[0].customer_id;

      // Robust check for all client types matching Admin logic
      let query = "";
      let query2 = "";

      const commonSelect = `
        clients.id AS client_id, 
        clients.client_type AS client_type, 
        clients.customer_id AS customer_id, 
        clients.client_industry_id AS client_industry_id, 
        clients.trading_name AS trading_name, 
        CONCAT(
          'cli_', 
          SUBSTRING(customers.trading_name, 1, 3), '_',
          SUBSTRING(clients.trading_name, 1, 3), '_',
          SUBSTRING(clients.client_code, 1, 15)
        ) AS client_code, 
        clients.trading_address AS trading_address, 
        clients.vat_registered AS vat_registered, 
        clients.vat_number AS vat_number, 
        clients.website AS website, 
        clients.notes AS notes, 
        clients.status AS status, 
        clients.service_address,
        clients.charity_commission_number,
        clients.company_number
      `;

      if (client_type == "1" || client_type == "3" || client_type == "4" || client_type == "6") {
        query = `
          SELECT ${commonSelect},
          ccd.id AS contact_id, ccd.first_name, ccd.last_name, ccd.email, ccd.phone_code, ccd.phone, ccd.residential_address,
          ccd.alternate_email, ccd.alternate_phone_code, ccd.alternate_phone, ccd.authorised_signatory_status,
          msr.name AS customer_role_contact_name, msr.id AS customer_role_contact_id
          FROM clients
          JOIN customers ON customers.id = clients.customer_id
          LEFT JOIN client_contact_details ccd ON clients.id = ccd.client_id
          LEFT JOIN customer_contact_person_role msr ON msr.id = ccd.role
          WHERE clients.id = ?
        `;
      } else if (client_type == "2") {
        query = `
          SELECT ${commonSelect},
          cci.company_name, cci.entity_type, cci.company_status, cci.company_number AS cci_company_number, 
          cci.registered_office_address, DATE_FORMAT(cci.incorporation_date, '%Y-%m-%d') AS incorporation_date, cci.incorporation_in,
          ccd.id AS contact_id, ccd.first_name, ccd.last_name, ccd.email, ccd.phone_code, ccd.phone, ccd.residential_address,
          msr.name AS customer_role_contact_name, msr.id AS customer_role_contact_id
          FROM clients
          JOIN customers ON customers.id = clients.customer_id
          LEFT JOIN client_company_information cci ON clients.id = cci.client_id
          LEFT JOIN client_contact_details ccd ON clients.id = ccd.client_id
          LEFT JOIN customer_contact_person_role msr ON msr.id = ccd.role
          WHERE clients.id = ?
        `;
      } else if (client_type == "5" || client_type == "7") {
        query = `
          SELECT ${commonSelect},
          ccd.id AS contact_id, ccd.first_name, ccd.last_name, ccd.email, ccd.phone_code, ccd.phone, ccd.residential_address,
          ccd.alternate_email, ccd.alternate_phone_code, ccd.alternate_phone, ccd.authorised_signatory_status,
          msr.name AS customer_role_contact_name, msr.id AS customer_role_contact_id
          FROM clients
          JOIN customers ON customers.id = clients.customer_id
          LEFT JOIN client_contact_details ccd ON clients.id = ccd.client_id
          LEFT JOIN customer_contact_person_role msr ON msr.id = ccd.role
          WHERE clients.id = ?
        `;
        query2 = `
          SELECT ctcd.*, msr.name AS customer_role_contact_name, msr.id AS customer_role_contact_id
          FROM client_trustee_contact_details ctcd
          LEFT JOIN customer_contact_person_role msr ON msr.id = ctcd.role
          WHERE ctcd.client_id = ?
        `;
      }

      const [rows] = await pool.execute(query, [effectiveClientId]);
      const [docs] = await pool.execute(
        "SELECT id AS client_documents_id, file_name, original_name, file_type, file_size, web_url FROM client_documents WHERE client_id = ?",
        [effectiveClientId]
      );

      if (rows.length > 0) {
        const clientData = {
          id: rows[0].client_id,
          client_type: rows[0].client_type,
          customer_id: rows[0].customer_id,
          client_industry_id: rows[0].client_industry_id,
          trading_name: rows[0].trading_name,
          client_code: rows[0].client_code,
          full_client_code: rows[0].full_client_code,
          trading_address: rows[0].trading_address,
          vat_registered: rows[0].vat_registered,
          vat_number: rows[0].vat_number,
          website: rows[0].website,
          notes: rows[0].notes,
          status: rows[0].status,
          service_address: rows[0].service_address,
          charity_commission_number: rows[0].charity_commission_number,
          company_number: rows[0].company_number,
        };

        const contactDetails = [];
        const seenContacts = new Set();
        rows.forEach(row => {
          if (row.contact_id && !seenContacts.has(row.contact_id)) {
            contactDetails.push({
              contact_id: row.contact_id,
              customer_contact_person_role_id: row.customer_role_contact_id,
              customer_contact_person_role_name: row.customer_role_contact_name,
              first_name: row.first_name,
              last_name: row.last_name,
              email: row.email,
              phone_code: row.phone_code,
              phone: row.phone,
              residential_address: row.residential_address,
              alternate_email: row.alternate_email,
              alternate_phone_code: row.alternate_phone_code,
              alternate_phone: row.alternate_phone,
              authorised_signatory_status: row.authorised_signatory_status == "1",
            });
            seenContacts.add(row.contact_id);
          }
        });

        let result = {
          client: clientData,
          client_documents: docs,
        };

        if (client_type == "2") {
          result.company_details = {
            company_name: rows[0].company_name,
            entity_type: rows[0].entity_type,
            company_status: rows[0].company_status,
            company_number: rows[0].cci_company_number,
            registered_office_address: rows[0].registered_office_address,
            incorporation_date: rows[0].incorporation_date,
            incorporation_in: rows[0].incorporation_in,
          };
          result.contact_details = contactDetails;
        } else if (client_type == "5" || client_type == "7") {
          const [rows2] = await pool.execute(query2, [effectiveClientId]);
          const trusteeDetails = rows2.map(row => ({
            contact_id: row.id,
            customer_contact_person_role_id: row.customer_role_contact_id,
            customer_contact_person_role_name: row.customer_role_contact_name,
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            phone_code: row.phone_code,
            phone: row.phone,
            authorised_signatory_status: row.authorised_signatory_status == "1",
          }));

          if (client_type == "5") {
            const [charityData] = await pool.execute(`SELECT * FROM client_charity_information WHERE client_id = ?`, [effectiveClientId]);
            result.charity_details = charityData;
            result.member_details = contactDetails;
            result.trustee_details = trusteeDetails;
          } else {
            const [trustData] = await pool.execute(`SELECT * FROM client_trust_information WHERE client_id = ?`, [effectiveClientId]);
            result.trust_details = trustData;
            result.beneficiaries_details = contactDetails;
            result.trustee_details = trusteeDetails;
          }
        } else if (client_type == "6") {
          const [charityData] = await pool.execute(`SELECT * FROM client_charity_information WHERE client_id = ?`, [effectiveClientId]);
          result.charity_details = charityData;
          result.member_details = contactDetails;
        } else {
          result.contact_details = contactDetails;
        }

        return { status: true, message: "success.", data: result };
      } else {
        return { status: false, message: "No client found." };
      }
    } catch (err) {
      console.error("getByid error:", err);
      return { status: false, message: "Error fetching client details." };
    }
  }

  return { status: false, message: "Invalid action." };
};

const customerJobAction = async (dashboard) => {
  const { action, job_id, StaffUserId, ip, field, row } = dashboard;

  if (action === "delete") {
    try {
      if (parseInt(job_id) > 0) {
        const currentDate = new Date();
        await CustomerLogUpdateOperation({
          staff_id: StaffUserId,
          ip: ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "job",
          log_message: `deleted job code:`,
          permission_type: "deleted",
          module_id: job_id,
        });
      }
      const [result] = await pool.execute("DELETE FROM jobs WHERE id = ?", [job_id]);
      await pool.execute("DELETE FROM client_job_task WHERE job_id = ?", [job_id]);
      await pool.execute("DELETE FROM drafts WHERE job_id = ?", [job_id]);
      await pool.execute("DELETE FROM missing_logs WHERE job_id = ?", [job_id]);
      await pool.execute("DELETE FROM queries WHERE job_id = ?", [job_id]);
      if (result.affectedRows > 0) {
        return { status: true, message: "Job deleted successfully.", data: job_id };
      } else {
        return { status: false, message: "No job found with the given job_id." };
      }
    } catch (err) {
      return { status: false, message: "Error deleting job." };
    }
  }

  if (action === "getByJobId") {
    try {
      const query = `
        SELECT 
          jobs.*,
          DATE_FORMAT(jobs.allocated_on, '%Y-%m-%d') AS allocated_on,
          DATE_FORMAT(jobs.date_received_on, '%Y-%m-%d') AS date_received_on,
          DATE_FORMAT(jobs.expected_delivery_date, '%Y-%m-%d') AS expected_delivery_date,
          DATE_FORMAT(jobs.expected_delivery_date_old, '%Y-%m-%d') AS expected_delivery_date_old,
          DATE_FORMAT(jobs.due_on, '%Y-%m-%d') AS due_on,
          DATE_FORMAT(jobs.submission_deadline, '%Y-%m-%d') AS submission_deadline,
          DATE_FORMAT(jobs.customer_deadline_date, '%Y-%m-%d') AS customer_deadline_date,
          DATE_FORMAT(jobs.sla_deadline_date, '%Y-%m-%d') AS sla_deadline_date,
          DATE_FORMAT(jobs.internal_deadline_date, '%Y-%m-%d') AS internal_deadline_date,
          DATE_FORMAT(jobs.filing_Companies_date, '%Y-%m-%d') AS filing_Companies_date,
          DATE_FORMAT(jobs.filing_hmrc_date, '%Y-%m-%d') AS filing_hmrc_date,
          DATE_FORMAT(jobs.opening_balance_date, '%Y-%m-%d') AS opening_balance_date,
          DATE_FORMAT(jobs.invoice_date, '%Y-%m-%d') AS invoice_date,
          customers.trading_name AS customer_trading_name,
          clients.trading_name AS client_trading_name,
          clients.client_type,
          client_company_information.company_number AS client_company_number,
          job_types.type AS job_type_name,
          timesheet.job_id AS timesheet_job_id,
          master_status.name AS status_name,
          staffs1.first_name AS allocated_first_name,
          staffs1.last_name AS allocated_last_name,
          staffs2.first_name AS reviewer_first_name,
          staffs2.last_name AS reviewer_last_name,
          staffs3.first_name AS outbooks_acount_manager_first_name,
          staffs3.last_name AS outbooks_acount_manager_last_name,
          staffs3.employee_number AS account_manager_employee_number,
          customer_contact_details.id AS account_manager_officer_id,
          customer_contact_details.first_name AS account_manager_officer_first_name,
          customer_contact_details.last_name AS account_manager_officer_last_name
        FROM jobs
        LEFT JOIN customers ON jobs.customer_id = customers.id
        LEFT JOIN clients ON jobs.client_id = clients.id
        LEFT JOIN client_company_information ON client_company_information.client_id = clients.id
        LEFT JOIN job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN timesheet ON timesheet.job_id = jobs.id AND timesheet.task_type = '2'
        LEFT JOIN master_status ON jobs.status_type = master_status.id
        LEFT JOIN staffs staffs1 ON jobs.allocated_to = staffs1.id
        LEFT JOIN staffs staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN staffs staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        WHERE jobs.id = ?
      `;
      const [rows] = await pool.execute(query, [job_id]);

      if (rows.length > 0) {
        const jobData = rows[0];

        // Get tasks
        const [tasks] = await pool.execute(`
          SELECT 
            client_job_task.*,
            task.name AS task_name
          FROM client_job_task
          LEFT JOIN task ON client_job_task.task_id = task.id
          WHERE client_job_task.job_id = ?
        `, [job_id]);

        // Get allowed staff
        const [staff] = await pool.execute("SELECT staff_id FROM job_allowed_staffs WHERE job_id = ?", [job_id]);

        // Get status history
        const [history] = await pool.execute(`
          SELECT jsu.*, ms.name AS status_name 
          FROM job_status_updation jsu
          LEFT JOIN master_status ms ON jsu.status_type = ms.id
          WHERE jsu.job_id = ? ORDER BY jsu.id ASC
        `, [job_id]);

        return {
          status: true,
          data: {
            ...jobData,
            tasks: {
              task: tasks,
              checklist_id: jobData.processing_checklist || 0
            },
            selectedStaffData: staff.map(s => s.staff_id),
            status_history: history
          }
        };
      }
      return { status: false, message: "Job not found." };
    } catch (err) {
      return { status: false, message: "Error fetching job details." };
    }
  }

  if (action === "copy_job") {
    try {
      const id = row.job_id;
      const [[data]] = await pool.execute(`SELECT * FROM jobs WHERE id = ?`, [id]);
      if (!data) return { status: false, message: "Job not found" };

      const [[clientInfo]] = await pool.execute(`
        SELECT clients.client_type, client_company_information.company_number
        FROM jobs
        JOIN clients ON jobs.client_id = clients.id
        LEFT JOIN client_company_information ON client_company_information.client_id = clients.id
        WHERE jobs.id = ?
      `, [id]);

      delete data.id;
      const nextJobId = await generateNextUniqueCode({ table: "jobs", field: "job_id" });

      data.created_at = new Date();
      data.updated_at = new Date();
      data.date_received_on = new Date();
      data.allocated_on = new Date();
      data.status_type = 1;
      data.job_id = nextJobId;
      data.status_updation_date = new Date();
      data.filing_Companies_required = "0";
      data.filing_Companies_date = null;
      data.filing_hmrc_required = "0";
      data.filing_hmrc_date = null;
      data.opening_balance_required = "0";
      data.opening_balance_date = null;

      let Year_Ending_id_1 = null;
      let due_on = null;
      if ([2, 5].includes(Number(clientInfo?.client_type)) && Number(data?.service_id) == 1) {
        const compayDetails = await getCompanyOfficerDetailsFun(clientInfo?.company_number);
        if (compayDetails.status) {
          Year_Ending_id_1 = compayDetails?.data?.accounts?.next_accounts?.period_end_on;
          due_on = compayDetails?.data?.accounts?.next_accounts?.due_on;
        }
      } else {
        due_on = await getDueDate(clientInfo?.client_type, data?.service_id);
      }

      data.Year_Ending_id_1 = Year_Ending_id_1;
      data.due_on = due_on;
      data.sla_deadline_date = await getSLADeadline(data?.service_id, data?.Bookkeeping_Frequency_id_2);

      if (field == false) {
        data.reviewer = null;
        data.allocated_to = null;
        data.processing_checklist = null;
        data.reviewing_checklist = null;
        data.processing_checklist_status = "0";
        data.reviewing_checklist_status = "0";
        data.checklist_modal_data = null;
      }

      const columns = Object.keys(data).join(",");
      const values = Object.values(data);
      const placeholders = Object.keys(data).map(() => "?").join(",");

      const [result] = await pool.execute(`INSERT INTO jobs (${columns}) VALUES (${placeholders})`, values);
      const insertId = result.insertId;

      await JobStatusUpdate(insertId, data.status_type, new Date().toLocaleString('sv-SE'));

      const [tasks] = await pool.execute(`SELECT * FROM client_job_task WHERE job_id = ?`, [id]);
      for (const task of tasks) {
        await pool.execute(
          `INSERT INTO client_job_task SET job_id = ?, client_id = ?, task_id = ?, task_status = ?, time = ?`,
          [insertId, task.client_id, task.task_id, task.task_status, task.time]
        );
      }

      const [allocatedStaff] = await pool.execute(`SELECT * FROM job_allowed_staffs WHERE job_id = ?`, [id]);
      for (const staff of allocatedStaff) {
        await pool.execute(`INSERT INTO job_allowed_staffs SET job_id = ?, staff_id = ?`, [insertId, staff.staff_id]);
      }

      // --- ADD DESCRIPTIVE LOGGING START ---
      try {
        const queryJobCode = `
          SELECT 
          CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(job_types.type, 1, 4), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id
          FROM jobs
          JOIN clients ON jobs.client_id = clients.id
          JOIN customers ON clients.customer_id = customers.id
          JOIN job_types ON jobs.job_type_id = job_types.id
          WHERE jobs.id = ?;
        `;
        const [[oldJob]] = await pool.execute(queryJobCode, [id]);
        const [[newJob]] = await pool.execute(queryJobCode, [insertId]);

        await CustomerLogUpdateOperation({
          staff_id: StaffUserId,
          ip: ip,
          date: new Date().toISOString().split("T")[0],
          module_name: "job",
          log_message: `Copied Job Code: From ${oldJob?.job_code_id || 'Unknown'} To `,
          permission_type: "copied",
          module_id: insertId,
        });
      } catch (logErr) {
        console.error("Log error in copy_job:", logErr);
      }
      // --- ADD DESCRIPTIVE LOGGING END ---
      
      // --- GRANT ACCESS TO CREATOR START ---
      const roleData = await QueryRoleHelperFunction(StaffUserId);
      if (roleData.length > 0 && roleData[0].role_id === 12) {
        await grantStaffAccess(StaffUserId, data.customer_id, "job", insertId);
      }
      // --- GRANT ACCESS TO CREATOR END ---

      return { status: true, message: "Job copied successfully.", data: insertId };
    } catch (err) {
      console.error("copy_job error:", err);
      return { status: false, message: err.message };
    }
  }

  return { status: false, message: "Invalid action." };
};

const customerJobUpdate = async (job) => {
  const {
    job_id, account_manager_id, customer_id, client_id, client_job_code, customer_contact_details_id,
    service_id, job_type_id, status_type,
    reviewer, allocated_to, allocated_on, date_received_on, year_end,
    budgeted_hours, total_preparation_time, review_time, feedback_incorporation_time,
    total_time, engagement_model, expected_delivery_date, due_on,
    submission_deadline, customer_deadline_date, sla_deadline_date, internal_deadline_date,
    filing_Companies_required, filing_Companies_date, filing_hmrc_required, filing_hmrc_date,
    opening_balance_required, opening_balance_date, number_of_transaction, number_of_balance_items,
    turnover, number_of_employees, vat_reconciliation, bookkeeping, processing_type,
    invoiced, currency, invoice_value, invoice_date, invoice_hours, invoice_remark,
    notes, tasks, selectedStaffData, StaffUserId, ip,
    processing_checklist, reviewing_checklist, processing_checklist_status, reviewing_checklist_status,
    checklist_modal_data, job_priority,
    field, row: updateRow
  } = job;

  // Handle single field updates (like status change from dropdown)
  if (field && updateRow) {
    try {
      const query = `UPDATE jobs SET ${field} = ? WHERE id = ?`;
      await pool.execute(query, [updateRow[field], job_id]);

      if (field === "status_type") {
        await JobStatusUpdate(job_id, updateRow[field], new Date().toLocaleString('sv-SE'));
        
        try {
          const [StatusName] = await pool.execute(`SELECT name FROM master_status WHERE id = ?`, [updateRow[field]]);
          CustomerLogUpdateOperation({
            staff_id: StaffUserId,
            ip: ip,
            date: new Date().toISOString().split("T")[0],
            module_name: "job",
            log_message: `updated the job status to ${StatusName[0]?.name || ''}. job code:`,
            permission_type: "updated",
            module_id: job_id,
          }).catch(err => console.error("Logging error:", err));
        } catch (e) {}
      }

      return { status: true, message: "Job updated successfully." };
    } catch (err) {
      console.error("customerJobUpdate single field error:", err);
      return { status: false, message: "Error updating job field." };
    }
  }

  // Check Reviewer Checklist Status
  if (reviewer > 0 && Number(job?.reviewing_checklist_status) === 2) {
    return { status: false, message: "Please complete the reviewing checklist first.", data: "W" };
  }

  // Check Processor Checklist Status
  if (allocated_to > 0 && Number(job?.processing_checklist_status) === 2) {
    return { status: false, message: "Please complete the processing checklist first.", data: "W" };
  }

  const ExistJobQuery = `
    SELECT 
      account_manager_id, customer_id, client_id, client_job_code, customer_contact_details_id,
      service_id, job_type_id, budgeted_hours, reviewer, allocated_to,
      DATE_FORMAT(allocated_on, '%Y-%m-%d') AS allocated_on,
      DATE_FORMAT(date_received_on, '%Y-%m-%d') AS date_received_on,
      year_end, total_preparation_time, review_time, feedback_incorporation_time,
      total_time, engagement_model, status_type,
      DATE_FORMAT(expected_delivery_date, '%Y-%m-%d') AS expected_delivery_date,
      DATE_FORMAT(expected_delivery_date_old, '%Y-%m-%d') AS expected_delivery_date_old,
      DATE_FORMAT(due_on, '%Y-%m-%d') AS due_on,
      DATE_FORMAT(submission_deadline, '%Y-%m-%d') AS submission_deadline,
      DATE_FORMAT(customer_deadline_date, '%Y-%m-%d') AS customer_deadline_date,
      DATE_FORMAT(sla_deadline_date, '%Y-%m-%d') AS sla_deadline_date,
      DATE_FORMAT(internal_deadline_date, '%Y-%m-%d') AS internal_deadline_date,
      filing_Companies_required, DATE_FORMAT(filing_Companies_date, '%Y-%m-%d') AS filing_Companies_date,
      filing_hmrc_required, DATE_FORMAT(filing_hmrc_date, '%Y-%m-%d') AS filing_hmrc_date,
      opening_balance_required, DATE_FORMAT(opening_balance_date, '%Y-%m-%d') AS opening_balance_date,
      number_of_transaction, number_of_balance_items, turnover, number_of_employees,
      vat_reconciliation, bookkeeping, processing_type, invoiced, currency, invoice_value,
      DATE_FORMAT(invoice_date, '%Y-%m-%d') AS invoice_date, invoice_hours, invoice_remark, notes
    FROM jobs WHERE id = ?
  `;

  try {
    const [[ExistJob]] = await pool.execute(ExistJobQuery, [job_id]);
    if (!ExistJob) return { status: false, message: "Job not found." };

    let expected_delivery_date_old = ExistJob.expected_delivery_date_old;
    if (expected_delivery_date == null) {
      expected_delivery_date_old = null;
    } else if (expected_delivery_date != null && ExistJob.expected_delivery_date_old == null) {
      expected_delivery_date_old = expected_delivery_date;
    } else if (expected_delivery_date != null && ExistJob.expected_delivery_date_old != null) {
      expected_delivery_date_old = ExistJob.expected_delivery_date;
    }

    let status_type_update = status_type;
    if (status_type == null || status_type == 0 || status_type == 1) {
      if (allocated_to > 0) status_type_update = 3;
    } else {
      if (allocated_to > 0 && ExistJob.allocated_to == 0) status_type_update = 3;
    }

    const query = `
      UPDATE jobs SET 
        account_manager_id = ?, customer_id = ?, client_id = ?, client_job_code = ?, customer_contact_details_id = ?, 
        service_id = ?, job_type_id = ?, budgeted_hours = ?, reviewer = ?, allocated_to = ?, allocated_on = ?, 
        date_received_on = ?, year_end = ?, total_preparation_time = ?, review_time = ?, 
        feedback_incorporation_time = ?, total_time = ?, engagement_model = ?, expected_delivery_date = ?, expected_delivery_date_old = ?, due_on = ?, 
        submission_deadline = ?, customer_deadline_date = ?, sla_deadline_date = ?, internal_deadline_date = ?, 
        filing_Companies_required = ?, filing_Companies_date = ?, filing_hmrc_required = ?, filing_hmrc_date = ?, 
        opening_balance_required = ?, opening_balance_date = ?, number_of_transaction = ?, number_of_balance_items = ?, 
        turnover = ?, number_of_employees = ?, vat_reconciliation = ?, bookkeeping = ?, processing_type = ?, 
        invoiced = ?, currency = ?, invoice_value = ?, invoice_date = ?, invoice_hours = ?, invoice_remark = ?, status_type = ?, notes = ?,
        Turnover_Period_id_0 = ?, Turnover_Currency_id_0 = ?, Turnover_id_0 = ?, VAT_Registered_id_0 = ?, VAT_Frequency_id_0 = ?,
        Who_Did_The_Bookkeeping_id_1 = ?, PAYE_Registered_id_1 = ?, Number_of_Trial_Balance_Items_id_1 = ?, Bookkeeping_Frequency_id_2 = ?,
        Number_of_Total_Transactions_id_2 = ?, Number_of_Bank_Transactions_id_2 = ?, Number_of_Purchase_Invoices_id_2 = ?, Number_of_Sales_Invoices_id_2 = ?,
        Number_of_Petty_Cash_Transactions_id_2 = ?, Number_of_Journal_Entries_id_2 = ?, Number_of_Other_Transactions_id_2 = ?, Transactions_Posting_id_2 = ?,
        Quality_of_Paperwork_id_2 = ?, Number_of_Integration_Software_Platforms_id_2 = ?, CIS_id_2 = ?, Posting_Payroll_Journals_id_2 = ?,
        Department_Tracking_id_2 = ?, Sales_Reconciliation_Required_id_2 = ?, Factoring_Account_id_2 = ?, Payment_Methods_id_2 = ?,
        Payroll_Frequency_id_3 = ?, Type_of_Payslip_id_3 = ?, Percentage_of_Variable_Payslips_id_3 = ?, Is_CIS_Required_id_3 = ?,
        CIS_Frequency_id_3 = ?, Number_of_Sub_contractors_id_3 = ?, Whose_Tax_Return_is_it_id_4 = ?, Number_of_Income_Sources_id_4 = ?,
        If_Landlord_Number_of_Properties_id_4 = ?, If_Sole_Trader_Who_is_doing_Bookkeeping_id_4 = ?, Management_Accounts_Frequency_id_6 = ?,
        Year_Ending_id_1 = ?, Day_Date_id_2 = ?, Week_Year_id_2 = ?, Week_Month_id_2 = ?, Week_id_2 = ?, Fortnight_Year_id_2 = ?,
        Fortnight_Month_id_2 = ?, Fortnight_id_2 = ?, Month_Year_id_2 = ?, Month_id_2 = ?, Quarter_Year_id_2 = ?, Quarter_id_2 = ?,
        Year_id_2 = ?, Other_FromDate_id_2 = ?, Other_ToDate_id_2 = ?, Payroll_Week_Year_id_3 = ?, Payroll_Week_Month_id_3 = ?,
        Payroll_Week_id_3 = ?, Payroll_Fortnight_Year_id_3 = ?, Payroll_Fortnight_Month_id_3 = ?, Payroll_Fortnight_id_3 = ?,
        Payroll_Month_Year_id_3 = ?, Payroll_Month_id_3 = ?, Payroll_Quarter_Year_id_3 = ?, Payroll_Quarter_id_3 = ?,
        Payroll_Year_id_3 = ?, Tax_Year_id_4 = ?, Management_Accounts_FromDate_id_6 = ?, Management_Accounts_ToDate_id_6 = ?,
        Year_id_33 = ?, Period_id_32 = ?, Day_Date_id_32 = ?, Week_Year_id_32 = ?, Week_Month_id_32 = ?, Week_id_32 = ?,
        Fortnight_Year_id_32 = ?, Fortnight_Month_id_32 = ?, Fortnight_id_32 = ?, Month_Year_id_32 = ?, Month_id_32 = ?,
        Quarter_Year_id_32 = ?, Quarter_id_32 = ?, Year_id_32 = ?, Other_FromDate_id_32 = ?, Other_ToDate_id_32 = ?,
        Payroll_Frequency_id_31 = ?, Payroll_Week_Year_id_31 = ?, Payroll_Week_Month_id_31 = ?, Payroll_Week_id_31 = ?,
        Payroll_Fortnight_Year_id_31 = ?, Payroll_Fortnight_Month_id_31 = ?, Payroll_Fortnight_id_31 = ?, Payroll_Month_Year_id_31 = ?,
        Payroll_Month_id_31 = ?, Payroll_Quarter_Year_id_31 = ?, Payroll_Quarter_id_31 = ?, Payroll_Year_id_31 = ?,
        Audit_Year_Ending_id_27 = ?, Filing_Frequency_id_8 = ?, Period_Ending_Date_id_8 = ?, Filing_Date_id_8 = ?,
        Year_id_28 = ?, job_priority = ?, processing_checklist = ?, reviewing_checklist = ?, 
        processing_checklist_status = ?, reviewing_checklist_status = ?, checklist_modal_data = ?
      WHERE id = ?
    `;

    const handleUndefined = (v) => (v === undefined ? null : v);
    const params = [
      account_manager_id, customer_id, client_id, client_job_code, customer_contact_details_id,
      service_id, job_type_id, budgeted_hours, reviewer, allocated_to, allocated_on,
      date_received_on, year_end, total_preparation_time, review_time,
      feedback_incorporation_time, total_time, engagement_model, expected_delivery_date, expected_delivery_date_old, due_on,
      submission_deadline, customer_deadline_date, sla_deadline_date, internal_deadline_date,
      filing_Companies_required, filing_Companies_date, filing_hmrc_required, filing_hmrc_date,
      opening_balance_required, opening_balance_date, number_of_transaction, number_of_balance_items,
      turnover, number_of_employees, vat_reconciliation, bookkeeping, processing_type,
      invoiced, currency, invoice_value, invoice_date, invoice_hours, invoice_remark, status_type_update, notes,
      job.Turnover_Period_id_0, job.Turnover_Currency_id_0, job.Turnover_id_0, job.VAT_Registered_id_0, job.VAT_Frequency_id_0,
      job.Who_Did_The_Bookkeeping_id_1, job.PAYE_Registered_id_1, job.Number_of_Trial_Balance_Items_id_1, job.Bookkeeping_Frequency_id_2,
      job.Number_of_Total_Transactions_id_2, job.Number_of_Bank_Transactions_id_2, job.Number_of_Purchase_Invoices_id_2, job.Number_of_Sales_Invoices_id_2,
      job.Number_of_Petty_Cash_Transactions_id_2, job.Number_of_Journal_Entries_id_2, job.Number_of_Other_Transactions_id_2, job.Transactions_Posting_id_2,
      job.Quality_of_Paperwork_id_2, job.Number_of_Integration_Software_Platforms_id_2, job.CIS_id_2, job.Posting_Payroll_Journals_id_2,
      job.Department_Tracking_id_2, job.Sales_Reconciliation_Required_id_2, job.Factoring_Account_id_2, job.Payment_Methods_id_2,
      job.Payroll_Frequency_id_3, job.Type_of_Payslip_id_3, job.Percentage_of_Variable_Payslips_id_3, job.Is_CIS_Required_id_3,
      job.CIS_Frequency_id_3, job.Number_of_Sub_contractors_id_3, job.Whose_Tax_Return_is_it_id_4, job.Number_of_Income_Sources_id_4,
      job.If_Landlord_Number_of_Properties_id_4, job.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4, job.Management_Accounts_Frequency_id_6,
      job.Year_Ending_id_1, job.Day_Date_id_2, job.Week_Year_id_2, job.Week_Month_id_2, job.Week_id_2, job.Fortnight_Year_id_2,
      job.Fortnight_Month_id_2, job.Fortnight_id_2, job.Month_Year_id_2, job.Month_id_2, job.Quarter_Year_id_2, job.Quarter_id_2,
      job.Year_id_2, job.Other_FromDate_id_2, job.Other_ToDate_id_2, job.Payroll_Week_Year_id_3, job.Payroll_Week_Month_id_3,
      job.Payroll_Week_id_3, job.Payroll_Fortnight_Year_id_3, job.Payroll_Fortnight_Month_id_3, job.Payroll_Fortnight_id_3,
      job.Payroll_Month_Year_id_3, job.Payroll_Month_id_3, job.Payroll_Quarter_Year_id_3, job.Payroll_Quarter_id_3,
      job.Payroll_Year_id_3, job.Tax_Year_id_4, job.Management_Accounts_FromDate_id_6, job.Management_Accounts_ToDate_id_6,
      job.Year_id_33, job.Period_id_32, job.Day_Date_id_32, job.Week_Year_id_32, job.Week_Month_id_32, job.Week_id_32,
      job.Fortnight_Year_id_32, job.Fortnight_Month_id_32, job.Fortnight_id_32, job.Month_Year_id_32, job.Month_id_32,
      job.Quarter_Year_id_32, job.Quarter_id_32, job.Year_id_32, job.Other_FromDate_id_32, job.Other_ToDate_id_32,
      job.Payroll_Frequency_id_31, job.Payroll_Week_Year_id_31, job.Payroll_Week_Month_id_31, job.Payroll_Week_id_31,
      job.Payroll_Fortnight_Year_id_31, job.Payroll_Fortnight_Month_id_31, job.Payroll_Fortnight_id_31, job.Payroll_Month_Year_id_31,
      job.Payroll_Month_id_31, job.Payroll_Quarter_Year_id_31, job.Payroll_Quarter_id_31, job.Payroll_Year_id_31,
      job.Audit_Year_Ending_id_27, job.Filing_Frequency_id_8, job.Period_Ending_Date_id_8, job.Filing_Date_id_8,
      job.Year_id_28, job_priority, processing_checklist, reviewing_checklist,
      processing_checklist_status, reviewing_checklist_status, 
      (checklist_modal_data && typeof checklist_modal_data === 'object') ? JSON.stringify(checklist_modal_data) : (checklist_modal_data || null),
      job_id
    ].map(handleUndefined);

    if (Number(ExistJob.status_type) != Number(status_type_update)) {
      await pool.execute(`UPDATE jobs SET status_updation_date = NOW() WHERE id = ?`, [job_id]);
    }

    const status_update_date = new Date().toLocaleString('sv-SE');
    await JobStatusUpdate(job_id, status_type_update, status_update_date);

    const [result] = await pool.execute(query, params);

    // Staff Assignments
    if (selectedStaffData) {
      await pool.execute("DELETE FROM job_allowed_staffs WHERE job_id = ?", [job_id]);
      for (const staff of selectedStaffData) {
        const sId = (typeof staff === 'object') ? staff.value : staff;
        if (sId) await pool.execute("INSERT INTO job_allowed_staffs (job_id, staff_id) VALUES (?, ?)", [job_id, sId]);
      }
    }

    // Task Reconciliation (from Admin)
    if (tasks && tasks.task && tasks.task.length > 0) {
      if (Number(ExistJob?.job_type_id) != Number(job_type_id)) {
        await pool.execute("DELETE FROM client_job_task WHERE job_id = ? AND client_id = ?", [job_id, client_id]);
      }

      const providedTaskIds = tasks.task.filter(t => t.task_id).map(t => t.task_id);
      const [existingTasks] = await pool.execute("SELECT task_id FROM client_job_task WHERE job_id = ?", [job_id]);
      const existingTaskIds = existingTasks.map(t => t.task_id);
      const tasksToDelete = existingTaskIds.filter(id => !providedTaskIds.includes(id));

      if (tasksToDelete.length > 0) {
        await pool.execute(`DELETE FROM client_job_task WHERE job_id = ? AND client_id = ? AND task_id IN (${tasksToDelete.map(() => "?").join(",")})`, [job_id, client_id, ...tasksToDelete]);
      }

      for (const tsk of tasks.task) {
        let { task_id, task_name, budgeted_hour } = tsk;
        if (!task_id) {
          const [existing] = await pool.execute("SELECT id FROM task WHERE name = ?", [task_name]);
          if (existing.length === 0) {
            const [newTask] = await pool.execute("INSERT INTO task (name, service_id, job_type_id) VALUES (?, ?, ?)", [task_name, service_id, job_type_id]);
            task_id = newTask.insertId;
          } else {
            task_id = existing[0].id;
          }
        }

        const [isExisting] = await pool.execute("SELECT id FROM client_job_task WHERE job_id = ? AND client_id = ? AND task_id = ?", [job_id, client_id, task_id]);
        if (isExisting.length === 0) {
          await pool.execute("INSERT INTO client_job_task (job_id, client_id, task_id, time) VALUES (?, ?, ?, ?)", [job_id, client_id, task_id, budgeted_hour]);
        } else {
          await pool.execute("UPDATE client_job_task SET time = ? WHERE job_id = ? AND client_id = ? AND task_id = ?", [budgeted_hour, job_id, client_id, task_id]);
        }
      }
    }

    // Granular Logging (from Admin)
    if (result.changedRows > 0) {
      let logMsgs = [];
      const userId = StaffUserId || job.staffCreatedId || 0;
      const userIp = ip || "";

      if (
        ExistJob.account_manager_id != account_manager_id ||
        ExistJob.customer_id != customer_id ||
        ExistJob.client_id != client_id ||
        ExistJob.client_job_code != client_job_code ||
        ExistJob.customer_contact_details_id != customer_contact_details_id ||
        ExistJob.service_id != service_id ||
        Number(ExistJob.job_type_id) != Number(job_type_id) ||
        ExistJob.budgeted_hours.split(":").slice(0, 2).join(":") != budgeted_hours ||
        ExistJob.engagement_model != engagement_model
      ) {
        logMsgs.push("edited the job information");
      }

      if (
        ExistJob.expected_delivery_date != expected_delivery_date ||
        ExistJob.due_on != due_on ||
        ExistJob.submission_deadline != submission_deadline ||
        ExistJob.customer_deadline_date != customer_deadline_date ||
        ExistJob.sla_deadline_date != sla_deadline_date ||
        ExistJob.internal_deadline_date != internal_deadline_date
      ) {
        logMsgs.push("edited the job deadline");
      }

      if (
        ExistJob.filing_Companies_required != filing_Companies_required ||
        ExistJob.filing_Companies_date != filing_Companies_date ||
        ExistJob.filing_hmrc_required != filing_hmrc_required ||
        ExistJob.filing_hmrc_date != filing_hmrc_date ||
        ExistJob.opening_balance_required != opening_balance_required ||
        ExistJob.opening_balance_date != opening_balance_date
      ) {
        logMsgs.push("edited the job other tasks");
      }

      if (
        Number(ExistJob.number_of_transaction) != number_of_transaction ||
        ExistJob.number_of_balance_items != number_of_balance_items ||
        Number(ExistJob.turnover) != turnover ||
        ExistJob.number_of_employees != number_of_employees ||
        ExistJob.vat_reconciliation != vat_reconciliation ||
        ExistJob.bookkeeping != bookkeeping ||
        ExistJob.processing_type != processing_type
      ) {
        logMsgs.push("edited the job other data");
      }

      if (
        ExistJob.invoiced != invoiced ||
        ExistJob.currency != currency ||
        ExistJob.invoice_value != invoice_value ||
        ExistJob.invoice_date != invoice_date ||
        ExistJob.invoice_hours.split(":").slice(0, 2).join(":") != invoice_hours ||
        ExistJob.invoice_remark != invoice_remark
      ) {
        logMsgs.push("edited the job invoice data");
      }

      // Reviewer/Processor Assignment logs
      if (parseInt(ExistJob.reviewer) == 0) {
        if (reviewer > 0) {
          const [[getStaff]] = await pool.execute('SELECT CONCAT(first_name," ",last_name) AS name FROM staffs WHERE id = ?', [reviewer]);
          logMsgs.push("has assigned the job to the reviewer, " + (getStaff?.name || "Unknown"));
        }
      } else {
        if (reviewer == 0) {
          logMsgs.push("has removed the reviewer from the job");
        } else if (reviewer != ExistJob.reviewer) {
          const [[getStaff]] = await pool.execute('SELECT CONCAT(first_name," ",last_name) AS name FROM staffs WHERE id = ?', [reviewer]);
          logMsgs.push("changed the job to the reviewer, " + (getStaff?.name || "Unknown"));
        }
      }

      if (parseInt(ExistJob.allocated_to) == 0) {
        if (allocated_to > 0) {
          const [[getStaff]] = await pool.execute('SELECT CONCAT(first_name," ",last_name) AS name FROM staffs WHERE id = ?', [allocated_to]);
          logMsgs.push("has assigned the job to the processor, " + (getStaff?.name || "Unknown"));
        }
      } else {
        if (allocated_to == 0) {
          logMsgs.push("has removed the processor from the job");
        } else if (allocated_to != ExistJob.allocated_to) {
          const [[getStaff]] = await pool.execute('SELECT CONCAT(first_name," ",last_name) AS name FROM staffs WHERE id = ?', [allocated_to]);
          logMsgs.push("changed the job to the processor, " + (getStaff?.name || "Unknown"));
        }
      }

      if (logMsgs.length > 0) {
        const finalMsg = logMsgs.length > 1 ? logMsgs.slice(0, -1).join(", ") + " and " + logMsgs.slice(-1) : logMsgs[0];
        CustomerLogUpdateOperation({
          staff_id: userId, ip: userIp, date: new Date().toISOString().split("T")[0],
          module_name: "job", log_message: `${finalMsg} job code:`,
          permission_type: "updated", module_id: job_id
        }).catch(e => console.error("Log Error", e));
      }
    }

    return { status: true, message: "Job updated successfully." };
  } catch (err) {
    console.error("customerJobUpdate error:", err);
    return { status: false, message: err.message };
  }
};


// ─── CUSTOMER JOB LOGS SUB-TAB APIs ────────────────────────────────────────

const customerJobTimeline = async (dashboard) => {
  const { job_id } = dashboard;
  const query = `SELECT
    staff_logs.id AS log_id,
    staff_logs.staff_id AS staff_id,
    DATE_FORMAT(staff_logs.date, '%Y-%m-%d') AS date,
    staff_logs.created_at AS created_at,
    REPLACE(IFNULL(staff_logs.log_message_all, staff_logs.log_message), 'CUSTOMERUSER ', '') AS log_message
  FROM staff_logs
  JOIN staffs ON staffs.id = staff_logs.staff_id
  JOIN roles ON roles.id = staffs.role_id
  WHERE staff_logs.module_name = 'job' AND staff_logs.module_id = ?
  ORDER BY staff_logs.id DESC`;
  const [result] = await pool.execute(query, [job_id]);
  const groupedResult = result.reduce((acc, log) => {
    const existingDate = acc.find((item) => item.date === log.date);
    if (existingDate) {
      existingDate.allContain.push({ created_at: log.created_at, log_message: log.log_message });
    } else {
      acc.push({ date: log.date, allContain: [{ created_at: log.created_at, log_message: log.log_message }] });
    }
    return acc;
  }, []);
  return { status: true, message: "success.", data: groupedResult };
};

const customerTaskTimesheetAction = async (req) => {
  const taskTimeSheetModel = require('./taskTimeSheetModel');
  const dashboard = req.body || req;
  const { action } = dashboard;
  if (action === 'get') return taskTimeSheetModel.getTaskTimeSheet(dashboard);
  if (action === 'getJobTimeSheet') return taskTimeSheetModel.getjobTimeSheet(dashboard);
  if (action === 'updateJobTimeTotalHours') return taskTimeSheetModel.updateJobTimeTotalHours(dashboard);
  if (action === 'updateTaskTimeSheetStatus') return taskTimeSheetModel.updateTaskTimeSheetStatus(dashboard);
  return { status: false, message: 'Invalid action.' };
};

const customerMissingLogAction = async (req) => {
  const taskTimeSheetModel = require('./taskTimeSheetModel');
  const dashboard = req.body || req;
  const { action } = dashboard;
  if (action === 'get') return taskTimeSheetModel.getMissingLog(dashboard);
  if (action === 'getSingleView') return taskTimeSheetModel.getMissingLogSingleView(dashboard);
  if (action === 'add') return taskTimeSheetModel.addMissingLog(req);
  if (action === 'edit') return taskTimeSheetModel.editMissingLog(req);
  if (action === 'uploadDocument') return taskTimeSheetModel.uploadDocumentMissingLogAndQuery(req);
  return { status: false, message: 'Invalid action.' };
};

const customerQueryAction = async (req) => {
  const taskTimeSheetModel = require('./taskTimeSheetModel');
  const dashboard = req.body || req;
  const { action } = dashboard;
  if (action === 'get') return taskTimeSheetModel.getQuerie(dashboard);
  if (action === 'getSingleView') return taskTimeSheetModel.getQuerieSingleView(dashboard);
  if (action === 'add') return taskTimeSheetModel.addQuerie(req);
  if (action === 'edit') return taskTimeSheetModel.editQuerie(req);
  if (action === 'uploadDocument') return taskTimeSheetModel.uploadDocumentMissingLogAndQuery(req);
  return { status: false, message: 'Invalid action.' };
};

const customerDraftAction = async (req) => {
  const taskTimeSheetModel = require('./taskTimeSheetModel');
  const dashboard = req.body || req;
  const { action } = dashboard;
  if (action === 'get') return taskTimeSheetModel.getDraft(dashboard);
  if (action === 'getSingleView') return taskTimeSheetModel.getDraftSingleView(dashboard);
  if (action === 'add') return taskTimeSheetModel.addDraft(dashboard);
  if (action === 'edit') return taskTimeSheetModel.editDraft(req);
  return { status: false, message: 'Invalid action.' };
};

const customerDocumentAction = async (req) => {
  const taskTimeSheetModel = require('./taskTimeSheetModel');
  const dashboard = req.body || req;
  const { action } = dashboard;
  if (action === 'get') return taskTimeSheetModel.getJobDocument(dashboard);
  if (action === 'delete') return taskTimeSheetModel.deleteJobDocument(dashboard);
  if (action === 'add') return taskTimeSheetModel.addedJobDocument(dashboard);
  if (action === 'addJobDocument') return taskTimeSheetModel.addJobDocument(req);
  return { status: false, message: 'Invalid action.' };
};

// ─────────────────────────────────────────────────────────────────────────────

async function getDueDate(client_type, service_id) {
  if (["1", "3", "7"].includes(client_type)) {
    if (Number(service_id) === 1) {
      const d = new Date();
      const year = d.getFullYear();
      let dueYear = d > new Date(`${year}-01-31`) ? year + 1 : year;
      return `${dueYear}-01-31`;
    } else if (Number(service_id) === 4) {
      const d = new Date();
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      return (m >= 4 || m <= 1) ? `${m >= 4 ? y + 1 : y}-01-31` : `${y}-01-31`;
    }
  }
  return null;
}

async function getSLADeadline(value, Bookkeeping_Frequency_id_2) {
  const date = new Date();
  if ([1, 3, 4, 8].includes(Number(value))) {
    const offsets = { 1: 28, 4: 5, 3: 5, 8: 10 };
    date.setDate(date.getDate() + offsets[value]);
    return date.toISOString().split("T")[0];
  } else if ([2].includes(Number(value))) {
    const offsets = { Daily: 1, Weekly: 3, Monthly: 10, Quarterly: 15, Yearly: 30 };
    date.setDate(date.getDate() + (offsets[Bookkeeping_Frequency_id_2] || 1));
    return date.toISOString().split("T")[0];
  }
  return null;
}

module.exports = {
  getCustomerDashboardData,
  getCustomerDashboardActivityLog,
  getCustomerCountLinkData,
  getMasterStatus,
  updateJobStatus,
  getCustomerDropdown,
  getCustomerList,
  getCustomerClientList,
  getCustomerJobList,
  customerClientAction,
  customerJobAction,
  customerJobUpdate,
  customerJobTimeline,
  customerTaskTimesheetAction,
  customerMissingLogAction,
  customerQueryAction,
  customerDraftAction,
  customerDocumentAction,
};

const pool = require('../config/database');
const { getDateRange } = require('../utils/helper');

const getCustomerDashboardData = async (dashboard) => {
  console.log("getCustomerDashboardData dashboard:", dashboard);
  const { staff_id, date_filter } = dashboard;
  let { startDate, endDate } = await getDateRange(date_filter);

  try {
    // 1. Get all assigned customer IDs for this staff member
    const AssignedCustomerQuery = `
        SELECT customer_id FROM customer_access WHERE staff_id = ?
        UNION
        SELECT customer_id FROM staff_portfolio WHERE staff_id = ?
        UNION
        SELECT id FROM customers WHERE staff_id = ? OR account_manager_id = ?
        UNION
        SELECT customer_id FROM assigned_jobs_staff_view WHERE staff_id = ?
    `;
    const [assignedCustomers] = await pool.execute(AssignedCustomerQuery, [staff_id, staff_id, staff_id, staff_id, staff_id]);
    const assignedCustomerIds = assignedCustomers.map(c => c.customer_id);

    if (assignedCustomerIds.length === 0) {
        return {
            status: true,
            message: "No assigned customers found.",
            data: {
                client: { count: 0, ids: "" },
                job: { count: 0, ids: "" },
                pending_job: { count: 0, ids: "" },
                completed_job: { count: 0, ids: "" },
            }
        };
    }

    const idsStr = assignedCustomerIds.join(',');

    // 2. Get Clients for these Customers
    const ClientQuery = `
        SELECT id FROM clients 
        WHERE customer_id IN (${idsStr})
        ORDER BY id DESC
    `;
    const [ClientData] = await pool.execute(ClientQuery);

    // 3. Get Jobs for these Customers
    const JobQuery = `
        SELECT id, status_type FROM jobs 
        WHERE customer_id IN (${idsStr})
        ORDER BY id DESC
    `;
    const [JobData] = await pool.execute(JobQuery);

    const result = {
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
        staff_logs.*,
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
  try {
    const { job_id, status_type } = data;
    await pool.query("UPDATE jobs SET status_type = ? WHERE id = ?", [status_type, job_id]);
    return { status: true, message: "Job status updated successfully" };
  } catch (error) {
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

    let filterCondition = "";
    if (ids) {
      const cleane_ids = ids.replace(/^,+|,+$/g, "");
      if (cleane_ids) {
        filterCondition = `AND clients.id IN (${cleane_ids})`;
      }
    } else if (customer_id) {
      filterCondition = `AND clients.customer_id = ${customer_id}`;
    }

    if (!filterCondition) return { status: true, message: "No filters provided.", data: [], pagination: { total: 0 } };

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

    // Get assigned customer IDs for security check
    const AssignedCustomerQuery = `
        SELECT customer_id FROM customer_access WHERE staff_id = ?
        UNION
        SELECT customer_id FROM staff_portfolio WHERE staff_id = ?
        UNION
        SELECT id FROM customers WHERE staff_id = ? OR account_manager_id = ?
        UNION
        SELECT customer_id FROM assigned_jobs_staff_view WHERE staff_id = ?
    `;
    const [assignedCustomers] = await pool.execute(AssignedCustomerQuery, [effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId]);
    const assignedCustomerIds = assignedCustomers.map(c => c.customer_id);
    const idsStr = assignedCustomerIds.length > 0 ? assignedCustomerIds.join(',') : '0';

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

    let filterCondition = "";
    if (ids) {
      const cleane_ids = ids.replace(/^,+|,+$/g, "");
      if (cleane_ids) {
        filterCondition = `AND jobs.id IN (${cleane_ids})`;
      }
    } else if (customer_id) {
      filterCondition = `AND jobs.customer_id = ${customer_id}`;
    }

    if (!filterCondition) return { status: true, message: "No filters provided.", data: [], pagination: { total: 0 } };

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

    // Get assigned customer IDs for security check
    const AssignedCustomerQuery = `
        SELECT customer_id FROM customer_access WHERE staff_id = ?
        UNION
        SELECT customer_id FROM staff_portfolio WHERE staff_id = ?
        UNION
        SELECT id FROM customers WHERE staff_id = ? OR account_manager_id = ?
        UNION
        SELECT customer_id FROM assigned_jobs_staff_view WHERE staff_id = ?
    `;
    const [assignedCustomers] = await pool.execute(AssignedCustomerQuery, [effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId]);
    const assignedCustomerIds = assignedCustomers.map(c => c.customer_id);
    const idsStr = assignedCustomerIds.length > 0 ? assignedCustomerIds.join(',') : '0';

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
      ORDER BY jobs.id DESC
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
  } else {
    return { status: false, message: "Error getting customer dashboard data." };
  }
};

const getCustomerDropdown = async (dashboard) => {
  try {
    const { staff_id, StaffUserId, action } = dashboard;
    const effectiveStaffId = staff_id || StaffUserId;

    if (action === "get") {
      const query = `
          SELECT 
            id, 
            status, 
            form_process, 
            trading_name, 
            CONCAT('cust_', SUBSTRING(trading_name,1,3),'_',SUBSTRING(customer_code,1,15)) AS customer_code
          FROM customers 
          WHERE id IN (
            SELECT customer_id FROM customer_access WHERE staff_id = ?
            UNION
            SELECT customer_id FROM staff_portfolio WHERE staff_id = ?
            UNION
            SELECT id FROM customers WHERE staff_id = ? OR account_manager_id = ?
            UNION
            SELECT customer_id FROM assigned_jobs_staff_view WHERE staff_id = ?
          ) AND status = '1' AND form_process = '4'
          ORDER BY trading_name ASC
      `;
      const [rows] = await pool.execute(query, [effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId]);
      
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
    let { staff_id, StaffUserId, page, limit, search, action } = dashboard;
    
    // Support both staff_id and StaffUserId
    const effectiveStaffId = staff_id || StaffUserId;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const queryAssigned = `
        SELECT customer_id FROM customer_access WHERE staff_id = ?
        UNION
        SELECT customer_id FROM staff_portfolio WHERE staff_id = ?
        UNION
        SELECT id FROM customers WHERE staff_id = ? OR account_manager_id = ?
        UNION
        SELECT customer_id FROM assigned_jobs_staff_view WHERE staff_id = ?
    `;
    const [assignedCustomers] = await pool.execute(queryAssigned, [effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId]);
    const assignedIds = assignedCustomers.map(c => c.customer_id);

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
          OR customers.customer_code LIKE ?
          OR staffs.first_name LIKE ?
          OR staffs.last_name LIKE ?
        )
      `;
      const likeSearch = `%${search}%`;
      searchParams = [likeSearch, likeSearch, likeSearch, likeSearch];
    }

    const [countResult] = await pool.execute(
      `SELECT COUNT(DISTINCT customers.id) AS total 
       FROM customers 
       LEFT JOIN staffs ON customers.account_manager_id = staffs.id
       WHERE customers.id IN (${idsStr}) ${searchCondition}`,
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
        customers.customer_code,
        customers.status,
        customers.form_process,
        DATE_FORMAT(customers.created_at, '%d/%m/%Y') AS created_at,
        CONCAT('cust_', SUBSTRING(customers.trading_name,1,3),'_',SUBSTRING(customers.customer_code,1,15)) AS customer_code_id
      FROM customers
      LEFT JOIN staffs ON customers.staff_id = staffs.id
      WHERE customers.id IN (${idsStr}) ${searchCondition}
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

    if (action === "getByid" && client_id) {
      const [clientRows] = await pool.execute(`
        SELECT clients.*, client_types.type AS client_type_name
        FROM clients 
        LEFT JOIN client_types ON clients.client_type = client_types.id
        WHERE clients.id = ?`, [client_id]);
      
      if (clientRows.length === 0) return { status: false, message: "Client not found." };

      const [contactDetails] = await pool.execute(`SELECT * FROM client_contact_details WHERE client_id = ?`, [client_id]);
      const [companyDetails] = await pool.execute(`SELECT * FROM client_company_information WHERE client_id = ?`, [client_id]);

      return {
        status: true,
        message: "success.",
        data: {
          client: clientRows[0],
          contact_details: contactDetails,
          company_details: companyDetails[0] || {}
        }
      };
    }

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    search = search ? search.trim() : "";

    const clientCodeExpr = `
      CONCAT(
        'cli_',
        SUBSTRING(customers.trading_name, 1, 3), '_',
        SUBSTRING(clients.trading_name, 1, 3), '_',
        SUBSTRING(clients.client_code, 1, 15)
      )
    `;

    let assignedCondition = "";
    if (customer_id && customer_id !== "") {
      assignedCondition = `AND customers.id = ${customer_id}`;
    } else {
      const queryAssigned = `
          SELECT customer_id FROM customer_access WHERE staff_id = ?
          UNION
          SELECT customer_id FROM staff_portfolio WHERE staff_id = ?
          UNION
          SELECT id FROM customers WHERE staff_id = ? OR account_manager_id = ?
          UNION
          SELECT customer_id FROM assigned_jobs_staff_view WHERE staff_id = ?
      `;
      const [assignedCustomers] = await pool.execute(queryAssigned, [effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId]);
      const assignedIds = assignedCustomers.map(c => c.customer_id);
      if (assignedIds.length === 0) return { status: true, message: "No assigned customers.", data: [], pagination: { total: 0 } };
      assignedCondition = `AND customers.id IN (${assignedIds.join(',')})`;
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

    let assignedCondition = "";
    if (action === "getByClient" && client_id) {
      assignedCondition = `AND jobs.client_id = ${client_id}`;
    } else if (action === "getByCustomer" && customer_id) {
      assignedCondition = `AND jobs.customer_id = ${customer_id}`;
    } else {
      const queryAssigned = `
          SELECT customer_id FROM customer_access WHERE staff_id = ?
          UNION
          SELECT customer_id FROM staff_portfolio WHERE staff_id = ?
          UNION
          SELECT id FROM customers WHERE staff_id = ? OR account_manager_id = ?
          UNION
          SELECT customer_id FROM assigned_jobs_staff_view WHERE staff_id = ?
      `;
      const [assignedCustomers] = await pool.execute(queryAssigned, [effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId, effectiveStaffId]);
      const assignedIds = assignedCustomers.map(c => c.customer_id);
      if (assignedIds.length === 0) return { status: true, message: "No assigned jobs.", data: [], pagination: { total: 0 } };
      assignedCondition = `AND jobs.customer_id IN (${assignedIds.join(',')})`;
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
        jobs.id AS job_id,
        timesheet.job_id AS timesheet_job_id,
        job_types.type AS job_type_name,
        jobs.status_type AS status_type,
        jobs.job_priority AS job_priority,
        customer_contact_details.id AS account_manager_officer_id,
        customer_contact_details.first_name AS account_manager_officer_first_name,
        customer_contact_details.last_name AS account_manager_officer_last_name,
        clients.trading_name AS client_trading_name,
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
        ${jobCodeExpr} AS job_code_id,
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
      ORDER BY jobs.id DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(query, [...searchParams, limit, offset]);

    return {
      status: true,
      message: "Success.",
      data: rows,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit), search }
    };
  } catch (error) {
    console.error("getCustomerJobList error:", error);
    return { status: false, message: error.message };
  }
};

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
};

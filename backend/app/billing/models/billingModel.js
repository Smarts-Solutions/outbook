const pool = require('../../config/database');
const { commonEmail } = require('../../utils/commonEmail');
const { 
    LineManageStaffIdHelperFunction, 
    QueryRoleHelperFunction, 
    buildAssignedJobsTempTable 
} = require('../../utils/helper');

// Helper to get Line Manager Staff IDs safely without infinite recursion / loops
const getLineManageStaffIdsSafe = async (staffId) => {
    try {
        if (!staffId) return [];
        const [all] = await pool.query('SELECT staff_by, staff_to FROM line_managers WHERE staff_to != staff_by');
        const graph = new Map();
        for (const r of all) {
            if (!graph.has(r.staff_to)) graph.set(r.staff_to, []);
            graph.get(r.staff_to).push(r.staff_by);
        }
        const visited = new Set();
        const queue = [staffId];
        while (queue.length > 0) {
            const cur = queue.shift();
            const parents = graph.get(cur) || [];
            for (const p of parents) {
                if (!visited.has(p)) {
                    visited.add(p);
                    queue.push(p);
                }
            }
        }
        visited.add(staffId);
        return Array.from(visited);
    } catch (err) {
        console.error('Error in getLineManageStaffIdsSafe:', err);
        return staffId ? [staffId] : [];
    }
};

// 1. Get Active Customers (with Admin/SuperAdmin full access & Staff role-based filtering)
const getActiveCustomers = async (StaffUserId, search = '', page = null, limit = null) => {
    try {
        const searchTerm = `%${search || ''}%`;
        let limitClause = '';
        if (page && limit) {
            const offset = (Number(page) - 1) * Number(limit);
            limitClause = ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
        }

        // If no user id provided, return active customers
        if (!StaffUserId) {
            const query = `
                SELECT 
                    id AS customer_id, 
                    staff_id, 
                    trading_name 
                FROM customers 
                WHERE status = '1' AND trading_name LIKE ?
                ORDER BY trading_name ASC
                ${limitClause}
            `;
            const [rows] = await pool.execute(query, [searchTerm]);
            return { status: true, data: rows };
        }

        // Get Role & Permissions
        const rows = await QueryRoleHelperFunction(StaffUserId);
        const [RoleAccess] = await pool.execute(
            'SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', 
            [rows[0]?.role_id || 0, 33]
        );

        // SUPERADMIN or permission 33 (Admin access) -> Can view all active customers
        if (rows.length > 0 && (rows[0].role_name === 'SUPERADMIN' || RoleAccess.length > 0)) {
            const query = `
                SELECT 
                    id AS customer_id, 
                    staff_id, 
                    trading_name 
                FROM customers 
                WHERE status = '1' AND trading_name LIKE ?
                ORDER BY trading_name ASC
                ${limitClause}
            `;
            const [result] = await pool.execute(query, [searchTerm]);
            return { status: true, data: result };
        }

        // Other Staff roles: view only assigned customers via LineManager hierarchy and temp_assigned_jobs_staff
        const LineManageStaffId = await getLineManageStaffIdsSafe(StaffUserId);
        const lineManagerIds = (LineManageStaffId && LineManageStaffId.length > 0) ? LineManageStaffId.join(',') : '0';

        const connection = await pool.getConnection();
        try {
            await buildAssignedJobsTempTable(connection, LineManageStaffId);

            const query = `
                SELECT  
                    customers.id AS customer_id,
                    customers.staff_id AS staff_id,
                    customers.trading_name AS trading_name
                FROM customers
                LEFT JOIN temp_assigned_jobs_staff ON temp_assigned_jobs_staff.customer_id = customers.id
                WHERE customers.status = '1'
                  AND customers.trading_name LIKE ?
                  AND (
                    customers.staff_id IN (${lineManagerIds}) 
                    OR customers.account_manager_id IN (${lineManagerIds}) 
                    OR temp_assigned_jobs_staff.staff_id IN (${lineManagerIds})
                    OR EXISTS (SELECT 1 FROM clients WHERE clients.customer_id = customers.id AND clients.staff_created_id IN (${lineManagerIds}))
                    OR EXISTS (SELECT 1 FROM jobs WHERE jobs.customer_id = customers.id AND jobs.staff_created_id IN (${lineManagerIds}))
                  )
                GROUP BY customers.id
                ORDER BY customers.trading_name ASC
                ${limitClause}
            `;

            const [result] = await connection.execute(query, [searchTerm]);
            return { status: true, data: result };
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching active customers for billing:', error);
        return { status: false, message: error.message };
    }
};

// 2. Get Active Clients
const getActiveClients = async (customerId = null) => {
    try {
        let query = `
            SELECT 
                id AS client_id, 
                customer_id, 
                staff_created_id, 
                trading_name 
            FROM clients 
            WHERE status = '1'
        `;
        const params = [];

        if (customerId) {
            query += ` AND customer_id = ?`;
            params.push(customerId);
        }

        query += ` ORDER BY trading_name ASC`;

        const [rows] = await pool.execute(query, params);
        return { status: true, data: rows };
    } catch (error) {
        console.error('Error fetching active clients for billing:', error);
        return { status: false, message: error.message };
    }
};

// 3. Get Customer Engagement Models with full details
const getCustomerEngagementDetails = async (customerId, staffUserId = null) => {
    try {
        if (!customerId) {
            return { status: false, message: "Customer ID is required" };
        }

        const query = `
            SELECT 
                customers.id AS customer_id,
                customers.trading_name AS trading_name,
                customers.staff_id AS customer_staff_id,
                customers.account_manager_id AS account_manager_id,
                staff2.first_name AS account_manager_firstname,
                staff2.last_name AS account_manager_lastname,
                CONCAT(lm_staff_user.first_name, ' ', lm_staff_user.last_name) AS staff_line_manager,
                CONCAT(lm_am_user.first_name, ' ', lm_am_user.last_name) AS am_line_manager,

                customer_engagement_model.*, 
                customer_engagement_fte.*, 
                customer_engagement_percentage.*, 
                customer_engagement_adhoc_hourly.*, 
                customer_engagement_customised_pricing.id AS customised_pricing_id,
                customer_engagement_customised_pricing.minimum_number_of_jobs AS minimum_number_of_jobs,
                customer_engagement_customised_pricing.job_type_id AS job_type_id,
                customer_engagement_customised_pricing.cost_per_job AS cost_per_job,
                customer_engagement_customised_pricing.service_id AS service_id,
                services.name AS custom_service_name,
                job_types.type AS custom_job_type_name
            FROM 
                customers
            LEFT JOIN 
                staffs AS staff2 ON customers.account_manager_id = staff2.id
            LEFT JOIN
                line_managers AS lm_staff ON customers.staff_id = lm_staff.staff_by
            LEFT JOIN
                staffs AS lm_staff_user ON lm_staff.staff_to = lm_staff_user.id
            LEFT JOIN
                line_managers AS lm_am ON customers.account_manager_id = lm_am.staff_by
            LEFT JOIN
                staffs AS lm_am_user ON lm_am.staff_to = lm_am_user.id
            LEFT JOIN customer_engagement_model ON customers.id = customer_engagement_model.customer_id
            LEFT JOIN 
                customer_engagement_fte ON customer_engagement_model.id = customer_engagement_fte.customer_engagement_model_id 
            LEFT JOIN 
                customer_engagement_percentage ON customer_engagement_model.id = customer_engagement_percentage.customer_engagement_model_id
            LEFT JOIN 
                customer_engagement_adhoc_hourly ON customer_engagement_model.id = customer_engagement_adhoc_hourly.customer_engagement_model_id
            LEFT JOIN 
                customer_engagement_customised_pricing ON customer_engagement_model.id = customer_engagement_customised_pricing.customer_engagement_model_id
            LEFT JOIN 
                services ON customer_engagement_customised_pricing.service_id = services.id
            LEFT JOIN 
                job_types ON customer_engagement_customised_pricing.job_type_id = job_types.id
            WHERE 
                customers.id = ?
        `;

        const [rows] = await pool.execute(query, [customerId]);

        if (rows.length === 0) {
            return { 
                status: true, 
                data: { 
                    customer_id: customerId, 
                    available_models: [],
                    account_manager: null
                } 
            };
        }

                const firstRow = rows[0];
        let lineManager = null;

        // 1. Priority: If staffUserId is provided, fetch their direct line manager from line_managers table
        if (staffUserId) {
            const [userLmRows] = await pool.execute(
                `SELECT CONCAT(s.first_name, ' ', s.last_name) AS manager_name 
                 FROM line_managers lm 
                 JOIN staffs s ON lm.staff_to = s.id 
                 WHERE lm.staff_by = ? LIMIT 1`,
                [staffUserId]
            );
            if (userLmRows.length > 0 && userLmRows[0].manager_name) {
                lineManager = userLmRows[0].manager_name.trim();
            }
        }

        // 2. Fallback: Staff's line manager assigned to this customer, or Account Manager's line manager
        if (!lineManager) {
            lineManager = (firstRow.staff_line_manager || firstRow.am_line_manager || '').trim() || null;
        }

        const accountManager = firstRow.account_manager_firstname 
            ? `${firstRow.account_manager_firstname} ${firstRow.account_manager_lastname || ''}`.trim() 
            : null;

        const availableModels = [];

        // Check 1: FTE / Dedicated Staffing
        if (firstRow.fte_dedicated_staffing == "1" || firstRow.fte_dedicated_staffing === 1 || Boolean(firstRow.number_of_accountants || firstRow.number_of_bookkeepers || firstRow.number_of_payroll_experts)) {
            availableModels.push({
                model_type: "FTE",
                label: "FTE / Dedicated Staffing",
                details: {
                    number_of_accountants: firstRow.number_of_accountants,
                    fee_per_accountant: firstRow.fee_per_accountant,
                    number_of_bookkeepers: firstRow.number_of_bookkeepers,
                    fee_per_bookkeeper: firstRow.fee_per_bookkeeper,
                    number_of_payroll_experts: firstRow.number_of_payroll_experts,
                    fee_per_payroll_expert: firstRow.fee_per_payroll_expert,
                    number_of_tax_experts: firstRow.number_of_tax_experts,
                    fee_per_tax_expert: firstRow.fee_per_tax_expert,
                    number_of_admin_staff: firstRow.number_of_admin_staff,
                    fee_per_admin_staff: firstRow.fee_per_admin_staff
                }
            });
        }

        // Check 2: Percentage Model
        if (firstRow.percentage_model == "1" || firstRow.percentage_model === 1 || Boolean(firstRow.total_outsourcing)) {
            availableModels.push({
                model_type: "Percentage",
                label: "Percentage Model",
                details: {
                    total_outsourcing: firstRow.total_outsourcing,
                    accountants: firstRow.accountants,
                    bookkeepers: firstRow.bookkeepers,
                    payroll_experts: firstRow.payroll_experts,
                    tax_experts: firstRow.tax_experts,
                    admin_staff: firstRow.admin_staff
                }
            });
        }

        // Check 3: Adhoc / PAYG / Hourly
        if (firstRow.adhoc_payg_hourly == "1" || firstRow.adhoc_payg_hourly === 1 || Boolean(firstRow.adhoc_accountants || firstRow.adhoc_bookkeepers || firstRow.adhoc_payroll_experts || firstRow.adhoc_tax_experts || firstRow.adhoc_admin_staff)) {
            availableModels.push({
                model_type: "Adhoc",
                label: "Adhoc / PAYG / Hourly",
                details: {
                    adhoc_accountants: firstRow.adhoc_accountants,
                    adhoc_bookkeepers: firstRow.adhoc_bookkeepers,
                    adhoc_payroll_experts: firstRow.adhoc_payroll_experts,
                    adhoc_tax_experts: firstRow.adhoc_tax_experts,
                    adhoc_admin_staff: firstRow.adhoc_admin_staff
                }
            });
        }

        // Check 4: Customised Pricing
        if (firstRow.customised_pricing == "1" || firstRow.customised_pricing === 1 || rows.some(r => r.customised_pricing_id)) {
            const pricingList = rows
                .filter(r => r.customised_pricing_id)
                .map(r => ({
                    customised_pricing_id: r.customised_pricing_id,
                    minimum_number_of_jobs: r.minimum_number_of_jobs,
                    cost_per_job: r.cost_per_job,
                    job_type_id: r.job_type_id,
                    job_type_name: r.custom_job_type_name,
                    service_id: r.service_id,
                    service_name: r.custom_service_name
                }));

            availableModels.push({
                model_type: "Customised",
                label: "Customised Pricing",
                details: pricingList
            });
        }

        return {
            status: true,
            data: {
                customer_id: customerId,
                trading_name: firstRow.trading_name,
                line_manager: lineManager,
                    account_manager: accountManager,
                available_models: availableModels
            }
        };
    } catch (error) {
        console.error("Error fetching customer engagement details:", error);
        return { status: false, message: error.message };
    }
};


// 4. Get Clients for a Customer (with Staff RBAC filtering matching ClientList)
const getClientsByCustomer = async (customerId, StaffUserId = null, search = '', page = null, limit = null) => {
    try {
        if (!customerId) return { status: true, data: [] };

        const searchTerm = `%${search || ''}%`;
        let limitClause = '';
        if (page && limit) {
            const offset = (Number(page) - 1) * Number(limit);
            limitClause = ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
        }

        // If no user id provided, return all active clients of customer
        if (!StaffUserId) {
            const query = `
                SELECT 
                    id AS client_id, 
                    customer_id, 
                    trading_name 
                FROM clients 
                WHERE status = '1' AND customer_id = ? AND trading_name LIKE ?
                ORDER BY trading_name ASC
                ${limitClause}
            `;
            const [rows] = await pool.execute(query, [customerId, searchTerm]);
            return { status: true, data: rows };
        }

        // Check Role & Permissions (permission 34 = client view all permission)
        const rows = await QueryRoleHelperFunction(StaffUserId);
        const [RoleAccess] = await pool.execute(
            'SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?',
            [rows[0]?.role_id || 0, 34]
        );

        // SUPERADMIN or permission 34 -> View all active clients of this customer
        if (rows.length > 0 && (rows[0].role_name === 'SUPERADMIN' || RoleAccess.length > 0)) {
            const query = `
                SELECT 
                    id AS client_id, 
                    customer_id, 
                    trading_name 
                FROM clients 
                WHERE status = '1' AND customer_id = ? AND trading_name LIKE ?
                ORDER BY trading_name ASC
                ${limitClause}
            `;
            const [data] = await pool.execute(query, [customerId, searchTerm]);
            return { status: true, data };
        }

        // Other Staff roles: Filter clients by staff assignment / LineManager hierarchy matching clientModel.getClient
        const LineManageStaffId = await getLineManageStaffIdsSafe(StaffUserId);
        const lineManagerIds = (LineManageStaffId && LineManageStaffId.length > 0) ? LineManageStaffId.join(',') : '0';

        const connection = await pool.getConnection();
        try {
            await buildAssignedJobsTempTable(connection, LineManageStaffId);

            const query = `
                SELECT DISTINCT
                    clients.id AS client_id,
                    clients.customer_id,
                    clients.trading_name
                FROM clients
                JOIN customers ON customers.id = clients.customer_id
                LEFT JOIN temp_assigned_jobs_staff 
                    ON temp_assigned_jobs_staff.client_id = clients.id 
                    AND temp_assigned_jobs_staff.staff_id IN (${lineManagerIds})
                WHERE clients.status = '1'
                  AND clients.customer_id = ?
                  AND clients.trading_name LIKE ?
                  AND (
                    clients.staff_created_id IN (${lineManagerIds})
                    OR customers.staff_id IN (${lineManagerIds})
                    OR customers.account_manager_id IN (${lineManagerIds})
                    OR temp_assigned_jobs_staff.staff_id IN (${lineManagerIds})
                  )
                ORDER BY clients.trading_name ASC
                ${limitClause}
            `;

            const [data] = await connection.execute(query, [customerId, searchTerm]);
            return { status: true, data };
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error("Error fetching clients by customer:", error);
        return { status: false, message: error.message };
    }
};

// Helper to safely format a date or date-like value to ISO string (YYYY-MM-DD)
const safeDateToISO = (d) => {
    if (!d) return null;
    if (typeof d === 'string') {
        const trimmed = d.trim();
        if (!trimmed || trimmed === '0000-00-00' || trimmed.toLowerCase() === 'invalid date') return null;
        if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
            return trimmed.split('T')[0].split(' ')[0];
        }
        const parsed = new Date(trimmed);
        if (!isNaN(parsed.getTime())) {
            return parsed.toISOString().split('T')[0];
        }
        return null;
    }
    if (typeof d === 'object') {
        if (d instanceof Date) {
            if (isNaN(d.getTime())) return null;
            return d.toISOString().split('T')[0];
        }
        if (d.toISOString && typeof d.toISOString === 'function') {
            try {
                const iso = d.toISOString();
                return iso ? iso.split('T')[0] : null;
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};

// Helper to format any date or date range to dd/mm/yyyy
const formatDateToDDMMYYYY = (val) => {
    if (!val) return val;
    val = String(val).trim();
    if (val === '0000-00-00' || val.toLowerCase() === 'invalid date') return null;
    // 1. Single ISO date: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const parts = val.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    // 2. Date range: YYYY-MM-DD to YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}\s+to\s+\d{4}-\d{2}-\d{2}$/.test(val)) {
        const parts = val.split(/\s+to\s+/);
        return `${formatDateToDDMMYYYY(parts[0])} to ${formatDateToDDMMYYYY(parts[1])}`;
    }
    // 3. Formats like "31 Aug 2025" or "31-Aug-2025"
    if (/^[0-9]{1,2}[ -][A-Za-z]{3,}[ -][0-9]{4}$/.test(val)) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        }
    }
    return val;
};

// Helper function to extract period type and period date/value from a job row's Other Data
const extractJobPeriodInfo = (job) => {
    if (!job) return null;
    const sId = Number(job.service_id);

    // 1. Service 4: Personal Tax Return -> Tax Year
    if (sId === 4 && job.Tax_Year_id_4 && String(job.Tax_Year_id_4).trim()) {
        return {
            period_type: "Tax Year",
            period_date: String(job.Tax_Year_id_4).trim(),
            raw_value: String(job.Tax_Year_id_4).trim()
        };
    }

    // 2. Service 1 (Accounts Production) or Service 27 (Audit) -> Year Ending
    if ((sId === 1 || sId === 27) && (job.Year_Ending_id_1 || job.Audit_Year_Ending_id_27 || job.year_end)) {
        const d = job.Year_Ending_id_1 || job.Audit_Year_Ending_id_27 || job.year_end;
        const strDate = safeDateToISO(d);
        if (strDate) {
            const formattedDate = formatDateToDDMMYYYY(strDate);
            return {
                period_type: "Year End",
                period_date: formattedDate,
                raw_value: formattedDate
            };
        }
    }

    // 3. Service 2 (Bookkeeping) & Service 32 (Aus - Bookkeeping)
    if (sId === 2 || sId === 32) {
        const rawFreq = (sId === 2 ? job.Bookkeeping_Frequency_id_2 : job.Period_id_32) || '';
        const freq = String(rawFreq).trim().toLowerCase();

        if (freq === 'daily' || freq === 'day') {
            const d = job.Day_Date_id_2 || job.Day_Date_id_32;
            const strDate = safeDateToISO(d);
            const formattedDate = strDate ? formatDateToDDMMYYYY(strDate) : null;
            return { period_type: "Daily", period_date: formattedDate, raw_value: formattedDate };
        }
        if (freq === 'weekly' || freq === 'week') {
            const fromD = job.Week_FromDate_id_2 || job.Week_FromDate_id_32;
            const toD = job.Week_ToDate_id_2 || job.Week_ToDate_id_32;
            const strFrom = safeDateToISO(fromD);
            const strTo = safeDateToISO(toD);
            if (strFrom || strTo) {
                const fmtFrom = strFrom ? formatDateToDDMMYYYY(strFrom) : '';
                const fmtTo = strTo ? formatDateToDDMMYYYY(strTo) : '';
                const label = `${fmtFrom} to ${fmtTo}`.trim();
                if (label && label !== 'to') return { period_type: "Weekly", period_date: label, raw_value: label };
            }
            const w = job.Week_id_2 || job.Week_id_32;
            const m = job.Week_Month_id_2 || job.Week_Month_id_32;
            const y = job.Week_Year_id_2 || job.Week_Year_id_32;
            if (w || m || y) {
                const label = [w, m, y].filter(Boolean).join(', ');
                return { period_type: "Weekly", period_date: label, raw_value: label };
            }
            return { period_type: "Weekly", period_date: null, raw_value: null };
        }
        if (freq === 'fortnightly' || freq === 'fortnight') {
            const fn = job.Fortnight_id_2 || job.Fortnight_id_32;
            const m = job.Fortnight_Month_id_2 || job.Fortnight_Month_id_32;
            const y = job.Fortnight_Year_id_2 || job.Fortnight_Year_id_32;
            if (fn || m || y) {
                const label = [fn, m, y].filter(Boolean).join(', ');
                return { period_type: "Fortnightly", period_date: label, raw_value: label };
            }
            return { period_type: "Fortnightly", period_date: null, raw_value: null };
        }
        if (freq === 'monthly' || freq === 'month') {
            const m = job.Month_id_2 || job.Month_id_32;
            const y = job.Month_Year_id_2 || job.Month_Year_id_32;
            if (m || y) {
                const label = [m, y].filter(Boolean).join(' ');
                return { period_type: "Monthly", period_date: label, raw_value: label };
            }
            return { period_type: "Monthly", period_date: null, raw_value: null };
        }
        if (freq === 'quarterly' || freq === 'quarter') {
            const q = job.Quarter_id_2 || job.Quarter_id_32;
            const y = job.Quarter_Year_id_2 || job.Quarter_Year_id_32;
            if (q || y) {
                const label = [q, y].filter(Boolean).join(' ');
                return { period_type: "Quarterly", period_date: label, raw_value: label };
            }
            return { period_type: "Quarterly", period_date: null, raw_value: null };
        }
        if (freq === 'yearly' || freq === 'year') {
            const y = String(job.Year_id_2 || job.Year_id_32 || '').trim();
            return { period_type: "Yearly", period_date: y || null, raw_value: y || null };
        }
        if (freq === 'other') {
            const fromD = job.Other_FromDate_id_2 || job.Other_FromDate_id_32;
            const toD = job.Other_ToDate_id_2 || job.Other_ToDate_id_32;
            const strFrom = safeDateToISO(fromD);
            const strTo = safeDateToISO(toD);
            const fmtFrom = strFrom ? formatDateToDDMMYYYY(strFrom) : '';
            const fmtTo = strTo ? formatDateToDDMMYYYY(strTo) : '';
            const label = `${fmtFrom} to ${fmtTo}`.trim();
            return { period_type: "Other", period_date: (label && label !== 'to') ? label : null, raw_value: label || null };
        }
    }

    // 4. Service 3 (Payroll) & Service 31 (Aus - Payroll)
    if (sId === 3 || sId === 31) {
        const rawFreq = (sId === 3 ? job.Payroll_Frequency_id_3 : job.Payroll_Frequency_id_31) || '';
        const freq = String(rawFreq).trim().toLowerCase();

        if (freq === 'weekly' || freq === 'week') {
            const fromD = job.Payroll_Week_FromDate_id_3 || job.Payroll_Week_FromDate_id_31;
            const toD = job.Payroll_Week_ToDate_id_3 || job.Payroll_Week_ToDate_id_31;
            const strFrom = safeDateToISO(fromD);
            const strTo = safeDateToISO(toD);
            if (strFrom || strTo) {
                const fmtFrom = strFrom ? formatDateToDDMMYYYY(strFrom) : '';
                const fmtTo = strTo ? formatDateToDDMMYYYY(strTo) : '';
                const label = `${fmtFrom} to ${fmtTo}`.trim();
                if (label && label !== 'to') return { period_type: "Weekly", period_date: label, raw_value: label };
            }
            const w = job.Payroll_Week_id_3 || job.Payroll_Week_id_31;
            const m = job.Payroll_Week_Month_id_3 || job.Payroll_Week_Month_id_31;
            const y = job.Payroll_Week_Year_id_3 || job.Payroll_Week_Year_id_31;
            if (w || m || y) {
                const label = [w, m, y].filter(Boolean).join(', ');
                return { period_type: "Weekly", period_date: label, raw_value: label };
            }
            return { period_type: "Weekly", period_date: null, raw_value: null };
        }
        if (freq === 'fortnightly' || freq === 'fortnight') {
            const fn = job.Payroll_Fortnight_id_3 || job.Payroll_Fortnight_id_31;
            const m = job.Payroll_Fortnight_Month_id_3 || job.Payroll_Fortnight_Month_id_31;
            const y = job.Payroll_Fortnight_Year_id_3 || job.Payroll_Fortnight_Year_id_31;
            if (fn || m || y) {
                const label = [fn, m, y].filter(Boolean).join(', ');
                return { period_type: "Fortnightly", period_date: label, raw_value: label };
            }
            return { period_type: "Fortnightly", period_date: null, raw_value: null };
        }
        if (freq === 'monthly' || freq === 'month') {
            const m = job.Payroll_Month_id_3 || job.Payroll_Month_id_31;
            const y = job.Payroll_Month_Year_id_3 || job.Payroll_Month_Year_id_31;
            if (m || y) {
                const label = [m, y].filter(Boolean).join(' ');
                return { period_type: "Monthly", period_date: label, raw_value: label };
            }
            return { period_type: "Monthly", period_date: null, raw_value: null };
        }
        if (freq === 'quarterly' || freq === 'quarter') {
            const q = job.Payroll_Quarter_id_3 || job.Payroll_Quarter_id_31;
            const y = job.Payroll_Quarter_Year_id_3 || job.Payroll_Quarter_Year_id_31;
            if (q || y) {
                const label = [q, y].filter(Boolean).join(' ');
                return { period_type: "Quarterly", period_date: label, raw_value: label };
            }
            return { period_type: "Quarterly", period_date: null, raw_value: null };
        }
        if (freq === 'yearly' || freq === 'year') {
            const y = String(job.Payroll_Year_id_3 || job.Payroll_Year_id_31 || '').trim();
            return { period_type: "Yearly", period_date: y || null, raw_value: y || null };
        }
    }

    // 5. Service 8 (VAT Returns)
    if (sId === 8) {
        const rawFreq = job.Filing_Frequency_id_8 ? String(job.Filing_Frequency_id_8).trim() : '';
        const freq = rawFreq || 'Period Ending';
        const d = job.Period_Ending_Date_id_8 || job.Filing_Date_id_8;
        const strDate = safeDateToISO(d);
        const formattedDate = strDate ? formatDateToDDMMYYYY(strDate) : null;
        return {
            period_type: freq,
            period_date: formattedDate,
            raw_value: formattedDate
        };
    }

    // 6. Service 6 (Management Accounts)
    if (sId === 6) {
        const rawFreq = job.Management_Accounts_Frequency_id_6 ? String(job.Management_Accounts_Frequency_id_6).trim() : '';
        const fromD = job.Management_Accounts_FromDate_id_6;
        const toD = job.Management_Accounts_ToDate_id_6;
        const strFrom = safeDateToISO(fromD);
        const strTo = safeDateToISO(toD);
        const fmtFrom = strFrom ? formatDateToDDMMYYYY(strFrom) : '';
        const fmtTo = strTo ? formatDateToDDMMYYYY(strTo) : '';
        const label = `${fmtFrom} to ${fmtTo}`.trim();
        return {
            period_type: rawFreq || null,
            period_date: (label && label !== 'to') ? label : null,
            raw_value: label || null
        };
    }

    // 7. Aus - SMSF (28) & Compliance (33)
    if ((sId === 28 || sId === 33) && (job.Year_id_28 || job.Year_id_33)) {
        const y = String(job.Year_id_28 || job.Year_id_33).trim();
        if (y) return { period_type: "Year", period_date: y, raw_value: y };
    }

    // 8. Services without custom "Other Data" form (e.g. Service 5: Admin Support, Service 7: Company Secretarial)
    // For these services, if date_received_on or created_at exists, use it so the service is available for billing!
    if (sId === 5 || sId === 7) {
        if (job.date_received_on || job.created_at) {
            const d = job.date_received_on || job.created_at;
            const strDate = safeDateToISO(d);
            const formattedDate = strDate ? formatDateToDDMMYYYY(strDate) : null;
            return {
                period_type: "Date Received",
                period_date: formattedDate,
                raw_value: formattedDate
            };
        }
    }

    // Fallback: If service has an identifiable fixed period type (like Personal Tax Return -> Tax Year, Accounts Production -> Year End)
    // where there is NO frequency dropdown in Job Other Data, return the fixed period_type.
    // For services with a frequency dropdown (Bookkeeping, Payroll, Management Accounts, VAT),
    // if user did NOT select a frequency in Job Other Data, return period_type = null so user chooses it in Billing!
    if (sId === 4) return { period_type: "Tax Year", period_date: null, raw_value: null };
    if (sId === 1 || sId === 27 || sId === 37 || sId === 38) return { period_type: "Year End", period_date: null, raw_value: null };
    if (sId === 28 || sId === 33) return { period_type: "Yearly", period_date: null, raw_value: null };

    return null;
};

// Helper function to resolve default period type for any service ID
const getDefaultPeriodTypeByService = (serviceId) => {
    const sId = Number(serviceId);
    if (sId === 4) return "Tax Year";
    if (sId === 1 || sId === 27 || sId === 37 || sId === 38) return "Year End";
    if (sId === 2 || sId === 32) return "Monthly";
    if (sId === 3 || sId === 31) return "Monthly";
    if (sId === 8) return "Period Ending";
    if (sId === 6) return "Monthly";
    if (sId === 28 || sId === 33) return "Year";
    if (sId === 5 || sId === 7 || sId === 29 || sId === 30) return "Date Received";
    return null;
};


// 5. Get Jobs for a Customer and/or Client (with optional service, staff access control & status filtering)
const getJobsByCustomerOrClient = async (customerId, clientId = null, serviceId = null, StaffUserId = null, statusType = '6') => {
    try {
        if (!customerId && !clientId) return { status: true, data: [] };

        // Check staff permissions if StaffUserId is provided
        let canViewAllJobs = false;
        if (!StaffUserId) {
            canViewAllJobs = true;
        } else {
            const rows = await QueryRoleHelperFunction(StaffUserId);
            const [RoleAccess] = await pool.execute(
                'SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?',
                [rows[0]?.role_id || 0, 35]
            );
            if (rows.length > 0 && (rows[0].role_name === 'SUPERADMIN' || RoleAccess.length > 0)) {
                canViewAllJobs = true;
            }
        }

        const jobCodeExpr = `
            CONCAT(
                SUBSTRING(IFNULL(c.trading_name, ''), 1, 3), '_',
                SUBSTRING(IFNULL(cl.trading_name, ''), 1, 3), '_',
                SUBSTRING(IFNULL(jt.type, ''), 1, 4), '_',
                SUBSTRING(IFNULL(j.job_id, ''), 1, 15)
            )
        `;

        if (canViewAllJobs) {
            let query = `
                SELECT 
                    j.*,
                    j.id AS job_id,
                    j.customer_id,
                    j.client_id,
                    j.service_id,
                    j.job_type_id,
                    j.job_id AS raw_job_id,
                    j.client_job_code,
                    j.status_type,
                    ms.name AS status_name,
                    s.name AS service_name,
                    jt.type AS job_type_name,
                    ${jobCodeExpr} AS job_code_id,
                    bs_chk.id AS existing_billing_id,
                    bs_chk.status AS existing_billing_status
                FROM jobs j
                LEFT JOIN customers c ON j.customer_id = c.id
                LEFT JOIN clients cl ON j.client_id = cl.id
                LEFT JOIN services s ON j.service_id = s.id
                LEFT JOIN job_types jt ON j.job_type_id = jt.id
                LEFT JOIN master_status ms ON j.status_type = ms.id
                LEFT JOIN (
                    SELECT job_id, id, status
                    FROM billing_submissions
                    WHERE id IN (
                        SELECT MAX(id) FROM billing_submissions WHERE job_id IS NOT NULL AND status != 'Rejected' GROUP BY job_id
                    )
                ) bs_chk ON bs_chk.job_id = j.id
                WHERE 1 = 1
            `;
            const params = [];

            if (customerId) {
                query += ` AND j.customer_id = ?`;
                params.push(customerId);
            }
            if (clientId) {
                query += ` AND j.client_id = ?`;
                params.push(clientId);
            }
            if (serviceId) {
                query += ` AND j.service_id = ?`;
                params.push(serviceId);
            }
            if (statusType) {
                if (Array.isArray(statusType)) {
                    const placeholders = statusType.map(() => '?').join(',');
                    query += ` AND j.status_type IN (${placeholders})`;
                    params.push(...statusType);
                } else if (String(statusType).toLowerCase() !== 'all') {
                    query += ` AND j.status_type = ?`;
                    params.push(statusType);
                }
            }

            query += ` ORDER BY j.id DESC`;

            const [rows] = await pool.execute(query, params);
            const enriched = rows.map((job) => {
                const periodInfo = extractJobPeriodInfo(job);
                return {
                    ...job,
                    period_type: periodInfo?.period_type || null,
                    period_date: periodInfo?.period_date || null,
                    period_raw: periodInfo?.raw_value || null,
                };
            });
            return { status: true, data: enriched };
        } else {
            // Other Staff roles: Filter jobs strictly visible to this staff via LineManager hierarchy and temporary assigned jobs table
            const LineManageStaffId = await getLineManageStaffIdsSafe(StaffUserId);
            const lineManagerIds = (LineManageStaffId && LineManageStaffId.length > 0) ? LineManageStaffId.join(',') : '0';

            const connection = await pool.getConnection();
            try {
                await buildAssignedJobsTempTable(connection, LineManageStaffId);

                let query = `
                    SELECT 
                        j.*,
                        j.id AS job_id,
                        j.customer_id,
                        j.client_id,
                        j.service_id,
                        j.job_type_id,
                        j.job_id AS raw_job_id,
                        j.client_job_code,
                        j.status_type,
                        ms.name AS status_name,
                        s.name AS service_name,
                        jt.type AS job_type_name,
                        ${jobCodeExpr} AS job_code_id,
                        bs_chk.id AS existing_billing_id,
                        bs_chk.status AS existing_billing_status
                    FROM jobs j
                    LEFT JOIN customers c ON j.customer_id = c.id
                    LEFT JOIN clients cl ON j.client_id = cl.id
                    LEFT JOIN services s ON j.service_id = s.id
                    LEFT JOIN job_types jt ON j.job_type_id = jt.id
                    LEFT JOIN master_status ms ON j.status_type = ms.id
                    LEFT JOIN (
                        SELECT job_id, id, status
                        FROM billing_submissions
                        WHERE id IN (
                            SELECT MAX(id) FROM billing_submissions WHERE job_id IS NOT NULL AND status != 'Rejected' GROUP BY job_id
                        )
                    ) bs_chk ON bs_chk.job_id = j.id
                    LEFT JOIN temp_assigned_jobs_staff 
                        ON temp_assigned_jobs_staff.job_id = j.id 
                        AND temp_assigned_jobs_staff.staff_id IN (${lineManagerIds})
                    WHERE 1 = 1
                      AND (
                        temp_assigned_jobs_staff.staff_id IN (${lineManagerIds})
                        OR j.staff_created_id IN (${lineManagerIds})
                        OR cl.staff_created_id IN (${lineManagerIds})
                        OR c.staff_id IN (${lineManagerIds})
                        OR c.account_manager_id IN (${lineManagerIds})
                      )
                      AND (
                        (temp_assigned_jobs_staff.source IS NULL OR temp_assigned_jobs_staff.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci)
                        OR j.service_id = temp_assigned_jobs_staff.service_id_assign
                      )
                `;

                const params = [];

                if (customerId) {
                    query += ` AND j.customer_id = ?`;
                    params.push(customerId);
                }
                if (clientId) {
                    query += ` AND j.client_id = ?`;
                    params.push(clientId);
                }
                if (serviceId) {
                    query += ` AND j.service_id = ?`;
                    params.push(serviceId);
                }
                if (statusType) {
                    if (Array.isArray(statusType)) {
                        const placeholders = statusType.map(() => '?').join(',');
                        query += ` AND j.status_type IN (${placeholders})`;
                        params.push(...statusType);
                    } else if (String(statusType).toLowerCase() !== 'all') {
                        query += ` AND j.status_type = ?`;
                        params.push(statusType);
                    }
                }

                query += ` GROUP BY j.id ORDER BY j.id DESC`;

                const [rows] = await connection.execute(query, params);
                const enriched = rows.map((job) => {
                    const periodInfo = extractJobPeriodInfo(job);
                    return {
                        ...job,
                        period_type: periodInfo?.period_type || null,
                        period_date: periodInfo?.period_date || null,
                        period_raw: periodInfo?.raw_value || null,
                    };
                });
                return { status: true, data: enriched };
            } finally {
                connection.release();
            }
        }
    } catch (error) {
        console.error("Error fetching jobs for billing:", error);
        return { status: false, message: error.message };
    }
};

// 6. Get Services (all active)
const getAllActiveServices = async () => {
    try {
        const query = `SELECT id, name FROM services WHERE deleted = '0' ORDER BY name ASC`;
        const [rows] = await pool.execute(query);
        return { status: true, data: rows };
    } catch (error) {
        console.error("Error fetching services:", error);
        return { status: false, message: error.message };
    }
};

// 7. Get Job Types (optionally filtered by service_id)
const getJobTypesByService = async (serviceId = null) => {
    try {
        let query = `SELECT id, service_id, type FROM job_types WHERE 1 = 1`;
        const params = [];
        if (serviceId) {
            query += ` AND service_id = ?`;
            params.push(serviceId);
        }
        query += ` ORDER BY type ASC`;
        const [rows] = await pool.execute(query, params);
        return { status: true, data: rows };
    } catch (error) {
        console.error("Error fetching job types:", error);
        return { status: false, message: error.message };
    }
};

// 8. Get Services from existing jobs for a given client with dynamic period types and dates
// If StaffUserId is provided and staff is not SUPERADMIN/all_jobs, filters jobs to those visible to this staff
const getServicesByClient = async (clientId, StaffUserId = null) => {
    try {
        if (!clientId) {
            return { status: true, data: [] };
        }

        let jobs = [];

        // Check staff permissions if StaffUserId is provided
        let canViewAllJobs = false;
        if (!StaffUserId) {
            canViewAllJobs = true;
        } else {
            const rows = await QueryRoleHelperFunction(StaffUserId);
            const [RoleAccess] = await pool.execute(
                'SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?',
                [rows[0]?.role_id || 0, 35]
            );
            if (rows.length > 0 && (rows[0].role_name === 'SUPERADMIN' || RoleAccess.length > 0)) {
                canViewAllJobs = true;
            }
        }

        if (canViewAllJobs) {
            // Fetch all jobs for this client ordered latest to oldest
            const query = `
                SELECT 
                    j.*,
                    s.name AS service_name
                FROM jobs j
                JOIN services s ON j.service_id = s.id
                WHERE j.client_id = ?
                ORDER BY j.id DESC
            `;
            const [rows] = await pool.execute(query, [clientId]);
            jobs = rows;
        } else {
            // Filter jobs strictly visible to this staff on /admin/client/profile
            const LineManageStaffId = await getLineManageStaffIdsSafe(StaffUserId);
            const lineManagerIds = (LineManageStaffId && LineManageStaffId.length > 0) ? LineManageStaffId.join(',') : '0';

            const connection = await pool.getConnection();
            try {
                await buildAssignedJobsTempTable(connection, LineManageStaffId);

                const query = `
                    SELECT 
                        j.*,
                        s.name AS service_name
                    FROM jobs j
                    JOIN services s ON j.service_id = s.id
                    LEFT JOIN temp_assigned_jobs_staff 
                        ON temp_assigned_jobs_staff.job_id = j.id 
                        AND temp_assigned_jobs_staff.staff_id IN (${lineManagerIds})
                    LEFT JOIN clients cl ON j.client_id = cl.id
                    LEFT JOIN customers cu ON j.customer_id = cu.id
                    WHERE j.client_id = ?
                      AND (
                        temp_assigned_jobs_staff.staff_id IN (${lineManagerIds})
                        OR j.staff_created_id IN (${lineManagerIds})
                        OR cl.staff_created_id IN (${lineManagerIds})
                        OR cu.staff_id IN (${lineManagerIds})
                        OR cu.account_manager_id IN (${lineManagerIds})
                      )
                      AND (
                        (temp_assigned_jobs_staff.source IS NULL OR temp_assigned_jobs_staff.source != 'assign_customer_service' COLLATE utf8mb4_unicode_ci)
                        OR j.service_id = temp_assigned_jobs_staff.service_id_assign
                      )
                    GROUP BY j.id
                    ORDER BY j.id DESC
                `;

                const [rows] = await connection.execute(query, [clientId]);
                jobs = rows;
            } finally {
                connection.release();
            }
        }

        // Group jobs by service_id and extract distinct period options
        const serviceMap = new Map();

        for (const job of jobs) {
            const sId = job.service_id;
            const periodInfo = extractJobPeriodInfo(job);

            const pType = periodInfo?.period_type || getDefaultPeriodTypeByService(sId) || null;
            const pDate = periodInfo?.period_date || null;

            if (!serviceMap.has(sId)) {
                serviceMap.set(sId, {
                    service_id: sId,
                    service_name: job.service_name,
                    latest_period_type: pType,
                    latest_period_date: pDate,
                    // Structure: { [period_type]: [period_date1, period_date2, ...] }
                    period_types: {},
                    period_options: [] // flat list of { period_type, period_date, job_id }
                });
            }

            const sObj = serviceMap.get(sId);
            if (!sObj.latest_period_type && pType) {
                sObj.latest_period_type = pType;
            }
            if (!sObj.latest_period_date && pDate) {
                sObj.latest_period_date = pDate;
            }

            if (pType) {
                if (!sObj.period_types[pType]) {
                    sObj.period_types[pType] = [];
                }
                if (pDate && !sObj.period_types[pType].includes(pDate)) {
                    sObj.period_types[pType].push(pDate);
                }
            }

            if (pType || pDate) {
                sObj.period_options.push({
                    job_id: job.id,
                    period_type: pType,
                    period_date: pDate
                });
            }
        }

        // Only return services that have at least one valid period/date from their jobs!
        const result = Array.from(serviceMap.values()).map(s => ({
            service_id: s.service_id,
            service_name: s.service_name,
            latest_period_type: s.latest_period_type,
            latest_period_date: s.latest_period_date,
            period_types: Object.keys(s.period_types).map(typeKey => ({
                type: typeKey,
                dates: s.period_types[typeKey]
            })),
            latest_year_end: s.latest_period_date
        }));

        // Sort by service name ascending
        result.sort((a, b) => a.service_name.localeCompare(b.service_name));

        return { status: true, data: result };
    } catch (error) {
        console.error("Error fetching services by client:", error);
        return { status: false, message: error.message };
    }
};


// 8.1 Get Timesheet & Job Contributors (Staff assigned as Reviewer, Allocated To, Allocated To Other in jobs + Staff who logged timesheets in current/selected period)
const getTimesheetContributors = async (customerId, clientId, serviceId, periodDate = null, jobId = null) => {
    try {
        // If a specific job is selected, fetch STRICTLY the reviewer, allocated_to, and allocated_to_other for THIS selected job!
        if (jobId) {
            const queryJobStaff = `
                SELECT DISTINCT
                    s.id AS staff_id,
                    CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
                    s.email AS staff_email
                FROM staffs s
                WHERE s.id IN (
                    -- Reviewer from this selected job
                    SELECT j.reviewer
                    FROM jobs j
                    WHERE j.id = ? AND j.reviewer IS NOT NULL AND j.reviewer > 0

                    UNION

                    -- Allocated To from this selected job
                    SELECT j.allocated_to
                    FROM jobs j
                    WHERE j.id = ? AND j.allocated_to IS NOT NULL AND j.allocated_to > 0

                    UNION

                    -- Allocated To (Other) from job_allowed_staffs for this selected job
                    SELECT jas.staff_id
                    FROM job_allowed_staffs jas
                    WHERE jas.job_id = ? AND jas.staff_id IS NOT NULL AND jas.staff_id > 0
                )
                ORDER BY staff_name ASC
            `;

            const [rows] = await pool.execute(queryJobStaff, [jobId, jobId, jobId]);
            return {
                status: true,
                data: rows,
                fallbackStaff: []
            };
        }

        if (!customerId || !clientId) {
            return { status: true, data: [] };
        }

        // Current Month / Selected period date range
        // Default to current month if periodDate not supplied
        let startDateExpr = `DATE_FORMAT(CURDATE(), '%Y-%m-01')`;
        let endDateExpr = `LAST_DAY(CURDATE())`;
        const dateParams = [];

        if (periodDate && String(periodDate).match(/^\d{4}-\d{2}$/)) {
            startDateExpr = `?`;
            endDateExpr = `LAST_DAY(?)`;
            dateParams.push(`${periodDate}-01`, `${periodDate}-01`);
        }

        let serviceFilterJobs = '';
        const jobParams = [customerId, clientId];
        if (serviceId) {
            serviceFilterJobs = ` AND j.service_id = ?`;
            jobParams.push(serviceId);
        }

        // 1) Assigned staff from matching jobs:
        // - Reviewer (j.reviewer)
        // - Allocated To (j.allocated_to)
        // - Allocated to (Other) (job_allowed_staffs.staff_id)
        // 2) Timesheet staff who logged timesheets for these jobs in the month
        const query = `
            SELECT DISTINCT
                s.id AS staff_id,
                CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
                s.email AS staff_email
            FROM staffs s
            WHERE s.id IN (
                -- Reviewer from jobs
                SELECT j.reviewer
                FROM jobs j
                WHERE j.customer_id = ? AND j.client_id = ? ${serviceFilterJobs}
                  AND j.reviewer IS NOT NULL AND j.reviewer > 0

                UNION

                -- Allocated To from jobs
                SELECT j.allocated_to
                FROM jobs j
                WHERE j.customer_id = ? AND j.client_id = ? ${serviceFilterJobs}
                  AND j.allocated_to IS NOT NULL AND j.allocated_to > 0

                UNION

                -- Allocated To (Other) from job_allowed_staffs
                SELECT jas.staff_id
                FROM job_allowed_staffs jas
                JOIN jobs j ON jas.job_id = j.id
                WHERE j.customer_id = ? AND j.client_id = ? ${serviceFilterJobs}
                  AND jas.staff_id IS NOT NULL AND jas.staff_id > 0

                UNION

                -- Staff who logged timesheet in current/selected month for this customer, client & service
                SELECT ts.staff_id
                FROM timesheet ts
                LEFT JOIN jobs j ON ts.job_id = j.id
                WHERE (ts.customer_id = ? OR j.customer_id = ?)
                  AND (ts.client_id = ? OR j.client_id = ?)
                  AND ts.is_deleted = 0
                  ${serviceId ? 'AND j.service_id = ?' : ''}
                  AND (
                      (ts.monday_date >= ${startDateExpr} AND ts.monday_date <= ${endDateExpr})
                      OR (ts.sunday_date >= ${startDateExpr} AND ts.sunday_date <= ${endDateExpr})
                      OR (ts.save_date >= ${startDateExpr} AND ts.save_date <= ${endDateExpr})
                      OR (ts.submit_date >= ${startDateExpr} AND ts.submit_date <= ${endDateExpr})
                  )
            )
            ORDER BY staff_name ASC
        `;

        const fullParams = [
            ...jobParams, // for reviewer
            ...jobParams, // for allocated_to
            ...jobParams, // for allocated_to_other
            customerId, customerId, clientId, clientId,
            ...(serviceId ? [serviceId] : []),
            ...dateParams, ...dateParams, ...dateParams, ...dateParams
        ];

        const [rows] = await pool.execute(query, fullParams);

        return {
            status: true,
            data: rows,
            fallbackStaff: []
        };
    } catch (error) {
        console.error("Error fetching timesheet & job contributors:", error);
        return { status: false, message: error.message };
    }
};

// Helper: Recursively fetch all subordinate staff IDs managed under managerStaffId (direct and indirect hierarchy)
const getSubordinateStaffIds = async (managerStaffId) => {
    if (!managerStaffId) return [];
    try {
        const visited = new Set();
        let currentLevel = [Number(managerStaffId)];
        while (currentLevel.length > 0) {
            const placeholders = currentLevel.map(() => '?').join(',');
            const [rows] = await pool.execute(
                `SELECT staff_by FROM line_managers WHERE staff_to IN (${placeholders})`,
                currentLevel
            );
            const nextLevel = [];
            for (const r of rows) {
                const subId = Number(r.staff_by);
                if (subId && !visited.has(subId)) {
                    visited.add(subId);
                    nextLevel.push(subId);
                }
            }
            currentLevel = nextLevel;
        }
        return Array.from(visited);
    } catch (err) {
        console.error('Error in getSubordinateStaffIds:', err);
        return [];
    }
};

// 9. Submit Billing (with Duplicate Prevention & Contributors Split Transaction)
const submitBilling = async (payload, submittedByStaffId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const {
            customer_id,
            client_id,
            service_id,
            job_id = null,
            period_type = 'Month',
            period_date,
            period_label,
            period_end = null,
            engagement_model,
            calc_json,
            gross_amount = 0,
            discount_pct = 0,
            discount_amt = 0,
            net_amount = 0,
            currency = 'GBP',
            nomisma_description,
            remark = null,
            manager_id = null,
            contributors = [],
            action = 'submit' // 'save' (Draft) or 'submit' (Pending Manager Approval)
        } = payload;

        const isDraft = action === 'save' || payload.status === 'Draft';
        const targetStatus = isDraft ? 'Draft' : 'Pending Manager Approval';

        const safeEngagementModel = engagement_model ? String(engagement_model).slice(0, 990) : '';
        const safeNomismaDescription = nomisma_description ? String(nomisma_description).slice(0, 990) : '';

        // Format period_date and period_label to DD/MM/YYYY if they are ISO or other dates
        const formattedPeriodDate = formatDateToDDMMYYYY(period_date);
        const formattedPeriodLabel = formatDateToDDMMYYYY(period_label);

        // Validation
        if (!customer_id || !client_id || !service_id || !formattedPeriodLabel || (net_amount === undefined || net_amount === null)) {
            await connection.rollback();
            return {
                status: false,
                message: "Customer, Client, Service, Period Label and Net Amount are required."
            };
        }

        // Strict 100% Contributor Validation (Only enforced when net_amount > 0)
        if (Number(net_amount) > 0 && Array.isArray(contributors) && contributors.length > 0) {
            const totalAllocPct = contributors.reduce((sum, c) => sum + (parseFloat(c.pct) || 0), 0);
            if (Math.abs(totalAllocPct - 100) > 0.1) {
                await connection.rollback();
                return {
                    status: false,
                    message: `Contributor allocation must equal exactly 100%. Currently allocated: ${totalAllocPct.toFixed(2)}%.`
                };
            }
        }

        // Strict Engagement Model Caps Validation
        if (calc_json && typeof calc_json === 'object') {
            // 1. FTE Resource Agreement Limits
            if (calc_json.fte) {
                const [fteRows] = await connection.execute(
                    `SELECT f.* FROM customer_engagement_fte f
                     JOIN customer_engagement_model m ON f.customer_engagement_model_id = m.id
                     WHERE m.customer_id = ? LIMIT 1`,
                    [customer_id]
                );

                if (fteRows.length > 0) {
                    const fteAgreement = fteRows[0];
                    const rolesToCheck = [
                        { key: 'accountants', label: 'Accountants', limit: fteAgreement.number_of_accountants },
                        { key: 'bookkeepers', label: 'Bookkeepers', limit: fteAgreement.number_of_bookkeepers },
                        { key: 'payroll', label: 'Payroll Experts', limit: fteAgreement.number_of_payroll_experts },
                        { key: 'tax', label: 'Tax Experts', limit: fteAgreement.number_of_tax_experts },
                        { key: 'admin', label: 'Admin Staff', limit: fteAgreement.number_of_admin_staff },
                    ];

                    for (const role of rolesToCheck) {
                        const submittedVal = parseFloat(calc_json.fte[role.key]) || 0;
                        const agreedLimit = parseFloat(role.limit) || 0;
                        if (submittedVal > agreedLimit) {
                            await connection.rollback();
                            return {
                                status: false,
                                message: `FTE limit exceeded: Cannot bill ${submittedVal} ${role.label}. The customer agreement allows a maximum of ${agreedLimit}.`
                            };
                        }
                    }
                }
            }

            // 2. Customised Pricing Max Jobs Validation
            if (calc_json.customised && service_id) {
                const [customRows] = await connection.execute(
                    `SELECT cp.* FROM customer_engagement_customised_pricing cp
                     JOIN customer_engagement_model m ON cp.customer_engagement_model_id = m.id
                     WHERE m.customer_id = ? AND cp.service_id = ? LIMIT 1`,
                    [customer_id, service_id]
                );

                if (customRows.length > 0) {
                    const maxJobs = parseFloat(customRows[0].minimum_number_of_jobs) || 0;
                    const submittedJobs = parseFloat(calc_json.customised.count) || 0;
                    if (maxJobs > 0 && submittedJobs > maxJobs) {
                        await connection.rollback();
                        return {
                            status: false,
                            message: `Customised Pricing maximum exceeded: Completed jobs (${submittedJobs}) cannot be greater than the agreed limit of ${maxJobs} jobs.`
                        };
                    }
                }
            }
        }

        // Dedupe Key for duplicate prevention (Rule 5)
        const dedupeKey = `${client_id}_${service_id}_${formattedPeriodLabel}`;

        // Check if submission exists
        let finalManagerId = manager_id;
        const editSubmissionId = payload.edit_submission_id || payload.submission_id || null;

        if (editSubmissionId) {
            // Updating existing submission
            const [existing] = await connection.execute(
                `SELECT id, status, manager_id, submitted_by FROM billing_submissions WHERE id = ?`,
                [editSubmissionId]
            );

            if (existing.length === 0) {
                await connection.rollback();
                return { status: false, message: "Submission to edit was not found." };
            }

            // Authorization check: If Returned, only the original submitter (or Admin) can re-submit
            if (existing[0].status === 'Returned') {
                const isOriginalSubmitter = Number(existing[0].submitted_by) === Number(submittedByStaffId);
                const [userRoleRow] = await connection.execute(
                    `SELECT role_id FROM staffs WHERE id = ? LIMIT 1`,
                    [submittedByStaffId]
                );
                const isAdmin = userRoleRow.length > 0 && [1, 2].includes(Number(userRoleRow[0].role_id));

                if (!isOriginalSubmitter && !isAdmin) {
                    await connection.rollback();
                    return {
                        status: false,
                        message: "Only the user who originally submitted this bill (or an Admin) can edit and re-submit it."
                    };
                }
            }

            // Preserve manager_id and original submitter if not provided
            if (!finalManagerId) {
                finalManagerId = existing[0].manager_id;
            }
            if (!finalManagerId) {
                // If still null, try finding customer account manager or staff's manager
                finalManagerId = await getDesignatedManagerForSubmission(connection, customer_id, existing[0].submitted_by || staff_user_id);
            }

            // Status calculation for edit/re-submit:
            // If action is 'save', status becomes 'Draft'
            // If action is 'submit', status becomes 'Pending Manager Approval'
            const newStatus = isDraft ? 'Draft' : 'Pending Manager Approval';

            const updateSubQuery = `
                UPDATE billing_submissions SET
                    customer_id = ?,
                    client_id = ?,
                    service_id = ?,
                    job_id = ?,
                    period_type = ?,
                    period_date = ?,
                    period_label = ?,
                    dedupe_key = ?,
                    engagement_model = ?,
                    calc_json = ?,
                    gross_amount = ?,
                    discount_pct = ?,
                    discount_amt = ?,
                    net_amount = ?,
                    currency = ?,
                    nomisma_description = ?,
                    remark = ?,
                    manager_id = ?,
                    status = ?,
                    save_date = IF(? = 'save', NOW(), save_date),
                    submit_date = IF(? = 'submit', NOW(), submit_date),
                    manager_edited = 1,
                    updated_at = NOW()
                WHERE id = ?
            `;

            const updateParams = [
                customer_id,
                client_id,
                service_id,
                job_id || null,
                period_type,
                formattedPeriodDate,
                formattedPeriodLabel,
                dedupeKey,
                safeEngagementModel,
                typeof calc_json === 'object' ? JSON.stringify(calc_json) : String(calc_json),
                gross_amount,
                discount_pct,
                discount_amt,
                net_amount,
                currency,
                safeNomismaDescription,
                remark ? String(remark).trim() : null,
                finalManagerId,
                newStatus,
                action,
                action,
                editSubmissionId
            ];

            await connection.execute(updateSubQuery, updateParams);

            // Update Contributors
            if (Array.isArray(contributors) && contributors.length > 0) {
                await connection.execute(
                    `DELETE FROM billing_submission_contributors WHERE submission_id = ?`,
                    [editSubmissionId]
                );

                const contribQuery = `
                    INSERT INTO billing_submission_contributors (
                        submission_id,
                        staff_id,
                        staff_name,
                        pct,
                        amount
                    ) VALUES (?, ?, ?, ?, ?)
                `;

                for (const c of contributors) {
                    const staffId = c.staff_id || c.employeeId || submittedByStaffId;
                    const staffName = c.name || c.staff_name || 'Contributor';
                    const pct = parseFloat(c.pct) || 0;
                    const amount = (c.amount !== undefined && c.amount !== null && c.amount !== '')
                        ? parseFloat(c.amount) || 0
                        : parseFloat(((net_amount * pct) / 100).toFixed(2));

                    await connection.execute(contribQuery, [
                        editSubmissionId,
                        staffId,
                        staffName,
                        pct,
                        amount
                    ]);
                }
            }

            await connection.commit();
            return {
                status: true,
                message: "Billing submission updated successfully.",
                data: {
                    submission_id: editSubmissionId,
                    net_amount,
                    currency,
                    period_label: formattedPeriodLabel,
                    status: existing[0].status
                }
            };
        }

        // Check if live submission already exists (not Draft, not Returned and not Superseded)
        // If existing is Draft, user can overwrite/update it, or if it's already submitted (Pending / Approved) prevent duplicate
        const [existing] = await connection.execute(
            `SELECT id, status, period_label FROM billing_submissions 
             WHERE dedupe_key = ? 
             AND status NOT IN ('Draft', 'Returned', 'Rejected', 'Superseded') 
             LIMIT 1`,
            [dedupeKey]
        );

        if (existing && existing.length > 0) {
            await connection.rollback();
            return {
                status: false,
                isDuplicate: true,
                message: `Billing has already been submitted for this client & service for period ${formattedPeriodLabel} (Status: ${existing[0].status}).`
            };
        }

        // Determine Primary Manager / Approver:
        // 1. Primary: Selected Customer's Account Manager (customers.account_manager_id)
        // 2. Fallback: Submitter's direct Line Manager (from line_managers table where staff_by = submittedByStaffId)
        // 3. Fallback: Customer's staff_id
        if (!finalManagerId) {
            const [custRows] = await connection.execute(
                `SELECT account_manager_id, staff_id FROM customers WHERE id = ? LIMIT 1`,
                [customer_id]
            );
            if (custRows.length > 0 && custRows[0].account_manager_id) {
                finalManagerId = custRows[0].account_manager_id;
            } else {
                const [lmRows] = await connection.execute(
                    `SELECT staff_to FROM line_managers WHERE staff_by = ? LIMIT 1`,
                    [submittedByStaffId]
                );
                if (lmRows.length > 0 && lmRows[0].staff_to) {
                    finalManagerId = lmRows[0].staff_to;
                } else if (custRows.length > 0) {
                    finalManagerId = custRows[0].staff_id || null;
                }
            }
        }

        // 1. Insert into billing_submissions
        const subQuery = `
            INSERT INTO billing_submissions (
                customer_id,
                client_id,
                service_id,
                job_id,
                period_type,
                period_date,
                period_label,
                dedupe_key,
                engagement_model,
                calc_json,
                gross_amount,
                discount_pct,
                discount_amt,
                net_amount,
                currency,
                nomisma_description,
                remark,
                status,
                submitted_by,
                submitted_at,
                save_date,
                submit_date,
                manager_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)
        `;

        const subParams = [
            customer_id,
            client_id,
            service_id,
            job_id || null,
            period_type,
            formattedPeriodDate,
            formattedPeriodLabel,
            dedupeKey,
            safeEngagementModel,
            typeof calc_json === 'object' ? JSON.stringify(calc_json) : String(calc_json),
            gross_amount,
            discount_pct,
            discount_amt,
            net_amount,
            currency,
            safeNomismaDescription,
            remark ? String(remark).trim() : null,
            targetStatus,
            submittedByStaffId,
            action === 'save' ? new Date() : (action === 'submit' ? new Date() : null),
            action === 'submit' ? new Date() : null,
            finalManagerId
        ];

        const [subResult] = await connection.execute(subQuery, subParams);
        const submissionId = subResult.insertId;

        // 2. Insert Contributors Split
        if (Array.isArray(contributors) && contributors.length > 0) {
            const contribQuery = `
                INSERT INTO billing_submission_contributors (
                    submission_id,
                    staff_id,
                    staff_name,
                    pct,
                    amount
                ) VALUES (?, ?, ?, ?, ?)
            `;

            for (const c of contributors) {
                const staffId = c.staff_id || c.employeeId || submittedByStaffId;
                const staffName = c.name || c.staff_name || 'Contributor';
                const pct = parseFloat(c.pct) || 0;
                const amount = (c.amount !== undefined && c.amount !== null && c.amount !== '')
                    ? parseFloat(c.amount) || 0
                    : parseFloat(((net_amount * pct) / 100).toFixed(2));

                await connection.execute(contribQuery, [
                    submissionId,
                    staffId,
                    staffName,
                    pct,
                    amount
                ]);
            }
        }

        await connection.commit();

        return {
            status: true,
            message: "Billing submitted successfully for manager approval.",
            data: {
                submission_id: submissionId,
                net_amount,
                currency,
                period_label,
                status: 'Pending Manager Approval'
            }
        };

    } catch (error) {
        await connection.rollback();
        console.error("Error submitting billing transaction:", error);
        return { status: false, message: error.message };
    } finally {
        connection.release();
    }
};

// 10. Get Submissions for Approvals (Role-Based Filter: Admin sees all, Manager sees assigned customers)
const getSubmissionsForApprovals = async (staffUserId, status = null) => {
    try {
        const roleRows = await QueryRoleHelperFunction(staffUserId);
        const role = (roleRows && roleRows.length > 0) ? String(roleRows[0].role_name || '').toUpperCase() : '';
        const isAdmin = ['SUPERADMIN', 'ADMIN', 'SUPER ADMIN'].includes(role) || Number(roleRows[0]?.role_id) === 1 || Number(roleRows[0]?.role_id) === 2;

        let query = `
            SELECT 
                bs.id,
                bs.customer_id,
                c.trading_name AS customer_name,
                c.account_manager_id,
                bs.client_id,
                cl.trading_name AS client_name,
                bs.service_id,
                s.name AS service_name,
                bs.job_id,
                IF(j.id IS NOT NULL, CONCAT(
                    SUBSTRING(IFNULL(c.trading_name, ''), 1, 3), '_',
                    SUBSTRING(IFNULL(cl.trading_name, ''), 1, 3), '_',
                    SUBSTRING(IFNULL(jt.type, ''), 1, 4), '_',
                    SUBSTRING(IFNULL(j.job_id, ''), 1, 15)
                ), NULL) AS job_name,
                j.client_job_code,
                jt.type AS job_type_name,
                bs.period_type,
                bs.period_date,
                bs.period_label,
                bs.engagement_model,
                bs.calc_json,
                bs.gross_amount,
                bs.discount_pct,
                bs.discount_amt,
                bs.net_amount,
                bs.currency,
                bs.nomisma_description,
                bs.remark,
                bs.status,
                bs.submitted_by,
                bs.submitted_at,
                bs.save_date,
                bs.submit_date,
                CONCAT(st_sub.first_name, ' ', st_sub.last_name) AS submitted_by_name,
                bs.manager_id,
                CONCAT(st_mgr.first_name, ' ', st_mgr.last_name) AS manager_name,
                bs.manager_approved_at,
                bs.manager_edited,
                bs.manager_changes_json,
                bs.return_note,
                bs.returned_by,
                CONCAT(st_ret.first_name, ' ', st_ret.last_name) AS returned_by_name,
                bs.returned_at,
                bs.nomisma_bill_number,
                bs.nomisma_bill_date,
                bs.due_date,
                bs.paid_date
            FROM billing_submissions bs
            LEFT JOIN customers c ON bs.customer_id = c.id
            LEFT JOIN clients cl ON bs.client_id = cl.id
            LEFT JOIN services s ON bs.service_id = s.id
            LEFT JOIN jobs j ON bs.job_id = j.id
            LEFT JOIN job_types jt ON j.job_type_id = jt.id
            LEFT JOIN staffs st_sub ON bs.submitted_by = st_sub.id
            LEFT JOIN staffs st_mgr ON bs.manager_id = st_mgr.id
            LEFT JOIN staffs st_ret ON bs.returned_by = st_ret.id
            WHERE 1 = 1
        `;

        const params = [];

        if (status && status !== 'all' && status !== 'ALL') {
            query += ` AND bs.status = ?`;
            params.push(status);
        }

        let subordinateStaffIds = [];
        if (!isAdmin) {
            subordinateStaffIds = await getSubordinateStaffIds(staffUserId);
            if (subordinateStaffIds.length > 0) {
                const subPlaceholders = subordinateStaffIds.map(() => '?').join(',');
                query += ` AND (
                    bs.submitted_by = ?
                    OR bs.manager_id = ?
                    OR c.account_manager_id = ?
                    OR bs.submitted_by IN (${subPlaceholders})
                    OR bs.manager_id IN (${subPlaceholders})
                    OR c.account_manager_id IN (${subPlaceholders})
                )`;
                params.push(staffUserId, staffUserId, staffUserId, ...subordinateStaffIds, ...subordinateStaffIds, ...subordinateStaffIds);
            } else {
                query += ` AND (
                    bs.submitted_by = ?
                    OR bs.manager_id = ?
                    OR c.account_manager_id = ?
                )`;
                params.push(staffUserId, staffUserId, staffUserId);
            }
        }

        query += ` ORDER BY bs.id DESC`;

        const [rows] = await pool.execute(query, params);

        // Fetch contributors for each submission
        if (rows.length > 0) {
            const subIds = rows.map(r => r.id);
            const placeholders = subIds.map(() => '?').join(',');
            const [contribRows] = await pool.execute(
                `SELECT submission_id, staff_id, staff_name, pct, amount 
                 FROM billing_submission_contributors 
                 WHERE submission_id IN (${placeholders})`,
                subIds
            );

            const contribMap = {};
            contribRows.forEach(c => {
                if (!contribMap[c.submission_id]) contribMap[c.submission_id] = [];
                contribMap[c.submission_id].push(c);
            });

            rows.forEach(r => {
                r.contributors = contribMap[r.id] || [];
                // Ensure period_label and period_date are formatted to DD/MM/YYYY
                if (r.period_label) {
                    r.period_label = formatDateToDDMMYYYY(r.period_label);
                }
                if (r.period_date) {
                    r.period_date = formatDateToDDMMYYYY(r.period_date);
                }
                try {
                    r.calc_json = typeof r.calc_json === 'string' ? JSON.parse(r.calc_json) : r.calc_json;
                } catch (e) {
                    // keep as is
                }

                // Compute whether the requesting user has manager rights to Approve / Edit / Return
                const isSubmitter = Number(r.submitted_by) === Number(staffUserId);
                const isAssignedMgr = Number(r.manager_id) === Number(staffUserId);
                const isAcctMgr = Number(r.account_manager_id) === Number(staffUserId);
                const isUpperMgr = subordinateStaffIds.includes(Number(r.manager_id)) ||
                                   subordinateStaffIds.includes(Number(r.submitted_by)) ||
                                   subordinateStaffIds.includes(Number(r.account_manager_id));

                if (isAdmin || isAssignedMgr || isAcctMgr || isUpperMgr) {
                    r.can_manage = 1;
                } else {
                    r.can_manage = 0;
                }
            });
        }

        return { status: true, data: rows };
    } catch (error) {
        console.error("Error fetching submissions for approvals:", error);
        return { status: false, message: error.message };
    }
};

// 11. Manager Approve Action
const managerApproveSubmission = async (submissionId, managerUserId) => {
    try {
        const isApproveAll = submissionId === 'all' || submissionId === 'ALL';
        
        if (isApproveAll) {
            const roleRows = await QueryRoleHelperFunction(managerUserId);
            const role = (roleRows && roleRows.length > 0) ? String(roleRows[0].role_name || '').toUpperCase() : '';
            const isAdmin = ['SUPERADMIN', 'ADMIN', 'SUPER ADMIN'].includes(role) || Number(roleRows[0]?.role_id) === 1 || Number(roleRows[0]?.role_id) === 2;

            let allQuery = `
                UPDATE billing_submissions bs
                LEFT JOIN customers c ON bs.customer_id = c.id
                SET bs.status = 'Pending Credit Control Approval',
                    bs.manager_approved_at = NOW(),
                    bs.manager_id = ?
                WHERE bs.status = 'Pending Manager Approval'
            `;
            const allParams = [managerUserId];

            if (!isAdmin) {
                const subordinateStaffIds = await getSubordinateStaffIds(managerUserId);
                if (subordinateStaffIds.length > 0) {
                    const subPlaceholders = subordinateStaffIds.map(() => '?').join(',');
                    allQuery += ` AND (
                        bs.manager_id = ?
                        OR c.account_manager_id = ?
                        OR bs.submitted_by = ?
                        OR bs.submitted_by IN (${subPlaceholders})
                        OR bs.manager_id IN (${subPlaceholders})
                        OR c.account_manager_id IN (${subPlaceholders})
                    )`;
                    allParams.push(managerUserId, managerUserId, managerUserId, ...subordinateStaffIds, ...subordinateStaffIds, ...subordinateStaffIds);
                } else {
                    allQuery += ` AND (
                        bs.manager_id = ?
                        OR c.account_manager_id = ?
                        OR bs.submitted_by = ?
                    )`;
                    allParams.push(managerUserId, managerUserId, managerUserId);
                }
            }

            const [allResult] = await pool.execute(allQuery, allParams);
            return {
                status: true,
                message: `${allResult.affectedRows} submission(s) approved and sent to Credit Control.`
            };
        }

        const [result] = await pool.execute(
            `UPDATE billing_submissions 
             SET status = 'Pending Credit Control Approval',
                 manager_approved_at = NOW(),
                 manager_id = ?
             WHERE id = ? AND status = 'Pending Manager Approval'`,
            [managerUserId, submissionId]
        );

        if (result.affectedRows === 0) {
            return {
                status: false,
                message: "Submission not found or already processed."
            };
        }

        return {
            status: true,
            message: "Submission approved by manager and sent to Credit Control."
        };
    } catch (error) {
        console.error("Error approving submission:", error);
        return { status: false, message: error.message };
    }
};

// 12. Manager Return Action (Rejection with note)
const managerReturnSubmission = async (submissionId, managerUserId, returnNote) => {
    try {
        if (!returnNote || !returnNote.trim()) {
            return { status: false, message: "A reason is required to return an entry." };
        }

        const [result] = await pool.execute(
            `UPDATE billing_submissions 
             SET status = 'Returned',
                 return_note = ?,
                 returned_by = ?,
                 returned_at = NOW()
             WHERE id = ? AND status = 'Pending Manager Approval'`,
            [returnNote.trim(), managerUserId || null, submissionId]
        );

        if (result.affectedRows === 0) {
            return {
                status: false,
                message: "Submission not found or already processed."
            };
        }

        // Fetch details to send email notification to the submitter
        try {
            const [subDetails] = await pool.execute(
                `SELECT 
                    bs.id,
                    bs.period_label,
                    bs.net_amount,
                    bs.currency,
                    bs.engagement_model,
                    c.trading_name AS customer_name,
                    cl.trading_name AS client_name,
                    s.name AS service_name,
                    st_sub.email AS submitter_email,
                    CONCAT(st_sub.first_name, ' ', st_sub.last_name) AS submitter_name,
                    st_mgr.email AS manager_email,
                    CONCAT(st_mgr.first_name, ' ', st_mgr.last_name) AS manager_name
                 FROM billing_submissions bs
                 LEFT JOIN customers c ON bs.customer_id = c.id
                 LEFT JOIN clients cl ON bs.client_id = cl.id
                 LEFT JOIN services s ON bs.service_id = s.id
                 LEFT JOIN staffs st_sub ON bs.submitted_by = st_sub.id
                 LEFT JOIN staffs st_mgr ON st_mgr.id = ?
                 WHERE bs.id = ?`,
                [managerUserId || null, submissionId]
            );

            if (subDetails && subDetails.length > 0) {
                const item = subDetails[0];
                // Send email strictly to the staff who submitted the bill (NO CC to anyone else)
                const primaryTo = item.submitter_email ? item.submitter_email.trim() : null;

                if (!primaryTo) {
                    console.warn(`[Billing Email] No submitter email found for submission #${submissionId}. Skipping email dispatch.`);
                    return {
                        status: true,
                        message: "Submission returned for correction (Email skipped: submitter email not found)."
                    };
                }

                const customerName = item.customer_name || 'Customer';
                const periodLabel = item.period_label || 'Current Period';
                const managerName = (item.manager_name && item.manager_name.trim()) ? item.manager_name : 'Approving Manager';
                const submitterName = (item.submitter_name && item.submitter_name.trim()) ? item.submitter_name : 'Team Member';
                const actualSubmitterEmail = item.submitter_email || 'N/A';
                const note = returnNote.trim();

                const clientPart = item.client_name ? ` - ${item.client_name}` : '';
                const subjectEmail = `Billing Submission Returned - ${customerName}${clientPart}`;
                const htmlEmail = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <!-- Header with Outbooks Primary Cyan/Teal Brand Color -->
                        <div style="background: linear-gradient(135deg, #00a4bd 0%, #26bdf0 100%); padding: 22px 24px; color: #ffffff;">
                            <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; color: #ffffff;">Outbooks Billing</h2>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: #e0f7fa;">Billing Submission Returned</p>
                        </div>

                        <!-- Body Content -->
                        <div style="padding: 24px;">
                            <p style="margin: 0 0 14px 0; font-size: 15px;">Hi <strong>${submitterName}</strong>,</p>
                            <p style="margin: 0 0 18px 0; color: #475569;">
                                Your billing submission has been returned for review/correction by <strong>${managerName}</strong>.
                            </p>
                            
                            <!-- Reason Box -->
                            <div style="background-color: #fff1f2; border-left: 4px solid #f43f5e; border-radius: 6px; padding: 14px 16px; margin: 18px 0;">
                                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #e11d48; margin-bottom: 4px;">Return Reason / Note:</div>
                                <div style="color: #334155; font-size: 14px; font-weight: 500; white-space: pre-wrap;">${note}</div>
                            </div>

                            <!-- Details Table (Cleaned up: No Submission ID, Period, Engagement Model, Amount) -->
                            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; background-color: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #f1f5f9;">
                                <tr>
                                    <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 32%;">Submitted By:</td>
                                    <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${submitterName} <span style="font-size: 12px; font-weight: normal; color: #64748b;">(${actualSubmitterEmail})</span></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Customer:</td>
                                    <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${customerName}</td>
                                </tr>
                                ${item.client_name ? `
                                <tr>
                                    <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Client:</td>
                                    <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${item.client_name}</td>
                                </tr>` : ''}
                                ${item.service_name ? `
                                <tr>
                                    <td style="padding: 10px 14px; color: #64748b;">Service:</td>
                                    <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">${item.service_name}</td>
                                </tr>` : ''}
                            </table>

                            <p style="margin: 22px 0 0 0; color: #475569; font-size: 13.5px;">
                                Please visit the <strong>Submit Billing</strong> tab to make the required updates and submit again.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 24px; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                                Outbooks Billing System • Automated Notification
                            </p>
                        </div>
                    </div>
                `;

                // Retry logic for Cloud/Dev environments
                const sendReturnEmailWithRetry = async (to, subject, html, maxAttempts = 3) => {
                    console.log(`[Billing Email] ==================== RETURN EMAIL DISPATCH ====================`);
                    console.log(`[Billing Email] Submission ID: #${submissionId}`);
                    console.log(`[Billing Email] Recipient TO: ${to} (Submitter only)`);
                    console.log(`[Billing Email] Subject: "${subject}"`);
                    console.log(`[Billing Email] Submitter: ${submitterName}`);
                    
                    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                        console.log(`[Billing Email] >>> Attempt ${attempt}/${maxAttempts} sending now...`);
                        const startTime = Date.now();
                        try {
                            const sent = await Promise.race([
                                commonEmail(to, subject, html, null),
                                new Promise((_, reject) => setTimeout(() => reject(new Error("SMTP timeout after 10s")), 10000))
                            ]);
                            const elapsed = Date.now() - startTime;
                            if (sent) {
                                console.log(`[Billing Email] SUCCESS on attempt ${attempt} in ${elapsed}ms! Email delivered to SMTP.`);
                                console.log(`[Billing Email] ==============================================================`);
                                return true;
                            } else {
                                console.warn(`[Billing Email] WARNING: Attempt ${attempt} failed in ${elapsed}ms (commonEmail returned false).`);
                            }
                        } catch (attemptErr) {
                            const elapsed = Date.now() - startTime;
                            console.error(`[Billing Email] ERROR on attempt ${attempt} in ${elapsed}ms:`, attemptErr?.message || attemptErr);
                        }

                        if (attempt < maxAttempts) {
                            const delayMs = attempt * 1500;
                            console.log(`[Billing Email] Pausing ${delayMs}ms before retry...`);
                            await new Promise(res => setTimeout(res, delayMs));
                        }
                    }
                    console.error(`[Billing Email] FAILED: All ${maxAttempts} attempts exhausted to send return email.`);
                    console.log(`[Billing Email] ==============================================================`);
                    return false;
                };

                await sendReturnEmailWithRetry(primaryTo, subjectEmail, htmlEmail);
            }
        } catch (emailQueryErr) {
            console.error("[Billing Email] Error fetching submitter details for email notification:", emailQueryErr);
        }

        return {
            status: true,
            message: "Submission returned for correction."
        };
    } catch (error) {
        console.error("Error returning submission:", error);
        return { status: false, message: error.message };
    }
};

// 12.1 Manager Reject Action
const managerRejectSubmission = async (submissionId, managerUserId, reason = '') => {
    try {
        const [result] = await pool.execute(
            `UPDATE billing_submissions 
             SET status = 'Rejected',
                 return_note = ?,
                 returned_by = ?,
                 returned_at = NOW()
             WHERE id = ? AND status = 'Pending Manager Approval'`,
            [reason ? reason.trim() : 'Rejected by Manager', managerUserId, submissionId]
        );

        if (result.affectedRows === 0) {
            return {
                status: false,
                message: "Submission not found or already processed."
            };
        }

        return {
            status: true,
            message: "Submission rejected successfully."
        };
    } catch (error) {
        console.error("Error rejecting submission:", error);
        return { status: false, message: error.message };
    }
};

// 13. Manager Edit Submission Action
const managerEditSubmission = async (submissionId, managerUserId, editData) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        const {
            gross_amount,
            discount_pct,
            discount_amt,
            net_amount,
            calc_json,
            contributors,
            edit_reason
        } = editData;

        // Fetch existing
        const [existing] = await connection.execute(
            `SELECT id, gross_amount, discount_pct, discount_amt, net_amount, calc_json, status 
             FROM billing_submissions 
             WHERE id = ?`,
            [submissionId]
        );

        if (existing.length === 0) {
            await connection.rollback();
            return { status: false, message: "Submission not found." };
        }

        const changesSnapshot = {
            edited_by: managerUserId,
            edited_at: new Date(),
            reason: edit_reason || "Manager adjusted figures",
            previous: {
                gross_amount: existing[0].gross_amount,
                discount_pct: existing[0].discount_pct,
                discount_amt: existing[0].discount_amt,
                net_amount: existing[0].net_amount,
                calc_json: existing[0].calc_json
            },
            updated: {
                gross_amount,
                discount_pct,
                discount_amt,
                net_amount,
                calc_json
            }
        };

        const updateQuery = `
            UPDATE billing_submissions
            SET 
                gross_amount = ?,
                discount_pct = ?,
                discount_amt = ?,
                net_amount = ?,
                calc_json = ?,
                manager_edited = 1,
                manager_changes_json = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        await connection.execute(updateQuery, [
            gross_amount,
            discount_pct,
            discount_amt,
            net_amount,
            typeof calc_json === 'object' ? JSON.stringify(calc_json) : String(calc_json),
            JSON.stringify(changesSnapshot),
            submissionId
        ]);

        // If contributors provided, update them
        if (Array.isArray(contributors) && contributors.length > 0) {
            await connection.execute(
                `DELETE FROM billing_submission_contributors WHERE submission_id = ?`,
                [submissionId]
            );

            const contribQuery = `
                INSERT INTO billing_submission_contributors (
                    submission_id,
                    staff_id,
                    staff_name,
                    pct,
                    amount
                ) VALUES (?, ?, ?, ?, ?)
            `;

            for (const c of contributors) {
                const staffId = c.staff_id || managerUserId;
                const staffName = c.staff_name || c.name || 'Contributor';
                const pct = parseFloat(c.pct) || 0;
                const amount = parseFloat(((net_amount * pct) / 100).toFixed(2));

                await connection.execute(contribQuery, [
                    submissionId,
                    staffId,
                    staffName,
                    pct,
                    amount
                ]);
            }
        }

        await connection.commit();
        return {
            status: true,
            message: "Submission updated successfully.",
            data: { submission_id: submissionId, net_amount }
        };

    } catch (error) {
        await connection.rollback();
        console.error("Error updating submission by manager:", error);
        return { status: false, message: error.message };
    } finally {
        connection.release();
    }
};


// 14. Mark Submission as Billed (Generate Invoice in billing_submissions)
const markSubmissionBilled = async (submissionId, staffUserId, billNumber, billDate, dueDate = null) => {
    try {
        if (!billNumber || !billNumber.trim()) {
            return { status: false, message: 'Bill number is required.' };
        }
        if (!billDate) {
            return { status: false, message: 'Bill date is required.' };
        }

        const calculatedDueDate = dueDate || new Date(new Date(billDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const [result] = await pool.execute(
            `UPDATE billing_submissions 
             SET status = 'Invoiced',
                 nomisma_bill_number = ?,
                 nomisma_bill_date = ?,
                 due_date = ?,
                 cc_approved_by = ?,
                 cc_approved_at = NOW(),
                 updated_at = NOW()
             WHERE id = ? AND status IN ('Pending Credit Control Approval', 'Approved')`,
            [billNumber.trim(), billDate, calculatedDueDate, staffUserId, submissionId]
        );

        if (result.affectedRows === 0) {
            return { status: false, message: 'Submission not found or already billed/processed.' };
        }

        return {
            status: true,
            message: 'Bill generated and marked as invoiced successfully.',
            data: { submission_id: submissionId, bill_number: billNumber.trim(), bill_date: billDate, due_date: calculatedDueDate }
        };
    } catch (error) {
        console.error('Error marking submission as billed:', error);
        return { status: false, message: error.message };
    }
};

// 14.b Bulk Mark Submissions as Billed
const markSubmissionsBulkBilled = async (submissionIds, staffUserId, billNumber, billDate, dueDate = null) => {
    try {
        if (!Array.isArray(submissionIds) || submissionIds.length === 0) {
            return { status: false, message: 'Please select at least one submission to bill.' };
        }
        if (!billDate) {
            return { status: false, message: 'Bill date is required.' };
        }

        const calculatedDueDate = dueDate || new Date(new Date(billDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const placeholders = submissionIds.map(() => '?').join(',');

        let query = ``;
        let params = [];

        if (billNumber && billNumber.trim()) {
            query = `UPDATE billing_submissions 
                     SET status = 'Invoiced',
                         nomisma_bill_number = ?,
                         nomisma_bill_date = ?,
                         due_date = ?,
                         cc_approved_by = ?,
                         cc_approved_at = NOW(),
                         updated_at = NOW()
                     WHERE id IN (${placeholders}) AND status IN ('Pending Credit Control Approval', 'Approved')`;
            params = [billNumber.trim(), billDate, calculatedDueDate, staffUserId, ...submissionIds];
        } else {
            // Auto-generate INV-<id> for each if common billNumber is blank
            query = `UPDATE billing_submissions 
                     SET status = 'Invoiced',
                         nomisma_bill_number = CONCAT('INV-', id),
                         nomisma_bill_date = ?,
                         due_date = ?,
                         cc_approved_by = ?,
                         cc_approved_at = NOW(),
                         updated_at = NOW()
                     WHERE id IN (${placeholders}) AND status IN ('Pending Credit Control Approval', 'Approved')`;
            params = [billDate, calculatedDueDate, staffUserId, ...submissionIds];
        }

        const [result] = await pool.execute(query, params);

        if (result.affectedRows === 0) {
            return { status: false, message: 'No eligible submissions were updated. They may already be billed or not approved yet.' };
        }

        return {
            status: true,
            message: `${result.affectedRows} ${result.affectedRows === 1 ? 'bill' : 'bills'} generated and marked as invoiced successfully.`,
            data: { updatedCount: result.affectedRows }
        };
    } catch (error) {
        console.error('Error in bulk marking submissions as billed:', error);
        return { status: false, message: error.message };
    }
};

// 15. Record or Clear Payment for Invoiced Submission
const recordInvoicePayment = async (submissionId, staffUserId, paidDate = null) => {
    try {
        const [result] = await pool.execute(
            `UPDATE billing_submissions 
             SET paid_date = ?,
                 updated_at = NOW()
             WHERE id = ? AND status = 'Invoiced'`,
            [paidDate || null, submissionId]
        );

        if (result.affectedRows === 0) {
            return { status: false, message: 'Invoiced submission not found.' };
        }

        return {
            status: true,
            message: paidDate ? 'Payment recorded successfully.' : 'Payment cleared.',
            data: { submission_id: submissionId, paid_date: paidDate }
        };
    } catch (error) {
        console.error('Error updating payment status:', error);
        return { status: false, message: error.message };
    }
};


// 16. Check User Billing Permissions (can_create_job / can_submit_billing, is_line_manager, can_approve, is_admin)
const checkApproverAccess = async (staffUserId) => {
    try {
        if (!staffUserId) {
            return {
                status: true,
                is_line_manager: false,
                is_admin: false,
                can_approve: false,
                can_create_job: false
            };
        }

        const roleRows = await QueryRoleHelperFunction(staffUserId);
        const role = (roleRows && roleRows.length > 0) ? String(roleRows[0].role_name || '').toUpperCase() : '';
        const roleId = Number(roleRows[0]?.role_id);
        const isAdmin = ['SUPERADMIN', 'ADMIN', 'SUPER ADMIN'].includes(role) || roleId === 1 || roleId === 2;

        if (isAdmin) {
            return {
                status: true,
                is_line_manager: true,
                is_admin: true,
                can_approve: true,
                can_create_job: true
            };
        }

        // 1. Check if user is a Line Manager (has subordinates where staff_to = staffUserId)
        // or is designated as an Account Manager for any customer
        const [lmRows] = await pool.execute(
            'SELECT 1 FROM line_managers WHERE staff_to = ? LIMIT 1',
            [staffUserId]
        );
        const [amRows] = await pool.execute(
            'SELECT 1 FROM customers WHERE account_manager_id = ? LIMIT 1',
            [staffUserId]
        );
        const isLineManager = lmRows.length > 0 || amRows.length > 0;

        // 2. Check if user has permission to create job (permission_name = 'job' and type = 'insert')
        const [jobPermRows] = await pool.execute(
            `SELECT 1 
              FROM role_permissions rp
              JOIN permissions p ON rp.permission_id = p.id
              WHERE rp.role_id = ? AND p.permission_name = 'job' AND p.type = 'insert'
              LIMIT 1`,
            [roleId]
        );
        const canCreateJob = jobPermRows.length > 0;

        return {
            status: true,
            is_line_manager: isLineManager,
            is_admin: false,
            can_approve: isLineManager,
            can_create_job: canCreateJob
        };
    } catch (error) {
        console.error('Error in checkApproverAccess:', error);
        return { status: false, message: error.message };
    }
};


// 17. Get Billing Dashboard Counts (Submitted, Approved, Credit Control, Returned)
const getBillingDashboardMetrics = async (staffUserId) => {
    try {
        let isAdmin = false;
        if (staffUserId) {
            const roleRows = await QueryRoleHelperFunction(staffUserId);
            const role = (roleRows && roleRows.length > 0) ? String(roleRows[0].role_name || '').toUpperCase() : '';
            const roleId = Number(roleRows[0]?.role_id);
            isAdmin = ['SUPERADMIN', 'ADMIN', 'SUPER ADMIN'].includes(role) || roleId === 1 || roleId === 2;
        }

        let baseWhere = '1 = 1';
        const params = [];

        // If not admin: show metrics for submissions submitted by user, or managed in hierarchy
        if (!isAdmin && staffUserId) {
            const subordinateStaffIds = await getSubordinateStaffIds(staffUserId);
            if (subordinateStaffIds.length > 0) {
                const subPlaceholders = subordinateStaffIds.map(() => '?').join(',');
                baseWhere += ` AND (
                    bs.submitted_by = ?
                    OR bs.manager_id = ?
                    OR c.account_manager_id = ?
                    OR bs.submitted_by IN (${subPlaceholders})
                    OR bs.manager_id IN (${subPlaceholders})
                    OR c.account_manager_id IN (${subPlaceholders})
                )`;
                params.push(staffUserId, staffUserId, staffUserId, ...subordinateStaffIds, ...subordinateStaffIds, ...subordinateStaffIds);
            } else {
                baseWhere += ` AND (
                    bs.submitted_by = ?
                    OR bs.manager_id = ?
                    OR c.account_manager_id = ?
                )`;
                params.push(staffUserId, staffUserId, staffUserId);
            }
        }

        const query = `
            SELECT 
                COUNT(*) AS total_submitted,
                SUM(CASE WHEN bs.status IN ('Pending Credit Control Approval', 'Approved', 'Invoiced') THEN 1 ELSE 0 END) AS total_approved,
                SUM(CASE WHEN bs.status = 'Pending Credit Control Approval' THEN 1 ELSE 0 END) AS pending_credit_control,
                SUM(CASE WHEN bs.status = 'Returned' THEN 1 ELSE 0 END) AS total_returned,
                SUM(CASE WHEN bs.status = 'Pending Manager Approval' THEN 1 ELSE 0 END) AS pending_manager_approval,
                SUM(CASE WHEN bs.status = 'Invoiced' THEN 1 ELSE 0 END) AS total_invoiced
            FROM billing_submissions bs
            LEFT JOIN customers c ON bs.customer_id = c.id
            WHERE ${baseWhere}
        `;

        const [rows] = await pool.execute(query, params);
        const data = rows[0] || {};

        return {
            status: true,
            data: {
                totalSubmitted: Number(data.total_submitted) || 0,
                totalApproved: Number(data.total_approved) || 0,
                pendingCreditControl: Number(data.pending_credit_control) || 0,
                totalReturned: Number(data.total_returned) || 0,
                pendingManagerApproval: Number(data.pending_manager_approval) || 0,
                totalInvoiced: Number(data.total_invoiced) || 0
            }
        };
    } catch (error) {
        console.error('Error fetching billing dashboard metrics:', error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    getActiveCustomers,
    getActiveClients,
    getCustomerEngagementDetails,
    getClientsByCustomer,
    getJobsByCustomerOrClient,
    getAllActiveServices,
    getJobTypesByService,
    getServicesByClient,
    getTimesheetContributors,
    submitBilling,
    getSubmissionsForApprovals,
    managerApproveSubmission,
    managerReturnSubmission,
    managerRejectSubmission,
    managerEditSubmission,
    markSubmissionBilled,
    markSubmissionsBulkBilled,
    recordInvoicePayment,
    checkApproverAccess,
    getBillingDashboardMetrics
};

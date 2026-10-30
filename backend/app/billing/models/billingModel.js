const pool = require('../../config/database');
const { 
    LineManageStaffIdHelperFunction, 
    QueryRoleHelperFunction, 
    buildAssignedJobsTempTable 
} = require('../../utils/helper');

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
        const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);
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
const getCustomerEngagementDetails = async (customerId) => {
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
        console.log("getCustomerEngagementDetails rows found:", rows.length, rows[0]);

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
        const lineManager = (firstRow.staff_line_manager || firstRow.am_line_manager || '').trim() || null;
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


// 4. Get Clients for a Customer
const getClientsByCustomer = async (customerId, StaffUserId = null, search = '', page = null, limit = null) => {
    try {
        if (!customerId) return { status: true, data: [] };

        const searchTerm = `%${search || ''}%`;
        let limitClause = '';
        if (page && limit) {
            const offset = (Number(page) - 1) * Number(limit);
            limitClause = ` LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
        }

        let query = `
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
    } catch (error) {
        console.error("Error fetching clients by customer:", error);
        return { status: false, message: error.message };
    }
};

// 5. Get Jobs for a Customer and/or Client
const getJobsByCustomerOrClient = async (customerId, clientId = null) => {
    try {
        if (!customerId && !clientId) return { status: true, data: [] };

        let query = `
            SELECT 
                j.id AS job_id,
                j.customer_id,
                j.client_id,
                j.service_id,
                j.job_type_id,
                j.job_id AS raw_job_id,
                j.client_job_code,
                s.name AS service_name,
                jt.type AS job_type_name,
                CONCAT(
                    SUBSTRING(c.trading_name, 1, 3), '_',
                    SUBSTRING(cl.trading_name, 1, 3), '_',
                    SUBSTRING(jt.type, 1, 4), '_',
                    SUBSTRING(j.job_id, 1, 15)
                ) AS job_code_id
            FROM jobs j
            LEFT JOIN customers c ON j.customer_id = c.id
            LEFT JOIN clients cl ON j.client_id = cl.id
            LEFT JOIN services s ON j.service_id = s.id
            LEFT JOIN job_types jt ON j.job_type_id = jt.id
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

        query += ` ORDER BY j.id DESC`;

        const [rows] = await pool.execute(query, params);
        return { status: true, data: rows };
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

// 8. Get Services from existing jobs for a given client
const getServicesByClient = async (clientId) => {
    try {
        if (!clientId) {
            return { status: true, data: [] };
        }
        const query = `
            SELECT DISTINCT 
                s.id AS service_id, 
                s.name AS service_name
            FROM jobs j
            JOIN services s ON j.service_id = s.id
            WHERE j.client_id = ?
            ORDER BY s.name ASC
        `;
        const [rows] = await pool.execute(query, [clientId]);
        return { status: true, data: rows };
    } catch (error) {
        console.error("Error fetching services by client:", error);
        return { status: false, message: error.message };
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
            manager_id = null,
            contributors = []
        } = payload;

        // Validation
        if (!customer_id || !client_id || !service_id || !period_label || !net_amount) {
            await connection.rollback();
            return {
                status: false,
                message: "Customer, Client, Service, Period Label and Net Amount are required."
            };
        }

        // Dedupe Key for duplicate prevention (Rule 5)
        const dedupeKey = `${client_id}_${service_id}_${period_label}`;

        // Check if live submission already exists (not Returned and not Superseded)
        const [existing] = await connection.execute(
            `SELECT id, status, period_label FROM billing_submissions 
             WHERE dedupe_key = ? 
             AND status NOT IN ('Returned', 'Superseded') 
             LIMIT 1`,
            [dedupeKey]
        );

        if (existing && existing.length > 0) {
            await connection.rollback();
            return {
                status: false,
                isDuplicate: true,
                message: `Billing has already been submitted for this client & service for period ${period_label} (Status: ${existing[0].status}).`
            };
        }

        // If manager_id is not passed, lookup from customer's account_manager_id
        let finalManagerId = manager_id;
        if (!finalManagerId) {
            const [custRows] = await connection.execute(
                `SELECT account_manager_id, staff_id FROM customers WHERE id = ? LIMIT 1`,
                [customer_id]
            );
            if (custRows.length > 0) {
                finalManagerId = custRows[0].account_manager_id || custRows[0].staff_id || null;
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
                period_end,
                dedupe_key,
                engagement_model,
                calc_json,
                gross_amount,
                discount_pct,
                discount_amt,
                net_amount,
                currency,
                nomisma_description,
                status,
                submitted_by,
                submitted_at,
                manager_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Manager Approval', ?, NOW(), ?)
        `;

        const subParams = [
            customer_id,
            client_id,
            service_id,
            job_id || null,
            period_type,
            period_date,
            period_label,
            period_end || null,
            dedupeKey,
            typeof engagement_model === 'object' ? JSON.stringify(engagement_model) : String(engagement_model),
            typeof calc_json === 'object' ? JSON.stringify(calc_json) : String(calc_json),
            gross_amount,
            discount_pct,
            discount_amt,
            net_amount,
            currency,
            nomisma_description,
            submittedByStaffId,
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
const getSubmissionsForApprovals = async (staffUserId, status = 'Pending Manager Approval') => {
    try {
        const roleRows = await QueryRoleHelperFunction(staffUserId);
        const role = (roleRows && roleRows.length > 0) ? String(roleRows[0].role_name || '').toUpperCase() : '';
        const isAdmin = ['SUPERADMIN', 'ADMIN', 'SUPER ADMIN'].includes(role) || Number(roleRows[0]?.role_id) === 1 || Number(roleRows[0]?.role_id) === 2;

        let query = `
            SELECT 
                bs.id,
                bs.customer_id,
                c.trading_name AS customer_name,
                bs.client_id,
                cl.trading_name AS client_name,
                bs.service_id,
                s.name AS service_name,
                bs.job_id,
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
                bs.status,
                bs.submitted_by,
                bs.submitted_at,
                CONCAT(st_sub.first_name, ' ', st_sub.last_name) AS submitted_by_name,
                bs.manager_id,
                CONCAT(st_mgr.first_name, ' ', st_mgr.last_name) AS manager_name,
                bs.manager_approved_at,
                bs.manager_edited,
                bs.manager_changes_json,
                bs.return_note,
                bs.returned_by,
                bs.returned_at
            FROM billing_submissions bs
            LEFT JOIN customers c ON bs.customer_id = c.id
            LEFT JOIN clients cl ON bs.client_id = cl.id
            LEFT JOIN services s ON bs.service_id = s.id
            LEFT JOIN staffs st_sub ON bs.submitted_by = st_sub.id
            LEFT JOIN staffs st_mgr ON bs.manager_id = st_mgr.id
            WHERE 1 = 1
        `;

        const params = [];

        if (status) {
            query += ` AND bs.status = ?`;
            params.push(status);
        }

        // If not Admin/Super Admin, filter strictly for this Account Manager
        if (!isAdmin) {
            query += ` AND (bs.manager_id = ? OR c.account_manager_id = ?)`;
            params.push(staffUserId, staffUserId);
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
                try {
                    r.calc_json = typeof r.calc_json === 'string' ? JSON.parse(r.calc_json) : r.calc_json;
                } catch (e) {
                    // keep as is
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
                allQuery += ` AND (bs.manager_id = ? OR c.account_manager_id = ?)`;
                allParams.push(managerUserId, managerUserId);
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
            [returnNote.trim(), managerUserId, submissionId]
        );

        if (result.affectedRows === 0) {
            return {
                status: false,
                message: "Submission not found or already processed."
            };
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

module.exports = {
    getActiveCustomers,
    getActiveClients,
    getCustomerEngagementDetails,
    getClientsByCustomer,
    getJobsByCustomerOrClient,
    getAllActiveServices,
    getJobTypesByService,
    getServicesByClient,
    submitBilling,
    getSubmissionsForApprovals,
    managerApproveSubmission,
    managerReturnSubmission,
    managerEditSubmission
};
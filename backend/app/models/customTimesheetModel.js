const pool = require('../config/database');
const { QueryRoleHelperFunction, LineManageStaffIdHelperFunction, LineManageStaffIdHelperFunctionForStaff } = require('../../app/utils/helper');

// We are importing existing models to fallback for complex queries that you haven't modified yet.
// As you modify these queries, replace the model calls with your own SQL queries below.
const customerModel = require('./customerModel');
const clientModel = require('./clientModel');
const jobModel = require('./jobModel');
const staffsModel = require('./staffsModel');
const reportModel = require('./reportModel');

const expandFilters = async (data) => {
    const filters = data.filters || {};
    
    const hasValidStaffId = filters.staff_id && (Array.isArray(filters.staff_id) ? filters.staff_id.length > 0 : true);
    const hasValidLineManager = filters.line_manager && (Array.isArray(filters.line_manager) ? filters.line_manager.length > 0 : true);

    // If staff is selected, expand it using the same logic as when a user logs in
    if (hasValidStaffId) {
        let expanded = [];
        const arr = Array.isArray(filters.staff_id) ? filters.staff_id : [filters.staff_id];
        for (const id of arr) {
            if (!["", null, undefined].includes(id)) {
                let sub = await LineManageStaffIdHelperFunction(id);
                expanded.push(...sub);
            }
        }
        filters.staff_id = [...new Set(expanded)];
    } 
    // If line manager is selected (and no staff), expand it to prevent Superadmin bypass
    else if (hasValidLineManager) {
        let expanded = [];
        const arr = Array.isArray(filters.line_manager) ? filters.line_manager : [filters.line_manager];
        for (const id of arr) {
            if (!["", null, undefined].includes(id)) {
                let sub = await LineManageStaffIdHelperFunctionForStaff(id);
                expanded.push(...sub, id);
            }
        }
        // Set to staff_id so customerModel.js treats it as a non-empty filterStaffId
        filters.staff_id = [...new Set(expanded)];
    }
    
    data.filters = filters;
    return data;
};

const get_customers_filter_custom = async (data) => {
    data = await expandFilters(data);
    return await customerModel.get_customers_filter(data); 
}

const get_clients_filter_custom = async (data) => {
    data = await expandFilters(data);
    return await clientModel.get_clients_filter(data);
}

const get_jobs_filter_custom = async (data) => {
    data = await expandFilters(data);
    return await jobModel.get_jobs_filter(data);
}

const getStaffByFilter_custom = async (data) => {
    data = await expandFilters(data);
    return await staffsModel.getStaffByFilter(data);
}

const getStaff_custom = async (data) => {
    return await staffsModel.getStaff(data);
}

const get_active_line_managers_custom = async (data) => {
    let { page, limit, search } = data.pagination || {};
    page = Number(page) || 1;
    limit = Number(limit) || 20;
    const offset = (page - 1) * limit;

    let searchCondition = "";
    let staffCondition = "";
    let queryParams = [];

    if (data.filters && data.filters.staff_id && data.filters.staff_id.length > 0) {
        staffCondition = ` AND lm.staff_by IN (?)`;
        queryParams.push(data.filters.staff_id);
    }

    if (search) {
        searchCondition = `
            AND (
                s.first_name LIKE ?
                OR s.last_name LIKE ?
                OR CONCAT(s.first_name, ' ', s.last_name) LIKE ?
                OR s.email LIKE ?
                OR s.employee_number LIKE ?
            )
        `;
        const searchPattern = `%${search}%`;
        queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const countQuery = `
        SELECT COUNT(DISTINCT s.id) as total
        FROM staffs s
        JOIN line_managers lm ON s.id = lm.staff_to
        WHERE s.status = '1'
        ${staffCondition}
        ${searchCondition}
    `;

    const query = `
        SELECT DISTINCT 
            s.id, 
            s.first_name, 
            s.last_name, 
            s.email, 
            s.employee_number,
            s.status
        FROM staffs s
        JOIN line_managers lm ON s.id = lm.staff_to
        WHERE s.status = '1'
        ${staffCondition}
        ${searchCondition}
        ORDER BY s.first_name ASC
        LIMIT ? OFFSET ?
    `;

    try {
        const [countResult] = await pool.query(countQuery, queryParams);
        const total = countResult[0]?.total || 0;

        const [rows] = await pool.query(query, [...queryParams, limit, offset]);

        return { 
            status: true, 
            message: "Success", 
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error("Error in get_active_line_managers_custom:", error);
        return { status: false, message: "Error fetching active line managers." };
    }
}

const get_my_line_managers_custom = async (data) => {
    return await staffsModel.getMyLineManagers(data);
}

const getStaffWithRole_custom = async (data) => {
    return await reportModel.getStaffWithRole({ data: data, StaffUserId: data.StaffUserId });
}

module.exports = {
    get_customers_filter_custom,
    get_clients_filter_custom,
    get_jobs_filter_custom,
    getStaffByFilter_custom,
    getStaff_custom,
    get_active_line_managers_custom,
    get_my_line_managers_custom,
    getStaffWithRole_custom
};

const customerService = require('../../services/customers/customerService');
const pool = require('../../config/database');
const bcrypt = require("bcryptjs");
const { commonEmail } = require("../../utils/commonEmail");
const e = require('cors');
const jwt = require("jsonwebtoken");
const { getStaffAccessFilters } = require("../../utils/helper");
const { CustomerLogUpdateOperation } = require("../../utils/customerHelper");

exports.customerLogin = async (req, res) => {
  const { email, password } = req.body;

  const [[customer]] = await pool.query(`SELECT * FROM staffs WHERE email = ? AND role_id = 12`, [email]);

  if (!customer) {
    return res.json({ status: false, message: "Customer not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, customer.password);
  if (!isPasswordValid) {
    return res.json({ status: false, message: "Please enter a valid password" });
  }

  if (Number(customer.is_first_login) === 0) {
    return res.json({
      status: true,
      step: "CHANGE_PASSWORD",
      customer_user_id: customer.id
    })
  }

  const token = jwt.sign(
    { userId: customer.id, role: "CUSTOMER" },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  await pool.query(`UPDATE staffs SET login_auth_token = ? WHERE id = ?`, [token, customer.id]);

  // Log Login Activity
  const currentDate = new Date();
  await CustomerLogUpdateOperation({
    staff_id: customer.id,
    date: currentDate.toISOString().split("T")[0],
    module_name: "-",
    log_message: `Logged in.`,
    permission_type: "-",
    ip: req.ip,
  });

  res.cookie("customer_token", token, {
    httpOnly: true,
    secure: false, // production me true
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({
    status: true,
    message: "Customer login successful",
    customer,
    token
  });
};

exports.customerLogout = async (req, res) => {
  try {
    const userId = req.userId;
    const currentDate = new Date();
    
    if (userId) {
      await CustomerLogUpdateOperation({
        staff_id: userId,
        date: currentDate.toISOString().split("T")[0],
        module_name: "-",
        log_message: `Logged out.`,
        permission_type: "-",
        ip: req.ip,
      });
    }

    res.clearCookie("customer_token");
    res.json({ status: true, message: "Logged out successfully" });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.customerUpdatePassword = async (req, res) => {
  const { customer_user_id, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE staffs SET password = ?, is_first_login = 1 WHERE id = ?`, [hashedPassword, customer_user_id]);

    const [[customer]] = await pool.query(`SELECT * FROM staffs WHERE id = ?`, [customer_user_id]);

    const token = jwt.sign(
      { userId: customer.id, role: "CUSTOMER" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    await pool.query(`UPDATE staffs SET login_auth_token = ? WHERE id = ?`, [token, customer_user_id]);

    // Log Password Update
    const currentDate = new Date();
    await CustomerLogUpdateOperation({
      staff_id: customer_user_id,
      date: currentDate.toISOString().split("T")[0],
      module_name: "-",
      log_message: `Updated Password successfully`,
      permission_type: "-",
      ip: req.ip,
    });

    res.cookie("customer_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      status: true,
      message: "Password updated successfully",
      customer,
      token
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message
    });
  }
};

exports.getAssignedCustomers = async (req, res) => {
  const userId = req.userId;

  try {
    const access = await getStaffAccessFilters(userId);
    const assignedIds = access.assignedCustomerIds;

    if (assignedIds.length === 0) {
      return res.json({ status: true, message: "No assigned customers found", data: [] });
    }

    const query = `
      SELECT 
        c.id,
        c.customer_type,
        c.staff_id,
        CONCAT(s1.first_name, ' ', s1.last_name) AS customer_created_by,
        c.account_manager_id,
        c.trading_name,
        c.trading_address,
        c.vat_registered,
        c.vat_number,
        c.website,
        c.form_process,
        DATE_FORMAT(c.created_at, '%d/%m/%Y') AS created_at,
        DATE_FORMAT(c.updated_at, '%d/%m/%Y') AS updated_at,
        c.status,
        s2.first_name AS account_manager_firstname,
        s2.last_name AS account_manager_lastname,
        s2.employee_number AS account_manager_employee_number,
        CONCAT(
            'cust_',
            SUBSTRING(c.trading_name, 1, 3), '_',
            SUBSTRING(c.customer_code, 1, 15)
        ) AS customer_code
      FROM customers c
      LEFT JOIN staffs s1 ON c.staff_id = s1.id
      LEFT JOIN staffs s2 ON c.account_manager_id = s2.id
      WHERE c.id IN (${assignedIds.join(',')})
    `;

    const [rows] = await pool.query(query);

    res.json({
      status: true,
      message: "Assigned customers fetched successfully",
      data: rows
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message
    });
  }
};

exports.getAssignedClients = async (req, res) => {
  const userId = req.userId;

  try {
    const access = await getStaffAccessFilters(userId);
    const assignedIds = access.assignedCustomerIds;

    if (assignedIds.length === 0) {
      return res.json({ status: true, message: "No assigned clients found", data: [] });
    }

    const query = `
      SELECT 
        cl.id,
        cl.trading_name AS client_name,
        c.trading_name AS customer_name,
        cl.status,
        ct.type AS client_type_name,
        CONCAT(s.first_name, ' ', s.last_name) AS client_created_by,
        DATE_FORMAT(cl.created_at, '%d/%m/%Y') AS created_at,
        CONCAT(
          'cli_', 
          SUBSTRING(c.trading_name, 1, 3), '_',
          SUBSTRING(cl.trading_name, 1, 3), '_',
          SUBSTRING(cl.client_code, 1, 15)
        ) AS client_code
      FROM clients cl
      JOIN customers c ON cl.customer_id = c.id
      LEFT JOIN client_types ct ON cl.client_type = ct.id
      LEFT JOIN staffs s ON cl.staff_created_id = s.id
      WHERE c.id IN (${assignedIds.join(',')}) AND cl.${access.clientCondition}
      GROUP BY cl.id
      ORDER BY cl.trading_name ASC
    `;

    const [rows] = await pool.query(query);

    res.json({
      status: true,
      message: "Assigned clients fetched successfully",
      data: rows
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message
    });
  }
};

exports.getAssignedJobs = async (req, res) => {
  const userId = req.userId;

  try {
    const access = await getStaffAccessFilters(userId);
    const assignedIds = access.assignedCustomerIds;

    if (assignedIds.length === 0) {
      return res.json({ status: true, message: "No assigned jobs found", data: [] });
    }

    const query = `
      SELECT 
        j.id,
        j.job_id AS job_code_id,
        j.job_priority,
        cl.trading_name AS client_trading_name,
        jt.type AS job_type_name,
        ms.name AS status_name,
        j.status_type,
        CONCAT(ccd.first_name, ' ', ccd.last_name) AS client_contact_person,
        j.client_job_code,
        CONCAT(s_am.first_name, ' ', s_am.last_name) AS outbooks_account_manager,
        CONCAT(s_at.first_name, ' ', s_at.last_name) AS allocated_to,
        j.total_hours,
        CONCAT(s_cb.first_name, ' ', s_cb.last_name) AS job_created_by,
        DATE_FORMAT(j.created_at, '%d/%m/%Y') AS created_at,
        j.invoiced
      FROM jobs j
      JOIN customers c ON j.customer_id = c.id
      LEFT JOIN clients cl ON j.client_id = cl.id
      LEFT JOIN job_types jt ON j.job_type_id = jt.id
      LEFT JOIN master_status ms ON j.status_type = ms.id
      LEFT JOIN client_contact_details ccd ON j.customer_contact_details_id = ccd.id
      LEFT JOIN staffs s_am ON j.account_manager_id = s_am.id
      LEFT JOIN staffs s_at ON j.allocated_to = s_at.id
      LEFT JOIN staffs s_cb ON j.staff_created_id = s_cb.id
      WHERE c.id IN (${assignedIds.join(',')}) AND j.${access.jobCondition}
      GROUP BY j.id
      ORDER BY j.id DESC
    `;

    const [rows] = await pool.query(query);

    res.json({
      status: true,
      message: "Assigned jobs fetched successfully",
      data: rows
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message
    });
  }
};

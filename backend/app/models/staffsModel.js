const pool = require("../../app/config/database");
const { SatffLogUpdateOperation } = require("../../app/utils/helper");
const axios = require("axios");
const qs = require("qs");

const createStaff = async (staff) => {
  // console.log(staff);
  const {
    role_id,
    first_name,
    last_name,
    email,
    phone,
    phone_code,
    password,
    status,
    employee_number,
    created_by,
    StaffUserId,
    ip,
    staff_to,
  } = staff;

  // Exist Email Check
  const checkQuery = `SELECT 1 FROM staffs WHERE email = ?`;
  const [check] = await pool.execute(checkQuery, [email]);

  if (check.length > 0) {
    return { status: false, message: "Email Already Exists." };
  }

  // Exist Employee Number Check
  const checkEmployeeNumberQuery = `SELECT 1 FROM staffs WHERE employee_number = ?`;
  const [checkEmployeeNumber] = await pool.execute(checkEmployeeNumberQuery, [
    employee_number,
  ]);
  if (checkEmployeeNumber.length > 0) {
    return { status: false, message: "Employee Number Already Exists." };
  }

  const Role_query = `SELECT role ,hourminute FROM roles WHERE id = ?`;
  const [role] = await pool.execute(Role_query, [role_id]);

  let hourminute = "00:00";
  if (role.length > 0) {
    hourminute = role[0].hourminute;
  }

  const query = `
    INSERT INTO staffs (role_id, first_name, last_name, email, phone_code,phone, password,hourminute, status ,created_by, employee_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  try {
    const [result] = await pool.execute(query, [
      role_id,
      first_name,
      last_name,
      email,
      phone_code,
      phone,
      password,
      hourminute,
      status,
      created_by,
      employee_number,
    ]);

    if (staff_to != "" && staff_to != undefined) {
      const staff_to_query = `INSERT INTO line_managers (staff_by,staff_to) VALUES (?, ?)`;
      const [staff_to_result] = await pool.execute(staff_to_query, [
        result.insertId,
        staff_to,
      ]);
    }

    const currentDate = new Date();
    await SatffLogUpdateOperation({
      staff_id: StaffUserId,
      ip: ip,
      date: currentDate.toISOString().split("T")[0],
      module_name: "staff",
      log_message: `created staff ${first_name} ${last_name}`,
      permission_type: "created",
      module_id: result.insertId,
    });
    return {
      status: true,
      message: "Staff created successfully.",
      data: result.insertId,
    };
  } catch (err) {
    console.error("Error creating data:", err);
    return { status: false, message: "Error Created Staff" };
  }
};

const getStaff = async (data) => {
  console.log("data in model", data);
  let { page, limit, search } = data;

  console.log("page", page);
  console.log("limit", limit);
  console.log("search", search);



  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;
  search = search.trim();

  // 🔍 SEARCH CONDITION
  let searchCondition = "";
  let searchParams = [];
  if (search) {
    searchCondition = `
      AND (
        staffs.first_name LIKE ?
        OR staffs.last_name LIKE ?
        OR staffs.email LIKE ?
        OR staffs.phone LIKE ?
        OR staffs.employee_number LIKE ?
      )
    `;
    const likeSearch = `%${search}%`;
    searchParams = [likeSearch, likeSearch, likeSearch, likeSearch, likeSearch];
  }

  try {
    // 🔹 TOTAL COUNT
    const [countResult] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM staffs
      JOIN roles ON staffs.role_id = roles.id
      LEFT JOIN line_managers lm ON lm.staff_by = staffs.id
      LEFT JOIN staffs manager ON manager.id = lm.staff_to
      WHERE 1=1
      ${searchCondition}
      `,
      searchParams
    );

    const total = countResult[0]?.total || 0;

    // 🔹 DATA
    const [rows] = await pool.query(
      `
      SELECT 
        staffs.id, 
        staffs.role_id, 
        staffs.first_name,
        staffs.last_name,
        staffs.email,
        staffs.phone_code,
        staffs.phone,
        staffs.is_disable,
        staffs.status,
        staffs.employee_number,
        staffs.created_at,
        staffs.hourminute,
        roles.role_name,
        roles.role,
        lm.staff_to,
        CONCAT(manager.first_name, ' ', manager.last_name) AS line_manager_name,
        CASE 
          WHEN EXISTS (
              SELECT 1 FROM assigned_jobs_staff_view WHERE assigned_jobs_staff_view.staff_id = staffs.id
          ) 
          OR EXISTS (
              SELECT 1 FROM customers WHERE customers.staff_id = staffs.id OR customers.account_manager_id = staffs.id
          )
          OR EXISTS (
              SELECT 1 FROM clients WHERE clients.staff_created_id = staffs.id
          )
          OR EXISTS (
              SELECT 1 FROM jobs WHERE jobs.staff_created_id = staffs.id OR jobs.account_manager_id = staffs.id
          )
          THEN TRUE ELSE FALSE 
        END AS is_customer_exist
      FROM staffs
      JOIN roles ON staffs.role_id = roles.id
      LEFT JOIN line_managers lm ON lm.staff_by = staffs.id
      LEFT JOIN staffs manager ON manager.id = lm.staff_to
      WHERE 1=1
      ${searchCondition}
      ORDER BY staffs.first_name ASC
      LIMIT ? OFFSET ?
      `,
      [...searchParams, limit, offset]
    );

    return {
      status: true,
      message: "Success",
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        search,
      },
    };
  } catch (error) {
    console.error("Error in getStaff:", error);
    return { status: false, message: "Error fetching staff." };
  }
};

const getManagerStaff = async () => {
  const [rows] = await pool.query(
    "SELECT staffs.id , staffs.role_id , staffs.first_name , staffs.last_name , staffs.email ,staffs.phone_code, staffs.phone , staffs.status , staffs.is_disable , roles.role_name , roles.role ,line_managers.staff_to FROM staffs JOIN roles ON staffs.role_id = roles.id LEFT JOIN line_managers ON line_managers.staff_by = staffs.id where staffs.role_id=4 AND staffs.status='1' ORDER BY staffs.id DESC"
  );
  return rows;
};

const deleteStaff = async (staffId) => {
  const query = `
  DELETE FROM staffs WHERE id = ?
  `;
  try {
    await pool.execute(query, [staffId]);
  } catch (err) {
    console.error("Error deleting data:", err);
    throw err;
  }
};

const updateStaff = async (staff) => {
  const { id, ...fields } = staff;
  let email = fields.email;

  console.log("fields", fields);

  // Line Manage Code
  let staff_to = fields.staff_to;
  if (staff_to != "" && staff_to != undefined) {
    let staff_by_query = `SELECT staff_by FROM line_managers WHERE staff_by = ?`;
    let [staff_by_result] = await pool.execute(staff_by_query, [id]);
    if (staff_by_result.length > 0) {
      // console.log("staff_by_result", staff_by_result);
      // console.log("staff_to", staff_to);
      // console.log("staff_by", id);

      const staff_to_query = `UPDATE line_managers SET staff_to = ? WHERE staff_by = ?`;
      const [staff_to_result] = await pool.execute(staff_to_query, [
        staff_to,
        id,
      ]);
    } else {
      const staff_to_query = `INSERT INTO line_managers (staff_by,staff_to) VALUES (?, ?)`;
      const [staff_to_result] = await pool.execute(staff_to_query, [
        id,
        staff_to,
      ]);
    }
  } else {
    //  await pool.execute(`DELETE FROM line_managers WHERE staff_by = ?`, [id]);
  }
  // End Line Manage Code

  // Exist Email Check
  const checkQuery = `SELECT 1 FROM staffs WHERE email = ? AND id != ?`;
  const [check] = await pool.execute(checkQuery, [email, id]);
  if (check.length > 0) {
    return { status: false, message: "Email Already Exists." };
  }

  // Exist Employee Number Check
  const checkEmployeeNumberQuery = `SELECT 1 FROM staffs WHERE employee_number = ? AND id != ?`;
  const [checkEmployeeNumber] = await pool.execute(checkEmployeeNumberQuery, [
    fields.employee_number,
    id,
  ]);
  if (checkEmployeeNumber.length > 0) {
    return { status: false, message: "Employee Number Already Exists." };
  }
  // Create an array to hold the set clauses
  const setClauses = [];
  const values = [];
  // Iterate over the fields and construct the set clauses dynamically
  for (const [key, value] of Object.entries(fields)) {
    if (key != "ip" && key != "StaffUserId" && key != "staff_to") {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  }
  // Add the id to the values array for the WHERE clause
  values.push(id);
  // Construct the final SQL query
  const query = `
    UPDATE staffs
    SET ${setClauses.join(", ")}
    WHERE id = ?
    `;
  try {
    const [[existStatus]] = await pool.execute(
      `SELECT status FROM staffs WHERE id = ?`,
      [id]
    );

    let status_change = "Deactivate";
    if (staff.status == "1") {
      status_change = "Activate";
    }
    let log_message =
      existStatus.status === staff.status
        ? `edited staff ${staff.first_name} ${staff.last_name}`
        : `changes the staff status ${status_change} ${staff.first_name} ${staff.last_name}`;

    const [rows] = await pool.execute(query, values);
    if (rows.changedRows) {
      const currentDate = new Date();
      await SatffLogUpdateOperation({
        staff_id: staff.StaffUserId,
        ip: staff.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "staff",
        log_message: log_message,
        permission_type: "updated",
        module_id: staff.id,
      });
    }
    return {
      status: true,
      message: "staff updated successfully.",
      data: rows.affectedRows,
    };
  } catch (err) {
    console.log("Error updating staff:", err);
    return { status: false, message: "Error updating staff" };
  }
};

const updateStaffwithLogin = async (staff) => {
  const { id, ...fields } = staff;
  // Create an array to hold the set clauses
  const setClauses = [];
  const values = [];
  // Iterate over the fields and construct the set clauses dynamically
  for (const [key, value] of Object.entries(fields)) {
    if (key != "ip" && key != "StaffUserId") {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  }
  // Add the id to the values array for the WHERE clause
  values.push(id);
  // Construct the final SQL query
  const query = `
    UPDATE staffs
    SET ${setClauses.join(", ")}
    WHERE id = ?
    `;
  try {
    const [[existStatus]] = await pool.execute(
      `SELECT status FROM staffs WHERE id = ?`,
      [id]
    );

    let status_change = "Deactivate";
    if (staff.status == "1") {
      status_change = "Activate";
    }
    let log_message =
      existStatus.status === staff.status
        ? `edited staff ${staff.first_name} ${staff.last_name}`
        : `changes the staff status ${status_change} ${staff.first_name} ${staff.last_name}`;

    const [rows] = await pool.execute(query, values);
    if (rows.changedRows) {
      const currentDate = new Date();
      await SatffLogUpdateOperation({
        staff_id: staff.StaffUserId,
        ip: staff.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "staff",
        log_message: log_message,
        permission_type: "updated",
        module_id: staff.id,
      });
    }
  } catch (err) {
    console.log("Error updating staff:", err);
    return;
  }
};

const staffCompetency = async (staffCompetency) => {
  const { staff_id, action, service } = staffCompetency;
  if (action === "update") {
    const addQuery = `
    INSERT INTO staff_competencies (staff_id, service_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
   `;

    const deleteQuery = `
    DELETE FROM staff_competencies
    WHERE staff_id = ? AND service_id = ?
   `;

    try {
      for (const serv of service) {
        if (serv.status) {
          // Insert service
          await pool.execute(addQuery, [staff_id, serv.service_id]);
        } else {
          // Delete service
          await pool.execute(deleteQuery, [staff_id, serv.service_id]);
        }
      }
    } catch (err) {
      console.error("Error updating data:", err);
      throw err;
    }
  } else {
    const query = `
        SELECT 
            services.id as service_id, 
            services.name as service_name, 
            CASE 
                WHEN staff_competencies.service_id IS NOT NULL THEN true 
                ELSE false 
            END as status 
        FROM 
            services 
        LEFT JOIN 
            staff_competencies 
        ON 
            services.id = staff_competencies.service_id 
        AND 
            staff_competencies.staff_id = ?
    `;

    const [rows] = await pool.query(query, [staff_id]);
    return rows;
  }
};

const getStaffByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT staffs.id , staffs.email , staffs.password ,staffs.first_name, staffs.last_name, staffs.role_id, staffs.status,roles.role_name ,roles.role  FROM staffs JOIN roles ON staffs.role_id = roles.id  WHERE staffs.email = ?",
    [email]
  );

  return rows[0];
};

const getStaffById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id , login_auth_token FROM staffs  WHERE id = ?",
    [id]
  );
  return rows[0];
};

const isLoginAuthTokenCheckmodel = async (staff) => {
  const { id, login_auth_token } = staff;
  const [rows] = await pool.query(
    "SELECT id , login_auth_token FROM staffs WHERE id = ? AND login_auth_token = ?",
    [id, login_auth_token]
  );
  return rows[0];
};

const profile = async (staff) => {
  const { id } = staff;
  const query = `
    SELECT id, first_name, last_name, email, phone, status FROM staffs WHERE id = ?
    `;

  try {
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  } catch (err) {
    console.error("Error updating data:", err);
    throw err;
  }
};

const managePortfolio = async (staff_id) => {
  const id = staff_id.staff_id;
  const query = ` SELECT id, trading_name as customer_name FROM customers  ORDER BY id DESC `;
  try {
    const [result] = await pool.execute(query);

    return result;
  } catch (err) {
    console.error("Error selecting data:", err);
    throw err;
  }
};

const getLineManagerStaff = async (staff) => {
  let staff_to = staff.StaffUserId;
  const LineManageQuery = `
    SELECT 
    line_managers.staff_by AS staff_id, 
    CONCAT(staffs.first_name, ' ', staffs.last_name) AS staff_name 
    FROM line_managers 
    JOIN staffs ON line_managers.staff_by = staffs.id
    WHERE line_managers.staff_to = ?
  `;
  try {
    const [lineManagerResult] = await pool.execute(LineManageQuery, [staff_to]);
    return lineManagerResult;
  } catch (err) {
    console.error("Error selecting data:", err);
    throw err;
  }
};

const status = async (id) => {
  if (id != undefined) {
    const query = `SELECT status FROM staffs WHERE id = ?`;
    try {
      const [result] = await pool.execute(query, [id]);
      return result;
    } catch (err) {
      console.log("Error updating data:", err);
      throw err;
    }
  } else {
    return;
  }
};

const sharepoint_token = async () => {
  const query = `SELECT access_token, refresh_token ,client_id,client_secret FROM sharepoint_token`;
  try {
    const [[result]] = await pool.execute(query);
    //console.log("result", result);
    if (result != undefined && result != null) {
      if (
        result.access_token != null &&
        result.access_token != "" &&
        result.access_token != undefined
      ) {
        const TokenExpiry = await CheckExpirySharePointToken(
          result.access_token
        );
        if (TokenExpiry) {
          const genrateAccessToken = await genrateSharePointAccessToken(
            result.refresh_token,
            result.client_id,
            result.client_secret
          );
          if (genrateAccessToken == "error") {
            return "sharepoint_token_not_found";
          } else {
            return genrateAccessToken;
          }
        } else {
          return result.access_token;
        }
      } else {
        return "sharepoint_token_not_found";
      }
    } else {
      console.log("sharepoint_token_not_found");
      return "sharepoint_token_not_found";
    }
  } catch (err) {
    console.log("Error sharepoint token data:", err);
    return "sharepoint_token_not_found";
  }
};

const CheckExpirySharePointToken = async (token) => {
  // console.log("token", token);
  if (token && token.trim() !== "") {
    try {
      // Split the token into its parts
      const base64Payload = token.split(".")[1];
      if (!base64Payload) {
        console.log("Invalid token format");
        return true; // Treat invalid token as expired
      }

      // Decode the Base64URL encoded payload
      const decodedPayload = JSON.parse(
        Buffer.from(base64Payload, "base64url").toString("utf-8")
      );

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decodedPayload.exp && decodedPayload.exp < currentTime) {
        // console.log("Token Expired");
        return true;
      } else {
        // console.log("Token Not Expired");
        return false;
      }
    } catch (error) {
      console.log("Error decoding token:", error);
      return true;
    }
  } else {
    console.log("Invalid token");
    return true;
  }
};

const genrateSharePointAccessToken = async (
  refresh_token,
  client_id,
  client_secret
) => {
  let token;
  const data = qs.stringify({
    grant_type: "refresh_token",
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://login.microsoftonline.com/332dcd89-cd37-40a0-bba2-a2b91abd434a/oauth2/v2.0/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  await axios
    .request(config)
    .then((response) => {
      if (response.data.access_token != undefined) {
        token = response.data.access_token;
      } else {
        token = "error";
      }
    })
    .catch((error) => {
      token = "error";
    });

  return token;
};

const getSharePointToken = async (staff) => {
  const query = `SELECT access_token, refresh_token ,client_id,client_secret FROM sharepoint_token`;
  try {
    const [[result]] = await pool.execute(query);
    //console.log("result", result);
    if (result != undefined && result != null) {
      if (
        result.access_token != null &&
        result.access_token != "" &&
        result.access_token != undefined
      ) {
        const TokenExpiry = await CheckExpirySharePointToken(
          result.access_token
        );

        if (TokenExpiry) {
          const genrateAccessToken = await genrateSharePointAccessToken(
            result.refresh_token,
            result.client_id,
            result.client_secret
          );

          if (genrateAccessToken == "error") {
            return "sharepoint_token_not_found";
          } else {
            return genrateAccessToken;
          }
        } else {
          return result.access_token;
        }
      } else {
        return "sharepoint_token_not_found";
      }
    } else {
      console.log(" sharepoint record not found:");
      return "sharepoint_token_not_found";
    }
  } catch (err) {
    console.log("Error sharepoint token data:", err);
    return "sharepoint_token_not_found";
  }
};

const GetStaffPortfolio = async (staff) => {
  const id = staff.staff_id;
  const type = staff.type;
  if (type === "assignCustomer") {
    const queryCustomerAssign = `
    SELECT 
    assigned_jobs_staff_view.customer_id, 
    customers.trading_name 
    FROM assigned_jobs_staff_view
    JOIN customers ON assigned_jobs_staff_view.customer_id = customers.id
    WHERE assigned_jobs_staff_view.staff_id = ${id} AND assigned_jobs_staff_view.source != 'assign_customer_portfolio'
    GROUP BY assigned_jobs_staff_view.customer_id
  `;

    try {
      const [assignedCustomers] = await pool.execute(queryCustomerAssign);
      return assignedCustomers;
    } catch (err) {
      console.error("Error selecting data:", err);
      throw err;
    }
  } else {
    const query = `
    SELECT sp.customer_id, c.trading_name 
    FROM staff_portfolio sp
    JOIN customers c ON sp.customer_id = c.id
    WHERE sp.staff_id = ?
  `;

    try {
      const [result] = await pool.execute(query, [id]);
      return result;
    } catch (err) {
      console.error("Error selecting data:", err);
      throw err;
    }
  }
};

const UpdateStaffPortfolio = async (staff) => {
  try {
    const DeleteQuery = `DELETE FROM staff_portfolio WHERE staff_id = ?`;
    await pool.execute(DeleteQuery, [staff.staff_id]);

    if (staff.customer_id && staff.customer_id.length > 0) {
      const createdAt = new Date();
      const values = staff.customer_id.map((customer_id) => [
        staff.staff_id,
        customer_id,
        createdAt,
      ]);

      const query = `INSERT INTO staff_portfolio (staff_id, customer_id, createdAt) VALUES ?`;
      await pool.query(query, [values]);
    }

    return { status: true, message: "Staff Portfolio updated successfully." };
  } catch (error) {
    console.error("Error updating staff portfolio:", error);
    return {
      status: false,
      message: "Failed to update staff portfolio",
      error,
    };
  }
};

const deleteStaffUpdateStaff = async (staff) => {
  const { delete_id, update_staff, role } = staff;

  if (role.toUpperCase() === "MANAGER") {
    await pool.execute(
      `UPDATE customers SET account_manager_id = ? WHERE account_manager_id = ?`,
      [update_staff, delete_id]
    );

    await pool.execute(
      `UPDATE customer_service_account_managers SET account_manager_id  = ? WHERE account_manager_id  = ?`,
      [update_staff, delete_id]
    );
  }

  if (delete_id == update_staff) {
    return {
      status: false,
      message: "Staff cannot be deleted from the system.",
    };
  }

  if (delete_id == 1 || delete_id == 2) {
    return {
      status: false,
      message: "Staff cannot be deleted from the system.",
    };
  }

  if (update_staff == 2 || update_staff == 2) {
    return {
      status: false,
      message: "Staff cannot be deleted from the system.",
    };
  }

  const queries = [
    {
      query:
        "UPDATE clients SET staff_created_id = ? WHERE staff_created_id = ?",
      params: [update_staff, delete_id],
    },
    {
      query: "UPDATE customers SET staff_id = ? WHERE staff_id = ?",
      params: [update_staff, delete_id],
    },
    {
      query: "UPDATE jobs SET staff_created_id = ? WHERE staff_created_id = ?",
      params: [update_staff, delete_id],
    },
    {
      query:
        "UPDATE jobs SET account_manager_id = ? WHERE account_manager_id = ?",
      params: [update_staff, delete_id],
    },
    {
      query: "UPDATE staff_competencies SET staff_id = ? WHERE staff_id = ?",
      params: [update_staff, delete_id],
    },
    {
      query: "UPDATE staff_portfolio SET staff_id = ? WHERE staff_id = ?",
      params: [update_staff, delete_id],
    },
    {
      query:
        "UPDATE `line_managers` SET `staff_by` = ? WHERE `line_managers`.`id` = ?;",
      params: [update_staff, delete_id],
    },
    {
      query:
        "UPDATE `line_managers` SET `staff_to` = ? WHERE `line_managers`.`id` = ?;",
      params: [update_staff, delete_id],
    },
  ];

  try {
    for (const { query, params } of queries) {
      await pool.execute(query, params);
    }

    console.log(
      `Updated staff references from ${delete_id} to ${update_staff}`
    );

    return { status: true, message: "Staff updated successfully." };
  } catch (err) {
    console.error("Error updating staff references:", err);
    return { status: false, message: "Error updating staff" };
  }
};

const GetStaffByRoleId = async (data) => {
  const { role_id } = data;

  const [rows] = await pool.execute(
    "SELECT id , first_name , last_name , email , phone , phone_code , status FROM staffs WHERE role_id = ?",
    [role_id]
  );
  return { status: true, message: "Staff Get successfully.", data: rows };
};

const GetStaffAndDelete = async (data) => {
  try {
    // console.log("data--", data);

    const { id, replace_id } = data;

    if (id == replace_id) {
      return {
        status: false,
        message: "Staff cannot be deleted from the system.",
      };
    }

    if (id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6) {
      return {
        status: false,
        message: "Staff cannot be deleted from the system.",
      };
    }

    const UpdateStaff = `UPDATE staffs SET role_id = ? WHERE role_id = ?;`;
    const [result] = await pool.execute(UpdateStaff, [replace_id, id]);

    const DeleteQuery = `DELETE FROM roles WHERE id = ?`;
    await pool.execute(DeleteQuery, [id]);

    return { status: true, message: "Staff updated successfully." };
  } catch (error) {
    return { status: false, message: "Error deleting staff" };
  }
};

module.exports = {
  createStaff,
  getStaff,
  getManagerStaff,
  deleteStaff,
  updateStaff,
  updateStaffwithLogin,
  staffCompetency,
  getStaffByEmail,
  getStaffById,
  isLoginAuthTokenCheckmodel,
  profile,
  managePortfolio,
  status,
  sharepoint_token,
  getSharePointToken,
  GetStaffPortfolio,
  UpdateStaffPortfolio,
  deleteStaffUpdateStaff,
  GetStaffByRoleId,
  GetStaffAndDelete,
  getLineManagerStaff,
};

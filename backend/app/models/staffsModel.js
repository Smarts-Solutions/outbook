const pool = require("../../app/config/database");
const { SatffLogUpdateOperation } = require("../../app/utils/helper");

const createStaff = async (staff) => {
  console.log(staff);
  const {
    role_id,
    first_name,
    last_name,
    email,
    phone,
    phone_code,
    password,
    status,
    created_by,
    StaffUserId,
    ip,
  } = staff;
 
  const checkQuery = `SELECT 1 FROM staffs WHERE email = ?`;
  const [check] = await pool.execute(checkQuery, [email]);
 
  if (check.length > 0) {
    return { status: false, message: 'Email Already Exists.' };
  }

  const Role_query = `SELECT role ,hourminute FROM roles WHERE id = ?`;
  const [role] = await pool.execute(Role_query, [role_id]);

  let hourminute = "00:00";
  if (role.length > 0) {
    hourminute = role[0].hourminute;
  }

  const query = `
    INSERT INTO staffs (role_id, first_name, last_name, email, phone_code,phone, password,hourminute, status ,created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    ]);

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
    return { status: true, message: 'Staff created successfully.', data: result.insertId };
  } catch (err) {
    console.error('Error creating data:', err);
    return { status: false, message: 'Error Created Staff' };
  }
};

const getStaff = async () => {
  const [rows] = await pool.query(
    "SELECT staffs.id , staffs.role_id , staffs.first_name , staffs.last_name , staffs.email , staffs.phone_code ,staffs.phone , staffs.status , staffs.created_at , staffs.hourminute , roles.role_name , roles.role FROM staffs JOIN roles ON staffs.role_id = roles.id ORDER BY staffs.id DESC"
  );
  return rows;
};

const getManagerStaff = async () => {
  const [rows] = await pool.query(
    "SELECT staffs.id , staffs.role_id , staffs.first_name , staffs.last_name , staffs.email ,staffs.phone_code, staffs.phone , staffs.status , roles.role_name , roles.role FROM staffs JOIN roles ON staffs.role_id = roles.id where staffs.role_id=4"
  );
  return rows;
};

const deleteStaff = async (staffId) => {
  // const query = `
  // DELETE FROM staffs WHERE id = ?
  // `;
  // try {
  //     await pool.execute(query, [staffId]);
  // } catch (err) {
  //     console.error('Error deleting data:', err);
  //     throw err;
  // }
};

const updateStaff = async (staff) => {

  const { id, ...fields } = staff;
  let email = fields.email;
   
  const checkQuery = `SELECT 1 FROM staffs WHERE email = ? AND id != ?`;
  const [check] = await pool.execute(checkQuery, [email, id]);
  if (check.length > 0) {
    return { status: false, message: 'Email Already Exists.' };
  }
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
    return { status: true, message: 'staff updated successfully.', data: rows.affectedRows };
  } catch (err) {
    console.log("Error updating staff:", err);
    return { status: false, message: 'Error updating staff' };
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
    return 
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
    "SELECT staffs.id , staffs.email , staffs.password , staffs.role_id, staffs.status,roles.role_name ,roles.role  FROM staffs JOIN roles ON staffs.role_id = roles.id  WHERE staffs.email = ?",
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

const status = async (id) => {
 if(id != undefined){
  const query = `SELECT status FROM staffs WHERE id = ?`;
  try {
    const [result] = await pool.execute(query, [id]);
    return result;
  } catch (err) {
    console.log("Error updating data:", err);
    throw err;
  }
}else{
  return 
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
};

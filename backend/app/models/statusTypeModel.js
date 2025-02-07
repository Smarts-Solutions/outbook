const pool = require("../config/database");
const { SatffLogUpdateOperation } = require("../utils/helper");

const createStatusType = async (StatusType) => {
  const { type } = StatusType;
  const checkQuery = `SELECT 1 FROM status_types WHERE type = ?`;
  const query = `
    INSERT INTO status_types (type)
    VALUES (?)
    `;
  try {
    const [check] = await pool.query(checkQuery, [type]);
    if (check.length > 0) {
      return { status: false, message: "Status Type already exists." };
    }
    const [result] = await pool.execute(query, [type]);
    const currentDate = new Date();
    await SatffLogUpdateOperation({
      staff_id: StatusType.StaffUserId,
      ip: StatusType.ip,
      date: currentDate.toISOString().split("T")[0],
      module_name: "status types",
      log_message: `created status types ${type}`,
      permission_type: "created",
      module_id: result.insertId,
    });
    return {
      status: true,
      message: "Status Type created successfully.",
      data: result.insertId,
    };
  } catch (err) {
    console.error("Error inserting data:", err);
    throw err;
  }
};

const getStatusType = async () => {
  const query = `
    SELECT * FROM status_types WHERE status = '1' ORDER BY id DESC
    `;

  try {
    const [result] = await pool.execute(query);
    return result;
  } catch (err) {
    console.error("Error selecting data:", err);
    throw err;
  }
};

const getStatusTypeAll = async () => {
  const query = `
    SELECT * FROM status_types ORDER BY id DESC
    `;

  try {
    const [result] = await pool.execute(query);
    return result;
  } catch (err) {
    console.error("Error selecting data:", err);
    throw err;
  }
};

const deleteStatusType = async (StatusTypeId) => {
  const [[existType]] = await pool.execute(
    `SELECT type FROM status_types WHERE id = ?`,
    [StatusTypeId.id]
  );

  if (parseInt(StatusTypeId.id) > 0) {
    const currentDate = new Date();
    await SatffLogUpdateOperation({
      staff_id: StatusTypeId.StaffUserId,
      ip: StatusTypeId.ip,
      date: currentDate.toISOString().split("T")[0],
      module_name: "status types",
      log_message: `deleted status types ${existType.type}`,
      permission_type: "deleted",
      module_id: StatusTypeId.id,
    });
  }
  const query = `
    DELETE FROM status_types WHERE id = ?
    `;

  try {
    await pool.execute(query, [StatusTypeId.id]);
  } catch (err) {
    console.error("Error deleting data:", err);
    throw err;
  }
};

const updateStatusType = async (StatusType) => {
  const { id, ...fields } = StatusType;
  const type = StatusType.type;
  // Create an array to hold the set clauses
  const setClauses = [];
  const values = []; 
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
    UPDATE status_types
    SET ${setClauses.join(", ")}
    WHERE id = ?
    `;
  // Check if the record exists
  const checkQuery = `SELECT 1 FROM status_types WHERE type = ? AND id != ?`;
  try {
    const [check] = await pool.execute(checkQuery, [type, id]);
    if (check.length > 0) {
      return { status: false, message: "Status Type already exists." };
    }

    const [[existStatus]] = await pool.execute(
      `SELECT status FROM status_types WHERE id = ?`,
      [id]
    );
    let status_change = "Deactivate";
    if (StatusType.status == "1") {
      status_change = "Activate";
    }
    let log_message =
      existStatus.status === StatusType.status
        ? `edited status types ${type}`
        : `changes the status types status ${status_change} ${type}`;
    const [result] = await pool.execute(query, values);
    if (result.changedRows > 0) {
      const currentDate = new Date();
      await SatffLogUpdateOperation({
        staff_id: StatusType.StaffUserId,
        ip: StatusType.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "status types",
        log_message: log_message,
        permission_type: "updated",
        module_id: StatusType.id,
      });
    }
    return {
      status: true,
      message: "Status Type updated successfully.",
      data: result.affectedRows,
    };
  } catch (err) {
    console.error("Error updating data:", err);
    throw err;
  }
};

// Master Status
const createMasterStatus = async (masterStatus) => {
  const { status_type_id, name } = masterStatus;
  const checkQuery = `SELECT 1 FROM master_status WHERE name = ?`;
  const query = `
    INSERT INTO master_status (status_type_id, name)
    VALUES (?, ?)
    `;
  try {
    const [check] = await pool.query(checkQuery, [name]);
    if (check.length > 0) {
      return { status: false, message: "Master Status already exists." };
    }
    const [result] = await pool.execute(query, [status_type_id, name]);

    const currentDate = new Date();
    await SatffLogUpdateOperation({
      staff_id: masterStatus.StaffUserId,
      ip: masterStatus.ip,
      date: currentDate.toISOString().split("T")[0],
      module_name: "master status",
      log_message: `created master status ${name}`,
      permission_type: "created",
      module_id: result.insertId,
    });

    return {
      status: true,
      message: "Master Status created successfully.",
      data: result.insertId,
    };
  } catch (err) {
    console.error("Error inserting data:", err);
    throw err;
  }
};

const getMasterStatus = async (masterStatus) => {
  const query = `
    SELECT
    master_status.id AS id,
    master_status.name AS name,
    master_status.status_type_id AS status_type_id,
    master_status.is_disable AS is_disable,
    status_types.type AS status_type,
    status_types.type AS status_type,
    master_status.created_at AS created_at,
    master_status.updated_at AS updated_at
    FROM 
    master_status
    JOIN 
    status_types ON status_types.id = master_status.status_type_id
    ORDER BY id DESC
    `;

  try {
    const [result] = await pool.execute(query);
    return result;
  } catch (err) {
    console.error("Error selecting data:", err);
    throw err;
  }
};

const deleteMasterStatus = async (data) => {
  console.log("data=>", data);
  const { id, replace_id } = data;

  const query = `
    DELETE FROM master_status WHERE id = ?
    `;
  const [[existStatus]] = await pool.execute(
    `SELECT name FROM master_status WHERE id = ?`,
    [id]
  );
  await pool.execute(`UPDATE jobs SET status_type =? WHERE jobs.id = ?;`, [
    id,
    replace_id,
  ]);

  console.log("existStatus=>", existStatus);

  try {
    if (existStatus) {
      await pool.execute(query, [id]);
      const currentDate = new Date();
      await SatffLogUpdateOperation({
        staff_id: id.StaffUserId,
        ip: id.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "master status",
        log_message: `deleted master status ${existStatus.name}`,
        permission_type: "deleted",
        module_id: id,
        replace_id,
      });
    } else {
      return {
        status: false,
        message: "Master Status not exists.",
      };
    }
  } catch (err) {
    console.error("Error deleting data:", err);
    throw err;
  }
};

const updateMasterStatus = async (masterStatus) => {
  const { id, ...fields } = masterStatus;
  const name = masterStatus.name;

  const setClauses = [];
  const values = [];

  for (const [key, value] of Object.entries(fields)) {
    if (key != "ip" && key != "StaffUserId") {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  }
  values.push(id);


  console.log("values" , values)
  const query = `
    UPDATE master_status
    SET ${setClauses.join(", ")}
    WHERE id = ?
    `;

  const checkQuery = `SELECT 1 FROM master_status WHERE name = ? AND id != ?`;
  try {
    const [check] = await pool.execute(checkQuery, [name, id]);
    if (check.length > 0) {
      return { status: false, message: "Master Status already exists." };
    }

    const [result] = await pool.execute(query, values);
    if (result.changedRows) {
      const currentDate = new Date();
      await SatffLogUpdateOperation({
        staff_id: masterStatus.StaffUserId,
        ip: masterStatus.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "master status",
        log_message: `edited master status ${name}`,
        permission_type: "updated",
        module_id: masterStatus.id,
      });
    }

    return {
      status: true,
      message: "Master Status updated successfully.",
      data: result.affectedRows,
    };
  } catch (err) {
    console.error("Error updating data:", err);
    throw err;
  }
};

module.exports = {
  createStatusType,
  deleteStatusType,
  updateStatusType,
  getStatusType,
  getStatusTypeAll,
  createMasterStatus,
  getMasterStatus,
  deleteMasterStatus,
  updateMasterStatus,
};

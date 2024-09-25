const pool = require("../config/database");
const { SatffLogUpdateOperation } = require('../utils/helper'); 

const createIncorporation = async (Incorporation) => {

  const checkQuery = `SELECT 1 FROM incorporation_in WHERE name = ?`;
  const query = `
    INSERT INTO incorporation_in (name)
    VALUES (?)
    `;

  try {
    const [check] = await pool.query(checkQuery, [Incorporation.Incorporation]);
    if (check.length > 0) {
      return { status: false, message: "Incorporation In already exists." };
    }
    const [result] = await pool.query(query, [Incorporation.Incorporation]);
  
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: Incorporation.StaffUserId,
        ip: Incorporation.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "incorporation in",
        log_message: `created incorporation in ${Incorporation.Incorporation}`,
        permission_type: "created",
        module_id: result.insertId,
      }
    );
    return {
      status: true,
      message: "Incorporation In created successfully.",
      data: result.insertId,
    };
  } catch (err) {
    console.error("Error inserting data:", err);
    throw err;
  }
};

const getIncorporation = async () => {
  const query = `
    SELECT * FROM incorporation_in WHERE status = '1'
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

const getIncorporationAll = async () => {
  const query = `
    SELECT * FROM incorporation_in
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

const deleteIncorporation = async (IncorporationId) => {
  const query = `
    DELETE FROM incorporation_in WHERE id = ?
    `;
    const [[existName]] = await pool.execute(`SELECT name FROM incorporation_in WHERE id = ?`, [IncorporationId.id]);
  try {
    await pool.execute(query, [IncorporationId.id]);
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: IncorporationId.StaffUserId,
        ip: IncorporationId.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "incorporation in",
        log_message: `deleted incorporation in ${existName.name}`,
        permission_type: "deleted",
        module_id: IncorporationId.id,
      }
    );
  } catch (err) {
    console.error("Error deleting data:", err);
    throw err;
  }
};

const updateIncorporation = async (Incorporation) => {
  const { id, ...fields } = Incorporation;
  const name = Incorporation.name;

  const setClauses = [];
  const values = [];

  for (const [key, value] of Object.entries(fields)) {
    if (key != "ip" && key != "StaffUserId") {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  }

  values.push(id);

  const query = `
    UPDATE incorporation_in
    SET ${setClauses.join(", ")}
    WHERE id = ?
    `;

  const checkQuery = `SELECT 1 FROM incorporation_in WHERE name = ? AND id != ?`;
  try {
    const [check] = await pool.execute(checkQuery, [name, id]);
    if (check.length > 0) {
      return { status: false, message: "Incorporation In already exists." };
    }

    const [[existStatus]] = await pool.execute(`SELECT status FROM incorporation_in WHERE id = ?`, [id]);
    let status_change = "Deactivate"
    if(Incorporation.status == "1"){
      status_change = "Activate"
    }
    let log_message = existStatus.status === Incorporation.status ?
        `edited incorporation in ${name}`:
        `changes the incorporation in status ${status_change} ${name}`

    const [result] = await pool.execute(query, values);
    if(result.changedRows > 0){
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: Incorporation.StaffUserId,
          ip: Incorporation.ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "incorporation in",
          log_message: log_message,
          permission_type: "updated",
          module_id: Incorporation.id,
          }
      );
    }
    return {
      status: true,
      message: "Incorporation In updated successfully.",
      data: result.affectedRows,
    };
  } catch (err) {
    console.error("Error updating data:", err);
    throw err;
  }
};

module.exports = {
  createIncorporation,
  deleteIncorporation,
  updateIncorporation,
  getIncorporation,
  getIncorporationAll,
};

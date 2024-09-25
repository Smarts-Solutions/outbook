const pool = require("../config/database");
const { SatffLogUpdateOperation } = require('../utils/helper'); 

const createCustomerSource = async (CustomerSource) => {
  const { name } = CustomerSource;
  const checkQuery = `SELECT 1 FROM customer_source WHERE name = ?`;
  const query = `
    INSERT INTO customer_source (name)
    VALUES (?)
    `;

  try {
    const [check] = await pool.query(checkQuery, [name]);
    if (check.length > 0) {
      return { status: false, message: "CustomerSource In already exists." };
    }
    const [result] = await pool.query(query, [name]);
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: CustomerSource.StaffUserId,
        ip: CustomerSource.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "customer source",
        log_message: `created customer source ${name}`,
        permission_type: "created",
        module_id: result.insertId,
      }
    );
    return {
      status: true,
      message: "CustomerSource In created successfully.",
      data: result.insertId,
    };
  } catch (err) {
    console.error("Error inserting data:", err);
    throw err;
  }
};

const getCustomerSource = async () => {
  const query = `
    SELECT * FROM customer_source WHERE status = '1'
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

const getCustomerSourceAll = async () => {
  const query = `
    SELECT * FROM customer_source
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

const deleteCustomerSource = async (CustomerSourceId) => {
  const query = `
    DELETE FROM customer_source WHERE id = ?
    `;
    const [[existName]] = await pool.execute(`SELECT name FROM customer_source WHERE id = ?`, [CustomerSourceId.id]);
  try {
    await pool.execute(query, [CustomerSourceId.id]);
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: CustomerSourceId.StaffUserId,
        ip: CustomerSourceId.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "customer source",
        log_message: `deleted customer source ${existName.name}`,
        permission_type: "deleted",
        module_id: CustomerSourceId.id,
      }
    );
  } catch (err) {
    console.error("Error deleting data:", err);
    throw err;
  }
};

const updateCustomerSource = async (CustomerSource) => {
  const { id, ...fields } = CustomerSource;
  const name = CustomerSource.name;

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
    UPDATE customer_source
    SET ${setClauses.join(", ")}
    WHERE id = ?
    `;

  const checkQuery = `SELECT 1 FROM customer_source WHERE name = ? AND id != ?`;
  try {
    const [check] = await pool.execute(checkQuery, [name, id]);
    if (check.length > 0) {
      return { status: false, message: "CustomerSource In already exists." };
    }

    const [[existStatus]] = await pool.execute(`SELECT status FROM customer_source WHERE id = ?`, [id]);
    let status_change = "Deactivate"
    if(CustomerSource.status == "1"){
      status_change = "Activate"
    }
    let log_message = existStatus.status === CustomerSource.status ?
    `edited customer source ${name}`:
    `changes the customer source status ${status_change} ${name}`
    const [result] = await pool.execute(query, values);
    if(result.changedRows > 0){
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: CustomerSource.StaffUserId,
          ip: CustomerSource.ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "customer source",
          log_message: log_message,
          permission_type: "updated",
          module_id: CustomerSource.id,
        }
      );
    }
    return {
      status: true,
      message: "CustomerSource In updated successfully.",
      data: result.affectedRows,
    };
  } catch (err) {
    console.error("Error updating data:", err);
    throw err;
  }
};

module.exports = {
  createCustomerSource,
  deleteCustomerSource,
  updateCustomerSource,
  getCustomerSource,
  getCustomerSourceAll,
};

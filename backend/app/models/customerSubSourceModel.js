const pool = require("../config/database");
const { SatffLogUpdateOperation } = require('../utils/helper');

const createCustomerSubSource = async (CustomerSubSource) => {
  const { name ,customer_source_id} = CustomerSubSource;
  const checkQuery = `SELECT 1 FROM customer_sub_source WHERE name = ?`;
  const query = `
    INSERT INTO customer_sub_source (name,customer_source_id)
    VALUES (?,?)
    `;

  try {
    const [check] = await pool.query(checkQuery, [name]);
    if (check.length > 0) {
      return { status: false, message: "CustomerSubSource In already exists." };
    }
    const [result] = await pool.query(query, [name,customer_source_id]);
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: CustomerSubSource.StaffUserId,
        ip: CustomerSubSource.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "customer sub source",
        log_message: `created customer sub source ${name}`,
        permission_type: "created",
        module_id: result.insertId,
      }
    );
    return {
      status: true,
      message: "CustomerSubSource In created successfully.",
      data: result.insertId,
    };
  } catch (err) {
    console.error("Error inserting data:", err);
    throw err;
  }
};

const getCustomerSubSource = async (CustomerSubSource) => {
  const { customer_source_id } = CustomerSubSource;
  const query = `
    SELECT * FROM customer_sub_source WHERE customer_source_id = ? AND status = '1'
    ORDER BY id DESC
    `;
  try {
    const [result] = await pool.execute(query, [customer_source_id]);
    return result;
  }
  catch (err) {
    console.error("Error selecting data:", err);
    throw err;
  }
}
  
const getCustomerSubSourceAll = async (CustomerSubSource) => {
  const { customer_source_id } = CustomerSubSource;
  const query = `
    SELECT * FROM customer_sub_source WHERE customer_source_id = ?
    ORDER BY id DESC
    `;

  try {
    const [result] = await pool.execute(query,[customer_source_id]);
    return result;
  } catch (err) {
    console.error("Error selecting data:", err);
    throw err;
  }
};

const deleteCustomerSubSource = async (CustomerSubSourceId) => {
  const [[existName]] = await pool.execute(`SELECT name FROM customer_sub_source WHERE id = ?`, [CustomerSubSourceId.id]);
  if(parseInt(CustomerSubSourceId.id) > 0){
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: CustomerSubSourceId.StaffUserId,
        ip: CustomerSubSourceId.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "customer sub source",
        log_message: `deleted customer sub source ${existName.name}`,
        permission_type: "deleted",
        module_id: CustomerSubSourceId.id,
      }
    );
  }
  const query = `
    DELETE FROM customer_sub_source WHERE id = ?
    `;
   
  try {
    await pool.execute(query, [CustomerSubSourceId.id]);
   
  } catch (err) {
    console.error("Error deleting data:", err);
    throw err;
  }
};

const updateCustomerSubSource = async (CustomerSubSource) => {
  const { id, ...fields } = CustomerSubSource;
  const name = CustomerSubSource.name;

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
    UPDATE customer_sub_source
    SET ${setClauses.join(", ")}
    WHERE id = ?
    `;

  const checkQuery = `SELECT 1 FROM customer_sub_source WHERE name = ? AND id != ?`;
  try {
    const [check] = await pool.execute(checkQuery, [name, id]);
    if (check.length > 0) {
      return { status: false, message: "CustomerSubSource In already exists." };
    }


    const [[existStatus]] = await pool.execute(`SELECT status FROM customer_sub_source WHERE id = ?`, [id]);
    let status_change = "Deactivate"
    if(CustomerSubSource.status == "1"){
      status_change = "Activate"
    }
    let log_message = existStatus.status === CustomerSubSource.status ?
    `edited customer sub source ${name}`:
    `changes the customer sub source status ${status_change} ${name}`

    const [result] = await pool.execute(query, values);
    if(result.changedRows > 0){
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: CustomerSubSource.StaffUserId,
          ip: CustomerSubSource.ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "customer sub source",
          log_message: log_message,
          permission_type: "updated",
          module_id: id,
        }
      );
    }
    return {
      status: true,
      message: "CustomerSubSource In updated successfully.",
      data: result.affectedRows,
    };
  } catch (err) {
    console.error("Error updating data:", err);
    throw err;
  }
};

module.exports = {
  createCustomerSubSource,
  deleteCustomerSubSource,
  updateCustomerSubSource,
  getCustomerSubSource,
  getCustomerSubSourceAll,
};

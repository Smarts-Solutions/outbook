const pool = require("../config/database");

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
  const query = `
    DELETE FROM customer_sub_source WHERE id = ?
    `;

  try {
    await pool.execute(query, [CustomerSubSourceId]);
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
    const [result] = await pool.execute(query, values);
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

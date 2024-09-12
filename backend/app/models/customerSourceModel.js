const pool = require("../config/database");

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

  try {
    await pool.execute(query, [CustomerSourceId]);
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
    const [result] = await pool.execute(query, values);
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

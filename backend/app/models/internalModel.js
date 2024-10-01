const pool = require('../config/database');
const AddInternal = async (Internal) => {
  const { name, status } = Internal;
  // add internal
  const checkQuery = `SELECT 1 FROM internal WHERE name = ?`;
  const query = `
  INSERT INTO internal (name,status)
  VALUES (?,?)
  `;
  try {
    const [check] = await pool.query(checkQuery, [name]);
    if (check.length > 0) {
      return { status: false, message: 'Internal already exists.' };
    }
    const [result] = await pool.execute(query, [name, status]);
    return { status: true, message: 'Internal created successfully.', data: result.insertId };
  } catch (err) {
    console.error('Error inserting data:', err);
    throw err;
  }
}


const getInternal = async (Internal) => {
  console.log(Internal);
  const { id } = Internal;
  // get internal
  const query = `SELECT * FROM internal WHERE id = ?`;
  try {
    const [result] = await pool.query(query, [id]);
    return result;
  }
  catch (err) {
    console.error('Error getting data:', err);
    throw err;
  }
}

const getInternalAll = async (Internal) => {
  // get all internal
  const query = `SELECT * FROM internal`;
  try {
    const [result] = await pool.query

    (query);
    return result;
  }
  catch (err) {
    console.error('Error getting data:', err);
    throw err;
  }
}


const removeInternal = async (Internal) => {
  const { id } = Internal;
  // delete internal
  const query = `DELETE FROM internal WHERE id = ?`;
  try {
    await pool.query
    (query, [id]);
  }
  catch (err) {
    console.error('Error deleting data:', err);
    throw err;
  }
}


const modifyInternal = async (Internal) => {
  const { name, status , id } = Internal;

  // update internal
  const query = `UPDATE internal SET name = ?, status = ? WHERE id = ?`;
  try {
    const [result] = await pool.query
    (query, [name,status, id]);
    return { status: true, message: 'Internal updated successfully.', data: result.insertId };
  }
  catch (err) {
    console.error('Error updating data:', err);
    throw err;
  }
}


module.exports = {
  AddInternal,
  getInternal,
  getInternalAll,
  removeInternal,
  modifyInternal
};
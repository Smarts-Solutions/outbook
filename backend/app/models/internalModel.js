const pool = require('../config/database');
const { SatffLogUpdateOperation } = require("../utils/helper");

const AddInternal = async (Internal) => {

  const { name } = Internal;
  // add internal
  const checkQuery = `SELECT 1 FROM internal WHERE name = ?`;
  const query = `
  INSERT INTO internal (name)
  VALUES (?)
  `;
  try {
    const [check] = await pool.query(checkQuery, [name]);
    if (check.length > 0) {
      return { status: false, message: 'Internal Job/Project already exists' };
    }
    const [result] = await pool.execute(query, [name]);
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: Internal.StaffUserId,
        ip: Internal.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "Internal",
        log_message: `created Internal Job/Project ${Internal.name}`,
        permission_type: "created",
        module_id: result.insertId,
      }
    );
    return { status: true, message: 'Internal Job/Project created successfully', data: result.insertId };
  } catch (err) {
    console.error('Error inserting data:', err);
    throw err;
  }
}


const getInternal = async (Internal) => {
  const { id } = Internal;
  // get internal
  const query = `SELECT * FROM internal WHERE id = ? ORDER BY id DESC`;
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
  const query = `SELECT * FROM internal ORDER BY id DESC`;
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
  const { id ,StaffUserId,ip} = Internal;
  const [[existName]] = await pool.execute(`SELECT name FROM internal WHERE id = ?`, [id]);
  // delete internal
  if(parseInt(id) > 0){
    const currentDate = new Date();
    await SatffLogUpdateOperation(
        {
            staff_id: StaffUserId,
            ip: ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: "Internal",
            log_message: `Deleted Internal Job/Project ${existName.name}`,
            permission_type: "deleted",
            module_id:id
        }
    );
  }
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
    const [[existStatus]] = await pool.execute(`SELECT status FROM internal WHERE id = ?`, [id]);
    let status_change = "Deactivate"
    if(status == "1"){
      status_change = "Activate"
    }
    let log_message = existStatus.status === status ?
        `edited Internal Job/Project ${name}`:
        `changes the Internal Job/Project status ${status_change} ${name}`

    const [result] = await pool.query(query, [name,status, id]);
    if(result.changedRows > 0){
      const currentDate = new Date();
      await SatffLogUpdateOperation(
          {
              staff_id: Internal.StaffUserId,
              ip: Internal.ip,
              date: currentDate.toISOString().split('T')[0],
              module_name: "Internal",
              log_message: log_message,
              permission_type: "updated",
              module_id:id
          }
      );
    }

    return { status: true, message: 'Internal Job/Project updated successfully', data: result.insertId };
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
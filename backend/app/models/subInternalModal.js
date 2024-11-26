const pool = require('../config/database');
const { SatffLogUpdateOperation } = require("../utils/helper");

const AddSubInternal = async (subInternal) => {
    const { name , internal_id } = subInternal;
    // add internal
    const checkQuery = `SELECT 1 FROM sub_internal WHERE name = ?`;
    const query = `
  INSERT INTO sub_internal (name, internal_id)
  VALUES (?,?)
  `;
    try {
        const [check] = await pool.query(checkQuery, [name]);
        if (check.length > 0) {
            return { status: false, message: 'Internal task already exists.' };
        }
        const [result] = await pool.execute(query, [name , internal_id]);
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
              staff_id: subInternal.StaffUserId,
              ip: subInternal.ip,
              date: currentDate.toISOString().split("T")[0],
              module_name: "Internal",
              log_message: `created Internal Task ${name}`,
              permission_type: "created",
              module_id: result.insertId,
            }
          );
        return { status: true, message: 'Internal Task created successfully', data: result.insertId };
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
}

const getSubInternal = async (subInternal) => {
    const { id } = subInternal;
    const query = `SELECT * FROM sub_internal WHERE id = ? ORDER BY id DESC`;
    try {
        const [result] = await pool.query(query, [id]);
        return result;
    }
    catch (err) {
        console.error('Error getting data:', err);
        throw err;
    }
}

const getSubInternalAll = async (internal_id) => {
    const id = internal_id.internal_id;

    // get all internal based on internal_id
    const query = `SELECT * FROM sub_internal WHERE internal_id = ? ORDER BY id DESC`;
    try {
        const [result] = await pool.query(query, [id]);
        return result;
    } catch (err) {
        console.error('Error getting data:', err);
        throw err;
    }
};



const removeSubInternal = async (sub_internal) => {
    const { id } = sub_internal;
    const [[existName]] = await pool.execute(`SELECT name FROM sub_internal WHERE id = ?`, [id]);
    // delete internal
    if (parseInt(id) > 0) {
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: sub_internal.StaffUserId,
                ip: sub_internal.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "Sub Internal",
                log_message: `deleted Internal Task ${existName.name}`,
                permission_type: "deleted",
                module_id: id
            }
        );
    }
    const query = `DELETE FROM sub_internal WHERE id = ?`;
    try {
        await pool.query
            (query, [id]);
    }
    catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }
}


const modifySubInternal = async (sub_internal) => {
    const { name, status, id } = sub_internal;

    // check for duplicate name
    const checkQuery = `SELECT 1 FROM sub_internal WHERE name = ? AND id != ?`;
    const updateQuery = `UPDATE sub_internal SET name = ?, status = ? WHERE id = ?`;
    try {
        const [check] = await pool.query(checkQuery, [name, id]);
        if (check.length > 0) {
            return { status: false, message: 'Internal task already exists.' };
        }
        const [[existStatus]] = await pool.execute(`SELECT status FROM sub_internal WHERE id = ?`, [id]);
        let status_change = "Deactivate"
        if (status == "1") {
            status_change = "Activate"
        }
        let log_message = existStatus.status === status ?
            `edited Internal Task ${name}` :
            `changes the Internal Task status ${status_change} ${name}`

        const [result] = await pool.query(updateQuery, [name, status, id]);
        if(result.changedRows > 0){
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: sub_internal.StaffUserId,
                    ip: sub_internal.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: "Sub Internal",
                    log_message: log_message,
                    permission_type: "updated",
                    module_id: id
                }
            );
        }
        return { status: true, message: 'Internal Task updated successfully', data: result.insertId };
    }
    catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
}


module.exports = {
    AddSubInternal,
    getSubInternal,
    getSubInternalAll,
    removeSubInternal,
    modifySubInternal
};
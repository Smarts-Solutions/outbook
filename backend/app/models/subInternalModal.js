const pool = require('../config/database');
const { SatffLogUpdateOperation } = require("../utils/helper");

const AddSubInternal = async (subInternal) => {
    const { name, status, internal_id } = subInternal;
    // add internal
    const checkQuery = `SELECT 1 FROM sub_internal WHERE name = ?`;
    const query = `
  INSERT INTO sub_internal (name,status, internal_id)
  VALUES (?,?,?)
  `;
    try {
        const [check] = await pool.query(checkQuery, [name]);
        if (check.length > 0) {
            return { status: false, message: 'Internal already exists.' };
        }
        const [result] = await pool.execute(query, [name, status, internal_id]);
        const currentDate = new Date();
        await SatffLogUpdateOperation(
            {
                staff_id: subInternal.StaffUserId,
                ip: subInternal.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: "Sub Internal",
                log_message: `created Sub Internal ${name}`,
                permission_type: "created",
                module_id: result.insertId
            }
        );
        return { status: true, message: 'Internal created successfully.', data: result.insertId };
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
}

const getSubInternal = async (subInternal) => {
    const { id } = subInternal;
    const query = `SELECT * FROM sub_internal WHERE id = ?`;
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
    const query = `SELECT * FROM sub_internal WHERE internal_id = ?`;
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
                log_message: `deleted Sub Internal ${existName.name}`,
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

    // update internal
    const query = `UPDATE sub_internal SET name = ?, status = ? WHERE id = ?`;
    try {
        const [[existStatus]] = await pool.execute(`SELECT status FROM sub_internal WHERE id = ?`, [id]);
        let status_change = "Deactivate"
        if (status == "1") {
            status_change = "Activate"
        }
        let log_message = existStatus.status === status ?
            `edited Sub Internal ${name}` :
            `changes the Sub Internal status ${status_change} ${name}`

        const [result] = await pool.query(query, [name, status, id]);
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
        return { status: true, message: 'sub internal updated successfully.', data: result.insertId };
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
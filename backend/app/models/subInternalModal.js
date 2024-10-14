const pool = require('../config/database');
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
            return { status: false, message: 'Internal already exists.' };
        }
        const [result] = await pool.execute(query, [name , internal_id]);
        return { status: true, message: 'Internal created successfully.', data: result.insertId };
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
    // delete internal
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
        const [result] = await pool.query
            (query, [name, status, id]);
        return { status: true, message: 'Sub-Internal task updated successfully.', data: result.insertId };
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
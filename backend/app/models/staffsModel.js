const pool = require('../../app/config/database');

const createStaff = async (staff) => {
    const { role_id, first_name, last_name, email, phone, password, status } = staff;

    const query = `
    INSERT INTO staffs (role_id, first_name, last_name, email, phone, password, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await pool.execute(query, [role_id, first_name, last_name, email, phone, password, status]);
        return result.insertId;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
};

const getStaff = async () => {
    const [rows] = await pool.query('SELECT staffs.id , staffs.role_id , staffs.first_name , staffs.last_name , staffs.email , staffs.phone , staffs.status , roles.role_name , roles.role FROM staffs JOIN roles ON staffs.role_id = roles.id ORDER BY staffs.id DESC');
    return rows;
};

const getManagerStaff = async () => {
    const [rows] = await pool.query('SELECT staffs.id , staffs.role_id , staffs.first_name , staffs.last_name , staffs.email , staffs.phone , staffs.status , roles.role_name , roles.role FROM staffs JOIN roles ON staffs.role_id = roles.id where staffs.role_id=4');
    return rows;
};

const deleteStaff = async (staffId) => {
    // const query = `
    // DELETE FROM staffs WHERE id = ?
    // `;

    // try {
    //     await pool.execute(query, [staffId]);
    // } catch (err) {
    //     console.error('Error deleting data:', err);
    //     throw err;
    // }
};

const updateStaff = async (staff) => {
    const { id, ...fields } = staff;
    // Create an array to hold the set clauses
    const setClauses = [];
    const values = [];
    // Iterate over the fields and construct the set clauses dynamically
    for (const [key, value] of Object.entries(fields)) {
        setClauses.push(`${key} = ?`);
        values.push(value);
    }
    // Add the id to the values array for the WHERE clause
    values.push(id);
    // Construct the final SQL query
    const query = `
    UPDATE staffs
    SET ${setClauses.join(', ')}
    WHERE id = ?
    `;
    try {
        await pool.execute(query, values);
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
};

const staffCompetency = async (staffCompetency) => {
 const { staff_id,action, service } = staffCompetency;
 if(action==="update"){
    const addQuery = `
    INSERT INTO staff_competencies (staff_id, service_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
   `;
   
   const deleteQuery = `
    DELETE FROM staff_competencies
    WHERE staff_id = ? AND service_id = ?
   `;
   
    try {
        for (const serv of service) {
            if (serv.status) {
                // Insert service
                await pool.execute(addQuery, [staff_id, serv.service_id]);
            } else {
                // Delete service
                await pool.execute(deleteQuery, [staff_id, serv.service_id]);
            }
        }
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
 }else{
    
    const query = `
        SELECT 
            services.id as service_id, 
            services.name as service_name, 
            CASE 
                WHEN staff_competencies.service_id IS NOT NULL THEN true 
                ELSE false 
            END as status 
        FROM 
            services 
        LEFT JOIN 
            staff_competencies 
        ON 
            services.id = staff_competencies.service_id 
        AND 
            staff_competencies.staff_id = ?
    `;

    const [rows] = await pool.query(query, [staff_id]);
    return rows;
 }


}

const getStaffByEmail = async (email) => {
    const [rows] = await pool.query('SELECT staffs.id , staffs.email , staffs.password , staffs.role_id, staffs.status,roles.role_name ,roles.role  FROM staffs JOIN roles ON staffs.role_id = roles.id  WHERE staffs.email = ?', [email]);

    return rows[0];
};

const getStaffById = async (id) => {
    const [rows] = await pool.query('SELECT id , login_auth_token FROM staffs  WHERE id = ?', [id]);
    return rows[0];
};

const isLoginAuthTokenCheckmodel = async (staff) => {
     const { id, login_auth_token } = staff;
     const [rows] = await pool.query('SELECT id , login_auth_token FROM staffs WHERE id = ? AND login_auth_token = ?', [id , login_auth_token]);
     return rows[0];
};

const profile = async (staff) => {
    const { id } = staff;
    const query = `
    SELECT id, first_name, last_name, email, phone, status FROM staffs WHERE id = ?
    `;

    try {
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
}

module.exports = {
    createStaff,
    getStaff,
    getManagerStaff,
    deleteStaff,
    updateStaff,
    staffCompetency,
    getStaffByEmail,
    getStaffById,
    isLoginAuthTokenCheckmodel,
    profile
};
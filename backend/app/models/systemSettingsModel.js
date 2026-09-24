const pool = require("../config/database");

const getSettings = async () => {
    const query = `SELECT * FROM system_settings ORDER BY id DESC LIMIT 1`;
    try {
        const [result] = await pool.execute(query);
        return result.length ? result[0] : null;
    } catch (err) {
        throw err;
    }
};

const updateSettings = async (settings) => {
    const { 
        allocated_on_limit, 
        received_on_limit, 
        missing_date_limit,
        manager_otp_number,
        sms_api_url,
        sms_api_key,
        sms_sender_id
    } = settings;
    try {
        const existing = await getSettings();
        if (existing) {
            const query = `UPDATE system_settings SET allocated_on_limit = ?, received_on_limit = ?, missing_date_limit = ?, manager_otp_number = ?, sms_api_url = ?, sms_api_key = ?, sms_sender_id = ? WHERE id = ?`;
            const [result] = await pool.execute(query, [allocated_on_limit, received_on_limit, missing_date_limit, manager_otp_number, sms_api_url, sms_api_key, sms_sender_id, existing.id]);
            return result;
        } else {
            const query = `INSERT INTO system_settings (allocated_on_limit, received_on_limit, missing_date_limit, manager_otp_number, sms_api_url, sms_api_key, sms_sender_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await pool.execute(query, [allocated_on_limit, received_on_limit, missing_date_limit, manager_otp_number, sms_api_url, sms_api_key, sms_sender_id]);
            return result;
        }
    } catch (err) {
        throw err;
    }
};

module.exports = {
    getSettings,
    updateSettings
};

const pool = require("../config/database");

const createOtp = async (jobId, requestedBy, otpCode) => {
    // Expire OTP in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60000); 
    
    const query = `INSERT INTO job_status_otps (job_id, requested_by, otp_code, expires_at) VALUES (?, ?, ?, ?)`;
    try {
        const [result] = await pool.execute(query, [jobId, requestedBy, otpCode, expiresAt]);
        return result.insertId;
    } catch (err) {
        throw err;
    }
};

const verifyOtp = async (jobId, otpCode) => {
    const query = `SELECT * FROM job_status_otps WHERE job_id = ? AND otp_code = ? AND is_used = 0 ORDER BY created_at DESC LIMIT 1`;
    try {
        const [result] = await pool.execute(query, [jobId, otpCode]);
        
        if (result.length === 0) {
            return { status: false, message: "Invalid OTP or already used." };
        }

        const otpRecord = result[0];
        const currentTime = new Date();

        if (currentTime > new Date(otpRecord.expires_at)) {
            return { status: false, message: "OTP has expired." };
        }

        // Mark OTP as used
        await pool.execute(`UPDATE job_status_otps SET is_used = 1 WHERE id = ?`, [otpRecord.id]);
        
        return { status: true, message: "OTP verified successfully." };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    createOtp,
    verifyOtp
};

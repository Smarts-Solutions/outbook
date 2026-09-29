const { pool } = require('../../config/database');

const createOtp = async (jobId, requestedBy, otpCode) => {
    const expiresAt = new Date();
    // Expire OTP in 10 minutes
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const query = `INSERT INTO job_status_otps (job_id, requested_by, otp_code, expires_at) VALUES (?, ?, ?, ?)`;
    try {
        const [result] = await pool.execute(query, [jobId, requestedBy, otpCode, expiresAt]);
        return result;
    } catch (error) {
        throw error;
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
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createOtp,
    verifyOtp
};

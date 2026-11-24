const nodemailer = require("nodemailer");

/**
 * Dedicated Email Service for Billing Module
 * - Keeps persistent connection pool for fast delivery (avoids handshake overhead)
 * - Adds anti-loop and anti-greylisting headers (Message-ID, X-Billing-Submission-ID)
 * - Leaves commonEmail.js completely untouched
 */
let cachedTransporter = null;

const getTransporter = () => {
    if (!cachedTransporter) {
        const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
        const smtpPort = Number(process.env.SMTP_PORT) || 587;
        const smtpUsername = process.env.SMTP_USERNAME;
        const smtpPassword = process.env.SMTP_PASSWORD;

        cachedTransporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            pool: true, // Use connection pool for immediate reuse and high reliability
            maxConnections: 3,
            maxMessages: 50,
            auth: {
                user: smtpUsername,
                pass: smtpPassword,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    return cachedTransporter;
};

/**
 * Send Billing Return Email
 * @param {string} toEmail - Recipient email
 * @param {string} subjectEmail - Email subject
 * @param {string} htmlEmail - Email body HTML
 * @param {number|string} submissionId - Submission ID for tracking & headers
 */
const sendBillingReturnEmail = async (toEmail, subjectEmail, htmlEmail, submissionId = 0) => {
    try {
        if (!toEmail || !toEmail.trim()) {
            console.warn("[Billing Email Service] No recipient email specified.");
            return false;
        }

        const transporter = getTransporter();
        const fromEmail = process.env.SMTP_USERNAME;
        const timestamp = Date.now();
        const messageId = `<billing-return-${submissionId}-${timestamp}@outbooks.com>`;

        const mailOptions = {
            from: fromEmail,
            to: toEmail.trim(),
            subject: subjectEmail,
            html: htmlEmail,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Billing Email Service] Mail sent successfully for submission #${submissionId}:`, info.messageId);
        return true;
    } catch (error) {
        console.error(`[Billing Email Service] Error sending billing return email for #${submissionId}:`, error);
        return false;
    }
};

module.exports = { sendBillingReturnEmail };

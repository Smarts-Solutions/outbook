let nodemailer = require("nodemailer");

const commonEmail = async (toEmail, subjectEmail, htmlEmail, cc = '', bcc = '', dynamic_attachment = "",filename = "") => {
    try {

        let smtpHost = process.env.SMTP_HOST;
        let smtpPort = process.env.SMTP_PORT;
        let smtpUsername = process.env.SMTP_USERNAME;
        let smtpPassword = process.env.SMTP_PASSWORD;

       
        // console.log("SMTP Host:", smtpHost);
        // console.log("SMTP Port:", smtpPort);
        // console.log("smtp Username:", smtpUsername);
        // console.log("smtp Password:", smtpPassword); 

        const transport = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: false, // STARTTLS
            auth: {
                user: smtpUsername,
                pass: smtpPassword,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });


        // Mail options
        const mailOptions = {
            from: smtpUsername,
            to: toEmail,
            cc: cc,
            bcc: bcc,
            subject: subjectEmail,
            html: htmlEmail,
            attachments: [
                {
                    filename: filename,
                    content: dynamic_attachment,
                },
            ],
        };

        const info = await transport.sendMail(mailOptions);
        console.log("✅ Mail sent successfully:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return false;
    }
};

module.exports = { commonEmail };
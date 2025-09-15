const nodemailer = require("nodemailer");

/**
 * Send AWS credentials via email
 * @param {string} toEmail - recipient email
 * @param {string} awsUsername - AWS username
 * @param {string} awsPassword - AWS password
 */
async function sendAWSCredentials(toEmail, awsUsername, awsPassword) {
  try {
    // Fixed Outlook SMTP credentials
    const outlookUser = "Do-not-reply@outbooks.com";
    const outlookPass = "ywnglyjkqnnflvnd"; // App Password (not normal password)

    // Transporter setup
    const transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: outlookUser,
        pass: outlookPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Mail options
    const mailOptions = {
      from: outlookUser,
      to: toEmail,
      subject: "Your AWS Credentials",
      html: `
        <h3>AWS Credentials</h3>
        <p><b>Username:</b> ${awsUsername}</p>
        <p><b>Password:</b> ${awsPassword}</p>
        <hr/>
        <p>This mail was sent via <b>smtp-mail.outlook.com</b> on port <b>587</b> with STARTTLS.</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

// Example call
sendAWSCredentials(
  "shakirpnp@gmail.com",   // Receiver
  "AWS-User-123",          // AWS Username (example)
  "AWS-Pass-456"           // AWS Password (example)
);

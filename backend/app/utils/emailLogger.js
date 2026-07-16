// Dummy email logger created for testing purposes
function logEmail(data) {
    console.log("Mock logEmail called for:", data.toEmail, "File:", data.logFileName);
}

module.exports = { logEmail };

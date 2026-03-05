const app = require('./app');
const http = require('http');
const { port } = require('./app/config/config');


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// UPDATE customers
// SET trading_name = SUBSTRING_INDEX(trading_name, '_', 1)
// WHERE trading_name LIKE '%\_%';


// DB_HOST=localhost
// DB_USER=root
// DB_PASSWORD=
// DB_NAME=outbook
// PORT=2222
// JWT_SECRET=SECRET_KEY
// SMTP_HOST=smtp-mail.outlook.com
// SMTP_PORT=587
// SMTP_USERNAME=Do-not-reply@outbooks.com
// SMTP_PASSWORD=ywnglyjkqnnflvnd



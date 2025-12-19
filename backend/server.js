const app = require('./app');
const http = require('http');
const { port } = require('./app/config/config');


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// UPDATE customers
// SET trading_name = SUBSTRING_INDEX(trading_name, '_', 1)
// WHERE trading_name LIKE '%\_%';


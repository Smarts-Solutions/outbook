const app = require('./app');
const { port } = require('./app/config/config');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
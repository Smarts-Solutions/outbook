const pLimit = require("p-limit").default;
const limit = pLimit(10);
module.exports = limit;
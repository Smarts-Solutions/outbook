const pLimitModule = require("p-limit");
const pLimit = pLimitModule.default || pLimitModule;

const limit = pLimit(10);

module.exports = limit;
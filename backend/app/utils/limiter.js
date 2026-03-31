// const pLimit = require("p-limit").default;
const pLimit = require("p-limit");

const limit = pLimit(10);

module.exports = limit;

const jobModel = require('../../models/jobModel');

const getAddJobData = async (job) => {
  return jobModel.getAddJobData(job);
};



module.exports = {
  getAddJobData
 };
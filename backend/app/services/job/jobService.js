
const jobModel = require('../../models/jobModel');

const getAddJobData = async (job) => {
  return jobModel.getAddJobData(job);
};

const jobAdd = async (job) => {
  return jobModel.jobAdd(job);
};



module.exports = {
  getAddJobData,
  jobAdd
 };
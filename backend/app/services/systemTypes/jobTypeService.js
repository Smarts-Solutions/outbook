
const jobTypeModel = require('../../models/jobTypeModel');


const addJobType = async (JobType) => {
  return jobTypeModel.createJobType(JobType);
};

const getJobType = async () => {
  return jobTypeModel.getJobType();
}

const removeJobType = async (JobTypeId) => {
  return jobTypeModel.deleteJobType(JobTypeId);
};

const modifyJobType = async (JobType) => {
  return jobTypeModel.updateJobType(JobType);
};


module.exports = {
  addJobType,
  getJobType,
  removeJobType,
  modifyJobType
};
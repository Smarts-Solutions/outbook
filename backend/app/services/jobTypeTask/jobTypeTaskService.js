
const jobTypeTaskModel = require('../../models/jobTypeTaskModel');


const addJobType = async (JobType) => {
  return jobTypeTaskModel.createJobType(JobType);
};

const getJobType = async () => {
  return jobTypeTaskModel.getJobType();
}

const removeJobType = async (JobTypeId) => {
  return jobTypeTaskModel.deleteJobType(JobTypeId);
};

const modifyJobType = async (JobType) => {
  return jobTypeTaskModel.updateJobType(JobType);
};


module.exports = {
    addJobType,
    removeJobType,
    modifyJobType,
    getJobType
};
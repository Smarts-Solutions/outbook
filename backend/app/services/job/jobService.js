
const jobModel = require('../../models/jobModel');

const getAddJobData = async (job) => {
  return jobModel.getAddJobData(job);
};

const jobAdd = async (job) => {
  return jobModel.jobAdd(job);
};

const jobAction = async (job) => {
  const {action} = job
  if(action === "getByCustomer"){
    return jobModel.getJobByCustomer(job);
  }
  else if(action === "getByClient"){
    return jobModel.getJobByClient(job);
  }
  else if(action === "getByJobId"){
    return jobModel.getJobById(job);
  }
  else{
    return { status: false, message: 'Error getting job.' };
  }
};

const jobUpdate = async (job) => {
  return jobModel.jobUpdate(job);
};



module.exports = {
  getAddJobData,
  jobAdd,
  jobAction,
  jobUpdate
 };
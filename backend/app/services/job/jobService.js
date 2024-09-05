
const jobModel = require('../../models/jobModel');
const taskTimeSheetModel = require('../../models/taskTimeSheetModel');

// Job Work .....
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
  else if(action === "getByJobStaffId"){
    return jobModel.getByJobStaffId(job);
  }
  else if(action === "delete"){
    return jobModel.deleteJobById(job);
  }
  else{
    return { status: false, message: 'Error getting job.' };
  }
};

const jobUpdate = async (job) => {
  return jobModel.jobUpdate(job);
};


// task TimeSheet  Work .....
const getTaskTimeSheet = async (job) => {
  return taskTimeSheetModel.getTaskTimeSheet(job);
};

const jobTimeSheet = async (job) => {
  const {action} = job
  if(action === "get"){
    return taskTimeSheetModel.getjobTimeSheet(job);
  }
  else{
    return { status: false, message: 'Error getting Job TimeSheet.' };
  }
  
}



module.exports = {
  getAddJobData,
  jobAdd,
  jobAction,
  jobUpdate,
  getTaskTimeSheet,
  jobTimeSheet

 };
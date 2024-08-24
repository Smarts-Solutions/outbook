
const jobTypeTaskModel = require('../../models/jobTypeTaskModel');


const addJobType = async (JobType) => {
  
  return jobTypeTaskModel.createJobType(JobType);
};

const getJobType = async (JobType) => {
  return jobTypeTaskModel.getJobType(JobType);
}

const removeJobType = async (JobTypeId) => {
  return jobTypeTaskModel.deleteJobType(JobTypeId);
};

const modifyJobType = async (JobType) => {
  return jobTypeTaskModel.updateJobType(JobType);
};

const addTask = async (task) => {
  return jobTypeTaskModel.addTask(task);
};

const getTask = async (task) => {
  return jobTypeTaskModel.getTask(task);
};

const addChecklist = async (checklist) => {
  return jobTypeTaskModel.addChecklist(checklist);
};

const checklistAction = async (checklist) => {

  const {action} = checklist
  if(action === "get"){
    return jobTypeTaskModel.getChecklist(checklist);
  }
  else if(action === "getById"){
    return jobTypeTaskModel.getByIdChecklist(checklist);
  }
  else if(action === "delete"){
    return jobTypeTaskModel.deleteChecklist(checklist);
  }
  else if(action === "getClientType"){
    return jobTypeTaskModel.getClientTypeChecklist(checklist);
  }
  else{
    return { status: false, message: 'Error getting checklist.' };
  }

};

const updateChecklist = async (checklist) => {
  return jobTypeTaskModel.updateChecklist(checklist);
};

const customerGetService = async (task) => {
  return jobTypeTaskModel.customerGetService(task);
};


module.exports = {
    addJobType,
    removeJobType,
    modifyJobType,
    getJobType,
    addTask,
    getTask,
    addChecklist,
    checklistAction,
    updateChecklist,
    customerGetService
};
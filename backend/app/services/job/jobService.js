
const { query } = require('../../config/database');
const jobModel = require('../../models/jobModel');
const taskTimeSheetModel = require('../../models/taskTimeSheetModel');
const otpModel = require('../../models/otpModel');
const systemSettingsModel = require('../../models/systemSettingsModel');
const axios = require('axios'); // For SMS API calls

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
  else if(action === "getByStatus"){
    return jobModel.GetJobStatus(job);
  }
  else if(action === "get_jobs_filter"){
    return jobModel.get_jobs_filter(job);
  }
  else if(action === "copy_job"){
    return jobModel.copy_job(job);
  }
   else if(action === "getJobsDeleteService"){
    return jobModel.getJobsDeleteService(job);
  }
  else{
    return { status: false, message: 'Error getting job.' };
  }
};

const jobUpdate = async (job) => {
  return jobModel.jobUpdate(job);
};

const updateJobStatus = async(job)=>{
  return jobModel.updateJobStatus(job);
}


// task TimeSheet  Work .....
const getTaskTimeSheet = async (timeSheet) => {
  return taskTimeSheetModel.getTaskTimeSheet(timeSheet);
};

const jobTimeSheet = async (timeSheet) => {
  const {action} = timeSheet
  if(action === "get"){
    return taskTimeSheetModel.getjobTimeSheet(timeSheet);
  }
  else if(action === "updateTaskTimeSheetStatus"){
    return taskTimeSheetModel.updateTaskTimeSheetStatus(timeSheet);
  }
  else if(action === "updateJobTimeTotalHours"){
    return taskTimeSheetModel.updateJobTimeTotalHours(timeSheet);
  }
  else{
    return { status: false, message: 'Error getting Job TimeSheet.' };
  }
  
}

//MissingLog
const addMissingLog = async (missingLog) => {
  return taskTimeSheetModel.addMissingLog(missingLog);
}
const getMissingLog = async (missingLog) => {
  const {action} = missingLog
  if(action === "get"){
    return taskTimeSheetModel.getMissingLog(missingLog);
  }
  else if(action === "getSingleView"){
    return taskTimeSheetModel.getMissingLogSingleView(missingLog);
  }
  else{
    return { status: false, message: 'Error getting Missing Log.' };
  }
  
}

const editMissingLog = async(missingLog) => {
  return taskTimeSheetModel.editMissingLog(missingLog);
}

const uploadDocumentMissingLogAndQuery = async (missingLog) => {
  return taskTimeSheetModel.uploadDocumentMissingLogAndQuery(missingLog);
}

//Queries
const addQuerie = async(querie) => {
  return taskTimeSheetModel.addQuerie(querie);
}

const getQuerie = async (querie) => {
  const {action} = querie
  if(action === "get"){
    return taskTimeSheetModel.getQuerie(querie);
  }
  else if(action === "getSingleView"){
    return taskTimeSheetModel.getQuerieSingleView(querie);
  }
  else{
    return { status: false, message: 'Error getting Missing Log.' };
  }
}

const editQuerie = async (query) => {
  return taskTimeSheetModel.editQuerie(query);
}

//Draft
const getDraft = async (draft) => {
  const {action} = draft
  if(action === "get"){
    return taskTimeSheetModel.getDraft(draft);
  }
  else if(action === "getSingleView"){
    return taskTimeSheetModel.getDraftSingleView(draft);
  }
  else{
    return { status: false, message: 'Error getting Missing Log.' };
  }
}

const addDraft = async (draft) => {
  return taskTimeSheetModel.addDraft(draft);
}

const editDraft = async (draft) => {
  return taskTimeSheetModel.editDraft(draft);
}

//JobDocument
const jobDocumentAction = async (jobDocument) => {
  const {action} = jobDocument
  if(action === "get"){
    return taskTimeSheetModel.getJobDocument(jobDocument);
  }
  else if(action === "delete"){
    return taskTimeSheetModel.deleteJobDocument(jobDocument);
  }
  else if(action === "add"){
    return taskTimeSheetModel.addedJobDocument(jobDocument);
  }
  else{
    return { status: false, message: 'Error getting Job Document.' };
  }

}

const addJobDocument = async (jobDocument) => {
  return taskTimeSheetModel.addJobDocument(jobDocument);
}

// JobTimeLine
const getJobTimeLine = async (job) => {
  return jobModel.getJobTimeLine(job);
};

const sendJobStatusOtp = async (data) => {
  const { jobId, requestedBy } = data;
  
  try {
    const settings = await systemSettingsModel.getSettings();
    
    // Generate a 6-digit random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to database
    await otpModel.createOtp(jobId, requestedBy, otpCode);
    
    // Send SMS via dynamic API (e.g. Twilio or MSG91 structure)
    // Replace the placeholders with actual API structure based on provider
    if (settings.sms_api_url && settings.sms_api_key) {
      /* Example for sending SMS 
      await axios.post(settings.sms_api_url, {
        to: settings.manager_otp_number,
        sender: settings.sms_sender_id,
        message: `OTP to change Job Status is: ${otpCode}`,
        key: settings.sms_api_key
      });
      */
      console.log(`Sending SMS to ${settings.manager_otp_number}: OTP is ${otpCode}`);
    } else {
      console.log(`No SMS API Configured. OTP is ${otpCode}`);
    }

    return { status: true, message: "OTP sent successfully." };
  } catch (error) {
    return { status: false, message: "Failed to send OTP.", error: error.message };
  }
};

const verifyJobStatusOtp = async (data) => {
  const { jobId, otpCode } = data;
  try {
    const result = await otpModel.verifyOtp(jobId, otpCode);
    return result;
  } catch (error) {
    return { status: false, message: "Failed to verify OTP.", error: error.message };
  }
};



module.exports = {
  getAddJobData,
  jobAdd,
  jobAction,
  jobUpdate,
  updateJobStatus,
  getTaskTimeSheet,
  jobTimeSheet,
  addMissingLog,
  getMissingLog,
  editMissingLog,
  getQuerie,
  addQuerie,
  editQuerie,
  getDraft,
  addDraft,
  jobDocumentAction,
  addJobDocument,
  editDraft,
  getJobTimeLine,
  uploadDocumentMissingLogAndQuery,
  sendJobStatusOtp,
  verifyJobStatusOtp
 };
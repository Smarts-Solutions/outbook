
const { query } = require('../../config/database');
const jobModel = require('../../models/jobModel');
const taskTimeSheetModel = require('../../models/taskTimeSheetModel');
const otpModel = require('../../models/otpModel');
const axios = require('axios');

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
  try {
    const { jobId, requestedBy, settings, jobCodeId, staffName, staffRole, customerName, clientName, newStatus } = data;
    // Generate a 6-digit random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    await otpModel.createOtp(jobId, requestedBy, otpCode);
    // Send OTP via WhatsApp Cloud API
    if (settings && settings.manager_otp_number && settings.whatsapp_phone_number_id && settings.whatsapp_access_token) {
      const url = `https://graph.facebook.com/v17.0/${settings.whatsapp_phone_number_id}/messages`;
      const templateName = settings.whatsapp_template_name || "job_status_otp";
      
      // Determine components based on template type
      let components = [];
      const isAuthOtpTemplate = templateName === "outbook_message" || templateName.toLowerCase().includes("otp");

      if (templateName === "hello_world") {
        components = [];
      } else if (isAuthOtpTemplate) {
        // Meta WhatsApp Authentication OTP template structure
        components = [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: otpCode
              }
            ]
          },
          {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
              {
                type: "text",
                text: otpCode
              }
            ]
          }
        ];
      } else {
        // Multi-parameter custom template
        components = [
          {
            type: "body",
            parameters: [
              { type: "text", text: staffName || "Staff" },
              { type: "text", text: staffRole || "Staff Role" },
              { type: "text", text: customerName || "Unknown Customer" },
              { type: "text", text: clientName || "Unknown Client" },
              { type: "text", text: jobCodeId || String(jobId) },
              { type: "text", text: newStatus || "Status" },
              { type: "text", text: otpCode }
            ]
          }
        ];
      }

      const headers = {
        'Authorization': `Bearer ${settings.whatsapp_access_token}`,
        'Content-Type': 'application/json'
      };

      const sendWithPayload = async (langCode, comps) => {
        const payload = {
          messaging_product: "whatsapp",
          to: settings.manager_otp_number,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: langCode
            }
          }
        };
        if (comps && comps.length > 0) {
          payload.template.components = comps;
        }
        return axios.post(url, payload, { headers });
      };

      try {
        // First try with 'en' (standard for English templates in Meta)
        await sendWithPayload("en", components);
        console.log(`WhatsApp OTP sent to ${settings.manager_otp_number}: OTP is ${otpCode}`);
      } catch (firstErr) {
        // If button component failed or rejected, try body-only parameter
        if (isAuthOtpTemplate && components.length > 1) {
          try {
            const bodyOnlyComps = [{ type: "body", parameters: [{ type: "text", text: otpCode }] }];
            await sendWithPayload("en", bodyOnlyComps);
            console.log(`WhatsApp OTP sent to ${settings.manager_otp_number} (body-only): OTP is ${otpCode}`);
            return { status: true, message: "OTP sent successfully." };
          } catch (retryBodyErr) {
            // Fallback to en_US
            try {
              await sendWithPayload("en_US", components);
              console.log(`WhatsApp OTP sent to ${settings.manager_otp_number} (en_US): OTP is ${otpCode}`);
              return { status: true, message: "OTP sent successfully." };
            } catch (retryLangErr) {
              throw retryLangErr;
            }
          }
        } else {
          // Retry with en_US
          await sendWithPayload("en_US", components);
          console.log(`WhatsApp OTP sent to ${settings.manager_otp_number} (en_US): OTP is ${otpCode}`);
        }
      }
    } else {
      console.log(`WhatsApp API not fully configured. OTP generated is ${otpCode}`);
    }

    return { status: true, message: "OTP sent successfully." };
  } catch (error) {
    const errorMsg = error.response && error.response.data && error.response.data.error 
                     ? error.response.data.error.message 
                     : error.message;
    console.error("WhatsApp API Error: ", error.response ? error.response.data : error.message);
    return { status: false, message: "Failed to send OTP.", error: errorMsg };
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
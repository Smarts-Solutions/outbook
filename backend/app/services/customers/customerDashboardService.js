const customerDashboardModel = require('../../models/customerDashboardModel');
const jobModel = require('../../models/jobModel');
const jobTypeTaskService = require('../jobTypeTask/jobTypeTaskService');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const getCustomerDashboardData = async (dashboard) => {
  return customerDashboardModel.getCustomerDashboardData(dashboard);
};

const getCustomerDashboardActivityLog = async (dashboard) => {
  return customerDashboardModel.getCustomerDashboardActivityLog(dashboard);
};

const getCustomerCountLinkData = async (dashboard) => {
  return await customerDashboardModel.getCustomerCountLinkData(dashboard);
};

const getCustomerMasterStatus = async () => {
  return await customerDashboardModel.getMasterStatus();
};

const updateCustomerJobStatus = async (data) => {
  return await customerDashboardModel.updateJobStatus(data);
};

const getCustomerDropdown = async (data) => {
  return await customerDashboardModel.getCustomerDropdown(data);
};

const getCustomerList = async (data) => {
  return await customerDashboardModel.getCustomerList(data);
};

const getCustomerClientList = async (data) => {
  return await customerDashboardModel.getCustomerClientList(data);
};

const getCustomerJobList = async (data) => {
  return await customerDashboardModel.getCustomerJobList(data);
};

const customerClientAction = async (data) => {
  return await customerDashboardModel.customerClientAction(data);
};

const customerJobAction = async (data) => {
  return await customerDashboardModel.customerJobAction(data);
};

const customerJobUpdate = async (data) => {
  return await customerDashboardModel.customerJobUpdate(data);
};

const customerJobTimeline = async (data) => {
  return await customerDashboardModel.customerJobTimeline(data);
};

const customerTaskTimesheetAction = async (data) => {
  return await customerDashboardModel.customerTaskTimesheetAction(data);
};

const customerMissingLogAction = async (data) => {
  return await customerDashboardModel.customerMissingLogAction(data);
};

const customerQueryAction = async (data) => {
  return await customerDashboardModel.customerQueryAction(data);
};

const customerDraftAction = async (data) => {
  return await customerDashboardModel.customerDraftAction(data);
};

const customerDocumentAction = async (data) => {
  return await customerDashboardModel.customerDocumentAction(data);
};

const getCustomerAddJobData = async (data) => {
  return await jobModel.getAddJobData(data);
};

const customerJobAdd = async (data) => {
  return await jobModel.jobAdd(data);
};

const customerChecklistAction = async (data) => {
  return await jobTypeTaskService.checklistAction(data);
};

const customerJobType = async (data) => {
  return await jobTypeTaskService.getJobType(data);
};

const customerGetOfficerDetails = async (data) => {
  try {
    let type = data.type;
    let url = 'https://api.companieshouse.gov.uk/company/' + data.company_number;
    if (type != "company_info") {
      url += '/officers';
    }

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Authorization': 'Basic bm9uT2Y4Snk5X2thX2ZnRzJndEZ5TkxwYThsSm1zVkd2ekZadlRiRjo='
      }
    };

    const response = await axios.request(config);
    const resultData = type === "company_info" ? response.data : response.data.items;
    return { status: true, data: resultData, message: "success.." };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const customerDownloadChecklist = async (checklist_id) => {
  try {
    const filenameFromDB = await jobTypeTaskService.getFilenameById(checklist_id);
    if (!filenameFromDB) {
      return { status: false, message: 'Checklist record not found' };
    }

    const diskFileName = `checklist_excel_${checklist_id}.zip`;
    const filePath = path.join(__dirname, '../../../checklist_excel', diskFileName);

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath);
      return { status: true, data: fileData, filename: filenameFromDB };
    } else {
      return { status: false, message: 'File not found on server' };
    }
  } catch (error) {
    return { status: false, message: error.message };
  }
};

module.exports = {
  getCustomerDashboardData,
  getCustomerDashboardActivityLog,
  getCustomerCountLinkData,
  getCustomerMasterStatus,
  updateCustomerJobStatus,
  getCustomerDropdown,
  getCustomerList,
  getCustomerClientList,
  getCustomerJobList,
  customerClientAction,
  customerJobAction,
  customerJobUpdate,
  customerJobTimeline,
  customerTaskTimesheetAction,
  customerMissingLogAction,
  customerQueryAction,
  customerDraftAction,
  customerDocumentAction,
  getCustomerAddJobData,
  customerJobAdd,
  customerChecklistAction,
  customerGetOfficerDetails,
  customerJobType,
  customerDownloadChecklist,
};

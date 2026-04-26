const customerDashboardModel = require('../../models/customerDashboardModel');

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
};

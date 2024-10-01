
const dashboardModel = require('../../models/dashboardModel');

const getDashboardData = async (dashboard) => {
  return dashboardModel.getDashboardData(dashboard);
};

const getDashboardActivityLog = async (dashboard) => {
  return dashboardModel.getDashboardActivityLog(dashboard);
}



module.exports = {
  getDashboardData,
  getDashboardActivityLog
};
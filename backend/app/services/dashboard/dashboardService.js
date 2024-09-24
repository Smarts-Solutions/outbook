
const dashboardModel = require('../../models/dashboardModel');

const getDashboardData = async (dashboard) => {
  return dashboardModel.getDashboardData(dashboard);
};



module.exports = {
  getDashboardData
};
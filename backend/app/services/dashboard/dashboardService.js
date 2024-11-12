
const dashboardModel = require('../../models/dashboardModel');

const getDashboardData = async (dashboard) => {
  return dashboardModel.getDashboardData(dashboard);
};

const getDashboardActivityLog = async (dashboard) => {
  return dashboardModel.getDashboardActivityLog(dashboard);
}



const getCountLinkData = async (dashboard) => {
  const {key} = dashboard
  if(key === "client"){
    return dashboardModel.getByAllClient(dashboard);
  }
  else if(key === "customer"){
    return dashboardModel.getByAllCustomer(dashboard);
  }
  else if(key === "job"){
    return dashboardModel.getByAllJob(dashboard);
  }
  else if(key === "completed_job"){
    return dashboardModel.getByAllCompletedJob(dashboard);
  }
  else if(key === "pending_job"){
    return dashboardModel.getByAllPendingJob(dashboard);
  }
  else if(key === "staff"){
    return dashboardModel.getByAllStaff(dashboard);
  }
  else{
    return { status: false, message: 'Error getting dashbordata.' };
  }
};



module.exports = {
  getDashboardData,
  getDashboardActivityLog,
  getCountLinkData
};
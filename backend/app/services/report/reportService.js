const reportModel = require('../../models/reportModel');

const jobStatusReports = async (Report) => {
  return reportModel.jobStatusReports(Report);
};

const jobSummaryReports = async(Report) => {
  return reportModel.jobSummaryReports(Report);
}

const jobPendingReports = async(Report) =>{
  return reportModel.jobPendingReports(Report);
}

const teamMonthlyReports = async (Report) => {
  return reportModel.teamMonthlyReports(Report);
}
module.exports = {
  jobStatusReports,
  jobSummaryReports,
  jobPendingReports,
  teamMonthlyReports
};
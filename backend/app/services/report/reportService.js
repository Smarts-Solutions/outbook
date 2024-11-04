const reportModel = require('../../models/reportModel');

const jobStatusReports = async (Report) => {
  return reportModel.jobStatusReports(Report);
};

const jobReceivedSentReports = async (Report) => {
  return reportModel.jobReceivedSentReports(Report);
}

const jobSummaryReports = async(Report) => {
  return reportModel.jobSummaryReports(Report);
}

const jobPendingReports = async(Report) =>{
  return reportModel.jobPendingReports(Report);
}

const teamMonthlyReports = async (Report) => {
  return reportModel.teamMonthlyReports(Report);
}
const dueByReport = async (Report) => {
  return reportModel.dueByReport(Report);
}
module.exports = {
  jobStatusReports,
  jobReceivedSentReports,
  jobSummaryReports,
  jobPendingReports,
  teamMonthlyReports,
  dueByReport
};
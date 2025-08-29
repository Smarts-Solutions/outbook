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

const reportCountJob = async (Report) => {
  return reportModel.reportCountJob(Report);
}

const taxWeeklyStatusReport = async (Report) => {
  return reportModel.taxWeeklyStatusReport(Report);
}

const taxWeeklyStatusReportFilterKey = async (Report) => {
  return reportModel.taxWeeklyStatusReportFilterKey(Report);
}

const averageTatReport = async (Report) => {
  return reportModel.averageTatReport(Report);
}

const getAllTaskByStaff = async (Report) => {
  return reportModel.getAllTaskByStaff(Report);
}

const getTimesheetReportData = async (Report) => {
  return reportModel.getTimesheetReportData(Report);
}

module.exports = {
  jobStatusReports,
  jobReceivedSentReports,
  jobSummaryReports,
  jobPendingReports,
  teamMonthlyReports,
  dueByReport,
  reportCountJob,
  taxWeeklyStatusReport,
  taxWeeklyStatusReportFilterKey,
  averageTatReport,
  getAllTaskByStaff,
  getTimesheetReportData
};
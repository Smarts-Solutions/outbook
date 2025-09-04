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
const { data } = Report;
// console.log("Action in service:", data.action);
if(data.action == "get"){
  return reportModel.getAllTaskByStaff(Report);
}
else if(data.action == "getInternalJobs"){
  return reportModel.getInternalJobs(Report);
}
else if(data.action == "getInternalTasks"){
  return reportModel.getInternalTasks(Report);
}
else if(data.action == "missingTimesheetReport"){
  return reportModel.missingTimesheetReport(Report);
}
else if(data.action == "discrepancyReport"){
  return reportModel.discrepancyReport(Report);
}
else if(data.action == "capacityReport"){
  return reportModel.capacityReport(Report);
}

// Staff Work
else if(data.action == "getChangedRoleStaff"){
  return reportModel.getChangedRoleStaff(Report);
}
else if(data.action == "staffRoleChangeUpdate"){
  return reportModel.staffRoleChangeUpdate(Report);
}
else{
  return;
}
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
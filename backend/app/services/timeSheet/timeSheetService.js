const timeSheetModel = require('../../models/timeSheetModel');

const getTimesheet = async (Timesheet) => {
  return timeSheetModel.getTimesheet(Timesheet);
};
const getTimesheetTaskType = async (Timesheet) => {
  return timeSheetModel.getTimesheetTaskType(Timesheet);
};

const saveTimesheet = async(Timesheet) => {
  return timeSheetModel.saveTimesheet(Timesheet);
}

const getStaffHourMinute = async (Timesheet) => {
  return timeSheetModel.getStaffHourMinute(Timesheet);
}

const getTimesheetLogs = async (data) => {
  return timeSheetModel.getTimesheetLogs(data);
}

const deleteTimesheetRow = async (data) => {
  return timeSheetModel.deleteTimesheetRow(data);
}

const getManagerReviewCount = async (data) => {
  return timeSheetModel.getManagerReviewCount(data);
}

const getManagerReviewData = async (data) => {
  return timeSheetModel.getManagerReviewData(data);
}

const logTimesheetActivity = async (data) => {
  return timeSheetModel.logTimesheetActivity(data);
}

const getFollowUpList = async (data) => {
  return await timeSheetModel.getFollowUpList(data);
}

const getMisResourceUtilisation = async (data) => {
  return await timeSheetModel.getMisResourceUtilisation(data);
}

const getAllTimesheetDataExport = async (data) => {
  return timeSheetModel.getAllTimesheetDataExport(data);
}

module.exports = {
  getTimesheet,
  getTimesheetTaskType,
  saveTimesheet,
  getStaffHourMinute,
  getTimesheetLogs,
  deleteTimesheetRow,
  getManagerReviewCount,
  getManagerReviewData,
  logTimesheetActivity,
  getFollowUpList,
  getMisResourceUtilisation,
  getAllTimesheetDataExport
};
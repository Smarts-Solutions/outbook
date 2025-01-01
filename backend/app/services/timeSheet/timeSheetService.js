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





module.exports = {
  getTimesheet,
  getTimesheetTaskType,
  saveTimesheet,
  getStaffHourMinute
};
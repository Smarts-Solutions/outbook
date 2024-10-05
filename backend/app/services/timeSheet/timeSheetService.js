
const timeSheetModel = require('../../models/timeSheetModel');

const getTimesheetTaskType = async (Timesheet) => {
  return timeSheetModel.getTimesheetTaskType(Timesheet);
};


module.exports = {
  getTimesheetTaskType
};
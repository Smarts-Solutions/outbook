
const timeSheetmodal = require('../../models/timeSheet');

const getTimesheet = async (Timesheet) => {
  
  return timeSheetmodal.getTimesheet(Timesheet);
};

module.exports = {
  getTimesheet,
    
};
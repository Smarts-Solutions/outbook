const TimeSheetService = require('../../services/timesheet/TimeSheetService');

const getTimesheet = async (req, res) => {
    const { action, ...Timesheet } = req.body;  
    try { 
        const result = await TimeSheetService.getTimesheet(Timesheet);
        res.send(result);
    }   
    catch (error) {
        res.status
    }

};
module.exports = {
    getTimesheet, 
};

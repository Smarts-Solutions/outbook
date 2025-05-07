const timeSheetService = require('../../services/timeSheet/timeSheetService');

const getTimesheet = async (req, res) => {
  try {
     const { ...Timesheet } = req.body;
    
       const result = await timeSheetService.getTimesheet(Timesheet);
       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data , filterDataWeek : result.filterDataWeek});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}


const getTimesheetTaskType = async (req, res) => {
  try {
     const { ...Timesheet } = req.body;
    
       const result = await timeSheetService.getTimesheetTaskType(Timesheet);

       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const saveTimesheet = async (req,res) => {
  try {
    const { ...Timesheet } = req.body;
    const result = await timeSheetService.saveTimesheet(Timesheet);
    if(!result.status){
      return  res.status(200).json({ status: false, message: result.message });  
      }else{
      return  res.status(200).json({ status: true, message: result.message , data : result.data});
      }
  } catch (error) {
    res.status(500).json({ status:false, message: error.message});
  }
}

const getStaffHourMinute = async (req, res) => {
  try {
     const { ...Timesheet } = req.body;
    
       const result = await timeSheetService.getStaffHourMinute(Timesheet);

       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}





module.exports = {
  getTimesheet,
  getTimesheetTaskType,
  saveTimesheet,
  getStaffHourMinute
};
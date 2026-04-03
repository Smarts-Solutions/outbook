const limit = require("../../utils/limiter");
const timeSheetService = require('../../services/timeSheet/timeSheetService');

 const timesheetQueue = require("../../queues/timesheet.queue");

const getTimesheet = async (req, res) => {
  try {
     const { ...Timesheet } = req.body;
    
       const result = await timeSheetService.getTimesheet(Timesheet);
       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data , filterDataWeek : result.filterDataWeek , filterDataWeekSubmitTimeSheet : result.filterDataWeekSubmitTimeSheet });
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

const saveTimesheet1 = async (req,res) => {
  try {
    const { ...Timesheet } = req.body;

    const result = await limit(() =>
        timeSheetService.saveTimesheet(req.body)
    );

    //const result = await timeSheetService.saveTimesheet(Timesheet);

    if(!result.status){
      return  res.status(200).json({ status: false, message: result.message });  
      }else{
      return  res.status(200).json({ status: true, message: result.message , data : result.data});
      }
  } catch (error) {
    res.status(500).json({ status:false, message: error.message});
  }
}

const saveTimesheet = async (req, res) => {

  let isResponseSent = false;

  try {

    // 10 sec timeout
    const timeout = setTimeout(async () => {

      if (!isResponseSent) {

        isResponseSent = true;

        // queue me add karo
        await timesheetQueue.add(req.body);

        return res.status(200).json({
          status: true,
          queued: true,
          message: "Your request is taking longer. Request queued, please try after sometime"
        });

      }

    }, 10000);


    // main processing
    const result = await limit(() =>
      timeSheetService.saveTimesheet(req.body)
    );


  
    if (!isResponseSent) {
      //console.log("Processing completed before timeout");

      clearTimeout(timeout);

      isResponseSent = true;

      if (!result.status) {
        return res.status(200).json({
          status: false,
          message: result.message
        });
      }

      return res.status(200).json({
        status: true,
        message: result.message,
        data: result.data
      });

    }

  } catch (error) {

    if (!isResponseSent) {

      return res.status(500).json({
        status: false,
        message: error.message
      });

    }

  }

};

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
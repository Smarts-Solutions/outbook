const jobService = require('../../services/job/jobService');

// job ....
const getAddJobData = async (req, res) => {
  try {
     const { ...job } = req.body;

       const result = await jobService.getAddJobData(job);
       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const jobAdd = async (req, res) => {
  try {
     const { ...job } = req.body;
     
       const result = await jobService.jobAdd(job);
       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const jobAction = async (req, res) => {
  try {
     const { ...job } = req.body;
  
       const result = await jobService.jobAction(job);
       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const jobUpdate = async (req, res) => {
  try {
     const { ...job } = req.body;
  
       const result = await jobService.jobUpdate(job);
       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}


// task TimeSheet  Work .....
const getTaskTimeSheet = async (req, res) => {
  try {
     const { ...timeSheet } = req.body;
  
       const result = await jobService.getTaskTimeSheet(timeSheet);
       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const jobTimeSheet = async (req,res) => {
  try {
    const { ...timeSheet } = req.body;
    const result = await jobService.jobTimeSheet(timeSheet);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}


const addMissingLog = async (req,res) => {
  try {
    const { ...missingLog } = req.body;
    const result = await jobService.addMissingLog(missingLog);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

const getMissingLog =async(req,res)=>{
  try {
    const { ...missingLog } = req.body;
    const result = await jobService.getMissingLog(missingLog);
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
  getAddJobData,
  jobAdd,
  jobAction,
  jobUpdate,
  getTaskTimeSheet,
  jobTimeSheet,
  addMissingLog,
  getMissingLog
};
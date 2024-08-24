const jobService = require('../../services/job/jobService');


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







module.exports = {
  getAddJobData,
  jobAdd,
  jobAction,
  jobUpdate
};
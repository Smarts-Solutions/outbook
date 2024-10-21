const reportService = require('../../services/report/reportService');

const jobStatusReports = async (req, res) => {
  try {
     const { ...Report } = req.body;
       const result = await reportService.jobStatusReports(Report);

       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const jobSummaryReports = async (req ,res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.jobSummaryReports(Report);
    if(!result.status){
      return  res.status(200).json({ status: false, message: result.message });  
      }else{
      return  res.status(200).json({ status: true, message: result.message , data : result.data});
      }
  } catch (error) {
    res.status(500).json({ status:false, message: error.message});
  }
}

const jobPendingReports = async (req, res) =>{
  try {
    const { ...Report } = req.body;
    const result = await reportService.jobPendingReports(Report);
    if(!result.status){
      return  res.status(200).json({ status: false, message: result.message });  
      }else{
      return  res.status(200).json({ status: true, message: result.message , data : result.data});
      }
  } catch (error) {
    res.status(500).json({ status:false, message: error.message});
  }
}

const teamMonthlyReports = async (req ,res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.teamMonthlyReports(Report);
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
  jobStatusReports,
  jobSummaryReports,
  jobPendingReports,
  teamMonthlyReports
};
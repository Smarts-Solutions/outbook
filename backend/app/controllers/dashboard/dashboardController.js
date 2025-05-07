const dashboardService = require('../../services/dashboard/dashboardService');


const getDashboardData = async (req, res) => {
  try {
     const { ...dashboard } = req.body;
    
       const result = await dashboardService.getDashboardData(dashboard);

       if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const getDashboardActivityLog = async (req , res)=>{
  try {
    const { ...dashboard } = req.body;
    const result = await dashboardService.getDashboardActivityLog(dashboard);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

const getCountLinkData = async (req, res) => {
    try {
       const { ...dashboard } = req.body;
      
         const result = await dashboardService.getCountLinkData(dashboard);
  
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
  getDashboardData,
  getDashboardActivityLog,
  getCountLinkData
};
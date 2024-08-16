const jobTypeTaskService = require('../../services/jobTypeTask/jobTypeTaskService');

  const handleJobType = async (req, res) => {
    const { action, ...JobType } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await jobTypeTaskService.addJobType(JobType);
                res.status(201).json({ status:true, userId: result ,message: 'JobType created successfully' });
                break;
            case 'get':
                result = await jobTypeTaskService.getJobType(JobType);
                res.status(200).json({ status:true, data: result });
                break;   
            case 'delete':
                await jobTypeTaskService.removeJobType(JobType.id);
                res.status(200).json({ status:true,message: 'JobType deleted successfully' });
                break;
            case 'update':
                await jobTypeTaskService.modifyJobType(JobType);
                res.status(200).json({ status:true, message: 'JobType updated successfully' });
                break;
            default:
                res.status(200).json({ status:false, message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({status:false, message: error.message });
    }
  };

  const addTask = async (req, res) => {
    try {
       const { ...task } = req.body;
      //  console.log("job",job)
         const result = await jobTypeTaskService.addTask(task);
         if(!result.status){
          return  res.status(200).json({ status: false, message: result.message });  
          }else{
          return  res.status(200).json({ status: true, message: result.message , data : result.data});
          }
      
      } catch (error) {
        res.status(500).json({ status:false, message: error.message});
      }
  }

  const getTask = async (req, res) => {
    try {
       const { ...task } = req.body;
      //  console.log("job",job)
         const result = await jobTypeTaskService.getTask(task);
         if(!result.status){
          return  res.status(200).json({ status: false, message: result.message });  
          }else{
          return  res.status(200).json({ status: true, message: result.message , data : result.data});
          }
      
      } catch (error) {
        res.status(500).json({ status:false, message: error.message});
      }
  }

  const addChecklist = async (req, res) => {
    try {
       const { ...checklist } = req.body;
      
         const result = await jobTypeTaskService.addChecklist(checklist);
         if(!result.status){
          return  res.status(200).json({ status: false, message: result.message });  
          }else{
          return  res.status(200).json({ status: true, message: result.message , data : result.data});
          }
      
      } catch (error) {
        res.status(500).json({ status:false, message: error.message});
      }
  }

  const checklistAction = async (req, res) => {
    try {
       const { ...checklist } = req.body;
  
         const result = await jobTypeTaskService.checklistAction(checklist);
         if(!result.status){
          return  res.status(200).json({ status: false, message: result.message });  
          }else{
          return  res.status(200).json({ status: true, message: result.message , data : result.data});
          }
      
      } catch (error) {
        res.status(500).json({ status:false, message: error.message});
      }
  }

  const updateChecklist = async (req, res) => {
    try {
       const { ...checklist } = req.body;
      
         const result = await jobTypeTaskService.updateChecklist(checklist);
         if(!result.status){
          return  res.status(200).json({ status: false, message: result.message });  
          }else{
          return  res.status(200).json({ status: true, message: result.message , data : result.data});
          }
      
      } catch (error) {
        res.status(500).json({ status:false, message: error.message});
      }
  }

  const customerGetService = async (req, res) => {
    try {
       const { ...task } = req.body;
      //  console.log("job",job)
         const result = await jobTypeTaskService.customerGetService(task);
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
  handleJobType,
  addTask,
  getTask,
  addChecklist,
  checklistAction,
  updateChecklist,
  customerGetService
};
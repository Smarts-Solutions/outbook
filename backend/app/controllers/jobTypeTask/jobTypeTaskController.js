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
              result = await jobTypeTaskService.getJobType();
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
              res.status(400).json({ status:false, message: 'Invalid action' });
      }
  } catch (error) {
      res.status(500).json({status:false, message: error.message });
  }
};


module.exports = {
  handleJobType,
};
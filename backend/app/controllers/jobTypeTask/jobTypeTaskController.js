const jobTypeTaskService = require("../../services/jobTypeTask/jobTypeTaskService");
const path = require('path');
const fs = require('fs');

const handleJobType = async (req, res) => {
  const { action, ...JobType } = req.body;

  try {
    let result;
    switch (action) {
      case "add":
        result = await jobTypeTaskService.addJobType(JobType);
        if(!result.status){
          res.status(200).json({ status: false, message: result.message });
          break;
       }else{
          res.status(200).json({ status: true, message: result.message , userId: result.data});
          break;
       }
    
      case "get":
        result = await jobTypeTaskService.getJobType(JobType);
        res.status(200).json({ status: true, data: result });
        break;
      case "delete":
        result = await jobTypeTaskService.removeJobType(JobType);
        if(!result.status){
          res.status(200).json({ status: false, message: result.message , key : result.key});
          break;
       }else{
          res.status(200).json({ status: true, message: result.message , key : result.key});
          break;
       }

      case "update":
        result = await jobTypeTaskService.modifyJobType(JobType);
        if(!result.status){
          res.status(200).json({ status: false, message: result.message });
          break;
      }else{
          res.status(200).json({ status: true, message: result.message , userId: result.data});
          break;
      }
      default:
        res.status(200).json({ status: false, message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const { ...task } = req.body;

    const result = await jobTypeTaskService.addTask(task);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res
        .status(200)
        .json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getTask = async (req, res) => {

  try {
    const { ...task } = req.body;

    const result = await jobTypeTaskService.getTask(task);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res
        .status(200)
        .json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

 

const addChecklist = async (req, res) => {
  try {
    const { ...checklist } = req.body;
    const file = req.file;

    const result = await jobTypeTaskService.addChecklist(checklist, file);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res
        .status(200)
        .json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const checklistAction = async (req, res) => {
  try {
    const { ...checklist } = req.body;

    const result = await jobTypeTaskService.checklistAction(checklist);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res
        .status(200)
        .json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const updateChecklist = async (req, res) => {
  try {
    const { ...checklist } = req.body;

    const result = await jobTypeTaskService.updateChecklist(checklist);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res
        .status(200)
        .json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const customerGetService = async (req, res) => {
  try {
    const { ...task } = req.body;

    const result = await jobTypeTaskService.customerGetService(task);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res
        .status(200)
        .json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getChecklistFile = async (req, res) => {
  const { checklist_id } = req.params;
  try {
    const filename = await jobTypeTaskService.getFilenameById(checklist_id);
    if (!filename) {
      return res.status(404).json({ status: false, message: 'Checklist record not found' });
    }

    const filePath = path.join(__dirname, '../../../checklist_excel', filename);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          if (!res.headersSent) {
            res.status(500).send('Error downloading file');
          }
        }
      });
    } else {
      res.status(404).json({ status: false, message: 'File not found on server' });
    }
  } catch (error) {
    console.error('Error in getChecklistFile:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

module.exports = {
  handleJobType,
  addTask,
  getTask,
  addChecklist,
  checklistAction,
  updateChecklist,
  customerGetService,
  getChecklistFile,
};

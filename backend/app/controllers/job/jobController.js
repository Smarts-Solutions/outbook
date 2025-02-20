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

const updateJobStatus = async (req,res) =>{
  try {
    const { ...job } = req.body;
 
      const result = await jobService.updateJobStatus(job);
      if(!result.status){
       return  res.status(200).json({ status: false, message: result.message , data : result.data});  
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


//MissingLog
const addMissingLog = async (req,res) => {
  try {
    const { ...missingLog } = req;
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
const editMissingLog = async(req,res) =>{
  try {
    const { ...missingLog } = req;
 
    const result = await jobService.editMissingLog(missingLog);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

const uploadDocumentMissingLogAndQuery = async (req,res) => {
  try {
    const { ...missingLog } = req;
    const result = await jobService.uploadDocumentMissingLogAndQuery(missingLog);
    if(!result.status){
      return  res.status(200).json({ status: false, message: result.message });  
      }
      else{
      return  res.status(200).json({ status: true, message: result.message , data : result.data});
      }
  }
  catch (error) {
    res.status(500).json({ status:false, message: error.message});
  }
}

//Queries

const addQuerie = async (req,res) =>{
  try {
    const { ...query } = req;
    const result = await jobService.addQuerie(query);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

const getQuerie = async (req,res) => {
  try {
    const { ...query } = req.body;
    const result = await jobService.getQuerie(query);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

const editQuerie = async(req,res) => {
  try {
    const { ...query } = req;
    const result = await jobService.editQuerie(query);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

//Draft
const getDraft = async (req,res) => {
  try {
    const { ...draft } = req.body;
    const result = await jobService.getDraft(draft);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

const addDraft = async (req,res) => {
  try {
    const { ...draft } = req.body;
    const result = await jobService.addDraft(draft);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message , data: result.data});  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

const editDraft = async (req,res) => {
  try {
    const { ...draft } = req;
    const result = await jobService.editDraft(draft);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message , data: result.data});  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

// JobDocument
const jobDocumentAction = async (req,res) => {
  try {
    const { ...document } = req.body;
    const result = await jobService.jobDocumentAction(document);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

const addJobDocument = async (req,res) => {
  try {
    const { ...document } = req;
    const result = await jobService.addJobDocument(document);
    if(!result.status){
     return  res.status(200).json({ status: false, message: result.message });  
     }else{
     return  res.status(200).json({ status: true, message: result.message , data : result.data});
     }
 } catch (error) {
   res.status(500).json({ status:false, message: error.message});
 }
}

// JobTimeLine
const getJobTimeLine = async (req, res) => {

  try {
    const { ...job } = req.body;

      const result = await jobService.getJobTimeLine(job);
      if(!result.status){
       return  res.status(200).json({ status: false, message: result.message });  
       }else{
       return  res.status(200).json({ status: true, message: result.message , data : result.data});
       }
   
   } catch (error) {
     res.status(500).json({ status:false, message: error.message});
   }}


module.exports = {
  getAddJobData,
  jobAdd,
  jobAction,
  jobUpdate,
  updateJobStatus,
  getTaskTimeSheet,
  jobTimeSheet,
  addMissingLog,
  getMissingLog,
  editMissingLog,
  getQuerie,
  addQuerie,
  editQuerie,
  getDraft,
  addDraft,
  jobDocumentAction,
  addJobDocument,
  editDraft,
  getJobTimeLine,
  uploadDocumentMissingLogAndQuery
};
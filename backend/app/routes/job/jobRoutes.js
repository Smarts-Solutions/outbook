const express = require('express');
const jobController = require('../../controllers/job/jobController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();
// Job..
router.post('/getAddJobData',verifyToken, jobController.getAddJobData);
router.post('/jobAdd',verifyToken, jobController.jobAdd);
router.post('/jobAction',verifyToken, jobController.jobAction);
router.post('/jobUpdate',verifyToken, jobController.jobUpdate);
router.post('/updateJobStatus',verifyToken, jobController.updateJobStatus);

// JobTimeLine
router.post('/getJobTimeLine',verifyToken, jobController.getJobTimeLine);

// TaskTime Sheet
router.post('/getTaskTimeSheet',verifyToken, jobController.getTaskTimeSheet);
router.post('/jobTimeSheet',verifyToken, jobController.jobTimeSheet);

//MissingLog
router.post('/addMissingLog',verifyToken , uploadMultiple , jobController.addMissingLog);
router.post('/getMissingLog',verifyToken, jobController.getMissingLog);
router.post('/editMissingLog',verifyToken , uploadMultiple , jobController.editMissingLog);
router.post('/uploadDocumentMissingLogAndQuery',verifyToken , uploadMultiple , jobController.uploadDocumentMissingLogAndQuery);



//Queries
router.post('/getQuerie',verifyToken, jobController.getQuerie);
router.post('/addQuerie',verifyToken , uploadMultiple , jobController.addQuerie);
router.post('/editQuerie',verifyToken , uploadMultiple , jobController.editQuerie);

//Draft
router.post('/getDraft',verifyToken, jobController.getDraft);
router.post('/addDraft',verifyToken, jobController.addDraft);
router.post('/editDraft',verifyToken, jobController.editDraft);

// JobDocument
router.post('/jobDocumentAction',verifyToken, jobController.jobDocumentAction);
router.post('/addJobDocument',verifyToken , uploadMultiple , jobController.addJobDocument);





module.exports = router;
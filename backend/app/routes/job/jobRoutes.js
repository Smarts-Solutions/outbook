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

// TaskTime Sheet
router.post('/getTaskTimeSheet',verifyToken, jobController.getTaskTimeSheet);
router.post('/jobTimeSheet',verifyToken, jobController.jobTimeSheet);

//MissingLog
router.post('/addMissingLog',verifyToken, jobController.addMissingLog);
router.post('/getMissingLog',verifyToken, jobController.getMissingLog);

//Queries
// router.post('/getQuerie',verifyToken, jobController.getQuerie);





module.exports = router;
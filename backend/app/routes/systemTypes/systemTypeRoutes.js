const express = require('express');
const statusTypeController = require('../../controllers/systemTypes/statusTypeController');
const jobTypeController = require('../../controllers/systemTypes/jobTypeController');
const clientIndustryController = require('../../controllers/systemTypes/clientIndustryController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();
// Status Type
router.post('/statusType',verifyToken, statusTypeController.handleStatusType);

// Job Type
router.post('/jobType',verifyToken, jobTypeController.handleJobType);

//Client Industry
router.post('/clientIndustry',verifyToken, clientIndustryController.handleClientIndustry);

module.exports = router;
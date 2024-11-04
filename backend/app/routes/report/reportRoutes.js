const express = require('express');
const reportController = require('../../controllers/report/reportController');
const { verifyToken } = require('../../middlewares/authMiddleware');


const router = express.Router();

router.post('/jobStatusReports',verifyToken, reportController.jobStatusReports);
router.post('/JobReceivedSentReports',verifyToken, reportController.JobReceivedSentReports);
router.post('/jobSummaryReports',verifyToken, reportController.jobSummaryReports);
router.post('/jobPendingReports',verifyToken, reportController.jobPendingReports);
router.post('/teamMonthlyReports',verifyToken, reportController.teamMonthlyReports);


module.exports = router;
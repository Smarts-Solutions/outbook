const express = require('express');
const reportController = require('../../controllers/report/reportController');
const { verifyToken } = require('../../middlewares/authMiddleware');


const router = express.Router();

router.post('/jobStatusReports',verifyToken, reportController.jobStatusReports);
router.post('/jobReceivedSentReports',verifyToken, reportController.jobReceivedSentReports);
router.post('/jobSummaryReports',verifyToken, reportController.jobSummaryReports);
router.post('/jobPendingReports',verifyToken, reportController.jobPendingReports);
router.post('/teamMonthlyReports',verifyToken, reportController.teamMonthlyReports);
router.post('/dueByReport',verifyToken, reportController.dueByReport);
router.post('/reportCountJob',verifyToken, reportController.reportCountJob);


module.exports = router;
const express = require('express');
const customerReportController = require('../../controllers/customerReport/customerReportController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/customer/jobStatusReports', verifyToken, customerReportController.jobStatusReports);
router.post('/customer/jobReceivedSentReports', verifyToken, customerReportController.jobReceivedSentReports);
router.post('/customer/jobSummaryReports', verifyToken, customerReportController.jobSummaryReports);
router.post('/customer/jobPendingReports', verifyToken, customerReportController.jobPendingReports);
router.post('/customer/dueByReport', verifyToken, customerReportController.dueByReport);
router.post('/customer/teamMonthlyReports', verifyToken, customerReportController.teamMonthlyReports);
router.post('/customer/taxWeeklyStatusReport', verifyToken, customerReportController.taxWeeklyStatusReport);
router.post('/customer/averageTatReport', verifyToken, customerReportController.averageTatReport);
router.post('/customer/reportCountJob', verifyToken, customerReportController.reportCountJob);
router.post('/customer/missingTimesheetReport', verifyToken, customerReportController.missingTimesheetReport);
router.post('/customer/discrepancyReport', verifyToken, customerReportController.discrepancyReport);

module.exports = router;

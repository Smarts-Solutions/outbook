const express = require('express');
const timeSheetController = require('../../controllers/timeSheet/timeSheetController');
const { verifyToken } = require('../../middlewares/authMiddleware');
// const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

router.post('/getTimesheet',verifyToken, timeSheetController.getTimesheet);
router.post('/getTimesheetTaskType',verifyToken, timeSheetController.getTimesheetTaskType);
router.post('/saveTimesheet',verifyToken, timeSheetController.saveTimesheet);
router.post('/getStaffHourMinute',verifyToken, timeSheetController.getStaffHourMinute);
router.post('/getTimesheetLogs',verifyToken, timeSheetController.getTimesheetLogs);
router.post('/deleteTimesheetRow',verifyToken, timeSheetController.deleteTimesheetRow);
router.post('/getmanagerreviewcount',verifyToken, timeSheetController.getManagerReviewCount);
router.post('/getManagerReviewData',verifyToken, timeSheetController.getManagerReviewData);
router.post('/logTimesheetActivity',verifyToken, timeSheetController.logTimesheetActivity);

module.exports = router;
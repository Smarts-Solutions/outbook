const express = require('express');
const timeSheetController = require('../../controllers/timeSheet/timeSheetController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

router.post('/getTimesheet',verifyToken, timeSheetController.getTimesheet);
router.post('/getTimesheetTaskType',verifyToken, timeSheetController.getTimesheetTaskType);
router.post('/saveTimesheet',verifyToken, timeSheetController.saveTimesheet);
router.post('/getStaffHourMinute',verifyToken, timeSheetController.getStaffHourMinute);

module.exports = router;
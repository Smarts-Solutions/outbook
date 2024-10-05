const express = require('express');
const timeSheetController = require('../../controllers/timeSheet/timeSheetController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

router.post('/getTimesheetTaskType',verifyToken, timeSheetController.getTimesheetTaskType);

module.exports = router;
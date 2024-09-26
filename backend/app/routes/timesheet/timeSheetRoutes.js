const express = require('express'); 
const { verifyToken } = require('../../middlewares/authMiddleware');
const timeSheetController = require('../../controllers/timesheet/timeSheetController');

const router = express.Router();
router.post('/getTimesheet', verifyToken, timeSheetController.getTimesheet);

module.exports = router;
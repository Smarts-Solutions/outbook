const express = require('express');
const jobTypeTaskController = require('../../controllers/jobTypeTask/jobTypeTaskController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/jobType',verifyToken, jobTypeTaskController.handleJobType);
router.post('/addTask',verifyToken, jobTypeTaskController.addTask);
router.post('/getTask',verifyToken, jobTypeTaskController.getTask);

module.exports = router;
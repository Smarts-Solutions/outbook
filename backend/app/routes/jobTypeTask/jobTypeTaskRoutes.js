const express = require('express');
const jobTypeTaskController = require('../../controllers/jobTypeTask/jobTypeTaskController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/jobType',verifyToken, jobTypeTaskController.handleJobType);

module.exports = router;
const express = require('express');
const jobController = require('../../controllers/job/jobController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

router.post('/getAddJobData',verifyToken, jobController.getAddJobData);
router.post('/jobAdd',verifyToken, jobController.jobAdd);




module.exports = router;
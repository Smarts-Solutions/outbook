const express = require('express');
const dashboardController = require('../../controllers/dashboard/dashboardController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

router.post('/getDashboardData',verifyToken, dashboardController.getDashboardData);
router.post('/getDashboardActivityLog',verifyToken, dashboardController.getDashboardActivityLog);
router.post('/getCountLinkData',verifyToken, dashboardController.getCountLinkData);



module.exports = router;
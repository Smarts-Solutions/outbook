const express = require('express');
const serviceController = require('../../controllers/services/serviceController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/service',verifyToken, serviceController.handleServices);

module.exports = router;
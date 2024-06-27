const express = require('express');
const authController = require('../../controllers/auth/authController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/loginAuthToken', authController.loginAuthToken);
router.post('/staff',verifyToken, authController.handleStaff);


module.exports = router;
const express = require('express');
const authController = require('../../controllers/auth/authController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);
router.post('/loginWithAzure', authController.loginWithAzure);
router.post('/loginAuthToken', authController.loginAuthToken);
router.post('/isLoginAuthTokenCheck', authController.isLoginAuthTokenCheck);
router.post('/staff',verifyToken, authController.handleStaff);
router.post('/staffCompetency',verifyToken, authController.staffCompetency);
router.post('/profile',verifyToken, authController.profile);


module.exports = router;
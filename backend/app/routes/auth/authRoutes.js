const express = require('express');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router.post('/staff', authController.handleStaff);
router.post('/login', authController.login);


module.exports = router;
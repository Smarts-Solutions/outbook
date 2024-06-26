const express = require('express');
const authController = require('../../controllers/auth/authController');

const router = express.Router();

router.post('/addStaff', authController.addStaff);
router.post('/login', authController.login);


module.exports = router;
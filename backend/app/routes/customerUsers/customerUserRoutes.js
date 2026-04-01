const express = require('express');
const customerController = require('../../controllers/customers/customerController');
const customerAuthController = require('../../controllers/customerUsers/customerAuthController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

// Customer Users Routes Start
router.post('/customer/login', customerAuthController.customerLogin);
// Customer Users Routes End


module.exports = router;
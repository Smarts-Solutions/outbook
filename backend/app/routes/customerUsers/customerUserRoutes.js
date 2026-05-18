const express = require('express');
const customerController = require('../../controllers/customers/customerController');
const customerAuthController = require('../../controllers/customerUsers/customerAuthController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

// Customer Users Routes Start
router.post('/customer/login', customerAuthController.customerLogin);
router.post('/customer/logout', verifyToken, customerAuthController.customerLogout);
router.post('/customer/update-password', customerAuthController.customerUpdatePassword);
router.get('/customer/assigned-customers', verifyToken, customerAuthController.getAssignedCustomers);
router.get('/customer/assigned-clients', verifyToken, customerAuthController.getAssignedClients);
router.get('/customer/assigned-jobs', verifyToken, customerAuthController.getAssignedJobs);
// Customer Users Routes End


module.exports = router;
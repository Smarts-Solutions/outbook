const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { verifyToken } = require('../../middlewares/authMiddleware');

// Customer APIs
router.get('/getActiveCustomers', verifyToken, billingController.getActiveCustomers);
router.post('/getActiveCustomers', verifyToken, billingController.getActiveCustomers);

// Client APIs (customer_id, client_id, staff_created_id, trading_name)
router.get('/getActiveClients', verifyToken, billingController.getActiveClients);
router.post('/getActiveClients', verifyToken, billingController.getActiveClients);

module.exports = router;

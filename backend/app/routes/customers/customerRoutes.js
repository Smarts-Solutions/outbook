const express = require('express');
const customerController = require('../../controllers/customers/customerController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/addCustomer',verifyToken, customerController.addCustomer);


module.exports = router;
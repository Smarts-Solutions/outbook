const express = require('express');
const customerController = require('../../controllers/customers/customerController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

router.post('/addCustomer',verifyToken, customerController.addCustomer);
router.post('/customerAction',verifyToken, customerController.customerAction);
router.post('/updateProcessCustomer',verifyToken, customerController.updateProcessCustomer);
router.post('/updateProcessCustomerFile',verifyToken, uploadMultiple, customerController.updateProcessCustomerFile);
router.post('/updateProcessCustomerFileAction',verifyToken, customerController.updateProcessCustomerFileAction);


module.exports = router;
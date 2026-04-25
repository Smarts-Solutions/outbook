const express = require('express');
const customerController = require('../../controllers/customers/customerController');
const customerUsersController = require('../../controllers/customers/customerUsersController');
const customerDashboardController = require('../../controllers/customers/customerDashboardController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

router.post('/addCustomer',verifyToken, customerController.addCustomer);
router.post('/customerAction',verifyToken, customerController.customerAction);
router.post('/getSingleCustomer',verifyToken, customerController.getSingleCustomer);
router.post('/updateProcessCustomer',verifyToken, customerController.updateProcessCustomer);
router.post('/updateProcessCustomerFile',verifyToken, uploadMultiple, customerController.updateProcessCustomerFile);
router.post('/updateProcessCustomerFileAction',verifyToken, customerController.updateProcessCustomerFileAction);
router.post('/customerUpdate',verifyToken, customerController.customerUpdate);
router.post('/customerStatusUpdate',verifyToken, customerController.customerStatusUpdate);
router.post('/deleteCustomer',verifyToken, customerController.deleteCustomer);

router.post('/getcustomerschecklist',verifyToken, customerController.getcustomerschecklist);


// Customer Users Routes Start
router.post('/getAllCustomerUsers',verifyToken, customerUsersController.getAllCustomerUsers);
// Customer Users Routes End

// Customer Dashboard Routes Start
router.post('/getCustomerDashboardData', verifyToken, customerDashboardController.getCustomerDashboardData);
router.post('/getCustomerDashboardActivityLog', verifyToken, customerDashboardController.getCustomerDashboardActivityLog);
router.post('/getCustomerCountLinkData', verifyToken, customerDashboardController.getCustomerCountLinkData);
router.post('/getCustomerMasterStatus', verifyToken, customerDashboardController.getCustomerMasterStatus);
router.post('/updateCustomerJobStatus', verifyToken, customerDashboardController.updateCustomerJobStatus);
// Customer Dashboard Routes End


module.exports = router;
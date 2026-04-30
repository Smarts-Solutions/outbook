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
router.post('/getCustomersJobs',verifyToken, customerController.getCustomersJobs);


// Customer Users Routes Start
router.post('/getAllCustomerUsers',verifyToken, customerUsersController.getAllCustomerUsers);
// Customer Users Routes End

// Customer Dashboard Routes Start
router.post('/getCustomerDashboardData', verifyToken, customerDashboardController.getCustomerDashboardData);
router.post('/getCustomerDashboardActivityLog', verifyToken, customerDashboardController.getCustomerDashboardActivityLog);
router.post('/getCustomerCountLinkData', verifyToken, customerDashboardController.getCustomerCountLinkData);
router.post("/getCustomerMasterStatus", verifyToken, customerDashboardController.getCustomerMasterStatus);
router.post("/updateCustomerJobStatus", verifyToken, customerDashboardController.updateCustomerJobStatus);
router.post("/getCustomerDropdown", verifyToken, customerDashboardController.getCustomerDropdown);
router.post("/getCustomerList", verifyToken, customerDashboardController.getCustomerList);
router.post("/getCustomerClients", verifyToken, customerDashboardController.getCustomerClients);
router.post("/getCustomerJobs", verifyToken, customerDashboardController.getCustomerJobs);
router.post("/customerClientAction", verifyToken, customerDashboardController.customerClientAction);
router.post("/customerClientAdd", verifyToken, customerDashboardController.customerClientAdd);
router.post("/customerJobAction", verifyToken, customerDashboardController.customerJobAction);
router.post("/customerJobUpdate", verifyToken, customerDashboardController.customerJobUpdate);
router.post("/customerJobTimeline", verifyToken, customerDashboardController.customerJobTimeline);
router.post("/customerTaskTimesheetAction", verifyToken, customerDashboardController.customerTaskTimesheetAction);
router.post("/customerMissingLogAction", verifyToken, uploadMultiple, customerDashboardController.customerMissingLogAction);
router.post("/customerQueryAction", verifyToken, uploadMultiple, customerDashboardController.customerQueryAction);
router.post("/customerDraftAction", verifyToken, customerDashboardController.customerDraftAction);
router.post("/customerDocumentAction", verifyToken, uploadMultiple, customerDashboardController.customerDocumentAction);

// New Customer Specific Job Management Routes
router.post("/getCustomerAddJobData", verifyToken, customerDashboardController.getCustomerAddJobData);
router.post("/customerJobAdd", verifyToken, customerDashboardController.customerJobAdd);
router.post("/customerChecklistAction", verifyToken, customerDashboardController.customerChecklistAction);
router.post("/customerGetOfficerDetails", verifyToken, customerDashboardController.customerGetOfficerDetails);
router.post("/customerJobType", verifyToken, customerDashboardController.customerJobType);
router.get("/customerDownloadChecklist/:checklist_id", verifyToken, customerDashboardController.customerDownloadChecklist);
// Customer Dashboard Routes End


module.exports = router;
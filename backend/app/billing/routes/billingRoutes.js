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

// Customer Engagement Details API (FTE, Percentage, Adhoc, Customised Pricing)
router.get('/getCustomerEngagementDetails', verifyToken, billingController.getCustomerEngagementDetails);
router.post('/getCustomerEngagementDetails', verifyToken, billingController.getCustomerEngagementDetails);

// Hierarchy APIs: Client -> Job -> Service -> JobType
router.post('/getClientsByCustomer', verifyToken, billingController.getClientsByCustomer);
router.get('/getClientsByCustomer', verifyToken, billingController.getClientsByCustomer);

router.post('/getJobs', verifyToken, billingController.getJobs);
router.get('/getJobs', verifyToken, billingController.getJobs);

router.post('/getServices', verifyToken, billingController.getServices);
router.get('/getServices', verifyToken, billingController.getServices);

router.post('/getJobTypes', verifyToken, billingController.getJobTypes);
router.get('/getJobTypes', verifyToken, billingController.getJobTypes);

router.post('/getServicesByClient', verifyToken, billingController.getServicesByClient);
router.get('/getServicesByClient', verifyToken, billingController.getServicesByClient);

// Submit Billing API (Creates submission + revenue split contributors)
router.post('/submitBilling', verifyToken, billingController.submitBilling);

// Approvals APIs
router.post('/getSubmissionsForApprovals', verifyToken, billingController.getSubmissionsForApprovals);
router.get('/getSubmissionsForApprovals', verifyToken, billingController.getSubmissionsForApprovals);

router.post('/managerApprove', verifyToken, billingController.managerApproveSubmission);
router.post('/managerReturn', verifyToken, billingController.managerReturnSubmission);
router.post('/managerEdit', verifyToken, billingController.managerEditSubmission);

module.exports = router;

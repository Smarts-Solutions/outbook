const express = require('express');
const controllers = require('../../controllers/systemTypes');

const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();
// Status Type
router.post('/statusType',verifyToken, controllers.statusTypeController.handleStatusType);

//Client Industry
router.post('/clientIndustry',verifyToken, controllers.clientIndustryController.handleClientIndustry);

// Country 
router.post('/country',verifyToken, controllers.countryController.handleCountry);

// Customer Contact Person Role
router.post('/customerContactPersonRole',verifyToken, controllers.customerContactPersonRoleController.handleCustomerContactPersonRole);
module.exports = router;
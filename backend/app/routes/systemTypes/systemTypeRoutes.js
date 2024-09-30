const express = require('express');
const controllers = require('../../controllers/systemTypes');

const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();
// Status Type
router.post('/statusType',verifyToken, controllers.statusTypeController.handleStatusType);

// Master Status
router.post('/masterStatus',verifyToken, controllers.statusTypeController.handleMasterStatus);

//Client Industry
router.post('/clientIndustry',verifyToken, controllers.clientIndustryController.handleClientIndustry);

// Country 
router.post('/country',verifyToken, controllers.countryController.handleCountry);

// Customer Contact Person Role
router.post('/customerContactPersonRole',verifyToken, controllers.customerContactPersonRoleController.handleCustomerContactPersonRole);

//incorporation_in
router.post('/incorporation',verifyToken, controllers.IncorporationController.handleIncorporation);

//customerSource
router.post('/customerSource',verifyToken, controllers.customerSourceController.handleCustomerSource);

//customerSubSource
router.post('/customerSubSource',verifyToken, controllers.customerSubSourceController.handleCustomerSubSource);

router.post('/internal',verifyToken, controllers.customerInternal.handleInternal);

module.exports = router;
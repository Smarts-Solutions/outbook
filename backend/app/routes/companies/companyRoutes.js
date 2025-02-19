const express = require('express');
const companyController = require('../../controllers/companies/companyController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/seachCompany',verifyToken, companyController.seachCompany);
router.post('/getCompanyOfficerDetails',verifyToken, companyController.getCompanyOfficerDetails);


module.exports = router;
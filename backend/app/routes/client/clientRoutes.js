const express = require('express');
const clientController = require('../../controllers/client/clientController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const uploadMultiple  = require('../../middlewares/uploadFile');



const router = express.Router();

router.post('/addClient',verifyToken, clientController.addClient);
router.post('/clientAction',verifyToken, clientController.clientAction);



module.exports = router;
const express = require('express');
const systemSettingsController = require('../../controllers/systemSettingsController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/get-system-settings', verifyToken, systemSettingsController.getSettings);
router.post('/update-system-settings', verifyToken, systemSettingsController.updateSettings);

module.exports = router;

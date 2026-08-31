const express = require("express");
const router = express.Router();
const customTimesheetController = require("../../controllers/customTimesheet/customTimesheetController");
const auth = require("../../middlewares/authMiddleware");

router.post("/", auth.verifyToken, customTimesheetController.handleCustomActions);

module.exports = router;

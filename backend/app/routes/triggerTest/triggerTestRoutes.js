const express = require("express");
const router = express.Router();
const { handleTriggerTest, handleGetReportList } = require("./triggerTestController");
const { verifyToken } = require("../../middlewares/authMiddleware");

router.post("/send", verifyToken, handleTriggerTest);
router.get("/list", verifyToken, handleGetReportList);

module.exports = router;

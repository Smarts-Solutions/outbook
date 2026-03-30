const express = require('express');
const jobTypeTaskController = require('../../controllers/jobTypeTask/jobTypeTaskController');
const { verifyToken } = require('../../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure checklist_excel directory exists
const checklistDir = path.join(__dirname, '../../../checklist_excel');
if (!fs.existsSync(checklistDir)) {
  fs.mkdirSync(checklistDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, checklistDir);
  },
  filename: (req, file, cb) => {
    cb(null, `temp_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.post('/jobType', verifyToken, jobTypeTaskController.handleJobType);
router.post('/addTask', verifyToken, jobTypeTaskController.addTask);
router.post('/getTask', verifyToken, jobTypeTaskController.getTask);
router.post('/addChecklist', verifyToken, upload.single('checklist_excel'), jobTypeTaskController.addChecklist);
router.post('/checklistAction', verifyToken, jobTypeTaskController.checklistAction);
router.post('/updateChecklist', verifyToken, jobTypeTaskController.updateChecklist);
router.post('/customerGetService', verifyToken, jobTypeTaskController.customerGetService);
router.get('/downloadChecklist/:checklist_id', jobTypeTaskController.getChecklistFile); // Route updated to use ID

module.exports = router;

const express = require('express');
const rolePermissionController = require('../../controllers/rolePermissions/rolePermissionController');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/role',verifyToken, rolePermissionController.handleRole);
router.post('/accessRolePermissions',verifyToken, rolePermissionController.accessRolePermissions);

module.exports = router;
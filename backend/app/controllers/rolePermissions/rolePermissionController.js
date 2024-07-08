const rolePermissionService = require('../../services/rolePermissions/rolePermissionService');

const handleRole = async (req, res) => {
    const { action, ...Role } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await rolePermissionService.addRole(Role);
                res.status(201).json({ status: true, userId: result, message: 'Role created successfully' });
                break;
            case 'get':
                result = await rolePermissionService.getRole();
                res.status(200).json({ status: true, data: result });
                break;
            case 'staffRole':
                result = await rolePermissionService.staffRole();
                res.status(200).json({ status: true, data: result });
                break;
            case 'getById':
                result = await rolePermissionService.getRoleById(Role.id);
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await rolePermissionService.removeRole(Role.id);
                res.status(200).json({ status: true, message: 'Role deleted successfully' });
                break;
            case 'update':
                await rolePermissionService.modifyRole(Role);
                res.status(200).json({ status: true, message: 'Role updated successfully' });
                break;
            default:
                res.status(400).json({ status: false, message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


const accessRolePermissions = async (req, res) => {
    try {
      const data= await rolePermissionService.accessRolePermissions(req.body);
      return res.send({ status:true, data : data , message: "success"});
    } catch (error) {
      return res.send({ status:false, message: error.message});
     
    }
  };


module.exports = {
    handleRole,
    accessRolePermissions
};
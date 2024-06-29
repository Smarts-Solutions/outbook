const customerContactPersonRoleService = require('../../services/systemTypes/customerContactPersonRoleService');

const handleCustomerContactPersonRole = async (req, res) => {
  const { action, ...CustomerContactPersonRole } = req.body;

  try {
      let result;
      switch (action) {
          case 'add':
              result = await customerContactPersonRoleService.addCustomerContactPersonRole(CustomerContactPersonRole);
              res.status(201).json({ status:true, userId: result ,message: 'CustomerContactPersonRole created successfully' });
              break;
          case 'get':
              result = await customerContactPersonRoleService.getCustomerContactPersonRole();
              res.status(200).json({ status:true, data: result });
              break;   
          case 'delete':
              await customerContactPersonRoleService.removeCustomerContactPersonRole(CustomerContactPersonRole.id);
              res.status(200).json({ status:true,message: 'CustomerContactPersonRole deleted successfully' });
              break;
          case 'update':
              await customerContactPersonRoleService.modifyCustomerContactPersonRole(CustomerContactPersonRole);
              res.status(200).json({ status:true, message: 'CustomerContactPersonRole updated successfully' });
              break;
          default:
              res.status(400).json({ status:false, message: 'Invalid action' });
      }
  } catch (error) {
      res.status(500).json({status:false, message: error.message });
  }
};


module.exports = {
  handleCustomerContactPersonRole,
};
const serviceService = require('../../services/services/serviceService');

const handleServices = async (req, res) => {
  const { action, ...Services } = req.body;

  try {
      let result;
      switch (action) {
          case 'add':
              result = await serviceService.addServices(Services);
              res.status(201).json({ status:true, userId: result ,message: 'Services created successfully' });
              break;
          case 'get':
              result = await serviceService.getServices();
              res.status(200).json({ status:true, data: result });
              break;   
          case 'delete':
              await serviceService.removeServices(Services.id);
              res.status(200).json({ status:true,message: 'Services deleted successfully' });
              break;
          case 'update':
              await serviceService.modifyServices(Services);
              res.status(200).json({ status:true, message: 'Services updated successfully' });
              break;
          default:
              res.status(400).json({ status:false, message: 'Invalid action' });
      }
  } catch (error) {
      res.status(500).json({status:false, message: error.message });
  }
};


module.exports = {
  handleServices,
};
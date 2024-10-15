const serviceService = require('../../services/services/serviceService');

const handleServices = async (req, res) => {
  const { action, ...Services } = req.body;

  try {
      let result;
      switch (action) {
          case 'add':
              result = await serviceService.addServices(Services);
              if(!result.status){
                res.status(200).json({ status: false, message: result.message });
                break;
            }else{
                res.status(200).json({ status: true, message: result.message , userId: result.data});
                break;
            }
          case 'get':
              result = await serviceService.getServices();
              res.status(200).json({ status:true, data: result });
              break;
        case 'getAll':
            result = await serviceService.getServicesAll();
            res.status(200).json({ status:true, data: result });
            break;       
          case 'delete':
              await serviceService.removeServices(Services);
              res.status(200).json({ status:true,message: 'Services deleted successfully' });
              break;
          case 'update':
              result = await serviceService.modifyServices(Services);
              if(!result.status){
                res.status(200).json({ status: false, message: result.message });
                break;
            }else{
                res.status(200).json({ status: true, message: result.message , userId: result.data});
                break;
            }
           
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
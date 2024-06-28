const clientIndustryService = require('../../services/systemTypes/clientIndustryService');

const handleClientIndustry = async (req, res) => {
  const { action, ...ClientIndustry } = req.body;

  try {
      let result;
      switch (action) {
          case 'add':
              result = await clientIndustryService.addClientIndustry(ClientIndustry);
              res.status(201).json({ status:true, userId: result ,message: 'ClientIndustry created successfully' });
              break;
          case 'get':
              result = await clientIndustryService.getClientIndustry();
              res.status(200).json({ status:true, data: result });
              break;   
          case 'delete':
              await clientIndustryService.removeClientIndustry(ClientIndustry.id);
              res.status(200).json({ status:true,message: 'ClientIndustry deleted successfully' });
              break;
          case 'update':
              await clientIndustryService.modifyClientIndustry(ClientIndustry);
              res.status(200).json({ status:true, message: 'ClientIndustry updated successfully' });
              break;
          default:
              res.status(400).json({ status:false, message: 'Invalid action' });
      }
  } catch (error) {
      res.status(500).json({status:false, message: error.message });
  }
};


module.exports = {
  handleClientIndustry,
};
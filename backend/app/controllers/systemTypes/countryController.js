const countryService = require('../../services/systemTypes/countryService');

const handleCountry = async (req, res) => {
  const { action, ...Country } = req.body;

  try {
      let result;
      switch (action) {
          case 'add':
              result = await countryService.addCountry(Country);
              res.status(201).json({ status:true, userId: result ,message: 'Country created successfully' });
              break;
          case 'get':
              result = await countryService.getCountry();
              res.status(200).json({ status:true, data: result });
              break;   
          case 'delete':
              await countryService.removeCountry(Country.id);
              res.status(200).json({ status:true,message: 'Country deleted successfully' });
              break;
          case 'update':
              await countryService.modifyCountry(Country);
              res.status(200).json({ status:true, message: 'Country updated successfully' });
              break;
          default:
              res.status(400).json({ status:false, message: 'Invalid action' });
      }
  } catch (error) {
      res.status(500).json({status:false, message: error.message });
  }
};


module.exports = {
  handleCountry,
};
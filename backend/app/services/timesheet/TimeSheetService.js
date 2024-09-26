
const serviceModel = require('../../models/');


const addServices = async (Services) => {
  return serviceModel.createServices(Services);
};



module.exports = {
    addServices,
    
};
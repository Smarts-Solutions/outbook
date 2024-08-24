
const serviceModel = require('../../models/serviceModel');


const addServices = async (Services) => {
  return serviceModel.createServices(Services);
};

const getServices = async () => {
  return serviceModel.getServices();
}

const getServicesAll = async () => {
  return serviceModel.getServicesAll();
}

const removeServices = async (ServicesId) => {
  return serviceModel.deleteServices(ServicesId);
};

const modifyServices = async (Services) => {
  return serviceModel.updateServices(Services);
};


module.exports = {
    addServices,
    removeServices,
    modifyServices,
    getServices,
    getServicesAll
};

const clientIndustryModel = require('../../models/clientIndustryModel');


const addClientIndustry = async (ClientIndustry) => {
  return clientIndustryModel.createClientIndustry(ClientIndustry);
};

const getClientIndustry = async () => {
  return clientIndustryModel.getClientIndustry();
}

const removeClientIndustry = async (ClientIndustryId) => {
  return clientIndustryModel.deleteClientIndustry(ClientIndustryId);
};

const modifyClientIndustry = async (ClientIndustry) => {
  return clientIndustryModel.updateClientIndustry(ClientIndustry);
};


module.exports = {
  addClientIndustry,
  getClientIndustry,
  removeClientIndustry,
  modifyClientIndustry
};

const customerSourceModel = require('../../models/customerSourceModel');


const addCustomerSource = async (CustomerSource) => {
  return customerSourceModel.createCustomerSource(CustomerSource);
};

const getCustomerSource = async () => {
  return customerSourceModel.getCustomerSource();
}

const getCustomerSourceAll = async () => {
  return customerSourceModel.getCustomerSourceAll();
}

const removeCustomerSource = async (CustomerSourceId) => {
  return customerSourceModel.deleteCustomerSource(CustomerSourceId);
};

const modifyCustomerSource = async (CustomerSource) => {
  return customerSourceModel.updateCustomerSource(CustomerSource);
};


module.exports = {
  addCustomerSource,
  getCustomerSource,
  removeCustomerSource,
  modifyCustomerSource,
  getCustomerSourceAll
};